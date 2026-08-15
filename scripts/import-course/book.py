#!/usr/bin/env python3
"""book.py — plain-chapter DOCX pipeline for CodeMastery.

For books WITHOUT the article/meta-box format (no <article> HTML, no
CURRICULUM POSITION / TUTORIAL METADATA boxes): plain heading-and-paragraph
books such as "COMPLETE JAVASCRIPT FOR ABSOLUTE BEGINNERS". Layout:

    PART N — Title          (Heading 1)        -> module (unit) boundary
    Chapter N — Title       (Heading 1)        -> tutorial boundary
    Project N — Title       (Heading 1)        -> tutorial boundary
    section headings        (Heading 1/2/3/4)
    body paragraphs         (Normal / List Paragraph)
    code paragraphs         (Normal with monospace run font, e.g. Consolas)

Design notes
------------
* Code paragraphs are detected by the monospace run font. A paragraph whose
  runs are ~all-mono becomes one fenced block: ``js`` for real code,
  ``text`` for outputs/ASCII diagrams/arrow flows.
* Prose paragraphs that contain short newline-separated lines (a formatting
  quirk of these books) become bullet lists; longer ones stay paragraphs
  with the line breaks preserved.
* "Part N Progress" checkpoint sections (✅/⏳/Type NEXT...) are chat
  orchestration scaffolding and are dropped entirely.
* PART headings repeat before every chapter; only the first occurrence of a
  part number creates the module. A repeated Chapter/Project heading with
  the same kind+number is a duplicated segment (the book repeats Project 7
  three times byte-identically) and is skipped until the next tutorial.
* Chapter numbering of the book is preserved in titles/slugs
  ("Chapter 5 — Variables" -> slug chapter-5-variables). Missing numbers
  in the book (e.g. no Chapter 4/10/11/50) are only reported, not an error.
* Metadata mapping:
    Learning Objectives           -> learningObjectives (dropped from content)
    Chapter Summary               -> keyTakeaways        (dropped from content)
    Key Terms                     -> tags (+ kept in content)
    MCQs                          -> selfAssessment questions (+ kept in content)
    Chapter Introduction          -> summary (first sentences)
    Why This Topic Matters        -> whereItFits (first sentence)
* estimatedMinutes is heuristic from word count (clamped 10..90).

Usage:
    py scripts/import-course/book.py <book.docx> --config scripts/import-course/courses/<course>.json
    py scripts/import-course/book.py <book.docx> --config ... --no-seed
    py scripts/import-course/book.py <book.docx> --config ... --seed prisma/js-seed.ts
"""
import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

import docx
from docx.table import Table
from docx.text.paragraph import Paragraph

from pipeline import (
    Article, JD, generate_seed, preflight, slugify,
)

# ---------------------------------------------------------------- detection

MONO_FONTS = {"consolas", "courier new", "courier", "lucida console", "monaco",
              "menlo", "monospace", "cascadia mono", "droid sans mono", "dejavu sans mono"}

PART_HEAD_RE = re.compile(r"^\s*PART\s+(\d+)\s*[—-]\s*(.+?)\s*$", re.I)
CHAPTER_HEAD_RE = re.compile(r"^\s*Chapter\s+(\d+)\s*[—-]\s*(.+?)\s*$", re.I)
PROJECT_HEAD_RE = re.compile(r"^\s*Project\s+(\d+)\s*[—-]\s*(.+?)\s*$", re.I)
PROGRESS_HEAD_RE = re.compile(r"^\s*(?:Part|PART)\s+\d+\s+Progress\s*$")
DROP_LINE_RE = re.compile(r"^(✅|⏳|Type NEXT(?: to continue)?\s*[.!]?)$")
OUTPUT_LABEL_RE = re.compile(r"^\s*(?:Output|Error|Result|Note|Warning|Tip)\s*:\s*$", re.I)
CODE_HINT_RE = re.compile(
    r";\s*$"        # statement terminator
    r"|=>"
    r"|\bconsole\.[A-Za-z_]"
    r"|^\s*(?:let|const|var)\s+[A-Za-z_$]"
    r"|^\s*(?:function|class|import|export|async)\b"
    r"|[{}]"        # braces
)
DIAGRAM_RE = re.compile(r"[→↓↑←⇒┌┐└┘├┤┬┴┼│─]")

OBJECTIVE_SECTIONS = {"Learning Objectives"}
TAKEAWAY_SECTIONS = {"Chapter Summary"}
TAGS_SECTIONS = {"Key Terms"}
QUESTION_SECTIONS = {"MCQs"}
INTRO_SECTIONS = {"Chapter Introduction"}
WHY_SECTIONS = {"Why This Topic Matters"}

MODULE_TITLE_RE = re.compile(r"^\s*Part\s+\d+\s*[-—]\s*", re.I)


def run_is_code(r) -> bool:
    try:
        return (r.font.name or "").lower() in MONO_FONTS
    except Exception:
        return False


@dataclass
class Item:
    kind: str          # "head" | "para" | "table" | "blank"
    text: str = ""
    level: int = 0     # heading level 1..4
    lines: list = field(default_factory=list)
    code: bool = False
    table: Table | None = None
    para: Paragraph | None = None


def normalize(doc) -> list[Item]:
    """Materialize the document body into Items (paragraphs + tables in order)."""
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    items: list[Item] = []
    for child in doc.element.body.iterchildren():
        if child.tag == f"{W}p":
            p = Paragraph(child, doc)
            style = p.style.name or ""
            text = p.text or ""
            if style.startswith("Heading"):
                m = re.match(r"Heading (\d)", style)
                items.append(Item(kind="head", text=text.strip(), level=int(m.group(1)) if m else 1, para=p))
                continue
            # split runs by embedded newline runs
            lines: list[str] = []
            cur = ""
            code_runs, total = 0, 0
            for r in p.runs:
                if r.text == "\n":
                    lines.append(cur)
                    cur = ""
                    continue
                total += 1
                if run_is_code(r):
                    code_runs += 1
                cur += r.text
            if cur or not lines:
                lines.append(cur)
            lines = [ln.rstrip() for ln in lines]
            if not any(ln.strip() for ln in lines):
                if items and items[-1].kind == "blank":
                    continue
                items.append(Item(kind="blank"))
                continue
            code = total > 0 and code_runs / total >= 0.7
            items.append(Item(kind="para", text=text.strip(), lines=lines, code=code, para=p))
            # force import:
            # fmt: off
        elif child.tag == f"{W}tbl":
            items.append(Item(kind="table", table=Table(child, doc)))
            # fmt: on
    return items


def table_to_md(tb: Table) -> str:
    rows = [[re.sub(r"\s+", " ", c.text).strip() for c in r.cells] for r in tb.rows]
    if not rows:
        return ""
    width = max(len(r) for r in rows)
    rows = [r + [""] * (width - len(r)) for r in rows]

    def esc(x: str) -> str:
        return x.replace("|", "\\|")

    out = ["| " + " | ".join(esc(c) for c in rows[0]) + " |"]
    out.append("| " + " | ".join("---" for _ in rows[0]) + " |")
    for r in rows[1:]:
        out.append("| " + " | ".join(esc(c) for c in r) + " |")
    return "\n".join(out)


def fence_lang(lines: list[str]) -> str | None:
    """'js' for real code, 'text' for outputs/diagrams, None for prose."""
    joined = "\n".join(lines).strip()
    if not joined:
        return None
    if DIAGRAM_RE.search(joined):
        return "text"
    if CODE_HINT_RE.search(joined):
        return "js"
    return None


# ---------------------------------------------------------------- model

@dataclass
class Tutorial:
    kind: str
    number: int
    title: str                 # book heading verbatim, "Chapter 5 — Variables"
    slug: str
    unit: int = 0              # module (part) number this tutorial belongs to
    markdown: str = ""
    objectives: list[str] = field(default_factory=list)
    takeaways: list[str] = field(default_factory=list)
    terms: list[str] = field(default_factory=list)
    questions: list[str] = field(default_factory=list)
    intro: list[str] = field(default_factory=list)   # Chapter Introduction lines
    why_matters: list[str] = field(default_factory=list)
    words: int = 0
    seq: int = 0               # unique sequential id (Article.part)
    source: str = ""


def parse_book(docx_path: Path) -> tuple[list[Tutorial], list[dict], list[str]]:
    """Returns (tutorials, modules[{number,title,parts}], info_lines)."""
    doc = docx.Document(str(docx_path))
    items = normalize(doc)
    info: list[str] = []

    modules: list[dict] = []
    cur_unit: int | None = None
    tutorials: list[Tutorial] = []
    cur: Tutorial | None = None
    out: list[str] = []            # markdown lines of current tutorial
    cur_section = ""               # absorbing section name
    pending_open_fence = False
    pending_output = False
    seq = 0

    def find_module(num: int) -> dict | None:
        return next((m for m in modules if m["number"] == num), None)

    def end_tutorial():
        nonlocal out, pending_open_fence, cur_section, pending_output
        if pending_open_fence and out:
            out[-1] += "\n```"
            pending_open_fence = False
        if cur is not None:
            cur.markdown = "\n\n".join(l for l in out if l.strip())
        out = []
        cur_section = ""
        pending_output = False

    def new_tutorial(kind, number, title, source, unit_num):
        nonlocal cur, pending_output
        end_tutorial()
        pending_output = False
        cur = Tutorial(kind=kind, number=number, title=title,
                       slug=f"{kind.lower()}-{number}-{slugify(title.split('—', 1)[-1])}",
                       seq=len(tutorials) + 1, source=source,
                       unit=unit_num if unit_num is not None else 0)
        tutorials.append(cur)
        if unit_num is not None:
            m = find_module(unit_num)
            if m is None:
                m = {"number": unit_num, "title": f"Part {unit_num}", "parts": []}
                modules.append(m)
            m["parts"].append(cur.seq)

    skip_until_kind = None        # while set, drop everything (dup segment)
    skip_until_number = None

    i = 0
    n = len(items)
    while i < n:
        it = items[i]
        # ---------------- duplicate-segment skip ----------------
        if skip_until_kind is not None and it.kind == "head" and it.level == 1:
            pm = PART_HEAD_RE.match(it.text)
            cm = CHAPTER_HEAD_RE.match(it.text)
            pm2 = PROJECT_HEAD_RE.match(it.text)
            still_dup = (
                (cm is not None and skip_until_kind == "Chapter" and cm.group(1) == str(skip_until_number)) or
                (pm2 is not None and skip_until_kind == "Project" and pm2.group(1) == str(skip_until_number)) or
                (pm is None and cm is None and pm2 is None)
            )
            if not still_dup:
                skip_until_kind = None
        if skip_until_kind is not None:
            i += 1
            continue

        if it.kind == "table":
            if cur is not None:
                out.append(table_to_md(it.table))
            i += 1
            continue

        if it.kind == "blank":
            # a blank paragraph separates blocks: close any open fence
            if pending_open_fence and out:
                out[-1] += "\n```"
                pending_open_fence = False
            i += 1
            continue
        if it.kind == "para" and not it.text:
            i += 1
            continue

        # ---------------- headings ----------------
        if it.kind == "head":
            text = it.text
            # Part boundary (repeated parts ignored; first occurrence creates module)
            if it.level == 1 and PROGRESS_HEAD_RE.match(text):
                if cur is not None:
                    end_tutorial()
                    cur = None
                i += 1
                continue
            pm = PART_HEAD_RE.match(text)
            if it.level == 1 and pm:
                num = int(pm.group(1))
                if num != cur_unit or find_module(num) is None:
                    if cur_unit != num:
                        info.append(f"PART {num} — {pm.group(2)} (module start)")
                    if find_module(num) is None:
                        modules.append({"number": num, "title": f"Part {num} - {pm.group(2)}", "parts": []})
                cur_unit = num
                if cur is not None:
                    end_tutorial()
                    cur = None
                i += 1
                continue
            cm = CHAPTER_HEAD_RE.match(text)
            pm2 = PROJECT_HEAD_RE.match(text)
            if it.level == 1 and (cm or pm2):
                kind = "Chapter" if cm else "Project"
                num = int(cm.group(1) if cm else pm2.group(1))
                title = f"{kind} {num} — {cm.group(2) if cm else pm2.group(2)}"
                if cur is not None and cur.kind == kind and cur.number == num:
                    info.append(f"{kind} {num} duplicated in book: skipping repeat segment")
                    end_tutorial()
                    cur = None
                    skip_until_kind = kind
                    skip_until_number = num
                    i += 1
                    continue
                new_tutorial(kind, num, title, str(docx_path), cur_unit)
                cur_section = ""
                pending_output = False
                i += 1
                continue
            # section heading inside a tutorial
            if cur is not None:
                pending_output = False
                is_absorb = text in (OBJECTIVE_SECTIONS | TAKEAWAY_SECTIONS | TAGS_SECTIONS |
                                     QUESTION_SECTIONS | INTRO_SECTIONS | WHY_SECTIONS)
                # MCQ questions are Heading-3 items like "1. Which keyword..."
                numbered_question = re.match(r"^\s*\d+[.)]\s*(.+)", text) if it.level >= 3 else None
                mcq_zone = (text in QUESTION_SECTIONS or numbered_question is not None)
                if numbered_question:
                    q = numbered_question.group(1).strip()
                    if q and q not in cur.questions:
                        cur.questions.append(q)
                    is_absorb = True   # stay in the MCQs collection zone
                cur_section = text if is_absorb else ""
                # objectives & summaries live in metadata fields only:
                # don't render their headings (would be empty sections)
                if text not in (OBJECTIVE_SECTIONS | TAKEAWAY_SECTIONS):
                    out.append(f"{'#' * min(it.level, 4)} {text}")
            i += 1
            continue

        # ---------------- paragraphs ----------------
        if cur is None:
            i += 1
            continue
        if DROP_LINE_RE.match(it.text):
            i += 1
            continue

        active_absorb = cur_section in (OBJECTIVE_SECTIONS | TAKEAWAY_SECTIONS | TAGS_SECTIONS |
                                        QUESTION_SECTIONS | INTRO_SECTIONS | WHY_SECTIONS)

        # capture metadata independently of rendering
        if cur_section in QUESTION_SECTIONS:
            for ln in it.lines:
                m = re.match(r"^\s*\d+[.)]\s*(.+)", ln.strip())
                if m:
                    cur.questions.append(m.group(1).strip())
        if cur_section in TAKEAWAY_SECTIONS:
            for ln in it.lines:
                t = re.sub(r"^✓\s*", "", ln.strip())
                if t and not re.match(r"^(After completing|In this chapter|Chapter Summary)", t, re.I) and t not in cur.takeaways:
                    cur.takeaways.append(t)
        if cur_section in OBJECTIVE_SECTIONS:
            for ln in it.lines:
                t = re.sub(r"^✓\s*", "", ln.strip())
                if t and not re.match(r"^(After completing|In this chapter)", t, re.I) and t not in cur.objectives:
                    cur.objectives.append(t)
        if cur_section in TAGS_SECTIONS:
            for ln in it.lines:
                t = re.sub(r"^✓\s*", "", ln.strip())
                if t and t not in cur.terms:
                    cur.terms.append(t)
        if cur_section in INTRO_SECTIONS:
            for ln in it.lines:
                if ln.strip():
                    cur.intro.append(ln.strip())
        if cur_section in WHY_SECTIONS:
            for ln in it.lines:
                if ln.strip():
                    cur.why_matters.append(ln.strip())

        style_lower = (it.para.style.name or "").lower() if it.para is not None else ""
        is_list = "list" in style_lower

        # list paragraphs render as bullets
        if is_list:
            for ln in it.lines:
                t = ln.strip()
                if t:
                    out.append(f"- {t}")
            i += 1
            continue

        # dropping absorbing sections from content (they are metadata fields)
        if cur_section in (OBJECTIVE_SECTIONS | TAKEAWAY_SECTIONS):  # objectives & summary -> fields only
            i += 1
            continue

        # output label -> bold label line (closes any open fence)
        if OUTPUT_LABEL_RE.match(it.text):
            if pending_open_fence and out:
                out[-1] += "\n```"
            pending_open_fence = False
            out.append(f"**{it.text}**")
            pending_output = True
            i += 1
            continue

        # MCQ zone lines render as plain text (not code)
        if mcq_zone and it.code:
            for ln in it.lines:
                if ln.strip():
                    out.append(ln.strip())
            i += 1
            continue

        # code block: start or extend an open fence
        if it.code:
            lang = fence_lang(it.lines)
            if lang is not None:
                if not pending_open_fence:
                    out.append("```" + lang)
                    pending_open_fence = True
                for ln in it.lines:
                    out[-1] += "\n" + (ln if ln else "")
                i += 1
                continue
            # mono-font prose/output values: value blocks after a label,
            # otherwise plain text (no code hints -> prose, not code)
            if pending_output:
                out.append("```text")
                for ln in it.lines:
                    out[-1] += "\n" + ln
                out[-1] += "\n```"
                pending_output = False
                i += 1
                continue
            multi_lines = [ln.strip() for ln in it.lines if ln.strip()]
            if len(multi_lines) > 1 and all(len(l) <= 100 for l in multi_lines):
                for ln in multi_lines:
                    if cur_section not in TAGS_SECTIONS:
                        out.append(f"- {ln}")
                if cur_section not in TAGS_SECTIONS:
                    i += 1
                    continue
            if cur_section in TAGS_SECTIONS:
                i += 1
                continue

        # any other content closes an open fence
        if pending_open_fence and out:
            out[-1] += "\n```"
            pending_open_fence = False

        # prose (with inline mono runs)
        if it.code:
            prose = it.text  # whole-paragraph mono with no code hints -> plain text
        else:
            md_line = ""
            for r in it.para.runs:
                md_line += f"`{r.text}`" if run_is_code(r) else r.text
            prose = md_line.strip() or it.text

        multi_lines = [ln.strip() for ln in it.lines if ln.strip()]
        if len(multi_lines) > 1 and all(len(l) <= 100 for l in multi_lines):
            for ln in multi_lines:
                out.append(f"- {ln}")
        else:
            out.append(prose if prose else "\n\n".join(multi_lines))
        i += 1

    end_tutorial()

    # close any dangling open fence in every tutorial (defensive)
    for t in tutorials:
        lines = t.markdown.split("\n")
        opens = sum(1 for l in lines if re.match(r"^```", l))
        if opens % 2:
            t.markdown = t.markdown.rstrip() + "\n```"
        t.words = max(1, len(re.findall(r"\S+", t.markdown)))

    info.append(f"parsed {len(tutorials)} tutorials (chapters+projects) across {len(modules)} parts")
    return tutorials, modules, info


# ---------------------------------------------------------------- seed

def tutorials_to_articles(tutorials: list[Tutorial], cfg: dict) -> list[Article]:
    """Build Article objects so generate_seed() can produce the seed TS."""
    cfg_course = cfg.get("course", {})
    default_minutes = int(cfg.get("minutesDefault") or 25)
    articles: list[Article] = []
    for t in tutorials:
        words = t.words
        minutes = max(10, min(90, round(words / 180))) if t.words else default_minutes
        tags = [slugify(x) for x in (t.terms or [])]
        if not tags and t.kind == "Project":
            tags = ["javascript", "project"]
        if not tags:
            tags = ["javascript"]
        tags = list(dict.fromkeys(tags))[:24]

        # summary from Chapter Introduction (first 2 sentences / ~240 chars)
        summary = " ".join(t.intro) if t.intro else ""
        summary = re.sub(r"\s+", " ", summary).strip()
        m = re.match(r"^(.{40,240}?[.!?])(\s|$)", summary)
        if m and len(summary) > 240:
            summary = m.group(1)
        if len(summary) > 260:
            summary = summary[:260].rsplit(" ", 1)[0] + "…"

        why = re.sub(r"\s+", " ", " ".join(t.why_matters)).strip()
        m = re.match(r"^(.{40,220}?[.!?])(\s|$)", why)
        where = m.group(1) if m else (why[:220] + "…" if len(why) > 220 else why)

        a = Article(
            part=t.seq,
            title=t.title,
            slug=t.slug,
            difficulty=find_difficulty(cfg, t),
            minutes=minutes,
            tags=tags,
            summary=summary or t.title,
            objectives=[x for x in t.objectives][:12] or [],
            prereqs=[],
            takeaways=t.takeaways[:10] or [],
            assessment=t.questions[:10] or [],
            where_it_fits=where,
            html="",
            markdown=t.markdown,
            source=t.source,
        )
        articles.append(a)
    return articles


def find_difficulty(cfg: dict, t: Tutorial) -> str:
    """Difficulty of a tutorial = difficulty of its module (config override)."""
    d = cfg.get("difficulties") or {}
    return d.get(str(t.unit)) or "beginner"


# ---------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser(description="Import a plain-chapter DOCX book into CodeMastery.")
    ap.add_argument("docx", nargs="?", help="path to the book .docx")
    ap.add_argument("--config", help="course config JSON")
    ap.add_argument("--out", help="output directory (default scripts/import-course/out/<course-slug>)")
    ap.add_argument("--seed", help="path for the generated seed TS (default prisma/<course-slug>-seed.ts)")
    ap.add_argument("--no-seed", action="store_true", help="skip seed generation (parse + report only)")
    ap.add_argument("--force", action="store_true", help="write seed even if preflight has warnings")
    args = ap.parse_args()

    if not args.docx:
        sys.exit("usage: py scripts/import-course/book.py <book.docx> --config courses/<course>.json")

    cfg: dict = {}
    if args.config:
        cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    course_cfg = cfg.get("course", {})
    subject_slug = course_cfg.get("slug") or "plain-chapter-course"

    tutorials, modules, info = parse_book(Path(args.docx))
    print("\n".join(info))

    # unit declarations: default = one unit per parsed module
    part_difficulties = cfg.get("difficulties") or {}
    units_cfg = cfg.get("units")
    if not units_cfg:
        units_cfg = [
            {"number": m["number"], "title": m["title"],
             "slug": f"part-{m['number']}-{slugify(MODULE_TITLE_RE.sub('', m['title'])).strip('-')}",
             "summary": f"Part {m['number']} of the course.",
             "difficulty": part_difficulties.get(str(m["number"]), "beginner")}
            for m in modules
        ]
    # translate unit declarations (by part number) into seq-numbered parts
    known_seqs = {t.seq for t in tutorials}
    units = []
    for u in units_cfg:
        num = u.get("number")
        if num is None and u.get("parts"):
            num = next((m["number"] for m in modules if m["number"] == u["parts"][0] or
                        u["slug"] == f"part-{m['number']}-{slugify(MODULE_TITLE_RE.sub('', m['title'])).strip('-')}"), None)
        m = next((m for m in modules if m["number"] == num), None)
        parts = sorted(seq for seq in (m["parts"] if m else []) if seq in known_seqs)
        units.append({"slug": u["slug"], "title": u["title"],
                      "summary": u.get("summary") or f"Part {num} of the course.",
                      "difficulty": u.get("difficulty") or part_difficulties.get(str(num), "beginner"),
                      "estimatedMinutes": u.get("estimatedMinutes") or 0,
                      "parts": parts})
    cfg["units"] = units

    articles = tutorials_to_articles(tutorials, cfg)

    out_dir = Path(args.out or f"scripts/import-course/out/{subject_slug}")
    out_dir.mkdir(parents=True, exist_ok=True)

    # artifacts: one md per tutorial + meta
    meta_out = []
    for t in tutorials:
        fname = f"{t.kind.lower()}-{t.number:03d}"
        (out_dir / f"{fname}.md").write_text(f"# {t.title}\n\n" + t.markdown, encoding="utf-8")
        meta_out.append({"kind": t.kind, "number": t.number, "title": t.title, "slug": t.slug,
                         "objectives": t.objectives, "takeaways": t.takeaways,
                         "terms": t.terms, "questions": t.questions,
                         "summary": " | ".join(t.intro)[:120], "source": t.source})
    for m in modules:
        meta_out.append({"module": m["number"], "title": m["title"], "parts": m["parts"]})
    (out_dir / "meta.json").write_text(json.dumps(meta_out, indent=1, ensure_ascii=False), encoding="utf-8")

    # ---- seed ----
    seed_ts = ""
    tutorials_json: dict = {}
    if not args.no_seed:
        seed_path = Path(args.seed or f"prisma/{subject_slug}-seed.ts")
        seed_ts, tutorials_json = generate_seed(articles, units, cfg, seed_path)
        (out_dir / "tutorials.json").write_text(json.dumps(tutorials_json, indent=1, ensure_ascii=False), encoding="utf-8")

    report, ok, has_warnings = preflight(articles, units, seed_ts, tutorials_json)
    (out_dir / "report.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
    print("\n".join(report))
    print(f"artifacts written to {out_dir}")
    if not ok:
        print("PREFLIGHT FAILED (hard errors). Seed not written. Fix and re-run.")
        return 1
    if not args.no_seed:
        if args.force or not has_warnings:
            seed_path.parent.mkdir(parents=True, exist_ok=True)
            seed_path.write_text(seed_ts, encoding="utf-8")
            print(f"seed written to {seed_path}")
        else:
            print("warnings present - seed NOT written. Inspect report.txt; re-run with --force to write anyway.")
    return 0


if __name__ == "__main__":
    sys.exit(main())