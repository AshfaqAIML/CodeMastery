import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

// ============================================================
// AI From Scratch - imported by scripts/import-course/pipeline.py
// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.
// ============================================================

const subject = {
  slug: "ai-from-scratch",
  name: "AI From Scratch",
  tagline: "The complete AI journey — from machine learning fundamentals to production systems.",
  description: "Learn artificial intelligence from first principles: Python, mathematics, data, machine learning, deep learning, vision, NLP, transformers, generative AI, RAG, agents, deployment and AI system design.",
  icon: "BrainCircuit",
  color: "oklch(0.65 0.2 305)",
  category: "AI/ML",
  order: 55,
  modules: [
    {
      slug: "part-1",
      title: "Part 1 — Chapters 1–12",
      summary: "Chapters 1 to 12 of AI From Scratch.",
      order: 1,
      difficulty: "intermediate",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-1-ai-fundamentals-and-your-roadmap",
      title: "AI Fundamentals and Your Roadmap",
      summary: "Artificial intelligence is the broad goal of making systems perform tasks that normally need human judgment. Machine learning is one way to do it: a program learns a pattern from examples instead of receiving every rule by hand.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 0,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# AI Fundamentals and Your Roadmap

## Start with a mental model

Artificial intelligence is the broad goal of making systems perform tasks that normally need human judgment. Machine learning is one way to do it: a program learns a pattern from examples instead of receiving every rule by hand.`,
    },
    {
      slug: "chapter-2-mathematics-for-ai-without-fear",
      title: "Mathematics for AI Without Fear",
      summary: "You do not need to memorize formulas before you can build. Learn each tool through the job it does: vectors represent examples, probability represents uncertainty, statistics summarizes evidence, and calculus tells a model how to improve.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 1,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Mathematics for AI Without Fear

## Math is a language for model behaviour

You do not need to memorize formulas before you can build. Learn each tool through the job it does: vectors represent examples, probability represents uncertainty, statistics summarizes evidence, and calculus tells a model how to improve.`,
    },
    {
      slug: "chapter-3-python-and-data-handling-for-ai",
      title: "Python and Data Handling for AI",
      summary: "Use Python to inspect, clean and transform data before modelling. A small, reproducible notebook or script is more valuable than an unexplained model.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 2,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Python and Data Handling for AI

## Build reproducible habits

Use Python to inspect, clean and transform data before modelling. A small, reproducible notebook or script is more valuable than an unexplained model.`,
    },
    {
      slug: "chapter-4-machine-learning-fundamentals",
      title: "Machine Learning Fundamentals",
      summary: "Supervised learning maps features to known labels. Unsupervised learning searches for structure without labels. Your first target should be a trustworthy baseline, not the most fashionable algorithm.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 3,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Machine Learning Fundamentals

## Models learn a mapping

Supervised learning maps features to known labels. Unsupervised learning searches for structure without labels. Your first target should be a trustworthy baseline, not the most fashionable algorithm.`,
    },
    {
      slug: "chapter-5-supervised-learning-algorithms",
      title: "Supervised Learning Algorithms",
      summary: "Start with linear and logistic regression, then compare local methods, trees and ensembles. There is no universally best model; data size, interpretability, latency and error cost all matter.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 4,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Supervised Learning Algorithms

## Learn from examples with answers

Start with linear and logistic regression, then compare local methods, trees and ensembles. There is no universally best model; data size, interpretability, latency and error cost all matter.`,
    },
    {
      slug: "chapter-6-unsupervised-learning-and-representation",
      title: "Unsupervised Learning and Representation",
      summary: "Unsupervised learning helps explore data, compress features, and discover groups. Treat discovered groups as hypotheses to validate, not automatic truth.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 5,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Unsupervised Learning and Representation

## Find useful structure without answers

Unsupervised learning helps explore data, compress features, and discover groups. Treat discovered groups as hypotheses to validate, not automatic truth.`,
    },
    {
      slug: "chapter-7-evaluation-features-and-improvement",
      title: "Evaluation, Features and Improvement",
      summary: "Good evaluation connects model errors to the decision being made. Feature engineering converts raw information into useful, available-at-prediction-time signals.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 6,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Evaluation, Features and Improvement

## Measure the errors that matter

Good evaluation connects model errors to the decision being made. Feature engineering converts raw information into useful, available-at-prediction-time signals.`,
    },
    {
      slug: "chapter-8-deep-learning-and-neural-networks",
      title: "Deep Learning and Neural Networks",
      summary: "A neuron computes a weighted sum, adds a bias, then applies an activation. A network stacks these transformations to learn complex patterns. Training means reducing a loss with gradient-based optimization.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 7,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Deep Learning and Neural Networks

## From one neuron to a trainable network

A neuron computes a weighted sum, adds a bias, then applies an activation. A network stacks these transformations to learn complex patterns. Training means reducing a loss with gradient-based optimization.`,
    },
    {
      slug: "chapter-9-computer-vision",
      title: "Computer Vision",
      summary: "Images are arrays of pixel values. A color image usually has red, green and blue channels. Vision systems must handle lighting, viewpoint, backgrounds and data quality.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 8,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Computer Vision

## Teach systems to work with images

Images are arrays of pixel values. A color image usually has red, green and blue channels. Vision systems must handle lighting, viewpoint, backgrounds and data quality.`,
    },
    {
      slug: "chapter-10-natural-language-processing",
      title: "Natural Language Processing",
      summary: "NLP converts text into representations a model can use while preserving enough meaning for the task. Meaning depends on context, language, domain and the people represented in the data.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 9,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Natural Language Processing

## Language needs representation

NLP converts text into representations a model can use while preserving enough meaning for the task. Meaning depends on context, language, domain and the people represented in the data.`,
    },
    {
      slug: "chapter-11-transformers-from-intuition-to-architecture",
      title: "Transformers From Intuition to Architecture",
      summary: "Transformers use attention instead of processing every token strictly one at a time. This makes training highly parallel and gives the model flexible access to context.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 10,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Transformers From Intuition to Architecture

## Attention lets a token look at relevant context

Transformers use attention instead of processing every token strictly one at a time. This makes training highly parallel and gives the model flexible access to context.`,
    },
    {
      slug: "chapter-12-generative-ai-and-llm-fundamentals",
      title: "Generative AI and LLM Fundamentals",
      summary: "Generative models learn a distribution that can produce new text, images, audio or structured content. Large language models predict the next token repeatedly, then are adapted to be useful in conversation and tools.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 11,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Generative AI and LLM Fundamentals

## Generate, do not merely classify

Generative models learn a distribution that can produce new text, images, audio or structured content. Large language models predict the next token repeatedly, then are adapted to be useful in conversation and tools.`,
    },
      ],
    },
    {
      slug: "part-2",
      title: "Part 2 — Chapters 13–17",
      summary: "Chapters 13 to 17 of AI From Scratch.",
      order: 2,
      difficulty: "intermediate",
      estimatedMinutes: 150,
      tutorials: [
    {
      slug: "chapter-13-retrieval-augmented-generation-rag",
      title: "Retrieval-Augmented Generation (RAG)",
      summary: "RAG retrieves relevant information at request time and supplies it to an LLM. It is useful when knowledge changes, needs citations, or must come from trusted private documents.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 12,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Retrieval-Augmented Generation (RAG)

## Give the model grounded context

RAG retrieves relevant information at request time and supplies it to an LLM. It is useful when knowledge changes, needs citations, or must come from trusted private documents.`,
    },
    {
      slug: "chapter-14-ai-agents-and-tool-using-workflows",
      title: "AI Agents and Tool-Using Workflows",
      summary: "An AI agent observes context, selects a next action, may call a tool, records the result, and decides whether to continue. A chatbot can be an agent, but an agent differs by reliably acting through bounded tools and workflows.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 13,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# AI Agents and Tool-Using Workflows

## An agent is an orchestrated loop

An AI agent observes context, selects a next action, may call a tool, records the result, and decides whether to continue. A chatbot can be an agent, but an agent differs by reliably acting through bounded tools and workflows.`,
    },
    {
      slug: "chapter-15-deployment-and-mlops-fundamentals",
      title: "Deployment and MLOps Fundamentals",
      summary: "Serving a model safely needs more than saving weights. You need versioned artifacts, an API contract, reproducible environments, observability, security and a rollback plan.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 14,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Deployment and MLOps Fundamentals

## A model becomes a product through engineering

Serving a model safely needs more than saving weights. You need versioned artifacts, an API contract, reproducible environments, observability, security and a rollback plan.`,
    },
    {
      slug: "chapter-16-ai-system-design",
      title: "AI System Design",
      summary: "A robust AI system makes requirements, data flow, storage, model boundaries, APIs, caching, monitoring and failure handling explicit before implementation.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 15,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# AI System Design

## Design around the decision, not the model

A robust AI system makes requirements, data flow, storage, model boundaries, APIs, caching, monitoring and failure handling explicit before implementation.`,
    },
    {
      slug: "chapter-17-real-world-projects-and-interview-preparation",
      title: "Real-World Projects and Interview Preparation",
      summary: "Projects demonstrate your ability to define a problem, make choices, evaluate results and communicate limitations. Build fewer projects with clearer evidence rather than many cloned notebooks.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 16,
      tags: "ai-from-scratch",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Real-World Projects and Interview Preparation

## Turn learning into evidence

Projects demonstrate your ability to define a problem, make choices, evaluate results and communicate limitations. Build fewer projects with clearer evidence rather than many cloned notebooks.`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 — Chapters 1–12", title: "AI Fundamentals and Your Roadmap", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 0, tutorialSlug: "chapter-1-ai-fundamentals-and-your-roadmap" },
  { part: "Part 1 — Chapters 1–12", title: "Mathematics for AI Without Fear", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 1, tutorialSlug: "chapter-2-mathematics-for-ai-without-fear" },
  { part: "Part 1 — Chapters 1–12", title: "Python and Data Handling for AI", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 2, tutorialSlug: "chapter-3-python-and-data-handling-for-ai" },
  { part: "Part 1 — Chapters 1–12", title: "Machine Learning Fundamentals", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 3, tutorialSlug: "chapter-4-machine-learning-fundamentals" },
  { part: "Part 1 — Chapters 1–12", title: "Supervised Learning Algorithms", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 4, tutorialSlug: "chapter-5-supervised-learning-algorithms" },
  { part: "Part 1 — Chapters 1–12", title: "Unsupervised Learning and Representation", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 5, tutorialSlug: "chapter-6-unsupervised-learning-and-representation" },
  { part: "Part 1 — Chapters 1–12", title: "Evaluation, Features and Improvement", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 6, tutorialSlug: "chapter-7-evaluation-features-and-improvement" },
  { part: "Part 1 — Chapters 1–12", title: "Deep Learning and Neural Networks", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 7, tutorialSlug: "chapter-8-deep-learning-and-neural-networks" },
  { part: "Part 1 — Chapters 1–12", title: "Computer Vision", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 8, tutorialSlug: "chapter-9-computer-vision" },
  { part: "Part 1 — Chapters 1–12", title: "Natural Language Processing", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 9, tutorialSlug: "chapter-10-natural-language-processing" },
  { part: "Part 1 — Chapters 1–12", title: "Transformers From Intuition to Architecture", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 10, tutorialSlug: "chapter-11-transformers-from-intuition-to-architecture" },
  { part: "Part 1 — Chapters 1–12", title: "Generative AI and LLM Fundamentals", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 11, tutorialSlug: "chapter-12-generative-ai-and-llm-fundamentals" },
  { part: "Part 2 — Chapters 13–17", title: "Retrieval-Augmented Generation (RAG)", subtitle: "Part of Part 2 — Chapters 13–17 · Intermediate", order: 12, tutorialSlug: "chapter-13-retrieval-augmented-generation-rag" },
  { part: "Part 2 — Chapters 13–17", title: "AI Agents and Tool-Using Workflows", subtitle: "Part of Part 2 — Chapters 13–17 · Intermediate", order: 13, tutorialSlug: "chapter-14-ai-agents-and-tool-using-workflows" },
  { part: "Part 2 — Chapters 13–17", title: "Deployment and MLOps Fundamentals", subtitle: "Part of Part 2 — Chapters 13–17 · Intermediate", order: 14, tutorialSlug: "chapter-15-deployment-and-mlops-fundamentals" },
  { part: "Part 2 — Chapters 13–17", title: "AI System Design", subtitle: "Part of Part 2 — Chapters 13–17 · Intermediate", order: 15, tutorialSlug: "chapter-16-ai-system-design" },
  { part: "Part 2 — Chapters 13–17", title: "Real-World Projects and Interview Preparation", subtitle: "Part of Part 2 — Chapters 13–17 · Intermediate", order: 16, tutorialSlug: "chapter-17-real-world-projects-and-interview-preparation" },
]

async function main() {
  const domain = await db.domain.findUnique({ where: { slug: "artificial-intelligence" } })
  const srec = await db.subject.upsert({
    where: { slug: subject.slug },
    create: { slug: subject.slug, name: subject.name, tagline: subject.tagline, description: subject.description, icon: subject.icon, color: subject.color, category: subject.category, order: subject.order, published: true, domainId: domain?.id ?? null },
    update: { name: subject.name, tagline: subject.tagline, description: subject.description, icon: subject.icon, color: subject.color, category: subject.category, order: subject.order, domainId: domain?.id ?? null },
  })
  console.log(`  ✓ Subject: ${srec.name}`)

  for (const m of subject.modules) {
    const mrec = await db.module.upsert({
      where: { subjectId_slug: { subjectId: srec.id, slug: m.slug } },
      create: { subjectId: srec.id, slug: m.slug, title: m.title, summary: m.summary, order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes },
      update: { title: m.title, summary: m.summary, order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes },
    })
    for (const t of m.tutorials) {
      await db.tutorial.upsert({
        where: { subjectId_slug: { subjectId: srec.id, slug: t.slug } },
        create: { subjectId: srec.id, moduleId: mrec.id, slug: t.slug, title: t.title, summary: t.summary, content: t.content, difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes, tags: t.tags, order: t.order, published: true, learningObjectives: JSON.stringify(t.learningObjectives), prerequisites: JSON.stringify(t.prerequisites), whereItFits: t.whereItFits, keyTakeaways: JSON.stringify(t.keyTakeaways), selfAssessment: JSON.stringify(t.selfAssessment) },
        update: { title: t.title, summary: t.summary, content: t.content, difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes, tags: t.tags, order: t.order, moduleId: mrec.id, learningObjectives: JSON.stringify(t.learningObjectives), prerequisites: JSON.stringify(t.prerequisites), whereItFits: t.whereItFits, keyTakeaways: JSON.stringify(t.keyTakeaways), selfAssessment: JSON.stringify(t.selfAssessment) },
      })
      console.log(`      ✓ ${t.slug}`)
    }
  }

  const path = await db.learningPath.upsert({
    where: { slug: "ai-from-scratch-path" },
    create: { slug: "ai-from-scratch-path", title: "AI From Scratch Roadmap", tagline: "The complete roadmap for AI From Scratch - all parts in order.", description: "The complete roadmap for AI From Scratch - all parts in order.", icon: "BrainCircuit", color: "oklch(0.65 0.2 305)", difficulty: 'intermediate', estimatedHours: 3, published: true },
    update: { title: "AI From Scratch Roadmap", tagline: "The complete roadmap for AI From Scratch - all parts in order.", description: "The complete roadmap for AI From Scratch - all parts in order.", icon: "BrainCircuit", color: "oklch(0.65 0.2 305)", difficulty: 'intermediate', estimatedHours: 3 },
  })
  await db.learningPathPart.deleteMany({ where: { pathId: path.id } })
  await db.learningPathStep.deleteMany({ where: { pathId: path.id } })
  const partIds: Record<string, string> = {}
  for (const unit of subject.modules) {
    const pr = await db.learningPathPart.create({ data: { pathId: path.id, slug: unit.slug, title: unit.title, summary: unit.summary, order: unit.order } })
    partIds[unit.title] = pr.id
  }
  for (const st of pathSteps) {
    const tut = await db.tutorial.findUnique({ where: { subjectId_slug: { subjectId: srec.id, slug: st.tutorialSlug } } })
    await db.learningPathStep.create({ data: { pathId: path.id, partId: partIds[st.part], tutorialId: tut?.id ?? null, title: st.title, subtitle: st.subtitle, order: st.order } })
  }
  console.log(`  ✓ Learning path: ${path.title} (${pathSteps.length} steps)`)

  const counts = {
    subjects: await db.subject.count(),
    modules: await db.module.count(),
    tutorials: await db.tutorial.count(),
    paths: await db.learningPath.count(),
    pathSteps: await db.learningPathStep.count(),
  }
  console.log("🎉 Seed complete:", counts)
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
