# Course Import Pipelines

Two pipelines turn Word books into CodeMastery seed files (Prisma upsert TS).

## pipeline.py — structured-course DOCX (article + meta-box format)

For books generated with the CodeMastery course generator: every part is a
`<article class="tutorial">` element, preceded in the DOCX by plain-text
metadata boxes (CURRICULUM POSITION / TUTORIAL METADATA / LEARNING OBJECTIVES).

Usage:

    py scripts/import-course/pipeline.py <book.docx> \
      --config scripts/import-course/courses/<course>.json \
      [--extra <file-or-dir>]            # parts missing from the DOCX, pasted from chat
      [--seed prisma/<course>-seed.ts]   # default prisma/<subject-slug>-seed.ts
      [--no-seed]                        # extract + convert + report only
      [--force]                          # write seed despite warnings (never on hard errors)

Outputs (default `scripts/import-course/out/<course-slug>/`):

    part-NNN.html / part-NNN.md   per-part article HTML + platform markdown
    meta.json                     parsed metadata for every part
    tutorials.json                tutorial records the seed will write
    report.txt                    preflight report

Then run and DB-seed it the usual way:

    bunx tsc --noEmit --skipLibCheck prisma/<course>-seed.ts
    bun prisma/<course>-seed.ts

Key design rules (each one was a real failure mode of the first manual import):

1. **Part numbers come from each article's own header** — never from file
   position or paragraph index. The DOCX omits some parts (they are supplied
   as `--extra` files), so positions do not line up with part numbers.
2. Duplicate part numbers are a hard error.
3. Metadata (objectives/prereqs/takeaways/assessment/summary) is extracted
   from the *same* article whose HTML is converted. Plain-text boxes fill in
   tags, slug, difficulty, minutes, and objectives when the HTML lacks them.
4. Tags accept string or list form (`str` iteration char-splits tags).
5. The course guide is placed at the top of the first unit (order 0).
6. Seed output escapes backticks / `${` / backslashes for TS template
   literals; non-ASCII is written verbatim (UTF-8).

Preflight checks: duplicate/missing parts, duplicate slug (effective DB
slug), empty title/content, reference-box markers in content, balanced code
fences, JSON-serializable list fields, unit containment. Hard errors block
the seed; warnings require `--force`.

### Course config (`courses/<course>.json`)

```jsonc
{
  "course": {          // subject record (slug, name, tagline, ... order)
    "slug": "computer-science-foundations",
    "guideTitle": "Optional override for the course-guide tutorial title"
  },
  "path": {            // learning path record (slug, title, tagline, ... estimatedHours)
    "slug": "computer-science-foundation"
  },
  "slugOverrides": {   // part -> slug, wins over every other slug rule
    "1": "introduction-to-computer-science"
  },
  "units": [           // modules; parts belong to exactly one unit
    { "slug": "unit-a-orientation", "title": "Unit A - Orientation",
      "summary": "...", "parts": [1] }
  ]
}
```

If `units` is omitted the guide's syllabus section (`section.syllabus`,
`h3` unit headings + `li` part references) is parsed into units
(`unit-<letter>` slugs), with an all-parts `course` unit as fallback.

### Extra part files (`--extra`)

A part missing from the DOCX (e.g. pasted from chat, `Books/part-21-*.txt`).
Accepted layouts:

- a raw `<article class="tutorial">` HTML block (optionally preceded by
  plain-text metadata boxes), or
- full chat paste: CURRICULUM POSITION / TUTORIAL METADATA / LEARNING
  OBJECTIVES plain-text boxes followed by the `<article>` block (a trailing
  STATUS box is ignored).

## book.py — plain-chapter DOCX

For books with no article HTML — just headings (`PART N — ...`,
`Chapter N — ...`, `Project N — ...`) and plain-text body paragraphs.
See the JavaScript book at `Books/COMPLETE JAVASCRIPT FOR ABSOLUTE
BEGINNERS1.docx` for the reference layout.

Usage:

    py scripts/import-course/book.py <book.docx> \
      --config scripts/import-course/courses/<course>.json \
      [--seed prisma/<course>-seed.ts]   [--no-seed]  [--force]

Book features handled: PART markers build modules; `PART N Progress`
scaffold (✅/⏳/"Type NEXT") is dropped; Learning Objectives / Chapter
Summary / Key Terms / MCQs / Chapter Introduction / Why This Topic
Matters become metadata fields (objectives, takeaways, tags, questions,
summary, whereItFits) and are excluded from content; real Word tables
become GFM tables; Consolas runs become code — but only when content
hints (statements, `console.`, braces, `=>`) confirm it, otherwise they
are prose; output value blocks after `Label:` lines fence as `text`;
diagrams (arrows/box chars) fence as `text`; MCQs render with options
and answers; restart markers (`Chapter N — ...` appearing again, e.g.
the triplicated Project 7) skip the repeat segment.

Slug/title rules: chapter numbers are part of the slug
(`chapter-5-variables`, `project-3-to-do-list-application`); tutorial
`part` is a global running number, since project and chapter numbers
overlap; difficulty comes from the config's `difficulties` map
(`part-number -> level`), minutes from a words-per-minute heuristic
(clamped 10–90); tags are the Key Terms list. Chapters 31–55 in the
reference book legitimately lack MCQs and 56–58 lack objectives —
preflight reports these as warnings; `--force` writes the seed anyway.

## check-seed-db.ts — verify seed vs live DB

    bun scripts/import-course/check-seed-db.ts [<seed-path>]

Compares the tutorials/modules/path declared in a seed file against the
database (counts, slugs, orders) and prints a diff. Exit code 0 when they
agree. Default compares `prisma/computer-science-foundations-seed.ts`.

## codverse.py — CodeVerse Academy book JSONs

For courses copied from the CodeVerse Academy site. The source books live
in `codverse/books/*.json` (copied verbatim from the other site's
`data/books/`) and are flat block lists of four types — heading /
subheading / paragraph / list — so code and tables arrive flattened back
into text runs.

Usage:

    py -X utf8 scripts/import-course/codverse.py <book> \
      --config courses/codverse/<book>.json \
      [--seed prisma/<slug>-seed.ts]   [--no-seed]  [--force]
    py -X utf8 scripts/import-course/codverse.py --all --force

Handling rules:

- One subject per book JSON, one learning path with all chapters as steps,
  and modules are fixed-size chunks of 12 chapters
  (`part-1`, `part-2`, ... with chapter ranges in the titles).
- Chapter slugs are `chapter-<n>-<slugified-title>`, renumbered sequentially
  over chapters that actually contain content; chapters that are empty in
  the source JSON (ToC stubs / part dividers, e.g. 5 in
  backend-engineering-to-ai-systems) are skipped with an info line.
- Section-aware metadata extraction (same section names as book.py):
  Learning Objectives / Chapter Summary / Key Terms / MCQs / Chapter
  Introduction / Why This Topic Matters. Metadata items may be lists OR
  checkmark-prefixed subheadings — both are captured; lead-in phrases
  ("After completing this chapter, you should be able to:") are dropped.
- MCQs render as question + option list + `**Answer: X**` in content and
  feed `selfAssessment` (`"Q (Answer: X)"`).
- Code re-fencing: blocks that contain code hints (statements, `console.`,
  braces, `def `, `array[n]`, HTML tags) become fenced blocks; the fence
  language comes from content hints (`html`/`py`/`js`/`css`) with a
  per-course fallback (`course.codeLang`, e.g. `"sql"`).
- Summary is the Chapter Introduction prose; tags are the slugified
  Key Terms.
- NUL/control characters (`\u0000`, ...) embedded in the source JSON are
  stripped — PostgreSQL rejects them.
- Difficulty is derived from the book's `level` label (volumes 5–6,
  "Professional", "Book 3" → advanced; "Interview Prep", "Practice Book",
  "Complete Book" → intermediate; anything else → beginner), overridable
  via `course.difficulties` or `course.level`.
- Preflight runs with `skip_markers=True` since these books legitimately
  emit the metadata headings that the DOCX pipelines treat as
  contamination.
- Estimated hours for the path are computed from tutorial minutes.

Course config (`courses/codverse/<book>.json`) adds `domain` (one of the
four DB domain slugs) and `chunkSize` to the shared schema;
`generate_seed()` now reads `domain`, `moduleDifficulty`, and
`path.difficulty` (defaults preserve the older seeds).