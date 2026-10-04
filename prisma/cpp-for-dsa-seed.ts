import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

// ============================================================
// CPP For DSA - imported by scripts/import-course/book.py
// Source: CPP For DSA.docx (Chapters 1-5; Chapters 6-20 to be appended later)
// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.
// ============================================================

const subject = {
  slug: "cpp-for-dsa",
  name: "CPP For DSA",
  tagline: "Logic building and C++ prerequisites for DSA - think like a programmer, then code it.",
  description: "A guided foundations course for DSA readiness: thinking like a programmer, your first C++ programs, variables and operations, conditions, and loops. Every chapter explains each term on first use, with worked examples, dry runs, practice problems, self-checks, and DSA connections.",
  icon: "Code2",
  color: "oklch(0.65 0.18 250)",
  category: "Programming Languages",
  order: 4,
  modules: [
    {
      slug: "part-1-cpp-for-dsa",
      title: "Part 1 - CPP For DSA",
      summary: "Part 1 of the course.",
      order: 1,
      difficulty: "beginner",
      estimatedMinutes: 150,
      tutorials: [
    {
      slug: "chapter-1-thinking-like-a-programmer",
      title: "Chapter 1 — Thinking Like a Programmer",
      summary: "Many beginners rush to learn C++ syntax or jump straight into Data Structures and Algorithms (DSA).",
      difficulty: "beginner",
      estimatedMinutes: 15,
      order: 0,
      tags: "cpp,dsa,logic-building,programming",
      learningObjectives: ["By the end of this chapter, you will understand:", "What programming actually is at its core.", "How a computer processes instructions.", "The difference between human thinking and computer thinking.", "What an algorithm is and how to write one.", "How to break a large, confusing problem into small, logical steps.", "How to identify inputs, processes, and outputs."],
      prerequisites: [],
      whereItFits: "Many beginners rush to learn C++ syntax or jump straight into Data Structures and Algorithms (DSA).",
      keyTakeaways: ["Programming is not about typing fast or memorizing complex symbols. It is about problem-solving. A computer is a literal machine that requires exact, unambiguous, step-by-step instructions. An algorithm is the blueprint for those instructions. Before you can write code, you must be able to break a problem down into logical steps, identify the inputs and outputs, and trace those steps manually to ensure they work.", "Computers have no common sense; they only follow exact instructions.", "An algorithm is a step-by-step recipe to solve a problem.", "Logic is the reasoning behind the steps.", "Always identify the Input, Process, and Output before writing instructions.", "Dry running (tracing your logic on paper) is mandatory to find bugs before coding.", "Always consider edge cases (unusual inputs).", "Before moving to Chapter 2, ensure you can:", "Explain what an algorithm is in your own words.", "Write a clear, step-by-step algorithm in plain English for a simple task."],
      selfAssessment: [],
      content: `# Chapter 1 — Thinking Like a Programmer

## Why This Matters for DSA

Many beginners rush to learn C++ syntax or jump straight into Data Structures and Algorithms (DSA). They memorize how to write a \`for\` loop or what a "Linked List" is, but when faced with a new problem, they freeze.

Why? Because DSA is 10% coding and 90% logic.

If you do not know how to break a problem down into logical steps, knowing the syntax for a Binary Search Tree will not help you. This chapter builds the mental foundation. It teaches you how to look at a problem and see the steps required to solve it, which is the exact skill you will use every single day in DSA.

## Prerequisite

No prior knowledge required. We are starting from absolute zero.

## Start With Intuition

Imagine you ask a human friend, "Hey, can you make me a cup of instant coffee?"

Your friend will walk to the kitchen, get a mug, boil water, add coffee powder, add sugar, pour the water, stir it, and hand it to you. If you ask them, "How did you do that?" they might say, "I just made it." They rely on common sense and unspoken assumptions. They know what a "cup" is. They know water needs to be hot. They know where the kitchen is.

Now, imagine asking a computer to make that same cup of coffee.

The computer has zero common sense. It does not know what coffee is. It does not know that water should be hot. If you tell it "make coffee," it will do absolutely nothing, because "make coffee" is not a valid instruction.

To get the computer to make coffee, you have to explain every single microscopic action, in the exact order it must happen, without assuming it knows anything.

Programming is simply the act of translating human intentions into a sequence of exact, unambiguous instructions that a computer can follow.

## Core Concept

### What is a Computer?

A computer is an electronic machine that follows instructions exactly as they are given. It is incredibly fast and can perform billions of calculations per second, but it is also completely literal. It will do exactly what you tell it to do, even if what you told it to do is stupid.

### What is a Program?

A program is a complete set of instructions that tells the computer how to perform a specific task. When you write a program, you are writing a recipe.

### What is an Algorithm?

An algorithm is a step-by-step procedure to solve a problem or accomplish a task.

- A recipe for a cake is an algorithm.

- The instructions on a shampoo bottle ("Lather, Rinse, Repeat") is an algorithm.

- The steps you take to find a lost key in your house is an algorithm.

In programming, before you write code, you must first design the algorithm.

### What is Logic?

Logic is the reasoning behind the steps. It is the "why" and "how" of your algorithm.

- Why did you boil the water before adding the coffee powder? Because coffee doesn't dissolve well in cold water. That is logic.

- How do you know when the water is ready? When it starts bubbling. That is logic.

Good programming is simply good logic, translated into a language the computer understands.

## Important Terminology

Let's introduce the basic vocabulary of programming. We will use these words throughout the course.

- Instruction: A single, specific command given to the computer (e.g., "Add 5 and 3").

- Input: The data or information given to the program to work with (e.g., the numbers 5 and 3).

- Output: The result produced by the program after processing the input (e.g., the number 8).

- Process: The actions performed on the input to produce the output (e.g., the act of adding).

- Syntax: The strict grammar rules of a programming language. Just like English requires a period at the end of a sentence, C++ requires a semicolon ; at the end of an instruction.

- Bug: A mistake in your logic or instructions that causes the program to behave incorrectly.

- Debugging: The process of finding and fixing bugs.

## Mental Model

To think like a programmer, adopt the Mental Model of the Blindfolded Robot.

Imagine you are guiding a robot through a maze. The robot is blindfolded. It can only understand three commands:

- Move forward one step

- Turn left 90 degrees

- Turn right 90 degrees

If you tell the robot, "Go to the exit," it will just stand there. You must break it down:

- Move forward 3 steps.

- Turn right 90 degrees.

- Move forward 2 steps. ...and so on.

If the robot hits a wall, it doesn't know it hit a wall unless you give it a command to \`Check if wall is in front\`. If there is a wall, it must execute a different set of instructions.

Whenever you solve a programming problem, pretend you are giving instructions to a very fast, very literal, completely blindfolded robot.

## C++ Syntax

Wait, aren't we learning C++?

Yes, but remember our rule: Concept first, syntax later.

Right now, we are writing Algorithms, not C++ code. The "syntax" for an algorithm is simply plain English, written in numbered steps.

Later, we will translate these numbered English steps into C++ syntax. If you can write the logic in plain English, translating it to C++ is just a matter of learning the vocabulary.

## First Example

Let's write an algorithm for a very simple task: Determining if a number is Even or Odd.

### Understand the Problem

We need a method to look at any whole number and decide if it is even (like 2, 4, 10) or odd (like 1, 3, 7).

### The Human Way

A human just looks at the last digit. If it's 0, 2, 4, 6, or 8, it's even. Otherwise, it's odd.

### The Computer Way (Algorithm)

A computer doesn't "look" at digits easily. But it is great at math. We know that an even number can be divided by 2 without leaving anything left over. An odd number will always have 1 left over.

Algorithm: Check Even or Odd

- Take a number as Input. Let's call it N.

- Divide N by 2.

- Find the remainder of that division.

- If the remainder is exactly 0:

- Output "The number is Even".

- Else (if the remainder is not 0):

- Output "The number is Odd".

- Stop.

Notice how clear and unambiguous this is? There is no room for the computer to misunderstand.

## Step-by-Step Execution

Let's trace how the computer executes this algorithm if the Input is \`7\`.

- Step 1: The computer receives the number 7 and stores it in a mental box called N. So, N = 7.

- Step 2 & 3: The computer divides 7 by 2. The answer is 3, with a remainder of 1. The remainder is the important part here.

- Step 4: The computer checks: "Is the remainder exactly 0?" The remainder is 1. So, the answer is No. It skips to Step 5.

- Step 5: The computer executes the "Else" block. It outputs "The number is Odd".

- Step 6: The program stops.

## Dry Run

"Dry running" means manually tracing the execution of your logic on paper, pretending you are the computer. This is the most critical skill you will learn in this course. We use Trace Tables to do this.

Let's dry run the Even/Odd algorithm with the input \`10\`.

| Step | Action | Value of N | Remainder | Condition Checked | Output / Result |
| --- | --- | --- | --- | --- | --- |
| 1 | Read Input | 10 | - | - | - |
| 2 & 3 | Divide by 2, find remainder | 10 | 0 | - | - |
| 4 | Check if remainder == 0 | 10 | 0 | Is 0 == 0? (Yes) | - |
| 5 | (Skipped because Step 4 was Yes) | 10 | 0 | - | - |
| 4 (cont) | Execute If block | 10 | 0 | - | "The number is Even" |
| 6 | Stop | 10 | 0 | - | Program Ends |

By drawing this table, you prove to yourself that your logic actually works before you ever touch a keyboard.

## More Examples

Let's look at another everyday algorithm: Finding the largest of three numbers (A, B, and C).

Algorithm: Find Largest of Three

- Take three numbers as Input: A, B, and C.

- Assume A is the largest. Store this assumption in a variable called Max. (So, Max = A).

- Compare B with Max.

- If B is greater than Max:

- Update Max to be B. (Now Max = B).

- Compare C with Max.

- If C is greater than Max:

- Update Max to be C. (Now Max = C).

- Output the value of Max.

- Stop.

Why this logic? Instead of trying to compare all three at once (which is confusing), we use a "tournament" style. We pick a champion (\`A\`), then challenge it with \`B\`. If \`B\` wins, \`B\` becomes the new champion. Then we challenge the current champion with \`C\`. The final champion is the largest. This is a fundamental programming pattern called keeping a running maximum.

## Common Beginner Mistakes

- Assuming the computer knows what you mean:

- Mistake: "Calculate the area."

- Fix: "Multiply the length by the width and store the result in area."

- Skipping steps:

- Mistake: "Add the user's numbers and print the total." (How does it get the numbers? Where does it store them?)

- Fix: Break it down: "Read first number. Read second number. Add them. Print result."

- Forgetting to stop:

- An algorithm must have a clear end point. If it loops forever, it's an infinite loop (a very common bug).

## Edge Cases

An edge case is an extreme or unusual situation that might break your logic. A good programmer always asks: "What if the input is weird?"

For the "Largest of Three" algorithm:

- Edge Case 1: What if all three numbers are the same? (e.g., 5, 5, 5).

- Does our logic hold? Yes. Max starts at 5. B (5) is not greater than 5, so Max stays 5. C (5) is not greater than 5. Output is 5. Correct.

- Edge Case 2: What if the numbers are negative? (e.g., -2, -5, -1).

- Does our logic hold? Yes. Max starts at -2. B (-5) is not greater than -2. C (-1) is greater than -2, so Max becomes -1. Output is -1. Correct.

Always test your logic against edge cases!

## Guided Practice

Problem: Write an algorithm to swap the contents of two glasses. Glass 1 contains Milk. Glass 2 contains Juice. You want Glass 1 to have Juice and Glass 2 to have Milk.

Hint: If you just pour Milk into Juice, you ruin both. You need a third, empty container.

Your Turn: Write the numbered steps to solve this.

- ...

- ...

(Think about it before looking at the solution below).

Click to see the solution

Algorithm: Swap Two Glasses

- Get a third, empty glass. Let's call it Temp.

- Pour the contents of Glass 1 (Milk) into Temp. (Glass 1 is now empty).

- Pour the contents of Glass 2 (Juice) into Glass 1. (Glass 2 is now empty).

- Pour the contents of Temp (Milk) into Glass 2.

- Stop.

Note: This "Temp" variable concept is one of the most fundamental ideas in all of computer science. You will use it constantly in DSA.

## Independent Practice

Problem: Write an algorithm to check if a given word is a Palindrome. (A palindrome is a word that reads the same forwards and backwards, like "madam" or "racecar").

Requirements:

- Write it in plain English numbered steps.

- Do not use C++ code.

- Include a dry run for the word "level".

## Challenge Problems

Problem: You are programming a robot to cross a 10x10 grid room. The robot starts at the bottom-left corner (0,0) and needs to reach the top-right corner (9,9). However, there is a single box obstacle at (5,5).

Write a high-level algorithm for the robot to reach the destination without hitting the box. Hint: The robot needs to be able to "see" what is in front of it.

## Debugging Practice

Find the logical flaw in the following algorithm for making toast. Why will it fail or cause a problem?

Algorithm: Make Toast

- Put a slice of bread into the toaster.

- Push down the lever to start toasting.

- Wait for the toast to pop up.

- Take the toast out and put it on a plate.

- Plug the toaster into the wall outlet.

- Eat the toast.

What went wrong?

Click to see the answer Step 5 happens too late! The toaster needs to be plugged in (Step 5) *before* you push the lever (Step 2). Because the steps are out of order, the toaster won't heat up, and you'll be waiting forever for the toast to pop up. This is a **Sequential Logic Error**.

## Predict the Output

Trace the following logical steps on paper. What is the final value of \`X\`?

- Set X to 5.

- Set Y to 3.

- Add Y to X. (Update X with the result).

- Multiply X by 2. (Update X with the result).

- Subtract Y from X. (Update X with the result).

What is the final value of \`X\`?

Click to see the answer 1. X = 5, Y = 3 2. X = 5 + 3 = 8 3. X = 8 * 2 = 16 4. X = 16 - 3 = 13. Final value of X is **13**.

## Think Before You Code

Problem: A store is offering a discount. If you buy 3 or more items, you get 10% off the total price. If you buy fewer than 3 items, there is no discount. Write the logic (algorithm) to calculate the final price a customer must pay.

Inputs: \`Price_per_item\`, \`Number_of_items\`. Output: \`Final_Price\`.

Write the steps. Identify the condition that changes the outcome.

## Self-Check

- What is the difference between a program and an algorithm?

- Why can't you just tell a computer "sort these numbers"?

- What is a trace table used for?

- What is an edge case?

## Mastery Test

Question 1: Write an algorithm to calculate the total cost of buying apples. The user inputs the number of apples and the price per apple. If the total cost is greater than $50, apply a $5 discount. Output the final cost. Question 2: Dry run your algorithm from Question 1 with the following inputs:

- Case A: 10 apples at $4 each.

- Case B: 5 apples at $6 each.

Question 3: Find the logical error in this algorithm to find the average of two numbers:

- Read Number A.

- Read Number B.

- Add A and B.

- Output the result.

## DSA Connection

In Data Structures and Algorithms, you will face complex problems like "Find the shortest path in a maze" or "Sort a million numbers efficiently." You cannot solve these by just staring at the screen and typing C++. You will use the exact same skills learned here: breaking the massive problem into tiny logical steps, identifying the inputs/outputs, handling edge cases, and dry-running your logic on paper before writing a single line of code. The syntax changes, but the thinking remains exactly the same.`,
    },
    {
      slug: "chapter-2-your-first-c-programs",
      title: "Chapter 2 — Your First C++ Programs",
      summary: "Every Data Structure and Algorithm you will ever write in C++—whether it is a simple array traversal or a complex graph algorithm—will live inside the exact same basic structure you learn today.",
      difficulty: "beginner",
      estimatedMinutes: 13,
      order: 1,
      tags: "cpp,dsa,logic-building,programming",
      learningObjectives: ["In Chapter 1, you learned how to think like a programmer and write algorithms in plain English. Now, it is time to translate those algorithms into a language the computer actually understands.", "By the end of this chapter, you will be able to:", "Understand the journey of a C++ program from text to execution.", "Set up a basic C++ programming environment.", "Write, compile, and run your first C++ programs.", "Understand the purpose of every single symbol in a basic C++ program.", "Use cout to display information to the user.", "Use cin to receive information from the user.", "Identify and fix the most common beginner syntax errors."],
      prerequisites: [],
      whereItFits: "Every Data Structure and Algorithm you will ever write in C++—whether it is a simple array traversal or a complex graph algorithm—will live inside the exact same basic structure you learn today.",
      keyTakeaways: ["You have taken the first step from logical thinking to actual coding. You learned that C++ requires a strict structure: including libraries, defining the main function, and ending statements with semicolons. You learned that cout pushes data out to the screen, and cin pulls data in from the keyboard. Most importantly, you learned that the compiler is a strict grammar checker that will not let your program run until every syntax rule is followed perfectly.", "Every C++ program must have an int main() function.", "#include <iostream> is required to use cin and cout.", "Every executable statement must end with a semicolon ;.", "C++ is strictly case-sensitive (cout is correct, Cout is an error).", "endl moves the cursor to the next line.", "Compilation must succeed before a program can run.", "Before moving to Chapter 3, ensure you can:", "Explain the role of the compiler in your own words.", "Write the basic skeleton of a C++ program from memory."],
      selfAssessment: [],
      content: `# Chapter 2 — Your First C++ Programs

## Why This Matters for DSA

Every Data Structure and Algorithm you will ever write in C++—whether it is a simple array traversal or a complex graph algorithm—will live inside the exact same basic structure you learn today.

Understanding this foundation prevents you from getting frustrated by trivial syntax errors later. When your DSA logic fails, you want to know for a fact that your basic program structure is correct, so you can focus entirely on debugging the logic, not the setup.

## Prerequisite

Chapter 1: Thinking Like a Programmer. You should understand what an algorithm is and the concept of Input, Process, and Output.

## Start With Intuition

Imagine you want to send an important letter to a friend who only speaks Japanese, but you only speak English.

- You write the letter in English on a piece of paper. (This is your Source Code).

- You give the letter to a professional translator. (This is the Compiler).

- The translator checks your English for grammar mistakes. If there are mistakes, they hand it back to you to fix. (This is a Compile Error).

- If the grammar is perfect, the translator writes a new letter in Japanese. (This is the Executable Machine Code).

- Your friend receives the Japanese letter and understands exactly what to do. (This is the Program Running).

C++ is the English. The computer is the Japanese-speaking friend. The compiler is the translator.

## Core Concept

Computers only understand binary (0s and 1s). Writing a program in 0s and 1s is impossible for humans to manage. Therefore, we use a High-Level Programming Language like C++, which uses words and symbols that humans can read.

However, the computer still cannot read C++ directly. We must use a special program called a Compiler. The compiler's job is to read your C++ text file, check it for strict grammatical rules (syntax), and translate it into a machine-readable file (an executable) that your operating system can run.

## Important Terminology

- Source Code: The human-readable text file you write, usually ending in .cpp.

- Compiler: A software tool that translates source code into machine code.

- Executable: The final, machine-readable file that the computer actually runs (e.g., .exe on Windows).

- Syntax: The strict spelling and grammar rules of C++.

- Statement: A single, complete instruction in C++ (like a sentence in English).

- Keyword: A reserved word in C++ that has a special meaning (e.g., int, return). You cannot use these as names for your own variables.

## Mental Model

Think of a C++ program as a Factory Assembly Line.

- The #include statements bring in the necessary tools from the warehouse.

- The main() function is the main assembly floor where the actual work happens.

- Every instruction (statement) is a worker performing a specific task, and they must finish their task and ring a bell (the semicolon ;) before the next worker can start.

## C++ Syntax

Here is the absolute minimum structure required for a valid C++ program. Do not try to memorize it yet; we will dissect it immediately.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Your instructions go here

    return 0;
}


## First Example
\`\`\`

Let's write the traditional first program: printing "Hello, World!" to the screen.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}


### Line-by-Line Explanation
\`\`\`

Line 1: \`#include <iostream>\`

- What it does: It tells the compiler to include a standard library file named iostream (Input-Output Stream).

- Why it exists: C++ does not know how to talk to the screen or keyboard by default. iostream contains the pre-written tools (like cout and cin) that teach the program how to do this.

Line 2: \`using namespace std;\`

- What it does: It tells the compiler, "Whenever I use a standard tool, assume it comes from the std (standard) namespace."

- Why it exists: C++ has thousands of tools. To prevent naming conflicts, they are grouped into "namespaces." Without this line, we would have to type std::cout every single time. For beginners, this line saves typing and keeps code clean.

Line 3: \`int main() {\`

- int: Stands for "integer". It means this function will eventually hand back a whole number to the operating system when it finishes.

- main: This is the most important word in C++. It is the name of the starting point. When you run a C++ program, the computer always looks for main and starts executing from the very first line inside it.

- (): Parentheses are used to pass information into a function. main takes no information from the outside, so they are empty.

- {: The opening curly brace. It marks the beginning of the main function's "block". Everything inside these braces belongs to main.

Line 4: \`cout << "Hello, World!" << endl;\`

- cout: Stands for "Character Output". It is the tool used to print text to the screen.

- <<: The insertion operator. Imagine it as an arrow pushing the text on the right into the cout tool on the left.

- "Hello, World!": The actual text (called a "string") we want to print. The double quotes "" tell the compiler, "Treat everything inside here as literal text, not as C++ commands."

- << endl: Stands for "end line". It pushes a newline character into cout, moving the cursor down to the next line (like pressing the Enter key).

- ;: The semicolon. This is the period at the end of the C++ sentence. It tells the compiler, "This statement is complete."

Line 5: \`return 0;\`

- What it does: It sends the number 0 back to the operating system.

- Why it exists: In programming, returning 0 from main is a universal signal that means "The program finished successfully with no errors." (This matches the int we declared at the start of main).

Line 6: \`}\`

- The closing curly brace. It marks the end of the main function's block.

## Step-by-Step Execution

When you click "Run" in your code editor, this is what happens behind the scenes:

- The Compiler reads the .cpp file.

- It checks every line for syntax errors (e.g., missing semicolons).

- If errors exist, it stops and shows you an error message. You must fix them.

- If no errors exist, it translates the code into an executable file.

- The Operating System loads the executable into memory.

- The OS finds the main() function and starts executing line by line from top to bottom.

- When it hits return 0;, the program terminates and gives control back to the OS.

## Dry Run

Let's dry run a program that takes input and gives output.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int age;
    cout << "Enter your age: ";
    cin >> age;
    cout << "You are " << age << " years old." << endl;
    return 0;
}

\`\`\`

Trace Table (Assume user types \`25\`):

| Step | Code Executed | Action | Screen Output | Variable age |
| --- | --- | --- | --- | --- |
| 1 | int age; | Create an integer box named age. | (none) | (empty/undefined) |
| 2 | cout << "Enter..."; | Print the prompt to the screen. | Enter your age: | (empty) |
| 3 | cin >> age; | Pause and wait for user input. User types 25 and presses Enter. | Enter your age: 25 | 25 |
| 4 | cout << "You are "... | Print the combined text and variable value. | Enter your age: 25 You are 25 years old. | 25 |
| 5 | return 0; | Program ends successfully. | (Program closes) | 25 |

## More Examples

Example 1: Printing multiple lines You can chain multiple \`<<\` operators together to build a single line of output.

- cout << "Name: " << "Alice" << ", Age: " << 21 << endl;

- // Output: Name: Alice, Age: 21

Example 2: Multiple inputs You can take multiple inputs in a row. The user can separate them with spaces or the Enter key.

\`\`\`cpp
int a, b;
cin >> a >> b; // User types: 10 20
// 'a' becomes 10, 'b' becomes 20


## Common Beginner Mistakes

- Forgetting the semicolon ;

- Mistake: cout << "Hello"

- Why: The compiler keeps reading, expecting the statement to end, and eventually throws a "expected ';' before '}' token" error.

- Fix: Always end executable statements with ;.

- Case Sensitivity

- Mistake: Cout << "Hello"; or Int main()

- Why: C++ treats uppercase and lowercase letters as completely different characters. cout is a defined tool; Cout is nothing.

- Fix: Always use lowercase for cout, cin, int, main, and return.

- Forgetting the #include <iostream>

- Mistake: Trying to use cout without including the library.

- Why: The compiler has no idea what cout is. It will say "'cout' was not declared in this scope".

- Fix: Always put #include <iostream> at the very top of your file.

- Using single quotes '' for text

- Mistake: cout << 'Hello';

- Why: Single quotes are strictly for a single character (like 'A'). Text (strings) must use double quotes "Hello".

## Edge Cases
\`\`\`

What happens if a program expects a number, but the user types a letter?

- int age;

- cin >> age; // User types "twenty"

The Result: The \`cin\` operation will fail. It cannot put the word "twenty" into an integer box. The \`age\` variable will remain empty (or hold a default value of \`0\`), and the program will continue running with bad data. Note: We will learn how to handle and prevent this specific edge case in later chapters on debugging and validation.

## Guided Practice

Task: Modify the "Hello, World!" program to print the following exact output:

- Welcome to C++

- Learning is fun!

Hint: You will need two \`cout\` statements, or one \`cout\` statement with an \`\\n\` (newline character) or \`endl\` in the middle.

\`\`\`cpp
Click to see the solution #include <iostream>
using namespace std;

int main() {
    cout << "Welcome to C++" << endl;
    cout << "Learning is fun!" << endl;
    return 0;
}


## Independent Practice
\`\`\`

Problem: Write a complete C++ program that does the following:

- Prints the message: "Enter two numbers: "

- Takes two integer inputs from the user.

- Prints the message: "You entered: " followed by the first number, a comma, and the second number.

## Challenge Problems

Problem: Write a program that uses \`cout\` to print the following ASCII art exactly as shown. Pay close attention to spaces and newlines.

- *

- ***

- *****

- |

Hint: Treat spaces as characters that must be explicitly printed.

## Debugging Practice

The following program has three syntax errors. Find them, explain why they are wrong, and write the corrected code.

- #include <iostream>

- using namespace std

- int Main() {

- Cout << "Debug me!" << endl

- return 0;

- }

- Click to see the solution

- using namespace std is missing a semicolon at the end. It should be using namespace std;

- int Main() has a capital 'M'. It must be lowercase: int main()

- Cout has a capital 'C'. It must be lowercase: cout

- endl is missing a semicolon at the end of the line. It should be endl;

(Note: There were actually 4 errors here, a common trick in debugging!)

## Predict the Output

What will the following program print to the screen? Trace it mentally.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "A";
    cout << "B" << endl;
    cout << "C";
    cout << "D" << endl;
    return 0;
}
 Click to see the solution AB
CD

\`\`\`

Explanation: "A" and "B" are printed on the same line. \`endl\` forces a new line. "C" and "D" are printed on the next line, followed by another new line.

## Think Before You Code

Problem: You need to write a program that calculates the total cost of items. Before writing any C++ code, write the Algorithm (in plain English numbered steps) for a program that:

- Asks the user for the price of an item.

- Asks the user for the quantity of that item.

- Calculates the total (price × quantity).

- Prints the total.

Identify the exact \`cin\` and \`cout\` steps you will need.

## Self-Check

- What is the purpose of the #include <iostream> line?

- Why does the main function have { and } around its code?

- What is the difference between cout and cin?

- What does returning 0 at the end of main signify?

## Mastery Test

Task: Write a complete, compilable C++ program from scratch (do not copy-paste) that acts as a simple "Name Tag Generator".

- It must include the correct headers and main structure.

- It must ask the user: "What is your first name?"

- It must read the input.

- It must ask: "What is your age?"

- It must read the input.

- It must print: "Hello, [Name]! You are [Age] years old." (Replace brackets with the actual variables).

## DSA Connection

When you eventually solve DSA problems on platforms like LeetCode, HackerRank, or Codeforces, the platform provides the \`#include\` statements and the \`main\` function for you. Your job will be to write the logic inside a specific function. However, understanding the surrounding structure is vital for writing your own test cases, debugging locally on your machine, and understanding how your code is actually executed by the system.`,
    },
    {
      slug: "chapter-3-variables-data-and-basic-operations",
      title: "Chapter 3 — Variables, Data, and Basic Operations",
      summary: "Variables are the absolute atoms of programming.",
      difficulty: "beginner",
      estimatedMinutes: 14,
      order: 2,
      tags: "cpp,dsa,logic-building,programming",
      learningObjectives: ["In Chapter 2, you learned how to print text and receive input. But a program that just echoes what you type isn't very useful. To solve real problems, a program must remember information and change it.", "By the end of this chapter, you will understand:", "What a variable is and how to create one.", "The different types of data a computer can store (int, double, char, bool, string).", "The crucial difference between declaring, initializing, and assigning a variable.", "How to perform basic math using arithmetic operators (+, -, *, /, %).", "The tricky behavior of integer division and the power of the modulo operator (%).", "How to manually trace (dry run) variable changes on paper."],
      prerequisites: [],
      whereItFits: "Variables are the absolute atoms of programming.",
      keyTakeaways: ["Variables are named storage locations for data. You must declare their data type (int, double, char, bool, string) so the computer knows how much memory to allocate. The = operator assigns a value, it does not mean mathematical equality. Understanding how integer division truncates and how the modulo operator % finds remainders is critical for building numerical logic. Always initialize your variables, and trace your code on paper to ensure your logic updates values correctly.", "A variable is a labeled box in memory.", "Always initialize variables when you create them (e.g., int x = 0;).", "= is for assignment. The right side is evaluated and stored in the left side.", "Integer division (7 / 2) drops the decimal (result is 3). Use double for decimals.", "The modulo operator (%) gives the remainder and is essential for digit extraction and even/odd checks.", "char uses single quotes ('A'), string uses double quotes (\"Hello\").", "Before moving to Chapter 4, ensure you can:", "Declare and initialize variables of type int, double, char, and string.", "Explain the difference between = (assignment) and mathematical equality."],
      selfAssessment: [],
      content: `# Chapter 3 — Variables, Data, and Basic Operations

## Why This Matters for DSA

Variables are the absolute atoms of programming. Every complex Data Structure you will ever learn—Arrays, Linked Lists, Trees, Hash Maps—is ultimately just a clever way of organizing and managing variables in memory.

If you do not deeply understand how data is stored, updated, and manipulated at this basic level, you will struggle immensely when trying to understand how algorithms modify data structures. Mastering variables now makes everything else easier.

## Prerequisite

Chapter 1 (Algorithms & Logic) and Chapter 2 (Basic C++ Structure, \`cin\`, \`cout\`).

## Start With Intuition

Imagine you are moving to a new house. You have a bunch of cardboard boxes.

If you just throw your items into a box and seal it, you will never find anything. Instead, you take a marker and write "Kitchen Plates" on the outside of the box, and you put the actual plates inside.

Later, if you want to add a new plate, you open the box, put it in, and close it. The label on the outside ("Kitchen Plates") stays the same, but the contents inside have changed.

In programming, a variable is exactly like that labeled box.

- The name of the variable is the label on the outside.

- The value is the data stored inside the box.

- The data type is the kind of box you chose (e.g., a small box for a single letter, a large box for a decimal number).

## Core Concept

### The Three Stages of a Variable

- Declaration: Telling the computer, "I need a box, and I am going to name it score." The computer reserves a tiny piece of memory for it.

- Initialization: Putting a value into that box for the very first time. (e.g., score = 0).

- Assignment (Updating): Changing the value inside the box later in the program. (e.g., score = 10).

Note: In C++, you can declare and initialize in a single step, which is the most common and recommended practice.

### The Assignment Operator (=)

CRITICAL RULE: In mathematics, \`=\` means "is equal to". In C++, \`=\` means "assign the value on the right side to the variable on the left side."

When you write \`x = 5;\`, you are commanding the computer: "Evaluate whatever is on the right (5), and put it into the box named \`x\`."

## Important Terminology

- Variable: A named storage location in memory that holds a value which can change.

- Data Type: A classification that tells the compiler what kind of data the variable will hold (e.g., whole numbers, decimals, text).

- Literal: The actual, fixed value written in the code (e.g., in int age = 21;, 21 is an integer literal).

- Constant: A variable whose value cannot be changed after it is initialized. We use the const keyword for this.

## Mental Model

Visualize a variable as a box.

- Variable Name (Label)

- +-----------------+

- |      Value      |  <-- The data inside

- +-----------------+

For example, if we write \`int apples = 5;\`:

- apples

- +--------+

- |   5    |

- +--------+

If we later write \`apples = 8;\`, the old \`5\` is destroyed, and \`8\` is placed inside:

- apples

- +--------+

- |   8    |

- +--------+

## C++ Syntax

Here is how you declare and initialize variables in C++:

\`data_type variable_name = initial_value;\`

## First Example

Let's write a program that calculates the area of a rectangle.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // 1. Declare and initialize variables
    int length = 10;
    int width = 5;

    // 2. Process: Calculate the area
    int area = length * width;

    // 3. Output the result
    cout << "The area is: " << area << endl;

    return 0;
}


### Line-by-Line Explanation

- int length = 10;: Creates an integer box named length and immediately puts the value 10 inside it.

- int width = 5;: Creates an integer box named width and puts 5 inside it.

- int area = length * width;: Creates a new integer box named area. The computer looks inside the length box (10) and the width box (5), multiplies them (10 * 5 = 50), and puts the result (50) into the area box.

- cout << ...: Prints the text and the value currently inside the area box.

## Step-by-Step Execution

- The program starts at main().

- It creates length and stores 10.

- It creates width and stores 5.

- It evaluates length * width (which is 10 * 5).

- It creates area and stores the result 50.

- It prints "The area is: 50".

- It returns 0 and ends.

## Dry Run
\`\`\`

Let's trace a program that updates a variable. This is a fundamental pattern in programming called accumulation or updating.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int score = 0;
    cout << "Initial score: " << score << endl;

    score = score + 10;
    cout << "After bonus: " << score << endl;

    score = score * 2;
    cout << "After multiplier: " << score << endl;

    return 0;
}

\`\`\`

Trace Table:

| Line of Code | Variable: score | Action / Explanation |
| --- | --- | --- |
| int score = 0; | 0 | Box created, initialized to 0. |
| cout << ... | 0 | Prints "Initial score: 0". |
| score = score + 10; | 10 | Look at score (0), add 10. Result is 10. Put 10 back in score. |
| cout << ... | 10 | Prints "After bonus: 10". |
| score = score * 2; | 20 | Look at score (10), multiply by 2. Result is 20. Put 20 back in score. |
| cout << ... | 20 | Prints "After multiplier: 20". |

Notice how \`score = score + 10\` is not a mathematical equation (which would be impossible, as a number cannot equal itself plus 10). It is an instruction: "Take the current value of score, add 10, and save it back into score."

## More Examples: Data Types and Operators

C++ has several fundamental data types. You must choose the right "box" for the right "item".

| Data Type | Keyword | What it holds | Example |
| --- | --- | --- | --- |
| Integer | int | Whole numbers (positive, negative, zero) | int age = 25; |
| Decimal | double | Numbers with fractional parts (high precision) | double price = 19.99; |
| Character | char | A single letter, digit, or symbol | char grade = 'A'; (Must use single quotes!) |
| Boolean | bool | Logical truth values | bool isRaining = true; (No quotes) |
| Text | string | A sequence of characters (words/sentences) | string name = "Alice"; (Requires #include <string>) |

### Arithmetic Operators

| Operator | Name | Example | Result |
| --- | --- | --- | --- |
| + | Addition | 5 + 3 | 8 |
| - | Subtraction | 5 - 3 | 2 |
| * | Multiplication | 5 * 3 | 15 |
| / | Division | 7 / 2 | 3 (See warning below!) |
| % | Modulo (Remainder) | 7 % 2 | 1 |

### ⚠️ The Danger of Integer Division

If you divide two \`int\` values, C++ drops the decimal part entirely. It does not round; it truncates (chops off).

- int result = 7 / 2;

- // Math says 3.5. C++ says 3.

If you want the decimal answer, at least one of the numbers must be a \`double\`:

\`double result = 7.0 / 2; // Result is 3.5\`

### The Power of Modulo (%)

The modulo operator gives the remainder of integer division. This is incredibly useful in logic building.

- 10 % 3 is 1 (because 10 / 3 = 3 remainder 1).

- 10 % 2 is 0 (because 10 is perfectly divisible by 2).

Hint: Modulo is the standard way to check if a number is even or odd.

### Increment and Decrement

Shorthand for adding or subtracting 1:

- int count = 5;

- count++;  // Same as count = count + 1; (count is now 6)

- count--;  // Same as count = count - 1; (count is now 5)

## Common Beginner Mistakes

- Using an uninitialized variable:

- Mistake: int x; cout << x;

- Why: The box was created, but nothing was put inside. It contains "garbage" data (whatever random 0s and 1s were left in memory). This causes unpredictable behavior.

- Fix: Always initialize variables: int x = 0;

- Confusing = (assignment) with == (equality check):

- Mistake: if (x = 5)

- Why: This assigns 5 to x, it doesn't check if x is 5. (We will cover if statements in Chapter 4, but this is a classic future bug).

- Using single quotes for strings:

- Mistake: string name = 'John';

- Why: Single quotes ' ' are strictly for a single char. Double quotes " " are for string.

- Forgetting #include <string>:

- Why: Unlike int or double, string is not a built-in primitive type; it's part of a library. You must include it at the top of your file.

## Edge Cases

- Division by Zero: int x = 5 / 0; This will cause a Runtime Error (the program will crash). The computer cannot divide by zero. You must ensure the denominator is never zero.

- Overflow: Every data type has a maximum limit. A standard int can hold up to roughly 2 billion. If you try to store 3 billion in an int, it will "overflow" and wrap around to a negative number. (For now, just be aware that boxes have size limits).

## Guided Practice

Problem: Write a program that calculates the final price of an item after a 15% discount. Inputs: \`original_price\` (e.g., 100.0) Output: \`final_price\`

Hint: 15% is 0.15 in decimal. The discount amount is \`original_price * 0.15\`.

\`\`\`cpp
Click to see the solution #include <iostream>
using namespace std;

int main() {
    double original_price = 100.0;
    double discount_amount = original_price * 0.15;
    double final_price = original_price - discount_amount;

    cout << "Final price: $" << final_price << endl;
    return 0;
}


## Independent Practice
\`\`\`

Problem: Write a C++ program that converts a temperature from Celsius to Fahrenheit. Formula: \`Fahrenheit = (Celsius * 9.0 / 5.0) + 32\` Task: Declare a \`double\` variable for Celsius, initialize it to \`25.0\`, calculate the Fahrenheit equivalent, and print both values clearly.

## Challenge Problems

Problem: You are given a 3-digit number, for example, \`452\`. Using only the \`/\` (division) and \`%\` (modulo) operators, write a program that extracts and prints:

- The last digit (should be 2).

- The remaining first two digits (should be 45).

Hint: Think about what happens when you divide an integer by 10, and what happens when you modulo an integer by 10.

Click to see Hint 1 What is the remainder when ANY number is divided by 10? (e.g., 452 % 10) Click to see Hint 2 What happens to the decimal part when you divide an integer by 10? (e.g., 452 / 10) Click to see the solution \`#include <iostream>\`
\`using namespace std;\`

\`int main() {\`
\`    int number = 452;\`
\`    \`
\`    int last_digit = number % 10;      // 452 % 10 = 2\`
\`    int remaining = number / 10;       // 452 / 10 = 45\`
\`    \`
\`    cout << "Last digit: " << last_digit << endl;\`
\`    cout << "Remaining: " << remaining << endl;\`
\`    \`
\`    return 0;\`
\`}\`

This logic (using \`% 10\` to get the last digit and \`/ 10\` to remove it) is the foundational algorithm for reversing numbers or summing digits, which you will use constantly in DSA.

## Debugging Practice

The following program is supposed to calculate the average of two numbers, but it has a logical flaw. Find it and fix it.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int a = 7;
    int b = 2;
    int average = a + b / 2;
    cout << "Average: " << average << endl;
    return 0;
}
 Click to see the solution
\`\`\`

The Bug: Operator precedence and integer division. The code calculates \`b / 2\` first (2 / 2 = 1), then adds \`a\` (7 + 1 = 8). The output is 8, but the true average of 7 and 2 is 4.5.

The Fix: Use parentheses to force addition first, and use \`double\` to prevent integer division truncation.

\`double average = (a + b) / 2.0; \`

## Predict the Output

What will this program print? Trace it mentally using a table.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int y = 3;

    x = x % y;
    y = x * 2;
    x = x + y;

    cout << "x: " << x << ", y: " << y << endl;
    return 0;
}
 Click to see the solution

- x = 10, y = 3

- x = 10 % 3 -> x becomes 1. (y is still 3)

- y = 1 * 2 -> y becomes 2. (x is still 1)

- x = 1 + 2 -> x becomes 3.
\`\`\`

Output: \`x: 3, y: 2\`

## Think Before You Code

Remember the "Swap Two Glasses" algorithm from Chapter 1? Now, translate that exact logic into C++ code. Task: Write a program with two integer variables, \`a = 5\` and \`b = 10\`. Use a third variable called \`temp\` to swap their values. Print the values before and after the swap to prove it worked.

## Self-Check

- What is the difference between declaring a variable and initializing it?

- Why does int x = 5 / 2; result in x being 2?

- What is the purpose of the % operator? Give an example.

- Why is string name = 'Bob'; incorrect in C++?

## Mastery Test

Task: Write a complete C++ program that acts as a simple "Digit Analyzer".

- Declare an integer variable number and initialize it to 374.

- Extract the last digit and store it in a variable last.

- Remove the last digit from number and store the remaining part in a variable remaining.

- Calculate the sum of last and remaining.

- Print all three values clearly: the last digit, the remaining number, and their sum.

## DSA Connection

In DSA, you will frequently need to extract digits from numbers, check divisibility, or keep a running total (like the \`score = score + 10\` example). The modulo (\`%\`) and division (\`/\`) operators are the backbone of algorithms that reverse numbers, check for palindromes, or convert numbers between different bases (like binary to decimal). Mastering these basic operations now will make those algorithms feel trivial later.`,
    },
    {
      slug: "chapter-4-conditions-and-decision-making",
      title: "Chapter 4 — Conditions and Decision Making",
      summary: "Data Structures and Algorithms are fundamentally about making efficient decisions.",
      difficulty: "beginner",
      estimatedMinutes: 14,
      order: 3,
      tags: "cpp,dsa,logic-building,programming",
      learningObjectives: ["In Chapter 3, your programs executed instructions in a straight, predictable line from top to bottom. But real-world problems require choices.", "By the end of this chapter, you will understand:", "How computers represent \"True\" and \"False\" (Boolean logic).", "How to use comparison operators to ask questions about data.", "How to use if, else if, and else to create branching paths in your code.", "How to combine multiple conditions using logical operators (&&, ||, !).", "How to trace the flow of execution when decisions are involved."],
      prerequisites: [],
      whereItFits: "Data Structures and Algorithms are fundamentally about making efficient decisions.",
      keyTakeaways: ["Programs become powerful when they can make decisions. We use comparison operators (==, >, <, etc.) to create conditions that evaluate to true or false. The if, else if, and else statements allow the program to branch and execute different code based on those conditions. Logical operators (&&, ||, !) allow us to combine multiple conditions to handle complex real-world rules. Always be mindful of the difference between = (assignment) and == (comparison).", "Conditions must evaluate to a boolean (true or false).", "Use == to check for equality, never =.", "else if is checked only if the preceding if or else if was false.", "else is the \"catch-all\" that runs only if everything above it failed.", "To check if a number is in a range, use && (e.g., x >= 1 && x <= 10), not chained comparisons.", "Always test boundary values (edge cases) in your conditions.", "Before moving to Chapter 5, ensure you can:", "Write a basic if-else if-else chain from memory.", "Correctly use &&, ||, and ! to combine boolean expressions."],
      selfAssessment: [],
      content: `# Chapter 4 — Conditions and Decision Making

## Why This Matters for DSA

Data Structures and Algorithms are fundamentally about making efficient decisions.

- In Binary Search, the algorithm asks: "Is the target number greater than or less than the middle element?" and branches left or right based on the answer.

- In Sorting, the algorithm asks: "Is the current element larger than the next element?" and decides whether to swap them.

Without the ability to evaluate conditions and change the program's path, you cannot implement any meaningful algorithm. Conditions are the "brain" of your code.

## Prerequisite

Chapter 3: Variables, Data, and Basic Operations. You must be comfortable declaring variables and using basic arithmetic operators.

## Start With Intuition

Think about your daily routine. You constantly make decisions based on conditions:

- IF it is raining, THEN take an umbrella.

- ELSE IF it is snowing, THEN wear a heavy coat.

- ELSE (if it is neither), wear a normal jacket.

You evaluate the weather (the condition), and based on whether it is true or false, you choose a specific action (the branch). Programming works the exact same way. We give the computer a condition to evaluate, and it executes a specific block of code only if that condition is true.

## Core Concept

### Boolean Logic

At the lowest level, a computer can only evaluate things as True or False. In C++, this is represented by the \`bool\` data type, which can only hold one of two values: \`true\` or \`false\` (note: all lowercase).

### Comparison Operators

To generate a \`true\` or \`false\` result, we compare values using comparison operators. These operators always return a boolean result.

| Operator | Meaning | Example | Evaluates to |
| --- | --- | --- | --- |
| == | Equal to | 5 == 5 | true |
| != | Not equal to | 5 != 3 | true |
| > | Greater than | 10 > 5 | true |
| < | Less than | 2 < 1 | false |
| >= | Greater than or equal to | 5 >= 5 | true |
| <= | Less than or equal to | 3 <= 2 | false |

### Logical Operators

Sometimes, a single condition isn't enough. You need to check multiple things at once. Logical operators combine boolean results.

| Operator | Name | Meaning | Example | Evaluates to |
| --- | --- | --- | --- | --- |
| && | AND | True only if BOTH sides are true | (5 > 3) && (2 < 4) | true |
| \\|\\| | OR | True if AT LEAST ONE side is true | \`(5 > 10) |  |
| ! | NOT | Reverses the boolean value | !(5 > 3) | false |

## Important Terminology

- Condition: An expression that evaluates to either true or false.

- Branch: A block of code that executes only if a specific condition is met.

- Nested Condition: An if statement placed inside another if statement.

- Short-Circuit Evaluation: When using &&, if the first condition is false, C++ doesn't even check the second condition (because the whole statement is already false). The same applies to || if the first condition is true.

## Mental Model

Visualize an \`if-else\` statement as a fork in the road.

- [ Start ]

- |

- ( Is it raining? )  <-- Condition

- /               \\

- True                False

- /                     \\

- [ Take Umbrella ]        [ Wear Sunglasses ]

- \\                     /

- \\                   /

- [ Continue Walk ] <-- Both paths merge here

The program can only go down one path. Once it finishes that path, it merges back together and continues with the rest of the program.

## C++ Syntax

\`\`\`cpp
if (condition) {
    // Code to run if condition is TRUE
}
else if (another_condition) {
    // Code to run if the first was FALSE, but this one is TRUE
}
else {
    // Code to run if ALL above conditions are FALSE
}


## First Example
\`\`\`

Let's write a program that checks if a number is positive, negative, or zero.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int number = -5;

    if (number > 0) {
        cout << "The number is positive." << endl;
    }
    else if (number < 0) {
        cout << "The number is negative." << endl;
    }
    else {
        cout << "The number is exactly zero." << endl;
    }

    cout << "Program finished." << endl;
    return 0;
}


### Line-by-Line Explanation

- int number = -5;: We create a variable and give it a value.

- if (number > 0): The computer evaluates -5 > 0. This is false. It skips the code inside the first { }.

- else if (number < 0): The computer evaluates -5 < 0. This is true. It executes the code inside this { } block.

- else: Because a previous condition was already met, this block is completely ignored.

- cout << "Program finished.": After the entire if-else structure is done, the program merges back and continues here.

## Step-by-Step Execution

- Program starts. number is set to -5.

- Evaluate number > 0 (-5 > 0). Result: false. Skip block 1.

- Evaluate number < 0 (-5 < 0). Result: true. Enter block 2.

- Print "The number is negative."

- Exit the if-else structure.

- Print "Program finished."

- Return 0 and end.

## Dry Run
\`\`\`

Let's dry run a program that determines if a student passes or fails, and if they get an 'A' grade.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int marks = 85;
    bool isPresent = true;

    if (isPresent == false) {
        cout << "Absent. Grade: F" << endl;
    }
    else if (marks >= 90) {
        cout << "Pass. Grade: A" << endl;
    }
    else if (marks >= 50) {
        cout << "Pass. Grade: B" << endl;
    }
    else {
        cout << "Fail. Grade: F" << endl;
    }

    return 0;
}

\`\`\`

Trace Table:

| Step | Condition Evaluated | Result | Action Taken |
| --- | --- | --- | --- |
| 1 | isPresent == false (true == false) | false | Skip first block. |
| 2 | marks >= 90 (85 >= 90) | false | Skip second block. |
| 3 | marks >= 50 (85 >= 50) | true | Execute this block. Print "Pass. Grade: B". |
| 4 | else | N/A | Ignored, because a condition was already met. |

## More Examples

Example 1: Checking Even or Odd (Revisited with \`if\`)

\`\`\`cpp
int num = 7;
if (num % 2 == 0) {
    cout << "Even" << endl;
} else {
    cout << "Odd" << endl;
}

\`\`\`

Example 2: Combining Conditions with \`&&\`

\`\`\`cpp
int age = 20;
bool hasTicket = true;

if (age >= 18 && hasTicket == true) {
    cout << "You may enter the concert." << endl;
} else {
    cout << "Entry denied." << endl;
}


## Common Beginner Mistakes

- Using = instead of ==

- Mistake: if (x = 5)

- Why it's bad: This assigns 5 to x. In C++, an assignment operation returns the assigned value. Since 5 is non-zero, it evaluates to true. The condition will always be true, and x is accidentally changed!

- Fix: Always use == for comparison: if (x == 5).

- Chaining comparisons incorrectly

- Mistake: if (5 < x < 10)

- Why it's bad: C++ evaluates this left-to-right. (5 < x) becomes true (which is 1). Then it evaluates 1 < 10, which is true. It does not do what you think it does.

- Fix: Use the && operator: if (x > 5 && x < 10).

- Forgetting braces {} for multiple lines

- Mistake: if (x > 0)

- cout << "Positive";

- x = x + 1; // This line ALWAYS runs, regardless of the if statement!

- Fix: Always use braces, even for a single line, to prevent logical errors:if (x > 0) {

- cout << "Positive";

- x = x + 1;

- }

## Edge Cases
\`\`\`

When writing conditions, always ask: "What happens at the boundaries?"

- If checking age >= 18, what happens if age is exactly 18? (It should be included, so >= is correct, not >).

- If checking for a valid array index later in DSA, what happens if the index is 0 or -1?

- What if the user inputs a negative number when you only expect positive ones?

## Guided Practice

Problem: Write a program that takes an integer \`score\` (0 to 100) and prints the corresponding letter grade:

- 90 to 100: 'A'

- 80 to 89: 'B'

- 70 to 79: 'C'

- Below 70: 'F'

Hint: You can check the highest condition first. If it fails, you automatically know the score is lower than that threshold.

\`\`\`cpp
Click to see the solution #include <iostream>
using namespace std;

int main() {
    int score = 85; // You can change this to test

    if (score >= 90) {
        cout << "Grade: A" << endl;
    } else if (score >= 80) {
        cout << "Grade: B" << endl;
    } else if (score >= 70) {
        cout << "Grade: C" << endl;
    } else {
        cout << "Grade: F" << endl;
    }

    return 0;
}

\`\`\`

Notice we don't need to write \`score >= 80 && score < 90\`. Because the \`if (score >= 90)\` already failed, we already know \`score\` is less than 90!

## Independent Practice

Problem: Write a program to check if a given year is a Leap Year. Rules for Leap Year:

- The year must be divisible by 4.

- HOWEVER, if the year is divisible by 100, it is NOT a leap year...

- UNLESS the year is also divisible by 400, then it IS a leap year.

Task: Declare an \`int year = 2024;\` and use \`if-else\` and logical operators (\`&&\`, \`||\`, \`%\`) to print "Leap Year" or "Not a Leap Year".

Click to see Hint 1 First, check the most specific rule: Is it divisible by 400? (\`year % 400 == 0\`) Click to see Hint 2 If not, check the exception: Is it divisible by 100? If yes, it's NOT a leap year. Click to see Hint 3 If not, check the basic rule: Is it divisible by 4? Click to see the solution \`#include <iostream>\`
\`using namespace std;\`

\`int main() {\`
\`    int year = 2024;\`

\`    if (year % 400 == 0) {\`
\`        cout << year << " is a Leap Year." << endl;\`
\`    } else if (year % 100 == 0) {\`
\`        cout << year << " is NOT a Leap Year." << endl;\`
\`    } else if (year % 4 == 0) {\`
\`        cout << year << " is a Leap Year." << endl;\`
\`    } else {\`
\`        cout << year << " is NOT a Leap Year." << endl;\`
\`    }\`

\`    return 0;\`
\`}\`

(Alternative advanced one-liner logic: \`if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))\`)

## Challenge Problems

Problem: You are given three integer variables representing the lengths of three sides of a triangle: \`a\`, \`b\`, and \`c\`. Write a program to determine if these three sides can form a valid triangle. Rule: A triangle is valid if and only if the sum of the lengths of ANY two sides is strictly greater than the length of the third side.

Test your code with:

- a = 3, b = 4, c = 5 (Should be valid)

- a = 1, b = 10, c = 12 (Should be invalid)

## Debugging Practice

Find the two logical/syntax errors in this program intended to check if a number is between 1 and 10 (inclusive).

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    if (1 <= x <= 10) {
        cout << "x is in range" << endl;
    }
    return 0;
}
 Click to see the solution

- Logical Error: 1 <= x <= 10 is invalid logic in C++. It evaluates as (1 <= x) <= 10. If x is 5, (1 <= 5) is true (which is 1). Then 1 <= 10 is true. It will incorrectly say "in range" even for x = 100 (because 1 <= 100 is true (1), and 1 <= 10 is true).

- The Fix: You must split this into two conditions joined by &&: if (x >= 1 && x <= 10)

## Predict the Output
\`\`\`

What will this program print? Trace it carefully, paying attention to the \`!\` (NOT) operator.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 20;

    if (!(a > b) && (a + b == 30)) {
        cout << "Condition Met" << endl;
    } else {
        cout << "Condition Failed" << endl;
    }

    return 0;
}
 Click to see the solution

- Evaluate a > b: 10 > 20 is false.

- Evaluate !(false): This becomes true.

- Evaluate a + b == 30: 10 + 20 == 30 is true.

- Evaluate true && true: The result is true.
\`\`\`

Output: \`Condition Met\`

## Think Before You Code

Problem: Simple ATM Withdrawal. Inputs: \`balance\` (e.g., 500), \`withdraw_amount\` (e.g., 200). Rules:

- You can only withdraw if withdraw_amount is greater than 0.

- You can only withdraw if withdraw_amount is less than or equal to balance.

- If successful, deduct the amount from the balance and print the new balance.

- If not, print an appropriate error message ("Invalid amount" or "Insufficient funds").

Task: Write the Pseudocode (plain English steps) for this logic before writing any C++ code. Identify which conditions should be checked first.

## Self-Check

- What is the difference between = and ==?

- If an if condition is true, does the program check the else if conditions below it?

- What does the ! operator do to a boolean value?

- Why is if (5 < x < 10) a dangerous way to write code in C++?

## Mastery Test

Task: Write a complete C++ program that acts as a "Voting Eligibility Checker".

- Declare two variables: int age and bool isCitizen.

- Initialize them with test values (e.g., age = 17, isCitizen = true).

- Write logic to check eligibility: A person can vote only if they are a citizen AND they are 18 years or older.

- Print "Eligible to vote" or "Not eligible to vote" along with the specific reason if they fail (e.g., "Reason: Underage" or "Reason: Not a citizen").

## DSA Connection

In DSA, you will constantly use conditions to control the flow of data. For example, in a Linear Search algorithm, you will loop through an array and use an \`if\` statement: \`if (array[i] == target) { return i; }\`. In Sorting, you will use \`if (array[j] > array[j+1]) { swap(); }\`. Mastering how to combine conditions cleanly and correctly is the prerequisite for writing bug-free algorithms.`,
    },
    {
      slug: "chapter-5-loops-and-repetition",
      title: "Chapter 5 — Loops and Repetition",
      summary: "Loops are the engine of algorithmic problem-solving.",
      difficulty: "beginner",
      estimatedMinutes: 14,
      order: 4,
      tags: "cpp,dsa,logic-building,programming",
      learningObjectives: ["In previous chapters, your programs executed instructions in a straight line, making decisions along the way. But what if you need to repeat an action 100 times? Writing the same code 100 times is inefficient and prone to errors.", "By the end of this chapter, you will understand:", "Why loops are necessary and how they save time and code.", "The anatomy of the three main C++ loops: for, while, and do-while.", "The three critical components of any loop: Initialization, Condition, and Update.", "How to use counters (to count iterations) and accumulators (to sum values).", "How to trace nested loops (loops inside loops) using detailed trace tables.", "How to identify and fix infinite loops and off-by-one errors."],
      prerequisites: [],
      whereItFits: "Loops are the engine of algorithmic problem-solving.",
      keyTakeaways: ["Loops allow programs to repeat actions efficiently. The for loop is ideal when the number of iterations is known, combining initialization, condition, and update into one line. The while loop is best for condition-driven repetition, and do-while guarantees at least one execution. Every loop requires a mechanism to eventually make its condition false, otherwise, it becomes an infinite loop. Dry running loops with trace tables is the most reliable way to ensure your logic is correct before running the code.", "A loop must have: Initialization, Condition, and Update.", "for loops are for known iterations; while loops are for unknown iterations based on a condition.", "An accumulator (like sum = sum + i) is used to gather results across iterations.", "Never put a semicolon immediately after a for or while condition.", "Always dry-run loops with a trace table to catch off-by-one errors and infinite loops.", "Before moving to Chapter 6, ensure you can:", "Write a for loop, a while loop, and a do-while loop from memory.", "Explain the difference between a counter and an accumulator.", "Draw a trace table for a simple loop and predict its final output."],
      selfAssessment: ["The for Loop", "The while Loop", "The do-while Loop"],
      content: `# Chapter 5 — Loops and Repetition

## Why This Matters for DSA

Loops are the engine of algorithmic problem-solving. Almost every Data Structure and Algorithm relies heavily on repetition:

- Traversal: Visiting every element in an Array or Linked List.

- Searching: Checking every item until you find the target (Linear Search).

- Sorting: Repeatedly comparing and swapping elements until the data is ordered (Bubble Sort, Selection Sort).

If you do not deeply understand how a loop initializes, checks its condition, executes its body, and updates its state, you will struggle to understand how algorithms manipulate data. Mastering loops now is non-negotiable for DSA.

## Prerequisite

Chapters 1–4: You must be comfortable with variables, basic arithmetic, and \`if-else\` conditions.

## Start With Intuition

Imagine your teacher asks you to write "I will pay attention in class" 50 times on the blackboard.

You could write a program with 50 \`cout\` statements. But what if the teacher changes their mind and asks for 1,000 lines? You would have to rewrite the entire program.

Instead, you need a mechanism that says: "Start a counter at 1. As long as the counter is less than or equal to 50, write the sentence, then add 1 to the counter."

This mechanism is a loop. It allows you to write a small block of code once and instruct the computer to repeat it as many times as needed, based on a logical condition.

## Core Concept

Every effective loop in programming must have three distinct components to work correctly and eventually stop:

- Initialization: Setting up a starting point (usually a counter variable). This happens once before the loop begins.

- Condition: A boolean expression checked before every single iteration. If it is true, the loop runs. If it is false, the loop stops immediately.

- Update: Changing the state of the counter (e.g., adding 1) at the end of each iteration. This ensures the condition will eventually become false.

If you forget the Update, the condition will never become \`false\`, resulting in an Infinite Loop (the program will run forever or crash).

## Important Terminology

- Iteration: One single execution of the loop's body.

- Loop Body: The block of code (inside { }) that gets repeated.

- Counter: A variable used to keep track of how many times the loop has run (e.g., i, j).

- Accumulator: A variable used to gather a running total or product across iterations (e.g., sum = sum + i).

- Infinite Loop: A loop whose condition never becomes false, causing the program to run endlessly.

- Off-by-One Error: A logical mistake where the loop runs one time too many or one time too few (e.g., using < instead of <=).

## Mental Model

Visualize a \`for\` loop as a Factory Quality Control Checklist:

- [ 1. Start at Item #1 ]  <-- Initialization (happens once)

- |

- v

- [ 2. Are there more items? ] <-- Condition (Checked every time)

- /               \\

- YES                NO (Stop the machine)

- |                  ^

- v                  |

- [ 3. Inspect Item ]  | <-- Loop Body (The actual work)

- |                  |

- [ 4. Move to next ]  | <-- Update (Prepare for the next check)

- |__________________|

## C++ Syntax

### 1. The for Loop

Best used when you know exactly how many times you want to repeat an action.

for (initialization; condition; update) {

// Loop body: Code to repeat

}

### 2. The while Loop

Best used when you want to repeat an action until a condition changes, and you don't know in advance how many times it will take (e.g., reading user input until they type "quit").

initialization;

while (condition) {

// Loop body

update; // MUST be inside the body, or you get an infinite loop!

}

### 3. The do-while Loop

Similar to \`while\`, but it guarantees the loop body runs at least once, because the condition is checked at the end.

initialization;

do {

// Loop body

update;

} while (condition); // Note the semicolon here!

## First Example

Let's write a program that prints the numbers from 1 to 5 using a \`for\` loop.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl << "Loop finished!" << endl;
    return 0;
}


### Line-by-Line Explanation

- int i = 1;: Initialization. Creates a counter variable i and sets it to 1. This happens only once.

- i <= 5;: Condition. Before every iteration, the computer checks: "Is i less than or equal to 5?"

- i++: Update. After the loop body finishes, i is increased by 1.

- cout << i << " ";: Loop Body. Prints the current value of i followed by a space.

- When i becomes 6, the condition 6 <= 5 is false. The loop terminates, and execution jumps to the line after the closing brace }.

## Step-by-Step Execution

- int i = 1 is executed.

- Check condition: 1 <= 5 is true. Enter loop.

- Execute body: Print 1 .

- Execute update: i becomes 2.

- Check condition: 2 <= 5 is true. Enter loop.

- Execute body: Print 2 .

- Execute update: i becomes 3. ... (repeats) ...

- Check condition: 6 <= 5 is false. Exit loop.

- Print "Loop finished!".

## Dry Run
\`\`\`

Dry running loops is the most critical skill you will develop in this chapter. Let's trace a \`while\` loop that calculates the sum of numbers from 1 to 4.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int sum = 0;      // Accumulator
    int i = 1;        // Counter (Initialization)

    while (i <= 4) {  // Condition
        sum = sum + i; // Loop Body (Accumulation)
        i++;           // Update
    }

    cout << "Final sum: " << sum << endl;
    return 0;
}

\`\`\`

Trace Table:

| Iteration | Condition (i <= 4) | sum (before body) | i (before body) | Action in Body (sum = sum + i) | i after Update (i++) |
| --- | --- | --- | --- | --- | --- |
| Start | N/A | 0 | 1 | N/A | N/A |
| 1 | 1 <= 4 (True) | 0 | 1 | sum = 0 + 1 → sum becomes 1 | i becomes 2 |
| 2 | 2 <= 4 (True) | 1 | 2 | sum = 1 + 2 → sum becomes 3 | i becomes 3 |
| 3 | 3 <= 4 (True) | 3 | 3 | sum = 3 + 3 → sum becomes 6 | i becomes 4 |
| 4 | 4 <= 4 (True) | 6 | 4 | sum = 6 + 4 → sum becomes 10 | i becomes 5 |
| 5 | 5 <= 4 (False) | 10 | 5 | Loop terminates. Body does not run. | N/A |

Final Output: \`Final sum: 10\`

## More Examples

Example 1: The Accumulator Pattern (Factorial) Calculating 5! (5 × 4 × 3 × 2 × 1). Notice we multiply instead of add, and start the accumulator at 1 (not 0, because anything multiplied by 0 is 0).

\`\`\`cpp
int n = 5;
int factorial = 1; // Accumulator starts at 1 for multiplication
for (int i = 1; i <= n; i++) {
    factorial = factorial * i;
}
// factorial is now 120

\`\`\`

Example 2: \`do-while\` for Input Validation Forcing the user to enter a positive number.

\`\`\`cpp
int number;
do {
    cout << "Enter a positive number: ";
    cin >> number;
} while (number <= 0); // Repeats AS LONG AS the number is invalid
cout << "You entered: " << number << endl;


## Common Beginner Mistakes

- The Infinite Loop (Forgetting the Update)

- Mistake: int i = 1;

- while (i <= 5) {

- cout << i << endl;

- // Forgot i++;

- }

- Why: i remains 1 forever. 1 <= 5 is always true. The program freezes.

- Fix: Always ensure the update step moves the variable toward making the condition false.

- The Accidental Semicolon

- Mistake: for (int i = 1; i <= 5; i++); { cout << i; }

- Why: The semicolon acts as an empty loop body. The loop runs 5 times doing nothing, then the { cout << i; } runs exactly once after the loop finishes (and i is now out of scope or has an unexpected value).

- Fix: Never put a semicolon immediately after the for or while condition.

- Off-by-One Errors

- Mistake: Wanting to print 1 to 5, but writing for (int i = 1; i < 5; i++).

- Why: The loop stops when i is 5, so it only prints 1, 2, 3, 4.

- Fix: Carefully choose between < and <= based on whether the boundary value should be included.

- Re-declaring the Counter in the Update

- Mistake: for (int i = 1; i <= 5; int i++) or i = i++.

- Fix: The update should just be i++ or i = i + 1.

## Edge Cases

- Loop runs zero times: If the condition is false on the very first check (e.g., for (int i = 10; i <= 5; i++)), the loop body never executes. This is sometimes intentional and correct.

- Loop runs exactly once: If the initial value meets the condition, but the update immediately breaks it.

- Negative steps: A loop can count backward! for (int i = 5; i >= 1; i--) is perfectly valid.

## Guided Practice
\`\`\`

Problem: Write a program that prints all even numbers from 1 to 20.

Understand: We need to iterate through numbers 1 to 20 and only print the even ones. Approach: We can use a \`for\` loop from 1 to 20, and an \`if\` condition inside to check \`i % 2 == 0\`. Alternatively, we can start at 2 and increment by 2 (\`i = i + 2\`). Let's use the second, more efficient approach.

\`\`\`cpp
Click to see the solution #include <iostream>
using namespace std;

int main() {
    // Start at 2, go up to 20, step by 2
    for (int i = 2; i <= 20; i = i + 2) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}


## Independent Practice
\`\`\`

Problem: Write a C++ program that calculates the sum of all odd numbers between 1 and a given number \`N\` (inclusive).

- Declare int N = 10;

- Use a loop to find the sum.

- Print the final sum. (For N=10, the odd numbers are 1, 3, 5, 7, 9. Sum = 25).

## Challenge Problems

Problem: The Fibonacci Sequence. The Fibonacci sequence starts with 0 and 1. Each subsequent number is the sum of the previous two: 0, 1, 1, 2, 3, 5, 8, 13... Task: Write a program that prints the first \`N\` terms of the Fibonacci sequence.

- Declare int N = 7;

- Use variables to keep track of the "previous" and "current" numbers, and update them inside a loop.

Click to see Hint 1 You need three variables: \`a\` (starts at 0), \`b\` (starts at 1), and \`nextTerm\`. Click to see Hint 2 Inside the loop, \`nextTerm = a + b\`. Then, you must shift the values: \`a\` becomes \`b\`, and \`b\` becomes \`nextTerm\`.

## Debugging Practice

The following program is supposed to print the numbers 5, 4, 3, 2, 1. Find the two errors and fix them.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 5; i > 0; i++) {
        cout << i << " ";
    }
    return 0;
}
 Click to see the solution

- Logical Error (Infinite Loop): The loop starts at 5 and the condition is i > 0. But the update is i++ (increasing). i will become 6, 7, 8... forever. It will never be <= 0.

- The Fix: Change the update to decrement: i--.for (int i = 5; i > 0; i--) {

- cout << i << " ";

- }

## Predict the Output
\`\`\`

What will this program print? Trace the nested loops carefully.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 3; j++) {
            cout << i << "," << j << " ";
        }
        cout << endl;
    }
    return 0;
}
 Click to see the solution
\`\`\`

**Output:**

- 1,1 1,2 1,3

- 2,1 2,2 2,3

Explanation: The outer loop (\`i\`) runs twice. For each iteration of \`i\`, the inner loop (\`j\`) runs completely from 1 to 3. The \`cout << endl\` is outside the inner loop, so it only triggers after the inner loop finishes.

## Think Before You Code

Problem: You are given an integer \`N\`. You need to count how many numbers between 1 and \`N\` are divisible by 3. Task: Before writing C++ code, write the Pseudocode for this. Identify your counter, your condition, and your accumulator (the variable that will hold the final count).

## Self-Check

- What are the three components of a for loop, and in what order do they execute?

- What is the difference between a while loop and a do-while loop?

- If a loop is running infinitely, which of the three components is most likely missing or incorrect?

- What is an "off-by-one" error, and how do you prevent it?

## Mastery Test

Task: Write a complete C++ program that acts as a "Digit Counter".

- Take an integer input from the user (e.g., 4502). Assume the input is greater than 0.

- Use a while loop to count how many digits are in the number.

- Print the final count.

(Hint: Recall from Chapter 3 how \`/ 10\` removes the last digit of a number. Use this as your loop's update step, and loop as long as the number is greater than 0).

## DSA Connection

Nested loops (a loop inside a loop) are the foundation of $O(n^2)$ time complexity, which you will learn about in Chapter 16. Algorithms like Bubble Sort use an outer loop to make multiple passes through an array, and an inner loop to compare adjacent elements. Understanding exactly how the inner loop resets and runs to completion for every single step of the outer loop is critical for analyzing and writing efficient algorithms.`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 - CPP For DSA", title: "Chapter 1 — Thinking Like a Programmer", subtitle: "Part of Part 1 - CPP For DSA · Beginner", order: 0, tutorialSlug: "chapter-1-thinking-like-a-programmer" },
  { part: "Part 1 - CPP For DSA", title: "Chapter 2 — Your First C++ Programs", subtitle: "Part of Part 1 - CPP For DSA · Beginner", order: 1, tutorialSlug: "chapter-2-your-first-c-programs" },
  { part: "Part 1 - CPP For DSA", title: "Chapter 3 — Variables, Data, and Basic Operations", subtitle: "Part of Part 1 - CPP For DSA · Beginner", order: 2, tutorialSlug: "chapter-3-variables-data-and-basic-operations" },
  { part: "Part 1 - CPP For DSA", title: "Chapter 4 — Conditions and Decision Making", subtitle: "Part of Part 1 - CPP For DSA · Beginner", order: 3, tutorialSlug: "chapter-4-conditions-and-decision-making" },
  { part: "Part 1 - CPP For DSA", title: "Chapter 5 — Loops and Repetition", subtitle: "Part of Part 1 - CPP For DSA · Beginner", order: 4, tutorialSlug: "chapter-5-loops-and-repetition" },
]

async function main() {
  const domain = await db.domain.findUnique({ where: { slug: "computer-science" } })
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
    where: { slug: "cpp-for-dsa-path" },
    create: { slug: "cpp-for-dsa-path", title: "CPP For DSA Roadmap", tagline: "The complete roadmap for CPP For DSA - all chapters in order.", description: "Follow the course exactly as written: programming thinking, first C++ programs, variables, conditions, and loops. Each step is one chapter of the CPP For DSA subject.", icon: "Code2", color: "oklch(0.65 0.18 250)", difficulty: 'beginner', estimatedHours: 8, published: true },
    update: { title: "CPP For DSA Roadmap", tagline: "The complete roadmap for CPP For DSA - all chapters in order.", description: "Follow the course exactly as written: programming thinking, first C++ programs, variables, conditions, and loops. Each step is one chapter of the CPP For DSA subject.", icon: "Code2", color: "oklch(0.65 0.18 250)", difficulty: 'beginner', estimatedHours: 8 },
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
