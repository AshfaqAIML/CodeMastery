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
}

// ============================================================
// SUBJECTS + MODULES + TUTORIALS
// ============================================================

const subjects: SubjectInput[] = [
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

  // Create an admin user if none exists
  const adminEmail = "admin@codemastery.dev"
  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const { scryptSync, randomBytes } = await import("crypto")
    const salt = randomBytes(16).toString("hex")
    const hash = scryptSync("admin12345", salt, 64).toString("hex")
    await db.user.create({
      data: {
        email: adminEmail, name: "Admin", username: "admin",
        passwordHash: `scrypt:${salt}:${hash}`, role: "ADMIN", onboarded: true,
      },
    })
    console.log(`  ✓ Admin user created (email: ${adminEmail}, password: admin12345)`)
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
