/**
 * CodeMastery content seed.
 *
 * Real, technically-accurate Computer Science content. Idempotent via upsert.
 * Run with: bun run prisma/seed.ts
 *
 * This is the portable content — it can also be exported via /api/admin/export
 * and imported elsewhere.
 */
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

type SubjectInput = {
  slug: string
  name: string
  tagline: string
  description: string
  icon: string
  color: string
  category: string
  order: number
  modules: {
    slug: string
    title: string
    summary: string
    order: number
    difficulty: string
    estimatedMinutes: number
    tutorials: TutorialInput[]
  }[]
}

type TutorialInput = {
  slug: string
  title: string
  summary: string
  content: string
  difficulty: string
  estimatedMinutes: number
  tags: string
  order: number
  // --- Pedagogical metadata (curriculum-aware architecture) ---
  learningObjectives?: string[]
  prerequisites?: { label: string; subjectSlug?: string; tutorialSlug?: string }[]
  whereItFits?: string
  keyTakeaways?: string[]
  selfAssessment?: string[]
  quizzes?: {
    title: string
    description: string
    passingScore: number
    xpReward: number
    questions: {
      prompt: string
      options: string[]
      answerIndex: number
      explanation?: string
      order: number
    }[]
  }[]
}

// ============================================================
// DOMAINS — top of the content hierarchy
// ============================================================

const domains = [
  {
    slug: "computer-science",
    name: "Computer Science",
    tagline: "The foundations of computing — languages, systems, and algorithms.",
    description:
      "Master the core of computer science: programming languages, data structures, algorithms, operating systems, computer architecture, and networks. This domain covers everything from writing your first program to understanding how the hardware executes it.",
    icon: "Cpu",
    color: "oklch(0.62 0.15 162)",
    order: 1,
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    tagline: "Machine learning, deep learning, and large language models.",
    description:
      "Build intelligent systems. This domain covers the full AI stack — from classical machine learning algorithms through deep neural networks to modern large language models, prompt engineering, and retrieval-augmented generation.",
    icon: "BrainCircuit",
    color: "oklch(0.65 0.2 305)",
    order: 2,
  },
  {
    slug: "data-science",
    name: "Data Science",
    tagline: "Working with data — storage, querying, and modelling.",
    description:
      "Learn how to store, query, model, and manage data at scale. This domain covers SQL, database design, normalization, transactions, indexing, and the data engineering foundations that every backend and data professional needs.",
    icon: "Database",
    color: "oklch(0.7 0.13 200)",
    order: 3,
  },
  {
    slug: "software-engineering",
    name: "Software Engineering",
    tagline: "Building, scaling, and shipping production software.",
    description:
      "The engineering practices behind real-world software. This domain covers web development, software engineering practices (Git, testing), system design, and technical interview preparation — the skills that turn code into shipped products.",
    icon: "Workflow",
    color: "oklch(0.75 0.16 85)",
    order: 4,
  },
]

// Mapping from subject slug → domain slug. Keeps each Subject block
// unchanged while attaching it to the correct Domain.
const subjectDomain: Record<string, string> = {
  "computer-fundamentals": "computer-science",
  "c-programming": "computer-science",
  "python": "computer-science",
  "data-structures": "computer-science",
  "algorithms": "computer-science",
  "cpp": "computer-science",
  "java": "computer-science",
  "javascript": "computer-science",
  "typescript": "computer-science",
  "computer-architecture": "computer-science",
  "operating-systems": "computer-science",
  "computer-networks": "computer-science",
  "machine-learning": "artificial-intelligence",
  "deep-learning": "artificial-intelligence",
  "llms": "artificial-intelligence",
  "sql": "data-science",
  "dbms": "data-science",
  "system-design": "software-engineering",
  "web-development": "software-engineering",
  "software-engineering": "software-engineering",
  "interview-prep": "software-engineering",

  // --- NEW SUBJECTS — added in ADD-COURSES-1 ---
  // computer-science domain
  "programming": "computer-science",
  "object-oriented-programming": "computer-science",
  "mathematics-for-computing-and-ai": "computer-science",
  "programming-language-theory": "computer-science",
  "compiler-design": "computer-science",
  "parallel-and-high-performance-computing": "computer-science",
  "embedded-systems-and-iot": "computer-science",

  // software-engineering domain
  "backend-development": "software-engineering",
  "frontend-development": "software-engineering",
  "mobile-development": "software-engineering",
  "cloud-computing": "software-engineering",
  "devops": "software-engineering",
  "devsecops": "software-engineering",
  "software-architecture": "software-engineering",
  "testing-and-quality-engineering": "software-engineering",
  "git-github-and-developer-tools": "software-engineering",
  "distributed-systems": "software-engineering",
  "ui-ux-and-product-engineering": "software-engineering",
  "projects-and-practical-engineering": "software-engineering",
  "blockchain-and-web3": "software-engineering",
  "cybersecurity": "software-engineering",

  // artificial-intelligence domain
  "computer-vision": "artificial-intelligence",
  "natural-language-processing": "artificial-intelligence",
  "generative-ai": "artificial-intelligence",
  "ai-agents": "artificial-intelligence",
  "agentic-ai": "artificial-intelligence",
  "mlops": "artificial-intelligence",

  // data-science domain
  "data-science": "data-science",
  "data-engineering": "data-science",
  "big-data": "data-science",
}

// ============================================================
// SUBJECTS + MODULES + TUTORIALS
// ============================================================

const subjects: SubjectInput[] = [
  // ---------------- COMPUTER FUNDAMENTALS ----------------
  {
    slug: "computer-fundamentals",
    name: "Computer Fundamentals",
    tagline: "How computers work — from bits to programs.",
    description:
      "A complete, beginner-friendly foundation covering how computers represent information, how hardware works, how software runs, and how modern systems fit together. No prior Computer Science knowledge is assumed.",
    icon: "Cpu",
    color: "oklch(0.62 0.15 162)",
    category: "Foundations",
    order: 0,
    modules: [
      {
        slug: "introduction-to-computer-science",
        title: "Introduction to Computer Science",
        summary: "What CS is, what a computer is, and why it matters.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 120,
        tutorials: [
          {
            slug: "what-is-computer-science",
            title: "Introduction to Computer Science: What It Is and Why It Matters",
            summary: "What Computer Science is, what a computer is, what computers can and cannot do, and why CS matters.",
            learningObjectives: [
              "Define Computer Science, computation, and algorithm in your own words.",
              "Explain what a computer is using the input → processing → output model.",
              "Distinguish data, input, output, program, hardware, and software.",
              "List at least three things computers excel at and three things they cannot do.",
              "Differentiate Computer Science from Computer Engineering, IT, Software Engineering, Data Science, and AI.",
              "Describe the major areas of Computer Science and how they stack on each other.",
              "Connect this foundation to a target specialization (backend, data, or AI engineering).",
            ],
            prerequisites: [
              { label: "None. This course starts from first principles." },
              { label: "Helpful but not required: Comfort with basic arithmetic." },
              { label: "Helpful but not required: Access to any computer or smartphone (for observation exercises)." },
            ],
            whereItFits:
              "This is Part 1 of the Computer Science Foundations course — the very first tutorial in the Computer Fundamentals subject. It assumes zero prior CS knowledge and lays the vocabulary and mental models that every later tutorial (CPUs, memory, networks, databases, AI) builds on. Next, you will move on to Part 2: History and Evolution of Computing, which traces computing from the abacus to modern AI.",
            keyTakeaways: [
              "Computation = input + rules + output.",
              "An algorithm is a precise, finite recipe a machine can follow exactly.",
              "A computer accepts input, follows a stored program, and produces output — with storage.",
              "Problem solving comes first; code is just how solutions are expressed.",
              "Every advanced topic in the curriculum builds on these foundational definitions.",
            ],
            selfAssessment: [
              "I can define Computer Science, computation, and algorithm in my own words.",
              "I can explain what a computer is using input, processing, and output.",
              "I can name two things computers cannot do and why.",
              "I can distinguish CS from IT, Software Engineering, Data Science, and AI.",
              "I can explain why this foundation matters for my target career.",
            ],
            content: `# Introduction to Computer Science: What It Is and Why It Matters

Before touching hardware, code, or networks, we answer the most basic questions: What is Computer Science? What is a computer? What can computers do — and what can they not do? This tutorial builds the mental foundation for everything that follows.

## 1.1 What Is Computer Science?

The name is slightly misleading. Computer Science is not primarily the study of computers, just as astronomy is not the study of telescopes. Computers are the *tool*. The subject itself is about something deeper:

> info: **Computer Science:** The study of *computation* — how problems can be solved by following precise, step-by-step procedures, and how those procedures can be carried out automatically by machines.

That definition contains two words we must explain immediately: **computation** and **step-by-step procedures**.

**Computation** simply means: taking some input, following definite rules, and producing an output. When you add 7 + 5 and get 12, you performed a computation. The input was "7 + 5", the rule was addition, and the output was 12.

A **step-by-step procedure** for solving a problem has a technical name: an **algorithm**.

> info: **Algorithm:** A precise, finite sequence of steps that solves a problem. Each step must be clear, and the procedure must eventually finish.

> analogy: An algorithm is like a recipe. A recipe lists exact steps in an exact order: crack the eggs, whisk them, heat the pan, pour, cook. If someone follows the recipe precisely, they get the same result every time. An algorithm is a "recipe" for solving a problem — and unlike a human cook, a computer follows the recipe *exactly*, with no improvisation.

So a more complete picture of Computer Science is:

- **Designing algorithms** — finding good step-by-step solutions to problems.
- **Representing information** — figuring out how numbers, text, images, and sound can be stored and processed.
- **Building systems** — organizing hardware and software so computations happen reliably and efficiently.
- **Understanding limits** — knowing what can be computed, what cannot, and how fast.

> important: **Key idea:** Computer Science is fundamentally about **problem solving**. Programming (writing code) is one of its most important tools, but the thinking comes first. A person who can code but cannot design solutions is a tool operator; a computer scientist designs the solution and then uses code to express it.

## 1.2 What Is Computing?

**Computing** is the act of performing computation — especially with the help of machines. Humans computed long before computers existed: accountants computed taxes, navigators computed positions using stars, and teams of people called "computers" (yes, that word once described a job title) calculated artillery tables by hand.

Modern computing means **automating** that process: instead of a person doing each step, we record the steps once and let a fast, tireless machine repeat them billions of times per second.

This is the core value of computing: once you turn a task into an algorithm, a machine can repeat it forever without getting tired, bored, or careless — as long as the instructions are correct.

## 1.3 What Is a Computer?

Now we can define the machine itself precisely.

> info: **Computer:** An electronic machine that accepts **data** (input), follows stored instructions called a **program** to process that data, and produces results (output).

Four terms in that definition need immediate explanation:

- **Data** — Raw facts and values: numbers, text, measurements, clicks, temperatures. Data by itself has no meaning yet — it becomes meaningful when processed.
- **Input** — Any data entering the computer: a key press, a mouse movement, a voice recording, a temperature reading.
- **Output** — Any result the computer produces: text on a screen, sound from a speaker, a sent message, a printed page.
- **Program** — A stored list of instructions telling the computer what to do with the input, step by step.

Two more terms you will see constantly:

- **Hardware** — The physical parts of a computer you can touch: chips, wires, screens, keyboards.
- **Software** — The intangible instructions that run on the hardware: operating systems, apps, games. Software is "soft" because it can be changed without touching the machine physically.

Every computer, from the largest server to the smallest smart watch, follows the same basic pattern:

\`\`\`text
Input  →  Processing  →  Output
             ↑
          Storage
\`\`\`

**Storage** is where data and programs are kept, either temporarily while working or permanently for later use. This simple diagram is the skeleton of every computer system you will ever study.

> tip: **Important:** A computer is *not* only a laptop or desktop. The chips inside cars, televisions, washing machines, routers, and traffic lights are computers too. When a computer is built into another device to control it, we call it an **embedded computer** — "embedded" meaning built into something else.

## 1.4 What Does a Computer Scientist Do?

Computer scientists use the ideas above to solve real problems. Their work typically falls into a few categories:

- **Designing algorithms and software** — creating the step-by-step logic behind search engines, games, banking systems, and medical tools.
- **Building systems** — making many computers and programs work together reliably: networks, databases, cloud platforms.
- **Working with data and intelligence** — building systems that learn patterns from data (machine learning) and systems that understand or generate language and images (AI).
- **Research** — discovering what is computable, how to make computation faster, safer, or smaller.
- **Applying computing to other fields** — biology (analyzing DNA), finance (modeling markets), climate science (simulating weather), art (generative tools).

Notice that "typing code" is only a small visible slice of this work. Most of the real work happens *before* code: understanding the problem, designing a solution, and choosing the right structures and trade-offs.

## 1.5 What Can Computers Do?

Computers are extraordinarily good at a specific set of things:

- **Arithmetic at extreme speed** — billions of calculations per second.
- **Storing and retrieving data** — huge amounts, with near-perfect recall.
- **Repeating tasks without fatigue** — the same operation a million times with no loss of accuracy.
- **Communication** — moving data across the world in milliseconds.
- **Automation** — performing scheduled or triggered actions without human involvement.
- **Simulation** — modeling weather, crashes, economies, or neural networks before doing them in reality.
- **Pattern recognition** — with machine learning, finding patterns in data that are difficult to hand-code.

## 1.6 What Can Computers NOT Do?

Understanding limitations is just as important as understanding capabilities. Five limits matter most for beginners:

1. **Computers only follow instructions.** If the instructions are wrong or ambiguous, the result is wrong. Computers do not "guess what you meant." There is a famous phrase for this: *garbage in, garbage out* — bad input or bad instructions produce bad results.
2. **Computers depend on the data they are given.** A system trained on biased or incomplete data will produce biased or incomplete decisions.
3. **Some problems are unsolvable by any computer.** At a basic level, certain questions are proven to have no possible algorithm that always answers them correctly. Computation has hard mathematical limits.
4. **Physical limits exist.** Signals cannot travel faster than light, chips produce heat, and components can only be made so small. These limits shape how fast computers can become.
5. **Computers do not truly understand.** Modern AI can generate impressive text and images, but it works by recognizing and producing patterns in data. It does not have beliefs, intentions, or genuine understanding the way a person does.

> warning: **Common misconception:** Treating AI output as proof of understanding. Modern AI produces patterns that *look* human — but pattern-matching is not the same as comprehension.

## 1.7 Why Computer Science Matters

Computing is now the backbone of nearly every field:

- **Medicine** — imaging, diagnostics, drug discovery.
- **Finance** — payments, fraud detection, trading systems.
- **Communication** — messaging, video calls, social platforms.
- **Science** — climate modeling, genomics, space exploration.
- **Entertainment** — games, streaming, recommendation systems.
- **Transportation** — navigation, traffic control, autonomous vehicles.

For you personally, this foundation matters because every advanced role you might target — backend engineer, data scientist, ML engineer, AI agent engineer — is built on these concepts. Engineers who understand foundations learn new tools faster, debug deeper, and design better systems.

## 1.8 Computer Science vs Related Fields

Several fields overlap with Computer Science, and beginners often mix them up. Let's define each one before comparing them.

- **Computer Science (CS)** — The study of computation itself: algorithms, data, systems, and what can be automated. It is the theoretical and practical core from which the others grow.
- **Computer Engineering (CE)** — The design of physical computer systems: circuits, chips, processors, and the boundary where hardware meets software. A computer engineer might design the chip inside a phone.
- **Information Technology (IT)** — The use and management of computer systems to support organizations: setting up networks, maintaining servers, supporting users, keeping systems secure and running.
- **Software Engineering (SE)** — The disciplined practice of building reliable, maintainable software in teams: requirements, design, testing, version control, deployment, and maintenance.
- **Data Science (DS)** — The practice of extracting knowledge from data, combining programming, statistics, and domain expertise — for example, analyzing customer behavior to predict sales.
- **Artificial Intelligence (AI)** — A branch of Computer Science focused on building systems that perform tasks normally requiring human-like intelligence: recognizing speech, making decisions, generating text. Machine learning is its most important modern approach.

| Field | Core question it asks | Primary focus | Typical work | Simple example |
|-------|----------------------|---------------|--------------|----------------|
| Computer Science | What can be computed, and how efficiently? | Algorithms, data, systems, theory | Designing solutions, research, building software | Designing a faster search algorithm |
| Computer Engineering | How do we build the machine itself? | Hardware, chips, embedded systems | Designing circuits and processors | Designing a phone's processor chip |
| Information Technology | How do we keep systems running for an organization? | Infrastructure, support, administration | Managing networks, servers, user support | Setting up a company's email and network |
| Software Engineering | How do we build software reliably at scale? | Process, quality, teamwork, maintenance | Developing, testing, deploying applications | Building and maintaining a banking app |
| Data Science | What can we learn from this data? | Analysis, statistics, prediction | Analyzing datasets, building predictive models | Predicting which customers will churn |
| Artificial Intelligence | How can machines perform intelligent tasks? | Learning, perception, language, decision-making | Training models, building intelligent features | Building a spam filter that learns from examples |

> info: **How they relate:** Computer Science is the trunk of the tree. Computer Engineering builds the hardware it runs on; Software Engineering turns CS ideas into dependable products; IT operates those products; Data Science and AI are specialized branches growing out of CS. In practice, real jobs often blend several of these.

## 1.9 The Major Areas of Computer Science

Inside Computer Science itself, work is organized into several major areas:

- **Theory of computation** — the mathematics of what can and cannot be computed, and how efficiently.
- **Algorithms and data structures** — efficient problem-solving procedures and the ways of organizing data.
- **Programming languages** — how humans write instructions computers can eventually execute.
- **Computer systems** — hardware architecture, operating systems, and networks.
- **Databases** — storing, organizing, and querying large amounts of data reliably.
- **Artificial intelligence and machine learning** — systems that learn from data.
- **Security** — protecting systems and data from attacks and mistakes.
- **Human-computer interaction and graphics** — how people experience and visualize computing.
- **Software engineering** — building software systematically in teams.

## 1.10 How the Areas Connect

These areas are not isolated. They stack on each other:

\`\`\`text
Theory (what is computable?)
   ↓
Algorithms (how do we solve problems?)
   ↓
Programming languages (how do we express solutions?)
   ↓
Systems: OS, networks, databases (where do solutions run?)
   ↓
Applications: AI, security, web, mobile (what do we build?)
\`\`\`

Every application at the top — an AI chatbot, a banking app, a video game — ultimately depends on every layer beneath it. When you understand the layers, complex systems stop being mysterious.

> diagram: The layers of Computer Science — Theory at the bottom, Applications at the top — each building on the one below.

## 1.11 How This Course Connects to Your Goals

Whatever path you are aiming for, here is where this course plugs in:

- **Software / Backend / Full-Stack Engineer:** programming and how code runs, OS and files, networking and databases, software engineering and APIs, cloud and distributed systems.
- **Data Analyst / Data Scientist:** data representation, algorithms and data structures, databases, ML foundations.
- **ML / AI / LLM / Agentic AI Engineer:** everything above, plus concurrency and distributed systems, and AI, LLMs, RAG, and agents — and then the dedicated AI curriculum that follows this subject.

> tip: **Tip:** You do not need to choose a specialization today. Foundations are shared by all of them. Finish this course first; the right direction becomes much clearer once you understand the map.

## Where This Knowledge Is Used Later

- **Every later part of this course** — the input → process → output model reappears in CPU, OS, and networking tutorials.
- **C and C++** — understanding hardware/software separation explains why these languages behave the way they do.
- **Algorithms and DSA** — the concept of an algorithm introduced here is the core of that entire subject.
- **AI and LLMs** — knowing what computers can and cannot do keeps your mental model of AI accurate.
- **Career decisions** — the field comparison helps you choose your specialization later.

## Common Beginner Mistakes

1. **Believing Computer Science is the same as learning to code.** Coding is the most visible part of CS, so it looks like the whole thing. *Better approach:* Treat coding as a language for expressing ideas. The deeper skill is designing correct, efficient solutions.
2. **Thinking a "computer" only means a laptop or desktop.** Those are the computers we see daily. *Better approach:* Remember the definition: any machine that accepts input, follows a program, and produces output. Phones, routers, cars, and smart appliances all qualify.
3. **Treating CS, IT, and Software Engineering as synonyms.** Job titles in the industry are often used loosely. *Better approach:* Use the comparison table in section 1.8. The fields overlap in practice, but their core questions differ.
4. **Assuming AI systems "understand" like humans.** AI output looks human-like and fluent. *Better approach:* Remember: current AI finds and produces patterns from data. That makes it powerful, but not conscious or truly understanding.

## Check Your Understanding

### Practical Questions

1. Explain Computer Science in one sentence without using the word "computer".
2. What is the difference between data and a program?
3. Give three examples of computers that are not laptops or desktops.
4. Name one thing computers are excellent at and one thing they are fundamentally bad at.
5. Which field would you contact if your company's network stopped working: CS research, IT, or AI?

### Mini Exercises

1. Write a 5-step algorithm for making tea. Be precise: imagine a machine that understands nothing and follows your steps literally. Notice where your instructions are ambiguous.
2. Look around your room and list every embedded computer you can find (hint: anything with a screen, sensor, or remote control is a candidate).
3. Draw the diagram: Input → Processing → Output, with Storage feeding into Processing. Label one real example under each box (for instance: key press → calculator app → screen result).

## Summary

- Computer Science is the study of computation and problem solving, not merely the study of computers.
- An algorithm is a precise, finite sequence of steps that solves a problem.
- A computer accepts input, follows a stored program, and produces output.
- Hardware is the physical machine; software is the instructions that run on it.
- Computers excel at speed, repetition, storage, and communication, but they only follow instructions and have hard limits.
- CS, Computer Engineering, IT, Software Engineering, Data Science, and AI are related but distinct fields.
- The areas of CS stack on each other: theory → algorithms → programming → systems → applications.

## Next Steps

Continue to **Part 2 — History and Evolution of Computing**. We will see how humanity went from the abacus to transistors, microprocessors, the Internet, and generative AI — and why each step mattered.`,
            difficulty: "beginner",
            estimatedMinutes: 25,
            tags: "computer-science,foundations,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },
  // ---------------- C PROGRAMMING ----------------
  {
    slug: "c-programming",
    name: "C Programming",
    tagline: "The foundational language of systems programming.",
    description:
      "Learn C — the language behind operating systems, compilers, and embedded devices. Master memory, pointers, and low-level control.",
    icon: "Binary",
    color: "oklch(0.62 0.15 162)",
    category: "Programming",
    order: 1,
    modules: [
      {
        slug: "fundamentals",
        title: "C Fundamentals",
        summary: "Syntax, types, control flow, and functions.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "introduction-to-c",
            title: "Introduction to C",
            summary: "What C is, why it matters, and your first program.",
            learningObjectives: [
              "Explain what C is and why it remains relevant in modern computing.",
              "Identify the key characteristics of C: compiled, statically typed, low-level.",
              "Write, compile, and run a basic C program using GCC.",
              "Describe the role of the main() function and the return 0 statement.",
              "Recognise real-world systems that are written in C.",
            ],
            prerequisites: [
              { label: "Basic familiarity with using a terminal / command line" },
              { label: "A C compiler installed (GCC or Clang)" },
            ],
            whereItFits:
              "This is the very first tutorial in the C Fundamentals module and the Computer Science domain. It assumes no prior programming experience. After this tutorial you will move on to Variables and Data Types, where you will learn how C stores and represents information.",
            keyTakeaways: [
              "C is a compiled, statically-typed, general-purpose language created in 1972.",
              "It sits one step above assembly, giving direct memory and hardware control.",
              "The Linux kernel, SQLite, Git, and CPython are all written in C.",
              "Every C program starts execution from the main() function.",
              "return 0 signals to the operating system that the program succeeded.",
            ],
            selfAssessment: [
              "I can explain in one sentence what C is and why it is still used.",
              "I can write and compile a Hello World program without referencing notes.",
              "I can describe what the preprocessor, compiler, and linker each do.",
              "I can list at least three real-world systems written in C.",
            ],
            content: `# Introduction to C

C is a general-purpose, compiled, statically-typed programming language created by Dennis Ritchie at Bell Labs in 1972. It sits one step above assembly language, giving programmers direct control over memory and hardware while remaining portable across platforms.

## Why C Still Matters

C is the foundation of modern computing. The Linux kernel, SQLite, Git, the Python interpreter (CPython), and most operating systems are written in C. Learning C teaches you how memory actually works, how the CPU executes your code, and why higher-level languages behave the way they do.

> analogy: Think of C as the engine of a car. You may drive a Python or JavaScript "car" every day, but underneath, the engine that makes everything run is written in C. Understanding the engine makes you a better driver — and lets you build one yourself.

## Your First Program

\`\`\`c
#include <stdio.h>

int main(void) {
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`

### How the Code Works

- \`#include <stdio.h>\` is a **preprocessor directive** that brings in the standard input/output library — this is where \`printf\` is declared.
- \`main\` is the **entry point** — every C program starts executing here. The \`int\` before it means the function returns an integer status code to the operating system.
- \`printf("Hello, World!\\n")\` writes formatted text to standard output. The \`\\n\` is an escape sequence for a newline.
- \`return 0;\` tells the operating system the program succeeded. A non-zero value signals an error.

When you run the compiled program, the output is:

\`\`\`output
Hello, World!
\`\`\`

## Compiling and Running

Save the file as \`hello.c\` and compile it with GCC:

\`\`\`bash
gcc hello.c -o hello
./hello
\`\`\`

> diagram: The C compilation pipeline — source (.c) → preprocessor → compiler → assembler → object file (.o) → linker → executable.

The compiler does not run your code directly. It translates your source through several stages:

| Stage | Input | Output | Purpose |
|-------|-------|--------|---------|
| Preprocessor | \`hello.c\` | expanded source | Handles \`#include\` and \`#define\` |
| Compiler | expanded source | assembly | Translates C into assembly |
| Assembler | assembly | \`hello.o\` | Converts assembly to machine code |
| Linker | \`hello.o\` + libraries | \`hello\` executable | Resolves external symbols |

## Common Mistakes

1. **Forgetting the semicolon.** Every statement in C ends with \`;\`. Omitting it produces a compile error.
2. **Missing \`#include <stdio.h>\`.** Without it, \`printf\` is undeclared and the compiler warns about an implicit declaration.
3. **Using \`"\`\` instead of \`'\`** for single characters. Double quotes create a string; single quotes denote a single \`char\`.

> best-practice: Always compile with warnings enabled — \`gcc -Wall -Wextra hello.c -o hello\`. Treat warnings as errors early; they almost always indicate a real bug.

## Real-World Applications

- **Operating systems** — Linux, macOS, and Windows kernels are largely C.
- **Embedded systems** — microcontrollers in cars, appliances, and IoT devices.
- **Databases** — SQLite, PostgreSQL, and MySQL are written in C.
- **Interpreters** — CPython (Python), PHP, and Ruby are implemented in C.
- **Network infrastructure** — nginx, Redis, and the Curl library.

## Interview Questions

<details>
<summary>Why is C still used when we have modern languages like Python and Go?</summary>

C offers three things modern high-level languages trade away: **direct memory access** (via pointers), **deterministic performance** (no garbage collector pauses), and **tiny runtime footprint**. This makes it indispensable for operating systems, embedded firmware, and performance-critical infrastructure where you must control every byte and every cycle.
</details>

<details>
<summary>What is the difference between compiled and interpreted languages?</summary>

A **compiled** language (like C) is translated entirely into machine code *before* it runs, producing a standalone executable. An **interpreted** language (like Python) is read and executed line-by-line at runtime by another program (the interpreter). Compilation gives C faster startup and execution, while interpretation gives Python flexibility and portability at the cost of speed.
</details>

<details>
<summary>What does return 0 in main() actually do?</summary>

\`return 0;\` sends an exit status of \`0\` to the operating system. By convention, \`0\` means **success** and any non-zero value indicates an error type. Other programs or shell scripts can check this status (via \`$?\` in bash) to decide whether to continue. Returning a non-zero code lets you signal failures to automation pipelines.
</details>

## Practice Exercises

1. Modify the Hello World program to print your own name on a new line below "Hello, World!".
2. Change \`return 0\` to \`return 1\`, compile, and run the program. Then run \`echo $?\` in your shell — observe what value is printed.
3. Remove the \`#include <stdio.h>\` line, recompile with \`-Wall\`, and read the warning the compiler produces.

## Summary

C is a compiled, statically-typed language that gives you direct control over memory and hardware. It remains the lingua franca of systems programming — understanding it makes every higher-level language easier to reason about. In this tutorial you wrote, compiled, and ran your first C program and learned the compilation pipeline that turns source into an executable.

## Next Steps

Continue to **Variables and Data Types** to learn how C represents and stores information in memory.`,
            difficulty: "beginner",
            estimatedMinutes: 12,
            tags: "introduction,setup,hello-world",
            order: 1,
            quizzes: [
              {
                title: "C Introduction Quiz",
                description: "Test your understanding of C basics.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "Who created the C programming language?",
                    options: ["Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum", "James Gosling"],
                    answerIndex: 0,
                    explanation: "Dennis Ritchie created C at Bell Labs in 1972.",
                    order: 0,
                  },
                  {
                    prompt: "What does the `return 0;` in main() signify?",
                    options: [
                      "An error occurred",
                      "The program ran successfully",
                      "The program printed zero",
                      "Nothing — it is optional syntax",
                    ],
                    answerIndex: 1,
                    explanation: "Returning 0 from main tells the OS the program completed successfully.",
                    order: 1,
                  },
                  {
                    prompt: "Which header is required for printf?",
                    options: ["<stdlib.h>", "<string.h>", "<stdio.h>", "<math.h>"],
                    answerIndex: 2,
                    explanation: "printf is declared in <stdio.h>.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "variables-and-data-types",
            title: "Variables and Data Types",
            summary: "Integers, floats, chars, and type modifiers in C.",
            content: `# Variables and Data Types in C

C is statically typed — every variable must be declared with a type before use. This lets the compiler allocate exactly the right amount of memory and catch type errors at compile time.

## Primitive Types

\`\`\`c
int age = 25;            // typically 4 bytes
short s = 100;           // 2 bytes
long big = 1000000L;     // 4 or 8 bytes
char grade = 'A';        // 1 byte
float pi = 3.14f;        // 4 bytes
double precise = 3.141592653589; // 8 bytes
\`\`\`

## Type Modifiers

\`\`\`c
unsigned int count = 42;   // only non-negative
const double PI = 3.14159; // cannot be modified
\`\`\`

- \`signed\` / \`unsigned\` controls whether negative values are allowed.
- \`const\` makes a variable read-only after initialization.
- \`static\` changes scope and lifetime (covered later).

## Format Specifiers

\`\`\`c
printf("Age: %d\\n", age);
printf("Pi: %.2f\\n", pi);
printf("Grade: %c\\n", grade);
\`\`\`

Common specifiers: \`%d\` (int), \`%f\` (float/double), \`%c\` (char), \`%s\` (string), \`%ld\` (long), \`%u\` (unsigned).

## Sizes and Limits

\`\`\`c
#include <limits.h>
#include <float.h>
printf("int max: %d\\n", INT_MAX);
printf("double max: %e\\n", DBL_MAX);
\`\`\`

## Key Takeaways

- Declare types explicitly — C does not infer them.
- Pick the smallest type that fits your data to save memory.
- Use \`const\` for values that should not change.`,
            difficulty: "beginner",
            estimatedMinutes: 14,
            tags: "variables,types,int,float,char",
            order: 2,
          },
          {
            slug: "control-flow",
            title: "Control Flow: if, loops, switch",
            summary: "Branching and iteration in C.",
            content: `# Control Flow in C

C provides the classic set of control-flow constructs: conditional branching and loops.

## if / else if / else

\`\`\`c
int score = 85;
if (score >= 90) {
    printf("A\\n");
} else if (score >= 80) {
    printf("B\\n");
} else {
    printf("C or below\\n");
}
\`\`\`

## Loops

\`\`\`c
// for loop
for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}

// while loop
int n = 10;
while (n > 0) {
    n /= 2;
}

// do-while runs at least once
int x;
do {
    x = read_input();
} while (x != 0);
\`\`\`

## switch

\`\`\`c
switch (opcode) {
    case 1: printf("add\\n"); break;
    case 2: printf("sub\\n"); break;
    default: printf("unknown\\n");
}
\`\`\`

**Always use \`break\`** unless you intentionally want fall-through.

## break and continue

- \`break\` exits the nearest enclosing loop or switch.
- \`continue\` skips to the next iteration of the loop.

## Key Takeaways

- C has the same control flow you will find in Java, JavaScript, and C++.
- Forgetting \`break\` in a switch is a classic bug.
- Prefer \`for\` when the iteration count is known, \`while\` otherwise.`,
            difficulty: "beginner",
            estimatedMinutes: 16,
            tags: "if,else,loops,for,while,switch",
            order: 3,
          },
        ],
      },
      {
        slug: "pointers-and-memory",
        title: "Pointers & Memory",
        summary: "The defining feature of C — direct memory access.",
        order: 2,
        difficulty: "intermediate",
        estimatedMinutes: 120,
        tutorials: [
          {
            slug: "pointers-basics",
            title: "Pointers: The Basics",
            summary: "Addresses, dereferencing, and pointer arithmetic.",
            content: `# Pointers in C

A pointer is a variable that stores the **memory address** of another variable. Pointers are C's most powerful — and most dangerous — feature.

## Declaration and the address-of operator

\`\`\`c
int x = 42;
int *p = &x;   // p stores the address of x

printf("x = %d\\n", x);       // 42
printf("&x = %p\\n", (void*)&x);
printf("p = %p\\n", (void*)p); // same as &x
printf("*p = %d\\n", *p);     // 42 — dereference
\`\`\`

- \`&\` gives the address of a variable.
- \`*\` dereferences a pointer (reads the value at that address).

## Pointer Arithmetic

\`\`\`c
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;        // points to arr[0]
printf("%d\\n", *p);   // 10
printf("%d\\n", *(p+1)); // 20 — moves by sizeof(int)
\`\`\`

Pointer arithmetic scales by the size of the pointed-to type, so \`p + 1\` advances to the next element of an array.

## NULL Pointers

\`\`\`c
int *p = NULL;
if (p == NULL) {
    printf("pointer is null, do not dereference\\n");
}
\`\`\`

Dereferencing NULL crashes the program with a segmentation fault.

## Common Pitfalls

1. **Dangling pointers** — using a pointer after the memory it references has been freed.
2. **Uninitialized pointers** — reading a random memory address.
3. **Buffer overruns** — writing past the end of an array.

## Key Takeaways

- A pointer holds an address; \`*\` reads the value at that address.
- Always initialize pointers (to \`NULL\` if nothing else).
- Pointer arithmetic moves by element size, not bytes.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "pointers,memory,addresses,dereference",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- PYTHON ----------------
  {
    slug: "python",
    name: "Python",
    tagline: "Readable, batteries-included, and everywhere.",
    description:
      "From scripts to machine learning, Python is one of the most popular languages in the world. Learn its clean syntax, dynamic typing, and powerful standard library.",
    icon: "Code2",
    color: "oklch(0.7 0.16 85)",
    category: "Programming",
    order: 2,
    modules: [
      {
        slug: "fundamentals",
        title: "Python Fundamentals",
        summary: "Syntax, types, control flow, and functions.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 100,
        tutorials: [
          {
            slug: "introduction-to-python",
            title: "Introduction to Python",
            summary: "What Python is, the REPL, and your first script.",
            content: `# Introduction to Python

Python is a high-level, dynamically-typed, interpreted language created by Guido van Rossum in 1991. Its design philosophy emphasises **readability** — code is read far more often than it is written.

## Why Python?

- **Readable**: indentation defines blocks instead of braces.
- **Batteries-included**: huge standard library.
- **Multi-paradigm**: procedural, object-oriented, and functional styles.
- **Everywhere**: web backends, data science, automation, ML, scripting.

## Your First Program

\`\`\`python
print("Hello, World!")
\`\`\`

That is the entire program. No \`main\` function, no semicolons, no imports.

## The REPL

\`\`\`bash
$ python3
>>> 2 + 2
4
>>> name = "Alice"
>>> print(f"Hi, {name}")
Hi, Alice
\`\`\`

The REPL is perfect for experimentation.

## Variables and Dynamic Typing

\`\`\`python
x = 10          # int
x = "ten"       # now a str — Python allows this
\`\`\`

Types are checked at runtime, not compile time. This is powerful but means tests are essential.

## Key Takeaways

- Python prioritises readability and rapid development.
- The REPL makes exploration fast.
- Dynamic typing trades safety for flexibility.`,
            difficulty: "beginner",
            estimatedMinutes: 12,
            tags: "introduction,setup,hello-world",
            order: 1,
            quizzes: [
              {
                title: "Python Introduction Quiz",
                description: "Basics of Python.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "Who created Python?",
                    options: ["Guido van Rossum", "Linus Torvalds", "Brendan Eich", "Larry Wall"],
                    answerIndex: 0,
                    explanation: "Guido van Rossum released Python in 1991.",
                    order: 0,
                  },
                  {
                    prompt: "How does Python define code blocks?",
                    options: ["Curly braces", "Indentation", "Keywords like begin/end", "Semicolons"],
                    answerIndex: 1,
                    explanation: "Python uses indentation (usually 4 spaces) to define blocks.",
                    order: 1,
                  },
                  {
                    prompt: "What does the REPL do?",
                    options: [
                      "Compiles code to a binary",
                      "Runs a web server",
                      "Lets you evaluate Python expressions interactively",
                      "Manages dependencies",
                    ],
                    answerIndex: 2,
                    explanation: "The REPL is an interactive Python shell.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "variables-and-data-types",
            title: "Variables and Data Types",
            summary: "Numbers, strings, booleans, and dynamic typing.",
            content: `# Variables and Data Types in Python

Python has a small but powerful set of built-in types. Variables are names bound to objects; the same name can be rebound to a different type at any time.

## Numbers

\`\`\`python
count = 42            # int
price = 19.99         # float
total = 3 + 4j        # complex
\`\`\`

Python integers have arbitrary precision — no overflow:

\`\`\`python
>>> 2 ** 100
1267650600228229401496703205376
\`\`\`

## Strings

\`\`\`python
s = "hello"
t = 'world'
multi = """triple-quoted
strings can span lines"""
\`\`\`

f-strings interpolate expressions:

\`\`\`python
name = "Alice"
print(f"Hello, {name.upper()}!")
\`\`\`

## Booleans and None

\`\`\`python
is_valid = True
is_empty = False
nothing = None
\`\`\`

## Type Checking

\`\`\`python
type(42)         # <class 'int'>
isinstance(42, int)  # True
\`\`\`

## Key Takeaways

- Python is dynamically typed but strongly typed (no implicit coercion across unrelated types).
- Use f-strings for interpolation.
- \`isinstance\` is preferred over \`type()\` for type checks.`,
            difficulty: "beginner",
            estimatedMinutes: 14,
            tags: "variables,types,int,str,float,bool",
            order: 2,
            quizzes: [
              {
                title: "Python Data Types Quiz",
                description: "Identify Python's core types.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What is the type of 3.14 in Python?",
                    options: ["int", "float", "double", "decimal"],
                    answerIndex: 1,
                    explanation: "Python calls floating-point numbers 'float'.",
                    order: 0,
                  },
                  {
                    prompt: "How do you write an f-string?",
                    options: ['f"Hello {name}"', '"Hello {name}"', 'format("Hello", name)', "Hello %s"],
                    answerIndex: 0,
                    explanation: "Prefix the string with f to enable interpolation.",
                    order: 1,
                  },
                  {
                    prompt: "What does None represent?",
                    options: ["Zero", "An empty string", "The absence of a value", "False"],
                    answerIndex: 2,
                    explanation: "None is Python's null sentinel.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "control-flow",
            title: "Control Flow",
            summary: "Conditionals, loops, and comprehensions.",
            content: `# Control Flow in Python

Python's control flow is clean and expressive.

## Conditionals

\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
\`\`\`

## Loops

\`\`\`python
# for loop over an iterable
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

# range-based
for i in range(5):       # 0..4
    print(i)

# while
n = 10
while n > 0:
    n -= 1
\`\`\`

## Comprehensions

\`\`\`python
squares = [x*x for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
\`\`\`

Comprehensions are a Pythonic way to build lists, sets, and dicts concisely.

## Match Statements (Python 3.10+)

\`\`\`python
match status:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case _:
        print("Unknown")
\`\`\`

## Key Takeaways

- Indentation defines blocks — be consistent (4 spaces is standard).
- Comprehensions replace many map/filter patterns.
- \`range\` is lazy; it does not create a list.`,
            difficulty: "beginner",
            estimatedMinutes: 16,
            tags: "if,elif,else,for,while,comprehensions,match",
            order: 3,
          },
          {
            slug: "functions-and-scope",
            title: "Functions and Scope",
            summary: "Def, arguments, lambdas, and closures.",
            content: `# Functions and Scope in Python

Functions are first-class objects in Python — they can be passed, returned, and stored.

## Defining Functions

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))              # Hello, Alice!
print(greet("Bob", greeting="Hi")) # Hi, Bob!
\`\`\`

## *args and **kwargs

\`\`\`python
def sum_all(*numbers):
    return sum(numbers)

def make_config(**options):
    return options

sum_all(1, 2, 3, 4)         # 10
make_config(debug=True, x=1)  # {'debug': True, 'x': 1}
\`\`\`

## Lambdas

\`\`\`python
square = lambda x: x * x
print(square(5))  # 25

# commonly used with sorted/map
sorted(users, key=lambda u: u["age"])
\`\`\`

## Scope (LEGB Rule)

Python resolves names in this order: **L**ocal, **E**nclosing, **G**lobal, **B**uilt-in.

\`\`\`python
x = "global"
def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)
    inner()
outer()  # prints "local"
\`\`\`

Use \`global\` and \`nonlocal\` to rebind outer scopes.

## Key Takeaways

- Functions are objects — pass them around freely.
- Default arguments are evaluated once; never use mutable defaults.
- Understand LEGB to debug name resolution.`,
            difficulty: "beginner",
            estimatedMinutes: 18,
            tags: "functions,args,kwargs,lambda,scope",
            order: 4,
            quizzes: [
              {
                title: "Python Functions Quiz",
                description: "Test functions and scope knowledge.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What does **kwargs collect?",
                    options: ["Positional args", "Keyword args as a dict", "A single tuple", "Nothing"],
                    answerIndex: 1,
                    explanation: "**kwargs collects keyword arguments into a dict.",
                    order: 0,
                  },
                  {
                    prompt: "What is the LEGB order?",
                    options: [
                      "Local, Enclosing, Global, Built-in",
                      "Loop, Exception, Global, Block",
                      "List, Enum, Generator, Bool",
                      "Lambda, Eval, Generator, Bind",
                    ],
                    answerIndex: 0,
                    explanation: "LEGB = Local, Enclosing, Global, Built-in.",
                    order: 1,
                  },
                  {
                    prompt: "Why avoid mutable default arguments?",
                    options: [
                      "They are slow",
                      "They are shared across calls and persist state",
                      "They cannot be modified",
                      "They cause syntax errors",
                    ],
                    answerIndex: 1,
                    explanation: "Defaults are evaluated once, so a mutable default persists between calls.",
                    order: 2,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        slug: "data-structures",
        title: "Python Data Structures",
        summary: "Lists, tuples, dicts, and sets in depth.",
        order: 2,
        difficulty: "intermediate",
        estimatedMinutes: 110,
        tutorials: [
          {
            slug: "lists-tuples-dicts-sets",
            title: "Lists, Tuples, Dictionaries, Sets",
            summary: "Python's core container types.",
            content: `# Python Data Structures

Python ships with powerful built-in containers. Choosing the right one is key to writing idiomatic, efficient code.

## Lists — ordered, mutable

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")
fruits.insert(0, "apricot")
fruits.remove("banana")
\`\`\`

Lists are dynamic arrays; \`append\` is amortised O(1), \`insert(0, ...)\` is O(n).

## Tuples — ordered, immutable

\`\`\`python
point = (3, 4)
x, y = point          # unpacking
single = (42,)        # single-element tuple needs a comma
\`\`\`

Tuples are faster and hashable (can be dict keys).

## Dictionaries — key/value, fast lookup

\`\`\`python
user = {"name": "Alice", "age": 30}
user["email"] = "alice@example.com"
for key, value in user.items():
    print(key, value)
\`\`\`

Dicts are hash tables — average O(1) lookup.

## Sets — unordered, unique

\`\`\`python
tags = {"python", "web", "ai"}
tags.add("ml")
tags.discard("web")       # safe remove
print("python" in tags)   # True
\`\`\`

## When to Use What

| Container | When to use |
|-----------|--------------|
| list      | Ordered sequence, frequent appends |
| tuple     | Fixed record, immutable |
| dict      | Key→value lookup |
| set       | Uniqueness, membership tests |

## Key Takeaways

- Tuples are immutable and hashable — use them for fixed records.
- Dicts give O(1) lookup by key.
- Sets give O(1) membership tests.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "lists,tuples,dicts,sets,containers",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- DATA STRUCTURES ----------------
  {
    slug: "data-structures",
    name: "Data Structures",
    tagline: "How data is organised — the heart of computer science.",
    description:
      "Arrays, linked lists, stacks, queues, trees, heaps, and graphs. Learn the structures every engineer must know.",
    icon: "Layers",
    color: "oklch(0.7 0.13 200)",
    category: "Data",
    order: 3,
    modules: [
      {
        slug: "linear-structures",
        title: "Linear Data Structures",
        summary: "Arrays, linked lists, stacks, queues.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 120,
        tutorials: [
          {
            slug: "arrays",
            title: "Arrays",
            summary: "Contiguous storage, O(1) random access.",
            content: `# Arrays

An array is a contiguous block of memory holding elements of the same type. It is the simplest and most important data structure.

## Properties

- **Contiguous memory** — elements are stored back-to-back.
- **O(1) random access** — given an index, the address is computed as \`base + index * size\`.
- **Fixed size** in low-level languages (C, Java); dynamic in Python (list), JS (Array), C++ (vector).

## Complexity

| Operation   | Complexity |
|-------------|------------|
| Access by index | O(1)   |
| Update by index | O(1)   |
| Insert at end (amortised) | O(1) |
| Insert at front/middle | O(n) |
| Search (unsorted) | O(n)   |
| Search (sorted, binary search) | O(log n) |

## Example (Python)

\`\`\`python
arr = [10, 20, 30, 40, 50]
print(arr[2])     # 30 — O(1)
arr.append(60)    # amortised O(1)
arr.insert(0, 5)  # O(n) — shifts everything
\`\`\`

## When to Use

- You need fast indexed access.
- The size is known or grows at the end.
- Cache-friendly (contiguous memory).

## When Not to Use

- Frequent insertions/deletions in the middle — use a linked list instead.

## Key Takeaways

- Arrays give O(1) random access but O(n) middle inserts.
- They are cache-friendly due to contiguous memory.
- Dynamic arrays (Python list, C++ vector, JS Array) grow automatically.`,
            difficulty: "beginner",
            estimatedMinutes: 14,
            tags: "arrays,complexity,random-access",
            order: 1,
            quizzes: [
              {
                title: "Arrays Quiz",
                description: "Test array fundamentals.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What is the time complexity of accessing an array element by index?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    answerIndex: 0,
                    explanation: "Address is computed arithmetically: base + index * size.",
                    order: 0,
                  },
                  {
                    prompt: "Why are arrays cache-friendly?",
                    options: [
                      "They use linked nodes",
                      "Memory is contiguous",
                      "They are hash-based",
                      "They use pointers",
                    ],
                    answerIndex: 1,
                    explanation: "Contiguous memory means sequential access hits the CPU cache.",
                    order: 1,
                  },
                  {
                    prompt: "What is the cost of inserting at the front of an array of size n?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    answerIndex: 2,
                    explanation: "All n existing elements must shift right by one.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "linked-lists",
            title: "Linked Lists",
            summary: "Nodes connected by pointers; O(1) insert/delete at known positions.",
            content: `# Linked Lists

A linked list is a sequence of nodes, each holding a value and a pointer to the next node. Unlike arrays, nodes are not contiguous in memory.

## Singly Linked List

\`\`\`python
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, val):
        node = Node(val)
        node.next = self.head
        self.head = node

    def traverse(self):
        cur = self.head
        while cur:
            print(cur.val, end=" -> ")
            cur = cur.next
        print("None")
\`\`\`

## Complexity

| Operation                | Complexity |
|--------------------------|------------|
| Access by index          | O(n)       |
| Insert/delete at head    | O(1)       |
| Insert/delete at tail    | O(1) (with tail pointer) / O(n) without |
| Insert/delete in middle  | O(1) given the node pointer |

## Doubly Linked Lists

Each node has a \`prev\` and \`next\` pointer, enabling backward traversal and O(1) deletion given a node.

## When to Use

- Frequent insertions/deletions at the ends or middle (with a pointer).
- Unknown size, growing dynamically.
- Implementing other structures (stacks, queues, LRU caches).

## When Not to Use

- You need random access by index — use an array.
- Cache performance matters heavily (linked lists are cache-unfriendly).

## Key Takeaways

- Linked lists trade random access for fast insert/delete.
- Singly lists use one pointer per node; doubly uses two.
- Watch out for memory overhead per node.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "linked-list,nodes,pointers,singly,doubly",
            order: 2,
          },
          {
            slug: "stacks-and-queues",
            title: "Stacks and Queues",
            summary: "LIFO and FIFO — the simplest linear abstractions.",
            content: `# Stacks and Queues

## Stack — Last In, First Out (LIFO)

A stack supports push and pop from one end (the top).

\`\`\`python
stack = []
stack.append(1)    # push
stack.append(2)
stack.pop()        # 2 — pop
\`\`\`

**Uses**: function call stack, undo/redo, expression evaluation, backtracking.

## Queue — First In, First Out (FIFO)

A queue supports enqueue at the back and dequeue from the front.

\`\`\`python
from collections import deque
q = deque()
q.append(1)        # enqueue
q.append(2)
q.popleft()        # 1 — dequeue
\`\`\`

**Uses**: BFS, task scheduling, producer-consumer buffers.

## Complexity (with proper implementation)

| Operation | Stack (list) | Queue (deque) |
|-----------|--------------|---------------|
| Push/Enqueue | O(1)      | O(1)          |
| Pop/Dequeue  | O(1)      | O(1)          |
| Peek         | O(1)      | O(1)          |

**Never use \`list.pop(0)\`** for a queue — it is O(n). Use \`collections.deque\`.

## Variants

- **Deque** — double-ended queue; insert/remove at both ends.
- **Priority queue** — elements have priorities; highest-priority removed first (usually a heap).
- **Circular queue** — fixed-size queue that wraps around.

## Key Takeaways

- Stacks are LIFO; queues are FIFO.
- Use \`deque\` for O(1) queue operations in Python.
- Stacks underpin recursion, expression parsing, and backtracking.`,
            difficulty: "beginner",
            estimatedMinutes: 14,
            tags: "stack,queue,lifo,fifo,deque",
            order: 3,
          },
          {
            slug: "trees",
            title: "Trees and Binary Search Trees",
            summary: "Hierarchical structures and ordered lookup.",
            content: `# Trees

A tree is a hierarchical structure of nodes. Each node has a value and a list of child nodes. The top node is the **root**; nodes with no children are **leaves**.

## Binary Tree

Each node has at most two children: \`left\` and \`right\`.

\`\`\`python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
\`\`\`

## Binary Search Tree (BST)

A BST maintains the invariant: for every node, all values in the left subtree are smaller, and all in the right subtree are larger.

\`\`\`python
def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root
\`\`\`

## Traversals

\`\`\`python
def inorder(node):
    if node:
        inorder(node.left)
        print(node.val)
        inorder(node.right)
\`\`\`

- **In-order** (left, root, right): visits BST nodes in sorted order.
- **Pre-order** (root, left, right): useful for serialising.
- **Post-order** (left, right, root): useful for deleting/freeing.
- **Level-order**: BFS using a queue.

## Complexity (balanced BST)

| Operation | Complexity |
|-----------|------------|
| Search    | O(log n)   |
| Insert    | O(log n)   |
| Delete    | O(log n)   |

An unbalanced BST degrades to O(n). Self-balancing variants (AVL, Red-Black) guarantee O(log n).

## Key Takeaways

- Trees model hierarchical data.
- BSTs give O(log n) search when balanced.
- Traversal order matters — in-order visits a BST in sorted order.`,
            difficulty: "intermediate",
            estimatedMinutes: 20,
            tags: "trees,bst,binary,traversal",
            order: 4,
          },
        ],
      },
    ],
  },

  // ---------------- ALGORITHMS ----------------
  {
    slug: "algorithms",
    name: "Algorithms",
    tagline: "Step-by-step recipes for solving problems.",
    description:
      "Complexity analysis, sorting, searching, recursion, dynamic programming, and graphs. The toolkit of every serious engineer.",
    icon: "FunctionSquare",
    color: "oklch(0.68 0.2 305)",
    category: "Data",
    order: 4,
    modules: [
      {
        slug: "complexity",
        title: "Time and Space Complexity",
        summary: "Big-O notation and how to analyse algorithms.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 80,
        tutorials: [
          {
            slug: "big-o-notation",
            title: "Big-O Notation",
            summary: "How we describe algorithm efficiency.",
            content: `# Big-O Notation

Big-O describes how an algorithm's runtime or memory grows as the input size **n** grows. It is an **upper bound** on growth (ignoring constants and lower-order terms).

## Common Complexities

| Complexity | Name       | Example |
|------------|------------|---------|
| O(1)       | Constant   | Array index access |
| O(log n)   | Logarithmic | Binary search |
| O(n)       | Linear     | Single loop over input |
| O(n log n) | Linearithmic | Merge sort, heap sort |
| O(n²)      | Quadratic  | Nested loops, bubble sort |
| O(2ⁿ)      | Exponential | Naive recursion (Fibonacci) |
| O(n!)      | Factorial  | Permutations |

## Analysing Code

\`\`\`python
def example(arr):
    total = 0                       # O(1)
    for x in arr:                   # O(n)
        total += x                  # O(1) inside loop
    for i in range(len(arr)):       # O(n)
        for j in range(len(arr)):   # O(n)
            if arr[i] == arr[j]:    # O(1)
                total += 1
    return total                    # Overall: O(n²) dominates
\`\`\`

We keep only the **dominant** term and drop constants.

## Space Complexity

Same idea, but for memory. A recursive Fibonacci uses O(n) stack space; an iterative version uses O(1).

## Key Takeaways

- Big-O describes **growth**, not exact runtime.
- Always look at the dominant term.
- Optimising constant factors matters in practice but does not change Big-O.`,
            difficulty: "beginner",
            estimatedMinutes: 14,
            tags: "big-o,complexity,analysis",
            order: 1,
            quizzes: [
              {
                title: "Big-O Quiz",
                description: "Test complexity analysis.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What is the complexity of binary search?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    answerIndex: 1,
                    explanation: "Each step halves the search space.",
                    order: 0,
                  },
                  {
                    prompt: "What is the complexity of this loop: for i in range(n): for j in range(n): ...?",
                    options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
                    answerIndex: 2,
                    explanation: "Two nested loops each running n times give n² operations.",
                    order: 1,
                  },
                  {
                    prompt: "What does Big-O describe?",
                    options: [
                      "Exact runtime in seconds",
                      "Growth rate of an algorithm as input grows",
                      "Memory usage in bytes",
                      "Number of lines of code",
                    ],
                    answerIndex: 1,
                    explanation: "Big-O is an asymptotic upper bound on growth.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "sorting-algorithms",
            title: "Sorting Algorithms",
            summary: "Bubble, insertion, merge, and quick sort.",
            content: `# Sorting Algorithms

Sorting is one of the most studied problems in computer science. Different algorithms trade off speed, memory, and simplicity.

## Bubble Sort — O(n²)

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
\`\`\`

Simple but slow. Only useful for tiny or nearly-sorted inputs.

## Insertion Sort — O(n²)

\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
\`\`\`

Excellent for small or nearly-sorted inputs.

## Merge Sort — O(n log n), stable

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(a, b):
    out = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:]); out.extend(b[j:])
    return out
\`\`\`

Guaranteed O(n log n). Uses O(n) extra space.

## Quick Sort — avg O(n log n), in-place

\`\`\`python
def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p-1)
        quick_sort(arr, p+1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[hi] = arr[hi], arr[i]
    return i
\`\`\`

Average O(n log n) but worst case O(n²) on bad pivots.

## Comparison

| Algorithm      | Best      | Average   | Worst     | Space    | Stable |
|----------------|-----------|-----------|-----------|----------|--------|
| Bubble sort    | O(n)      | O(n²)     | O(n²)     | O(1)     | Yes    |
| Insertion sort | O(n)      | O(n²)     | O(n²)     | O(1)     | Yes    |
| Merge sort     | O(n log n)| O(n log n)| O(n log n)| O(n)     | Yes    |
| Quick sort     | O(n log n)| O(n log n)| O(n²)     | O(log n) | No     |

## Key Takeaways

- Use merge sort when you need guaranteed O(n log n) and stability.
- Use quick sort for average-case speed and in-place operation.
- Real-world libraries use hybrid algorithms (Timsort, introsort).`,
            difficulty: "intermediate",
            estimatedMinutes: 22,
            tags: "sorting,bubble,insertion,merge,quick",
            order: 2,
          },
          {
            slug: "searching-algorithms",
            title: "Searching Algorithms",
            summary: "Linear search and binary search.",
            content: `# Searching Algorithms

## Linear Search — O(n)

\`\`\`python
def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
    return -1
\`\`\`

Works on any iterable; no preconditions.

## Binary Search — O(log n)

Requires a **sorted** array. Repeatedly halves the search range.

\`\`\`python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
\`\`\`

## Comparing

| Algorithm      | Sorted? | Complexity |
|----------------|---------|------------|
| Linear search  | No      | O(n)       |
| Binary search  | Yes     | O(log n)   |

## Common Bug: Integer Overflow

In languages with fixed ints, \`mid = (lo + hi) // 2\` can overflow. Use \`mid = lo + (hi - lo) // 2\` instead. Python ints are arbitrary precision, so it is safe.

## Key Takeaways

- Linear search works anywhere; binary search needs sorted input.
- Binary search is exponentially faster for large n.
- Many problems reduce to binary search (search over answer space).`,
            difficulty: "intermediate",
            estimatedMinutes: 14,
            tags: "searching,linear,binary",
            order: 3,
          },
          {
            slug: "dynamic-programming",
            title: "Dynamic Programming",
            summary: "Optimising recursive problems via memoisation.",
            content: `# Dynamic Programming

Dynamic programming (DP) solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation.

## When to Use DP

1. **Optimal substructure** — the optimal solution contains optimal solutions to subproblems.
2. **Overlapping subproblems** — the same subproblems recur.

## Example: Fibonacci

Naive recursion — exponential:

\`\`\`python
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)  # O(2^n)
\`\`\`

Memoised — O(n):

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)
\`\`\`

Bottom-up — O(n), O(1) space:

\`\`\`python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`

## Example: 0/1 Knapsack

\`\`\`python
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0]*(capacity+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for c in range(capacity+1):
            if weights[i-1] <= c:
                dp[i][c] = max(dp[i-1][c], dp[i-1][c-weights[i-1]] + values[i-1])
            else:
                dp[i][c] = dp[i-1][c]
    return dp[n][capacity]
\`\`\`

## Approaches

- **Top-down with memoisation** — recursion + cache.
- **Bottom-up tabulation** — iterative, fills a table.

## Key Takeaways

- DP trades space for time — store subproblem results.
- Identify the recurrence first, then choose top-down or bottom-up.
- Always ask: "what is the smallest version of this problem?"`,
            difficulty: "advanced",
            estimatedMinutes: 24,
            tags: "dp,memoization,recursion,knapsack",
            order: 4,
          },
        ],
      },
    ],
  },

  // ---------------- OPERATING SYSTEMS ----------------
  {
    slug: "operating-systems",
    name: "Operating Systems",
    tagline: "How software talks to hardware.",
    description:
      "Processes, threads, memory, scheduling, file systems, and concurrency. The layer between your code and the machine.",
    icon: "Cpu",
    color: "oklch(0.72 0.16 162)",
    category: "Systems",
    order: 5,
    modules: [
      {
        slug: "processes-and-threads",
        title: "Processes and Threads",
        summary: "Programs in execution and units of concurrency.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "processes-and-threads",
            title: "Processes and Threads",
            summary: "Definitions, context switching, and concurrency basics.",
            content: `# Processes and Threads

## Process

A **process** is an instance of a program in execution. Each process has its own:

- **Address space** (code, data, heap, stack)
- **Open file descriptors**
- **Security context** (UID, permissions)
- **At least one thread** of execution

## Thread

A **thread** is the smallest unit of CPU execution within a process. Threads in the same process share:

- The address space
- Open files
- Heap memory

But each thread has its own:

- Program counter and registers
- Stack

## Why Threads?

- **Concurrency** — multiple tasks in flight (e.g., handle many requests).
- **Responsiveness** — keep UI responsive while doing work.
- **Performance** — utilise multiple CPU cores.

## Context Switch

Switching the CPU from one thread/process to another requires saving and restoring state. Thread switches are cheaper than process switches because less state changes.

## Concurrency vs Parallelism

- **Concurrency** — multiple tasks in progress (may interleave on one core).
- **Parallelism** — multiple tasks executing simultaneously (multiple cores).

## Creating Threads (Python)

\`\`\`python
import threading

def worker(n):
    print(f"worker {n}")

threads = [threading.Thread(target=worker, args=(i,)) for i in range(4)]
for t in threads: t.start()
for t in threads: t.join()
\`\`\`

## Key Takeaways

- A process owns memory; threads share a process's memory.
- Context switching has a cost — too many threads can hurt performance.
- Concurrency is about structure; parallelism is about execution.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "processes,threads,concurrency,context-switch",
            order: 1,
            quizzes: [
              {
                title: "Processes and Threads Quiz",
                description: "Process vs thread basics.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What do threads in the same process share?",
                    options: [
                      "Stack memory",
                      "Address space and heap",
                      "Program counter",
                      "CPU registers",
                    ],
                    answerIndex: 1,
                    explanation: "Threads share the process's address space, including the heap. Each has its own stack and registers.",
                    order: 0,
                  },
                  {
                    prompt: "Which is cheaper — a process context switch or a thread context switch?",
                    options: [
                      "Process switch",
                      "Thread switch",
                      "They cost the same",
                      "Depends on the language",
                    ],
                    answerIndex: 1,
                    explanation: "Threads share memory so less state must be saved/restored.",
                    order: 1,
                  },
                  {
                    prompt: "Concurrency is best described as:",
                    options: [
                      "Executing multiple tasks at the same instant",
                      "Multiple tasks in progress, possibly interleaved",
                      "Using multiple CPU cores",
                      "Single-threaded execution",
                    ],
                    answerIndex: 1,
                    explanation: "Concurrency is about structure and progress; parallelism is about simultaneous execution.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "memory-management",
            title: "Memory Management",
            summary: "Virtual memory, paging, and segmentation.",
            content: `# Memory Management

Operating systems give each process the illusion of a large, private memory space. This is **virtual memory**.

## Virtual Memory

Each process sees a contiguous virtual address space starting at 0. The OS + hardware (MMU) translates virtual addresses to physical ones.

Benefits:
- **Isolation** — processes cannot read each other's memory.
- **Protection** — pages have permission bits.
- **Overcommit** — more virtual memory than physical RAM.

## Paging

Memory is divided into fixed-size **pages** (typically 4 KB). Virtual pages map to physical **frames** via a **page table**.

- **Page fault** — accessing a virtual page not currently in RAM; the OS fetches it from disk.
- **TLB** — translation lookaside buffer caches recent translations for speed.

## Segmentation

An older scheme dividing memory into variable-size segments (code, data, stack). Mostly replaced by paging; some systems use a hybrid.

## Swapping

When RAM is full, the OS evicts pages to disk (swap). If a process accesses an evicted page, a page fault brings it back. Excessive swapping causes **thrashing** — system spends more time paging than computing.

## Memory Layout of a Process

\`\`\`
+----------------+  high addresses
| Stack          |  grows down
| ↓              |
| ...            |
| Heap           |  grows up (malloc/new)
| BSS            |  uninitialized globals
| Data           |  initialized globals
| Text (code)    |  the program instructions
+----------------+  low addresses
\`\`\`

## Key Takeaways

- Virtual memory isolates and protects processes.
- Paging maps fixed-size virtual pages to physical frames.
- Page faults are slow — minimise them by being cache-friendly.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "memory,virtual-memory,paging,page-fault",
            order: 2,
          },
          {
            slug: "cpu-scheduling",
            title: "CPU Scheduling",
            summary: "How the OS decides which thread runs next.",
            content: `# CPU Scheduling

The OS scheduler decides which thread runs on each CPU core, and for how long. The goal is fair, responsive, high-throughput execution.

## Metrics

- **Throughput** — tasks completed per unit time.
- **Turnaround time** — total time from submission to completion.
- **Waiting time** — time spent in the ready queue.
- **Response time** — time to first response (interactive).

These often conflict — optimising throughput may hurt response time.

## Algorithms

### FCFS (First-Come, First-Served)

Non-preemptive, simple, but suffers from the **convoy effect** (short jobs wait behind a long one).

### SJF (Shortest Job First)

Optimal average waiting time, but requires knowing job lengths in advance. Non-preemptive variant.

### Round Robin

Each thread runs for a **time quantum** (e.g., 10 ms), then is preempted and moved to the back of the ready queue. Fair and responsive, but context-switch overhead if the quantum is too small.

### Priority Scheduling

Threads have priorities; the highest-priority ready thread runs. Risk: **starvation** of low-priority threads. Fix: **aging** (gradually increase priority over time).

### Multilevel Feedback Queue

Threads move between queues of different priorities based on behaviour (CPU-bound vs I/O-bound). This is what real OS schedulers approximate.

## Preemption

- **Non-preemptive** — once a thread starts, it runs until it blocks or finishes.
- **Preemptive** — the scheduler can interrupt a running thread at any time slice.

## Key Takeaways

- No single scheduler is best at everything — schedulers trade off metrics.
- Round robin is the classic fair preemptive algorithm.
- Modern schedulers are multilevel feedback queues tuned for interactivity and throughput.`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "scheduling,cpu,fcfs,round-robin,priority",
            order: 3,
          },
          {
            slug: "file-systems",
            title: "File Systems",
            summary: "How data is organised on disk.",
            content: `# File Systems

A file system manages how data is stored, named, organised, and retrieved on a storage device.

## Files and Directories

- **File** — a named collection of bytes with metadata (size, timestamps, permissions).
- **Directory** — a special file that maps names to inodes.

## Inodes

On Unix-like systems, a file's metadata lives in an **inode** (index node). The inode stores:

- File size
- Block pointers (where the data is)
- Permissions, timestamps
- Link count

The file **name** lives in a directory entry pointing to the inode. This is why **hard links** work — multiple names, same inode.

## Allocation Strategies

| Strategy  | Description |
|-----------|-------------|
| Contiguous | Each file occupies a single contiguous block range. Fast, but suffers fragmentation. |
| Linked     | Each block points to the next. No fragmentation, but random access is slow. |
| Indexed    | An index block lists all data blocks (e.g., Unix inodes). |

## Journaled File Systems

Modern file systems (ext4, APFS, NTFS) write changes to a **journal** before applying them. On crash, the journal is replayed, preventing corruption.

## Common File Systems

| FS    | OS              | Notes |
|-------|-----------------|-------|
| ext4  | Linux           | Default, journaled |
| APFS  | macOS/iOS       | Copy-on-write, snapshots |
| NTFS  | Windows         | Journaled, ACLs |
| ZFS   | Servers         | Copy-on-write, checksums, pools |
| FAT32 | USB, cameras    | Simple, portable, 4 GB file limit |

## Key Takeaways

- Files are inode + name; directories map names to inodes.
- Indexed allocation balances performance and random access.
- Journaling prevents corruption after crashes.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "files,filesystems,inodes,journaling",
            order: 4,
          },
        ],
      },
    ],
  },

  // ---------------- SQL ----------------
  {
    slug: "sql",
    name: "SQL",
    tagline: "The language of relational data.",
    description:
      "Query, filter, join, and aggregate data with SQL — the universal language of databases.",
    icon: "Database",
    color: "oklch(0.75 0.16 85)",
    category: "Data",
    order: 6,
    modules: [
      {
        slug: "fundamentals",
        title: "SQL Fundamentals",
        summary: "SELECT, WHERE, JOIN, and aggregates.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "select-and-where",
            title: "SELECT and WHERE",
            summary: "The basic query and filtering.",
            content: `# SELECT and WHERE

SQL (Structured Query Language) is the standard language for relational databases. Almost every query starts with SELECT.

## Basic SELECT

\`\`\`sql
SELECT name, email FROM users;
\`\`\`

Select specific columns. Use \`*\` to select all columns (avoid in production — be explicit).

## WHERE — Filtering

\`\`\`sql
SELECT name, email
FROM users
WHERE active = 1
  AND age >= 18
  AND country IN ('IN', 'US', 'UK');
\`\`\`

Common operators:

| Operator | Meaning |
|----------|---------|
| \`=\`, \`<>\`, \`!=\` | equality / inequality |
| \`>\`, \`<\`, \`>=\`, \`<=\` | comparison |
| \`BETWEEN x AND y\` | range (inclusive) |
| \`IN (...)\` | set membership |
| \`LIKE\` | pattern matching (% any, _ one) |
| \`IS NULL\` / \`IS NOT NULL\` | null checks |
| \`AND\`, \`OR\`, \`NOT\` | logical |

## LIKE Patterns

\`\`\`sql
SELECT * FROM users WHERE name LIKE 'A%';   -- starts with A
SELECT * FROM users WHERE name LIKE '%son';  -- ends with 'son'
SELECT * FROM users WHERE email LIKE '%@gmail.com';
\`\`\`

## Ordering and Limiting

\`\`\`sql
SELECT name, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
\`\`\`

## Key Takeaways

- SELECT picks columns; WHERE filters rows.
- Use IN for set membership, LIKE for patterns.
- Always ORDER BY explicitly — rows have no inherent order.`,
            difficulty: "beginner",
            estimatedMinutes: 14,
            tags: "select,where,filter,order-by,limit",
            order: 1,
            quizzes: [
              {
                title: "SELECT and WHERE Quiz",
                description: "Basic SQL queries.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "Which clause filters rows in a SELECT?",
                    options: ["FROM", "WHERE", "HAVING", "GROUP BY"],
                    answerIndex: 1,
                    explanation: "WHERE filters rows before grouping; HAVING filters after.",
                    order: 0,
                  },
                  {
                    prompt: "What does `name LIKE 'A%'` match?",
                    options: [
                      "Names ending in A",
                      "Names starting with A",
                      "Names containing A",
                      "Names exactly equal to A%",
                    ],
                    answerIndex: 1,
                    explanation: "% matches any sequence, so 'A%' means starts with A.",
                    order: 1,
                  },
                  {
                    prompt: "Why avoid SELECT * in production?",
                    options: [
                      "It is a syntax error",
                      "It returns more columns than needed and breaks when schema changes",
                      "It is slower than DROP TABLE",
                      "It only works on small tables",
                    ],
                    answerIndex: 1,
                    explanation: "Be explicit about columns to avoid fetching unused data and to survive schema additions.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "joins",
            title: "JOINs",
            summary: "Combine data from multiple tables.",
            content: `# SQL JOINs

A JOIN combines rows from two tables based on a related column.

## Setup

\`\`\`sql
CREATE TABLE users (id INT PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INT PRIMARY KEY, user_id INT REFERENCES users(id), total NUMERIC);
\`\`\`

## INNER JOIN

Returns rows that have matching values in both tables.

\`\`\`sql
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
\`\`\`

## LEFT JOIN

All rows from the left table, with matching right rows (NULL if none).

\`\`\`sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
\`\`\`

Returns every user, even those with no orders.

## RIGHT JOIN

Mirror of LEFT JOIN — all rows from the right table.

## FULL OUTER JOIN

All rows from both tables; NULLs where there is no match. (Not supported by MySQL.)

## CROSS JOIN

Cartesian product — every left row paired with every right row.

## Self JOIN

A table joined to itself, useful for hierarchical data.

\`\`\`sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
\`\`\`

## Key Takeaways

- INNER JOIN keeps matching rows only.
- LEFT JOIN keeps all left rows; useful for "users and their orders".
- Always qualify columns with table aliases in joins.`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "join,inner,left,right,outer",
            order: 2,
          },
          {
            slug: "aggregations",
            title: "GROUP BY and Aggregations",
            summary: "Summarise data with COUNT, SUM, AVG, GROUP BY.",
            content: `# GROUP BY and Aggregations

Aggregation functions summarise many rows into one.

## Aggregate Functions

\`\`\`sql
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;
SELECT SUM(total) FROM orders;
SELECT MIN(created_at), MAX(created_at) FROM orders;
\`\`\`

## GROUP BY

Group rows by a column, then aggregate each group.

\`\`\`sql
SELECT country, COUNT(*) AS user_count
FROM users
GROUP BY country;
\`\`\`

## HAVING

Filter groups (after GROUP BY). WHERE filters rows before grouping.

\`\`\`sql
SELECT country, COUNT(*) AS n
FROM users
GROUP BY country
HAVING COUNT(*) > 100;
\`\`\`

## Order of Clauses

\`\`\`sql
SELECT   ...      -- 5. pick columns / aggregates
FROM     ...      -- 1. source tables
JOIN     ...      -- 1b. joins
WHERE    ...      -- 2. filter rows
GROUP BY ...      -- 3. group
HAVING   ...      -- 4. filter groups
ORDER BY ...      -- 6. sort
LIMIT    ...      -- 7. limit
\`\`\`

## Key Takeaways

- Aggregate functions collapse many rows to one.
- GROUP BY produces one row per group.
- Use HAVING (not WHERE) to filter on aggregated values.`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "group-by,aggregation,count,sum,avg,having",
            order: 3,
          },
        ],
      },
    ],
  },

  // ---------------- JAVASCRIPT ----------------
  {
    slug: "javascript",
    name: "JavaScript",
    tagline: "The language of the web.",
    description:
      "Master JavaScript — the only language that runs natively in every browser, plus servers via Node.js.",
    icon: "Braces",
    color: "oklch(0.8 0.16 75)",
    category: "Programming",
    order: 7,
    modules: [
      {
        slug: "fundamentals",
        title: "JavaScript Fundamentals",
        summary: "Syntax, types, functions, and the DOM.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 100,
        tutorials: [
          {
            slug: "introduction-to-javascript",
            title: "Introduction to JavaScript",
            summary: "What JS is, where it runs, and your first script.",
            content: `# Introduction to JavaScript

JavaScript is the programming language of the web. Originally created in 10 days by Brendan Eich in 1995 for Netscape Navigator, it now powers browsers, servers (Node.js/Bun), mobile apps, and desktop apps.

## Where JavaScript Runs

- **Browsers** — every modern browser has a JS engine (V8 in Chrome, SpiderMonkey in Firefox, JavaScriptCore in Safari).
- **Servers** — Node.js, Bun, Deno.
- **Mobile/Desktop** — React Native, Electron.

## Your First Script

\`\`\`html
<script>
  console.log("Hello, World!");
</script>
\`\`\`

Or as a file:

\`\`\`javascript
// hello.js
console.log("Hello, World!");
\`\`\`

Run with Node: \`node hello.js\`.

## Variables

\`\`\`javascript
let count = 0;        // mutable
const name = "Alice"; // cannot be reassigned
var old = 1;          // legacy — prefer let/const
\`\`\`

## Types

\`\`\`javascript
typeof 42;          // "number"
typeof "hi";        // "string"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof null;        // "object"  (a famous bug)
typeof {};          // "object"
typeof [];          // "object"
typeof function(){}; // "function"
\`\`\`

## Key Takeaways

- JavaScript runs in browsers and on servers.
- Use \`let\` for mutable bindings, \`const\` for constants.
- \`typeof null\` returns "object" — a historical quirk.`,
            difficulty: "beginner",
            estimatedMinutes: 12,
            tags: "introduction,javascript,setup",
            order: 1,
          },
          {
            slug: "functions-and-closures",
            title: "Functions and Closures",
            summary: "First-class functions, arrow functions, and closures.",
            content: `# Functions and Closures in JavaScript

Functions are first-class objects in JavaScript — they can be assigned, passed, and returned like any value.

## Function Declarations vs Expressions

\`\`\`javascript
// declaration — hoisted
function add(a, b) {
  return a + b;
}

// expression — not hoisted
const add = function(a, b) {
  return a + b;
};

// arrow function — lexical this
const add = (a, b) => a + b;
\`\`\`

## Closures

A **closure** is a function that remembers the variables from the scope where it was created.

\`\`\`javascript
function counter() {
  let n = 0;
  return () => ++n;
}
const c = counter();
c(); // 1
c(); // 2
\`\`\`

The inner function "closes over" \`n\`. This is the basis for modules, private state, and many functional patterns.

## \`this\` and Arrow Functions

Regular functions get their own \`this\` depending on how they are called. Arrow functions **inherit** \`this\` from the enclosing scope.

\`\`\`javascript
const obj = {
  name: "Alice",
  greet: function() {
    setTimeout(() => console.log(this.name), 100); // "Alice"
  }
};
\`\`\`

A regular function inside setTimeout would lose \`this\`.

## Higher-Order Functions

\`\`\`javascript
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
const sum = nums.reduce((acc, n) => acc + n, 0);
\`\`\`

## Key Takeaways

- Closures capture variables from their defining scope.
- Arrow functions inherit \`this\` — use them for callbacks.
- \`map\`, \`filter\`, \`reduce\` are the bread and butter of functional JS.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "functions,closures,arrow,this",
            order: 2,
          },
          {
            slug: "async-await",
            title: "Async / Await and Promises",
            summary: "Handling asynchronous operations cleanly.",
            content: `# Async/Await and Promises

JavaScript is single-threaded with an event loop. Long operations (network, files) are asynchronous.

## Promises

A Promise represents a value that will be available in the future.

\`\`\`javascript
fetch("/api/users")
  .then(res => res.json())
  .then(users => console.log(users))
  .catch(err => console.error(err));
\`\`\`

## async / await

Modern syntax for working with Promises.

\`\`\`javascript
async function loadUsers() {
  try {
    const res = await fetch("/api/users");
    const users = await res.json();
    console.log(users);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

\`await\` pauses the function until the Promise resolves, without blocking the main thread.

## Parallel Operations

\`\`\`javascript
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json())
]);
\`\`\`

Use \`Promise.all\` to run independent operations in parallel.

## Common Mistakes

- **Forgetting await** — you get a Promise instead of the value.
- **Sequential awaits when parallel is possible** — slower.
- **Uncaught rejections** — always wrap in try/catch or add \`.catch\`.

## Key Takeaways

- Promises model future values; async/await makes them read like synchronous code.
- \`await\` does not block the main thread.
- Use \`Promise.all\` for parallelism.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "async,await,promises,concurrency",
            order: 3,
          },
        ],
      },
    ],
  },

  // ---------------- MACHINE LEARNING ----------------
  {
    slug: "machine-learning",
    name: "Machine Learning",
    tagline: "Teaching computers to learn from data.",
    description:
      "From linear regression to neural networks. Learn how machines learn — supervised, unsupervised, and the math behind it.",
    icon: "Brain",
    color: "oklch(0.72 0.16 162)",
    category: "AI/ML",
    order: 8,
    modules: [
      {
        slug: "fundamentals",
        title: "ML Fundamentals",
        summary: "What ML is, types of learning, and basic models.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 110,
        tutorials: [
          {
            slug: "introduction-to-ml",
            title: "Introduction to Machine Learning",
            summary: "What ML is, types, and the basic workflow.",
            content: `# Introduction to Machine Learning

Machine Learning (ML) is the field of building systems that improve at a task with experience (data) rather than explicit programming.

## Types of Learning

- **Supervised** — learn from labelled examples (input → output). Predict outputs for new inputs.
- **Unsupervised** — find structure in unlabelled data (clustering, dimensionality reduction).
- **Reinforcement** — learn by interacting with an environment to maximise reward.

## The ML Workflow

1. **Define the problem** — what are you predicting? What is success?
2. **Collect data** — quality data beats clever algorithms.
3. **Clean & prepare** — handle missing values, scale features, encode categoricals.
4. **Split** — train/validation/test sets.
5. **Choose a model** — start simple (linear/logistic regression), then iterate.
6. **Train** — fit the model to training data.
7. **Evaluate** — measure on the validation/test set with the right metric.
8. **Tune** — adjust hyperparameters.
9. **Deploy** — serve predictions; monitor for drift.

## Supervised Learning Examples

| Task                | Algorithm                |
|---------------------|--------------------------|
| Predict house price | Linear regression         |
| Spam classification | Logistic regression, Naive Bayes |
| Image classification | CNN / deep learning       |
| Customer churn      | Random forest, gradient boosting |

## The Bias-Variance Tradeoff

- **Underfitting (high bias)** — model too simple; misses patterns.
- **Overfitting (high variance)** — model too complex; memorises noise.
- The art is finding the sweet spot that generalises.

## Key Takeaways

- ML learns patterns from data instead of explicit rules.
- Always start with a simple baseline.
- Generalisation (good test performance) is the goal — not memorising training data.`,
            difficulty: "beginner",
            estimatedMinutes: 16,
            tags: "introduction,machine-learning,supervised,workflow",
            order: 1,
            quizzes: [
              {
                title: "Intro to ML Quiz",
                description: "ML basics.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "Which type of learning uses labelled data?",
                    options: ["Supervised", "Unsupervised", "Reinforcement", "Self-supervised"],
                    answerIndex: 0,
                    explanation: "Supervised learning trains on input→output pairs.",
                    order: 0,
                  },
                  {
                    prompt: "What does overfitting mean?",
                    options: [
                      "Model is too simple and misses patterns",
                      "Model memorises training data and fails to generalise",
                      "Model has too few parameters",
                      "Training loss is high",
                    ],
                    answerIndex: 1,
                    explanation: "Overfitting = high variance; the model fits noise instead of signal.",
                    order: 1,
                  },
                  {
                    prompt: "Which is the correct workflow order?",
                    options: [
                      "Train, collect data, evaluate, split",
                      "Collect data, split, train, evaluate",
                      "Evaluate, train, split, collect",
                      "Split, evaluate, collect, train",
                    ],
                    answerIndex: 1,
                    explanation: "Collect → split → train → evaluate prevents data leakage.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "linear-regression",
            title: "Linear Regression",
            summary: "Fitting a line to data — the foundation of ML.",
            content: `# Linear Regression

Linear regression fits a straight line (or hyperplane) that best predicts a continuous output from input features.

## The Model

\`\`\`
y = w1*x1 + w2*x2 + ... + wn*xn + b
\`\`\`

- \`xi\` are features, \`wi\` are weights, \`b\` is the bias.
- The model predicts \`y\` as a linear combination of features.

## Loss Function: Mean Squared Error

\`\`\`
MSE = (1/n) * Σ (y_true - y_pred)²
\`\`\`

Training minimises MSE by adjusting weights — typically via **gradient descent**.

## Training with scikit-learn

\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)
print("R²:", model.score(X_test, y_test))
\`\`\`

## Assumptions

1. **Linearity** — relationship is linear.
2. **Independence** — observations are independent.
3. **Homoscedasticity** — constant variance of errors.
4. **Normality** — residuals are roughly normal.

If these break, transform features (log, polynomial) or use a different model.

## Regularisation

- **Ridge (L2)** — shrinks weights toward zero; reduces variance.
- **Lasso (L1)** — drives some weights to exactly zero; performs feature selection.

## Key Takeaways

- Linear regression is the simplest supervised model — a great baseline.
- MSE measures average squared error; gradient descent minimises it.
- Ridge/Lasso regularise to prevent overfitting.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "regression,linear,mse,gradient-descent,ridge,lasso",
            order: 2,
          },
          {
            slug: "classification",
            title: "Classification",
            summary: "Logistic regression and decision boundaries.",
            content: `# Classification

Classification predicts a **discrete label** (e.g., spam vs not-spam) rather than a continuous value.

## Logistic Regression

Despite the name, logistic regression is a **classification** model. It outputs a probability via the sigmoid function:

\`\`\`
p = 1 / (1 + e^(-z))    where z = w·x + b
\`\`\`

Predict class 1 if p ≥ 0.5 (or another threshold).

\`\`\`python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
\`\`\`

## Evaluation Metrics

| Metric     | Meaning |
|------------|---------|
| Accuracy   | Fraction correct. Misleading on imbalanced data. |
| Precision  | Of predicted positives, how many are true. TP / (TP + FP) |
| Recall     | Of actual positives, how many we caught. TP / (TP + FN) |
| F1         | Harmonic mean of precision and recall. |
| ROC-AUC    | Area under ROC curve; measures ranking quality. |

## Confusion Matrix

\`\`\`
              Predicted
              Pos    Neg
Actual Pos   TP     FN
       Neg   FP     TN
\`\`\`

## Class Imbalance

If 99% of samples are negative, accuracy is misleading. Use precision/recall/F1 or resample (oversample minority, undersample majority, SMOTE).

## Other Classifiers

- **k-Nearest Neighbors** — lazy, simple, sensitive to scale.
- **Decision Tree** — interpretable, prone to overfitting.
- **Random Forest** — ensemble of trees, robust.
- **Gradient Boosting (XGBoost, LightGBM)** — state-of-the-art on tabular data.

## Key Takeaways

- Logistic regression outputs probabilities via sigmoid.
- Choose metrics based on the problem — accuracy alone is often wrong.
- For tabular data, gradient boosting usually wins.`,
            difficulty: "intermediate",
            estimatedMinutes: 20,
            tags: "classification,logistic,precision,recall,f1",
            order: 3,
          },
          {
            slug: "model-evaluation",
            title: "Model Evaluation and Cross-Validation",
            summary: "How to know if your model actually works.",
            content: `# Model Evaluation

A model that performs well on training data might be useless. Proper evaluation tells you whether your model **generalises**.

## Train / Validation / Test

- **Train** — fit the model.
- **Validation** — tune hyperparameters.
- **Test** — used ONCE at the end to estimate real-world performance.

Never touch the test set during tuning.

## Cross-Validation

k-fold cross-validation splits the data into k folds, trains on k-1, validates on the remaining fold, and repeats.

\`\`\`python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring="f1")
print(scores.mean(), scores.std())
\`\`\`

Gives a more robust estimate than a single split.

## Common Pitfalls

- **Data leakage** — scaling on the whole dataset before splitting leaks test statistics into training. Always fit preprocessors on training data only (use \`Pipeline\`).
- **Imbalanced data** — accuracy is misleading. Use stratified splits and proper metrics.
- **Overfitting to validation** — if you try many hyperparameter combos, your best validation score is optimistically biased. Hold out a final test set.

## Metrics Cheat Sheet

| Problem        | Metric                    |
|----------------|---------------------------|
| Regression     | MSE, RMSE, MAE, R²         |
| Binary class   | precision, recall, F1, AUC |
| Multiclass     | macro/micro F1, confusion  |
| Imbalanced     | PR-AUC, F1, balanced acc.  |

## Key Takeaways

- Always keep a held-out test set.
- Use cross-validation for robust estimates.
- Pick metrics that match the business goal, not just accuracy.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "evaluation,cross-validation,metrics,leakage",
            order: 4,
          },
        ],
      },
    ],
  },

  // ---------------- DBMS ----------------
  {
    slug: "dbms",
    name: "DBMS",
    tagline: "Designing databases that scale.",
    description:
      "Normalization, ACID, indexing, transactions, and concurrency. How real databases are designed.",
    icon: "Database",
    color: "oklch(0.7 0.13 200)",
    category: "Data",
    order: 9,
    modules: [
      {
        slug: "fundamentals",
        title: "DBMS Fundamentals",
        summary: "Normalization, ACID, and transactions.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 80,
        tutorials: [
          {
            slug: "normalization",
            title: "Normalization",
            summary: "1NF, 2NF, 3NF, BCNF — and when to denormalize.",
            content: `# Normalization

Normalization is the process of organising tables to reduce **redundancy** and **anomalies** (insert/update/delete inconsistencies).

## The Normal Forms

### 1NF — Atomic values

Each column holds a single, atomic value. No lists, no repeating groups.

Bad:
\`\`\`
orders: id | items
1 | "apple, banana, cherry"
\`\`\`

Good (1NF):
\`\`\`
order_items: order_id | item
1 | apple
1 | banana
1 | cherry
\`\`\`

### 2NF — No partial dependencies

Already 1NF, and every non-key column depends on the **whole** primary key (relevant for composite keys).

### 3NF — No transitive dependencies

Already 2NF, and non-key columns depend **only** on the primary key, not on other non-key columns.

Bad (3NF violation):
\`\`\`
students: id | name | dept_id | dept_name
\`\`\`

\`dept_name\` depends on \`dept_id\`, not directly on the student. Split:

\`\`\`
students: id | name | dept_id
departments: dept_id | dept_name
\`\`\`

### BCNF — Stricter 3NF

Every determinant is a candidate key.

## When to Denormalize

Normalized schemas are clean but require JOINs. For read-heavy workloads, **denormalizing** (duplicating some data) can dramatically speed up reads at the cost of update complexity.

## Key Takeaways

- Normalization reduces redundancy and anomalies.
- 3NF is a good default; BCNF is stricter.
- Denormalize deliberately, only when read performance demands it.`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "normalization,1nf,2nf,3nf,bcnf",
            order: 1,
            quizzes: [
              {
                title: "Normalization Quiz",
                description: "Normal forms.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What does 1NF require?",
                    options: [
                      "No partial dependencies",
                      "Atomic column values",
                      "A single-column primary key",
                      "All tables joinable",
                    ],
                    answerIndex: 1,
                    explanation: "1NF requires each column to hold a single atomic value.",
                    order: 0,
                  },
                  {
                    prompt: "A table (id, name, dept_id, dept_name) violates which NF?",
                    options: ["1NF", "2NF", "3NF", "BCNF"],
                    answerIndex: 2,
                    explanation: "dept_name transitively depends on id via dept_id, violating 3NF.",
                    order: 1,
                  },
                  {
                    prompt: "Why denormalize?",
                    options: [
                      "To save disk space",
                      "To speed up writes",
                      "To speed up reads at the cost of update complexity",
                      "To enforce referential integrity",
                    ],
                    answerIndex: 2,
                    explanation: "Denormalization duplicates data to avoid joins for faster reads.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "acid-and-transactions",
            title: "ACID and Transactions",
            summary: "Atomicity, Consistency, Isolation, Durability.",
            content: `# ACID and Transactions

A **transaction** is a sequence of operations executed as a single logical unit. ACID properties guarantee reliable transactions.

## The ACID Properties

### A — Atomicity
All operations in a transaction succeed, or none do. If one fails, the entire transaction rolls back.

### C — Consistency
A transaction takes the database from one valid state to another, respecting constraints and triggers.

### I — Isolation
Concurrent transactions behave as if executed serially (to a degree controlled by isolation level).

### D — Durability
Once committed, a transaction's changes survive crashes.

## SQL Example

\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- or ROLLBACK; if something failed
\`\`\`

## Isolation Levels (from weakest to strongest)

| Level              | Prevents |
|--------------------|----------|
| Read Uncommitted   | (nothing) |
| Read Committed     | dirty reads |
| Repeatable Read    | dirty + non-repeatable reads |
| Serializable       | dirty + non-repeatable + phantom reads |

Stronger isolation = safer but slower. Most OLTP uses Read Committed.

## Concurrency Anomalies

- **Dirty read** — reading uncommitted data from another transaction.
- **Non-repeatable read** — same query returns different rows on re-read.
- **Phantom read** — new rows appear on re-read due to another insert.

## Key Takeaways

- ACID guarantees reliable transactions.
- Stronger isolation prevents more anomalies but reduces concurrency.
- Always wrap multi-step writes in transactions.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "acid,transactions,isolation,concurrency",
            order: 2,
          },
          {
            slug: "indexing",
            title: "Indexing",
            summary: "B-trees and how indexes speed up queries.",
            content: `# Indexing

An index is a separate data structure that lets the database find rows quickly without scanning the whole table.

## Why Indexes Matter

Without an index, a query like \`WHERE email = 'x'\` scans every row — O(n). With an index, lookup is O(log n).

## Creating Indexes

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
\`\`\`

## B-Tree Indexes (the default)

A balanced tree where each lookup traverses log(n) nodes. Good for equality, range, and prefix queries.

## Composite Indexes

\`(user_id, created_at)\` is useful for:
- \`WHERE user_id = ?\`
- \`WHERE user_id = ? AND created_at > ?\`

But NOT for \`WHERE created_at > ?\` alone — the leading column must be filtered first (**leftmost prefix rule**).

## When Indexes Hurt

- **Writes** — every INSERT/UPDATE/DELETE must update indexes.
- **Small tables** — a scan may be faster than index lookup.
- **Wide result sets** — if a query returns most rows, the index is useless.

## EXPLAIN

Always check the query plan:

\`\`\`sql
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';
\`\`\`

Look for **Seq Scan** (bad) vs **Index Scan** (good).

## Key Takeaways

- Indexes turn O(n) scans into O(log n) lookups.
- Composite indexes follow the leftmost-prefix rule.
- Index for read patterns, but watch write overhead.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "indexing,btree,explain,composite",
            order: 3,
          },
        ],
      },
    ],
  },

  // ---------------- SYSTEM DESIGN ----------------
  {
    slug: "system-design",
    name: "System Design",
    tagline: "Designing systems that scale.",
    description:
      "Scaling, caching, load balancing, sharding, and the architecture of large systems. Essential for senior engineering.",
    icon: "Network",
    color: "oklch(0.68 0.2 30)",
    category: "Career",
    order: 10,
    modules: [
      {
        slug: "fundamentals",
        title: "System Design Fundamentals",
        summary: "Scaling, caching, load balancing.",
        order: 1,
        difficulty: "advanced",
        estimatedMinutes: 100,
        tutorials: [
          {
            slug: "scaling-from-zero",
            title: "Scaling a Web Application",
            summary: "From one server to millions of users.",
            content: `# Scaling a Web Application

How do you grow a web app from a single server to millions of users? Each step solves a specific bottleneck.

## Stage 1 — Single Server

\`\`\`
User → Web Server (app + DB on one box)
\`\`\`

Fine for low traffic. Fails when: traffic spikes, the box dies, or DB queries get slow.

## Stage 2 — Separate App and Database

\`\`\`
User → App Server → Database
\`\`\`

Splitting lets each scale independently and isolates failures.

## Stage 3 — Load Balancer + Multiple App Servers

\`\`\`
         ┌→ App 1 ┐
User → LB├→ App 2 ┤→ Database
         └→ App 3 ┘
\`\`\`

Horizontal scaling of stateless app servers behind a load balancer. Sessions must be externalised (sticky sessions or shared session store).

## Stage 4 — Cache Layer

\`\`\`
App → Cache (Redis/Memcached) → DB
\`\`\`

For reads, check the cache first. Cache hits skip the database entirely. Typical read amplification drops 10x.

Patterns: **cache-aside**, **write-through**, **write-back**.

## Stage 5 — Read Replicas + CDN

\`\`\`
Writes → Primary DB
Reads → Replica DBs (read replicas)
Static assets → CDN
\`\`\`

Most apps are read-heavy (90/10). Replicas let reads scale horizontally.

## Stage 6 — Sharding

\`\`\`
Users 1-1M   → Shard A
Users 1M-2M  → Shard B
...
\`\`\`

Partition data across multiple databases by a shard key (e.g., user_id). Enables horizontal DB scaling, but cross-shard queries become painful.

## Stage 7 — Asynchronous Processing + Message Queues

Move slow work (emails, video encoding, ML inference) to background workers via a queue (Kafka, RabbitMQ, SQS).

\`\`\`
User → App → Queue → Workers → DB
\`\`\`

## Key Takeaways

- Scale step by step — solve the bottleneck in front of you.
- Stateless app servers scale horizontally behind a load balancer.
- Cache, replicate, then shard the database as reads/writes grow.`,
            difficulty: "advanced",
            estimatedMinutes: 22,
            tags: "scaling,load-balancer,cache,sharding,replicas",
            order: 1,
            quizzes: [
              {
                title: "Scaling Quiz",
                description: "How to scale web apps.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "Why split the app server from the database?",
                    options: [
                      "It is required by law",
                      "To scale them independently and isolate failures",
                      "To reduce code complexity",
                      "Databases cannot run on the same OS",
                    ],
                    answerIndex: 1,
                    explanation: "Separation allows independent scaling and fault isolation.",
                    order: 0,
                  },
                  {
                    prompt: "What does a cache-aside pattern do?",
                    options: [
                      "Writes data to the cache and DB simultaneously",
                      "Checks the cache first; on miss, reads DB and populates cache",
                      "Deletes the cache on every write",
                      "Bypasses the database entirely",
                    ],
                    answerIndex: 1,
                    explanation: "Cache-aside reads cache first, falls back to DB on miss, and fills the cache.",
                    order: 1,
                  },
                  {
                    prompt: "When would you shard a database?",
                    options: [
                      "When you have many tables",
                      "When a single DB cannot handle write load or data volume",
                      "To avoid using a cache",
                      "Always — sharding is mandatory",
                    ],
                    answerIndex: 1,
                    explanation: "Sharding is a last resort for scaling writes/data beyond one machine.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "caching-strategies",
            title: "Caching Strategies",
            summary: "Cache-aside, write-through, write-back, and eviction.",
            content: `# Caching Strategies

A cache stores frequently-accessed data closer to the consumer for lower latency. The strategy you choose determines correctness and freshness.

## Patterns

### Cache-Aside (Lazy Loading)
App checks cache first; on miss, reads DB and populates cache.

- Pro: cache only holds what is requested.
- Con: first read is slow; stale data on DB update.

### Write-Through
App writes to cache and DB together.

- Pro: cache never stale.
- Con: write latency = cache + DB.

### Write-Back (Write-Behind)
App writes to cache only; cache asynchronously writes to DB.

- Pro: very fast writes.
- Con: data loss risk if cache crashes before flushing.

## Eviction Policies

When the cache is full, what do you remove?

| Policy | Removes |
|--------|---------|
| LRU    | Least recently used |
| LFU    | Least frequently used |
| FIFO   | Oldest inserted |
| TTL    | After a time-to-live expires |

LRU is the most common default.

## Cache Invalidation

The hardest problem in caching. Options:

- **TTL** — entries expire after N seconds.
- **Explicit invalidation** — delete the key on DB update.
- **Versioned keys** — include a version in the key.

## Common Pitfalls

- **Cache stampede** — many requests miss simultaneously and overload the DB. Fix: lock + single fill, or "early expiry" with background refresh.
- **Thundering herd** — same as stampede, on restart.
- **Stale reads** — without invalidation, users see old data.

## Key Takeaways

- Cache-aside is the default; write-through when freshness matters.
- LRU eviction is sensible for most workloads.
- Always plan invalidation — TTL, explicit, or versioned.`,
            difficulty: "advanced",
            estimatedMinutes: 18,
            tags: "caching,cache-aside,write-through,LRU,invalidation",
            order: 2,
          },
          {
            slug: "load-balancing",
            title: "Load Balancing",
            summary: "Distributing traffic across servers.",
            content: `# Load Balancing

A load balancer distributes incoming requests across multiple servers, providing horizontal scalability and high availability.

## Algorithms

| Algorithm         | Description |
|-------------------|-------------|
| Round Robin       | Each server takes turns. |
| Weighted RR       | Servers with more capacity get more requests. |
| Least Connections | Send to the server with the fewest active connections. |
| IP Hash           | Same client IP → same server (sticky sessions). |
| Random            | Pick randomly. |

## Layers

- **L4** (transport) — balances TCP/UDP connections. Fast, opaque to application.
- **L7** (application) — balances HTTP requests, can route by URL, header, cookie. Slower but smarter.

## Health Checks

The LB pings each backend; unhealthy servers are removed from rotation until they recover.

## Session Affinity (Sticky Sessions)

Route the same user to the same server. Useful when sessions are stored locally, but reduces flexibility. Prefer a shared session store (Redis) instead.

## Failover and High Availability

The LB itself is a single point of failure. Run LBs in pairs with a virtual IP (VIP) and VRRP/keepalived. If the active LB dies, the passive takes over.

## Examples

- **HAProxy, Nginx** — popular open-source LBs.
- **AWS ALB/NLB, GCP Load Balancer** — managed cloud LBs.
- **Cloudflare** — global anycast LB + CDN.

## Key Takeaways

- LBs distribute traffic and detect failures.
- L4 is fast, L7 is smart.
- Make LBs highly available — they are critical infrastructure.`,
            difficulty: "advanced",
            estimatedMinutes: 16,
            tags: "load-balancing,round-robin,l4,l7,ha",
            order: 3,
          },
        ],
      },
    ],
  },

  // ---------------- DEEP LEARNING ----------------
  {
    slug: "deep-learning",
    name: "Deep Learning",
    tagline: "Neural networks that learn hierarchical representations.",
    description:
      "From perceptrons to transformers. Understand the architectures powering modern AI.",
    icon: "Brain",
    color: "oklch(0.65 0.2 305)",
    category: "AI/ML",
    order: 11,
    modules: [
      {
        slug: "fundamentals",
        title: "Deep Learning Fundamentals",
        summary: "Neurons, layers, activation functions, and training.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 120,
        tutorials: [
          {
            slug: "neural-networks",
            title: "Neural Networks Basics",
            summary: "Perceptrons, layers, activations, and backpropagation.",
            content: `# Neural Networks Basics

A neural network is a function approximator built from layered, differentiable transformations. Despite the name, they have only loose inspiration from biological neurons.

## The Neuron

\`\`\`
y = activation(w·x + b)
\`\`\`

- \`x\` is the input vector.
- \`w\` are weights (learned).
- \`b\` is a bias (learned).
- \`activation\` introduces non-linearity.

## Activation Functions

| Function    | Range      | Use |
|-------------|------------|-----|
| ReLU        | [0, ∞)     | Hidden layers (default) |
| Sigmoid     | (0, 1)     | Binary output |
| Tanh        | (-1, 1)    | Some RNNs |
| Softmax     | probability dist | Multiclass output |
| GELU        | ~(-0.17, ∞) | Transformers |

ReLU is the default for hidden layers — simple, fast, and avoids vanishing gradients for positive inputs.

## Layers

A network stacks layers:

\`\`\`
Input → Dense(ReLU) → Dense(ReLU) → Dense(softmax) → Output
\`\`\`

The final layer's activation depends on the task:
- Regression: linear (no activation).
- Binary classification: sigmoid.
- Multiclass: softmax.

## Forward and Backward Pass

1. **Forward** — compute predictions.
2. **Loss** — measure error (MSE, cross-entropy).
3. **Backward** — compute gradients via the chain rule (backpropagation).
4. **Update** — adjust weights via an optimizer (SGD, Adam).

## A Minimal Example (PyTorch)

\`\`\`python
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10),
)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for x, y in dataloader:
    pred = model(x)
    loss = loss_fn(pred, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
\`\`\`

## Key Takeaways

- A neuron computes \`activation(w·x + b)\`.
- Stacking layers with non-linear activations lets the network approximate complex functions.
- Training = forward, loss, backward, update.`,
            difficulty: "intermediate",
            estimatedMinutes: 22,
            tags: "neural-networks,perceptron,activation,backpropagation",
            order: 1,
            quizzes: [
              {
                title: "Neural Networks Quiz",
                description: "NN fundamentals.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What does an activation function introduce?",
                    options: ["Linearity", "Non-linearity", "Bias", "Regularization"],
                    answerIndex: 1,
                    explanation: "Without non-linear activations, stacked linear layers collapse to a single linear transform.",
                    order: 0,
                  },
                  {
                    prompt: "Which activation is the default for hidden layers?",
                    options: ["Sigmoid", "ReLU", "Softmax", "Tanh"],
                    answerIndex: 1,
                    explanation: "ReLU is simple, fast, and avoids vanishing gradients for positive inputs.",
                    order: 1,
                  },
                  {
                    prompt: "What does backpropagation compute?",
                    options: [
                      "The forward pass",
                      "Gradients of the loss w.r.t. weights",
                      "The learning rate",
                      "Regularization penalties",
                    ],
                    answerIndex: 1,
                    explanation: "Backprop uses the chain rule to compute gradients for the optimizer.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "training-and-optimization",
            title: "Training and Optimization",
            summary: "Loss functions, optimizers, regularization.",
            content: `# Training and Optimization

Training a neural network is mostly about choosing the right loss, optimizer, and regularization. The architecture often matters less than these.

## Loss Functions

| Task              | Loss |
|-------------------|------|
| Regression        | MSE, MAE, Huber |
| Binary class      | Binary cross-entropy |
| Multiclass class  | Categorical cross-entropy |

## Optimizers

- **SGD** — vanilla stochastic gradient descent. Add **momentum** for stability.
- **Adam** — adaptive learning rates per parameter. Default choice.
- **AdamW** — Adam with decoupled weight decay. Popular for transformers.

## Learning Rate

The single most important hyperparameter. Too high → diverges; too low → slow or stuck.

Use **learning rate schedules** (cosine, step decay) or warmup for transformers.

## Regularization

- **L2 weight decay** — shrink weights toward zero.
- **Dropout** — randomly zero activations during training; prevents co-adaptation.
- **Early stopping** — stop when validation loss stops improving.
- **Data augmentation** — virtually expand the dataset (flip, crop, rotate).

## Batch Normalization

Normalizes activations within a mini-batch, stabilising training and allowing higher learning rates.

## Common Pitfalls

- **Vanishing/exploding gradients** — fix with ReLU, batch norm, careful init (He/Xavier).
- **Dead ReLU** — a neuron that always outputs zero; fix with leaky ReLU.
- **Overfitting** — large model + small data; use regularization and more data.

## Key Takeaways

- Pick the loss to match the task.
- Adam is a safe default optimizer.
- Learning rate and regularization dominate outcomes; tune carefully.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "loss,optimizer,adam,regularization,dropout",
            order: 2,
          },
        ],
      },
    ],
  },

  // ---------------- LLMs & PROMPT ENGINEERING ----------------
  {
    slug: "llms",
    name: "LLMs & Prompt Engineering",
    tagline: "Working with large language models.",
    description:
      "Prompt engineering, RAG, fine-tuning, and the architecture of modern LLM applications.",
    icon: "Sparkles",
    color: "oklch(0.7 0.18 30)",
    category: "AI/ML",
    order: 12,
    modules: [
      {
        slug: "fundamentals",
        title: "LLM Fundamentals",
        summary: "How LLMs work and how to prompt them.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "introduction-to-llms",
            title: "Introduction to LLMs",
            summary: "What LLMs are, tokenization, and context windows.",
            content: `# Introduction to Large Language Models

A Large Language Model (LLM) is a neural network trained on massive text corpora to **predict the next token**. Through this simple objective, LLMs learn grammar, facts, reasoning patterns, and code.

## Tokenization

LLMs do not see raw text — they see **tokens**. A token is a chunk of characters (roughly 4 characters or 0.75 words in English).

\`\`\`
"The quick brown fox" → ["The", " quick", " brown", " fox"]
\`\`\`

Different models use different tokenizers (BPE, WordPiece, SentencePiece).

## Context Window

The maximum number of tokens the model can attend to at once. Larger context = more input/output, but slower and costlier inference.

- GPT-3: 2K tokens
- GPT-4: 8K–128K
- Claude 3: 200K
- Gemini 1.5: 1M+

## The Transformer Architecture

Most modern LLMs are **transformers** — they use **self-attention** to weigh the importance of each token relative to every other.

Key components:
- **Embeddings** — tokens → vectors.
- **Attention layers** — mix token information.
- **Feed-forward layers** — transform representations.
- **Layer norm + residuals** — stabilise deep stacks.

## Training Stages

1. **Pretraining** — predict next token on web-scale text. Produces a base model.
2. **Instruction tuning (SFT)** — fine-tune on (instruction, response) pairs.
3. **RLHF / DPO** — align with human preferences.

## Inference Parameters

- **Temperature** — controls randomness (0 = deterministic, 1 = creative).
- **Top-p (nucleus)** — sample from the top p% probability mass.
- **Max tokens** — cap output length.

## Key Takeaways

- LLMs predict the next token; everything else emerges from this.
- Tokenization determines how text maps to model inputs.
- Pretraining + alignment produces a useful assistant.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "llm,transformer,tokenization,context",
            order: 1,
            quizzes: [
              {
                title: "LLM Intro Quiz",
                description: "LLM basics.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "What objective are LLMs typically trained on?",
                    options: [
                      "Image classification",
                      "Next-token prediction",
                      "Reinforcement learning only",
                      "Clustering",
                    ],
                    answerIndex: 1,
                    explanation: "Next-token prediction on web-scale text is the core pretraining objective.",
                    order: 0,
                  },
                  {
                    prompt: "What does the temperature parameter control?",
                    options: [
                      "Model size",
                      "Output length",
                      "Randomness/creativity",
                      "Number of tokens",
                    ],
                    answerIndex: 2,
                    explanation: "Lower temperature = more deterministic; higher = more random.",
                    order: 1,
                  },
                  {
                    prompt: "What is RLHF?",
                    options: [
                      "Random Latent Hidden Features",
                      "Reinforcement Learning from Human Feedback",
                      "Recurrent Linear Hidden Function",
                      "Rule-based Language Heuristic Filter",
                    ],
                    answerIndex: 1,
                    explanation: "RLHF aligns models with human preferences after pretraining.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "prompt-engineering",
            title: "Prompt Engineering",
            summary: "Techniques for getting reliable outputs from LLMs.",
            content: `# Prompt Engineering

Prompt engineering is the practice of crafting inputs to reliably elicit desired outputs from an LLM. It is part art, part discipline.

## Core Principles

1. **Be specific and explicit** — vague prompts give vague outputs.
2. **Provide context** — give the model the background it needs.
3. **Show examples (few-shot)** — demonstrations beat descriptions.
4. **Constrain the output** — ask for JSON, a specific format, or a length.

## A Weak Prompt

\`\`\`
Write about Python.
\`\`\`

The model has no idea what angle, length, or audience you want.

## A Strong Prompt

\`\`\`
You are a senior Python instructor writing for absolute beginners.

Write a 200-word introduction to Python that:
- explains what Python is,
- mentions 3 real-world use cases,
- ends with a one-sentence call to action.

Return only the article text, no preamble.
\`\`\`

## Few-Shot Prompting

Provide examples of input → output:

\`\`\`
Classify the sentiment of each review.

Review: "Loved it!" → positive
Review: "Terrible service." → negative
Review: "It was okay." → neutral
Review: "Best purchase ever!" →
\`\`\`

The model continues the pattern.

## Chain-of-Thought

Ask the model to reason step by step:

\`\`\`
Think step by step, then give the final answer.
\`\`\`

This dramatically improves performance on math and reasoning tasks.

## Structured Output

\`\`\`
Return a JSON object with keys: title, summary, tags (array of strings).
Do not include any text outside the JSON.
\`\`\`

## Common Pitfalls

- **Overly long prompts** — wastes context, dilutes signal.
- **Contradictory instructions** — model picks one arbitrarily.
- **Assuming capabilities** — the model cannot browse the web or run code unless given tools.

## Key Takeaways

- Specificity, examples, and constraints beat clever wording.
- Few-shot prompting demonstrates the pattern.
- Chain-of-thought unlocks reasoning.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "prompt-engineering,few-shot,chain-of-thought",
            order: 2,
          },
          {
            slug: "rag",
            title: "Retrieval-Augmented Generation (RAG)",
            summary: "Grounding LLMs in your own data.",
            content: `# Retrieval-Augmented Generation (RAG)

RAG combines an LLM with a retrieval system so the model can answer questions **grounded in your documents**, reducing hallucination.

## The Pipeline

\`\`\`
User question
    │
    ▼
Embed question → search vector DB → top-k chunks
    │
    ▼
Prompt: "Use these chunks to answer: ..." → LLM → answer
\`\`\`

## Steps

1. **Ingest** — split documents into chunks (e.g., 500 tokens with overlap).
2. **Embed** — convert each chunk to a vector using an embedding model.
3. **Store** — insert vectors + metadata into a vector database.
4. **Retrieve** — embed the user's query, find top-k similar chunks.
5. **Generate** — feed the chunks + question to the LLM.

## Vector Databases

| DB          | Notes |
|-------------|-------|
| pgvector    | PostgreSQL extension; great if you already use Postgres |
| Pinecone    | Managed, easy to start |
| Weaviate    | Open-source, hybrid search |
| Qdrant      | Open-source, Rust-based, fast |
| Chroma      | Lightweight, good for prototyping |
| Milvus      | Distributed, scale-out |

## Chunking Strategies

- **Fixed size** — simple, e.g., 500 tokens with 50 overlap.
- **Sentence-aware** — split at sentence boundaries.
- **Document-aware** — split by headings, sections.
- **Semantic** — use a model to detect topical boundaries.

Smaller chunks = more precise retrieval but less context per chunk.

## Improving RAG

- **Hybrid search** — combine dense vectors with BM25 keyword search.
- **Re-ranking** — retrieve many, then re-rank with a cross-encoder.
- **Query expansion** — rewrite the query before retrieval.
- **Citations** — ask the LLM to cite chunk IDs in the answer.

## Key Takeaways

- RAG grounds LLMs in your data, reducing hallucinations.
- The pipeline is: chunk → embed → store → retrieve → generate.
- Chunking and retrieval quality dominate the end result.`,
            difficulty: "advanced",
            estimatedMinutes: 22,
            tags: "rag,retrieval,vector-db,embeddings",
            order: 3,
          },
        ],
      },
    ],
  },

  // ---------------- COMPUTER NETWORKS ----------------
  {
    slug: "computer-networks",
    name: "Computer Networks",
    tagline: "How computers talk to each other.",
    description:
      "The OSI model, TCP/IP, HTTP, DNS, and the protocols that run the internet.",
    icon: "Network",
    color: "oklch(0.65 0.2 305)",
    category: "Systems",
    order: 13,
    modules: [
      {
        slug: "fundamentals",
        title: "Networks Fundamentals",
        summary: "OSI, TCP/IP, HTTP, DNS.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "osi-model",
            title: "The OSI Model",
            summary: "Seven layers of network communication.",
            content: `# The OSI Model

The **Open Systems Interconnection (OSI)** model is a 7-layer conceptual framework for understanding network communication.

## The 7 Layers

| # | Layer       | Example protocols       | Responsibility |
|---|-------------|-------------------------|----------------|
| 7 | Application | HTTP, DNS, SMTP, SSH     | End-user interface |
| 6 | Presentation| TLS, JPEG, ASCII         | Data formatting, encryption |
| 5 | Session     | Sockets, RPC             | Sessions between apps |
| 4 | Transport   | TCP, UDP                 | End-to-end delivery, reliability |
| 3 | Network     | IP, ICMP                 | Routing between networks |
| 2 | Data Link   | Ethernet, Wi-Fi, ARP     | Frame delivery on local link |
| 1 | Physical    | Cables, radio, voltages  | Raw bits |

## Mnemonic

From bottom up: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way.

## How Data Flows

When you send an HTTP request:

1. Application layer builds the HTTP message.
2. Transport layer (TCP) segments it, adds ports.
3. Network layer (IP) routes packets between networks.
4. Data link layer frames packets for the local link (Ethernet/Wi-Fi).
5. Physical layer transmits bits.

At the receiver, the process reverses (decapsulation).

## TCP/IP Model (the real one)

The internet uses the simpler 4-layer TCP/IP model:

| TCP/IP Layer     | OSI Layers   |
|------------------|--------------|
| Application      | 7, 6, 5      |
| Transport        | 4            |
| Internet         | 3            |
| Network Access   | 2, 1         |

## Key Takeaways

- OSI is a teaching model; TCP/IP is what the internet actually uses.
- Each layer adds its own header; receivers strip them back off.
- Understanding the layers helps debug: is it DNS? TCP? The app?`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "osi,networking,layers,tcp-ip",
            order: 1,
            quizzes: [
              {
                title: "OSI Model Quiz",
                description: "7 layers.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "Which layer does HTTP belong to?",
                    options: ["Transport", "Application", "Network", "Data Link"],
                    answerIndex: 1,
                    explanation: "HTTP is an application-layer protocol.",
                    order: 0,
                  },
                  {
                    prompt: "Which layer is responsible for routing between networks?",
                    options: ["Layer 2", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
                    answerIndex: 1,
                    explanation: "IP (Layer 3) routes packets across networks.",
                    order: 1,
                  },
                  {
                    prompt: "Which OSI layer does TCP belong to?",
                    options: ["Application", "Presentation", "Transport", "Network"],
                    answerIndex: 2,
                    explanation: "TCP is a transport-layer protocol providing reliable delivery.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "tcp-vs-udp",
            title: "TCP vs UDP",
            summary: "Reliable vs fast — the transport choice.",
            content: `# TCP vs UDP

The transport layer has two main protocols: **TCP** (reliable) and **UDP** (fast).

## TCP — Transmission Control Protocol

- **Connection-oriented** — three-way handshake (SYN, SYN-ACK, ACK).
- **Reliable** — retransmits lost packets.
- **Ordered** — packets delivered in order.
- **Congestion control** — backs off on network congestion.

Use cases: web (HTTP), email (SMTP), file transfer (SSH/SCP), databases.

## UDP — User Datagram Protocol

- **Connectionless** — just send datagrams.
- **Unreliable** — no retransmission.
- **Unordered** — packets may arrive out of order.
- **No congestion control** — sender controls rate.

Use cases: DNS, video streaming, gaming, VoIP, DHCP.

## Header Sizes

- TCP header: 20+ bytes (lots of fields for reliability).
- UDP header: 8 bytes (source/dest port, length, checksum).

## When to Use Which

| Need                        | Choose |
|-----------------------------|--------|
| Every byte must arrive      | TCP    |
| Low latency > reliability   | UDP    |
| Streaming live video        | UDP (with app-level recovery) |
| File download               | TCP    |
| Online multiplayer game     | UDP    |
| Web request                 | TCP (HTTP/3 uses QUIC, which is UDP-based) |

## QUIC (HTTP/3)

Google's QUIC protocol runs over UDP but adds reliability, congestion control, and TLS — getting TCP-like guarantees with UDP's connection-setup speed.

## Key Takeaways

- TCP = reliable, ordered, connection-oriented.
- UDP = fast, unreliable, connectionless.
- Match the protocol to the latency/reliability needs of your application.`,
            difficulty: "intermediate",
            estimatedMinutes: 14,
            tags: "tcp,udp,transport,reliability",
            order: 2,
          },
          {
            slug: "http-basics",
            title: "HTTP Basics",
            summary: "Requests, responses, methods, and status codes.",
            content: `# HTTP Basics

HTTP (HyperText Transfer Protocol) is the application-layer protocol of the web.

## Request/Response

\`\`\`http
GET /api/users HTTP/1.1
Host: example.com
Authorization: Bearer abc123
Accept: application/json
\`\`\`

\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 42

{"users": [...]}
\`\`\`

## Methods

| Method  | Purpose |
|---------|---------|
| GET     | Retrieve a resource (safe, idempotent) |
| POST    | Create a resource |
| PUT     | Replace a resource (idempotent) |
| PATCH   | Partially update |
| DELETE  | Remove |

## Status Codes

| Range | Meaning |
|-------|---------|
| 2xx   | Success (200 OK, 201 Created, 204 No Content) |
| 3xx   | Redirection (301, 302, 304) |
| 4xx   | Client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many) |
| 5xx   | Server error (500 Internal, 502 Bad Gateway, 503 Unavailable) |

## Headers

- **Request**: \`Host\`, \`User-Agent\`, \`Authorization\`, \`Accept\`, \`Cookie\`.
- **Response**: \`Content-Type\`, \`Content-Length\`, \`Cache-Control\`, \`Set-Cookie\`, \`Location\`.

## HTTPS

HTTP over TLS. Encrypts traffic, authenticates the server via certificates, ensures integrity. Use it always in production.

## HTTP/2 and HTTP/3

- **HTTP/2** — multiplexing (multiple requests on one TCP connection), header compression, binary framing.
- **HTTP/3** — over QUIC (UDP-based), eliminates head-of-line blocking.

## Key Takeaways

- HTTP is request/response with methods and status codes.
- 4xx = your fault, 5xx = server's fault.
- Always use HTTPS; HTTP/2+ improves performance significantly.`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "http,methods,status-codes,headers,https",
            order: 3,
          },
        ],
      },
    ],
  },

  // ---------------- C++ ----------------
  {
    slug: "cpp",
    name: "C++",
    tagline: "Performance with abstraction.",
    description:
      "C++ combines low-level control with high-level abstractions. Used in games, browsers, databases, and high-frequency trading.",
    icon: "Binary",
    color: "oklch(0.72 0.16 162)",
    category: "Programming",
    order: 14,
    modules: [
      {
        slug: "fundamentals",
        title: "C++ Fundamentals",
        summary: "Syntax, classes, and the STL.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "introduction-to-cpp",
            title: "Introduction to C++",
            summary: "What C++ is and how it differs from C.",
            content: `# Introduction to C++

C++ was created by Bjarne Stroustrup in 1979 as "C with Classes". It adds object-oriented programming, generics (templates), exceptions, and a rich standard library to C — while preserving low-level performance.

## Your First C++ Program

\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
\`\`\`

- \`#include <iostream>\` brings in input/output streams.
- \`std::cout\` is the standard output stream.
- \`std::endl\` flushes and inserts a newline.

## C vs C++

| Feature        | C           | C++ |
|----------------|-------------|-----|
| Classes/OOP    | No          | Yes |
| Templates      | No          | Yes |
| Exceptions     | No          | Yes |
| STL containers | No          | Yes |
| Namespaces     | No          | Yes |
| Function overloading | No   | Yes |

C++ is mostly a superset of C — most valid C programs compile as C++.

## Compiling

\`\`\`bash
g++ hello.cpp -o hello
./hello
\`\`\`

## Why Learn C++?

- **Performance** — used in games, browsers, trading systems, databases.
- **Control** — direct memory management.
- **Ecosystem** — Unreal Engine, Qt, Boost, ROS.

## Key Takeaways

- C++ extends C with OOP, templates, exceptions, and the STL.
- It is the language of choice when you need both performance and abstraction.
- \`std::cout\` replaces \`printf\`; \`std::vector\` replaces raw arrays.`,
            difficulty: "intermediate",
            estimatedMinutes: 14,
            tags: "cpp,introduction,stl,iostream",
            order: 1,
          },
          {
            slug: "stl-containers",
            title: "STL Containers",
            summary: "vector, map, set, and friends.",
            content: `# STL Containers

The C++ Standard Template Library (STL) provides battle-tested, generic containers.

## Sequential Containers

\`\`\`cpp
#include <vector>
#include <deque>
#include <list>

std::vector<int> v = {1, 2, 3};   // dynamic array, O(1) back ops
std::deque<int> dq;                // double-ended queue
std::list<int> lst;                // doubly linked list
\`\`\`

\`std::vector\` is the default — use it unless you have a specific reason not to.

## Associative Containers

\`\`\`cpp
#include <map>
#include <set>

std::map<std::string, int> ages;   // ordered key→value, O(log n)
std::set<int> unique_nums;          // ordered unique values

ages["Alice"] = 30;
\`\`\`

## Unordered (Hashed) Containers

\`\`\`cpp
#include <unordered_map>
#include <unordered_set>

std::unordered_map<std::string, int> fast_ages;  // O(1) average
std::unordered_set<int> fast_set;
\`\`\`

Faster average lookup than ordered versions, but no ordering guarantee.

## Iterating

\`\`\`cpp
for (const auto& [name, age] : ages) {
    std::cout << name << ": " << age << "\\n";
}
\`\`\`

Range-based for loops work with all STL containers.

## Choosing a Container

| Need                          | Use |
|-------------------------------|-----|
| Dynamic array                 | \`std::vector\` |
| Frequent front insert         | \`std::deque\` or \`std::list\` |
| Ordered key→value             | \`std::map\` |
| Fast key→value                | \`std::unordered_map\` |
| Unique ordered values        | \`std::set\` |
| Unique unordered values      | \`std::unordered_set\` |

## Key Takeaways

- \`std::vector\` is the default container — fast, cache-friendly, dynamic.
- Use ordered containers when you need sorted iteration; unordered for speed.
- Pass containers by \`const&\` to avoid expensive copies.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "stl,vector,map,set,containers",
            order: 2,
          },
        ],
      },
    ],
  },

  // ---------------- JAVA ----------------
  {
    slug: "java",
    name: "Java",
    tagline: "Write once, run anywhere.",
    description:
      "Java powers enterprise systems, Android apps, and big data. Learn OOP, the JVM, and the modern Java ecosystem.",
    icon: "Coffee",
    color: "oklch(0.7 0.13 200)",
    category: "Programming",
    order: 15,
    modules: [
      {
        slug: "fundamentals",
        title: "Java Fundamentals",
        summary: "Syntax, classes, and the JVM.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "introduction-to-java",
            title: "Introduction to Java",
            summary: "What Java is, the JVM, and your first program.",
            content: `# Introduction to Java

Java was released by Sun Microsystems (now Oracle) in 1995. Its promise — "write once, run anywhere" — comes from the **Java Virtual Machine (JVM)**, which runs compiled bytecode rather than native machine code.

## Your First Java Program

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

Save as \`HelloWorld.java\` (filename must match the class name), then:

\`\`\`bash
javac HelloWorld.java   # compiles to HelloWorld.class
java HelloWorld          # runs the bytecode on the JVM
\`\`\`

## The JVM

Java source compiles to bytecode (\`.class\` files), which the JVM interprets and JIT-compiles to native code at runtime. This is why Java runs on any platform with a JVM.

## Java vs Other Languages

| Feature           | Java | Python | C++ |
|-------------------|------|--------|-----|
| Compilation       | Bytecode | Interpreted | Native |
| Memory management | GC   | GC     | Manual |
| Static typing     | Yes  | No     | Yes |
| Platform           | JVM  | Interpreter | Native |

## Why Learn Java?

- **Enterprise** — banks, insurance, large-scale backends.
- **Android** — official language (along with Kotlin).
- **Big data** — Hadoop, Spark, Kafka are JVM-based.
- **Ecosystem** — mature libraries, tooling, and frameworks (Spring).

## Key Takeaways

- Java compiles to bytecode, which runs on the JVM — platform-independent.
- The JVM's garbage collector manages memory automatically.
- Java is statically typed and object-oriented.`,
            difficulty: "intermediate",
            estimatedMinutes: 14,
            tags: "java,jvm,bytecode,introduction",
            order: 1,
          },
          {
            slug: "oop-in-java",
            title: "Object-Oriented Programming in Java",
            summary: "Classes, inheritance, polymorphism, interfaces.",
            content: `# OOP in Java

Java is fundamentally object-oriented — almost everything is a class or an object.

## Classes and Objects

\`\`\`java
public class Dog {
    private String name;

    public Dog(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void bark() {
        System.out.println(name + " says woof!");
    }
}

Dog d = new Dog("Rex");
d.bark();
\`\`\`

## The Four Pillars

### Encapsulation
Bundle data and methods; hide internal state with \`private\` and expose via getters/setters.

### Inheritance
\`\`\`java
public class Puppy extends Dog {
    public Puppy(String name) { super(name); }
    @Override public void bark() { System.out.println("yip!"); }
}
\`\`\`

### Polymorphism
A \`Dog\` reference can point to a \`Puppy\` and call overridden methods at runtime.

### Abstraction
Use \`abstract class\` or \`interface\` to define behaviour without implementation.

## Interfaces

\`\`\`java
public interface Comparable<T> {
    int compareTo(T other);
}

public class Person implements Comparable<Person> {
    public int compareTo(Person other) { /* ... */ return 0; }
}
\`\`\`

Java 8+ allows default and static methods on interfaces; Java 9+ allows private methods.

## Records (Java 16+)

Concise immutable data carriers:

\`\`\`java
public record Point(int x, int y) {}
\`\`\`

Generates constructor, getters, equals, hashCode, toString.

## Key Takeaways

- Encapsulation, inheritance, polymorphism, abstraction are Java's core OOP tools.
- Prefer interfaces over abstract classes for type hierarchies.
- Use records for simple immutable data.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "java,oop,inheritance,polymorphism,interfaces",
            order: 2,
          },
        ],
      },
    ],
  },

  // ---------------- TYPESCRIPT ----------------
  {
    slug: "typescript",
    name: "TypeScript",
    tagline: "JavaScript with types.",
    description:
      "Add static types to JavaScript for safer, more maintainable code. The standard for modern web development.",
    icon: "Braces",
    color: "oklch(0.62 0.15 162)",
    category: "Programming",
    order: 16,
    modules: [
      {
        slug: "fundamentals",
        title: "TypeScript Fundamentals",
        summary: "Types, interfaces, generics.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 80,
        tutorials: [
          {
            slug: "introduction-to-typescript",
            title: "Introduction to TypeScript",
            summary: "Why types, basic types, and compilation.",
            content: `# Introduction to TypeScript

TypeScript is a **superset of JavaScript** that adds static types. It compiles to plain JavaScript, so it runs anywhere JS does.

## Why TypeScript?

- **Catch bugs earlier** — type errors at compile time, not runtime.
- **Better refactoring** — the compiler tells you what broke.
- **Self-documenting** — types document function signatures and data shapes.
- **Editor support** — autocomplete, inline docs, go-to-definition.

## Basic Types

\`\`\`typescript
let count: number = 42;
let name: string = "Alice";
let active: boolean = true;
let ids: number[] = [1, 2, 3];
let tuple: [string, number] = ["age", 30];
\`\`\`

## Type Annotations

\`\`\`typescript
function greet(name: string): string {
    return \`Hello, \${name}\`;
}
\`\`\`

## Interfaces

\`\`\`typescript
interface User {
    id: number;
    name: string;
    email?: string;  // optional
    readonly createdAt: Date;
}

function printUser(u: User) {
    console.log(u.name);
}
\`\`\`

## Type vs Interface

- \`type\` — flexible, supports unions, intersections, primitives.
- \`interface\` — extendable via \`extends\`, better for object shapes.

Use \`interface\` for objects, \`type\` for unions/aliases.

## Compilation

\`\`\`bash
tsc file.ts          # produces file.js
tsc --watch          # watch mode
\`\`\`

Most projects use a \`tsconfig.json\` to configure compiler options.

## Key Takeaways

- TypeScript = JavaScript + static types, compiled to JS.
- Types catch bugs before runtime.
- Use \`interface\` for object shapes, \`type\` for unions.`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "typescript,types,interfaces,compilation",
            order: 1,
          },
          {
            slug: "generics-and-advanced-types",
            title: "Generics and Advanced Types",
            summary: "Reusable, type-safe abstractions.",
            content: `# Generics and Advanced Types

Generics let you write reusable, type-safe code that works with any type.

## Generic Functions

\`\`\`typescript
function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

const n = first([1, 2, 3]);       // number
const s = first(["a", "b"]);      // string
\`\`\`

## Generic Interfaces

\`\`\`typescript
interface Box<T> {
    value: T;
}

const numBox: Box<number> = { value: 42 };
const strBox: Box<string> = { value: "hi" };
\`\`\`

## Type Constraints

\`\`\`typescript
function lengthOf<T extends { length: number }>(x: T): number {
    return x.length;
}

lengthOf("hello");   // 5
lengthOf([1, 2, 3]); // 3
\`\`\`

\`extends\` constrains the type parameter to types satisfying the shape.

## Union and Intersection Types

\`\`\`typescript
type ID = string | number;
type Admin = User & { permissions: string[] };
\`\`\`

- \`|\` (union) — either type.
- \`&\` (intersection) — combined shape.

## Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">;   // true
type B = IsString<42>;     // false
\`\`\`

## Mapped Types

\`\`\`typescript
type Readonly<T> = {
    [K in keyof T]: T[K];
};

type Optional<T> = {
    [K in keyof T]?: T[K];
};
\`\`\`

## Utility Types

\`\`\`typescript
Partial<User>          // all fields optional
Required<User>         // all fields required
Pick<User, "id" | "name">
Omit<User, "email">
Record<string, User>
\`\`\`

## Key Takeaways

- Generics make code reusable across types while staying type-safe.
- Constraints (\`extends\`) limit what types are allowed.
- Union, intersection, and utility types compose powerful abstractions.`,
            difficulty: "advanced",
            estimatedMinutes: 20,
            tags: "generics,constraints,union,intersection,mapped",
            order: 2,
          },
        ],
      },
    ],
  },

  // ---------------- TECHNICAL INTERVIEW PREP ----------------
  {
    slug: "interview-prep",
    name: "Technical Interview Prep",
    tagline: "Land the offer.",
    description:
      "Patterns, strategies, and practice for cracking coding and system design interviews at top tech companies.",
    icon: "Trophy",
    color: "oklch(0.75 0.16 85)",
    category: "Career",
    order: 17,
    modules: [
      {
        slug: "fundamentals",
        title: "Interview Fundamentals",
        summary: "Patterns and strategies.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 100,
        tutorials: [
          {
            slug: "coding-interview-patterns",
            title: "Coding Interview Patterns",
            summary: "The 15 patterns that solve most problems.",
            content: `# Coding Interview Patterns

Most coding interview problems reduce to a small set of recurring patterns. Recognising the pattern is half the battle.

## 1. Two Pointers

Use two indices moving toward each other or in the same direction.

\`\`\`python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target: return [left, right]
        elif s < target: left += 1
        else: right -= 1
\`\`\`

When to use: sorted array, palindromes, pair/triplet sums.

## 2. Sliding Window

Maintain a window over a sequence; expand/contract to optimise.

\`\`\`python
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    best = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i-k]
        best = max(best, window_sum)
    return best
\`\`\`

When to use: contiguous subarray/substring problems.

## 3. Fast & Slow Pointers

Two pointers moving at different speeds — detects cycles.

\`\`\`python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False
\`\`\`

## 4. Merge Intervals

Sort by start, then merge overlapping ranges.

## 5. Cyclic Sort

Place each number in its correct index for "1 to N" problems.

## 6. In-place Reversal of a LinkedList

Reverse sections of a linked list in place.

## 7. BFS

Level-by-level traversal using a queue — shortest path in unweighted graphs.

## 8. DFS

Depth-first traversal (recursion or stack) — connected components, paths.

## 9. Two Heaps

Use a max-heap for the lower half and min-heap for the upper half — median of a stream.

## 10. Subsets / Backtracking

Generate all combinations/permutations.

## 11. Binary Search

\`\`\`python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1
\`\`\`

## 12. Topological Sort

Ordering with dependencies (course schedule, build order).

## 13. Top K Elements

Heap to find the k largest/smallest/frequent.

## 14. DP

Overlapping subproblems + optimal substructure.

## 15. Graph Traversals

BFS/DFS, Dijkstra, Union-Find.

## The Meta-Strategy

1. Clarify the problem and constraints.
2. Work through examples by hand.
3. Identify the pattern.
4. Sketch the approach in pseudocode.
5. Code carefully.
6. Test with examples and edge cases.
7. Discuss complexity.

## Key Takeaways

- Most interview problems fit one of ~15 patterns.
- Recognising the pattern early saves precious time.
- Always communicate your thought process — interviewers care how you think.`,
            difficulty: "intermediate",
            estimatedMinutes: 22,
            tags: "interview,patterns,two-pointers,sliding-window,dp",
            order: 1,
            quizzes: [
              {
                title: "Interview Patterns Quiz",
                description: "Recognise common patterns.",
                passingScore: 70,
                xpReward: 50,
                questions: [
                  {
                    prompt: "Which pattern solves 'max sum subarray of size k'?",
                    options: ["Two pointers", "Sliding window", "BFS", "DP"],
                    answerIndex: 1,
                    explanation: "Sliding window keeps a running sum over a fixed-size window.",
                    order: 0,
                  },
                  {
                    prompt: "Which pattern detects a cycle in a linked list?",
                    options: ["BFS", "Fast & slow pointers", "Cyclic sort", "Top-K"],
                    answerIndex: 1,
                    explanation: "Floyd's cycle detection uses two pointers at different speeds.",
                    order: 1,
                  },
                  {
                    prompt: "For shortest path in an unweighted graph, use:",
                    options: ["DFS", "BFS", "Dijkstra", "DP"],
                    answerIndex: 1,
                    explanation: "BFS explores level by level, finding shortest paths in unweighted graphs.",
                    order: 2,
                  },
                ],
              },
            ],
          },
          {
            slug: "system-design-interview",
            title: "System Design Interview Strategy",
            summary: "How to structure a 45-minute design discussion.",
            content: `# System Design Interview Strategy

System design interviews assess your ability to architect large systems. They are open-ended — the process matters as much as the answer.

## The 6-Step Framework

### 1. Clarify requirements (5 min)

- Functional: what does the system do?
- Non-functional: scale (QPS, users), latency, consistency, availability.
- Ask about read/write ratio, geographic distribution, durability.

Example for "design Twitter":
- Post tweets, follow users, see a timeline.
- 200M DAU, 500M tweets/day, timeline < 200ms.

### 2. Estimate scale (5 min)

Back-of-the-envelope numbers:
- QPS = daily requests / 86400 (then × peak multiplier).
- Storage = per-record size × records/day × retention.
- Bandwidth = QPS × payload size.

These numbers guide your choices (cache, sharding, replicas).

### 3. APIs / interfaces (5 min)

Define the main APIs:

\`\`\`
POST /tweets
GET /feed?user_id=...&cursor=...
POST /follow
\`\`\`

### 4. High-level design (10 min)

Draw the boxes: clients, LB, app servers, cache, DB, queue, CDN. Explain the data flow.

### 5. Deep dive (15 min)

Pick 1-2 hard problems:
- How is the timeline generated? Push vs pull model.
- How do we handle hot users?
- How do we shard tweets?
- Cache strategy and invalidation.

### 6. Bottlenecks and tradeoffs (5 min)

Single points of failure, scaling limits, consistency tradeoffs (CAP theorem), observability.

## Common Building Blocks

| Component        | Use |
|------------------|-----|
| Load balancer    | Distribute traffic |
| Cache (Redis)    | Read-heavy fast paths |
| Database (SQL/NoSQL) | Persistent store |
| Message queue (Kafka) | Async decoupling |
| CDN              | Static + edge-cached content |
| Search index     | Full-text search |

## Push vs Pull for Timelines

- **Pull (fan-out on read)**: when user opens feed, query their followees' recent tweets. Cheap to write, expensive to read for popular users.
- **Push (fan-out on write)**: on tweet, write to all followers' feeds. Expensive to write, cheap to read. Bad for users with millions of followers.

Hybrid: pull for celebrities, push for normal users.

## Key Takeaways

- Follow a structured framework; communicate throughout.
- Start simple, then add complexity to meet the requirements.
- Discuss tradeoffs explicitly — there is no perfect design.`,
            difficulty: "advanced",
            estimatedMinutes: 22,
            tags: "system-design,interview,strategy,scalability",
            order: 2,
          },
        ],
      },
    ],
  },

  // ---------------- COMPUTER ARCHITECTURE ----------------
  {
    slug: "computer-architecture",
    name: "Computer Architecture",
    tagline: "How hardware executes software.",
    description:
      "CPU pipeline, memory hierarchy, instruction sets, and how code actually runs on silicon.",
    icon: "Cpu",
    color: "oklch(0.68 0.2 305)",
    category: "Systems",
    order: 18,
    modules: [
      {
        slug: "fundamentals",
        title: "Architecture Fundamentals",
        summary: "CPU, memory hierarchy, pipelining.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 80,
        tutorials: [
          {
            slug: "memory-hierarchy",
            title: "The Memory Hierarchy",
            summary: "Registers, caches, RAM, disk — and why it matters.",
            content: `# The Memory Hierarchy

Modern computers use a hierarchy of memory technologies, trading speed for size and cost.

## The Levels

| Level     | Size       | Latency (typical) |
|-----------|------------|-------------------|
| Registers | ~1 KB      | < 1 ns             |
| L1 cache  | 32-64 KB   | ~1 ns              |
| L2 cache  | 256 KB-1 MB| ~4 ns              |
| L3 cache  | 8-32 MB    | ~12 ns             |
| RAM       | 8-64 GB    | ~100 ns            |
| SSD       | TBs        | ~100 µs            |
| HDD       | TBs        | ~10 ms             |

Each level is ~10x slower (and ~10x larger) than the one above.

## Locality

Programs exploit two principles:

- **Temporal locality** — if you access X now, you'll likely access X again soon. (Caches keep recently-used data.)
- **Spatial locality** — if you access X, you'll likely access X+1 soon. (Caches fetch blocks, not single bytes.)

This is why **array traversal is faster than linked-list traversal** — sequential memory hits the cache.

## Cache Lines

Caches move data in **lines** (typically 64 bytes). Reading one byte pulls the whole line. If you then read neighbouring bytes, they are already cached.

## Cache Misses

- **Compulsory (cold)** — first access; unavoidable.
- **Capacity** — working set bigger than cache.
- **Conflict** — multiple addresses map to the same cache set.

## Why This Matters for Programmers

- Loop over arrays in the order they are laid out in memory (row-major in C/Python).
- Avoid pointer-chasing data structures (linked lists) when cache locality matters.
- Use struct-of-arrays vs array-of-structs deliberately for SIMD-friendly layouts.

## Key Takeaways

- Memory is a hierarchy; each level is ~10x slower than the one above.
- Locality (temporal + spatial) makes caches effective.
- Cache-friendly data layout can speed up code more than algorithmic tuning.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "memory,cache,hierarchy,locality",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- WEB DEVELOPMENT ----------------
  {
    slug: "web-development",
    name: "Web Development",
    tagline: "Build for the browser.",
    description:
      "HTML, CSS, frontend frameworks, and the modern web stack.",
    icon: "Globe",
    color: "oklch(0.8 0.16 75)",
    category: "Web",
    order: 19,
    modules: [
      {
        slug: "fundamentals",
        title: "Web Fundamentals",
        summary: "HTML, CSS, and the DOM.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 80,
        tutorials: [
          {
            slug: "html-css-basics",
            title: "HTML & CSS Basics",
            summary: "Structure and style for the web.",
            content: `# HTML & CSS Basics

Every web page is HTML (structure) styled by CSS (presentation).

## HTML Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <header>
        <h1>Welcome</h1>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
        </nav>
    </header>
    <main>
        <article>
            <h2>First Post</h2>
            <p>Hello, web!</p>
        </article>
    </main>
    <footer>© 2024</footer>
</body>
</html>
\`\`\`

Use **semantic tags** (\`header\`, \`nav\`, \`main\`, \`article\`, \`section\`, \`footer\`) — they improve accessibility and SEO.

## CSS

\`\`\`css
body {
    font-family: system-ui, sans-serif;
    margin: 0;
    color: #222;
}

h1 {
    color: #16a34a;
}

.container {
    max-width: 720px;
    margin: 0 auto;
    padding: 1rem;
}
\`\`\`

## The Box Model

Every element is a box with:
- **content** (the actual size)
- **padding** (inside the border)
- **border**
- **margin** (outside the border)

\`box-sizing: border-box\` makes width include padding and border — the intuitive behaviour.

## Flexbox (1D layouts)

\`\`\`css
.row {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
}
\`\`\`

## Grid (2D layouts)

\`\`\`css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
}
\`\`\`

## Responsive Design

\`\`\`css
@media (max-width: 768px) {
    .row { flex-direction: column; }
}
\`\`\`

Mobile-first: design for small screens, then enhance.

## Key Takeaways

- Use semantic HTML for accessibility and SEO.
- The box model governs layout; \`box-sizing: border-box\` avoids surprises.
- Flexbox for 1D, Grid for 2D, media queries for responsiveness.`,
            difficulty: "beginner",
            estimatedMinutes: 16,
            tags: "html,css,layout,flexbox,grid,responsive",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- SOFTWARE ENGINEERING ----------------
  {
    slug: "software-engineering",
    name: "Software Engineering",
    tagline: "Practices that scale beyond one person.",
    description:
      "Version control, testing, CI/CD, design patterns, and the discipline of building real software.",
    icon: "GitBranch",
    color: "oklch(0.7 0.13 200)",
    category: "Systems",
    order: 20,
    modules: [
      {
        slug: "fundamentals",
        title: "Engineering Practices",
        summary: "Version control, testing, and patterns.",
        order: 1,
        difficulty: "intermediate",
        estimatedMinutes: 90,
        tutorials: [
          {
            slug: "git-essentials",
            title: "Git Essentials",
            summary: "Branches, commits, and collaboration.",
            content: `# Git Essentials

Git is the de facto version control system. Understanding it deeply pays off for your entire career.

## The Core Concepts

- **Repository** — a project's history, stored as a graph of commits.
- **Commit** — a snapshot of the working tree at a point in time.
- **Branch** — a movable pointer to a commit; branches diverge and merge.
- **HEAD** — pointer to the current commit/branch.

## Everyday Workflow

\`\`\`bash
git status                       # what changed?
git add file.txt                 # stage changes
git commit -m "feat: add login"  # save snapshot
git push origin main             # share with remote
\`\`\`

## Branching

\`\`\`bash
git checkout -b feature/login   # create + switch
git switch main
git merge feature/login         # merge into main
\`\`\`

## Commit Messages

Follow conventions:

\`\`\`
feat: add user registration
fix: handle null email in profile
docs: update README setup steps
refactor: extract password hashing
test: add tests for leaderboard
chore: bump dependencies
\`\`\`

## Undoing Things

\`\`\`bash
git restore file.txt            # discard unstaged changes
git restore --staged file.txt   # unstage
git reset --soft HEAD~1         # undo last commit, keep changes
git revert <sha>                # create a commit that undoes <sha>
\`\`\`

## Common Patterns

- **Feature branches** — one branch per feature, merged via PR.
- **Trunk-based** — small, frequent merges to main.
- **Git flow** — main + develop + feature + release + hotfix branches (heavier).

## Key Takeaways

- Commits are snapshots; branches are pointers.
- Write clear commit messages — your future self will thank you.
- Use feature branches and pull requests for review and CI.`,
            difficulty: "intermediate",
            estimatedMinutes: 16,
            tags: "git,version-control,branching,commits",
            order: 1,
          },
          {
            slug: "testing-fundamentals",
            title: "Testing Fundamentals",
            summary: "Unit, integration, and end-to-end tests.",
            content: `# Testing Fundamentals

Tests give you confidence to change code without breaking things. Different test types trade off speed for coverage.

## The Test Pyramid

\`\`\`
        /\\
       /e2e\\       few, slow, whole-system
      /------\\
     /integration\\  medium, multiple units together
    /--------------\\
   /     unit        \\ many, fast, single function
  /--------------------\\
\`\`\`

Most tests should be **unit** tests — fast, isolated, deterministic. A few integration tests verify pieces fit together. Very few end-to-end tests check critical user journeys.

## Unit Tests

Test one function/class in isolation.

\`\`\`python
def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
\`\`\`

AAA pattern: Arrange, Act, Assert.

## Integration Tests

Test multiple components together, often with a real (or test) database.

\`\`\`python
def test_user_can_register():
    response = client.post("/api/auth/register", json={...})
    assert response.status_code == 201
\`\`\`

## End-to-End (E2E) Tests

Drive a real browser through a user journey. Slow and flaky, but high confidence.

\`\`\`javascript
test("user can log in", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "alice@example.com");
    await page.click("button[type=submit]");
    await expect(page).toHaveURL("/dashboard");
});
\`\`\`

## What to Test

- **Behaviour, not implementation** — test what the code does, not how.
- **Edge cases** — empty, null, very large, very small, boundary values.
- **Regression** — when a bug is found, write a test that reproduces it, then fix.

## What Not to Test

- Trivial getters/setters.
- Third-party libraries (assume they work).
- Visual styling (use snapshot tests sparingly).

## Key Takeaways

- The pyramid: many unit, some integration, few E2E.
- Test behaviour, not implementation.
- Every bug fix should come with a regression test.`,
            difficulty: "intermediate",
            estimatedMinutes: 18,
            tags: "testing,unit,integration,e2e,pyramid",
            order: 2,
          },
        ],
      },
    ],
  },

  // ============================================================
  // NEW SUBJECTS — added in ADD-COURSES-1
  // ============================================================

  // ---------------- PROGRAMMING ----------------
  {
    slug: "programming",
    name: "Programming",
    tagline: "The craft of instructing computers to solve problems.",
    description:
      "Master the universal concepts of programming — variables, control flow, functions, data structures, and the mental models behind every language.",
    icon: "Code2",
    color: "oklch(0.62 0.15 162)",
    category: "Programming",
    order: 50,
    modules: [
      {
        slug: "fundamentals",
        title: "Programming Fundamentals",
        summary: "Core concepts shared by every programming language.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-programming",
            title: "Introduction to Programming",
            summary: "What programming is, why it matters, and how to start.",
            learningObjectives: [
              "Define programming and explain what a program is.",
              "Identify the core concepts shared across all programming languages.",
              "Describe the edit-compile-run-debug loop.",
              "Explain how programming relates to algorithms and software engineering.",
              "Recognise real-world systems built by programmers.",
            ],
            prerequisites: [
              { label: "Basic computer literacy (files, terminal)." },
              { label: "A code editor installed (VS Code recommended)." },
            ],
            whereItFits:
              "This is the first tutorial in the Programming Fundamentals module. It assumes no prior coding experience and establishes the vocabulary that every later tutorial — variables, control flow, functions, data structures — builds on.",
            keyTakeaways: [
              "Programming is the act of instructing a computer through precise, unambiguous steps.",
              "A language is just the medium; computational thinking is the real skill.",
              "The edit-run-debug loop is the heartbeat of every developer's day.",
              "Every advanced discipline — AI, web, data, systems — rests on programming.",
            ],
            selfAssessment: [
              "I can explain in one sentence what programming is.",
              "I can describe the edit-compile-run-debug loop without referencing notes.",
              "I can list three core concepts shared by all programming languages.",
              "I can name two real-world systems built by programmers.",
            ],
            content: `# Introduction to Programming

## What Is Programming?

Programming is the craft of writing precise instructions that a computer can execute to solve a problem or perform a task. At its heart, programming is communication: you tell a machine, in a language it understands, exactly what to do step by step with no room for ambiguity.

A program is a sequence of instructions written in a language such as Python, C, JavaScript, or Go. The computer follows these instructions literally — if they are correct, the program works; if they contain bugs, it does not.

## Why It Matters

Every piece of software you use — from your browser to a self-driving car — began as a program written by a human. Programming is the literacy of the digital age: it lets you build, automate, and reason about software rather than merely consume it. Whether you aim to build web apps, train AI models, or analyze data, programming is the foundation every other discipline stands on.

## What You Will Learn

- Core concepts: variables, types, expressions, control flow, and functions.
- How to read, write, and reason about code in multiple languages.
- The edit-compile-run-debug loop and how to use it efficiently.
- Common pitfalls and how experienced developers avoid them.
- How programming connects to algorithms, data structures, and software engineering.

## Key Takeaways

- Programming means instructing a computer through precise, unambiguous steps.
- A language is just the medium; computational thinking is the real skill.
- The edit-run-debug loop is the heartbeat of every developer's day.
- Every advanced discipline — AI, web, data, systems — rests on programming.

## Next Steps

Continue to the next tutorial, where you will set up your development environment and write your first program. From there, you will progress through variables, control flow, functions, and data structures — building the fluency that every later subject assumes.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "programming,beginner,introduction,foundations",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- OBJECT-ORIENTED PROGRAMMING ----------------
  {
    slug: "object-oriented-programming",
    name: "Object-Oriented Programming",
    tagline: "Modeling software as interacting objects.",
    description:
      "Learn the principles of OOP — encapsulation, inheritance, polymorphism, and abstraction — and how they help manage complexity in large codebases.",
    icon: "Braces",
    color: "oklch(0.65 0.17 150)",
    category: "Programming",
    order: 51,
    modules: [
      {
        slug: "fundamentals",
        title: "Object-Oriented Programming Fundamentals",
        summary: "Classes, objects, and the four pillars of OOP.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-object-oriented-programming",
            title: "Introduction to Object-Oriented Programming",
            summary: "What OOP is, its four pillars, and why it dominates industry code.",
            learningObjectives: [
              "Define object-oriented programming and explain its core idea.",
              "Describe the four pillars: encapsulation, inheritance, polymorphism, abstraction.",
              "Distinguish a class from an object.",
              "Recognise when OOP is a good fit and when it is not.",
              "Map real-world domains to object models.",
            ],
            prerequisites: [
              { label: "Basic familiarity with a programming language." },
            ],
            whereItFits:
              "This is the first tutorial in the OOP Fundamentals module. It assumes you already understand basic programming (variables, functions, control flow) and introduces the paradigm that dominates most enterprise codebases.",
            keyTakeaways: [
              "OOP bundles state and behavior into objects that interact.",
              "The four pillars help manage complexity as code grows.",
              "Composition is often preferable to deep inheritance hierarchies.",
              "Most enterprise codebases assume OOP fluency.",
            ],
            selfAssessment: [
              "I can define each of the four pillars in one sentence.",
              "I can explain the difference between a class and an object.",
              "I can identify when OOP is a good fit for a given problem.",
              "I can describe why composition may be preferable to inheritance.",
            ],
            content: `# Introduction to Object-Oriented Programming

## What Is Object-Oriented Programming?

Object-Oriented Programming (OOP) is a paradigm that organizes software around objects — data structures that bundle state (fields) with behavior (methods). Rather than writing functions that operate on loose data, you model the world as a collection of interacting objects, each responsible for a specific concept.

The four pillars of OOP are: encapsulation (hiding internal state), inheritance (sharing behavior between types), polymorphism (treating different objects through a common interface), and abstraction (exposing only what matters). Together they let programmers manage complexity as systems grow.

## Why It Matters

OOP has shaped how industry code is written for decades. Languages like Java, C#, C++, and Python are deeply object-oriented, and most enterprise codebases, frameworks, and APIs you will encounter assume OOP fluency. Understanding it lets you design code that is modular, reusable, and easier to extend.

## What You Will Learn

- The four pillars: encapsulation, inheritance, polymorphism, abstraction.
- Classes, instances, constructors, and access modifiers.
- Composition vs inheritance and when to use each.
- Common design patterns expressed in OOP terms.
- How to model real-world domains as objects.

## Key Takeaways

- OOP bundles state and behavior into objects that interact.
- The four pillars help manage complexity as code grows.
- Composition is often preferable to deep inheritance hierarchies.
- Most enterprise codebases assume OOP fluency.

## Next Steps

Next, you will define your first class, instantiate objects, and progressively add inheritance and polymorphism. By the end of the module you will refactor a procedural program into a clean OOP design.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "oop,programming,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- BACKEND DEVELOPMENT ----------------
  {
    slug: "backend-development",
    name: "Backend Development",
    tagline: "Building the APIs and services behind every app.",
    description:
      "Master server-side development: HTTP, REST and GraphQL APIs, databases, authentication, and the architecture of services that power web and mobile apps.",
    icon: "Server",
    color: "oklch(0.62 0.13 200)",
    category: "Web",
    order: 52,
    modules: [
      {
        slug: "fundamentals",
        title: "Backend Development Fundamentals",
        summary: "HTTP, APIs, databases, and authentication essentials.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-backend-development",
            title: "Introduction to Backend Development",
            summary: "What backends do, how they are built, and why they matter.",
            learningObjectives: [
              "Describe what a backend is and what it does.",
              "Explain the request-response lifecycle of a backend service.",
              "Identify the major components: API, business logic, data layer, auth.",
              "Compare REST, GraphQL, and gRPC at a high level.",
              "Recognise the security and reliability concerns of backend systems.",
            ],
            prerequisites: [
              { label: "Basic programming familiarity (any language)." },
              { label: "Conceptual understanding of HTTP (what a request and response are)." },
            ],
            whereItFits:
              "This is the first tutorial in the Backend Development Fundamentals module, within the Software Engineering domain. It assumes basic programming and introduces server-side concepts that connect to databases, security, and DevOps.",
            keyTakeaways: [
              "Backends serve data and business logic to clients over a network.",
              "API design is the single most important backend skill.",
              "Most backends are stateless services in front of a database.",
              "Caching and queues unlock performance and resilience.",
            ],
            selfAssessment: [
              "I can explain what a backend is to a non-technical person.",
              "I can describe the request-response lifecycle of a typical API call.",
              "I can list the major components of a backend service.",
              "I can name two reasons caching matters in backend systems.",
            ],
            content: `# Introduction to Backend Development

## What Is Backend Development?

Backend development is the craft of building the server-side software that powers applications. When you log in, submit a form, or fetch a feed, a backend service receives the request, applies business logic, reads or writes data, and returns a response. It is the part of the system users never see directly but absolutely depend on.

A typical backend exposes an HTTP API (REST, GraphQL, or gRPC), talks to a database, integrates with external services, enforces authentication and authorization, and runs reliably under load. Backend engineers design these systems for correctness, performance, and security.

## Why It Matters

Every web and mobile app you use is powered by a backend. Backend engineering is one of the largest and most stable career paths in software, and the skills — API design, data modeling, caching, concurrency — transfer to every other engineering discipline including AI, data, and platforms.

## What You Will Learn

- HTTP, REST, and GraphQL API design.
- Request lifecycle, middleware, and routing.
- Databases, ORMs, transactions, and migrations.
- Authentication, sessions, and authorization.
- Caching, queues, and background jobs.

## Key Takeaways

- Backends serve data and business logic to clients over a network.
- API design is the single most important backend skill.
- Most backends are stateless services in front of a database.
- Caching and queues unlock performance and resilience.

## Next Steps

In the next tutorial, you will build your first HTTP endpoint, connect it to a database, and progressively add authentication, validation, and tests — ending with a small but production-shaped service.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "backend,api,http,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- FRONTEND DEVELOPMENT ----------------
  {
    slug: "frontend-development",
    name: "Frontend Development",
    tagline: "Building the interfaces users touch.",
    description:
      "Learn HTML, CSS, JavaScript, modern frameworks (React, Vue), accessibility, performance, and the principles of building interfaces that are fast, usable, and inclusive.",
    icon: "Globe",
    color: "oklch(0.7 0.16 280)",
    category: "Web",
    order: 53,
    modules: [
      {
        slug: "fundamentals",
        title: "Frontend Development Fundamentals",
        summary: "HTML, CSS, JavaScript, and the modern component-based UI.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-frontend-development",
            title: "Introduction to Frontend Development",
            summary: "What the frontend is, the core technologies, and why it matters.",
            learningObjectives: [
              "Describe what frontend code runs and where it executes.",
              "Identify the three core frontend technologies: HTML, CSS, JavaScript.",
              "Explain what a frontend framework is and why teams use them.",
              "Recognise accessibility and performance as first-class concerns.",
              "Map user interactions to the underlying DOM events.",
            ],
            prerequisites: [
              { label: "Basic familiarity with using a web browser and a text editor." },
            ],
            whereItFits:
              "This is the first tutorial in the Frontend Development Fundamentals module, within the Software Engineering domain. It assumes no prior web development experience and precedes tutorials on HTML, CSS, and component-based UI.",
            keyTakeaways: [
              "Frontend code runs in the browser and shapes what users experience.",
              "HTML, CSS, and JavaScript remain the foundation under every framework.",
              "Accessibility and performance are first-class requirements, not afterthoughts.",
              "Modern frontends are composed of reusable components.",
            ],
            selfAssessment: [
              "I can explain what the frontend is and where its code executes.",
              "I can name the three core frontend technologies and what each does.",
              "I can describe what a frontend framework is and why teams use one.",
              "I can list two reasons accessibility matters in frontend work.",
            ],
            content: `# Introduction to Frontend Development

## What Is Frontend Development?

Frontend development is the practice of building the parts of an application that users see and interact with — the HTML structure, CSS styling, and JavaScript behavior that run inside a browser. Every button you click, every form you fill, and every animation you see is frontend code executing on your device.

Modern frontend development relies on frameworks like React, Vue, or Svelte, build tools, component libraries, and a deep understanding of browser APIs. It blends engineering with design: you must build interfaces that are fast, accessible, responsive, and delightful to use.

## Why It Matters

The frontend is where users meet your product. A fast, accessible, well-designed interface can be the difference between a successful product and an abandoned one. Frontend skills are in constant demand, and they overlap with mobile, design systems, and even AI-powered UIs.

## What You Will Learn

- HTML semantics, CSS layout (Flexbox, Grid), and responsive design.
- JavaScript and the Document Object Model.
- Component-based UI with React or a similar framework.
- Accessibility (WCAG) and performance optimization.
- Build tooling, bundlers, and deployment.

## Key Takeaways

- Frontend code runs in the browser and shapes what users experience.
- HTML, CSS, and JavaScript remain the foundation under every framework.
- Accessibility and performance are first-class requirements, not afterthoughts.
- Modern frontends are composed of reusable components.

## Next Steps

In the next tutorial, you will set up a project, write your first HTML page, add styles, and progressively build it into an interactive component-based UI.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "frontend,html,css,javascript,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- MOBILE DEVELOPMENT ----------------
  {
    slug: "mobile-development",
    name: "Mobile Development",
    tagline: "Building native and cross-platform mobile apps.",
    description:
      "Learn iOS, Android, and cross-platform development (React Native, Flutter). Master touch interfaces, mobile UX, app lifecycle, and mobile-specific performance and battery considerations.",
    icon: "Layers",
    color: "oklch(0.65 0.2 305)",
    category: "Web",
    order: 54,
    modules: [
      {
        slug: "fundamentals",
        title: "Mobile Development Fundamentals",
        summary: "Platforms, lifecycle, UI patterns, and distribution.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-mobile-development",
            title: "Introduction to Mobile Development",
            summary: "What mobile development is, the platforms, and the unique constraints.",
            learningObjectives: [
              "Describe what mobile development is and what platforms exist.",
              "Compare native, cross-platform, and web-based mobile approaches.",
              "Identify the constraints that shape mobile design: CPU, battery, lifecycle.",
              "Explain how apps are distributed via the App Store and Google Play.",
              "Recognise the touch-first UX patterns unique to mobile.",
            ],
            prerequisites: [
              { label: "Basic programming familiarity." },
              { label: "A smartphone to test on (physical device or emulator)." },
            ],
            whereItFits:
              "This is the first tutorial in the Mobile Development Fundamentals module, within the Software Engineering domain. It complements Frontend and Backend Development by focusing on the mobile platform.",
            keyTakeaways: [
              "Mobile development spans native iOS, native Android, and cross-platform.",
              "Mobile constraints (CPU, battery, lifecycle) shape every design decision.",
              "Touch UX and platform conventions matter as much as code quality.",
              "Distribution happens through curated app stores.",
            ],
            selfAssessment: [
              "I can describe the three main approaches to mobile development.",
              "I can list three mobile-specific constraints that shape design.",
              "I can explain how mobile apps are distributed to users.",
              "I can name one UX pattern unique to touch-first interfaces.",
            ],
            content: `# Introduction to Mobile Development

## What Is Mobile Development?

Mobile development is the practice of building applications that run on smartphones and tablets. It comes in three flavors: native iOS (Swift), native Android (Kotlin), and cross-platform (React Native, Flutter) where one codebase targets both. Each has tradeoffs around performance, developer experience, and access to platform APIs.

Mobile apps differ from web apps in several important ways: they run with constrained CPU, memory, and battery; they must handle interrupted lifecycle (background, foreground, notifications); they distribute through app stores with review processes; and they interact with touch, camera, GPS, and other device capabilities.

## Why It Matters

Over 6 billion people use smartphones, and mobile is the primary computing platform for most of the world. Building for mobile requires a unique blend of design, performance engineering, and platform knowledge — and the skills are in demand across consumer, enterprise, and emerging AI-powered apps.

## What You Will Learn

- Native vs cross-platform: choosing the right approach.
- App lifecycle, navigation, and state management.
- Touch UI, gestures, and mobile-specific UX patterns.
- Performance, battery, and offline-first design.
- Distribution via the App Store and Google Play.

## Key Takeaways

- Mobile development spans native iOS, native Android, and cross-platform.
- Mobile constraints (CPU, battery, lifecycle) shape every design decision.
- Touch UX and platform conventions matter as much as code quality.
- Distribution happens through curated app stores.

## Next Steps

In the next tutorial, you will install a mobile SDK, build a Hello World app, run it on an emulator, and progressively add navigation, state, and a network call.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "mobile,ios,android,cross-platform,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- DATA SCIENCE ----------------
  {
    slug: "data-science",
    name: "Data Science",
    tagline: "Turning raw data into decisions.",
    description:
      "Master the data science lifecycle: collection, cleaning, exploration, visualization, statistical analysis, and communicating insights that drive decisions.",
    icon: "Database",
    color: "oklch(0.7 0.15 200)",
    category: "Data",
    order: 55,
    modules: [
      {
        slug: "fundamentals",
        title: "Data Science Fundamentals",
        summary: "The data science lifecycle from raw data to insight.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-data-science",
            title: "Introduction to Data Science",
            summary: "What data science is, the lifecycle, and why it matters.",
            learningObjectives: [
              "Define data science and its three pillars: programming, statistics, domain.",
              "Describe the data science lifecycle end to end.",
              "Identify common tools and libraries (Python, pandas, scikit-learn).",
              "Explain why data cleaning consumes most of a data scientist's time.",
              "Recognise the ethical and communication responsibilities of the role.",
            ],
            prerequisites: [
              { label: "Basic Python programming familiarity." },
              { label: "Comfort with simple statistics (mean, median, variance)." },
            ],
            whereItFits:
              "This is the first tutorial in the Data Science Fundamentals module, within the Data Science domain. It introduces the lifecycle that connects to data engineering, statistics, and machine learning.",
            keyTakeaways: [
              "Data science combines programming, statistics, and domain knowledge.",
              "Most time is spent cleaning and exploring, not modeling.",
              "Communicating results clearly is as important as the analysis.",
              "It underpins analytics, ML, and AI work.",
            ],
            selfAssessment: [
              "I can define data science and its three pillars.",
              "I can list the stages of the data science lifecycle in order.",
              "I can explain why data cleaning takes so much of a data scientist's time.",
              "I can name two Python libraries commonly used in data science.",
            ],
            content: `# Introduction to Data Science

## What Is Data Science?

Data science is the practice of extracting knowledge and decisions from data. It blends programming, statistics, and domain expertise to answer questions like "which customers will churn?", "what products should we recommend?", and "is this A/B test result real?"

The typical data science lifecycle moves through data collection, cleaning, exploration (EDA), modeling, evaluation, and communication. A data scientist spends most of their time on the unglamorous middle steps — wrangling messy data into a shape where analysis is even possible.

## Why It Matters

Every modern organization generates data faster than humans can read. Data science is how that data becomes decisions: dashboards, forecasts, recommendations, and experiments. It is one of the most in-demand technical roles, and the skills underpin analytics, ML, and AI work.

## What You Will Learn

- The data science lifecycle end to end.
- Python libraries: NumPy, pandas, matplotlib, scikit-learn.
- Exploratory data analysis and visualization.
- Basic statistics and hypothesis testing.
- Communicating results to non-technical stakeholders.

## Key Takeaways

- Data science combines programming, statistics, and domain knowledge.
- Most time is spent cleaning and exploring, not modeling.
- Communicating results clearly is as important as the analysis.
- It underpins analytics, ML, and AI work.

## Next Steps

In the next tutorial, you will load a real dataset into pandas, clean it, and produce your first exploratory visualizations — building toward a complete analysis pipeline.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "data-science,statistics,python,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- MATHEMATICS FOR COMPUTING & AI ----------------
  {
    slug: "mathematics-for-computing-and-ai",
    name: "Mathematics for Computing & AI",
    tagline: "The math behind algorithms and machine learning.",
    description:
      "Build the mathematical foundations for computer science and AI: discrete math, linear algebra, calculus, probability, and statistics — applied to algorithms, optimization, and ML.",
    icon: "FunctionSquare",
    color: "oklch(0.65 0.18 25)",
    category: "Programming",
    order: 56,
    modules: [
      {
        slug: "fundamentals",
        title: "Mathematics for Computing & AI Fundamentals",
        summary: "Discrete math, linear algebra, calculus, and probability essentials.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-mathematics-for-computing-and-ai",
            title: "Introduction to Mathematics for Computing & AI",
            summary: "Why math underlies every algorithm and AI model.",
            learningObjectives: [
              "Identify the four major math areas used in computing and AI.",
              "Explain why linear algebra is the language of neural networks.",
              "Describe how calculus underpins gradient descent.",
              "Recognise probability as the foundation of statistical ML.",
              "Map each math area to concrete CS and ML applications.",
            ],
            prerequisites: [
              { label: "High-school algebra (functions, graphs)." },
            ],
            whereItFits:
              "This is the first tutorial in the Mathematics for Computing & AI module, within the Computer Science domain. It underpins machine learning, deep learning, algorithms, and cryptography.",
            keyTakeaways: [
              "Math is the language underneath algorithms, ML, and AI.",
              "Linear algebra and probability are the most-used areas in ML.",
              "Gradient descent is just calculus applied to a loss function.",
              "You do not need to memorize proofs — you need fluency and intuition.",
            ],
            selfAssessment: [
              "I can name the four major math areas used in computing.",
              "I can explain why linear algebra matters for neural networks.",
              "I can describe how calculus relates to gradient descent.",
              "I can give one example of probability used in ML.",
            ],
            content: `# Introduction to Mathematics for Computing & AI

## What Is Mathematics for Computing & AI?

Mathematics for Computing & AI is the body of mathematics that underlies computer science and modern machine learning. It includes discrete mathematics (logic, sets, combinatorics, graph theory), linear algebra (vectors, matrices, eigenvalues), calculus (derivatives, gradients, optimization), and probability and statistics.

You do not need a math degree to use these tools, but you do need fluency. A neural network is a chain of matrix multiplications followed by nonlinearities; gradient descent is calculus; probability underpins every ML model's assumptions. Knowing the math lets you understand what an algorithm is really doing.

## Why It Matters

Without the math, modern AI and ML are black boxes. With it, you can read papers, debug models, design new architectures, and reason about uncertainty. Math is also the language of algorithm analysis (Big-O is discrete math + calculus) and cryptography.

## What You Will Learn

- Discrete structures: logic, sets, relations, graphs, combinatorics.
- Linear algebra: vectors, matrices, eigenvalues, decompositions.
- Calculus and optimization: derivatives, gradients, gradient descent.
- Probability and statistics for ML.
- How each area is used in algorithms and AI.

## Key Takeaways

- Math is the language underneath algorithms, ML, and AI.
- Linear algebra and probability are the most-used areas in ML.
- Gradient descent is just calculus applied to a loss function.
- You do not need to memorize proofs — you need fluency and intuition.

## Next Steps

In the next tutorial, you will review the discrete math essentials (sets, functions, relations) and start applying them to algorithm analysis and graph problems.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "mathematics,linear-algebra,calculus,probability,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- COMPUTER VISION ----------------
  {
    slug: "computer-vision",
    name: "Computer Vision",
    tagline: "Teaching machines to see and interpret images.",
    description:
      "Master computer vision: image processing, CNNs, object detection, segmentation, and modern transformer-based vision models.",
    icon: "Sparkles",
    color: "oklch(0.62 0.2 30)",
    category: "AI/ML",
    order: 57,
    modules: [
      {
        slug: "fundamentals",
        title: "Computer Vision Fundamentals",
        summary: "Images, CNNs, detection, and modern vision transformers.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-computer-vision",
            title: "Introduction to Computer Vision",
            summary: "What computer vision is, the main tasks, and how deep learning reshaped it.",
            learningObjectives: [
              "Define computer vision and list its main tasks.",
              "Explain how images are represented as numerical tensors.",
              "Describe what a CNN learns and why convolutions suit images.",
              "Compare classification, detection, and segmentation.",
              "Recognise major application domains of computer vision.",
            ],
            prerequisites: [
              { label: "Basic Python and a working PyTorch or TensorFlow install." },
              { label: "Familiarity with neural network fundamentals." },
            ],
            whereItFits:
              "This is the first tutorial in the Computer Vision Fundamentals module, within the Artificial Intelligence domain. It builds on machine learning and feeds into multimodal AI systems.",
            keyTakeaways: [
              "Computer vision teaches machines to interpret images and video.",
              "CNNs are the workhorse; transformers are the frontier.",
              "Tasks range from classification to dense segmentation.",
              "It powers autonomous driving, medical imaging, AR, and more.",
            ],
            selfAssessment: [
              "I can list three main computer vision tasks.",
              "I can explain how an image is represented as a tensor.",
              "I can describe why convolutions suit image data.",
              "I can name two real-world applications of computer vision.",
            ],
            content: `# Introduction to Computer Vision

## What Is Computer Vision?

Computer vision is the field of AI concerned with enabling machines to interpret visual information from the world — images, video, and depth. Tasks include classification (what is in this image?), detection (where are the objects?), segmentation (which pixels belong to which object?), and generation (create a new image).

Modern computer vision is dominated by deep learning. Convolutional neural networks (CNNs) learn hierarchical visual features directly from pixels, and newer transformer-based architectures (ViT, DETR) have matched or exceeded them on many benchmarks.

## Why It Matters

Computer vision powers self-driving cars, medical imaging, face recognition, manufacturing inspection, AR filters, and content moderation. It is one of the most commercially important areas of AI, and the techniques (CNNs, attention, transfer learning) transfer to other modalities.

## What You Will Learn

- Image representation and classical image processing.
- Convolutional neural networks and visual feature learning.
- Object detection, segmentation, and keypoint estimation.
- Transfer learning and pretrained vision models.
- Vision transformers and recent advances.

## Key Takeaways

- Computer vision teaches machines to interpret images and video.
- CNNs are the workhorse; transformers are the frontier.
- Tasks range from classification to dense segmentation.
- It powers autonomous driving, medical imaging, AR, and more.

## Next Steps

In the next tutorial, you will load an image, visualize its pixel values, train a small CNN on a dataset, and use a pretrained model to detect objects.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "computer-vision,cnn,deep-learning,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- NATURAL LANGUAGE PROCESSING ----------------
  {
    slug: "natural-language-processing",
    name: "Natural Language Processing",
    tagline: "Teaching machines to read, write, and understand language.",
    description:
      "Learn NLP: text processing, embeddings, sequence models, transformers, and modern large language models for translation, summarization, and chat.",
    icon: "Brain",
    color: "oklch(0.68 0.16 320)",
    category: "AI/ML",
    order: 58,
    modules: [
      {
        slug: "fundamentals",
        title: "Natural Language Processing Fundamentals",
        summary: "Tokenization, embeddings, transformers, and LLMs.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-natural-language-processing",
            title: "Introduction to Natural Language Processing",
            summary: "What NLP is, the major tasks, and why transformers changed everything.",
            learningObjectives: [
              "Define NLP and list its main task categories.",
              "Explain tokenization and why it is the first step in any NLP pipeline.",
              "Describe what embeddings are and why they replaced one-hot vectors.",
              "Explain the transformer architecture's role in modern NLP.",
              "Recognise NLP applications used in everyday products.",
            ],
            prerequisites: [
              { label: "Basic Python familiarity." },
              { label: "Conceptual understanding of neural networks." },
            ],
            whereItFits:
              "This is the first tutorial in the NLP Fundamentals module, within the Artificial Intelligence domain. It connects to deep learning, LLMs, and generative AI.",
            keyTakeaways: [
              "NLP teaches machines to process human language.",
              "Tokenization and embeddings turn text into numbers.",
              "Transformers and pretrained models dominate modern NLP.",
              "NLP techniques transfer to vision, audio, and biology.",
            ],
            selfAssessment: [
              "I can define NLP and list three common NLP tasks.",
              "I can explain what a token is in NLP.",
              "I can describe what embeddings are and why they matter.",
              "I can name one product I use that relies on NLP.",
            ],
            content: `# Introduction to Natural Language Processing

## What Is Natural Language Processing?

Natural Language Processing (NLP) is the branch of AI concerned with human language — text and speech. Tasks include classification (spam or not?), translation, summarization, question answering, named entity recognition, and open-ended generation. The field has been transformed in the last decade by deep learning and, especially, by transformer-based large language models.

Modern NLP moves from raw text through tokenization, embedding, contextual encoding (transformers), and task-specific heads. The same pretrained backbone can be fine-tuned for many tasks — a paradigm shift from the rule-based and statistical NLP systems of the past.

## Why It Matters

NLP underpins search engines, translation, chatbots, voice assistants, content moderation, and modern LLM-powered products. The transformer architecture invented for NLP now dominates vision, audio, and even protein folding, making NLP fluency a gateway to much of modern AI.

## What You Will Learn

- Text preprocessing, tokenization, and embeddings (word2vec, BPE).
- Recurrent and convolutional models for sequences.
- The transformer architecture and self-attention.
- Fine-tuning pretrained models (BERT, T5, Llama).
- Building NLP applications: classification, QA, generation.

## Key Takeaways

- NLP teaches machines to process human language.
- Tokenization and embeddings turn text into numbers.
- Transformers and pretrained models dominate modern NLP.
- NLP techniques transfer to vision, audio, and biology.

## Next Steps

In the next tutorial, you will tokenize text, build a bag-of-words classifier, then train a small transformer model on a text classification task.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "nlp,transformers,embeddings,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- GENERATIVE AI ----------------
  {
    slug: "generative-ai",
    name: "Generative AI",
    tagline: "Models that create text, images, audio, and code.",
    description:
      "Master generative AI: diffusion models, GANs, VAEs, autoregressive LLMs, and the techniques for steering, evaluating, and deploying generative systems.",
    icon: "Sparkles",
    color: "oklch(0.75 0.16 85)",
    category: "AI/ML",
    order: 59,
    modules: [
      {
        slug: "fundamentals",
        title: "Generative AI Fundamentals",
        summary: "From autoregressive LLMs to diffusion image models.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-generative-ai",
            title: "Introduction to Generative AI",
            summary: "What generative AI is, the main model families, and how to steer them.",
            learningObjectives: [
              "Define generative AI and distinguish it from discriminative ML.",
              "Identify the major model families: LLMs, diffusion, VAEs, GANs.",
              "Explain prompting, fine-tuning, and alignment at a high level.",
              "Describe why evaluating generative quality is hard.",
              "Recognise the major product categories powered by generative AI.",
            ],
            prerequisites: [
              { label: "Basic familiarity with machine learning concepts." },
            ],
            whereItFits:
              "This is the first tutorial in the Generative AI Fundamentals module, within the Artificial Intelligence domain. It builds on deep learning and connects to LLMs and AI agents.",
            keyTakeaways: [
              "Generative models learn distributions and sample new examples.",
              "LLMs (text) and diffusion (images) are the two dominant paradigms.",
              "Steering generative models needs prompting, fine-tuning, and alignment.",
              "Evaluating quality is an open research problem.",
            ],
            selfAssessment: [
              "I can define generative AI and contrast it with discriminative ML.",
              "I can name the major generative model families.",
              "I can list two ways to steer a generative model's output.",
              "I can explain why evaluating generative quality is difficult.",
            ],
            content: `# Introduction to Generative AI

## What Is Generative AI?

Generative AI is the branch of machine learning concerned with models that produce new content — text, images, audio, video, code, or 3D assets. Instead of classifying inputs, generative models learn the distribution of training data so they can sample novel examples from it.

Major families include autoregressive language models (GPT, Llama), diffusion models for images (Stable Diffusion), variational autoencoders, generative adversarial networks, and multimodal models that combine text, vision, and audio. Each makes different tradeoffs around quality, controllability, and compute cost.

## Why It Matters

Generative AI is reshaping how software is built and how creative work is done. It powers chatbots, code assistants, image generators, voice synthesis, and design tools. Understanding how these models work — and how to steer, evaluate, and deploy them — is now a core skill for any AI practitioner.

## What You Will Learn

- The major generative model families and where each excels.
- Autoregressive LLMs and the basics of sampling and decoding.
- Diffusion models and how they generate images.
- Prompting, fine-tuning, and alignment techniques (RLHF, DPO).
- Evaluation: why generative quality is hard to measure.

## Key Takeaways

- Generative models learn distributions and sample new examples.
- LLMs (text) and diffusion (images) are the two dominant paradigms.
- Steering generative models needs prompting, fine-tuning, and alignment.
- Evaluating quality is an open research problem.

## Next Steps

In the next tutorial, you will run a small generative model, sample text and images from it, and experiment with prompts and sampling parameters to see how outputs change.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "generative-ai,llm,diffusion,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- AI AGENTS ----------------
  {
    slug: "ai-agents",
    name: "AI Agents",
    tagline: "LLMs that take actions to achieve goals.",
    description:
      "Learn AI agents: tool use, planning, memory, multi-step reasoning, and the patterns for building systems where LLMs act rather than just answer.",
    icon: "Brain",
    color: "oklch(0.65 0.2 250)",
    category: "AI/ML",
    order: 60,
    modules: [
      {
        slug: "fundamentals",
        title: "AI Agents Fundamentals",
        summary: "Tools, memory, control loops, and the agent architecture.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-ai-agents",
            title: "Introduction to AI Agents",
            summary: "What an AI agent is and how it differs from a plain LLM call.",
            learningObjectives: [
              "Define an AI agent and contrast it with a stateless LLM call.",
              "Identify the four ingredients: LLM, tools, memory, control loop.",
              "Describe the ReAct pattern and why it works.",
              "Recognise reliability and safety as the dominant deployment concerns.",
              "Map simple agent architectures to real tasks.",
            ],
            prerequisites: [
              { label: "Familiarity with calling an LLM API." },
            ],
            whereItFits:
              "This is the first tutorial in the AI Agents Fundamentals module, within the Artificial Intelligence domain. It builds on generative AI and LLMs and precedes Agentic AI (multi-agent systems).",
            keyTakeaways: [
              "An AI agent takes actions toward a goal, not just answers questions.",
              "LLM agents combine a reasoning model with tools and memory.",
              "Control patterns like ReAct structure the agent's reasoning.",
              "Reliability and safety are the main deployment challenges.",
            ],
            selfAssessment: [
              "I can define an AI agent and contrast it with a single LLM call.",
              "I can list the four core ingredients of an agent.",
              "I can describe the ReAct pattern in one sentence.",
              "I can name two reliability concerns when deploying agents.",
            ],
            content: `# Introduction to AI Agents

## What Is an AI Agent?

An AI agent is a system that perceives an environment and takes actions to achieve a goal. In the modern LLM era, "AI agent" usually means an LLM augmented with tools, memory, and a control loop so it can break a task into steps, call functions, observe results, and adapt — rather than only answering a single question.

A simple agent might answer questions by querying a search tool. A more capable agent might plan a multi-step research task, write and execute code, browse the web, and report findings. The key ingredients are: a reasoning LLM, a set of tools, memory of prior steps, and a control strategy (ReAct, plan-and-execute, reflection).

## Why It Matters

Agents turn LLMs from oracles into actors. They unlock tasks that require multi-step reasoning, external data, and side effects — automating workflows, running experiments, operating software. Agent design is one of the fastest-moving areas of applied AI.

## What You Will Learn

- The agent loop: perceive, reason, act, observe.
- Tool use: function calling and structured outputs.
- Memory: short-term context, long-term vector stores.
- Control patterns: ReAct, plan-and-execute, reflection.
- Reliability, safety, and human-in-the-loop oversight.

## Key Takeaways

- An AI agent takes actions toward a goal, not just answers questions.
- LLM agents combine a reasoning model with tools and memory.
- Control patterns like ReAct structure the agent's reasoning.
- Reliability and safety are the main deployment challenges.

## Next Steps

In the next tutorial, you will build a minimal agent that uses one tool, then extend it with multiple tools and a memory store to handle multi-step tasks.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "ai-agents,llm,react,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- AGENTIC AI ----------------
  {
    slug: "agentic-ai",
    name: "Agentic AI",
    tagline: "Systems of cooperating AI agents at scale.",
    description:
      "Move beyond single agents to multi-agent systems: orchestration, role specialization, communication, and the patterns for building robust agentic applications.",
    icon: "Network",
    color: "oklch(0.68 0.2 305)",
    category: "AI/ML",
    order: 61,
    modules: [
      {
        slug: "fundamentals",
        title: "Agentic AI Fundamentals",
        summary: "Multi-agent architectures, orchestration, and reliability.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-agentic-ai",
            title: "Introduction to Agentic AI",
            summary: "What multi-agent systems are and how they extend single agents.",
            learningObjectives: [
              "Define agentic AI and contrast it with a single AI agent.",
              "Describe common multi-agent architectures: hierarchical, peer-to-peer, debate.",
              "Identify orchestration frameworks and their primitives.",
              "Explain why reliability and observability dominate production concerns.",
              "Map multi-agent patterns to realistic workflows.",
            ],
            prerequisites: [
              { label: "Familiarity with single AI agents and LLMs." },
            ],
            whereItFits:
              "This is the first tutorial in the Agentic AI Fundamentals module, within the Artificial Intelligence domain. It builds on the AI Agents subject and explores multi-agent coordination.",
            keyTakeaways: [
              "Agentic AI uses multiple specialized agents to solve complex tasks.",
              "Orchestration frameworks provide the coordination primitives.",
              "Reliability and observability dominate production concerns.",
              "It is a fast-moving area with many open problems.",
            ],
            selfAssessment: [
              "I can define agentic AI and contrast it with a single agent.",
              "I can describe two multi-agent architectures.",
              "I can name an orchestration framework and what it provides.",
              "I can list two production concerns unique to multi-agent systems.",
            ],
            content: `# Introduction to Agentic AI

## What Is Agentic AI?

Agentic AI is the next step beyond a single AI agent: systems where multiple specialized agents collaborate to solve problems no one agent could solve alone. A research agent might delegate to a coding agent, which calls a reviewer agent, all coordinated by a planner — each with its own tools, memory, and role.

Designing agentic systems raises new questions: how do agents communicate? How is work divided? How do you prevent runaway loops and errors? Orchestration frameworks (LangGraph, AutoGen, CrewAI) provide primitives for role assignment, message passing, state management, and human-in-the-loop checkpoints.

## Why It Matters

Single agents struggle with complex, long-horizon tasks. Specialized, cooperating agents can divide and conquer, mimic how human teams work, and tackle realistic workflows — from software engineering to research to customer operations. Agentic AI is emerging as a major application pattern for LLMs.

## What You Will Learn

- Multi-agent architectures: hierarchical, peer-to-peer, debate.
- Orchestration frameworks and their primitives.
- Role specialization, tool assignment, and shared memory.
- Reliability: retries, fallbacks, timeouts, human-in-the-loop.
- Evaluation and observability for agentic systems.

## Key Takeaways

- Agentic AI uses multiple specialized agents to solve complex tasks.
- Orchestration frameworks provide the coordination primitives.
- Reliability and observability dominate production concerns.
- It is a fast-moving area with many open problems.

## Next Steps

In the next tutorial, you will model a small multi-agent workflow — a planner and a worker — then progressively add a reviewer and a shared memory store.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "agentic-ai,multi-agent,orchestration,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- MLOPS ----------------
  {
    slug: "mlops",
    name: "MLOps",
    tagline: "Shipping and operating ML in production.",
    description:
      "Master MLOps: experiment tracking, model registries, reproducible pipelines, deployment patterns, monitoring, and the engineering of reliable ML systems.",
    icon: "GitBranch",
    color: "oklch(0.62 0.15 162)",
    category: "AI/ML",
    order: 62,
    modules: [
      {
        slug: "fundamentals",
        title: "MLOps Fundamentals",
        summary: "Pipelines, registries, deployment, and monitoring for ML.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-mlops",
            title: "Introduction to MLOps",
            summary: "What MLOps is and why most ML projects fail without it.",
            learningObjectives: [
              "Define MLOps and its relationship to DevOps.",
              "Identify the major components of an MLOps stack.",
              "Explain data drift and model drift.",
              "Describe the ML lifecycle from notebook to monitored production system.",
              "Recognise the cultural and organisational dimensions of MLOps.",
            ],
            prerequisites: [
              { label: "Familiarity with training a basic ML model." },
              { label: "Conceptual understanding of CI/CD." },
            ],
            whereItFits:
              "This is the first tutorial in the MLOps Fundamentals module, within the Artificial Intelligence domain. It connects ML engineering with DevOps, data engineering, and platform engineering.",
            keyTakeaways: [
              "MLOps applies DevOps principles to ML systems.",
              "Reproducibility and monitoring are the central challenges.",
              "Drift (data and model) is unique to ML and must be tracked.",
              "MLOps bridges ML, data, and platform engineering.",
            ],
            selfAssessment: [
              "I can define MLOps and explain its relationship to DevOps.",
              "I can list three components of an MLOps stack.",
              "I can describe data drift in one sentence.",
              "I can name one reason most ML projects fail to reach production.",
            ],
            content: `# Introduction to MLOps

## What Is MLOps?

MLOps (Machine Learning Operations) is the engineering discipline of building, deploying, and maintaining ML systems reliably in production. It applies DevOps ideas — versioning, automation, CI/CD, monitoring — to the special challenges of ML: data drift, model drift, reproducibility, and the gap between a notebook experiment and a serving system.

A mature MLOps stack includes experiment tracking (MLflow, W&B), a model registry, reproducible training pipelines, feature stores, deployment targets (batch, real-time, edge), and monitoring for both system health and prediction quality.

## Why It Matters

Most ML projects never reach production, and many that do degrade silently. MLOps is what separates demos from products. As ML adoption grows, MLOps skills are increasingly sought-after and bridge ML, data engineering, and platform engineering.

## What You Will Learn

- Experiment tracking and reproducible training pipelines.
- Model registries, versioning, and approval workflows.
- Deployment patterns: batch, real-time, streaming, edge.
- Monitoring: data drift, model drift, fairness, latency.
- The full ML lifecycle from notebook to monitored production system.

## Key Takeaways

- MLOps applies DevOps principles to ML systems.
- Reproducibility and monitoring are the central challenges.
- Drift (data and model) is unique to ML and must be tracked.
- MLOps bridges ML, data, and platform engineering.

## Next Steps

In the next tutorial, you will take a notebook experiment, version its data and code, and turn it into a reproducible pipeline that can be re-run and deployed.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "mlops,devops,ml-engineering,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- DATA ENGINEERING ----------------
  {
    slug: "data-engineering",
    name: "Data Engineering",
    tagline: "Building the pipelines that move and shape data.",
    description:
      "Learn data engineering: pipelines, ETL/ELT, batch and streaming, warehouses, lakes, and the infrastructure that delivers clean data to analytics and ML.",
    icon: "Database",
    color: "oklch(0.7 0.13 200)",
    category: "Data",
    order: 63,
    modules: [
      {
        slug: "fundamentals",
        title: "Data Engineering Fundamentals",
        summary: "Ingestion, storage, transformation, and orchestration.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-data-engineering",
            title: "Introduction to Data Engineering",
            summary: "What data engineering is and why it underpins every data product.",
            learningObjectives: [
              "Define data engineering and its role in an organisation.",
              "Distinguish ETL from ELT and batch from streaming.",
              "Identify the main storage types: warehouses, lakes, lakehouses.",
              "Describe the role of orchestration tools like Airflow or Dagster.",
              "Recognise data quality and observability as first-class concerns.",
            ],
            prerequisites: [
              { label: "Basic SQL and Python familiarity." },
            ],
            whereItFits:
              "This is the first tutorial in the Data Engineering Fundamentals module, within the Data Science domain. It underpins data science, analytics, and ML by ensuring the right data is available at the right time.",
            keyTakeaways: [
              "Data engineering builds the pipelines that move and shape data.",
              "Batch and streaming are the two ingestion paradigms.",
              "Data warehouses and lakes serve different analytical needs.",
              "Reliability and observability matter as much as throughput.",
            ],
            selfAssessment: [
              "I can define data engineering and its role.",
              "I can distinguish ETL from ELT.",
              "I can name two storage types used in data engineering.",
              "I can explain why observability matters in pipelines.",
            ],
            content: `# Introduction to Data Engineering

## What Is Data Engineering?

Data engineering is the discipline of building the systems that collect, store, transform, and deliver data across an organization. Where data science asks questions of data, data engineering makes sure the right data exists, is clean, is fresh, and is available at the right place and time.

A typical data engineering stack includes ingestion (Kafka, CDC), storage (data warehouses like Snowflake, lakes like S3), transformation (dbt, Spark, Flink), orchestration (Airflow, Dagster), and serving layers (feature stores, analytics dashboards). Data engineers design pipelines that are reliable, observable, and cost-efficient.

## Why It Matters

No data product — analytics dashboard, ML model, AI agent — works without good data plumbing. Data engineering is the unseen infrastructure that makes modern data-driven organizations possible, and demand for these skills consistently outpaces supply.

## What You Will Learn

- Ingestion: batch, micro-batch, and streaming.
- Storage: warehouses, lakes, lakehouses.
- Transformation: ETL/ELT, dbt, Spark, Flink.
- Orchestration with Airflow or Dagster.
- Data quality, observability, and cost control.

## Key Takeaways

- Data engineering builds the pipelines that move and shape data.
- Batch and streaming are the two ingestion paradigms.
- Data warehouses and lakes serve different analytical needs.
- Reliability and observability matter as much as throughput.

## Next Steps

In the next tutorial, you will build a small batch ETL pipeline — extract from a source, transform, and load into a warehouse — then add scheduling and data quality checks.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "data-engineering,etl,pipelines,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- BIG DATA ----------------
  {
    slug: "big-data",
    name: "Big Data",
    tagline: "Processing data too large for one machine.",
    description:
      "Master big data: distributed storage and compute (Hadoop, Spark, Flink), partitioning, and the patterns for processing terabyte- and petabyte-scale datasets.",
    icon: "Layers",
    color: "oklch(0.65 0.17 150)",
    category: "Data",
    order: 64,
    modules: [
      {
        slug: "fundamentals",
        title: "Big Data Fundamentals",
        summary: "Distributed storage, compute, and the patterns of scale.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-big-data",
            title: "Introduction to Big Data",
            summary: "What big data is, the Vs, and the systems that handle it.",
            learningObjectives: [
              "Define big data and the classic three (or five) Vs.",
              "Explain why a single machine cannot handle big data workloads.",
              "Identify the major big data systems: HDFS, Spark, Flink, Kafka.",
              "Describe partitioning and shuffle as the practical bottlenecks.",
              "Recognise cost as a first-class concern at scale.",
            ],
            prerequisites: [
              { label: "Basic data engineering or ETL familiarity." },
            ],
            whereItFits:
              "This is the first tutorial in the Big Data Fundamentals module, within the Data Science domain. It extends data engineering to the scale where distributed systems become mandatory.",
            keyTakeaways: [
              "Big data is about datasets too large for one machine.",
              "Storage and compute are distributed across clusters.",
              "Spark and Flink dominate batch and stream processing.",
              "Partitioning and skew are the practical bottlenecks.",
            ],
            selfAssessment: [
              "I can define big data and name the three Vs.",
              "I can explain why distributed systems are needed at scale.",
              "I can name two major big data processing engines.",
              "I can describe what partitioning and shuffle mean.",
            ],
            content: `# Introduction to Big Data

## What Is Big Data?

Big data refers to datasets too large, fast, or varied to be processed by a single machine — typically terabytes to petabytes. The classic "three Vs" are volume (size), velocity (rate of arrival), and variety (formats and sources), to which practitioners add veracity (quality) and value.

Big data systems distribute storage and compute across clusters: HDFS and object storage for files, Spark and Flink for compute, Kafka for streaming. The challenge is partitioning work, handling failures, and delivering correct results at scale — all while keeping costs under control.

## Why It Matters

Modern organizations generate data at scales no single server can handle. Big data engineering underpins analytics, ML training, recommendation, fraud detection, and AI products. The skills transfer to ML engineering, platform engineering, and infrastructure.

## What You Will Learn

- The big data landscape: storage, compute, streaming.
- Distributed processing with Spark and Flink.
- Partitioning, shuffle, and skew — and how to manage them.
- Streaming concepts: windows, watermarks, exactly-once.
- Cost and performance tradeoffs at scale.

## Key Takeaways

- Big data is about datasets too large for one machine.
- Storage and compute are distributed across clusters.
- Spark and Flink dominate batch and stream processing.
- Partitioning and skew are the practical bottlenecks.

## Next Steps

In the next tutorial, you will run Spark locally, process a sample dataset, and observe how partitions, shuffles, and stages affect performance.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "big-data,spark,distributed-systems,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- CLOUD COMPUTING ----------------
  {
    slug: "cloud-computing",
    name: "Cloud Computing",
    tagline: "On-demand compute, storage, and services over the network.",
    description:
      "Master cloud computing: IaaS, PaaS, SaaS, the major providers (AWS, Azure, GCP), compute, storage, networking, and the cost and architecture patterns that drive modern software.",
    icon: "Cloud",
    color: "oklch(0.7 0.13 220)",
    category: "Cloud",
    order: 65,
    modules: [
      {
        slug: "fundamentals",
        title: "Cloud Computing Fundamentals",
        summary: "Service models, core primitives, and architecture patterns.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-cloud-computing",
            title: "Introduction to Cloud Computing",
            summary: "What the cloud is, the service models, and why it changed everything.",
            learningObjectives: [
              "Define cloud computing and its core characteristics.",
              "Distinguish IaaS, PaaS, and SaaS with examples.",
              "Identify the major cloud providers and their differentiation.",
              "Describe regions, availability zones, and redundancy.",
              "Recognise cost, security, and vendor lock-in as perennial concerns.",
            ],
            prerequisites: [
              { label: "Basic computer networking and operating system concepts." },
            ],
            whereItFits:
              "This is the first tutorial in the Cloud Computing Fundamentals module, within the Software Engineering domain. It connects to DevOps, distributed systems, and software architecture.",
            keyTakeaways: [
              "The cloud delivers computing as on-demand services.",
              "IaaS, PaaS, and SaaS are different levels of abstraction.",
              "Cost, security, and vendor lock-in are the perennial concerns.",
              "Cloud fluency is a baseline skill for modern engineers.",
            ],
            selfAssessment: [
              "I can define cloud computing in one sentence.",
              "I can distinguish IaaS, PaaS, and SaaS with an example of each.",
              "I can name three major cloud providers.",
              "I can list two perennial concerns when adopting cloud.",
            ],
            content: `# Introduction to Cloud Computing

## What Is Cloud Computing?

Cloud computing is the delivery of computing resources — servers, storage, databases, networking, software — over the internet on a pay-as-you-go basis. Instead of buying hardware, you rent capacity from a provider (AWS, Azure, GCP, Alibaba, Tencent) and consume it as a service.

The three classical service models are IaaS (rent virtual machines and storage), PaaS (deploy code without managing servers — App Engine, Lambda), and SaaS (use a finished application — Gmail, Notion). Modern cloud platforms also offer dozens of managed services for databases, ML, messaging, and observability.

## Why It Matters

The cloud is the default deployment target for modern software. It enables startups to launch without capital expenditure, lets enterprises scale globally, and underpins nearly every consumer app and AI service you use. Cloud fluency is now a baseline expectation for engineers.

## What You Will Learn

- Service models: IaaS, PaaS, SaaS, and serverless.
- Compute, storage, networking, and identity primitives.
- Architecture patterns: regions, availability zones, redundancy.
- Cost management, billing, and FinOps basics.
- Multi-cloud, hybrid cloud, and portability.

## Key Takeaways

- The cloud delivers computing as on-demand services.
- IaaS, PaaS, and SaaS are different levels of abstraction.
- Cost, security, and vendor lock-in are the perennial concerns.
- Cloud fluency is a baseline skill for modern engineers.

## Next Steps

In the next tutorial, you will create a cloud account, launch a virtual machine, expose a service to the internet, and tear it down — paying only for the minutes used.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "cloud,aws,azure,gcp,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- DEVOPS ----------------
  {
    slug: "devops",
    name: "DevOps",
    tagline: "Automating the path from code to production.",
    description:
      "Learn DevOps: CI/CD pipelines, infrastructure as code, containerization, observability, and the culture that ships software safely and often.",
    icon: "Zap",
    color: "oklch(0.75 0.16 85)",
    category: "Cloud",
    order: 66,
    modules: [
      {
        slug: "fundamentals",
        title: "DevOps Fundamentals",
        summary: "CI/CD, containers, IaC, and observability.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-devops",
            title: "Introduction to DevOps",
            summary: "What DevOps is, the culture, and the core toolchain.",
            learningObjectives: [
              "Define DevOps as both culture and toolkit.",
              "Describe the CI/CD pipeline and its stages.",
              "Explain the role of containers and Kubernetes.",
              "Identify infrastructure as code and its benefits.",
              "Recognise observability as the foundation of safe releases.",
            ],
            prerequisites: [
              { label: "Basic familiarity with a version control system like Git." },
            ],
            whereItFits:
              "This is the first tutorial in the DevOps Fundamentals module, within the Software Engineering domain. It bridges software engineering, cloud computing, and operations.",
            keyTakeaways: [
              "DevOps blends culture, automation, and shared ownership.",
              "CI/CD pipelines automate the path from commit to production.",
              "Infrastructure as code makes environments reproducible.",
              "Observability is how you detect and diagnose problems fast.",
            ],
            selfAssessment: [
              "I can define DevOps in one sentence.",
              "I can list the stages of a typical CI/CD pipeline.",
              "I can explain what containers and Kubernetes do.",
              "I can describe the value of infrastructure as code.",
            ],
            content: `# Introduction to DevOps

## What Is DevOps?

DevOps is the practice of integrating development (Dev) and operations (Ops) to ship software faster and more reliably. It is both a culture and a toolkit: automation, shared ownership, fast feedback, and treating infrastructure as code.

A typical DevOps stack includes version control, CI/CD pipelines (GitHub Actions, GitLab CI), container runtimes (Docker), orchestration (Kubernetes), infrastructure as code (Terraform, Pulumi), and observability (Prometheus, Grafana, OpenTelemetry). The goal is small, safe, frequent releases with rapid detection of problems.

## Why It Matters

Manual deployments are slow, error-prone, and stressful. DevOps automation turns release day from an all-hands fire drill into a non-event. The practices scale to large organizations and are now table stakes for any serious engineering team.

## What You Will Learn

- CI/CD pipelines and deployment strategies.
- Containerization with Docker and orchestration with Kubernetes.
- Infrastructure as code with Terraform or Pulumi.
- Observability: metrics, logs, traces.
- The cultural practices behind high-performing teams.

## Key Takeaways

- DevOps blends culture, automation, and shared ownership.
- CI/CD pipelines automate the path from commit to production.
- Infrastructure as code makes environments reproducible.
- Observability is how you detect and diagnose problems fast.

## Next Steps

In the next tutorial, you will write a CI pipeline that runs tests on every commit, builds a container image, and deploys it to a staging environment.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "devops,ci-cd,containers,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- CYBERSECURITY ----------------
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    tagline: "Protecting systems, data, and people from threats.",
    description:
      "Master cybersecurity fundamentals: threats and attackers, cryptography, network and application security, identity, and incident response.",
    icon: "Trophy",
    color: "oklch(0.68 0.2 30)",
    category: "Security",
    order: 67,
    modules: [
      {
        slug: "fundamentals",
        title: "Cybersecurity Fundamentals",
        summary: "Threats, cryptography, application security, and incident response.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-cybersecurity",
            title: "Introduction to Cybersecurity",
            summary: "What cybersecurity is, the threat landscape, and the core principles.",
            learningObjectives: [
              "Define cybersecurity and the CIA triad.",
              "Describe the main categories of attackers and their motives.",
              "Identify the OWASP Top 10 application security risks.",
              "Explain the principle of least privilege and defense in depth.",
              "Recognise security as a shared engineering responsibility.",
            ],
            prerequisites: [
              { label: "Basic familiarity with networks and web applications." },
            ],
            whereItFits:
              "This is the first tutorial in the Cybersecurity Fundamentals module, within the Software Engineering domain. It applies across backend, frontend, cloud, and DevOps work.",
            keyTakeaways: [
              "Security protects confidentiality, integrity, and availability.",
              "Defense in depth and least privilege are foundational principles.",
              "Most breaches involve both technical and human failure.",
              "Every engineer, not just security specialists, must build securely.",
            ],
            selfAssessment: [
              "I can define the CIA triad.",
              "I can list three categories of attackers and their motives.",
              "I can describe the principle of least privilege.",
              "I can name two OWASP Top 10 risks.",
            ],
            content: `# Introduction to Cybersecurity

## What Is Cybersecurity?

Cybersecurity is the practice of protecting systems, networks, data, and people from digital attack. It spans technical controls (encryption, firewalls, access control), procedural controls (patching, training, incident response), and human factors — most breaches still involve some social engineering.

Core concepts include the CIA triad (confidentiality, integrity, availability), the principle of least privilege, defense in depth, and threat modeling. Modern security also covers cloud, supply chain (dependencies), and the emerging risks of AI systems themselves.

## Why It Matters

Every connected system is a target. Breaches cost billions, erode trust, and can shutter companies. Security is no longer a separate team's job — every engineer must build defensively, from input validation to dependency hygiene. It is also a fast-growing career path with severe talent shortages.

## What You Will Learn

- The threat landscape: attackers, motives, common attack types.
- Cryptography basics: symmetric, asymmetric, hashing, TLS.
- Network and application security (OWASP Top 10).
- Identity, access management, and least privilege.
- Incident response and secure SDLC.

## Key Takeaways

- Security protects confidentiality, integrity, and availability.
- Defense in depth and least privilege are foundational principles.
- Most breaches involve both technical and human failure.
- Every engineer, not just security specialists, must build securely.

## Next Steps

In the next tutorial, you will model threats against a small web app, identify its top risks, and apply basic mitigations — input validation, authentication, and transport encryption.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "cybersecurity,security,owasp,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- DISTRIBUTED SYSTEMS ----------------
  {
    slug: "distributed-systems",
    name: "Distributed Systems",
    tagline: "Computers working together across a network.",
    description:
      "Master distributed systems: consistency, availability, partition tolerance, replication, consensus, and the patterns behind databases, queues, and cloud platforms.",
    icon: "Network",
    color: "oklch(0.65 0.15 200)",
    category: "Systems",
    order: 68,
    modules: [
      {
        slug: "fundamentals",
        title: "Distributed Systems Fundamentals",
        summary: "CAP, consistency, replication, and consensus.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-distributed-systems",
            title: "Introduction to Distributed Systems",
            summary: "What distributed systems are and the tradeoffs that define them.",
            learningObjectives: [
              "Define a distributed system and its key properties.",
              "Explain the CAP theorem in plain terms.",
              "Describe replication, partitioning, and consensus.",
              "Identify partial failure as the defining challenge.",
              "Map real-world systems (databases, queues) to distributed patterns.",
            ],
            prerequisites: [
              { label: "Basic networking and operating system concepts." },
            ],
            whereItFits:
              "This is the first tutorial in the Distributed Systems Fundamentals module, within the Software Engineering domain. It underpins cloud platforms, databases, and large-scale backend systems.",
            keyTakeaways: [
              "A distributed system looks like one computer but is many.",
              "Partial failure and network partitions are the defining challenges.",
              "CAP governs the consistency-availability tradeoff.",
              "Consensus protocols are how nodes agree on truth.",
            ],
            selfAssessment: [
              "I can define a distributed system.",
              "I can explain the CAP theorem in my own words.",
              "I can describe what replication and partitioning do.",
              "I can name one consensus protocol.",
            ],
            content: `# Introduction to Distributed Systems

## What Is a Distributed System?

A distributed system is a set of computers that cooperate over a network to appear as a single coherent system to its users. The web, email, every cloud database, every messaging app, and every modern backend is a distributed system.

Distributed systems force you to confront partial failure, network partitions, concurrency, and the tradeoffs of the CAP theorem (consistency, availability, partition tolerance). Core building blocks include replication, partitioning, consensus (Paxos, Raft), clocks and ordering, and exactly-once semantics.

## Why It Matters

Every meaningful modern system is distributed. Understanding the tradeoffs — and the canonical patterns for solving them — is what separates backend engineers from application developers. It also underpins cloud platforms, databases, and AI training infrastructure.

## What You Will Learn

- Core concepts: nodes, networks, failures, time, and ordering.
- The CAP theorem and consistency models.
- Replication, partitioning, and consensus (Raft, Paxos).
- Common patterns: leader-follower, sharding, quorum.
- Real-world examples: databases, queues, file systems.

## Key Takeaways

- A distributed system looks like one computer but is many.
- Partial failure and network partitions are the defining challenges.
- CAP governs the consistency-availability tradeoff.
- Consensus protocols are how nodes agree on truth.

## Next Steps

In the next tutorial, you will run two processes that communicate over a network, observe a simulated partition, and see how a simple leader-follower protocol responds.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "distributed-systems,cap,consensus,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- SOFTWARE ARCHITECTURE ----------------
  {
    slug: "software-architecture",
    name: "Software Architecture",
    tagline: "The high-level structure of software systems.",
    description:
      "Learn software architecture: layered, hexagonal, microservices, event-driven, and the tradeoffs that shape large systems.",
    icon: "Layers",
    color: "oklch(0.7 0.13 200)",
    category: "Systems",
    order: 69,
    modules: [
      {
        slug: "fundamentals",
        title: "Software Architecture Fundamentals",
        summary: "Styles, tradeoffs, and evolutionary architecture.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-software-architecture",
            title: "Introduction to Software Architecture",
            summary: "What software architecture is and why tradeoffs dominate it.",
            learningObjectives: [
              "Define software architecture and its scope.",
              "Compare monolith, layered, hexagonal, and microservices styles.",
              "Describe coupling, cohesion, and bounded contexts.",
              "Explain Conway's Law and its implications.",
              "Recognise architecture as an evolving, contextual discipline.",
            ],
            prerequisites: [
              { label: "Experience building at least one non-trivial application." },
            ],
            whereItFits:
              "This is the first tutorial in the Software Architecture Fundamentals module, within the Software Engineering domain. It builds on backend development, distributed systems, and software engineering practices.",
            keyTakeaways: [
              "Architecture is the high-level structure and tradeoffs of a system.",
              "Monolith vs microservices is a tradeoff, not a moral choice.",
              "Conway's Law ties architecture to organization structure.",
              "Architectures must evolve as systems and teams grow.",
            ],
            selfAssessment: [
              "I can define software architecture in one sentence.",
              "I can compare two architectural styles and their tradeoffs.",
              "I can describe coupling and cohesion.",
              "I can explain Conway's Law.",
            ],
            content: `# Introduction to Software Architecture

## What Is Software Architecture?

Software architecture is the high-level structure of a system — the major components, their responsibilities, and the relationships between them. Where code design deals with classes and functions, architecture deals with services, modules, boundaries, and the tradeoffs that constrain a system for years.

Common architectural styles include monoliths, layered architecture, hexagonal (ports and adapters), microservices, and event-driven systems. Each makes different tradeoffs around complexity, deployability, scalability, and team autonomy. There is no "best" architecture — only architecture suited to a context.

## Why It Matters

Architectural decisions are expensive to reverse. A monolith that grew without structure becomes a "big ball of mud"; an over-eager microservices split creates operational chaos. Good architecture matches the organization, the team structure, and the system's actual constraints — and evolves as those change.

## What You Will Learn

- Major architectural styles and their tradeoffs.
- Coupling, cohesion, and bounded contexts.
- Communication patterns: sync, async, events.
- Architectural fitness functions and evolutionary architecture.
- Documenting architecture (C4 model, ADRs).

## Key Takeaways

- Architecture is the high-level structure and tradeoffs of a system.
- Monolith vs microservices is a tradeoff, not a moral choice.
- Conway's Law ties architecture to organization structure.
- Architectures must evolve as systems and teams grow.

## Next Steps

In the next tutorial, you will take a feature and design it three ways — as a layered monolith, a hexagonal design, and a small service — comparing the tradeoffs of each.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "software-architecture,microservices,monolith,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- DEVSECOPS ----------------
  {
    slug: "devsecops",
    name: "DevSecOps",
    tagline: "Baking security into the software pipeline.",
    description:
      "Learn DevSecOps: shifting security left, SAST/DAST, dependency scanning, secrets management, and secure CI/CD pipelines.",
    icon: "Star",
    color: "oklch(0.65 0.2 25)",
    category: "Security",
    order: 70,
    modules: [
      {
        slug: "fundamentals",
        title: "DevSecOps Fundamentals",
        summary: "Shift-left security, automated scans, and policy as code.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-devsecops",
            title: "Introduction to DevSecOps",
            summary: "What DevSecOps is and how it shifts security into CI/CD.",
            learningObjectives: [
              "Define DevSecOps and the shift-left mindset.",
              "Identify SAST, DAST, SCA, and secret scanning tools.",
              "Describe policy as code with Open Policy Agent.",
              "Explain why supply chain (dependencies) is a major attack surface.",
              "Recognise the shared responsibility model for security.",
            ],
            prerequisites: [
              { label: "Familiarity with CI/CD pipelines." },
              { label: "Basic security concepts (CIA triad)." },
            ],
            whereItFits:
              "This is the first tutorial in the DevSecOps Fundamentals module, within the Software Engineering domain. It bridges DevOps and cybersecurity.",
            keyTakeaways: [
              "DevSecOps bakes security into CI/CD, not after it.",
              "Automated scans find issues early when fixes are cheap.",
              "Supply chain (dependencies) is a major attack surface.",
              "Security is a shared, continuous responsibility.",
            ],
            selfAssessment: [
              "I can define DevSecOps and the shift-left mindset.",
              "I can name three types of automated security scans.",
              "I can describe policy as code in one sentence.",
              "I can explain why dependencies are an attack surface.",
            ],
            content: `# Introduction to DevSecOps

## What Is DevSecOps?

DevSecOps is the practice of integrating security into the DevOps pipeline — "shifting left" so that vulnerabilities are caught at commit time rather than after production. It treats security as a continuous, automated concern shared by the whole team, not a final-stage gate.

A typical DevSecOps stack includes static analysis (SAST), dependency scanning (SCA), secret scanning, container image scanning, infrastructure-as-code policy checks (OPA), dynamic testing (DAST), and runtime protection. Each runs automatically on every change and produces findings that feed back to developers.

## Why It Matters

Late-stage security reviews slow releases and miss bugs. DevSecOps catches problems when they are cheapest to fix, gives developers fast feedback, and produces an auditable trail. As supply-chain attacks and breach costs rise, DevSecOps is becoming mandatory for serious engineering organizations.

## What You Will Learn

- The shift-left mindset and shared responsibility for security.
- SAST, DAST, SCA, and secret scanning tools.
- Container and IaC security scanning.
- Policy as code (Open Policy Agent).
- Handling findings: triage, prioritization, and remediation.

## Key Takeaways

- DevSecOps bakes security into CI/CD, not after it.
- Automated scans find issues early when fixes are cheap.
- Supply chain (dependencies) is a major attack surface.
- Security is a shared, continuous responsibility.

## Next Steps

In the next tutorial, you will add SAST, dependency scanning, and secret scanning to an existing CI pipeline, then triage and remediate the findings.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "devsecops,security,ci-cd,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- TESTING & QUALITY ENGINEERING ----------------
  {
    slug: "testing-and-quality-engineering",
    name: "Testing & Quality Engineering",
    tagline: "Building software that proves it works.",
    description:
      "Master testing and quality engineering: unit, integration, E2E, property-based testing, mutation testing, and the metrics and culture of reliable software.",
    icon: "ClipboardCheck",
    color: "oklch(0.65 0.17 150)",
    category: "Career",
    order: 71,
    modules: [
      {
        slug: "fundamentals",
        title: "Testing & Quality Engineering Fundamentals",
        summary: "The testing pyramid, test doubles, and quality culture.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-testing-and-quality-engineering",
            title: "Introduction to Testing & Quality Engineering",
            summary: "What testing is, the pyramid, and why quality is a culture.",
            learningObjectives: [
              "Define quality engineering and its scope beyond just tests.",
              "Describe the testing pyramid and modern variants.",
              "Distinguish unit, integration, and end-to-end tests.",
              "Identify test doubles: mocks, stubs, fakes, spies.",
              "Recognise mutation testing and coverage as quality signals.",
            ],
            prerequisites: [
              { label: "Experience writing code in at least one language." },
            ],
            whereItFits:
              "This is the first tutorial in the Testing & Quality Engineering Fundamentals module, within the Software Engineering domain. It applies to every other engineering subject — every system needs tests.",
            keyTakeaways: [
              "Quality engineering makes correctness a property of the system.",
              "The pyramid: many unit tests, fewer integration, few E2E.",
              "Test behavior, not implementation, to enable refactoring.",
              "Quality is a culture, not a tool.",
            ],
            selfAssessment: [
              "I can define quality engineering.",
              "I can describe the testing pyramid.",
              "I can distinguish a mock from a stub.",
              "I can explain why testing behavior beats testing implementation.",
            ],
            content: `# Introduction to Testing & Quality Engineering

## What Is Testing & Quality Engineering?

Testing & Quality Engineering is the discipline of systematically verifying that software works as intended — and keeps working as it evolves. It spans automated tests (unit, integration, end-to-end), manual exploratory testing, performance and load testing, and the broader practices that make quality a property of the system, not an afterthought.

The classic testing pyramid has many fast unit tests at the base, fewer integration tests in the middle, and a small number of slow end-to-end tests at the top. Modern variants add contract tests, property-based tests, mutation tests, and observability-based quality signals in production.

## Why It Matters

Untested software decays; tested software can be refactored and shipped with confidence. Quality engineering is what allows teams to move quickly without breaking things — and it is one of the clearest differentiators between high-performing and struggling engineering organizations.

## What You Will Learn

- Test types: unit, integration, E2E, contract, property-based.
- The testing pyramid and modern variants.
- Test doubles: mocks, stubs, fakes, spies.
- Mutation testing and coverage as a quality signal.
- Building a culture of quality, not just a test suite.

## Key Takeaways

- Quality engineering makes correctness a property of the system.
- The pyramid: many unit tests, fewer integration, few E2E.
- Test behavior, not implementation, to enable refactoring.
- Quality is a culture, not a tool.

## Next Steps

In the next tutorial, you will write unit, integration, and an end-to-end test for a small feature, then measure coverage and apply mutation testing to find gaps.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "testing,quality-engineering,unit-tests,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- GIT, GITHUB & DEVELOPER TOOLS ----------------
  {
    slug: "git-github-and-developer-tools",
    name: "Git, GitHub & Developer Tools",
    tagline: "Version control and the modern dev toolkit.",
    description:
      "Master Git, GitHub, and the developer toolchain — branching, merging, pull requests, code review, and the tools that make modern engineering collaboration possible.",
    icon: "GitBranch",
    color: "oklch(0.75 0.16 85)",
    category: "Career",
    order: 72,
    modules: [
      {
        slug: "fundamentals",
        title: "Git, GitHub & Developer Tools Fundamentals",
        summary: "Branches, pull requests, and the daily engineering workflow.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-git-github-and-developer-tools",
            title: "Introduction to Git, GitHub & Developer Tools",
            summary: "What Git and GitHub are and why they dominate engineering.",
            learningObjectives: [
              "Define Git and distinguish it from GitHub.",
              "Describe the commit, branch, and merge model.",
              "Explain pull requests and code review workflows.",
              "Identify the modern developer toolkit: editors, terminals, debuggers.",
              "Recognise AI coding assistants as part of the modern workflow.",
            ],
            prerequisites: [
              { label: "A computer with internet access and a code editor." },
            ],
            whereItFits:
              "This is the first tutorial in the Git, GitHub & Developer Tools Fundamentals module, within the Software Engineering domain. It is a baseline skill needed across every other engineering subject.",
            keyTakeaways: [
              "Git tracks history; GitHub enables collaboration on top of it.",
              "Branches and pull requests structure team collaboration.",
              "Conflicts are inevitable; fluency makes them routine.",
              "Tool mastery is a high-leverage skill investment.",
            ],
            selfAssessment: [
              "I can distinguish Git from GitHub.",
              "I can describe a branch and a merge.",
              "I can explain what a pull request is.",
              "I can name two tools beyond Git in the modern dev toolkit.",
            ],
            content: `# Introduction to Git, GitHub & Developer Tools

## What Are Git, GitHub & Developer Tools?

Git is a distributed version control system that tracks changes to source code over time. GitHub is a hosted platform built on Git that adds pull requests, code review, issues, CI/CD, and a huge ecosystem of integrations. Together they form the backbone of modern software collaboration.

Beyond Git and GitHub, the modern developer toolkit includes terminals, editors (VS Code, Neovim), language servers, debuggers, profilers, container runtimes, and a growing set of AI coding assistants. Fluency in these tools is a multiplier on everything else you do as an engineer.

## Why It Matters

Almost every engineering team on earth uses Git. Knowing branching, merging, rebasing, and conflict resolution is a baseline expectation. Beyond Git, mastering your tools is the difference between fighting your environment and flowing with it — and is one of the highest-leverage investments an early-career engineer can make.

## What You Will Learn

- Git fundamentals: commits, branches, merges, rebases.
- GitHub workflow: pull requests, code review, issues, projects.
- Resolving conflicts and rewriting history safely.
- The modern dev toolkit: editors, terminals, debuggers, profilers.
- AI-powered development: Copilot, code review, agents.

## Key Takeaways

- Git tracks history; GitHub enables collaboration on top of it.
- Branches and pull requests structure team collaboration.
- Conflicts are inevitable; fluency makes them routine.
- Tool mastery is a high-leverage skill investment.

## Next Steps

In the next tutorial, you will initialize a repository, make commits, create a branch, open a pull request, and perform a code review — the daily loop of professional engineering.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "git,github,developer-tools,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- PROGRAMMING LANGUAGE THEORY ----------------
  {
    slug: "programming-language-theory",
    name: "Programming Language Theory",
    tagline: "The science behind programming languages.",
    description:
      "Explore programming language theory: syntax vs semantics, paradigms, type systems, lambda calculus, and how language design shapes how we think.",
    icon: "Braces",
    color: "oklch(0.68 0.16 320)",
    category: "Programming",
    order: 73,
    modules: [
      {
        slug: "fundamentals",
        title: "Programming Language Theory Fundamentals",
        summary: "Syntax, semantics, type systems, and paradigms.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-programming-language-theory",
            title: "Introduction to Programming Language Theory",
            summary: "What PLT is and why language design shapes how programmers think.",
            learningObjectives: [
              "Define programming language theory and its scope.",
              "Distinguish syntax from semantics.",
              "Identify the major paradigms: functional, imperative, logic, OO.",
              "Describe type systems and their tradeoffs.",
              "Explain how language design shapes programmer thinking.",
            ],
            prerequisites: [
              { label: "Familiarity with at least one programming language." },
            ],
            whereItFits:
              "This is the first tutorial in the Programming Language Theory Fundamentals module, within the Computer Science domain. It deepens the understanding of programming and connects to compiler design.",
            keyTakeaways: [
              "PLT is the mathematical study of programming languages.",
              "The lambda calculus underpins functional programming.",
              "Type systems are the central design axis.",
              "Language design shapes how programmers think.",
            ],
            selfAssessment: [
              "I can define PLT in one sentence.",
              "I can distinguish syntax from semantics.",
              "I can name three programming paradigms.",
              "I can describe what a type system does.",
            ],
            content: `# Introduction to Programming Language Theory

## What Is Programming Language Theory?

Programming Language Theory (PLT) is the mathematical study of programming languages — their design, their semantics, and the programs written in them. It asks: what does a program mean? When are two programs equivalent? What can a given language express, and what cannot it?

PLT draws on formal logic, the lambda calculus, type theory, and category theory. It studies syntax (the shape of programs) vs semantics (their meaning), paradigms (functional, imperative, logic, OO), type systems (static, dynamic, gradual, dependent), and program verification.

## Why It Matters

Every language you use embodies theoretical choices: Python is dynamically typed because its designers chose that tradeoff; Haskell's purity comes from a particular mathematical view of programs. Understanding PLT makes you a better programmer — you see tradeoffs, you learn new languages faster, and you can design your own DSLs when needed.

## What You Will Learn

- Syntax vs semantics; operational, denotational, axiomatic.
- The lambda calculus as the foundation of computation.
- Type systems: static, dynamic, gradual, dependent.
- Paradigms: functional, imperative, logic, object-oriented.
- How language design shapes how we think.

## Key Takeaways

- PLT is the mathematical study of programming languages.
- The lambda calculus underpins functional programming.
- Type systems are the central design axis.
- Language design shapes how programmers think.

## Next Steps

In the next tutorial, you will work through the untyped lambda calculus, encode booleans and numbers as functions, and see how computation emerges from nothing but application.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "programming-language-theory,semantics,type-systems,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- COMPILER DESIGN ----------------
  {
    slug: "compiler-design",
    name: "Compiler Design",
    tagline: "How source code becomes executable.",
    description:
      "Master compiler design: lexing, parsing, semantic analysis, optimization, and code generation — and the tools and patterns behind every programming language.",
    icon: "Binary",
    color: "oklch(0.62 0.15 162)",
    category: "Systems",
    order: 74,
    modules: [
      {
        slug: "fundamentals",
        title: "Compiler Design Fundamentals",
        summary: "Lexing, parsing, analysis, optimization, and code generation.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-compiler-design",
            title: "Introduction to Compiler Design",
            summary: "What compilers are, their phases, and why they matter.",
            learningObjectives: [
              "Define a compiler and its role in the software stack.",
              "List the major phases of a compiler in order.",
              "Describe what an abstract syntax tree (AST) is.",
              "Identify the role of intermediate representations.",
              "Recognise how the same ideas power interpreters, transpilers, and DSLs.",
            ],
            prerequisites: [
              { label: "Comfort with at least one programming language." },
              { label: "Basic familiarity with trees as a data structure." },
            ],
            whereItFits:
              "This is the first tutorial in the Compiler Design Fundamentals module, within the Computer Science domain. It builds on programming language theory and data structures.",
            keyTakeaways: [
              "A compiler translates high-level code into executable form.",
              "Phases: lex, parse, analyze, optimize, generate.",
              "ASTs are the central data structure of a compiler.",
              "The same ideas power interpreters, transpilers, and DSLs.",
            ],
            selfAssessment: [
              "I can define what a compiler does.",
              "I can list the major phases of a compiler in order.",
              "I can describe what an AST is.",
              "I can name one tool (LLVM, tree-sitter) used in compiler design.",
            ],
            content: `# Introduction to Compiler Design

## What Is Compiler Design?

Compiler design is the engineering of compilers — programs that translate source code written in a high-level language (C, Rust, TypeScript) into a form a machine can execute (assembly, bytecode, machine code). The same ideas power interpreters, transpilers, query planners, and templating engines.

A classic compiler has phases: lexing (characters to tokens), parsing (tokens to a syntax tree), semantic analysis (type checking), optimization (rewriting for speed), and code generation (emitting target code). Each phase has well-understood algorithms and tools (lex, yacc, LLVM, tree-sitter).

## Why It Matters

Compilers are the bridge between human-readable code and machine execution. Understanding them demystifies what happens when you click "run," improves your ability to debug performance, and is the foundation for building DSLs, linters, code formatters, and even SQL engines. It is also one of the most intellectually rewarding areas of computer science.

## What You Will Learn

- The compilation pipeline end to end.
- Lexing and parsing (recursive descent, parsers, ASTs).
- Type systems and semantic analysis.
- Intermediate representations and optimization.
- Code generation and the LLVM toolchain.

## Key Takeaways

- A compiler translates high-level code into executable form.
- Phases: lex, parse, analyze, optimize, generate.
- ASTs are the central data structure of a compiler.
- The same ideas power interpreters, transpilers, and DSLs.

## Next Steps

In the next tutorial, you will build a lexer and parser for a tiny arithmetic language, producing an AST that you will later type-check and evaluate.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "compiler-design,lexing,parsing,ast,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- PARALLEL & HIGH-PERFORMANCE COMPUTING ----------------
  {
    slug: "parallel-and-high-performance-computing",
    name: "Parallel & High-Performance Computing",
    tagline: "Using many cores and many machines to go fast.",
    description:
      "Master parallel and high-performance computing: threads, processes, SIMD, GPUs, distributed compute, and the techniques for making numerical and ML workloads fast.",
    icon: "Zap",
    color: "oklch(0.65 0.2 25)",
    category: "Systems",
    order: 75,
    modules: [
      {
        slug: "fundamentals",
        title: "Parallel & High-Performance Computing Fundamentals",
        summary: "Parallelism paradigms, memory hierarchy, and GPU computing.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-parallel-and-high-performance-computing",
            title: "Introduction to Parallel & High-Performance Computing",
            summary: "What HPC is, the parallelism paradigms, and why it powers modern AI.",
            learningObjectives: [
              "Define parallel and high-performance computing.",
              "Distinguish task, data, pipeline, and model parallelism.",
              "Describe the memory hierarchy and its impact on performance.",
              "Identify GPU programming as central to modern ML.",
              "Recognise the role of profiling in HPC work.",
            ],
            prerequisites: [
              { label: "Comfort with a systems language (C/C++ or Rust)." },
              { label: "Basic understanding of computer architecture." },
            ],
            whereItFits:
              "This is the first tutorial in the Parallel & High-Performance Computing Fundamentals module, within the Computer Science domain. It connects to computer architecture, ML training, and distributed systems.",
            keyTakeaways: [
              "HPC uses many resources to solve problems faster.",
              "Data parallelism and task parallelism are the two main flavors.",
              "Memory hierarchy and communication dominate performance.",
              "GPU programming powers modern AI training.",
            ],
            selfAssessment: [
              "I can define HPC.",
              "I can distinguish task parallelism from data parallelism.",
              "I can describe why the memory hierarchy matters for performance.",
              "I can explain why GPUs are used for ML training.",
            ],
            content: `# Introduction to Parallel & High-Performance Computing

## What Is Parallel & High-Performance Computing?

Parallel & High-Performance Computing (HPC) is the discipline of using many compute resources — multiple CPU cores, SIMD units, GPUs, or whole clusters — to solve problems faster than a single machine could. It is what makes weather forecasts, drug discovery, scientific simulations, and modern AI training possible.

Parallelism comes in several flavors: task parallelism (different operations at once), data parallelism (same operation on different data), pipeline parallelism (stages of a computation overlapped), and model parallelism (splitting one model across devices). Each comes with challenges around coordination, memory, and communication.

## Why It Matters

Single-core performance plateaued years ago; future speed-ups come from parallelism. AI training in particular is now bounded by how well you can parallelize across thousands of GPUs. HPC skills transfer directly to ML engineering, scientific computing, and performance engineering.

## What You Will Learn

- Parallelism paradigms: threads, SIMD, GPU, distributed.
- Concurrency primitives and the cost of coordination.
- Memory hierarchies and how to use them.
- GPU programming fundamentals (CUDA concepts).
- Performance measurement and profiling.

## Key Takeaways

- HPC uses many resources to solve problems faster.
- Data parallelism and task parallelism are the two main flavors.
- Memory hierarchy and communication dominate performance.
- GPU programming powers modern AI training.

## Next Steps

In the next tutorial, you will parallelize a numerical workload across CPU cores, then port a small kernel to the GPU and compare performance.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "hpc,parallel,gpu,performance,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- EMBEDDED SYSTEMS & IOT ----------------
  {
    slug: "embedded-systems-and-iot",
    name: "Embedded Systems & IoT",
    tagline: "Software for the physical world.",
    description:
      "Master embedded systems and IoT: microcontrollers, real-time constraints, sensors, actuators, communication protocols, and the unique challenges of software that touches hardware.",
    icon: "Cpu",
    color: "oklch(0.7 0.13 200)",
    category: "Systems",
    order: 76,
    modules: [
      {
        slug: "fundamentals",
        title: "Embedded Systems & IoT Fundamentals",
        summary: "Microcontrollers, RTOS, sensors, and protocols.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-embedded-systems-and-iot",
            title: "Introduction to Embedded Systems & IoT",
            summary: "What embedded systems are, the constraints, and where IoT fits.",
            learningObjectives: [
              "Define an embedded system and identify examples.",
              "Describe the constraints: CPU, memory, power, real-time deadlines.",
              "Distinguish bare-metal, RTOS, and embedded Linux development.",
              "Identify common communication protocols: I2C, SPI, UART, CAN.",
              "Recognise the security concerns unique to IoT devices.",
            ],
            prerequisites: [
              { label: "Basic C programming familiarity." },
            ],
            whereItFits:
              "This is the first tutorial in the Embedded Systems & IoT Fundamentals module, within the Computer Science domain. It connects computer architecture, networking, and cybersecurity.",
            keyTakeaways: [
              "Embedded systems are purpose-built computers inside other devices.",
              "Constraints (CPU, memory, power, time) dominate every decision.",
              "C and C++ remain the dominant languages.",
              "IoT extends embedded devices with network connectivity.",
            ],
            selfAssessment: [
              "I can define an embedded system.",
              "I can list three constraints that shape embedded design.",
              "I can name two embedded communication protocols.",
              "I can describe one security concern unique to IoT devices.",
            ],
            content: `# Introduction to Embedded Systems & IoT

## What Are Embedded Systems & IoT?

Embedded systems are computers built into other devices — washing machines, cars, pacemakers, satellites — designed for a specific purpose rather than general computation. The Internet of Things (IoT) extends embedded systems with network connectivity, letting devices exchange data and be remotely controlled.

Embedded software operates under tight constraints: limited CPU, memory, and power; real-time deadlines; direct interaction with sensors and actuators; and often no operating system at all (bare-metal) or a small real-time OS (RTOS). Programming is typically in C or C++, often alongside hardware description languages for the FPGA or ASIC.

## Why It Matters

There are tens of billions of embedded devices worldwide — far more than phones and laptops. They run cars, factories, medical devices, and the entire Internet of Things. Embedded skills are in demand across automotive, robotics, energy, consumer electronics, and defense — and they connect deeply to AI (edge inference) and cybersecurity.

## What You Will Learn

- Microcontroller architecture and bare-metal programming.
- Real-time constraints and scheduling.
- Sensors, actuators, and signal conditioning.
- Communication protocols: I2C, SPI, UART, CAN, MQTT.
- Power management and IoT security.

## Key Takeaways

- Embedded systems are purpose-built computers inside other devices.
- Constraints (CPU, memory, power, time) dominate every decision.
- C and C++ remain the dominant languages.
- IoT extends embedded devices with network connectivity.

## Next Steps

In the next tutorial, you will write a program for a microcontroller that blinks an LED, reads a sensor, and prints the value — the canonical "Hello World" of embedded systems.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "embedded,iot,microcontroller,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- BLOCKCHAIN & WEB3 ----------------
  {
    slug: "blockchain-and-web3",
    name: "Blockchain & Web3",
    tagline: "Distributed ledgers, smart contracts, and decentralized apps.",
    description:
      "Learn blockchain and Web3: cryptography, distributed consensus, smart contracts, wallets, and the patterns and tradeoffs of building decentralized applications.",
    icon: "Network",
    color: "oklch(0.68 0.16 320)",
    category: "Systems",
    order: 77,
    modules: [
      {
        slug: "fundamentals",
        title: "Blockchain & Web3 Fundamentals",
        summary: "Cryptography, consensus, smart contracts, and security.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-blockchain-and-web3",
            title: "Introduction to Blockchain & Web3",
            summary: "What blockchains are, how smart contracts work, and the tradeoffs.",
            learningObjectives: [
              "Define a blockchain and its core properties.",
              "Explain hashing, public-key cryptography, and Merkle trees.",
              "Compare Proof of Work and Proof of Stake consensus.",
              "Describe what a smart contract is and where it runs.",
              "Recognise security as the central engineering challenge.",
            ],
            prerequisites: [
              { label: "Basic programming familiarity." },
              { label: "Conceptual understanding of cryptographic hashes." },
            ],
            whereItFits:
              "This is the first tutorial in the Blockchain & Web3 Fundamentals module, within the Software Engineering domain. It connects to distributed systems and cybersecurity.",
            keyTakeaways: [
              "A blockchain is a distributed, append-only, tamper-evident ledger.",
              "Smart contracts are programs that run on a blockchain.",
              "Consensus protocols (PoW, PoS) keep nodes in agreement.",
              "Security is the central engineering challenge.",
            ],
            selfAssessment: [
              "I can define a blockchain in one sentence.",
              "I can describe what hashing does for a blockchain.",
              "I can distinguish Proof of Work from Proof of Stake.",
              "I can explain what a smart contract is.",
            ],
            content: `# Introduction to Blockchain & Web3

## What Is Blockchain & Web3?

A blockchain is a distributed, append-only ledger replicated across many nodes, where each block cryptographically links to the previous one. The result is a tamper-evident record that no single party controls. Blockchains power cryptocurrencies (Bitcoin), programmable smart contract platforms (Ethereum), and a broader ecosystem of decentralized applications.

Web3 refers to applications built on top of blockchains — typically involving wallets, tokens, smart contracts, and decentralized storage or identity. Smart contracts are programs that run on the blockchain, enabling trust-minimized financial primitives, NFTs, DAOs, and verifiable computation.

## Why It Matters

Whether or not cryptocurrency speculation interests you, the underlying technology — distributed consensus, cryptographic commitments, programmable trust — is significant. Blockchains have real applications in payments, supply chain, identity, and gaming, and the engineering challenges (scalability, security, UX) are deep.

## What You Will Learn

- Hashing, public-key cryptography, and Merkle trees.
- Distributed consensus: Proof of Work, Proof of Stake.
- Smart contracts (Solidity) and the EVM.
- Wallets, transactions, and gas.
- Security: reentrancy, frontrunning, audits.

## Key Takeaways

- A blockchain is a distributed, append-only, tamper-evident ledger.
- Smart contracts are programs that run on a blockchain.
- Consensus protocols (PoW, PoS) keep nodes in agreement.
- Security is the central engineering challenge.

## Next Steps

In the next tutorial, you will set up a local blockchain, deploy a simple smart contract, and call it from a small front-end wallet.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "blockchain,web3,smart-contracts,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- UI/UX & PRODUCT ENGINEERING ----------------
  {
    slug: "ui-ux-and-product-engineering",
    name: "UI/UX & Product Engineering",
    tagline: "Designing products people love to use.",
    description:
      "Master UI/UX and product engineering: design principles, user research, prototyping, design systems, and the engineering craft of building products that delight.",
    icon: "Star",
    color: "oklch(0.75 0.16 85)",
    category: "Career",
    order: 78,
    modules: [
      {
        slug: "fundamentals",
        title: "UI/UX & Product Engineering Fundamentals",
        summary: "Design principles, research, and design systems.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-ui-ux-and-product-engineering",
            title: "Introduction to UI/UX & Product Engineering",
            summary: "What UI/UX is, what product engineers do, and why design matters.",
            learningObjectives: [
              "Distinguish UI from UX and describe how they relate.",
              "Identify core design principles: hierarchy, contrast, rhythm, whitespace.",
              "Describe the role of user research and usability testing.",
              "Explain what a design system is and why teams use one.",
              "Recognise the product engineer's blend of frontend and design skills.",
            ],
            prerequisites: [
              { label: "Basic familiarity with HTML and CSS." },
            ],
            whereItFits:
              "This is the first tutorial in the UI/UX & Product Engineering Fundamentals module, within the Software Engineering domain. It complements frontend development with design literacy.",
            keyTakeaways: [
              "UI is the surface; UX is the underlying experience design.",
              "Product engineering blends frontend craft with design literacy.",
              "Design systems keep products consistent at scale.",
              "Great products are built by teams that care about users.",
            ],
            selfAssessment: [
              "I can distinguish UI from UX.",
              "I can name three core design principles.",
              "I can describe what user research adds to a project.",
              "I can explain what a design system is.",
            ],
            content: `# Introduction to UI/UX & Product Engineering

## What Is UI/UX & Product Engineering?

UI (User Interface) and UX (User Experience) design shape how a product looks, feels, and works for the people who use it. UI is the visible surface — layout, color, typography, motion. UX is the deeper research and design — what users need, how they think, how a product fits their lives. Product engineering is the practice of building software with these concerns baked in.

A modern product engineer blends frontend engineering with design literacy: they use Figma, ship to a design system, run usability tests, instrument analytics, and care about polish. The goal is not just working software but software people choose to use.

## Why It Matters

Beautiful, usable products beat technically superior but clunky ones. Companies that win — Apple, Linear, Stripe — invest heavily in design and product engineering. These skills compound: a designer-engineer is rare and disproportionately impactful in any team.

## What You Will Learn

- Design principles: hierarchy, contrast, rhythm, whitespace.
- User research: interviews, usability tests, analytics.
- Design systems: tokens, components, documentation.
- Prototyping and iteration with Figma and code.
- The product engineer's role and workflow.

## Key Takeaways

- UI is the surface; UX is the underlying experience design.
- Product engineering blends frontend craft with design literacy.
- Design systems keep products consistent at scale.
- Great products are built by teams that care about users.

## Next Steps

In the next tutorial, you will audit a small interface for usability issues, sketch a redesign, and prototype it in code using a basic design system.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "ui-ux,design,product-engineering,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },

  // ---------------- PROJECTS & PRACTICAL ENGINEERING ----------------
  {
    slug: "projects-and-practical-engineering",
    name: "Projects & Practical Engineering",
    tagline: "Build real systems end to end.",
    description:
      "Apply everything you have learned: scope, design, build, ship, and operate complete software projects — the capstone of practical engineering.",
    icon: "Rocket",
    color: "oklch(0.65 0.2 305)",
    category: "Career",
    order: 79,
    modules: [
      {
        slug: "fundamentals",
        title: "Projects & Practical Engineering Fundamentals",
        summary: "Scoping, building, shipping, and operating real projects.",
        order: 1,
        difficulty: "beginner",
        estimatedMinutes: 60,
        tutorials: [
          {
            slug: "introduction-to-projects-and-practical-engineering",
            title: "Introduction to Projects & Practical Engineering",
            summary: "Why shipping real projects is the capstone of engineering mastery.",
            learningObjectives: [
              "Describe the lifecycle of a real software project.",
              "Explain how to scope and decompose a project into shippable increments.",
              "Identify the tradeoffs every project makes: scope, time, quality, cost.",
              "Recognise the operational responsibilities of shipped software.",
              "Articulate why a portfolio of projects is the strongest capability signal.",
            ],
            prerequisites: [
              { label: "Comfort building at least one small application end to end." },
            ],
            whereItFits:
              "This is the first tutorial in the Projects & Practical Engineering Fundamentals module, within the Software Engineering domain. It is the capstone that draws on every other subject.",
            keyTakeaways: [
              "Real projects are where everything you learned comes together.",
              "Shipping teaches what tutorials cannot.",
              "Tradeoffs under constraint are the heart of engineering.",
              "A portfolio of projects is the strongest capability signal.",
            ],
            selfAssessment: [
              "I can describe the lifecycle of a real software project.",
              "I can list the four classic project tradeoffs.",
              "I can explain why shipping teaches what tutorials cannot.",
              "I can articulate why a portfolio matters more than certificates.",
            ],
            content: `# Introduction to Projects & Practical Engineering

## What Is Projects & Practical Engineering?

Projects & Practical Engineering is the discipline of taking an idea from zero to a working, deployed, maintained product. It is where every other subject — programming, architecture, databases, DevOps, security, UI/UX — comes together in real systems with real users, real constraints, and real consequences.

Building real projects teaches what tutorials cannot: how to scope, how to make tradeoffs under deadline, how to read other people's code, how to debug production at 2am, how to ship a feature that is "good enough," and how to keep a system running for years. It is the capstone of engineering mastery.

## Why It Matters

Employers and customers care about shipped software, not tutorial completion. A portfolio of well-built projects is the strongest signal of engineering capability — stronger than any certificate. The skills you build shipping real things are also the most durable: they transfer across languages, stacks, and decades.

## What You Will Learn

- Scoping and decomposing projects into shippable increments.
- Reading, extending, and debugging code you did not write.
- Making tradeoffs: scope, time, quality, cost.
- Shipping and operating: deploys, monitoring, on-call.
- Building a portfolio that demonstrates real capability.

## Key Takeaways

- Real projects are where everything you learned comes together.
- Shipping teaches what tutorials cannot.
- Tradeoffs under constraint are the heart of engineering.
- A portfolio of projects is the strongest capability signal.

## Next Steps

In the next tutorial, you will choose a project, write a one-page spec, break it into milestones, and ship the first one — beginning your capstone project.`,
            difficulty: "beginner",
            estimatedMinutes: 15,
            tags: "projects,practical-engineering,portfolio,beginner,introduction",
            order: 1,
          },
        ],
      },
    ],
  },
]

// ============================================================
// ACHIEVEMENTS
// ============================================================

const achievements = [
  { slug: "first-steps", title: "First Steps", description: "Complete your first tutorial.", icon: "Footprints", color: "oklch(0.62 0.15 162)", category: "learning", xpReward: 50, threshold: 1, metric: "tutorials_completed" },
  { slug: "quick-learner", title: "Quick Learner", description: "Complete 5 tutorials.", icon: "Zap", color: "oklch(0.75 0.16 85)", category: "learning", xpReward: 100, threshold: 5, metric: "tutorials_completed" },
  { slug: "dedicated-scholar", title: "Dedicated Scholar", description: "Complete 10 tutorials.", icon: "BookOpen", color: "oklch(0.7 0.13 200)", category: "learning", xpReward: 200, threshold: 10, metric: "tutorials_completed" },
  { slug: "knowledge-seeker", title: "Knowledge Seeker", description: "Complete 25 tutorials.", icon: "GraduationCap", color: "oklch(0.68 0.2 305)", category: "learning", xpReward: 500, threshold: 25, metric: "tutorials_completed" },
  { slug: "quiz-novice", title: "Quiz Novice", description: "Pass your first quiz.", icon: "ClipboardCheck", color: "oklch(0.62 0.15 162)", category: "skill", xpReward: 50, threshold: 1, metric: "quizzes_passed" },
  { slug: "quiz-master", title: "Quiz Master", description: "Pass 10 quizzes.", icon: "Award", color: "oklch(0.75 0.16 85)", category: "skill", xpReward: 200, threshold: 10, metric: "quizzes_passed" },
  { slug: "quiz-champion", title: "Quiz Champion", description: "Pass 25 quizzes.", icon: "Trophy", color: "oklch(0.68 0.2 30)", category: "skill", xpReward: 500, threshold: 25, metric: "quizzes_passed" },
  { slug: "on-fire", title: "On Fire", description: "Maintain a 3-day streak.", icon: "Flame", color: "oklch(0.68 0.2 30)", category: "streak", xpReward: 75, threshold: 3, metric: "streak_days" },
  { slug: "week-warrior", title: "Week Warrior", description: "7-day streak.", icon: "Calendar", color: "oklch(0.75 0.16 85)", category: "streak", xpReward: 150, threshold: 7, metric: "streak_days" },
  { slug: "fortnight", title: "Fortnight", description: "14-day streak.", icon: "CalendarDays", color: "oklch(0.7 0.13 200)", category: "streak", xpReward: 300, threshold: 14, metric: "streak_days" },
  { slug: "unstoppable", title: "Unstoppable", description: "30-day streak.", icon: "Rocket", color: "oklch(0.68 0.2 305)", category: "streak", xpReward: 750, threshold: 30, metric: "streak_days" },
  { slug: "rising-star", title: "Rising Star", description: "Earn 1,000 XP.", icon: "Star", color: "oklch(0.75 0.16 85)", category: "milestone", xpReward: 100, threshold: 1000, metric: "xp" },
  { slug: "xp-hunter", title: "XP Hunter", description: "Earn 5,000 XP.", icon: "Target", color: "oklch(0.62 0.15 162)", category: "milestone", xpReward: 250, threshold: 5000, metric: "xp" },
  { slug: "grandmaster", title: "Grandmaster", description: "Earn 25,000 XP.", icon: "Crown", color: "oklch(0.68 0.2 305)", category: "milestone", xpReward: 1000, threshold: 25000, metric: "xp" },
  { slug: "note-taker", title: "Note Taker", description: "Create 5 notes.", icon: "StickyNote", color: "oklch(0.7 0.13 200)", category: "learning", xpReward: 50, threshold: 5, metric: "notes_created" },
  { slug: "path-pioneer", title: "Path Pioneer", description: "Enroll in a learning path.", icon: "Route", color: "oklch(0.65 0.2 305)", category: "milestone", xpReward: 100, threshold: 1, metric: "paths_enrolled" },
]

// ============================================================
// LEARNING PATHS
// ============================================================

const paths = [
  {
    slug: "beginner-to-programmer",
    title: "Beginner to Programmer",
    tagline: "Go from zero to writing real code.",
    description: "Start with Python fundamentals, then learn data structures to think like a programmer.",
    icon: "Route",
    color: "oklch(0.62 0.15 162)",
    difficulty: "beginner",
    estimatedHours: 30,
    published: true,
    steps: [
      { subjectSlug: "python", title: "Python Fundamentals", subtitle: "Syntax, types, control flow, functions", order: 0 },
      { subjectSlug: "data-structures", title: "Data Structures Essentials", subtitle: "Arrays, lists, stacks, trees", order: 1 },
      { subjectSlug: "algorithms", title: "Algorithm Thinking", subtitle: "Complexity, sorting, searching", order: 2 },
    ],
  },
  {
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer Track",
    tagline: "Build intelligent systems.",
    description: "From Python to deep learning to LLMs — the full path to becoming an ML engineer.",
    icon: "Brain",
    color: "oklch(0.65 0.2 305)",
    difficulty: "advanced",
    estimatedHours: 120,
    published: true,
    steps: [
      { subjectSlug: "python", title: "Python Mastery", subtitle: "Functions, data structures", order: 0 },
      { subjectSlug: "machine-learning", title: "Machine Learning", subtitle: "Regression, classification, evaluation", order: 1 },
      { subjectSlug: "deep-learning", title: "Deep Learning", subtitle: "Neural networks, training", order: 2 },
      { subjectSlug: "llms", title: "LLMs & RAG", subtitle: "Prompting, retrieval, applications", order: 3 },
    ],
  },
  {
    slug: "interview-ready",
    title: "Interview Ready Engineer",
    tagline: "Crack the coding & system design interview.",
    description: "Master DSA patterns and system design to land offers at top tech companies.",
    icon: "Trophy",
    color: "oklch(0.75 0.16 85)",
    difficulty: "intermediate",
    estimatedHours: 80,
    published: true,
    steps: [
      { subjectSlug: "data-structures", title: "DSA Foundations", subtitle: "Arrays, lists, trees, graphs", order: 0 },
      { subjectSlug: "algorithms", title: "Algorithms", subtitle: "Complexity, sorting, DP", order: 1 },
      { subjectSlug: "system-design", title: "System Design", subtitle: "Scaling, caching, sharding", order: 2 },
      { subjectSlug: "interview-prep", title: "Interview Patterns", subtitle: "The 15 patterns + strategy", order: 3 },
    ],
  },
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    tagline: "Build complete web apps.",
    description: "Master HTML/CSS, JavaScript, and backend systems to ship full web applications.",
    icon: "Globe",
    color: "oklch(0.8 0.16 75)",
    difficulty: "intermediate",
    estimatedHours: 90,
    published: true,
    steps: [
      { subjectSlug: "web-development", title: "Web Fundamentals", subtitle: "HTML, CSS, layout", order: 0 },
      { subjectSlug: "javascript", title: "JavaScript", subtitle: "Functions, async, DOM", order: 1 },
      { subjectSlug: "typescript", title: "TypeScript", subtitle: "Static types for safer code", order: 2 },
      { subjectSlug: "dbms", title: "Databases", subtitle: "Normalization, indexing, transactions", order: 3 },
    ],
  },
  {
    slug: "systems-engineer",
    title: "Systems Engineer",
    tagline: "Understand the machine, end to end.",
    description: "Operating systems, networks, and architecture — the foundation of all software.",
    icon: "Cpu",
    color: "oklch(0.72 0.16 162)",
    difficulty: "advanced",
    estimatedHours: 100,
    published: true,
    steps: [
      { subjectSlug: "computer-architecture", title: "Computer Architecture", subtitle: "Memory hierarchy, CPU", order: 0 },
      { subjectSlug: "operating-systems", title: "Operating Systems", subtitle: "Processes, memory, scheduling", order: 1 },
      { subjectSlug: "computer-networks", title: "Computer Networks", subtitle: "OSI, TCP/IP, HTTP", order: 2 },
      { subjectSlug: "dbms", title: "Database Systems", subtitle: "Design, transactions, indexing", order: 3 },
    ],
  },
]

// ============================================================
// SEED EXECUTION
// ============================================================

async function main() {
  console.log("🌱 Seeding CodeMastery content...")

  // --- Domains (top of hierarchy) ---
  const domainMap: Record<string, string> = {}
  for (const d of domains) {
    const dom = await db.domain.upsert({
      where: { slug: d.slug },
      create: {
        slug: d.slug, name: d.name, tagline: d.tagline, description: d.description,
        icon: d.icon, color: d.color, order: d.order, published: true,
      },
      update: {
        name: d.name, tagline: d.tagline, description: d.description,
        icon: d.icon, color: d.color, order: d.order,
      },
    })
    domainMap[d.slug] = dom.id
  }
  console.log(`  ✓ ${domains.length} domains`)

  // Subjects + modules + tutorials + quizzes
  for (const s of subjects) {
    const domainId = subjectDomain[s.slug] ? domainMap[subjectDomain[s.slug]] : null
    const subject = await db.subject.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug, name: s.name, tagline: s.tagline, description: s.description,
        icon: s.icon, color: s.color, category: s.category, order: s.order, published: true,
        domainId,
      },
      update: {
        name: s.name, tagline: s.tagline, description: s.description,
        icon: s.icon, color: s.color, category: s.category, order: s.order,
        domainId,
      },
    })
    console.log(`  ✓ Subject: ${subject.name}`)

    for (const m of s.modules) {
      const moduleRec = await db.module.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: m.slug } },
        create: {
          subjectId: subject.id, slug: m.slug, title: m.title, summary: m.summary,
          order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes,
        },
        update: { title: m.title, summary: m.summary, order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes },
      })

      for (const t of m.tutorials) {
        const tut = await db.tutorial.upsert({
          where: { subjectId_slug: { subjectId: subject.id, slug: t.slug } },
          create: {
            subjectId: subject.id, moduleId: moduleRec.id, slug: t.slug, title: t.title, summary: t.summary,
            content: t.content, difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes,
            tags: t.tags, order: t.order, published: true,
            learningObjectives: t.learningObjectives ? JSON.stringify(t.learningObjectives) : "",
            prerequisites: t.prerequisites ? JSON.stringify(t.prerequisites) : "",
            whereItFits: t.whereItFits ?? "",
            keyTakeaways: t.keyTakeaways ? JSON.stringify(t.keyTakeaways) : "",
            selfAssessment: t.selfAssessment ? JSON.stringify(t.selfAssessment) : "",
          },
          update: {
            title: t.title, summary: t.summary, content: t.content, difficulty: t.difficulty,
            estimatedMinutes: t.estimatedMinutes, tags: t.tags, order: t.order, moduleId: moduleRec.id,
            learningObjectives: t.learningObjectives ? JSON.stringify(t.learningObjectives) : "",
            prerequisites: t.prerequisites ? JSON.stringify(t.prerequisites) : "",
            whereItFits: t.whereItFits ?? "",
            keyTakeaways: t.keyTakeaways ? JSON.stringify(t.keyTakeaways) : "",
            selfAssessment: t.selfAssessment ? JSON.stringify(t.selfAssessment) : "",
          },
        })
        // Idempotency: wipe existing quizzes for this tutorial before
        // re-creating them. Without this, every re-seed duplicates quizzes
        // (quiz + question rows have no natural unique key per tutorial).
        if (t.quizzes && t.quizzes.length > 0) {
          await db.quiz.deleteMany({ where: { tutorialId: tut.id } })
        }
        for (const q of t.quizzes ?? []) {
          const quiz = await db.quiz.create({
            data: {
              tutorialId: tut.id, title: q.title, description: q.description,
              passingScore: q.passingScore, xpReward: q.xpReward,
            },
          })
          for (const qq of q.questions) {
            await db.quizQuestion.create({
              data: {
                quizId: quiz.id, prompt: qq.prompt, options: JSON.stringify(qq.options),
                answerIndex: qq.answerIndex, explanation: qq.explanation ?? null, order: qq.order,
              },
            })
          }
        }
      }
    }
  }

  // Achievements
  for (const a of achievements) {
    await db.achievement.upsert({
      where: { slug: a.slug },
      create: a,
      update: a,
    })
  }
  console.log(`  ✓ ${achievements.length} achievements`)

  // Learning paths
  for (const p of paths) {
    const path = await db.learningPath.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug, title: p.title, tagline: p.tagline, description: p.description,
        icon: p.icon, color: p.color, difficulty: p.difficulty,
        estimatedHours: p.estimatedHours, published: p.published,
      },
      update: {
        title: p.title, tagline: p.tagline, description: p.description,
        icon: p.icon, color: p.color, difficulty: p.difficulty, estimatedHours: p.estimatedHours,
      },
    })
    // Recreate steps (delete existing first for idempotency)
    await db.learningPathStep.deleteMany({ where: { pathId: path.id } })
    for (const st of p.steps) {
      const subject = await db.subject.findUnique({ where: { slug: st.subjectSlug } })
      await db.learningPathStep.create({
        data: {
          pathId: path.id, subjectId: subject?.id ?? null, tutorialId: null,
          title: st.title, subtitle: st.subtitle ?? null, order: st.order,
        },
      })
    }
  }
  console.log(`  ✓ ${paths.length} learning paths`)

  // Bootstrap an admin user ONLY when SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD are provided.
  // Never print or hardcode the password — set SEED_ADMIN_PASSWORD locally via env.
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  if (adminEmail) {
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } })
    if (!existingAdmin) {
      const adminPassword = process.env.SEED_ADMIN_PASSWORD
      if (!adminPassword) {
        console.warn(`  ! SEED_ADMIN_EMAIL is set but SEED_ADMIN_PASSWORD is missing — skipping admin bootstrap.`)
      } else {
        const { scryptSync, randomBytes } = await import("crypto")
        const salt = randomBytes(16).toString("hex")
        const hash = scryptSync(adminPassword, salt, 64).toString("hex")
        await db.user.create({
          data: {
            email: adminEmail, name: "Admin", username: "admin",
            passwordHash: `scrypt:${salt}:${hash}`, role: "ADMIN", onboarded: true,
          },
        })
        console.log(`  ✓ Admin user created (email: ${adminEmail}) — password withheld`)
      }
    }
  } else {
    console.log("  - No SEED_ADMIN_EMAIL set; skipping admin bootstrap.")
  }

  const counts = {
    subjects: await db.subject.count(),
    modules: await db.module.count(),
    tutorials: await db.tutorial.count(),
    quizzes: await db.quiz.count(),
    questions: await db.quizQuestion.count(),
    achievements: await db.achievement.count(),
    paths: await db.learningPath.count(),
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
