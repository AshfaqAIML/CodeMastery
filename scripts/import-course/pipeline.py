#!/usr/bin/env python3
"""
CodeMastery course import pipeline.

Turns a Word .docx (one clean HTML article per paragraph, as produced by the
course generator) plus any extra part files (missing parts pasted from chat)
into:

  * out/<course>/part-NNN.html     - per-part article HTML (reference boxes stripped)
  * out/<course>/part-NNN.md       - platform markdown
  * out/<course>/meta.json         - metadata for every part
  * out/<course>/tutorials.json    - final tutorial records as seeded (used by check-seed-db.ts)
  * out/<course>/report.txt        - preflight validation report
  * prisma/<course>-seed.ts        - idempotent upsert seed (subject/modules/tutorials/path)

Designed to avoid the failure modes hit during the first manual import:

  * Part numbers come from each article's OWN header/metadata box - never from
    file position or paragraph index (the DOCX omits some parts and they are
    supplied as extra files, so positions do not line up with part numbers).
  * Duplicate part numbers are a hard error (would silently overwrite).
  * Missing parts listed in the guide syllabus are reported (warn only).
  * Metadata (objectives/prereqs/takeaways/assessment/summary) is extracted
    from the SAME article whose HTML is converted - no index arithmetic.
  * Tags accept string or list form (string iteration char-splits tags).
  * Preflight validation: title/h1 alignment, no reference-box markers,
    balanced code fences, JSON fields, unique slugs, unit containment.
  * Seed output escapes backticks / ${ / backslashes for TS template literals.

Usage:
  py scripts/import-course/pipeline.py <book.docx> --config scripts/import-course/courses/<course>.json --extra <dir-with-part-files> [--seed prisma/<course>-seed.ts] [--no-seed]

Requirements: Python 3.10+, lxml (pip install lxml)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path

try:
    from lxml import html as lh
except ImportError:  # pragma: no cover
    sys.exit("ERROR: lxml is required. Install it with: py -m pip install lxml")

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

# ---------------------------------------------------------------- raw helpers

def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def ts_escape(s: str) -> str:
    """Escape a string for use inside a TS template literal."""
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def norm(s: str | None) -> str:
    return " ".join((s or "").split())


# ---------------------------------------------------------------- docx reading

def _q(tag: str) -> str:
    return f"{W}{tag}"


def docx_paragraphs(docx_path: Path) -> list[str]:
    """Return the text of every <w:p> in word/document.xml.

    The course generator embeds whole HTML documents inside paragraphs, so a
    paragraph's text may be a full HTML string. Line breaks inside runs
    (w:br) are preserved as newlines so tags never get glued together.
    """
    with zipfile.ZipFile(docx_path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find(_q("body"))
    if body is None:
        return []
    out = []
    for p in body.iter(_q("p")):
        parts = []
        for el in p.iter():
            tag = el.tag
            if tag == _q("t") or tag == _q("instrText"):
                parts.append(el.text or "")
            elif tag == _q("br"):
                parts.append("\n")
            elif tag == _q("tab"):
                parts.append("    ")
        out.append("".join(parts))
    return out


def parse_fragment(html: str):
    """Parse an HTML fragment that may have multiple roots into one root div."""
    try:
        return lh.fromstring(html)
    except Exception:
        return lh.fromstring(f"<div>{html}</div>")


# ---------------------------------------------------------------- article model

@dataclass
class Article:
    part: int | None          # None => course guide
    title: str
    slug: str
    difficulty: str
    minutes: int
    tags: list[str]
    summary: str
    objectives: list[str]
    prereqs: list[str]
    takeaways: list[str]
    assessment: list[str]
    where_it_fits: str
    html: str                 # full article HTML (header + sections)
    markdown: str = ""
    source: str = ""          # human-readable origin for report/errors
    warnings: list[str] = field(default_factory=list)
    info: list[str] = field(default_factory=list)

    def add_warning(self, msg: str) -> None:
        self.warnings.append(msg)


DIFF_LABELS = {
    "callout-info": "info",
    "callout-tip": "tip",
    "callout-warning": "warning",
    "callout-important": "important",
    "callout-analogy": "analogy",
    "callout-best-practice": "best practice",
    "callout-note": "note",
    "callout-memory": "memory",
}

DROP_SECTIONS = {"learning-overview", "prerequisites", "key-takeaways", "self-assessment", "final-checklist"}

META_KEY_RE = re.compile(
    r"Slug\s*[:=]\s*([a-z0-9-]+)"
    r"|Difficulty\s*[:=]\s*(\w+)"
    r"|Reading\s*Time\s*[:=]\s*(\d+)"
    r"|Estimated\s*Reading\s*Time\s*[:=]\s*(\d+)",
    re.I,
)
TAGS_RE = re.compile(r"Tags\s*[:=]\s*(.+?)(?=\n\s*\n|$\n)", re.I | re.S)
MINUTES_RE = re.compile(r"(\d+)\s*minutes?", re.I)
PART_RE = re.compile(r"Part\s+(\d+)\s+of\s+(\d+)", re.I)


def _section_list(art, cls: str) -> list[str] | None:
    sec = art.xpath(
        f'.//section[contains(concat(" ", normalize-space(@class), " "), " {cls} ")]'
    )
    if not sec:
        return None
    ul = sec[0].find("ul")
    if ul is None:
        return None
    return [norm(x) for x in ul.itertext() if x.strip()]


def _section_para(art, cls: str) -> str | None:
    sec = art.xpath(
        f'.//section[contains(concat(" ", normalize-space(@class), " "), " {cls} ")]'
    )
    if not sec:
        return None
    p = sec[0].find("p")
    return norm(p.text_content()) if p is not None else None


def parse_html_article(html: str, source: str) -> Article | None:
    """Parse one <article class="tutorial"> element into an Article."""
    root = parse_fragment(html)
    arts = root.xpath(".//article")
    if not arts and root.tag == "article":
        arts = [root]
    if not arts:
        return None
    art = arts[0]

    h1s = art.xpath(".//h1")
    title = norm(h1s[0].text_content()) if h1s else ""

    header = art.find("header")
    header_html = lh.tostring(header, encoding="unicode") if header is not None else ""
    header_text = norm(header.text_content()) if header is not None else ""

    # --- part number: ALWAYS from the article itself (never a position) ---
    part = None
    pos = art.xpath('.//span[contains(@class, "tutorial-position")]')
    if pos:
        m = PART_RE.search(pos[0].text_content() or "")
        if m:
            part = int(m.group(1))
    if part is None:  # box text like "Module: Part 21 of 35 - ..."
        m = PART_RE.search(header_text)
        if m:
            part = int(m.group(1))

    # --- difficulty & minutes ---
    difficulty = "beginner"
    diffs = art.xpath('.//span[contains(@class, "difficulty")]')
    if diffs:
        cls = diffs[0].get("class", "")
        if "intermediate" in cls:
            difficulty = "intermediate"
        elif "advanced" in cls:
            difficulty = "advanced"
    m = MINUTES_RE.search(header_text)
    minutes = int(m.group(1)) if m else 25

    # --- slug: metadata box, else derived from title ---
    slug = None
    m = re.search(r"Slug\s*[:=]\s*([a-z0-9-]+)", header_html, re.I)
    if m:
        slug = m.group(1)
    if not slug or slug == slugify(title) == slug:
        pass
    if not slug:
        slug = slugify(title)

    # --- tags (handle both box styles) ---
    tags: list[str] = []
    m = TAGS_RE.search(header_text)
    if m:
        raw = m.group(1)
        raw = re.split(r"\n\s*\n", raw)[0]
        tags = [slugify(t) for t in re.split(r"[,\n]", raw) if t.strip()]
    tags = [t for t in tags if t][:24]

    # --- sections ---
    lo = _section_list(art, "learning-overview") or []
    pr = _section_list(art, "prerequisites") or []
    kt = _section_list(art, "key-takeaways") or []
    sa = _section_list(art, "self-assessment") or _section_list(art, "final-checklist") or []
    cc = _section_para(art, "curriculum-connection") or ""
    summary = ""
    desc = art.xpath('.//p[contains(concat(" ", normalize-space(@class), " "), " tutorial-description ")]')
    if desc:
        summary = norm(desc[0].text_content())
    if not summary:
        summary = _section_para(art, "tutorial-overview") or ""

    a = Article(
        part=part, title=title, slug=slug, difficulty=difficulty, minutes=minutes,
        tags=tags, summary=summary, objectives=lo, prereqs=pr, takeaways=kt,
        assessment=sa, where_it_fits=cc,
        html=lh.tostring(art, encoding="unicode").strip(), source=source,
    )
    a.markdown = convert_article(art)
    return a


def application_slug(a: "Article", subject_slug: str, overrides: dict | None = None) -> str:
    """The slug the tutorial gets in the DB (mirrors generate_seed rules):
    guide -> course-guide; a part whose box slug equals the subject slug is
    re-derived from its title (the guide and Part 1 share the course box).
    Per-part overrides from the config win over every rule."""
    if a.part is None:
        return "course-guide"
    if overrides and str(a.part) in overrides:
        return slugify(overrides[str(a.part)])
    s = a.slug
    if s == subject_slug:
        s = slugify(a.title)
    return slugify(s)


def parse_extra_file(path: Path) -> Article | None:
    """Parse an extra part file (part missing from the DOCX, pasted from chat).

    Two accepted layouts:
      * HTML article (with or without a preceding plain-text metadata box)
      * full chat paste: plain-text CURRICULUM POSITION / TUTORIAL METADATA /
        LEARNING OBJECTIVES boxes followed by an <article> block (and a
        trailing STATUS box which is ignored).
    """
    text = path.read_text(encoding="utf-8", errors="replace")
    idx = text.find("<article")
    box_text = text[:idx] if idx >= 0 else ""
    body_html = text[idx:] if idx >= 0 else text

    a = parse_html_article(body_html, str(path))
    if a is None:
        return None
    if a.part is None:
        m = PART_RE.search(box_text)
        if m:
            a.part = int(m.group(1))
    apply_text_box(a, box_text)
    return a


def apply_text_box(a: Article, box_text: str) -> None:
    """Overlay metadata from the plain-text box that precedes each article
    (DOCX paragraphs and extra files). Article-owned fields win: part and
    objective sections always come from the HTML; the box fills in what the
    HTML lacks (tags, slug, title diff warning, difficulty, minutes)."""
    if not box_text.strip() or "<html" in box_text.lower():
        return
    f = _parse_text_box(box_text)
    if f.get("Slug"):
        a.slug = re.sub(r"[^a-z0-9-]", "", f["Slug"].lower())
    if f.get("Title") and "COURSE METADATA" not in box_text:
        box_title = norm(f["Title"])
        if box_title and box_title != a.title:
            a.info.append(f"box Title is a descriptive variant of h1: {box_title[:60]!r}")
    if f.get("Difficulty"):
        d = f["Difficulty"].lower()
        if "intermediate" in d:
            a.difficulty = "intermediate"
        elif "advanced" in d:
            a.difficulty = "advanced"
    m = MINUTES_RE.search(f.get("Estimated Reading Time", "") + " " + f.get("Reading Time", ""))
    if m:
        a.minutes = int(m.group(1))
    if f.get("Tags"):
        a.tags = [slugify(t) for t in re.split(r"[,\n]", f["Tags"]) if t.strip()][:24]
    if not a.objectives:
        objs = re.findall(r"(?:^|\n)\s*\d+[.)]\s+([^\n]+(?:\n\s+[^\n]+)*)", box_text)
        if objs:
            a.objectives = [norm(o) for o in objs]


def _parse_text_box(text: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if ":" in line and not line.startswith((" ", "\t", "=", "-", "<", "*", ">")):
            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip()
            j = i + 1
            while j < len(lines) and (
                lines[j].startswith((" ", "\t")) or (lines[j].strip() == "" and val == "")
            ):
                if lines[j].strip():
                    val += (" " if val else "") + lines[j].strip()
                j += 1
            if key:
                fields[key] = val
            i = j
        elif re.match(r"^\s*\d+[.)]\s", line):
            i += 1  # numbered objective lines, handled separately
        else:
            i += 1
    return fields


def _slug_present_in_html(slug: str, html: str) -> bool:
    return re.search(rf"Slug\s*[:=]\s*{re.escape(slug)}\b", html, re.I) is not None


# ---------------------------------------------------------------- html -> markdown

def _inline(el) -> str:
    parts = []
    for child in el:
        if child.tag in ("strong", "b"):
            parts.append("**" + _inline(child) + "**")
        elif child.tag in ("em", "i"):
            parts.append("*" + _inline(child) + "*")
        elif child.tag == "code":
            parts.append("`" + (child.text or "") + "`")
        elif child.tag == "mark":
            parts.append("**" + _inline(child) + "**")
        elif child.tag == "kbd":
            parts.append("`" + (child.text or "") + "`")
        elif child.tag == "br":
            parts.append("\n")
        elif child.tag == "span":
            parts.append(_inline(child))
        elif child.tag == "a":
            href = child.get("href", "")
            txt = _inline(child)
            parts.append(f"[{txt}]({href})" if href else txt)
        elif child.tag == "sub":
            parts.append("~" + (child.text or "") + "~")
        elif child.tag == "sup":
            parts.append("^" + (child.text or "") + "^")
        else:
            parts.append(_inline(child))
        if child.tail:
            parts.append(child.tail)
    return (el.text or "") + "".join(parts)


def _esc_cell(s: str) -> str:
    return s.replace("|", "\\|").replace("\n", " ")


def _table_to_md(el) -> str:
    cap = el.find("caption")
    cap_text = norm(_inline(cap)) if cap is not None else ""
    rows: list[str] = []
    for thead in [el.find("thead")] if el.find("thead") is not None else []:
        for tr in thead.findall("tr"):
            cs = [_esc_cell(norm(_inline(c))) for c in (tr.findall("th") + tr.findall("td"))]
            if cs:
                rows.append("| " + " | ".join(cs) + " |")
                rows.append("|" + "|".join(["---"] * len(cs)) + "|")
    tbody = el.find("tbody")
    if tbody is not None:
        for tr in tbody.findall("tr"):
            cs = [_esc_cell(norm(_inline(c))) for c in (tr.findall("td") + tr.findall("th"))]
            if cs:
                rows.append("| " + " | ".join(cs) + " |")
    if not rows:
        for tr in el.findall("tr"):
            cs = [_esc_cell(norm(_inline(c))) for c in (tr.findall("td") + tr.findall("th"))]
            if cs:
                rows.append("| " + " | ".join(cs) + " |")
    out = []
    if cap_text:
        out.append(f"*{cap_text}*")
    out.extend(rows)
    return "\n".join(out)


def _pre_to_md(el) -> str:
    code = el.find("code")
    cls = " ".join(el.get("class", "").split())
    if "ascii-diagram" in cls:
        lang = "text"
    elif code is not None and code.get("class"):
        m = re.search(r"language-([\w+-]+)", code.get("class", ""))
        lang = m.group(1) if m else "text"
    else:
        lang = "text"
    content = (code.text if code is not None else el.text) or ""
    lines = content.split("\n")
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "```" + lang + "\n" + "\n".join(lines) + "\n```"


def _dl_to_md(el) -> str:
    items: list[tuple[str, list[str]]] = []
    cur: tuple | None = None
    for child in el:
        if child.tag == "dt":
            if cur:
                items.append(cur)
            cur = (norm(_inline(child)), [])
        elif child.tag == "dd":
            if cur is None:
                cur = ("", [])
            cur[1].append(norm(_inline(child)))
    if cur:
        items.append(cur)
    return "\n".join(f"- **{t}** — {(' '.join(d))}" for t, d in items)


BLOCK_TAGS = {"h1", "h2", "h3", "h4", "p", "pre", "table", "ul", "ol", "dl",
              "blockquote", "section", "div", "aside", "details"}


def _list_block(li) -> list[str]:
    lines: list[str] = []
    buf: list[str] = []
    nested: list = []

    def flush():
        if buf:
            t = " ".join(x.strip() for x in buf if x.strip())
            if t:
                lines.append(t)
            buf.clear()

    for c in li:
        if c.tag in ("ul", "ol"):
            nested.append(c)
        elif c.tag in ("h3", "h4"):
            buf.append("**" + norm(_inline(c)) + "**")
        elif c.tag == "pre":
            flush()
            lines.append(_pre_to_md(c))
        elif c.tag == "p":
            t = norm(_inline(c))
            if t:
                buf.append(t)
        else:
            t = norm(_inline(c))
            if t:
                buf.append(t)
        if c.tail and c.tail.strip():
            t = norm(c.tail)
            if t:
                buf.append(t)
    if li.text and li.text.strip():
        buf.insert(0, norm(li.text))
    flush()
    for n in nested:
        lines.extend(_block_to_md(n).split("\n"))
    return lines or [""]


def _block_to_md(el) -> str:
    tag = el.tag
    if not isinstance(tag, str):
        return ""
    cls = " ".join(el.get("class", "").split()) if el.get("class") else ""

    if tag == "h1":
        return "# " + norm(_inline(el))
    if tag == "h2":
        return "## " + norm(_inline(el))
    if tag == "h3":
        return "### " + norm(_inline(el))
    if tag == "h4":
        return "#### " + norm(_inline(el))
    if tag == "p":
        return norm(_inline(el))
    if tag == "pre":
        return _pre_to_md(el)
    if tag == "table":
        return _table_to_md(el)
    if tag == "dl":
        return _dl_to_md(el)
    if tag == "blockquote":
        kids = [c for c in el if c.tag in ("p", "ul", "ol", "dl", "pre", "table", "blockquote")]
        if not kids:
            t = norm(_inline(el))
            return "> " + t if t else ""
        inner = "\n\n".join(_block_to_md(c) for c in kids if c.tag != "blockquote")
        return "> " + inner.replace("\n", "\n> ")
    if tag in ("ul", "ol"):
        marker = "- " if tag == "ul" else "1. "
        lines = []
        for li in el.findall("li"):
            inner = _list_block(li)
            lines.append(marker + inner[0])
            for rest in inner[1:]:
                lines.append("  " + rest)
        return "\n".join(lines)
    if tag == "div" and "output-block" in cls:
        pre = el.find("pre")
        title = el.xpath('.//div[contains(@class, "output-title")]')
        t = norm(_inline(title[0])) if title else ""
        code = _pre_to_md(pre) if pre is not None else ""
        code = code.replace("```text", "```output", 1)
        return (f"*{t}*\n{code}") if t else code
    if tag == "div" and "definition" in cls:
        strong = el.find("strong")
        txt = norm(_inline(el))
        if strong is not None:
            term = "**" + norm(_inline(strong)) + "**"
            txt = txt.replace(term, "", 1).strip()
            txt = txt.lstrip(":").strip()
            return f"{term} {txt}"
        return txt
    if tag == "aside" and "callout" in cls:
        label = next((v for c, v in DIFF_LABELS.items() if c in cls), "note")
        block_kids = [c for c in el if c.tag in ("ul", "ol", "dl", "pre", "table")]
        if not block_kids:
            text = " ".join(t for t in (norm(x) for x in el.itertext()) if t)
            return f"> {label}: {text}"
        inner = []
        for c in el:
            if c.tag in ("h2", "h3", "h4", "p", "ul", "ol", "dl", "pre", "table", "div", "aside"):
                inner.append(_block_to_md(c))
            else:
                inner.append(norm(_inline(c)))
            if c.tail and c.tail.strip():
                inner.append(norm(c.tail))
        text = "\n\n".join(x for x in inner if x)
        return "> " + label + ": " + text.replace("\n", "\n> ")
    if tag == "details":
        return lh.tostring(el, encoding="unicode").strip()
    if tag == "section":
        if cls and cls.split()[0] in DROP_SECTIONS:
            return ""
        parts = [_block_to_md(c) for c in el]
        return "\n\n".join(x for x in parts if x)
    if tag == "div":
        parts = [b for c in el if (b := _block_to_md(c))]
        return "\n\n".join(parts)
    return norm(_inline(el))


def convert_article(art) -> str:
    """Convert the article's <article> element to platform markdown.

    Drops: header (breadcrumbs/meta/nav), the four extracted sections
    (learning-overview, prerequisites, key-takeaways, self-assessment),
    and anything in a <nav>. Everything else is kept verbatim.
    """
    out: list[str] = []
    for el in art:
        tag = el.tag
        if not isinstance(tag, str) or tag in ("header", "nav"):
            continue
        if tag == "section":
            cls = " ".join(el.get("class", "").split())
            if cls and cls.split()[0] in DROP_SECTIONS:
                continue
        b = _block_to_md(el)
        if b:
            out.append(b)
    return "\n\n".join(out)


# ---------------------------------------------------------------- units

def derive_units(guide: Article | None, parts: dict[int, Article]) -> list[dict]:
    """Derive module (unit) groupings from the guide's syllabus section, or
    fall back to a single 'course' module if there is no guide/syllabus."""
    if guide is not None:
        root = parse_fragment(guide.html)
        sec = root.xpath('.//section[contains(concat(" ", normalize-space(@class), " "), " syllabus ")]')
        if sec:
            units: list[dict] = []
            cur: dict | None = None
            for el in sec[0].iter():
                if el.tag == "h3":
                    if cur and cur["parts"]:
                        units.append(cur)
                    name = norm(el.text_content())
                    m = re.match(r"Unit\s+([A-Za-z0-9]+)", name)
                    letter = m.group(1).lower() if m else slugify(name)
                    cur = {"slug": f"unit-{letter}", "title": name, "summary": "", "parts": []}
                elif el.tag in ("li",) and cur is not None:
                    txt = " ".join(el.itertext())
                    m = re.search(r"Part\s+(\d+)", txt)
                    if m:
                        cur["parts"].append(int(m.group(1)))
            if cur and cur["parts"]:
                units.append(cur)
            if units:
                for u in units:
                    u["parts"] = [p for p in u["parts"] if p in parts]
                return [u for u in units if u["parts"]]
    return [{"slug": "course", "title": "Course", "summary": "All parts of this course.", "parts": sorted(parts)}]


# ---------------------------------------------------------------- seed generation

JD = lambda x: json.dumps(x, ensure_ascii=False)


def generate_seed(articles: list[Article], units: list[dict], cfg: dict, seed_path: Path) -> tuple[str, dict]:
    """Build the whole seed file. Returns (ts_source, tutorials_json)."""
    course = cfg.get("course", {})
    path_cfg = cfg.get("path", {})
    subject_slug = course.get("slug") or "computer-science-foundations"
    slug_overrides = cfg.get("slugOverrides") or {}

    by_part: dict[int, Article] = {a.part: a for a in articles if a.part is not None}
    guide = next((a for a in articles if a.part is None), None)

    # tutorial slug rules: guide -> course-guide; a part whose box slug equals
    # the subject slug is re-derived from its title; config overrides win.
    def tut_slug(a: Article) -> str:
        return application_slug(a, subject_slug, slug_overrides)

    tutorial_json: list[dict] = []
    order = 0
    entries: list[tuple[str, int | None]] = []
    for u in units:
        for p in sorted(u["parts"]):
            entries.append((u["slug"], p))
    if guide is not None:
        entries.insert(0, ("course-guide", None))

    # part -> tutorial slug map (for prereq cross-links) and order
    order_map: dict[int, int] = {}
    for i, (_, p) in enumerate(entries):
        if p is not None:
            order_map[p] = i
    slug_of: dict[int, str] = {}
    for a in articles:
        slug_of[a.part] = tut_slug(a)

    def rec(a: Article, u_slug: str, u_title: str) -> str:
        nonlocal order
        o = order
        order += 1
        title = course.get("guideTitle") if a.part is None else a.title
        content = f"# {title}\n\n" + a.markdown.lstrip()
        prereqs = []
        for pr in a.prereqs:
            label = norm(pr)
            m = re.match(r"^(?:Part|Tutorial)?\s*(\d+)", label)
            if m:
                n = int(m.group(1))
                if n in slug_of and n != a.part:
                    prereqs.append(f"{{ label: {JD(label)}, subjectSlug: {JD(subject_slug)}, tutorialSlug: {JD(slug_of[n])} }}")
                    continue
            prereqs.append(f"{{ label: {JD(label)} }}")
        tags = ",".join(a.tags) if isinstance(a.tags, list) else str(a.tags or "")
        tags = tags.strip(",")
        where = a.where_it_fits or ""
        ext = {
            "part": a.part,
            "slug": tut_slug(a),
            "title": title,
            "summary": a.summary,
            "difficulty": a.difficulty,
            "minutes": a.minutes,
            "tags": tags,
            "order": o,
            "moduleSlug": u_slug,
            "moduleTitle": u_title,
        }
        tutorial_json.append(ext)
        return f"""    {{
      slug: {JD(tut_slug(a))},
      title: {JD(title)},
      summary: {JD(a.summary)},
      difficulty: {JD(a.difficulty)},
      estimatedMinutes: {a.minutes},
      order: {o},
      tags: {JD(tags)},
      learningObjectives: {JD(a.objectives)},
      prerequisites: [{', '.join(prereqs)}],
      whereItFits: {JD(where)},
      keyTakeaways: {JD(a.takeaways)},
      selfAssessment: {JD(a.assessment)},
      content: `{ts_escape(content)}`,
    }},"""

    # ---- modules ----
    # The course guide lives at the top of the FIRST unit (order 0), unless
    # a unit is explicitly named "course-guide". Mirrors the committed seed.
    guide_unit = "course-guide" if any(u["slug"] == "course-guide" for u in units) else units[0]["slug"]
    module_lines = []
    for ui, u in enumerate(units):
        tuts = []
        if guide is not None and u["slug"] == guide_unit:
            tuts.append(rec(guide, u["slug"], u["title"]))
        for p in sorted(u["parts"]):
            if p in by_part:
                tuts.append(rec(by_part[p], u["slug"], u["title"]))
        module_lines.append(f"""    {{
      slug: {JD(u['slug'])},
      title: {JD(u['title'])},
      summary: {JD(u.get("summary") or f"Parts {'-'.join(map(str, sorted(u['parts'])))} of this course.")},
      order: {ui + 1},
      difficulty: "beginner",
      estimatedMinutes: {30 * len(tuts)},
      tutorials: [
{chr(10).join(tuts)}
      ],
    }},""")

    # ---- learning path steps ----
    step_lines = []
    ordered = [(u, p) for u in units for p in sorted(u["parts"])]
    if guide is not None:
        ordered.insert(0, (None, None))
    for si, (u, p) in enumerate(ordered):
        if p is None:
            a = guide
            step_lines.append(f'  {{ part: {JD(units[0]["title"])}, title: {JD(a.title)}, subtitle: "Part of {units[0]["title"]} · {a.difficulty.capitalize()}", order: {si}, tutorialSlug: "course-guide" }},')
            continue
        a = by_part[p]
        step_lines.append(f'  {{ part: {JD(u["title"])}, title: {JD(a.title)}, subtitle: "Part of {u["title"]} · {a.difficulty.capitalize()}", order: {si}, tutorialSlug: {JD(tut_slug(a))} }},')

    path_slug = path_cfg.get("slug") or slugify(course.get("name") or subject_slug) + "-foundation"
    path_title = path_cfg.get("title") or course.get("name") or "Course Foundation"
    tagline = path_cfg.get("tagline") or f"The complete roadmap for {course.get('name') or subject_slug} - all parts in order."
    desc = path_cfg.get("description") or tagline
    icon = path_cfg.get("icon") or "GraduationCap"
    color = path_cfg.get("color") or "oklch(0.8 0.16 75)"
    hours = int(path_cfg.get("estimatedHours") or 60)

    L: list[str] = []
    A = L.append
    A('import { PrismaClient } from "@prisma/client"')
    A("")
    A("const db = new PrismaClient()")
    A("")
    A("// ============================================================")
    A(f'// {course.get("name") or subject_slug} - imported by scripts/import-course/pipeline.py')
    A("// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.")
    A("// ============================================================")
    A("")
    A("const subject = {")
    A(f'  slug: {JD(subject_slug)},')
    A(f'  name: {JD(course.get("name") or subject_slug)},')
    A(f'  tagline: {JD(course.get("tagline") or "")},')
    A(f'  description: {JD(course.get("description") or "")},')
    A(f'  icon: {JD(course.get("icon") or "Cpu")},')
    A(f'  color: {JD(course.get("color") or "oklch(0.62 0.15 162)")},')
    A(f'  category: {JD(course.get("category") or "Foundations")},')
    A(f'  order: {int(course.get("order") or 2)},')
    A("  modules: [")
    A(chr(10).join(module_lines))
    A("  ],")
    A("}")
    A("")
    A("const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [")
    A(chr(10).join(step_lines))
    A("]")
    A("")
    A("async function main() {")
    A('  const domain = await db.domain.findUnique({ where: { slug: "computer-science" } })')
    A("  const srec = await db.subject.upsert({")
    A("    where: { slug: subject.slug },")
    A("    create: { slug: subject.slug, name: subject.name, tagline: subject.tagline, description: subject.description, icon: subject.icon, color: subject.color, category: subject.category, order: subject.order, published: true, domainId: domain?.id ?? null },")
    A("    update: { name: subject.name, tagline: subject.tagline, description: subject.description, icon: subject.icon, color: subject.color, category: subject.category, order: subject.order, domainId: domain?.id ?? null },")
    A("  })")
    A('  console.log(`  ✓ Subject: ${srec.name}`)')
    A("")
    A("  for (const m of subject.modules) {")
    A("    const mrec = await db.module.upsert({")
    A("      where: { subjectId_slug: { subjectId: srec.id, slug: m.slug } },")
    A("      create: { subjectId: srec.id, slug: m.slug, title: m.title, summary: m.summary, order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes },")
    A("      update: { title: m.title, summary: m.summary, order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes },")
    A("    })")
    A("    for (const t of m.tutorials) {")
    A("      await db.tutorial.upsert({")
    A("        where: { subjectId_slug: { subjectId: srec.id, slug: t.slug } },")
    A("        create: { subjectId: srec.id, moduleId: mrec.id, slug: t.slug, title: t.title, summary: t.summary, content: t.content, difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes, tags: t.tags, order: t.order, published: true, learningObjectives: JSON.stringify(t.learningObjectives), prerequisites: JSON.stringify(t.prerequisites), whereItFits: t.whereItFits, keyTakeaways: JSON.stringify(t.keyTakeaways), selfAssessment: JSON.stringify(t.selfAssessment) },")
    A("        update: { title: t.title, summary: t.summary, content: t.content, difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes, tags: t.tags, order: t.order, moduleId: mrec.id, learningObjectives: JSON.stringify(t.learningObjectives), prerequisites: JSON.stringify(t.prerequisites), whereItFits: t.whereItFits, keyTakeaways: JSON.stringify(t.keyTakeaways), selfAssessment: JSON.stringify(t.selfAssessment) },")
    A("      })")
    A('      console.log(`      ✓ ${t.slug}`)')
    A("    }")
    A("  }")
    A("")
    A("  const path = await db.learningPath.upsert({")
    A(f"    where: {{ slug: {JD(path_slug)} }},")
    A(f"    create: {{ slug: {JD(path_slug)}, title: {JD(path_title)}, tagline: {JD(tagline)}, description: {JD(desc)}, icon: {JD(icon)}, color: {JD(color)}, difficulty: 'beginner', estimatedHours: {hours}, published: true }},")
    A(f"    update: {{ title: {JD(path_title)}, tagline: {JD(tagline)}, description: {JD(desc)}, icon: {JD(icon)}, color: {JD(color)}, difficulty: 'beginner', estimatedHours: {hours} }},")
    A("  })")
    A("  await db.learningPathPart.deleteMany({ where: { pathId: path.id } })")
    A("  await db.learningPathStep.deleteMany({ where: { pathId: path.id } })")
    A('  const partIds: Record<string, string> = {}')
    A("  for (const unit of subject.modules) {")
    A("    const pr = await db.learningPathPart.create({ data: { pathId: path.id, slug: unit.slug, title: unit.title, summary: unit.summary, order: unit.order } })")
    A("    partIds[unit.title] = pr.id")
    A("  }")
    A("  for (const st of pathSteps) {")
    A("    const tut = await db.tutorial.findUnique({ where: { subjectId_slug: { subjectId: srec.id, slug: st.tutorialSlug } } })")
    A("    await db.learningPathStep.create({ data: { pathId: path.id, partId: partIds[st.part], tutorialId: tut?.id ?? null, title: st.title, subtitle: st.subtitle, order: st.order } })")
    A("  }")
    A(f'  console.log(`  ✓ Learning path: ${{path.title}} (${{pathSteps.length}} steps)`)')
    A("")
    A("  const counts = {")
    A("    subjects: await db.subject.count(),")
    A("    modules: await db.module.count(),")
    A("    tutorials: await db.tutorial.count(),")
    A("    paths: await db.learningPath.count(),")
    A("    pathSteps: await db.learningPathStep.count(),")
    A("  }")
    A('  console.log("🎉 Seed complete:", counts)')
    A("}")
    A("")
    A("main()")
    A("  .catch((e) => {")
    A("    console.error(\"Seed failed:\", e)")
    A("    process.exit(1)")
    A("  })")
    A("  .finally(async () => {")
    A("    await db.$disconnect()")
    A("  })")
    A("")
    return "\n".join(L), {"subjectSlug": subject_slug, "pathSlug": path_slug, "slugOverrides": slug_overrides, "tutorials": tutorial_json}


# ---------------------------------------------------------------- preflight

BOX_MARKERS = re.compile(
    r"CURRICULUM POSITION|TUTORIAL METADATA|LEARNING OBJECTIVES|"
    r"Reply with CONTINUE|tutorial-next|Tutorial Status|STATUS BOX",
    re.I,
)


def preflight(articles: list[Article], units: list[dict], seed_ts: str, tutorials_json: dict) -> tuple[list[str], bool, bool]:
    """Run all validations. Returns (report_lines, ok, has_warnings)."""
    lines: list[str] = []
    hard_error = False
    has_warnings = False
    by_part: dict[int, Article] = {}
    for a in articles:
        if a.part is None:
            continue
        if a.part in by_part:
            lines.append(f"HARD ERROR: duplicate part number {a.part} ({a.source} and {by_part[a.part].source})")
            hard_error = True
        by_part[a.part] = a
    lines.append(f"articles parsed: {len(articles)} (guide: {sum(1 for a in articles if a.part is None)}, parts: {len(by_part)})")

    seen_slugs: set[str] = set()
    for a in articles:
        if a.part is None:
            who = "guide"
        else:
            who = f"part {a.part}"
        if not a.title:
            lines.append(f"HARD ERROR: {who} ({a.source}): empty title")
            hard_error = True
            continue
        if not a.markdown.strip():
            lines.append(f"HARD ERROR: {who} ({a.source}): empty content")
            hard_error = True
        eff = application_slug(a, tutorials_json.get("subjectSlug") or "computer-science-foundations",
                               tutorials_json.get("slugOverrides") or {})
        if eff in seen_slugs:
            lines.append(f"HARD ERROR: duplicate tutorial slug {eff} ({who})")
            hard_error = True
        seen_slugs.add(eff)
        if a.summary:
            pass
        else:
            a.add_warning("no summary extracted (no tutorial-description/overview)")
        if not a.tags:
            a.add_warning("no tags extracted")
            has_warnings = True
        if not a.objectives:
            a.add_warning("no learning objectives extracted")
            has_warnings = True
        if not a.assessment and a.part is not None:
            a.add_warning("no self-assessment extracted")
            has_warnings = True
        # reference-box markers must never appear in content
        for m in BOX_MARKERS.finditer(a.markdown):
            a.add_warning(f"reference-box marker {m.group(0)!r} found in content")
            has_warnings = True
        # balanced code fences
        fences = 0
        for ln in a.markdown.split("\n"):
            if re.match(r"^ {0,3}```", ln):
                fences += 1
        if fences % 2:
            a.add_warning(f"unbalanced code fences ({fences} fence lines)")
            has_warnings = True
        # metadata JSON fields (they are plain python lists; check they will serialize)
        for fname, val in [("objectives", a.objectives), ("prereqs", a.prereqs),
                           ("takeaways", a.takeaways), ("assessment", a.assessment)]:
            if not isinstance(val, list):
                a.add_warning(f"{fname} is not a list ({type(val).__name__})")
                hard_error = True
                has_warnings = True

    # syllabus coverage: parts declared by the guide but not imported
    guide = next((a for a in articles if a.part is None), None)
    declared: set[int] = set()
    if guide is not None:
        for u in units:
            declared.update(u["parts"])
    declared.update(set(by_part))
    missing = sorted(declared - set(by_part))
    if missing:
        lines.append(f"WARNING: parts listed in syllabus but not imported: {missing}. They can be added later as extra files.")
        has_warnings = True

    # unit containment
    for u in units:
        absent = [p for p in u["parts"] if p not in by_part]
        if absent:
            lines.append(f"WARNING: unit {u['slug']} declares parts {absent} that are not imported")
            has_warnings = True
        lines.append(f"  module {u['slug']!r}: {len([p for p in u['parts'] if p in by_part])} tutorials")

    # seed sanity
    if "content: `" not in seed_ts:
        lines.append("HARD ERROR: seed file has no content blocks")
        hard_error = True

    for a in articles:
        who = "guide" if a.part is None else f"part {a.part}"
        for i_ in a.info:
            lines.append(f"  [{who}] (info) {i_}")
        for w in a.warnings:
            lines.append(f"  [{who}] {w}")
    return lines, not hard_error, has_warnings


# ---------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser(description="Import a CodeMastery course from a DOCX (+ optional extra part files).")
    ap.add_argument("docx", nargs="?", help="path to the course .docx")
    ap.add_argument("--extra", action="append", default=[], help="file or directory with extra parts (missing from the DOCX, e.g. pasted from chat). Repeatable.")
    ap.add_argument("--config", help="course config JSON (subject/path/units overrides)")
    ap.add_argument("--out", help="output directory (default scripts/import-course/out/<course-slug>)")
    ap.add_argument("--seed", help="path for the generated seed TS (default prisma/<course-slug>-seed.ts)")
    ap.add_argument("--no-seed", action="store_true", help="skip seed generation (extract + convert + report only)")
    ap.add_argument("--force", action="store_true", help="write seed even if preflight has warnings (never on hard errors)")
    args = ap.parse_args()

    if not args.docx:
        sys.exit("usage: py scripts/import-course/pipeline.py <book.docx> [--extra <dir>] [--config <json>]")

    cfg: dict = {}
    if args.config:
        cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    course_cfg = cfg.get("course", {})
    subject_slug = course_cfg.get("slug") or "computer-science-foundations"

    # ---------- extract ----------
    articles: list[Article] = []
    if args.docx:
        for i, para in enumerate(docx_paragraphs(Path(args.docx))):
            if "<article" not in para:
                continue
            first_art = para.find("<article")
            box_text = para[:first_art] if first_art > 0 else ""
            for m in re.finditer(r"<article.*?</article>", para, re.S | re.I):
                a = parse_html_article(m.group(0), f"{Path(args.docx).name}#para{i}")
                if a is not None:
                    apply_text_box(a, box_text)
                    articles.append(a)
    for extra in args.extra:
        p = Path(extra)
        files = sorted(p.iterdir()) if p.is_dir() else [p]
        for f in files:
            if f.suffix.lower() in (".md", ".txt", ".html", ".htm"):
                a = parse_extra_file(f)
                if a is None:
                    print(f"WARNING: could not parse extra file {f} (skipped)")
                else:
                    articles.append(a)

    if not articles:
        sys.exit("ERROR: no articles found in the DOCX/extra files. See README for expected formats.")

    # ---------- units ----------
    guide = next((a for a in articles if a.part is None), None)
    by_part = {a.part: a for a in articles if a.part is not None}
    units = cfg.get("units") or derive_units(guide, by_part)
    if cfg.get("units"):
        for u in units:
            u["parts"] = [p for p in u["parts"] if p in by_part]
        units = [u for u in units if u["parts"]]

    # ---------- output dir ----------
    out_dir = Path(args.out or f"scripts/import-course/out/{subject_slug}")
    out_dir.mkdir(parents=True, exist_ok=True)

    # ---------- write artifacts ----------
    meta_out = []
    for a in sorted([a for a in articles if a.part is not None], key=lambda x: x.part):
        fname = f"part-{a.part:03d}"
        (out_dir / f"{fname}.html").write_text(a.html, encoding="utf-8")
        (out_dir / f"{fname}.md").write_text(a.markdown, encoding="utf-8")
        meta_out.append({
            "part": a.part, "title": a.title, "slug": a.slug, "difficulty": a.difficulty,
            "minutes": a.minutes, "tags": a.tags, "summary": a.summary,
            "objectives": a.objectives, "prereqs": a.prereqs, "takeaways": a.takeaways,
            "assessment": a.assessment, "whereItFits": a.where_it_fits, "source": a.source,
        })
    if guide is not None:
        (out_dir / "part-000.html").write_text(guide.html, encoding="utf-8")
        (out_dir / "part-000.md").write_text(guide.markdown, encoding="utf-8")
        meta_out.insert(0, {
            "part": None, "title": guide.title, "slug": guide.slug, "difficulty": guide.difficulty,
            "minutes": guide.minutes, "tags": guide.tags, "summary": guide.summary,
            "objectives": guide.objectives, "prereqs": guide.prereqs, "takeaways": guide.takeaways,
            "assessment": guide.assessment, "whereItFits": guide.where_it_fits, "source": guide.source,
        })
    (out_dir / "meta.json").write_text(json.dumps(meta_out, indent=1, ensure_ascii=False), encoding="utf-8")

    # ---------- seed ----------
    seed_ts = ""
    tutorials_json: dict = {}
    if not args.no_seed:
        seed_path = Path(args.seed or f"prisma/{subject_slug}-seed.ts")
        seed_ts, tutorials_json = generate_seed(articles, units, cfg, seed_path)
        (out_dir / "tutorials.json").write_text(json.dumps(tutorials_json, indent=1, ensure_ascii=False), encoding="utf-8")

    # ---------- preflight ----------
    report, ok, has_warnings = preflight(articles, units, seed_ts, tutorials_json)
    (out_dir / "report.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
    print("\n".join(report))
    print(f"artifacts written to {out_dir}")
    if not ok:
        print("PREFLIGHT FAILED (hard errors). Seed not written. Fix the errors and re-run.")
        return 1
    if not args.no_seed:
        if args.force or not has_warnings:
            seed_path.parent.mkdir(parents=True, exist_ok=True)
            seed_path.write_text(seed_ts, encoding="utf-8")
            print(f"seed written to {seed_path}")
        else:
            print("warnings present - seed NOT written. Inspect report.txt; re-run with --force to write anyway, or --no-seed to skip.")
    return 0


if __name__ == "__main__":
    sys.exit(main())