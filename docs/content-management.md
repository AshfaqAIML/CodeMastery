# Content Management

Tutorials are **Markdown** stored in the database, making the knowledge base fully portable.

## Authoring

### Via the admin dashboard

(When admin UI is available) navigate to the admin view → add/edit subject, module, tutorial, quiz, achievement, learning path.

### Via the API

```bash
# Create a tutorial (admin session required)
curl -b cookies.txt -X POST $APP_URL/api/admin/tutorials \
  -H "Content-Type: application/json" \
  --data '{
    "subjectSlug": "python",
    "moduleSlug": "fundamentals",
    "slug": "variables-and-data-types",
    "title": "Variables and Data Types",
    "summary": "Understand Python's dynamic typing and core data types.",
    "content": "# Variables and Data Types\n\n...",
    "difficulty": "beginner",
    "estimatedMinutes": 15,
    "tags": "variables,types,integers,strings",
    "order": 1
  }'
```

### Markdown conventions

Tutorial content is GitHub-flavored Markdown:

```markdown
# Tutorial Title

Short introduction paragraph.

## Section Heading

Explanation.

\`\`\`python
# code block with language tag
x = 10
\`\`\`

### Subsection

More detail.

## Key Takeaways

- Point 1
- Point 2
```

The renderer:
- `## H2` becomes table-of-contents entries
- Code blocks get syntax highlighting via `react-syntax-highlighter`
- Standard Markdown (bold, italic, lists, tables, links) supported

## Export (portable backup)

```bash
curl -b cookies.txt $APP_URL/api/admin/export -o content.json
```

Returns JSON with all subjects, modules, tutorials, quizzes, achievements, and learning paths. This is engine-agnostic — you can import it into any CodeMastery instance regardless of database.

## Import

```bash
curl -b cookies.txt -X POST -H "Content-Type: application/json" \
  --data @content.json \
  $APP_URL/api/admin/import
```

The import is **idempotent** — it upserts by slug, so re-running is safe.

## Content quality guidelines

- **Technically accurate** — no filler, no hallucinated APIs.
- **Beginner-friendly** where difficulty is beginner.
- **Code examples must run** (tested mentally if not actually).
- **Proper heading hierarchy** — one `#`, multiple `##`, `###` under those.
- **Practical** — real-world examples, not toy abstractions.
- **Interview-relevant** for CS fundamentals.
- **800–2000 words** per tutorial.

## Removing content

Delete via the admin API or dashboard. Deletion cascades to progress/bookmarks/notes for that tutorial (per the Prisma schema's `onDelete: Cascade`).
