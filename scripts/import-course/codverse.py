"""Import CodeVerse Academy book JSONs into CodeMastery seeds.

Each book JSON has chapters with flat blocks of four types:
heading / subheading / paragraph / list. Code and tables were flattened
into plain text by the source exporter, so the converter re-fences
obvious code runs with a per-book default language and content hints.

Usage:
  py -X utf8 scripts/import-course/codverse.py html-foundations --config courses/codverse/html-foundations.json
  py -X utf8 scripts/import-course/codverse.py --all --force
"""
import argparse
import json
import re
import sys
from pathlib import Path

from pipeline import Article, generate_seed, preflight, slugify

BOOKS_DIR = Path(__file__).parent / "codverse" / "books"

OBJECTIVE_SECTIONS = {"learning objectives"}
TAKEAWAY_SECTIONS = {"chapter summary", "summary"}
TAGS_SECTIONS = {"key terms", "glossary"}
QUESTION_SECTIONS = {"mcqs", "mcq", "multiple choice questions"}
INTRO_SECTIONS = {"chapter introduction", "introduction", "chapter introduction & overview"}
WHY_SECTIONS = {"why this topic matters", "why it matters"}

CHECK_PREFIX_RE = re.compile(r"^\s*(?:✓|✔|☑|✗|☐|•)\s*")
CTRL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\u2028\u2029]")
LEAD_IN_RE = re.compile(
    r"^(?:by the end|after completing|in this chapter|at the end|upon completion|"
    r"you should|you will|what you(?: will)?(?: learn| understand)|key terms?(?: covered)?|"
    r"let'?s review|recap)", re.I)


def clean_meta_item(s: str) -> str | None:
    s = CHECK_PREFIX_RE.sub("", s).strip()
    if not s:
        return None
    if LEAD_IN_RE.match(s) and len(s.split()) <= 10:
        return None
    return s

# Text that is clearly code, not prose.
CODE_HINT_RE = re.compile(
    r";\s*$"
    r"|=>"
    r"|\bconsole\.[A-Za-z_]"
    r"|^\s*(?:let|const|var|function|class|import|export|async)\b"
    r"|^\s*def\s+\w+\s*\("
    r"|^\s*(?:print|printLn|println)\s*\("
    r"|^\s*#\s*include"
    r"|// ?"
    r"|^\s*</?[a-z][^>]*>"
    r"|\b(?:if|for|while|switch)\s*\([^)]*\)\s*\{"
    r"|^[^:]*\{[^}]*\}\s*(?:;|$)"
    r"|[A-Za-z_$][\w$]*\[\s*\d+\s*\]\s*[A-Za-z_$\[(]"
)

HTML_TAG_RE = re.compile(r"^\s*</?[a-z][a-z0-9-]*[^>]*>", re.I)
PY_HINT_RE = re.compile(r"^\s*(def class )|(import (torch|numpy|pandas|math|os|sys|json))\b|^\s*def\s+|^\s*class\s+", re.I)
CSS_HINT_RE = re.compile(r"^\s*[a-zA-Z-]+\s*:\s*[^;]+;\s*$")

def resolve_difficulty(level: str) -> str:
    """Map a book JSON 'level' label to a CodeMastery difficulty."""
    key = (level or "").strip().lower()
    if any(x in key for x in ("advanced", "professional", "volume 5", "volume 6", "book 3")):
        return "advanced"
    if any(x in key for x in ("book 2", "volume 2", "volume 3", "volume 4", "interview prep",
                              "job prep", "career path", "practice", "intermediate",
                              "complete book", "beginner to professional", "beginner to production")):
        return "intermediate"
    return "beginner"

def clean_title(t: str) -> str:
    """Strip leading 'Chapter N' / 'N.' decorations from a chapter title."""
    t = re.sub(r"^\s*(?:chapter|lesson|unit)\s+\d+\s*[—:.\-–]?\s*", "", t, flags=re.I)
    t = re.sub(r"^\s*\d+[.):\-]\s+", "", t)
    return t.strip()


def block_is_code(text: str) -> bool:
    if "\n" in text:
        first = text.lstrip().split("\n", 1)[0]
        if re.match(r"^\s*</?[a-z][^>]*>", first, re.I):
            return True
    if HTML_TAG_RE.match(text):
        return True
    if bool(CODE_HINT_RE.search(text)):
        return True
    if "{" in text and "}" in text:
        stripped = text.strip()
        if stripped.count("{") + stripped.count("}") >= 2:
            return True
        if re.match(r"^\s*[A-Za-z_$][\w$]*\s*=\s*[{(\[]", stripped):
            return True
    return False


def fence_lang(text: str, book_lang: str) -> str:
    if HTML_TAG_RE.match(text):
        return "html"
    if PY_HINT_RE.search(text):
        return "py"
    if re.search(r"^\s*(?:const|let|var|function|=>|class\s+\w+\s*\{)", text) or "console.log" in text:
        return "js"
    if CSS_HINT_RE.match(text):
        return "css"
    return book_lang or "text"


def parse_book(book: dict, cfg: dict) -> tuple[list[Article], list[dict], list[str]]:
    course = cfg.get("course", {})
    book_lang = course.get("codeLang") or "text"
    diff_for = cfg.get("difficulties") or {}
    default_diff = resolve_difficulty(str(course.get("level") or ""))
    chapter_mins = int(cfg.get("minutesDefault") or 25)

    articles: list[Article] = []
    used_slugs: dict[str, int] = {}
    info: list[str] = []

    for idx, ch in enumerate(book["chapters"], start=1):
        raw_title = CTRL_RE.sub("", str(ch.get("title") or "")).strip()
        title = clean_title(raw_title) or f"Chapter {idx}"
        base = f"chapter-{idx}-{slugify(title)}"[:80].strip("-")
        if base in used_slugs:
            used_slugs[base] += 1
            base = f"{base}-{used_slugs[base]}"
        else:
            used_slugs[base] = 1

        blocks = ch.get("blocks") or []
        md: list[str] = []
        objectives: list[str] = []
        takeaways: list[str] = []
        terms: list[str] = []
        intro: list[str] = []
        why: list[str] = []
        assessment: list[str] = []

        cur: str | None = None
        mcq_q: str | None = None
        mcq_opt: str | None = None

        def finish_mcq() -> None:
            nonlocal mcq_q, mcq_opt
            if mcq_q is not None:
                assessment.append(mcq_q if mcq_opt is None else f"{mcq_q} (Answer: {mcq_opt})")
            mcq_q, mcq_opt = None, None

        for b in blocks:
            text = CTRL_RE.sub("", str(b.get("text") or "")).strip()
            if not text and b["type"] != "heading":
                continue
            typ = b.get("type") or "paragraph"
            key = text.strip().lower() if typ == "heading" else ""

            if typ == "heading":
                finish_mcq()
                if key in OBJECTIVE_SECTIONS:
                    cur = "obj"
                elif key in TAKEAWAY_SECTIONS:
                    cur = "take"
                elif key in TAGS_SECTIONS:
                    cur = "tags"
                elif key in QUESTION_SECTIONS:
                    cur = "mcq"
                elif key in INTRO_SECTIONS:
                    cur = "intro"
                elif key in WHY_SECTIONS:
                    cur = "why"
                else:
                    cur = None
                md.append(f"## {text}")
                continue

            is_code = block_is_code(text)

            if cur == "intro":
                if is_code:
                    md.append(f"```{fence_lang(text, book_lang)}\n{text}\n```")
                else:
                    md.append(text)
                    intro.append(text)
                continue
            if cur == "why":
                if is_code:
                    md.append(f"```{fence_lang(text, book_lang)}\n{text}\n```")
                else:
                    md.append(text)
                    if not why:
                        why.append(text)
                continue

            if typ == "subheading":
                if cur == "mcq":
                    if re.match(r"^\s*answer\s*[:.]?\s*", text, re.I):
                        md.append(f"- **{text}**")
                        m = re.match(r"^\s*answer\s*[:.]?\s*([A-Ea-e0-9])", text, re.I)
                        if m:
                            mcq_opt = m.group(1).upper()
                    elif re.match(r"^\s*[A-E][.)]\s*", text):
                        md.append(f"- {text}")
                    else:
                        finish_mcq()
                        mcq_q = re.sub(r"^[Qq]\.?\s*\d*\s*[:.)]\s*", "", text).strip()
                        md.append(f"**{text}**")
                    continue
                if cur in ("obj", "take", "tags"):
                    item = clean_meta_item(text)
                    if item:
                        if cur == "obj":
                            objectives.append(item)
                        elif cur == "take":
                            takeaways.append(item)
                        else:
                            terms.append(item)
                    continue
                if is_code:
                    md.append(f"```{fence_lang(text, book_lang)}\n{text}\n```")
                else:
                    md.append(f"### {text}")
                continue

            if typ == "list":
                if cur in ("obj", "take", "tags"):
                    item = clean_meta_item(text)
                    if item:
                        if cur == "obj":
                            objectives.append(item)
                        elif cur == "take":
                            takeaways.append(item)
                        else:
                            terms.append(item)
                    continue
                md.append(f"- {text}")
                continue

            # paragraph
            if is_code:
                md.append(f"```{fence_lang(text, book_lang)}\n{text}\n```")
            else:
                md.append(text)
                if cur is None and not intro:
                    intro.append(text)
        finish_mcq()

        if not md and not intro:
            info.append(f"skip ch {idx} {raw_title[:60]!r}: empty in source JSON")
            continue
        words = sum(len(t.split()) for t in md)
        minutes = max(10, min(90, round(words / 180))) if words else chapter_mins
        body = "\n\n".join(x for x in md if x)
        summary = re.sub(r"\s+", " ", " ".join(intro)).strip()
        if len(summary) > 260:
            summary = summary[:260].rsplit(" ", 1)[0] + "…"
        why_text = re.sub(r"\s+", " ", " ".join(why)).strip()
        tags = [slugify(x) for x in (terms or [])]
        tags = list(dict.fromkeys(x for x in tags if x))[:24]
        if not tags:
            tags = [slugify(course.get("name") or book.get("slug") or "course")]

        a = Article(
            part=len(articles) + 1,
            title=title,
            slug=base,
            difficulty=diff_for.get(str(idx)) or default_diff,
            minutes=minutes,
            tags=tags,
            summary=summary or title,
            objectives=list(dict.fromkeys(objectives))[:12],
            prereqs=[],
            takeaways=list(dict.fromkeys(takeaways))[:10],
            assessment=assessment[:10],
            where_it_fits=why_text[:260],
            html="",
            markdown=body,
            source=f"codverse:{book.get('slug')}:{idx}",
        )
        if not intro:
            a.add_warning("no Chapter Introduction section (summary from first paragraph)")
        if not objectives:
            a.add_warning("no Learning Objectives section")
        if not takeaways:
            a.add_warning("no Chapter Summary section")
        if not terms:
            a.add_warning("no Key Terms section")
        if not assessment:
            a.add_warning("no MCQs section")
        articles.append(a)

    chunk = int(cfg.get("chunkSize") or 12)
    units = []
    for k, start in enumerate(range(0, len(articles), chunk), start=1):
        end = min(start + chunk, len(articles))
        units.append({
            "slug": f"part-{k}",
            "title": f"Part {k} — Chapters {start + 1}–{end}",
            "summary": f"Chapters {start + 1} to {end} of {course.get('name') or book.get('title') or book.get('slug')}.",
            "difficulty": default_diff,
            "parts": list(range(start + 1, end + 1)),
        })
    info.append(f"books parsed: {book.get('slug')} — {len(articles)} chapters, {len(units)} modules, "
                f"{sum(len(u['parts']) for u in units)} tutorials declared")
    return articles, units, info


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("book", nargs="?", help="book JSON slug (file name in codverse/books/), or use --all")
    ap.add_argument("--all", action="store_true", help="process every book in courses/codverse/")
    ap.add_argument("--config", help="course config JSON (default courses/codverse/<book>.json)")
    ap.add_argument("--out", help="output dir (default scripts/import-course/out/codverse/<slug>)")
    ap.add_argument("--seed", help="seed path (default prisma/<slug>-seed.ts)")
    ap.add_argument("--no-seed", action="store_true", help="parse + report only")
    ap.add_argument("--force", action="store_true", help="write seed even with preflight warnings")
    args = ap.parse_args()

    if args.all:
        configs = sorted(Path("courses/codverse").glob("*.json"))
        if not configs:
            sys.exit("no course configs found in courses/codverse/")
        for cf in configs:
            slug = cf.stem
            sub = ["", "--config", str(cf)]
            if args.no_seed:
                sub.append("--no-seed")
            if args.force:
                sub.append("--force")
            code = f"python -X utf8 scripts/import-course/codverse.py {slug} " + " ".join(sub)
            print(f"\n>>> {code}")
            import subprocess
            r = subprocess.run(code, shell=True)
            if r.returncode != 0:
                return r.returncode
        print("\nAll CodeVerse books processed.")
        return 0

    cfg: dict = {}
    config_path = Path(args.config) if args.config else Path(f"courses/codverse/{args.book}.json")
    if config_path.exists():
        cfg = json.loads(config_path.read_text(encoding="utf-8"))
    course_cfg = cfg.get("course", {})
    subject_slug = course_cfg.get("slug") or args.book

    book_path = BOOKS_DIR / f"{subject_slug}.json"
    if not book_path.exists():
        sys.exit(f"missing book JSON: {book_path}")
    book = json.loads(book_path.read_text(encoding="utf-8"))

    articles, units, info = parse_book(book, cfg)
    print("\n".join(info))

    out_dir = Path(args.out or f"scripts/import-course/out/codverse/{subject_slug}")
    out_dir.mkdir(parents=True, exist_ok=True)
    meta = []
    for a in articles:
        (out_dir / f"chapter-{a.part:03d}.md").write_text(f"# {a.title}\n\n" + a.markdown, encoding="utf-8")
        meta.append({"chapter": a.part, "title": a.title, "slug": a.slug,
                     "summary": a.summary[:120], "difficulty": a.difficulty, "minutes": a.minutes,
                     "tags": a.tags, "objectives": a.objectives, "takeaways": a.takeaways,
                     "assessment": a.assessment, "warnings": a.warnings})
    for u in units:
        meta.append({"module": u["slug"], "title": u["title"], "parts": u["parts"]})
    (out_dir / "meta.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False), encoding="utf-8")

    seed_ts = ""
    tutorials_json: dict = {}
    if not args.no_seed:
        cfg.setdefault("path", {})["estimatedHours"] = max(1, round(sum(a.minutes for a in articles) / 60))
        seed_path = Path(args.seed or f"prisma/{subject_slug}-seed.ts")
        seed_ts, tutorials_json = generate_seed(articles, units, cfg, seed_path)
    report, ok, has_warnings = preflight(articles, units, seed_ts, tutorials_json, skip_markers=True)
    print("\n".join(report))
    if not ok:
        print("\nHARD ERRORS — seed NOT written")
        return 1
    if has_warnings and not args.force:
        print("\nWARNINGS — pass --force to write the seed")
        return 1
    if not args.no_seed:
        seed_path.write_text(seed_ts, encoding="utf-8")
        print(f"\n✓ seed written: {seed_path}")
        est_hours = round(sum(a.minutes for a in articles) / 60)
        print(f"  estimated: {est_hours}h across {len(articles)} tutorials")
    return 0


if __name__ == "__main__":
    sys.exit(main())