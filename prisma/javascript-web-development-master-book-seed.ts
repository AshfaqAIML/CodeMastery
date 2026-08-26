import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

// ============================================================
// JavaScript for Web Development Master Book - imported by scripts/import-course/pipeline.py
// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.
// ============================================================

const subject = {
  slug: "javascript-web-development-master-book",
  name: "JavaScript for Web Development Master Book",
  tagline: "The complete JavaScript web development master book.",
  description: "Learn JavaScript for frontend development, DOM work, browser logic and modern web projects.",
  icon: "Globe",
  color: "oklch(0.68 0.17 240)",
  category: "Web",
  order: 74,
  modules: [
    {
      slug: "part-1",
      title: "Part 1 — Chapters 1–12",
      summary: "Chapters 1 to 12 of JavaScript for Web Development Master Book.",
      order: 1,
      difficulty: "intermediate",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-1-introduction-to-javascript",
      title: "INTRODUCTION TO JAVASCRIPT",
      summary: "JavaScript is a high-level, interpreted programming language used to make web pages interactive and dynamic. It allows developers to control behavior on a webpage, respond to user actions, update content without reloading the page, and communicate with…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 0,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# INTRODUCTION TO JAVASCRIPT

## What is JavaScript

JavaScript is a high-level, interpreted programming language used to make web pages interactive and dynamic. It allows developers to control behavior on a webpage, respond to user actions, update content without reloading the page, and communicate with servers.

### In web development, three core technologies work together:

- HTML → Structure of the webpage

- CSS → Styling and layout

- JavaScript → Behavior and logic

### Example:

\`\`\`js
<!DOCTYPE html><html><head> <title>JavaScript Example</title></head><body><button onclick="showMessage()">Click Me</button><script>function showMessage() { alert("Welcome to JavaScript!");}</script></body></html>
\`\`\`

### Explanation:

A button is created using HTML. When the button is clicked, JavaScript executes the function showMessage(), which displays a popup message.

### Output:

### A popup alert appears with the text "Welcome to JavaScript!"

## Why JavaScript is Important

### JavaScript is essential for modern web development because:

- It enables interactivity (buttons, forms, animations)

- It allows real-time updates without reloading the page

- It communicates with servers using APIs

- It is supported by all modern browsers

- It is used in frontend and backend development (Node.js)

### Real-world examples:

- Form validation before submission

- Live search suggestions

- Interactive dashboards

- Online games

- Chat applications

## History and Evolution of JavaScript

- Created in 1995 by Brendan Eich at Netscape

- Initially named Mocha, then LiveScript, finally JavaScript

- Designed for quick scripting inside browsers

- Standardized as ECMAScript (ES)

### Important versions:

- ES3 (1999): Stable version

- ES5 (2009): Introduced strict mode, JSON support

- ES6 (2015): Major upgrade

- let and const

- Arrow functions

- Classes

- Modules

- ES7 and later: Continuous improvements

## How JavaScript Works in the Browser

### When a webpage loads, the browser performs the following steps:

- Loads HTML

- Parses HTML and builds DOM (Document Object Model)

- Loads CSS and applies styles

- Executes JavaScript

- Updates DOM dynamically

JavaScript interacts with the DOM to change content and structure.

### Example:

\`\`\`html
<p id="demo">Hello</p><script>document.getElementById("demo").innerText = "Hello, World!";</script>
\`\`\`

### Explanation:

JavaScript selects the paragraph using its ID and changes the text.

### Output:

### The text changes from "Hello" to "Hello, World!"

## JavaScript Engine

A JavaScript engine is a program that executes JavaScript code.

### Examples:

- Chrome → V8 Engine

- Firefox → SpiderMonkey

- Safari → JavaScriptCore

### Working:

- Reads JavaScript code

- Converts it into machine code

- Executes it line by line

## Ways to Use JavaScript in HTML

### Inline JavaScript

\`\`\`html
<button onclick="alert('Hello')">Click</button>
\`\`\`

Used directly inside HTML tags. Not recommended for large applications.

### Internal JavaScript

\`\`\`html
<script>console.log("Hello from internal JS");</script>
\`\`\`

Written inside <script> tag in HTML file.

### External JavaScript

\`\`\`html
<script src="script.js"></script>
\`\`\`

### script.js:

\`\`\`js
console.log("Hello from external JS");
\`\`\`

Best practice for real projects because it separates code from HTML.

## JavaScript Output Methods

### JavaScript provides different ways to display output:

### alert()

\`\`\`js
alert("Hello");
\`\`\`

Shows a popup message.

\`\`\`js
console.log()
\`\`\`

\`\`\`js
console.log("Debug message");
\`\`\`

Used for debugging in browser console.

### document.write()

\`\`\`js
document.write("Hello");
\`\`\`

Writes directly to webpage (not recommended in modern development).

### innerHTML / innerText

\`\`\`js
document.getElementById("demo").innerHTML = "New Content";
\`\`\`

Updates webpage content dynamically.

## JavaScript Syntax Basics

- Case-sensitive language

- Statements end with semicolon (optional but recommended)

- Code blocks use curly braces {}

### Example:

\`\`\`js
var name = "John";console.log(name);
\`\`\`

## Comments in JavaScript

Used to explain code or disable execution.

### Single-line:

\`\`\`js
// This is a comment
\`\`\`

### Multi-line:

### /* This is a multi-line comment */

## Key Features of JavaScript

- Interpreted language

- Dynamic typing

- Event-driven

- Object-oriented

- Functional programming support

- Platform independent

## Real-World Example: Form Interaction

\`\`\`html
<input type="text" id="name" placeholder="Enter name"><button onclick="displayName()">Submit</button><p id="result"></p><script>function displayName() { let name = document.getElementById("name").value; document.getElementById("result").innerText = "Hello " + name;}</script>
\`\`\`

### Explanation:

User enters a name. When button is clicked, JavaScript reads input value and displays greeting.

### Output:

### If user enters "Ali", output becomes "Hello Ali"

## Common Mistakes

- Confusing JavaScript with Java

They are completely different languages.

- Forgetting to include script tag

Code will not run without <script>.

- Using document.write in modern apps

It can overwrite entire page content.

- Not checking console for errors

Use DevTools → Console for debugging.

- Incorrect element selection

If ID or selector is wrong, code fails.

## Interview Questions

- What is JavaScript and where is it used?

- Explain difference between JavaScript and Java.

- What happens when a browser loads a webpage?

- What is DOM?

- What is a JavaScript engine?

- Difference between inline, internal, and external JavaScript?

- Why is JavaScript called dynamic language?

## Practice Exercises

- Write a JavaScript program to show an alert message "Hello World".

- Create a button that changes text of a paragraph when clicked.

- Write code to print your name in console.

- Create an input field and display entered value on screen.

- Add a button that shows current date and time using JavaScript.

## Mini Practice Task

### Create a webpage with:

- One input field

- One button

- One paragraph

### When user clicks button, display:

### "Welcome, [username]"`,
    },
    {
      slug: "chapter-2-setting-up-environment",
      title: "SETTING UP ENVIRONMENT",
      summary: "Before writing JavaScript programs, a proper development environment is required. This includes tools to write code, run code, and debug errors efficiently. This chapter covers: Browser DevTools Setting up Visual Studio Code Project structure Running…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 1,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# SETTING UP ENVIRONMENT

## Introduction

Before writing JavaScript programs, a proper development environment is required. This includes tools to write code, run code, and debug errors efficiently.

This chapter covers:

Browser DevTools

Setting up Visual Studio Code

Project structure

Running JavaScript code

Introduction to Node.js

## Browser Developer Tools (DevTools)

Every modern browser provides built-in tools to write, test, and debug JavaScript.

### How to Open DevTools

- Press F12

- Right-click → Inspect

- Ctrl + Shift + I

## Important DevTools Tabs

### Console

Used to run JavaScript and debug code.

### Example:

\`\`\`js
console.log("Hello from Console");
\`\`\`

### Output:

Message appears inside the console.

### Use cases:

- Debugging

- Testing small code snippets

- Checking errors

### Elements

- Shows HTML structure (DOM)

- Allows editing elements live

### Example:

Change text directly and see updates instantly.

### Network

- Shows API calls and resources

- Useful for debugging fetch/API requests

### Sources

- Debug JavaScript files

- Add breakpoints

## Writing JavaScript in Browser Console

You can directly write JavaScript in console without creating files.

### Example:

\`\`\`js
let a = 5;let b = 10;console.log(a + b);
\`\`\`

### Output:

### 15

## Setting Up Visual Studio Code (VS Code)

VS Code is a lightweight and powerful code editor widely used for JavaScript development.

### Installation Steps

- Download from official website

- Install and open

- Create a folder for your project

## Recommended Extensions

### Live Server

- Runs HTML files in browser

- Automatically reloads when file changes

### Prettier

- Formats code automatically

- Improves readability

### JavaScript (ES6) Snippets

- Provides shortcuts for writing code

## Project Folder Structure

### Example:

### project/│├── index.html├── script.js└── style.css

## Connecting JavaScript File

### Inside HTML:

\`\`\`html
<script src="script.js"></script>
\`\`\`

### Best practice:

- Place script before closing </body> tag

## Writing First JavaScript File

### script.js:

\`\`\`js
console.log("JavaScript is working");
\`\`\`

## Running JavaScript in Browser

### Steps:

- Open index.html

- Right-click → Open with Live Server

- Open DevTools → Console

- See output

## Example: Full Setup

### index.html

<!DOCTYPE html><html><head> <title>Setup Test</title></head><body><h1 id="heading">Hello</h1><script src="script.js"></script></body></html>

### script.js

\`\`\`js
document.getElementById("heading").innerText = "Environment Ready";
\`\`\`

### Explanation:

JavaScript changes text inside <h1> element.

### Output:

### "Hello" becomes "Environment Ready"

## Introduction to Node.js

Node.js allows running JavaScript outside the browser.

### Why Node.js

- Run backend applications

- Execute JavaScript on server

- Build APIs

### Install Node.js

- Download and install

- Open terminal

- Check version:

### node -v

### Running JavaScript using Node

### Create file:

\`\`\`js
console.log("Running with Node.js");
\`\`\`

### Run in terminal:

### node script.js

### Output:

### Running with Node.js

## Differences: Browser vs Node.js

## Common Mistakes

- Not linking JavaScript file correctly

### Incorrect path causes code not to run

- Placing script in wrong position

### If placed before HTML loads, elements may not exist

- Forgetting to open console

### No visibility of output/errors

- Not saving file before running

### Changes will not reflect

- Mixing Node and browser code

### Some features work only in browser (DOM)

## Interview Questions

- What is DevTools and why is it used?

- What is console.log()?

- How do you link JavaScript to HTML?

- What is Live Server?

- What is Node.js?

- Difference between Node.js and browser JavaScript?

- Why is script placed at bottom of HTML?

## Practice Exercises

- Open DevTools and print "Hello World" in console

- Create a project folder with:

- index.html

- script.js

- Link script.js and print a message

- Change text of a heading using JavaScript

- Install Node.js and run a simple JavaScript file

## Mini Practice Task

### Create a webpage:

- One heading

- One button

### When button is clicked:

- Change heading text to "Setup Complete"`,
    },
    {
      slug: "chapter-3-variables-and-data-types",
      title: "VARIABLES AND DATA TYPES",
      summary: "Variables are used to store data in a program. Data types define what kind of data is stored in a variable. Understanding variables and data types is essential because every JavaScript program depends on storing and manipulating data.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 2,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# VARIABLES AND DATA TYPES

## Introduction

Variables are used to store data in a program. Data types define what kind of data is stored in a variable. Understanding variables and data types is essential because every JavaScript program depends on storing and manipulating data.

## What is a Variable

A variable is a container used to store values. These values can be numbers, text, true/false values, or more complex structures.

### Example:

\`\`\`js
let name = "Ali";console.log(name);
\`\`\`

### Explanation:

A variable named name stores the string "Ali" and is printed in the console.

### Output:

### Ali

## Declaring Variables

### JavaScript provides three ways to declare variables:

- var

- let

- const

## var

\`\`\`js
var age = 25;console.log(age);
\`\`\`

### Features of var:

- Function scoped

- Can be redeclared

- Can be updated

- Hoisted (initialized with undefined)

### Example:

\`\`\`js
var x = 10;var x = 20;console.log(x);
\`\`\`

### Output:

### 20

## let

\`\`\`js
let city = "Delhi";console.log(city);
\`\`\`

### Features of let:

- Block scoped

- Cannot be redeclared in same scope

- Can be updated

### Example:

\`\`\`js
let x = 10;x = 15;console.log(x);
\`\`\`

### Output:

### 15

## const

\`\`\`js
const pi = 3.14;console.log(pi);
\`\`\`

### Features of const:

- Block scoped

- Cannot be redeclared

- Cannot be updated

- Must be initialized at declaration

### Example:

\`\`\`js
const a = 10;// a = 20; // Error
\`\`\`

## Difference Between var, let, const

## Naming Rules for Variables

- Must start with letter, _ or $

- Cannot start with number

- No spaces allowed

- Case-sensitive

### Valid:

\`\`\`js
let userName = "Ali";let _value = 10;
\`\`\`

### Invalid:

\`\`\`js
// let 1name = "Ali";// let user name = "Ali";
\`\`\`

## Data Types in JavaScript

### JavaScript has two main categories:

- Primitive Data Types

- Non-Primitive Data Types

## Primitive Data Types

### Number

Represents numeric values.

\`\`\`js
let num = 100;console.log(num);
\`\`\`

### Output:

### 100

### String

Represents text.

\`\`\`js
let message = "Hello";console.log(message);
\`\`\`

### Output:

### Hello

### Boolean

Represents true or false.

\`\`\`js
let isLoggedIn = true;console.log(isLoggedIn);
\`\`\`

### Output:

### true

### Undefined

A variable declared but not assigned value.

\`\`\`js
let x;console.log(x);
\`\`\`

### Output:

### undefined

### Null

Represents intentional empty value.

\`\`\`js
let data = null;console.log(data);
\`\`\`

### Output:

### null

### Symbol (Basic Idea)

Used for unique identifiers.

\`\`\`js
let id = Symbol("id");
\`\`\`

## Non-Primitive Data Types

### Object

Collection of key-value pairs.

\`\`\`js
let person = { name: "Ali", age: 25};console.log(person.name);
\`\`\`

### Output:

### Ali

### Array

Stores multiple values.

\`\`\`js
let fruits = ["Apple", "Banana", "Mango"];console.log(fruits[1]);
\`\`\`

### Output:

### Banana

## Dynamic Typing

JavaScript is dynamically typed, meaning variable type can change.

\`\`\`js
let value = 10;value = "Hello";console.log(value);
\`\`\`

### Output:

### Hello

## typeof Operator

Used to check data type.

\`\`\`js
let x = 10;console.log(typeof x);
\`\`\`

### Output:

### number

### Examples:

\`\`\`js
console.log(typeof "Hello"); // stringconsole.log(typeof true); // booleanconsole.log(typeof null); // object (special case)
\`\`\`

## Type Conversion

### Implicit Conversion

\`\`\`js
let result = "5" + 2;console.log(result);
\`\`\`

### Output:

### "52"

### Explicit Conversion

\`\`\`js
let num = Number("10");console.log(num);
\`\`\`

### Output:

### 10

## Real-World Example

\`\`\`js
let price = 100;let quantity = 2;let total = price * quantity;console.log("Total:", total);
\`\`\`

### Output:

### Total: 200

## Common Mistakes

- Using var instead of let/const

### Leads to scope issues

- Reassigning const variables

### Causes error

- Confusing null and undefined

### They represent different meanings

- Incorrect type checking

### typeof null returns "object"

- Not initializing variables

### May lead to undefined errors

## Interview Questions

- What is a variable in JavaScript?

- Difference between var, let, const?

- What are primitive data types?

- What is dynamic typing?

- Difference between null and undefined?

- What is typeof operator?

- Can const variables change?

## Practice Exercises

- Declare variables using var, let, and const

- Store your name, age, and isStudent in variables

- Create an object with your details

- Create an array of 5 numbers

- Use typeof to check data types

## Mini Practice Task

### Create a program:

- Store product name, price, and quantity

- Calculate total price

- Print result in console`,
    },
    {
      slug: "chapter-4-operators-and-expressions",
      title: "OPERATORS AND EXPRESSIONS",
      summary: "Operators are symbols used to perform operations on values and variables. Expressions are combinations of values, variables, and operators that produce a result. Example: Explanation: 10 + 5 is an expression. + is an operator. Output: 15",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 3,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# OPERATORS AND EXPRESSIONS

## Introduction

Operators are symbols used to perform operations on values and variables.

Expressions are combinations of values, variables, and operators that produce a result.

Example:

\`\`\`js
let result = 10 + 5;
\`\`\`

Explanation:

10 + 5 is an expression. + is an operator.

Output:

15

## Types of Operators in JavaScript

- Arithmetic Operators

- Assignment Operators

- Comparison Operators

- Logical Operators

- Unary Operators

- Ternary Operator

## Arithmetic Operators

Used for mathematical calculations.

### Examples

\`\`\`js
let a = 10;let b = 3;console.log(a + b); // 13console.log(a - b); // 7console.log(a * b); // 30console.log(a / b); // 3.33console.log(a % b); // 1console.log(a ** 2); // 100
\`\`\`

## Assignment Operators

Used to assign values to variables.

### Example

\`\`\`js
let x = 10;x += 5;console.log(x); // 15x *= 2;console.log(x); // 30
\`\`\`

## Comparison Operators

Used to compare values. Returns true or false.

### Example

\`\`\`js
console.log(5 == "5"); // trueconsole.log(5 === "5"); // falseconsole.log(10 > 5); // trueconsole.log(3 <= 2); // false
\`\`\`

### Explanation:

== compares value only, while === compares value and type.

## Logical Operators

Used to combine conditions.

### Example

\`\`\`js
let age = 20;console.log(age > 18 && age < 30); // trueconsole.log(age < 18 || age > 25); // falseconsole.log(!(age > 18)); // false
\`\`\`

## Unary Operators

Operate on a single operand.

### Example

\`\`\`js
let x = 5;x++;console.log(x); // 6x--;console.log(x); // 5
\`\`\`

## Increment Types

### Post Increment

\`\`\`js
let x = 5;console.log(x++); // 5console.log(x); // 6
\`\`\`

### Pre Increment

\`\`\`js
let x = 5;console.log(++x); // 6
\`\`\`

## Ternary Operator

Short form of if-else.

### Syntax:

\`\`\`js
condition ? value1 : value2;
\`\`\`

### Example

\`\`\`js
let age = 18;let result = (age >= 18) ? "Adult" : "Minor";console.log(result);
\`\`\`

### Output:

### Adult

## Operator Precedence

Operators are executed based on priority.

### Example:

\`\`\`js
let result = 10 + 5 * 2;console.log(result);
\`\`\`

### Output:

### 20

### Explanation:

Multiplication happens before addition.

### Use brackets to control order:

\`\`\`js
let result = (10 + 5) * 2;console.log(result);
\`\`\`

### Output:

### 30

## Expressions in JavaScript

An expression is any valid combination that produces a value.

### Examples:

### + 10x * ytrue && false

## Real-World Example

\`\`\`js
let price = 200;let discount = 10;let finalPrice = price - (price * discount / 100);console.log(finalPrice);
\`\`\`

### Output:

### 180

## Common Mistakes

- Using == instead of ===

### May cause unexpected results

- Forgetting operator precedence

### Leads to wrong calculations

- Misusing increment operators

### Confusing pre and post increment

- Using assignment (=) instead of comparison (== or ===)

- Ignoring type conversion in expressions

## Interview Questions

- What is an operator?

- Difference between == and ===?

- What is operator precedence?

- What are logical operators?

- Explain ternary operator.

- Difference between pre and post increment?

## Practice Exercises

- Perform all arithmetic operations on two numbers

- Use assignment operators and update values

- Compare two numbers using different operators

- Write a program using logical operators

- Convert if-else into ternary operator

## Mini Practice Task

### Create a program:

- Take marks as input

- If marks >= 50 → "Pass"

- Else → "Fail"

- Use ternary operator

Now write Chapter 5: Control Flow in full detail following the same rules.`,
    },
    {
      slug: "chapter-5-control-flow",
      title: "CONTROL FLOW",
      summary: "Control flow determines how a program executes step by step. It allows decision-making and repetition of tasks based on conditions. Without control flow, a program runs line by line without any logic or flexibility. Main types: Conditional statements…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 4,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# CONTROL FLOW

## Introduction

Control flow determines how a program executes step by step. It allows decision-making and repetition of tasks based on conditions.

Without control flow, a program runs line by line without any logic or flexibility.

Main types:

Conditional statements (decision making)

Loops (repetition)

## Conditional Statements

Conditional statements allow the program to make decisions.

## if Statement

Executes code only if condition is true.

### Syntax:

\`\`\`js
if (condition) { // code}
\`\`\`

### Example:

\`\`\`js
let age = 20;if (age >= 18) { console.log("Eligible to vote");}
\`\`\`

### Output:

### Eligible to vote

## if-else Statement

Executes one block if condition is true, otherwise another block.

\`\`\`js
let age = 16;if (age >= 18) { console.log("Adult");} else { console.log("Minor");}
\`\`\`

### Output:

### Minor

## else-if Ladder

Used when multiple conditions are checked.

\`\`\`js
let marks = 75;if (marks >= 90) { console.log("A Grade");} else if (marks >= 60) { console.log("B Grade");} else if (marks >= 40) { console.log("C Grade");} else { console.log("Fail");}
\`\`\`

### Output:

### B Grade

## Nested if

An if inside another if.

\`\`\`js
let age = 25;let hasID = true;if (age >= 18) { if (hasID) { console.log("Allowed"); }}
\`\`\`

### Output:

### Allowed

## switch Statement

Used when multiple conditions depend on a single value.

### Syntax:

\`\`\`js
switch (value) { case x: // code break; default: // code}
\`\`\`

### Example:

\`\`\`js
let day = 2;switch (day) { case 1: console.log("Monday"); break; case 2: console.log("Tuesday"); break; case 3: console.log("Wednesday"); break; default: console.log("Invalid");}
\`\`\`

### Output:

### Tuesday

## Important Notes on switch

- break stops execution

- Without break, all cases below will run

- default runs if no case matches

## Loops

Loops are used to repeat code multiple times.

## for Loop

Used when number of iterations is known.

### Syntax:

\`\`\`js
for (initialization; condition; update) { // code}
\`\`\`

### Example:

\`\`\`js
for (let i = 1; i <= 5; i++) { console.log(i);}
\`\`\`

### Output:

### 2 3 4 5

## while Loop

Runs while condition is true.

\`\`\`js
let i = 1;while (i <= 5) { console.log(i); i++;}
\`\`\`

### Output:

### 2 3 4 5

## do-while Loop

Runs at least once, even if condition is false.

\`\`\`js
let i = 1;do { console.log(i); i++;} while (i <= 5);
\`\`\`

### Output:

### 2 3 4 5

## break Statement

Stops loop immediately.

\`\`\`js
for (let i = 1; i <= 5; i++) { if (i === 3) { break; } console.log(i);}
\`\`\`

### Output:

### 2

## continue Statement

Skips current iteration.

\`\`\`js
for (let i = 1; i <= 5; i++) { if (i === 3) { continue; } console.log(i);}
\`\`\`

### Output:

### 2 4 5

## Real-World Example

### Example: Login Check

\`\`\`js
let username = "admin";let password = "1234";if (username === "admin" && password === "1234") { console.log("Login successful");} else { console.log("Invalid credentials");}
\`\`\`

### Output:

### Login successful

### Example: Sum of Numbers

\`\`\`js
let sum = 0;for (let i = 1; i <= 5; i++) { sum += i;}console.log(sum);
\`\`\`

### Output:

### 15

## Common Mistakes

- Using = instead of == or ===

### Leads to incorrect conditions

- Infinite loops

### Forgetting update condition

- Missing break in switch

### Causes unexpected outputs

- Wrong loop condition

### Loop may not run or run infinitely

- Confusing while and do-while

## Interview Questions

- What is control flow?

- Difference between if and switch?

- Difference between for and while loop?

- What is infinite loop?

- What is break and continue?

- When do you use do-while loop?

## Practice Exercises

- Check if a number is positive or negative

- Print numbers from 1 to 10 using loop

- Find sum of first 10 numbers

- Print even numbers between 1 to 20

- Create a simple calculator using switch

## Mini Practice Task

### Create a program:

- Take a number

- If number is divisible by 2 → "Even"

- Else → "Odd"

## Challenge Task

### Create a menu-driven program using switch:

- Add

- Subtract

- Multiply

- Exit`,
    },
    {
      slug: "chapter-6-functions-in-depth",
      title: "FUNCTIONS IN DEPTH",
      summary: "Functions are reusable blocks of code that perform a specific task. Instead of writing the same code multiple times, functions allow you to define it once and reuse it whenever needed. Functions help in: Code reusability Better organization Easier debugging…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 5,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# FUNCTIONS IN DEPTH

## Introduction

Functions are reusable blocks of code that perform a specific task. Instead of writing the same code multiple times, functions allow you to define it once and reuse it whenever needed.

Functions help in:

Code reusability

Better organization

Easier debugging

Modular programming

## What is a Function

A function is a block of code that runs when it is called.

### Example:

\`\`\`js
function greet() { console.log("Hello");}greet();
\`\`\`

### Explanation:

The function greet() is defined and then called.

### Output:

### Hello

## Function Declaration

A function defined using the function keyword.

\`\`\`js
function add(a, b) { return a + b;}console.log(add(5, 3));
\`\`\`

### Output:

### 8

## Function Expression

A function stored inside a variable.

\`\`\`js
let multiply = function(a, b) { return a * b;};console.log(multiply(4, 3));
\`\`\`

### Output:

### 12

## Difference: Declaration vs Expression

## Arrow Functions

Short syntax introduced in ES6.

\`\`\`js
let subtract = (a, b) => { return a - b;};console.log(subtract(10, 4));
\`\`\`

### Output:

### 6

### Short Arrow Function

\`\`\`js
let square = x => x * x;console.log(square(5));
\`\`\`

### Output:

### 25

## Parameters and Arguments

- Parameters → variables in function definition

- Arguments → values passed during function call

### Example:

\`\`\`js
function greet(name) { console.log("Hello " + name);}greet("Ali");
\`\`\`

### Output:

### Hello Ali

## Default Parameters

Used when no value is passed.

\`\`\`js
function greet(name = "Guest") { console.log("Hello " + name);}greet();
\`\`\`

### Output:

### Hello Guest

## Return Values

Functions can return results using return.

\`\`\`js
function sum(a, b) { return a + b;}let result = sum(3, 7);console.log(result);
\`\`\`

### Output:

### 10

## Function Without Return

\`\`\`js
function display() { console.log("No return value");}display();
\`\`\`

### Output:

### No return value

## Pure vs Impure Functions

### Pure Function

- Same input → same output

- No side effects

\`\`\`js
function add(a, b) { return a + b;}
\`\`\`

### Impure Function

- Depends on external data

\`\`\`js
let total = 0;function addToTotal(x) { total += x;}
\`\`\`

## Callback Functions

A function passed as an argument to another function.

\`\`\`js
function greet(name, callback) { console.log("Hello " + name); callback();}function sayBye() { console.log("Goodbye");}greet("Ali", sayBye);
\`\`\`

### Output:

### Hello Ali

### Goodbye

## Anonymous Functions

Functions without a name.

\`\`\`js
setTimeout(function() { console.log("Hello after 2 seconds");}, 2000);
\`\`\`

## Immediately Invoked Function Expression (IIFE)

Function that runs immediately.

\`\`\`js
(function() { console.log("IIFE executed");})();
\`\`\`

### Output:

### IIFE executed

## Real-World Example

### Example: Discount Calculator

\`\`\`js
function calculateDiscount(price, discount) { return price - (price * discount / 100);}let finalPrice = calculateDiscount(1000, 10);console.log(finalPrice);
\`\`\`

### Output:

### 900

## Common Mistakes

- Forgetting return statement

### Function returns undefined

- Confusing parameters and arguments

- Not calling function after defining

- Using arrow functions incorrectly with multiple lines

- Overwriting function names

## Interview Questions

- What is a function in JavaScript?

- Difference between function declaration and expression?

- What are arrow functions?

- What is a callback function?

- What is a pure function?

- What is IIFE?

- What happens if function has no return?

## Practice Exercises

- Write a function to add two numbers

- Write a function to check even/odd

- Create a function with default parameter

- Convert normal function into arrow function

- Write a callback function example

## Mini Practice Task

### Create a function:

- Input: marks

- Output: grade

- = 90 → A

- = 60 → B

- else → Fail

## Challenge Task

### Create a calculator using functions:

- add()

- subtract()

- multiply()

- divide()

Call functions based on user input.`,
    },
    {
      slug: "chapter-7-scope-and-closures",
      title: "SCOPE AND CLOSURES",
      summary: "Scope determines where variables are accessible in a program. Closures allow functions to remember variables from their outer scope even after that scope has finished execution. Understanding scope and closures is important for writing predictable, bug-free,…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 6,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# SCOPE AND CLOSURES

## Introduction

Scope determines where variables are accessible in a program. Closures allow functions to remember variables from their outer scope even after that scope has finished execution.

Understanding scope and closures is important for writing predictable, bug-free, and optimized JavaScript code.

## What is Scope

Scope defines the visibility and accessibility of variables.

### Types of scope in JavaScript:

- Global Scope

- Function Scope

- Block Scope

## Global Scope

A variable declared outside any function or block is in global scope. It can be accessed anywhere in the program.

\`\`\`js
let name = "Ali";function greet() { console.log(name);}greet();
\`\`\`

### Output:

### Ali

## Function Scope

Variables declared inside a function are accessible only within that function.

\`\`\`js
function test() { let x = 10; console.log(x);}test();// console.log(x); // Error
\`\`\`

### Explanation:

x cannot be accessed outside the function.

## Block Scope

\`\`\`js
Variables declared with let and const inside a block {} are accessible only within that block.
\`\`\`

\`\`\`js
if (true) { let x = 5; console.log(x);}// console.log(x); // Error
\`\`\`

## var vs let (Scope Difference)

\`\`\`js
if (true) { var a = 10; let b = 20;}console.log(a); // Works// console.log(b); // Error
\`\`\`

### Explanation:

\`\`\`js
var is function-scoped, let is block-scoped.
\`\`\`

## Lexical Scope

Lexical scope means inner functions can access variables from their outer (parent) functions.

\`\`\`js
function outer() { let x = 10; function inner() { console.log(x); } inner();}outer();
\`\`\`

### Output:

### 10

## Scope Chain

JavaScript searches for variables from inner scope to outer scope.

\`\`\`js
let a = 1;function outer() { let b = 2; function inner() { let c = 3; console.log(a, b, c); } inner();}outer();
\`\`\`

### Output:

### 2 3

## What is Closure

A closure is created when a function remembers variables from its outer scope even after the outer function has finished execution.

## Closure Example

\`\`\`js
function outer() { let count = 0; return function inner() { count++; console.log(count); };}let counter = outer();counter();counter();counter();
\`\`\`

### Output:

### 1

### 2

### 3

### Explanation:

The inner function remembers count even after outer() has finished.

## Another Closure Example

\`\`\`js
function greet(name) { return function() { console.log("Hello " + name); };}let sayHello = greet("Ali");sayHello();
\`\`\`

### Output:

### Hello Ali

## Real-World Use of Closures

### Example: Private Variable

\`\`\`js
function createCounter() { let count = 0; return { increment: function() { count++; console.log(count); }, decrement: function() { count--; console.log(count); } };}let counter = createCounter();counter.increment();counter.increment();counter.decrement();
\`\`\`

### Output:

### 1

### 2

### 1

### Explanation:

count is protected and cannot be accessed directly.

## Closures in Event Handling

\`\`\`js
function setupButton() { let message = "Button clicked"; document.getElementById("btn").onclick = function() { console.log(message); };}
\`\`\`

### Explanation:

The function remembers message even after setup is done.

## Advantages of Closures

- Data privacy

- Persistent state

- Useful in callbacks and event handling

- Used in functional programming

## Common Mistakes

- Confusing scope with lifetime

### Scope defines access, not how long variable lives

- Using var inside loops

### Can cause unexpected behavior

- Forgetting closures capture reference, not value

- Overusing global variables

- Not understanding lexical scope

## Interview Questions

- What is scope in JavaScript?

- Difference between global and local scope?

- What is block scope?

- What is lexical scope?

- What is closure?

- Why are closures useful?

- Give real-world example of closure

## Practice Exercises

- Create a function with local variable and try accessing outside

- Demonstrate block scope using let

- Write a nested function example

- Create a closure that counts number of calls

- Create a function that returns greeting using closure

## Mini Practice Task

### Create a function:

- It returns another function

- The inner function increments a counter

- Each call prints updated value

## Challenge Task

### Create a bank account system using closure:

- Private balance

- deposit() function

- withdraw() function

- balance should not be directly accessible`,
    },
    {
      slug: "chapter-8-hoisting",
      title: "HOISTING",
      summary: "Hoisting is JavaScript’s default behavior of moving variable and function declarations to the top of their scope before code execution. This does not mean the code physically moves. The JavaScript engine processes declarations first during the creation phase,…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 7,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# HOISTING

## Introduction

Hoisting is JavaScript’s default behavior of moving variable and function declarations to the top of their scope before code execution.

This does not mean the code physically moves. The JavaScript engine processes declarations first during the creation phase, then executes code line by line.

Understanding hoisting helps avoid unexpected bugs and errors.

## How JavaScript Executes Code

### JavaScript runs in two phases:

- Creation Phase

- Memory is allocated

- Variables are declared

- Functions are stored

- Execution Phase

- Code runs line by line

- Values are assigned

## Hoisting with var

Variables declared with var are hoisted and initialized with undefined.

\`\`\`js
console.log(x);var x = 10;
\`\`\`

### Output:

### undefined

### Explanation:

### JavaScript treats it as:

\`\`\`js
var x;console.log(x);x = 10;
\`\`\`

## Hoisting with let

Variables declared with let are hoisted but not initialized.

\`\`\`js
console.log(x);let x = 10;
\`\`\`

### Output:

### Error

### Explanation:

The variable exists but cannot be accessed before initialization.

## Hoisting with const

Same behavior as let.

\`\`\`js
console.log(a);const a = 5;
\`\`\`

### Output:

### Error

## Temporal Dead Zone (TDZ)

The time between variable declaration and initialization is called Temporal Dead Zone.

### During this period:

- Variables exist

- But cannot be accessed

### Example:

\`\`\`js
{ console.log(x); let x = 10;}
\`\`\`

### Output:

### Error

## Hoisting with Functions

### Function Declaration

Fully hoisted.

\`\`\`js
greet();function greet() { console.log("Hello");}
\`\`\`

### Output:

### Hello

### Function Expression

Not hoisted like function declaration.

\`\`\`js
greet();var greet = function() { console.log("Hello");};
\`\`\`

### Output:

### Error

### Explanation:

Only variable is hoisted, not the function.

## Arrow Function Hoisting

Behaves like function expressions.

\`\`\`js
sayHi();let sayHi = () => { console.log("Hi");};
\`\`\`

### Output:

### Error

## Hoisting Summary

## Real-World Example

\`\`\`js
function calculate() { console.log(total); var total = 100;}calculate();
\`\`\`

### Output:

### undefined

### Explanation:

\`\`\`js
var total is hoisted and initialized as undefined.
\`\`\`

## Example with let

\`\`\`js
function calculate() { console.log(total); let total = 100;}calculate();
\`\`\`

### Output:

### Error

## Common Mistakes

- Accessing variables before declaration

### Causes undefined or error

- Confusing var and let behavior

- Using function expressions before definition

- Ignoring Temporal Dead Zone

- Writing code in wrong order

## Interview Questions

- What is hoisting?

- How does var behave in hoisting?

- What is Temporal Dead Zone?

- Difference between let and var in hoisting?

- Are functions hoisted?

- Why function declarations work before definition?

## Practice Exercises

- Predict output of:

\`\`\`js
console.log(a);var a = 5;
\`\`\`

- Predict output of:

\`\`\`js
console.log(a);let a = 5;
\`\`\`

- Call a function before defining it

- Convert function declaration to expression and test

- Write example showing TDZ

## Mini Practice Task

### Create a program:

- Declare variable using var

- Print before and after assignment

- Observe behavior

## Challenge Task

### Write code:

- Use let and const

- Try accessing before declaration

- Explain errors`,
    },
    {
      slug: "chapter-9-execution-context-call-stack",
      title: "EXECUTION CONTEXT & CALL STACK",
      summary: "Execution Context and Call Stack explain how JavaScript runs code internally. They help understand function calls, variable storage, and execution order. Understanding these concepts is important for debugging, optimizing code, and handling complex programs.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 8,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# EXECUTION CONTEXT & CALL STACK

## Introduction

Execution Context and Call Stack explain how JavaScript runs code internally. They help understand function calls, variable storage, and execution order.

Understanding these concepts is important for debugging, optimizing code, and handling complex programs.

## What is Execution Context

Execution Context is an environment where JavaScript code is executed.

### Types of execution context:

- Global Execution Context (GEC)

- Function Execution Context (FEC)

## Global Execution Context (GEC)

- Created when the program starts

- Only one global context exists

- Contains global variables and functions

### Example:

\`\`\`js
let x = 10;function greet() { console.log("Hello");}greet();
\`\`\`

### Explanation:

The global context stores x and greet().

## Function Execution Context (FEC)

- Created whenever a function is called

- Each function gets its own context

### Example:

\`\`\`js
function add(a, b) { return a + b;}add(2, 3);
\`\`\`

### Explanation:

When add() is called, a new execution context is created.

## Phases of Execution Context

### Each execution context has two phases:

### Creation Phase

- Memory allocation

- Variables initialized as undefined

- Functions stored

### Execution Phase

- Code runs line by line

- Values are assigned

- Functions are executed

## Example: Execution Phases

\`\`\`js
console.log(a);var a = 5;
\`\`\`

### Creation Phase:

- a → undefined

### Execution Phase:

- console.log(a) → undefined

- a = 5

### Output:

### undefined

## What is Call Stack

Call Stack is a data structure used to manage execution contexts.

- Follows LIFO (Last In, First Out)

- Keeps track of function calls

## Call Stack Working

### Example:

\`\`\`js
function first() { second();}function second() { third();}function third() { console.log("Hello");}first();
\`\`\`

### Step-by-Step Execution

- Global Execution Context pushed

- first() pushed

- second() pushed

- third() pushed

- console.log runs

- third() removed

- second() removed

- first() removed

## Visual Flow

### Call Stack:

### Top → third()

### second()

### first()

### Bottom → Global

## Stack Overflow

Occurs when too many function calls are added without returning.

### Example:

\`\`\`js
function loop() { loop();}loop();
\`\`\`

### Output:

### Error (Maximum call stack size exceeded)

## Real-World Example

\`\`\`js
function calculate() { let result = add(5, 3); console.log(result);}function add(a, b) { return a + b;}calculate();
\`\`\`

### Execution Flow:

- Global context created

- calculate() called

- add() called

- result returned

- printed

### Output:

### 8

## Execution Context + Call Stack Combined

\`\`\`js
let x = 1;function one() { let y = 2; two();}function two() { let z = 3; console.log(x + z);}one();
\`\`\`

### Output:

### 4

### Explanation:

- two() accesses x from global scope

- Uses its own variable z

## Common Mistakes

- Not understanding execution order

### Leads to confusion in nested functions

- Infinite recursion

### Causes stack overflow

- Misunderstanding variable scope in functions

- Ignoring creation phase

## Interview Questions

- What is execution context?

- Types of execution context?

- What happens in creation phase?

- What is call stack?

- What is stack overflow?

- How does JavaScript execute nested functions?

## Practice Exercises

- Write a program with 3 nested functions and trace execution

- Predict output:

\`\`\`js
function test() { console.log("A");}test();
\`\`\`

- Create recursive function and observe behavior

- Trace call stack manually

- Write function calling another function

## Mini Practice Task

### Create program:

- function A calls B

- B calls C

- C prints a message

### Trace call stack manually

## Challenge Task

### Write recursive function:

- Print numbers from 5 to 1

- Track call stack behavior`,
    },
    {
      slug: "chapter-10-objects-in-javascript",
      title: "OBJECTS IN JAVASCRIPT",
      summary: "Objects are one of the most important concepts in JavaScript. They are used to store data in key-value pairs and represent real-world entities. Examples: A user (name, age, email) A product (name, price, category) A car (brand, model, speed)",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 9,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# OBJECTS IN JAVASCRIPT

## Introduction

Objects are one of the most important concepts in JavaScript. They are used to store data in key-value pairs and represent real-world entities.

Examples:

A user (name, age, email)

A product (name, price, category)

A car (brand, model, speed)

## What is an Object

An object is a collection of properties.

### Each property has:

- Key (name)

- Value

### Example:

\`\`\`js
let person = { name: "Ali", age: 25, city: "Delhi"};console.log(person);
\`\`\`

### Output:

\`\`\`js
{ name: "Ali", age: 25, city: "Delhi" }
\`\`\`

## Accessing Object Properties

### Dot Notation

\`\`\`js
console.log(person.name);
\`\`\`

### Output:

### Ali

### Bracket Notation

\`\`\`js
console.log(person["age"]);
\`\`\`

### Output:

### 25

## Difference: Dot vs Bracket

### Example:

\`\`\`js
let key = "city";console.log(person[key]);
\`\`\`

### Output:

### Delhi

## Adding Properties

\`\`\`js
person.country = "India";console.log(person);
\`\`\`

## Updating Properties

\`\`\`js
person.age = 30;console.log(person.age);
\`\`\`

### Output:

### 30

## Deleting Properties

\`\`\`js
delete person.city;console.log(person);
\`\`\`

## Object Methods

Functions inside objects are called methods.

\`\`\`js
let user = { name: "Ali", greet: function() { console.log("Hello " + this.name); }};user.greet();
\`\`\`

### Output:

### Hello Ali

## this Keyword

Refers to the current object.

\`\`\`js
let car = { brand: "BMW", show: function() { console.log(this.brand); }};car.show();
\`\`\`

### Output:

### BMW

## Object Creation Methods

### Object Literal (Most Common)

\`\`\`js
let student = { name: "Sara", marks: 90};
\`\`\`

### Using new Object()

\`\`\`js
let obj = new Object();obj.name = "Ali";obj.age = 22;
\`\`\`

### Constructor Function

\`\`\`js
function Person(name, age) { this.name = name; this.age = age;}let p1 = new Person("Ali", 25);console.log(p1.name);
\`\`\`

### Output:

### Ali

## Nested Objects

Objects inside objects.

\`\`\`js
let student = { name: "Ali", address: { city: "Delhi", pin: 12345 }};console.log(student.address.city);
\`\`\`

### Output:

### Delhi

## Object.keys(), values(), entries()

\`\`\`js
let user = { name: "Ali", age: 25};console.log(Object.keys(user));console.log(Object.values(user));console.log(Object.entries(user));
\`\`\`

### Output:

### ["name", "age"]

### ["Ali", 25]

### [["name", "Ali"], ["age", 25]]

## Looping Through Objects

\`\`\`js
for (let key in user) { console.log(key, user[key]);}
\`\`\`

### Output:

### name Ali

### age 25

## Real-World Example

\`\`\`js
let product = { name: "Laptop", price: 50000, quantity: 2, total: function() { return this.price * this.quantity; }};console.log(product.total());
\`\`\`

### Output:

### 100000

## Shallow Copy of Object

\`\`\`js
let obj1 = { a: 1 };let obj2 = obj1;obj2.a = 5;console.log(obj1.a);
\`\`\`

### Output:

### 5

### Explanation:

Both refer to same memory.

## Copy Using Spread Operator

\`\`\`js
let obj1 = { a: 1 };let obj2 = { ...obj1 };obj2.a = 5;console.log(obj1.a);
\`\`\`

### Output:

### 1

## Common Mistakes

- Using = instead of : in object

- Forgetting quotes in bracket notation

- Confusing this keyword

- Modifying original object accidentally

- Not checking undefined properties

## Interview Questions

- What is an object in JavaScript?

- Difference between dot and bracket notation?

- What is this keyword?

- How to loop through object?

- What is constructor function?

- Difference between shallow and deep copy?

## Practice Exercises

- Create an object for a student

- Add, update, and delete properties

- Create a method inside object

- Loop through object and print keys

- Copy object using spread operator

## Mini Practice Task

### Create an object:

- name

- price

- quantity

### Add method to calculate total price

## Challenge Task

### Create a user system:

- Store user details in object

- Add login method

- Display user info using method`,
    },
    {
      slug: "chapter-11-arrays-and-methods",
      title: "ARRAYS AND METHODS",
      summary: "Arrays are used to store multiple values in a single variable. They are ordered collections, meaning each value has an index (position). Arrays are widely used in real-world applications such as: Storing lists of users Managing products Handling API data",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 10,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# ARRAYS AND METHODS

## Introduction

Arrays are used to store multiple values in a single variable. They are ordered collections, meaning each value has an index (position).

Arrays are widely used in real-world applications such as:

Storing lists of users

Managing products

Handling API data

## What is an Array

An array is a collection of elements stored in a single variable.

\`\`\`js
let fruits = ["Apple", "Banana", "Mango"];console.log(fruits);
\`\`\`

### Output:

### ["Apple", "Banana", "Mango"]

## Accessing Array Elements

Each element has an index starting from 0.

\`\`\`js
let fruits = ["Apple", "Banana", "Mango"];console.log(fruits[0]); // Appleconsole.log(fruits[1]); // Banana
\`\`\`

## Modifying Array Elements

\`\`\`js
let fruits = ["Apple", "Banana", "Mango"];fruits[1] = "Orange";console.log(fruits);
\`\`\`

### Output:

### ["Apple", "Orange", "Mango"]

## Array Length

\`\`\`js
let numbers = [1, 2, 3, 4];console.log(numbers.length);
\`\`\`

### Output:

### 4

## Common Array Methods

## push()

Adds element at the end.

\`\`\`js
let arr = [1, 2];arr.push(3);console.log(arr);
\`\`\`

### Output:

### [1, 2, 3]

## pop()

Removes last element.

\`\`\`js
let arr = [1, 2, 3];arr.pop();console.log(arr);
\`\`\`

### Output:

### [1, 2]

## shift()

Removes first element.

\`\`\`js
let arr = [1, 2, 3];arr.shift();console.log(arr);
\`\`\`

### Output:

### [2, 3]

## unshift()

Adds element at beginning.

\`\`\`js
let arr = [2, 3];arr.unshift(1);console.log(arr);
\`\`\`

### Output:

### [1, 2, 3]

## indexOf()

Finds index of element.

\`\`\`js
let arr = ["a", "b", "c"];console.log(arr.indexOf("b"));
\`\`\`

### Output:

### 1

## includes()

Checks if value exists.

\`\`\`js
let arr = [1, 2, 3];console.log(arr.includes(2));
\`\`\`

### Output:

### true

## slice()

Returns a portion of array (no change to original).

\`\`\`js
let arr = [1, 2, 3, 4];let newArr = arr.slice(1, 3);console.log(newArr);
\`\`\`

### Output:

### [2, 3]

## splice()

Adds/removes elements.

\`\`\`js
let arr = [1, 2, 3];arr.splice(1, 1);console.log(arr);
\`\`\`

### Output:

### [1, 3]

## Iterating Arrays

### for Loop

\`\`\`js
let arr = [10, 20, 30];for (let i = 0; i < arr.length; i++) { console.log(arr[i]);}
\`\`\`

### for...of Loop

\`\`\`js
let arr = [10, 20, 30];for (let value of arr) { console.log(value);}
\`\`\`

## Advanced Array Methods

## map()

Creates new array by transforming elements.

\`\`\`js
let arr = [1, 2, 3];let result = arr.map(x => x * 2);console.log(result);
\`\`\`

### Output:

### [2, 4, 6]

## filter()

Filters elements based on condition.

\`\`\`js
let arr = [1, 2, 3, 4];let result = arr.filter(x => x > 2);console.log(result);
\`\`\`

### Output:

### [3, 4]

## reduce()

Reduces array to single value.

\`\`\`js
let arr = [1, 2, 3];let sum = arr.reduce((acc, curr) => acc + curr, 0);console.log(sum);
\`\`\`

### Output:

### 6

## Real-World Example

\`\`\`js
let prices = [100, 200, 300];let total = prices.reduce((sum, price) => sum + price, 0);console.log(total);
\`\`\`

### Output:

### 600

## Array of Objects

\`\`\`js
let users = [ { name: "Ali", age: 25 }, { name: "Sara", age: 30 }];console.log(users[1].name);
\`\`\`

### Output:

### Sara

## Common Mistakes

- Accessing index that does not exist

### Returns undefined

- Using wrong loop condition

### Can cause infinite loop

- Confusing slice and splice

- Forgetting return in map/filter

- Modifying original array unintentionally

## Interview Questions

- What is an array?

- Difference between push and pop?

- Difference between slice and splice?

- What is map function?

- What is reduce used for?

- Difference between for and for...of?

## Practice Exercises

- Create an array of numbers

- Add and remove elements

- Find element index

- Use map to double numbers

- Use filter to get even numbers

## Mini Practice Task

### Create array:

- Store 5 numbers

- Find sum using reduce

## Challenge Task

### Create student array:

- Store objects (name, marks)

- Filter students with marks > 50

- Print names`,
    },
    {
      slug: "chapter-12-destructuring",
      title: "DESTRUCTURING",
      summary: "Destructuring is a feature in JavaScript that allows extracting values from arrays and objects into separate variables. It makes code shorter, cleaner, and easier to read.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 11,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# DESTRUCTURING

## Introduction

Destructuring is a feature in JavaScript that allows extracting values from arrays and objects into separate variables. It makes code shorter, cleaner, and easier to read.

## Why Destructuring is Important

Without destructuring, accessing values requires multiple lines.

### Example without destructuring:

\`\`\`js
let arr = [10, 20, 30];let a = arr[0];let b = arr[1];let c = arr[2];
\`\`\`

### With destructuring:

\`\`\`js
let arr = [10, 20, 30];let [a, b, c] = arr;
\`\`\`

## Array Destructuring

Extract values from arrays.

\`\`\`js
let fruits = ["Apple", "Banana", "Mango"];let [f1, f2, f3] = fruits;console.log(f1, f2, f3);
\`\`\`

### Output:

### Apple Banana Mango

## Skipping Values

\`\`\`js
let numbers = [1, 2, 3, 4];let [a, , c] = numbers;console.log(a, c);
\`\`\`

### Output:

### 3

## Default Values

\`\`\`js
let arr = [1];let [a, b = 5] = arr;console.log(a, b);
\`\`\`

### Output:

### 5

## Swapping Variables

\`\`\`js
let x = 10;let y = 20;[x, y] = [y, x];console.log(x, y);
\`\`\`

### Output:

### 10

## Rest Operator in Array Destructuring

\`\`\`js
let arr = [1, 2, 3, 4];let [a, ...rest] = arr;console.log(a);console.log(rest);
\`\`\`

### Output:

### 1

### [2, 3, 4]

## Object Destructuring

Extract values from objects.

\`\`\`js
let user = { name: "Ali", age: 25};let { name, age } = user;console.log(name, age);
\`\`\`

### Output:

### Ali 25

## Renaming Variables

\`\`\`js
let user = { name: "Ali", age: 25};let { name: username, age: userAge } = user;console.log(username, userAge);
\`\`\`

### Output:

### Ali 25

## Default Values in Objects

\`\`\`js
let user = { name: "Ali"};let { name, age = 20 } = user;console.log(name, age);
\`\`\`

### Output:

### Ali 20

## Nested Destructuring

\`\`\`js
let user = { name: "Ali", address: { city: "Delhi" }};let { address: { city } } = user;console.log(city);
\`\`\`

### Output:

### Delhi

## Destructuring in Function Parameters

\`\`\`js
function display({ name, age }) { console.log(name, age);}display({ name: "Ali", age: 25 });
\`\`\`

### Output:

### Ali 25

## Real-World Example

\`\`\`js
let product = { name: "Laptop", price: 50000, category: "Electronics"};let { name, price } = product;console.log(name + " costs " + price);
\`\`\`

### Output:

### Laptop costs 50000

## Destructuring Arrays of Objects

\`\`\`js
let users = [ { name: "Ali", age: 25 }, { name: "Sara", age: 30 }];let [{ name }, { age }] = users;console.log(name, age);
\`\`\`

### Output:

### Ali 30

## Common Mistakes

- Wrong variable names in object destructuring

### Keys must match

- Forgetting default values

- Confusing array and object destructuring

- Not handling undefined values

- Incorrect nested destructuring

## Interview Questions

- What is destructuring?

- Difference between array and object destructuring?

- How to skip elements in array destructuring?

- How to rename variables in object destructuring?

- What is rest operator in destructuring?

- Can destructuring be used in function parameters?

## Practice Exercises

- Destructure an array of 5 elements

- Swap two variables using destructuring

- Extract values from object

- Use default values in destructuring

- Use destructuring in function parameter

## Mini Practice Task

### Create object:

- name

- price

- quantity

### Destructure and print values

## Challenge Task

### Create array of objects:

- Extract names using destructuring

- Print only names`,
    },
      ],
    },
    {
      slug: "part-2",
      title: "Part 2 — Chapters 13–24",
      summary: "Chapters 13 to 24 of JavaScript for Web Development Master Book.",
      order: 2,
      difficulty: "intermediate",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-13-spread-and-rest-operators",
      title: "SPREAD AND REST OPERATORS",
      summary: "The spread (...) and rest (...) operators are powerful features in JavaScript used to handle arrays, objects, and function parameters. Although both use the same syntax (...), their purpose is different: Spread → Expands values Rest → Collects values",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 12,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# SPREAD AND REST OPERATORS

## Introduction

The spread (...) and rest (...) operators are powerful features in JavaScript used to handle arrays, objects, and function parameters.

Although both use the same syntax (...), their purpose is different:

Spread → Expands values

Rest → Collects values

## Spread Operator

The spread operator expands elements of arrays or objects.

## Spread with Arrays

\`\`\`js
let arr1 = [1, 2, 3];let arr2 = [...arr1];console.log(arr2);
\`\`\`

### Output:

### [1, 2, 3]

### Explanation:

Copies all elements from arr1 into arr2.

## Merging Arrays

\`\`\`js
let arr1 = [1, 2];let arr2 = [3, 4];let combined = [...arr1, ...arr2];console.log(combined);
\`\`\`

### Output:

### [1, 2, 3, 4]

## Adding Elements

\`\`\`js
let arr = [2, 3];let newArr = [1, ...arr, 4];console.log(newArr);
\`\`\`

### Output:

### [1, 2, 3, 4]

## Spread with Objects

\`\`\`js
let obj1 = { name: "Ali" };let obj2 = { age: 25 };let merged = { ...obj1, ...obj2 };console.log(merged);
\`\`\`

### Output:

\`\`\`js
{ name: "Ali", age: 25 }
\`\`\`

## Overwriting Properties

\`\`\`js
let obj1 = { name: "Ali", age: 20 };let obj2 = { age: 30 };let result = { ...obj1, ...obj2 };console.log(result);
\`\`\`

### Output:

\`\`\`js
{ name: "Ali", age: 30 }
\`\`\`

## Copying Objects

\`\`\`js
let obj1 = { a: 1 };let obj2 = { ...obj1 };obj2.a = 5;console.log(obj1.a);
\`\`\`

### Output:

### 1

## Spread in Function Calls

\`\`\`js
function sum(a, b, c) { return a + b + c;}let arr = [1, 2, 3];console.log(sum(...arr));
\`\`\`

### Output:

### 6

## Rest Operator

The rest operator collects multiple values into a single array.

## Rest in Function Parameters

\`\`\`js
function add(...numbers) { let sum = 0; for (let num of numbers) { sum += num; } return sum;}console.log(add(1, 2, 3, 4));
\`\`\`

### Output:

### 10

## Rest with Array Destructuring

\`\`\`js
let arr = [1, 2, 3, 4];let [a, ...rest] = arr;console.log(a);console.log(rest);
\`\`\`

### Output:

### 1

### [2, 3, 4]

## Rest with Object Destructuring

\`\`\`js
let user = { name: "Ali", age: 25, city: "Delhi"};let { name, ...rest } = user;console.log(name);console.log(rest);
\`\`\`

### Output:

### Ali

\`\`\`js
{ age: 25, city: "Delhi" }
\`\`\`

## Spread vs Rest

## Real-World Example

\`\`\`js
let cart1 = ["Laptop", "Phone"];let cart2 = ["Tablet"];let finalCart = [...cart1, ...cart2];console.log(finalCart);
\`\`\`

### Output:

### ["Laptop", "Phone", "Tablet"]

## Function Example with Rest

\`\`\`js
function calculateTotal(...prices) { return prices.reduce((total, price) => total + price, 0);}console.log(calculateTotal(100, 200, 300));
\`\`\`

### Output:

### 600

## Common Mistakes

- Confusing spread and rest

### Both look same but behave differently

- Using rest parameter in wrong position

### Must be last parameter

- Expecting deep copy with spread

### Spread creates shallow copy

- Overwriting properties unintentionally

- Misusing spread in nested objects

## Interview Questions

- What is spread operator?

- What is rest operator?

- Difference between spread and rest?

- How to merge arrays using spread?

- Can rest be used in function parameters?

- Does spread create deep copy?

## Practice Exercises

- Copy an array using spread

- Merge two arrays

- Create function using rest parameters

- Extract first element and rest from array

- Copy object and modify value

## Mini Practice Task

### Create function:

- Accept multiple numbers using rest

- Return sum

## Challenge Task

### Create shopping cart:

- Combine multiple arrays using spread

- Calculate total using rest`,
    },
    {
      slug: "chapter-14-what-is-dom",
      title: "WHAT IS DOM",
      summary: "The DOM (Document Object Model) is a programming interface that represents an HTML document as a tree structure. It allows JavaScript to access, modify, add, and delete elements on a webpage dynamically. Without the DOM, JavaScript cannot interact with HTML…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 13,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# WHAT IS DOM

## Introduction

The DOM (Document Object Model) is a programming interface that represents an HTML document as a tree structure. It allows JavaScript to access, modify, add, and delete elements on a webpage dynamically.

Without the DOM, JavaScript cannot interact with HTML content.

## What is DOM

### DOM is a structured representation of an HTML page where:

- Each element is treated as an object

- JavaScript can access and modify these objects

### Example HTML:

### <!DOCTYPE html><html><body> <h1>Hello</h1></body></html>

### DOM representation:

- Document

- html

- body

- h1

## DOM Tree Structure

### The HTML page is converted into a tree-like structure:

- Document (root)

- html

- head

- body

- elements (h1, p, div, etc.)

Each node in this structure is called a DOM node.

## Types of DOM Nodes

- Element Nodes → HTML tags (div, p, h1)

- Text Nodes → Text inside elements

- Attribute Nodes → Attributes like id, class

## How JavaScript Uses DOM

### JavaScript can:

- Select elements

- Change content

- Change styles

- Add or remove elements

- Handle user events

## Example: Accessing DOM

\`\`\`html
<p id="text">Old Text</p><script>document.getElementById("text").innerText = "New Text";</script>
\`\`\`

### Explanation:

JavaScript selects the paragraph and changes its text.

### Output:

### "Old Text" becomes "New Text"

## document Object

The document object represents the entire webpage.

### Examples:

\`\`\`js
console.log(document);console.log(document.title);
\`\`\`

## Accessing Page Information

\`\`\`js
console.log(document.body);console.log(document.head);
\`\`\`

## Changing Content

\`\`\`js
document.body.innerHTML = "<h1>Changed</h1>";
\`\`\`

## DOM Manipulation Basics

### Selecting Element

\`\`\`js
let element = document.getElementById("text");
\`\`\`

### Changing Text

\`\`\`js
element.innerText = "Updated";
\`\`\`

### Changing HTML

\`\`\`js
element.innerHTML = "<b>Bold Text</b>";
\`\`\`

## Real-World Example

\`\`\`html
<h2 id="heading">Welcome</h2><script>let h = document.getElementById("heading");h.innerText = "Welcome to JavaScript";</script>
\`\`\`

### Output:

Heading text changes dynamically.

## DOM vs HTML

## DOM Loading Process

- Browser loads HTML

- Creates DOM tree

- JavaScript interacts with DOM

### Important:

JavaScript should run after DOM is loaded.

## Script Placement

### Correct placement:

\`\`\`html
<body><h1 id="demo">Hello</h1><script src="script.js"></script></body>
\`\`\`

### Reason:

Ensures elements exist before JavaScript runs.

## DOMContentLoaded Event

Ensures DOM is fully loaded before execution.

\`\`\`js
document.addEventListener("DOMContentLoaded", function() { console.log("DOM Loaded");});
\`\`\`

## Common Mistakes

- Running JavaScript before DOM loads

### Leads to null errors

- Using wrong selectors

### Element not found

- Confusing innerText and innerHTML

- Overwriting entire DOM accidentally

- Not checking console errors

## Interview Questions

- What is DOM?

- What is DOM tree?

- Difference between HTML and DOM?

- What is document object?

- What are DOM nodes?

- When does DOM load?

## Practice Exercises

- Create HTML page and access element using JS

- Change text of heading

- Replace content using innerHTML

- Print document title

- Log document object

## Mini Practice Task

### Create webpage:

- One heading

- Change text using JavaScript

## Challenge Task

### Create page:

- Two paragraphs

- Change both using JavaScript

- Use different methods (innerText, innerHTML)`,
    },
    {
      slug: "chapter-15-selecting-elements",
      title: "SELECTING ELEMENTS",
      summary: "Selecting elements is the first step in DOM manipulation. Before changing content, styles, or handling events, JavaScript must first find and access the HTML elements. JavaScript provides multiple methods to select elements from the DOM.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 14,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# SELECTING ELEMENTS

## Introduction

Selecting elements is the first step in DOM manipulation. Before changing content, styles, or handling events, JavaScript must first find and access the HTML elements.

JavaScript provides multiple methods to select elements from the DOM.

## Common Methods to Select Elements

- getElementById

- getElementsByClassName

- getElementsByTagName

- querySelector

- querySelectorAll

## getElementById

Selects a single element using its id.

\`\`\`js
let element = document.getElementById("heading");console.log(element);
\`\`\`

### HTML:

\`\`\`html
<h1 id="heading">Hello</h1>
\`\`\`

### Explanation:

Selects the element with id "heading".

## Changing Content

\`\`\`js
let element = document.getElementById("heading");element.innerText = "Updated Text";
\`\`\`

### Output:

Text changes on screen.

## getElementsByClassName

Selects all elements with a specific class.

\`\`\`js
let elements = document.getElementsByClassName("box");console.log(elements);
\`\`\`

### HTML:

\`\`\`html
<p class="box">One</p><p class="box">Two</p>
\`\`\`

### Explanation:

Returns a collection (array-like).

## Accessing Elements

\`\`\`js
console.log(elements[0]);
\`\`\`

## getElementsByTagName

Selects elements by tag name.

\`\`\`js
let items = document.getElementsByTagName("p");console.log(items);
\`\`\`

## querySelector

Selects the first matching element using CSS selector.

\`\`\`js
let element = document.querySelector("#heading");
\`\`\`

### Examples:

\`\`\`js
document.querySelector(".box");document.querySelector("p");
\`\`\`

## querySelectorAll

Selects all matching elements.

\`\`\`js
let elements = document.querySelectorAll(".box");console.log(elements);
\`\`\`

## Difference Between querySelector and querySelectorAll

## Looping Through Selected Elements

\`\`\`js
let elements = document.querySelectorAll(".box");elements.forEach(function(el) { console.log(el.innerText);});
\`\`\`

### Output:

### One

### Two

## Real-World Example

\`\`\`html
<ul> <li class="item">Item 1</li> <li class="item">Item 2</li></ul><script>let items = document.querySelectorAll(".item");items.forEach(function(item) { item.innerText = "Updated";});</script>
\`\`\`

### Output:

### All items become "Updated"

## Selecting Nested Elements

\`\`\`js
let parent = document.getElementById("container");let child = parent.querySelector(".box");
\`\`\`

## Selecting by Attribute

\`\`\`js
let input = document.querySelector("input[type='text']");
\`\`\`

## Difference Between HTMLCollection and NodeList

## Converting to Array

\`\`\`js
let elements = document.getElementsByClassName("box");let arr = Array.from(elements);
\`\`\`

## Common Mistakes

- Using wrong selector (# vs .)

- Forgetting that getElementsByClassName returns collection

- Trying to use forEach on HTMLCollection

- Not checking if element exists

- Confusing querySelector and querySelectorAll

## Interview Questions

- What is getElementById?

- Difference between querySelector and querySelectorAll?

- What is HTMLCollection?

- Difference between class and id selection?

- How to loop through selected elements?

- Which method uses CSS selectors?

## Practice Exercises

- Select element using id

- Select elements using class

- Select all paragraphs

- Use querySelector to select first element

- Use querySelectorAll and loop through elements

## Mini Practice Task

### Create webpage:

- 3 paragraphs

- Change all text using querySelectorAll

## Challenge Task

### Create list:

- Select all items

- Change only even index items`,
    },
    {
      slug: "chapter-16-event-handling",
      title: "EVENT HANDLING",
      summary: "Events are actions that occur in the browser, such as a user clicking a button, typing in an input field, or submitting a form. Event handling is the process of detecting these actions and executing code in response. JavaScript allows you to attach event…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 15,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# EVENT HANDLING

## Introduction

Events are actions that occur in the browser, such as a user clicking a button, typing in an input field, or submitting a form. Event handling is the process of detecting these actions and executing code in response.

JavaScript allows you to attach event listeners to elements and define what should happen when an event occurs.

## What is an Event

An event is any interaction or occurrence in the browser.

### Examples:

- click

- input

- submit

- mouseover

- keydown

## Event Handling Methods

- Inline event handling

- Using event properties

- Using addEventListener (recommended)

## Inline Event Handling

\`\`\`html
<button onclick="showMessage()">Click</button><script>function showMessage() { console.log("Button clicked");}</script>
\`\`\`

### Explanation:

Event is written directly inside HTML.

## Using Event Property

\`\`\`html
<button id="btn">Click</button><script>let btn = document.getElementById("btn");btn.onclick = function() { console.log("Clicked");};</script>
\`\`\`

## addEventListener (Best Practice)

\`\`\`html
<button id="btn">Click</button><script>let btn = document.getElementById("btn");btn.addEventListener("click", function() { console.log("Button clicked");});</script>
\`\`\`

### Advantages:

- Multiple events can be attached

- Cleaner code

- Better control

## Common Event Types

## Example: Input Event

\`\`\`html
<input type="text" id="name"><script>let input = document.getElementById("name");input.addEventListener("input", function() { console.log(input.value);});</script>
\`\`\`

### Explanation:

Prints value as user types.

## Event Object

When an event occurs, an event object is automatically passed.

\`\`\`js
document.getElementById("btn").addEventListener("click", function(event) { console.log(event);});
\`\`\`

## Accessing Event Properties

\`\`\`js
document.getElementById("btn").addEventListener("click", function(event) { console.log(event.target);});
\`\`\`

### Explanation:

event.target gives the element that triggered the event.

## Prevent Default Behavior

Used to stop default browser behavior.

\`\`\`html
<form id="form"> <button type="submit">Submit</button></form><script>document.getElementById("form").addEventListener("submit", function(event) { event.preventDefault(); console.log("Form submission prevented");});</script>
\`\`\`

## Event Bubbling

Events move from child to parent.

\`\`\`html
<div id="parent"> <button id="child">Click</button></div><script>document.getElementById("parent").addEventListener("click", function() { console.log("Parent clicked");});document.getElementById("child").addEventListener("click", function() { console.log("Child clicked");});</script>
\`\`\`

### Output:

### Child clicked

### Parent clicked

## Event Capturing

Events move from parent to child.

\`\`\`js
element.addEventListener("click", handler, true);
\`\`\`

## Event Delegation

Handling events on parent instead of individual elements.

\`\`\`html
<ul id="list"> <li>Item 1</li> <li>Item 2</li></ul><script>document.getElementById("list").addEventListener("click", function(e) { console.log(e.target.innerText);});</script>
\`\`\`

### Explanation:

Handles clicks for all list items.

## Real-World Example

\`\`\`html
<input type="text" id="username"><button id="btn">Submit</button><p id="output"></p><script>let btn = document.getElementById("btn");btn.addEventListener("click", function() { let value = document.getElementById("username").value; document.getElementById("output").innerText = value;});</script>
\`\`\`

### Output:

Displays input value when button is clicked.

## Common Mistakes

- Forgetting to attach event listener

- Using wrong event type

- Not using preventDefault in forms

- Confusing event.target and this

- Not understanding event bubbling

## Interview Questions

- What is an event in JavaScript?

- What is addEventListener?

- Difference between onclick and addEventListener?

- What is event object?

- What is event bubbling?

- What is event delegation?

## Practice Exercises

- Create button click event

- Display input value on typing

- Handle form submit event

- Use event object

- Implement event delegation

## Mini Practice Task

### Create webpage:

- Input field

- Button

- Display typed text when button clicked

## Challenge Task

### Create interactive list:

- Add items

- Click item to highlight

- Use event delegation`,
    },
    {
      slug: "chapter-17-dom-project-todo-app",
      title: "DOM PROJECT — TODO APP",
      summary: "This chapter builds a complete Todo App using JavaScript and DOM manipulation. The project covers: Selecting elements Handling events Creating and deleting elements Updating UI dynamically Storing data This project is commonly asked in interviews and…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 16,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# DOM PROJECT — TODO APP

## Introduction

This chapter builds a complete Todo App using JavaScript and DOM manipulation. The project covers:

Selecting elements

Handling events

Creating and deleting elements

Updating UI dynamically

Storing data

This project is commonly asked in interviews and demonstrates practical JavaScript skills.

## Problem Statement

### Create a Todo App where a user can:

- Add tasks

- Delete tasks

- Mark tasks as completed

## Project Structure

### project/│├── index.html├── style.css└── script.js

## Step 1: HTML Structure

<!DOCTYPE html><html><head> <title>Todo App</title></head><body><h2>Todo App</h2><input type="text" id="taskInput" placeholder="Enter task"><button id="addBtn">Add Task</button><ul id="taskList"></ul><script src="script.js"></script></body></html>

## Step 2: Basic JavaScript Setup

\`\`\`js
let input = document.getElementById("taskInput");let button = document.getElementById("addBtn");let list = document.getElementById("taskList");
\`\`\`

## Step 3: Add Task Function

\`\`\`js
button.addEventListener("click", function() { let task = input.value; if (task === "") { alert("Enter a task"); return; } let li = document.createElement("li"); li.innerText = task; list.appendChild(li); input.value = "";});
\`\`\`

## Explanation

- Get value from input

- Create new list item

- Add text to it

- Append to list

- Clear input field

## Output

### When user types "Study JavaScript" and clicks Add:

- A new list item appears

## Step 4: Delete Task

\`\`\`js
button.addEventListener("click", function() { let task = input.value; if (task === "") return; let li = document.createElement("li"); li.innerText = task; let deleteBtn = document.createElement("button"); deleteBtn.innerText = "Delete"; deleteBtn.addEventListener("click", function() { li.remove(); }); li.appendChild(deleteBtn); list.appendChild(li); input.value = "";});
\`\`\`

## Explanation

- Each task has a delete button

- Clicking it removes the task

## Step 5: Mark Task as Completed

\`\`\`js
li.addEventListener("click", function() { li.style.textDecoration = "line-through";});
\`\`\`

## Combined Version

\`\`\`js
let input = document.getElementById("taskInput");let button = document.getElementById("addBtn");let list = document.getElementById("taskList");button.addEventListener("click", function() { let task = input.value; if (task === "") return; let li = document.createElement("li"); li.innerText = task; li.addEventListener("click", function() { li.style.textDecoration = "line-through"; }); let deleteBtn = document.createElement("button"); deleteBtn.innerText = "Delete"; deleteBtn.addEventListener("click", function() { li.remove(); }); li.appendChild(deleteBtn); list.appendChild(li); input.value = "";});
\`\`\`

## Step 6: Add Basic Styling (Optional)

\`\`\`js
body { font-family: Arial;}li { margin: 5px 0;}button { margin-left: 10px;}
\`\`\`

## Real-World Improvements

- Add local storage

- Add edit feature

- Add filter (completed/pending)

- Add timestamps

## Common Mistakes

- Not clearing input field

- Adding empty tasks

- Not attaching delete event correctly

- Overwriting event listeners

- Forgetting to append elements

## Interview Questions

- How does DOM manipulation work in this project?

- How do you create elements dynamically?

- How do you remove elements?

- How can you store tasks permanently?

- What improvements can be added?

## Practice Exercises

- Add alert for empty input

- Add checkbox instead of click for completion

- Add edit functionality

- Count total tasks

- Add clear all button

## Mini Practice Task

### Modify app:

- Add "Clear All" button

- Remove all tasks when clicked

## Challenge Task

### Enhance Todo App:

- Store tasks in local storage

- Load tasks when page reloads`,
    },
    {
      slug: "chapter-18-callbacks",
      title: "CALLBACKS",
      summary: "Callbacks are functions passed as arguments to other functions and executed later. They are a core concept in JavaScript, especially for handling asynchronous operations like events, timers, and API calls.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 17,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# CALLBACKS

## Introduction

Callbacks are functions passed as arguments to other functions and executed later. They are a core concept in JavaScript, especially for handling asynchronous operations like events, timers, and API calls.

## What is a Callback Function

A callback is a function given to another function to be executed after a certain task is completed.

### Example:

\`\`\`js
function greet(name, callback) { console.log("Hello " + name); callback();}function sayBye() { console.log("Goodbye");}greet("Ali", sayBye);
\`\`\`

### Output:

### Hello Ali

### Goodbye

## Why Callbacks are Used

- To handle asynchronous operations

- To control execution order

- To reuse logic

## Synchronous vs Asynchronous

### Synchronous Code

Executes line by line.

\`\`\`js
console.log("Start");console.log("End");
\`\`\`

### Output:

### Start

### End

### Asynchronous Code

Does not block execution.

\`\`\`js
console.log("Start");setTimeout(function() { console.log("Delayed");}, 2000);console.log("End");
\`\`\`

### Output:

### Start

### End

### Delayed

## Callback in Asynchronous Code

\`\`\`js
function fetchData(callback) { setTimeout(function() { console.log("Data fetched"); callback(); }, 2000);}fetchData(function() { console.log("Processing data");});
\`\`\`

### Output:

### Data fetched

### Processing data

## Callback Example: Array Method

\`\`\`js
let numbers = [1, 2, 3];numbers.forEach(function(num) { console.log(num);});
\`\`\`

### Output:

### 1

### 2

### 3

### Explanation:

The function passed to forEach is a callback.

## Callback Example: Event Handling

\`\`\`js
document.getElementById("btn").addEventListener("click", function() { console.log("Button clicked");});
\`\`\`

### Explanation:

Function runs when button is clicked.

## Callback Hell

Nested callbacks make code difficult to read and maintain.

### Example:

\`\`\`js
setTimeout(function() { console.log("Step 1"); setTimeout(function() { console.log("Step 2"); setTimeout(function() { console.log("Step 3"); }, 1000); }, 1000);}, 1000);
\`\`\`

## Problems with Callback Hell

- Hard to read

- Difficult to debug

- Poor maintainability

## Real-World Example

\`\`\`js
function login(user, callback) { console.log("User logged in:", user); callback();}function loadDashboard() { console.log("Dashboard loaded");}login("Ali", loadDashboard);
\`\`\`

### Output:

### User logged in: Ali

### Dashboard loaded

## Error Handling in Callbacks

\`\`\`js
function processData(callback) { let success = true; if (success) { callback(null, "Data processed"); } else { callback("Error occurred", null); }}processData(function(error, result) { if (error) { console.log(error); } else { console.log(result); }});
\`\`\`

## Common Mistakes

- Forgetting to call callback

- Calling callback multiple times

- Deep nesting of callbacks

- Not handling errors

- Losing track of execution flow

## Interview Questions

- What is a callback function?

- Why are callbacks used?

- Difference between synchronous and asynchronous code?

- What is callback hell?

- How to handle errors in callbacks?

- Give real-world example of callback

## Practice Exercises

- Create function that accepts callback

- Use callback with setTimeout

- Use callback in array method

- Create login system using callback

- Write nested callback example

## Mini Practice Task

### Create function:

- Accept name and callback

- Print name

- Then call callback

## Challenge Task

### Create flow:

- Step 1 → Load user

- Step 2 → Load orders

- Step 3 → Show result

### Use nested callbacks`,
    },
    {
      slug: "chapter-19-promises",
      title: "PROMISES",
      summary: "Promises are used to handle asynchronous operations in a cleaner and more structured way than callbacks. They help avoid deeply nested code (callback hell) and make code easier to read and maintain.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 18,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# PROMISES

## Introduction

Promises are used to handle asynchronous operations in a cleaner and more structured way than callbacks. They help avoid deeply nested code (callback hell) and make code easier to read and maintain.

## What is a Promise

A Promise is an object that represents the eventual result (success or failure) of an asynchronous operation.

### A promise has three states:

- Pending → Initial state

- Fulfilled → Operation successful

- Rejected → Operation failed

## Creating a Promise

\`\`\`js
let promise = new Promise(function(resolve, reject) { let success = true; if (success) { resolve("Operation successful"); } else { reject("Operation failed"); }});
\`\`\`

## Consuming a Promise

\`\`\`js
promise .then(function(result) { console.log(result); }) .catch(function(error) { console.log(error); });
\`\`\`

### Output:

### Operation successful

## then() Method

Used to handle successful result.

\`\`\`js
let p = new Promise(function(resolve) { resolve("Success");});p.then(function(data) { console.log(data);});
\`\`\`

## catch() Method

Used to handle errors.

\`\`\`js
let p = new Promise(function(resolve, reject) { reject("Error occurred");});p.catch(function(error) { console.log(error);});
\`\`\`

## finally() Method

Runs regardless of success or failure.

\`\`\`js
p.finally(function() { console.log("Completed");});
\`\`\`

## Promise Chaining

\`\`\`js
let p = new Promise(function(resolve) { resolve(5);});p.then(function(num) { return num * 2;}).then(function(result) { console.log(result);});
\`\`\`

### Output:

### 10

## Example: Asynchronous Task

\`\`\`js
function fetchData() { return new Promise(function(resolve) { setTimeout(function() { resolve("Data fetched"); }, 2000); });}fetchData().then(function(data) { console.log(data);});
\`\`\`

### Output:

### Data fetched

## Handling Errors in Promise Chain

\`\`\`js
let p = new Promise(function(resolve, reject) { reject("Something went wrong");});p.then(function(data) { console.log(data);}).catch(function(error) { console.log(error);});
\`\`\`

## Multiple Promises

### Promise.all()

Runs multiple promises together.

\`\`\`js
let p1 = Promise.resolve(10);let p2 = Promise.resolve(20);Promise.all([p1, p2]) .then(function(values) { console.log(values); });
\`\`\`

### Output:

### [10, 20]

### Promise.race()

Returns first completed promise.

\`\`\`js
let p1 = new Promise(resolve => setTimeout(() => resolve("First"), 1000));let p2 = new Promise(resolve => setTimeout(() => resolve("Second"), 2000));Promise.race([p1, p2]) .then(function(result) { console.log(result); });
\`\`\`

### Output:

### First

## Real-World Example

\`\`\`js
function loginUser() { return new Promise(function(resolve) { setTimeout(function() { resolve("User logged in"); }, 1000); });}function getData() { return new Promise(function(resolve) { setTimeout(function() { resolve("Data loaded"); }, 1000); });}loginUser() .then(function(msg) { console.log(msg); return getData(); }) .then(function(data) { console.log(data); });
\`\`\`

### Output:

### User logged in

### Data loaded

## Advantages of Promises

- Avoid callback hell

- Better readability

- Easier error handling

- Supports chaining

## Common Mistakes

- Not returning promise in chain

- Forgetting catch for error handling

- Mixing callbacks and promises

- Not understanding promise states

- Writing unnecessary nested promises

## Interview Questions

- What is a Promise?

- What are its states?

- Difference between then and catch?

- What is promise chaining?

- What is Promise.all()?

- What is Promise.race()?

## Practice Exercises

- Create a simple promise

- Resolve and reject promise

- Chain multiple then methods

- Handle errors using catch

- Use Promise.all

## Mini Practice Task

### Create promise:

- Wait 2 seconds

- Return "Task completed"

## Challenge Task

### Create flow using promises:

- Login

- Fetch data

- Display result`,
    },
    {
      slug: "chapter-20-async-await",
      title: "ASYNC / AWAIT",
      summary: "Async/Await is a modern way to handle asynchronous operations in JavaScript. It is built on top of Promises and makes asynchronous code look and behave like synchronous code, improving readability and maintainability.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 19,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# ASYNC / AWAIT

## Introduction

Async/Await is a modern way to handle asynchronous operations in JavaScript. It is built on top of Promises and makes asynchronous code look and behave like synchronous code, improving readability and maintainability.

## Why Async/Await

### Problems with Promises:

- Multiple .then() chains reduce readability

- Nested logic becomes hard to follow

Async/Await solves this by writing cleaner, step-by-step code.

## async Keyword

The async keyword is used to declare a function that returns a Promise.

\`\`\`js
async function greet() { return "Hello";}greet().then(function(result) { console.log(result);});
\`\`\`

### Output:

### Hello

## await Keyword

The await keyword pauses execution until a Promise is resolved.

It can only be used inside an async function.

\`\`\`js
function fetchData() { return new Promise(function(resolve) { setTimeout(function() { resolve("Data fetched"); }, 2000); });}async function getData() { let result = await fetchData(); console.log(result);}getData();
\`\`\`

### Output:

### Data fetched

## Example Without Async/Await (Using Promises)

\`\`\`js
fetchData() .then(function(data) { console.log(data); });
\`\`\`

## Same Example With Async/Await

\`\`\`js
async function getData() { let data = await fetchData(); console.log(data);}
\`\`\`

## Handling Multiple Await

\`\`\`js
function step1() { return Promise.resolve("Step 1 done");}function step2() { return Promise.resolve("Step 2 done");}async function process() { let res1 = await step1(); console.log(res1); let res2 = await step2(); console.log(res2);}process();
\`\`\`

### Output:

### Step 1 done

### Step 2 done

## Error Handling with try...catch

\`\`\`js
async function test() { try { let result = await Promise.reject("Error occurred"); console.log(result); } catch (error) { console.log(error); }}test();
\`\`\`

### Output:

### Error occurred

## Real-World Example

\`\`\`js
function login() { return new Promise(resolve => { setTimeout(() => resolve("User logged in"), 1000); });}function getProfile() { return new Promise(resolve => { setTimeout(() => resolve("Profile loaded"), 1000); });}async function startApp() { let user = await login(); console.log(user); let profile = await getProfile(); console.log(profile);}startApp();
\`\`\`

### Output:

### User logged in

### Profile loaded

## Parallel Execution (Important)

\`\`\`js
async function run() { let p1 = fetchData(); let p2 = fetchData(); let res1 = await p1; let res2 = await p2; console.log(res1, res2);}
\`\`\`

## Using Promise.all with Async/Await

\`\`\`js
async function run() { let results = await Promise.all([fetchData(), fetchData()]); console.log(results);}
\`\`\`

## Rules of Async/Await

- await only works inside async functions

- async functions always return a Promise

- use try...catch for error handling

## Common Mistakes

- Using await outside async function

- Forgetting try...catch

- Writing sequential code when parallel needed

- Not understanding async returns promise

- Mixing callbacks, promises, and async incorrectly

## Interview Questions

- What is async/await?

- Difference between Promise and async/await?

- Can we use await outside async?

- How to handle errors in async/await?

- Does async function return a promise?

- How to run multiple async tasks in parallel?

## Practice Exercises

- Convert promise code to async/await

- Create async function with delay

- Handle error using try...catch

- Use multiple await calls

- Use Promise.all with async

## Mini Practice Task

### Create async function:

- Wait 2 seconds

- Print "Completed"

## Challenge Task

### Create system:

- Login

- Fetch orders

- Display result

### Use async/await`,
    },
    {
      slug: "chapter-21-prototypes-and-inheritance",
      title: "PROTOTYPES AND INHERITANCE",
      summary: "JavaScript uses prototypes to implement inheritance. Every object in JavaScript has a hidden property called [[Prototype]], which links it to another object. This mechanism is called the prototype chain. Understanding prototypes is important for: Object reuse…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 20,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# PROTOTYPES AND INHERITANCE

## Introduction

JavaScript uses prototypes to implement inheritance. Every object in JavaScript has a hidden property called [[Prototype]], which links it to another object. This mechanism is called the prototype chain.

Understanding prototypes is important for:

Object reuse

Memory efficiency

Understanding how JavaScript works internally

## What is Prototype

A prototype is an object from which other objects inherit properties and methods.

Every JavaScript object has a prototype.

## Example: Basic Object

\`\`\`js
let obj = { name: "Ali"};console.log(obj);
\`\`\`

Even though we only define name, the object has many built-in methods like toString(). These come from its prototype.

## Prototype Chain

If a property is not found in the object, JavaScript looks in its prototype.

If not found there, it continues up the chain.

## Example: Prototype Chain

\`\`\`js
let arr = [1, 2, 3];console.log(arr.toString());
\`\`\`

### Explanation:

toString() is not defined in array, but it exists in its prototype.

## proto (Accessing Prototype)

\`\`\`js
let obj = {};console.log(obj.__proto__);
\`\`\`

### Note:

__proto__ is used for learning, not recommended in production.

## Using Object.create()

Creates a new object with specified prototype.

\`\`\`js
let parent = { greet: function() { console.log("Hello"); }};let child = Object.create(parent);child.greet();
\`\`\`

### Output:

### Hello

## Constructor Functions and Prototype

\`\`\`js
function Person(name) { this.name = name;}Person.prototype.sayHello = function() { console.log("Hello " + this.name);};let p1 = new Person("Ali");p1.sayHello();
\`\`\`

### Output:

### Hello Ali

## Why Use Prototype

### If methods are defined inside constructor:

\`\`\`js
function Person(name) { this.name = name; this.sayHello = function() { console.log("Hello " + this.name); };}
\`\`\`

### Each object gets its own copy → memory waste

### Using prototype → shared method

## Inheritance Using Prototype

\`\`\`js
let animal = { eat: function() { console.log("Eating"); }};let dog = Object.create(animal);dog.bark = function() { console.log("Barking");};dog.eat();dog.bark();
\`\`\`

### Output:

### Eating

### Barking

## Prototype Chain Example

\`\`\`js
let grandparent = { greet: function() { console.log("Hello from grandparent"); }};let parent = Object.create(grandparent);let child = Object.create(parent);child.greet();
\`\`\`

### Output:

### Hello from grandparent

## hasOwnProperty()

Checks if property belongs to object itself.

\`\`\`js
let obj = { name: "Ali" };console.log(obj.hasOwnProperty("name")); // trueconsole.log(obj.hasOwnProperty("toString")); // false
\`\`\`

## Real-World Example

\`\`\`js
function Product(name, price) { this.name = name; this.price = price;}Product.prototype.getPrice = function() { return this.price;};let p = new Product("Laptop", 50000);console.log(p.getPrice());
\`\`\`

### Output:

### 50000

## Difference: Prototype vs Class

## Common Mistakes

- Defining methods inside constructor instead of prototype

- Misunderstanding prototype chain

- Using proto in production

- Confusing object copy with inheritance

- Not using hasOwnProperty

## Interview Questions

- What is prototype in JavaScript?

- What is prototype chain?

- Difference between proto and prototype?

- Why use prototype instead of constructor methods?

- What is inheritance in JavaScript?

- What is Object.create()?

## Practice Exercises

- Create object and access prototype

- Create constructor and add method using prototype

- Implement inheritance using Object.create

- Use hasOwnProperty

- Trace prototype chain

## Mini Practice Task

### Create constructor:

- User (name, age)

- Add method using prototype

- Print details

## Challenge Task

### Create system:

- Animal → eat()

- Dog → bark()

- Use prototype inheritance`,
    },
    {
      slug: "chapter-22-classes-es6",
      title: "CLASSES (ES6)",
      summary: "Classes in JavaScript provide a cleaner and more structured way to create objects and implement inheritance. They are built on top of prototypes but offer a syntax similar to other programming languages. Classes make code easier to read, maintain, and…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 21,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# CLASSES (ES6)

## Introduction

Classes in JavaScript provide a cleaner and more structured way to create objects and implement inheritance. They are built on top of prototypes but offer a syntax similar to other programming languages.

Classes make code easier to read, maintain, and organize.

## What is a Class

A class is a blueprint for creating objects.

### Example:

\`\`\`py
class Person { constructor(name, age) { this.name = name; this.age = age; }}let p1 = new Person("Ali", 25);console.log(p1.name);
\`\`\`

### Output:

### Ali

## Constructor Method

The constructor is a special method used to initialize object properties.

\`\`\`py
class Car { constructor(brand) { this.brand = brand; }}let car1 = new Car("BMW");console.log(car1.brand);
\`\`\`

## Adding Methods

Methods are functions inside a class.

\`\`\`py
class Person { constructor(name) { this.name = name; } greet() { console.log("Hello " + this.name); }}let user = new Person("Ali");user.greet();
\`\`\`

### Output:

### Hello Ali

## Class Expression

Classes can also be stored in variables.

\`\`\`js
let Person = class { constructor(name) { this.name = name; }};let p = new Person("Ali");
\`\`\`

## Inheritance using extends

Classes can inherit properties and methods from another class.

\`\`\`py
class Animal { eat() { console.log("Eating"); }}class Dog extends Animal { bark() { console.log("Barking"); }}let d = new Dog();d.eat();d.bark();
\`\`\`

### Output:

### Eating

### Barking

## super Keyword

Used to call parent class constructor.

\`\`\`py
class Animal { constructor(name) { this.name = name; }}class Dog extends Animal { constructor(name, breed) { super(name); this.breed = breed; }}let d = new Dog("Tommy", "Labrador");console.log(d.name, d.breed);
\`\`\`

### Output:

### Tommy Labrador

## Method Overriding

Child class can override parent methods.

\`\`\`py
class Animal { speak() { console.log("Animal sound"); }}class Dog extends Animal { speak() { console.log("Bark"); }}let d = new Dog();d.speak();
\`\`\`

### Output:

### Bark

## Static Methods

Belong to class, not objects.

\`\`\`py
class MathUtil { static add(a, b) { return a + b; }}console.log(MathUtil.add(2, 3));
\`\`\`

### Output:

### 5

## Getters and Setters

Used to control access to properties.

\`\`\`py
class Person { constructor(name) { this._name = name; } get name() { return this._name; } set name(value) { this._name = value; }}let p = new Person("Ali");console.log(p.name);p.name = "Sara";console.log(p.name);
\`\`\`

### Output:

### Ali

### Sara

## Real-World Example

\`\`\`py
class Product { constructor(name, price) { this.name = name; this.price = price; } getPrice() { return this.price; }}class DiscountedProduct extends Product { constructor(name, price, discount) { super(name, price); this.discount = discount; } finalPrice() { return this.price - (this.price * this.discount / 100); }}let item = new DiscountedProduct("Laptop", 50000, 10);console.log(item.finalPrice());
\`\`\`

### Output:

### 45000

## Difference: Class vs Function Constructor

## Common Mistakes

- Forgetting to use new keyword

- Not calling super() in child constructor

- Confusing static methods with instance methods

- Using class without understanding prototype

- Naming conflicts with getters/setters

## Interview Questions

- What is a class in JavaScript?

- Difference between class and constructor function?

- What is inheritance in classes?

- What is super keyword?

- What are static methods?

- What are getters and setters?

## Practice Exercises

- Create a class for Student

- Add methods inside class

- Create child class using extends

- Override method

- Use static method

## Mini Practice Task

### Create class:

- User (name, age)

- Method to display details

## Challenge Task

### Create system:

- Vehicle → speed

- Car → brand

- Add method to calculate speed`,
    },
    {
      slug: "chapter-23-modules",
      title: "MODULES",
      summary: "Modules allow you to split JavaScript code into separate files and reuse them. This improves code organization, maintainability, and scalability. In modern JavaScript, modules use export and import.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 22,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# MODULES

## Introduction

Modules allow you to split JavaScript code into separate files and reuse them. This improves code organization, maintainability, and scalability.

In modern JavaScript, modules use export and import.

## Why Use Modules

- Organize code into smaller files

- Avoid global scope pollution

- Reuse code

- Improve readability

## Basic Concept

Each JavaScript file is treated as a module.

### To use code from one file in another:

- Export from one file

- Import into another

## Exporting from a Module

### Named Export

\`\`\`js
// math.jsexport function add(a, b) { return a + b;}export function subtract(a, b) { return a - b;}
\`\`\`

## Importing Named Exports

\`\`\`js
// main.jsimport { add, subtract } from './math.js';console.log(add(5, 3));console.log(subtract(5, 3));
\`\`\`

### Output:

### 8

### 2

## Default Export

A file can have one default export.

\`\`\`js
// greet.jsexport default function greet() { console.log("Hello");}
\`\`\`

## Import Default Export

\`\`\`js
// main.jsimport greet from './greet.js';greet();
\`\`\`

### Output:

### Hello

## Exporting Variables

\`\`\`js
export const pi = 3.14;
\`\`\`

## Import All

\`\`\`js
import * as math from './math.js';console.log(math.add(2, 3));
\`\`\`

## Renaming Imports

\`\`\`js
import { add as sum } from './math.js';console.log(sum(2, 3));
\`\`\`

## Module in HTML

### To use modules in browser:

\`\`\`html
<script type="module" src="main.js"></script>
\`\`\`

## Important Rules

- Use type="module" in script

- Use relative path (./)

- Modules run in strict mode

## Example Project Structure

### project/│├── index.html├── main.js├── math.js└── utils.js

## Real-World Example

### math.js

\`\`\`js
export function calculateTotal(price, quantity) { return price * quantity;}
\`\`\`

### main.js

\`\`\`js
import { calculateTotal } from './math.js';console.log(calculateTotal(100, 2));
\`\`\`

### Output:

### 200

## Benefits of Modules

- Cleaner code

- Better debugging

- Reusability

- Separation of concerns

## Common Mistakes

- Forgetting type="module"

- Wrong file path

- Using default and named exports incorrectly

- Not using .js extension

- Trying to use modules without server (in some cases)

## Interview Questions

- What are JavaScript modules?

- Difference between default and named export?

- How to import all functions?

- Why use modules?

- What is type="module"?

## Practice Exercises

- Create file and export function

- Import function in another file

- Use default export

- Rename import

- Use import *

## Mini Practice Task

### Create:

- math.js → add function

- main.js → import and use

## Challenge Task

### Create project:

- utils.js → helper functions

- api.js → API logic

- main.js → combine all`,
    },
    {
      slug: "chapter-24-error-handling",
      title: "ERROR HANDLING",
      summary: "Error handling is the process of detecting, managing, and responding to errors in a program. Proper error handling prevents applications from crashing and helps developers debug issues effectively. JavaScript provides built-in mechanisms to handle errors…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 23,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# ERROR HANDLING

## Introduction

Error handling is the process of detecting, managing, and responding to errors in a program. Proper error handling prevents applications from crashing and helps developers debug issues effectively.

JavaScript provides built-in mechanisms to handle errors safely.

## Types of Errors in JavaScript

- Syntax Errors

- Runtime Errors

- Logical Errors

## Syntax Errors

Errors in code structure.

\`\`\`js
console.log("Hello"
\`\`\`

### Explanation:

Missing closing parenthesis causes error.

## Runtime Errors

Errors during execution.

\`\`\`js
let x = y + 5;
\`\`\`

### Explanation:

Variable y is not defined.

## Logical Errors

Code runs but produces incorrect output.

\`\`\`js
let sum = 10 + "5";console.log(sum);
\`\`\`

### Output:

### "105" instead of 15

## try...catch Statement

Used to handle runtime errors.

\`\`\`js
try { let result = x + 5;} catch (error) { console.log("Error occurred");}
\`\`\`

## Example with Error Message

\`\`\`js
try { let result = x + 5;} catch (error) { console.log(error.message);}
\`\`\`

## finally Block

Executes regardless of error.

\`\`\`js
try { console.log("Try block");} catch (error) { console.log("Catch block");} finally { console.log("Finally block");}
\`\`\`

### Output:

### Try block

### Finally block

## Throwing Custom Errors

\`\`\`js
function checkAge(age) { if (age < 18) { throw new Error("Not allowed"); } return "Access granted";}try { console.log(checkAge(15));} catch (error) { console.log(error.message);}
\`\`\`

## Error Object

Provides details about error.

### Properties:

- name

- message

- stack

\`\`\`js
try { let x = y;} catch (error) { console.log(error.name); console.log(error.message);}
\`\`\`

## Handling Errors in Async Code

\`\`\`js
async function fetchData() { try { let response = await fetch("wrong-url"); let data = await response.json(); console.log(data); } catch (error) { console.log("Error:", error.message); }}
\`\`\`

## Common Error Types

- ReferenceError

- TypeError

- SyntaxError

### Example:

\`\`\`js
let x = null;console.log(x.toUpperCase());
\`\`\`

### Output:

### TypeError

## Debugging Techniques

### Using console

\`\`\`js
console.log("Debugging");
\`\`\`

### Using Breakpoints

- Open DevTools

- Go to Sources

- Add breakpoint

### Using try-catch for debugging

## Real-World Example

\`\`\`js
function withdraw(balance, amount) { if (amount > balance) { throw new Error("Insufficient balance"); } return balance - amount;}try { let result = withdraw(1000, 1500); console.log(result);} catch (error) { console.log(error.message);}
\`\`\`

### Output:

### Insufficient balance

## Best Practices

- Always handle possible errors

- Use meaningful error messages

- Avoid silent failures

- Use try-catch for risky code

- Log errors for debugging

## Common Mistakes

- Ignoring errors

- Using try-catch for normal flow

- Not throwing meaningful errors

- Forgetting finally block when needed

- Not handling async errors

## Interview Questions

- What is error handling?

- Types of errors in JavaScript?

- What is try-catch?

- What is finally block?

- How to throw custom error?

- How to handle async errors?

## Practice Exercises

- Write try-catch example

- Throw custom error

- Handle runtime error

- Print error message

- Handle async error

## Mini Practice Task

### Create function:

- Check if number is negative

- Throw error if true

## Challenge Task

### Create banking system:

- Deposit

- Withdraw

- Handle insufficient balance using errors`,
    },
      ],
    },
    {
      slug: "part-3",
      title: "Part 3 — Chapters 25–35",
      summary: "Chapters 25 to 35 of JavaScript for Web Development Master Book.",
      order: 3,
      difficulty: "intermediate",
      estimatedMinutes: 330,
      tutorials: [
    {
      slug: "chapter-25-working-with-apis",
      title: "WORKING WITH APIs",
      summary: "Working with APIs is a core skill in modern web development. APIs allow your application to communicate with external services to fetch or send data. In real-world applications, APIs are used for: Authentication (login/signup) Fetching data (users, products,…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 24,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# WORKING WITH APIs

## Introduction

Working with APIs is a core skill in modern web development. APIs allow your application to communicate with external services to fetch or send data.

In real-world applications, APIs are used for:

Authentication (login/signup)

Fetching data (users, products, weather)

Sending data (forms, orders)

## What is an API

API (Application Programming Interface) allows two systems to communicate.

### Example:

- A frontend app requests data

- Server responds with data

## What is a REST API

REST API is the most common type of API.

### It uses HTTP methods:

## API Request Flow

- Client sends request

- Server processes request

- Server sends response

- Client uses data

## Example: GET Request

\`\`\`js
async function getPosts() { let response = await fetch("https://jsonplaceholder.typicode.com/posts"); let data = await response.json(); console.log(data);}getPosts();
\`\`\`

## Understanding JSON

JSON (JavaScript Object Notation) is the format used to transfer data.

### Example:

\`\`\`js
{ "name": "Ali", "age": 25}
\`\`\`

## Displaying API Data

\`\`\`html
<ul id="list"></ul><script>async function loadUsers() { let response = await fetch("https://jsonplaceholder.typicode.com/users"); let users = await response.json(); let list = document.getElementById("list"); users.forEach(user => { let li = document.createElement("li"); li.innerText = user.name; list.appendChild(li); });}loadUsers();</script>
\`\`\`

## POST Request (Send Data)

\`\`\`js
async function addUser() { let response = await fetch("https://jsonplaceholder.typicode.com/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ali", age: 25 }) }); let data = await response.json(); console.log(data);}
\`\`\`

## PUT Request (Update Data)

\`\`\`js
fetch("https://jsonplaceholder.typicode.com/posts/1", { method: "PUT", body: JSON.stringify({ title: "Updated Title" }), headers: { "Content-Type": "application/json" }});
\`\`\`

## DELETE Request

\`\`\`js
fetch("https://jsonplaceholder.typicode.com/posts/1", { method: "DELETE"});
\`\`\`

## Handling API Errors

\`\`\`js
async function fetchData() { try { let response = await fetch("wrong-url"); if (!response.ok) { throw new Error("API error"); } let data = await response.json(); console.log(data); } catch (error) { console.log(error.message); }}
\`\`\`

## Headers in API Requests

\`\`\`js
fetch("url", { headers: { "Authorization": "Bearer token" }});
\`\`\`

## Real-World Example: Weather App

\`\`\`js
async function getWeather() { let response = await fetch("https://api.example.com/weather?city=Delhi"); let data = await response.json(); console.log("Temperature:", data.temperature);}
\`\`\`

## API Best Practices

- Always check response.ok

- Use async/await for readability

- Handle errors properly

- Use secure APIs (HTTPS)

- Avoid exposing sensitive data

## Common Mistakes

- Forgetting JSON.stringify in POST

- Not checking response status

- Wrong API endpoint

- Ignoring error handling

- Not setting headers

## Interview Questions

- What is an API?

- What is REST API?

- Difference between GET and POST?

- What is JSON?

- How to handle API errors?

- What are HTTP methods?

## Practice Exercises

- Fetch data from API

- Display data in webpage

- Send POST request

- Update data using PUT

- Delete data using DELETE

## Mini Practice Task

### Create program:

- Fetch users

- Display names in list

## Challenge Task

### Create mini dashboard:

- Fetch products

- Display in cards

- Show name, price, category`,
    },
    {
      slug: "chapter-26-form-handling-validation",
      title: "FORM HANDLING & VALIDATION",
      summary: "Forms are used to collect user input such as name, email, password, etc. Form handling involves capturing this input and processing it using JavaScript. Validation ensures that the data entered by the user is correct before submission.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 25,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# FORM HANDLING & VALIDATION

## Introduction

Forms are used to collect user input such as name, email, password, etc. Form handling involves capturing this input and processing it using JavaScript. Validation ensures that the data entered by the user is correct before submission.

## Basic Form Structure

\`\`\`html
<form id="myForm"> <input type="text" id="name" placeholder="Enter name"> <input type="email" id="email" placeholder="Enter email"> <button type="submit">Submit</button></form>
\`\`\`

## Handling Form Submission

\`\`\`js
let form = document.getElementById("myForm");form.addEventListener("submit", function(event) { event.preventDefault(); console.log("Form submitted");});
\`\`\`

### Explanation:

event.preventDefault() stops the page from reloading.

## Getting Input Values

\`\`\`js
form.addEventListener("submit", function(event) { event.preventDefault(); let name = document.getElementById("name").value; let email = document.getElementById("email").value; console.log(name, email);});
\`\`\`

## Basic Validation

\`\`\`js
form.addEventListener("submit", function(event) { event.preventDefault(); let name = document.getElementById("name").value; if (name === "") { alert("Name is required"); return; } console.log("Valid input");});
\`\`\`

## Email Validation

\`\`\`js
let email = document.getElementById("email").value;if (!email.includes("@")) { alert("Invalid email");}
\`\`\`

## Using Regular Expression (Advanced)

\`\`\`js
let emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;if (!emailPattern.test(email)) { alert("Invalid email format");}
\`\`\`

## Password Validation

\`\`\`js
let password = document.getElementById("password").value;if (password.length < 6) { alert("Password must be at least 6 characters");}
\`\`\`

## Display Error Messages

\`\`\`html
<p id="error"></p>let error = document.getElementById("error");if (name === "") { error.innerText = "Name is required";}
\`\`\`

## Real-Time Validation (Input Event)

\`\`\`js
let input = document.getElementById("name");input.addEventListener("input", function() { if (input.value.length < 3) { console.log("Too short"); }});
\`\`\`

## Form Reset

\`\`\`js
form.reset();
\`\`\`

## Real-World Example

\`\`\`html
<form id="loginForm"> <input type="text" id="username"> <input type="password" id="password"> <button type="submit">Login</button></form><script>document.getElementById("loginForm").addEventListener("submit", function(e) { e.preventDefault(); let user = document.getElementById("username").value; let pass = document.getElementById("password").value; if (user === "" || pass === "") { alert("All fields required"); return; } console.log("Login successful");});</script>
\`\`\`

## HTML5 Validation (Built-in)

\`\`\`html
<input type="email" required>
\`\`\`

### Features:

- required

- minlength

- maxlength

- pattern

## Preventing Invalid Input

\`\`\`js
if (isNaN(age)) { alert("Enter valid number");}
\`\`\`

## Best Practices

- Validate on both client and server

- Show clear error messages

- Avoid long forms

- Use proper input types

- Use real-time validation

## Common Mistakes

- Not using preventDefault

- Not validating inputs

- Poor error messages

- Relying only on frontend validation

- Ignoring edge cases

## Interview Questions

- What is form handling?

- Why use preventDefault?

- How to validate email?

- What is regex?

- Difference between client-side and server-side validation?

- How to handle form submission?

## Practice Exercises

- Create form with validation

- Validate email and password

- Display error messages

- Use regex

- Implement real-time validation

## Mini Practice Task

### Create form:

- Name and email

- Validate both fields

- Show error if empty

## Challenge Task

### Create registration form:

- Username

- Email

- Password

- Confirm password

### Validate all fields properly`,
    },
    {
      slug: "chapter-27-local-storage-session-storage",
      title: "LOCAL STORAGE & SESSION STORAGE",
      summary: "Local Storage and Session Storage are browser features used to store data on the client side. They allow web applications to save data in the browser so it can be used later without needing a server.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 26,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# LOCAL STORAGE & SESSION STORAGE

## Introduction

Local Storage and Session Storage are browser features used to store data on the client side. They allow web applications to save data in the browser so it can be used later without needing a server.

## Why Use Browser Storage

- Store user preferences

- Save login state

- Store cart data

- Persist data across page reloads

## Types of Storage

- Local Storage

- Session Storage

## Local Storage

- Stores data permanently (until manually cleared)

- Shared across tabs of same origin

### Storing Data

\`\`\`js
localStorage.setItem("name", "Ali");
\`\`\`

### Retrieving Data

\`\`\`js
let name = localStorage.getItem("name");console.log(name);
\`\`\`

### Output:

### Ali

### Removing Data

\`\`\`js
localStorage.removeItem("name");
\`\`\`

### Clearing All Data

\`\`\`js
localStorage.clear();
\`\`\`

## Session Storage

- Stores data temporarily

- Data is removed when tab is closed

### Example

\`\`\`js
sessionStorage.setItem("user", "Ali");let user = sessionStorage.getItem("user");console.log(user);
\`\`\`

## Difference Between Local and Session Storage

## Storing Objects (Important)

Storage only supports strings. Use JSON.

\`\`\`js
let user = { name: "Ali", age: 25 };localStorage.setItem("user", JSON.stringify(user));
\`\`\`

### Retrieving Object

\`\`\`js
let data = localStorage.getItem("user");let user = JSON.parse(data);console.log(user.name);
\`\`\`

### Output:

### Ali

## Real-World Example: Todo App Storage

\`\`\`js
let tasks = ["Task1", "Task2"];localStorage.setItem("tasks", JSON.stringify(tasks));let storedTasks = JSON.parse(localStorage.getItem("tasks"));console.log(storedTasks);
\`\`\`

## Example: Save Form Data

\`\`\`js
document.getElementById("name").addEventListener("input", function(e) { localStorage.setItem("username", e.target.value);});
\`\`\`

## Loading Stored Data

\`\`\`js
let savedName = localStorage.getItem("username");if (savedName) { document.getElementById("name").value = savedName;}
\`\`\`

## Storage Limit

- Usually around 5MB per domain

- Depends on browser

## Best Practices

- Use JSON for complex data

- Clear unused data

- Avoid storing sensitive information

- Check for null before using data

## Common Mistakes

- Forgetting JSON.stringify

- Not parsing JSON data

- Storing sensitive data

- Overwriting data unintentionally

- Not checking if data exists

## Interview Questions

- What is localStorage?

- Difference between localStorage and sessionStorage?

- How to store objects in localStorage?

- What is JSON.stringify?

- What is JSON.parse?

- Is localStorage secure?

## Practice Exercises

- Store and retrieve simple value

- Store object using JSON

- Remove specific item

- Use sessionStorage

- Build small storage system

## Mini Practice Task

### Create program:

- Store username

- Retrieve and display on reload

## Challenge Task

### Enhance Todo App:

- Store tasks in localStorage

- Load tasks on page refresh`,
    },
    {
      slug: "chapter-28-debugging-techniques",
      title: "DEBUGGING TECHNIQUES",
      summary: "Debugging is the process of finding and fixing errors in a program. Every developer spends a significant amount of time debugging code. Good debugging skills help in: Identifying errors quickly Understanding program behavior Writing better code",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 27,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# DEBUGGING TECHNIQUES

## Introduction

Debugging is the process of finding and fixing errors in a program. Every developer spends a significant amount of time debugging code.

Good debugging skills help in:

Identifying errors quickly

Understanding program behavior

Writing better code

## Types of Bugs

- Syntax Errors

- Runtime Errors

- Logical Errors

## Using console.log()

The most basic debugging method.

\`\`\`js
let x = 10;console.log(x);
\`\`\`

### Debugging Example

\`\`\`js
let a = 5;let b = 10;console.log("a:", a);console.log("b:", b);console.log("sum:", a + b);
\`\`\`

## Console Methods

\`\`\`js
console.log()
\`\`\`

\`\`\`js
console.log("Message");
\`\`\`

\`\`\`js
console.error()
\`\`\`

\`\`\`js
console.error("Error message");
\`\`\`

\`\`\`js
console.warn()
\`\`\`

\`\`\`js
console.warn("Warning message");
\`\`\`

\`\`\`js
console.table()
\`\`\`

\`\`\`js
let users = [ { name: "Ali", age: 25 }, { name: "Sara", age: 30 }];console.table(users);
\`\`\`

## Using Breakpoints

### Steps:

- Open DevTools (F12)

- Go to Sources tab

- Click on line number

- Code pauses at that line

## Step-by-Step Execution

- Step Over → next line

- Step Into → inside function

- Step Out → exit function

## Using debugger Keyword

\`\`\`js
let x = 10;debugger;x += 5;console.log(x);
\`\`\`

### Explanation:

Execution pauses at debugger line.

## Inspecting Variables

### While paused:

- Hover over variables

- Check values

- Modify values

## Network Debugging

- Go to Network tab

- Check API requests

- Inspect response

## Debugging DOM Issues

### Common checks:

\`\`\`js
console.log(document.getElementById("id"));
\`\`\`

### If null → element not found

## Debugging Events

\`\`\`js
button.addEventListener("click", function() { console.log("Clicked");});
\`\`\`

## Debugging Async Code

\`\`\`js
async function test() { console.log("Start"); let data = await fetch("url"); console.log(data); console.log("End");}
\`\`\`

## Real-World Example

\`\`\`js
function calculateTotal(price, quantity) { console.log("Price:", price); console.log("Quantity:", quantity); let total = price * quantity; console.log("Total:", total); return total;}calculateTotal(100, 2);
\`\`\`

## Debugging Strategies

- Check error message carefully

- Use console logs at key points

- Break problem into small parts

- Test with simple inputs

- Verify assumptions

## Common Mistakes

- Ignoring console errors

- Not checking null values

- Misplacing console.log

- Debugging without understanding flow

- Not using DevTools properly

## Interview Questions

- What is debugging?

- How do you debug JavaScript code?

- What is breakpoint?

- What is debugger keyword?

- How to debug API calls?

- What are console methods?

## Practice Exercises

- Use console.log to debug

- Add breakpoint and inspect values

- Use debugger keyword

- Debug DOM selection issue

- Debug API response

## Mini Practice Task

### Create program:

- Write function with bug

- Use console to find error

## Challenge Task

### Create app:

- Fetch API data

- Add intentional error

- Debug and fix it`,
    },
    {
      slug: "chapter-29-calculator-project",
      title: "CALCULATOR PROJECT",
      summary: "This project builds a basic calculator using HTML, CSS, and JavaScript. It demonstrates: DOM manipulation Event handling Working with user input Implementing logic This is a common beginner project and useful for interviews.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 28,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# CALCULATOR PROJECT

## Introduction

This project builds a basic calculator using HTML, CSS, and JavaScript. It demonstrates:

DOM manipulation

Event handling

Working with user input

Implementing logic

This is a common beginner project and useful for interviews.

## Problem Statement

### Create a calculator that can:

- Perform addition, subtraction, multiplication, division

- Take input from buttons

- Display result

## Project Structure

### project/│├── index.html├── style.css└── script.js

## Step 1: HTML Structure

<!DOCTYPE html><html><head> <title>Calculator</title></head><body><h2>Calculator</h2><input type="text" id="display" readonly><br><button onclick="appendValue('7')">7</button><button onclick="appendValue('8')">8</button><button onclick="appendValue('9')">9</button><button onclick="appendValue('/')">/</button><br><button onclick="appendValue('4')">4</button><button onclick="appendValue('5')">5</button><button onclick="appendValue('6')">6</button><button onclick="appendValue('*')">*</button><br><button onclick="appendValue('1')">1</button><button onclick="appendValue('2')">2</button><button onclick="appendValue('3')">3</button><button onclick="appendValue('-')">-</button><br><button onclick="appendValue('0')">0</button><button onclick="clearDisplay()">C</button><button onclick="calculate()">=</button><button onclick="appendValue('+')">+</button><script src="script.js"></script></body></html>

## Step 2: JavaScript Logic

\`\`\`js
let display = document.getElementById("display");function appendValue(value) { display.value += value;}function clearDisplay() { display.value = "";}function calculate() { try { display.value = eval(display.value); } catch { display.value = "Error"; }}
\`\`\`

## Explanation

- appendValue → adds numbers/operators

- clearDisplay → clears input

- calculate → evaluates expression

## Output

### User clicks buttons → values appear in display

### Press "=" → result is shown

## Step 3: Basic Styling (Optional)

\`\`\`js
body { font-family: Arial;}button { width: 50px; height: 40px; margin: 5px;}
\`\`\`

## Improved Version (Without eval)

### Using safer approach:

\`\`\`js
function calculate() { let exp = display.value; let result = Function("return " + exp)(); display.value = result;}
\`\`\`

## Adding Keyboard Support

\`\`\`js
document.addEventListener("keydown", function(e) { if (!isNaN(e.key) || "+-*/.".includes(e.key)) { appendValue(e.key); } if (e.key === "Enter") { calculate(); } if (e.key === "Backspace") { display.value = display.value.slice(0, -1); }});
\`\`\`

## Real-World Enhancements

- Add decimal support

- Add history

- Add scientific functions

- Add UI improvements

## Common Mistakes

- Using eval without validation

- Not handling invalid expressions

- Not clearing display properly

- Ignoring keyboard input

- Poor UI layout

## Interview Questions

- How does calculator logic work?

- Why is eval risky?

- How to handle invalid input?

- How to improve calculator?

- How to add keyboard support?

## Practice Exercises

- Add decimal support

- Add backspace button

- Add square root function

- Improve UI

- Prevent invalid input

## Mini Practice Task

### Modify calculator:

- Add "%" operator

- Handle percentage

## Challenge Task

### Build advanced calculator:

- History tracking

- Dark mode

- Keyboard support

- Error handling`,
    },
    {
      slug: "chapter-30-todo-app-advanced-with-local-storage",
      title: "TODO APP (ADVANCED WITH LOCAL STORAGE)",
      summary: "This chapter upgrades the basic Todo App by adding persistent storage using localStorage. Now tasks will remain saved even after page reload. This project demonstrates: DOM manipulation Event handling Local storage usage Data persistence",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 29,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# TODO APP (ADVANCED WITH LOCAL STORAGE)

## Introduction

This chapter upgrades the basic Todo App by adding persistent storage using localStorage. Now tasks will remain saved even after page reload.

This project demonstrates:

DOM manipulation

Event handling

Local storage usage

Data persistence

## Problem Statement

### Create a Todo App where user can:

- Add tasks

- Delete tasks

- Mark tasks as completed

- Save tasks permanently

## Project Structure

### project/│├── index.html├── style.css└── script.js

## Step 1: HTML Structure

<!DOCTYPE html><html><head> <title>Todo App</title></head><body><h2>Todo App</h2><input type="text" id="taskInput" placeholder="Enter task"><button id="addBtn">Add Task</button><ul id="taskList"></ul><script src="script.js"></script></body></html>

## Step 2: JavaScript Setup

\`\`\`js
let input = document.getElementById("taskInput");let button = document.getElementById("addBtn");let list = document.getElementById("taskList");let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
\`\`\`

## Step 3: Save Tasks to Local Storage

\`\`\`js
function saveTasks() { localStorage.setItem("tasks", JSON.stringify(tasks));}
\`\`\`

## Step 4: Render Tasks

\`\`\`js
function renderTasks() { list.innerHTML = ""; tasks.forEach((task, index) => { let li = document.createElement("li"); li.innerText = task.text; if (task.completed) { li.style.textDecoration = "line-through"; } li.addEventListener("click", function() { tasks[index].completed = !tasks[index].completed; saveTasks(); renderTasks(); }); let deleteBtn = document.createElement("button"); deleteBtn.innerText = "Delete"; deleteBtn.addEventListener("click", function() { tasks.splice(index, 1); saveTasks(); renderTasks(); }); li.appendChild(deleteBtn); list.appendChild(li); });}
\`\`\`

## Step 5: Add Task

\`\`\`js
button.addEventListener("click", function() { let taskText = input.value; if (taskText === "") return; tasks.push({ text: taskText, completed: false }); saveTasks(); renderTasks(); input.value = "";});
\`\`\`

## Step 6: Load Tasks on Page Load

\`\`\`js
renderTasks();
\`\`\`

## Explanation

- tasks array stores all tasks

- localStorage stores data permanently

- renderTasks updates UI

- saveTasks saves data

## Output

- Tasks remain after page reload

- Tasks can be marked complete

- Tasks can be deleted

## Full Combined Code

\`\`\`js
let input = document.getElementById("taskInput");let button = document.getElementById("addBtn");let list = document.getElementById("taskList");let tasks = JSON.parse(localStorage.getItem("tasks")) || [];function saveTasks() { localStorage.setItem("tasks", JSON.stringify(tasks));}function renderTasks() { list.innerHTML = ""; tasks.forEach((task, index) => { let li = document.createElement("li"); li.innerText = task.text; if (task.completed) { li.style.textDecoration = "line-through"; } li.addEventListener("click", function() { tasks[index].completed = !task.completed; saveTasks(); renderTasks(); }); let deleteBtn = document.createElement("button"); deleteBtn.innerText = "Delete"; deleteBtn.addEventListener("click", function() { tasks.splice(index, 1); saveTasks(); renderTasks(); }); li.appendChild(deleteBtn); list.appendChild(li); });}button.addEventListener("click", function() { let taskText = input.value; if (taskText === "") return; tasks.push({ text: taskText, completed: false }); saveTasks(); renderTasks(); input.value = "";});renderTasks();
\`\`\`

## Real-World Enhancements

- Add edit task feature

- Add filters (completed / pending)

- Add due dates

- Add drag and drop

- Add categories

## Common Mistakes

- Forgetting JSON.parse / stringify

- Not updating UI after change

- Incorrect indexing

- Overwriting localStorage

- Not handling empty input

## Interview Questions

- How does localStorage work?

- How to persist data in browser?

- How to update UI dynamically?

- What is JSON.stringify?

- How to handle state in JavaScript?

## Practice Exercises

- Add edit feature

- Add clear all button

- Add task count

- Add completed filter

- Improve UI

## Mini Practice Task

### Add feature:

- Show total tasks count

## Challenge Task

### Build full Todo App:

- Local storage

- Filters

- Edit task

- Responsive UI`,
    },
    {
      slug: "chapter-31-weather-app-api-based",
      title: "WEATHER APP (API BASED)",
      summary: "This project builds a Weather App using JavaScript and an external API. It demonstrates: Fetch API usage Async/Await DOM manipulation Handling user input Displaying real-time data This is a very common real-world and interview project.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 30,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# WEATHER APP (API BASED)

## Introduction

This project builds a Weather App using JavaScript and an external API. It demonstrates:

Fetch API usage

Async/Await

DOM manipulation

Handling user input

Displaying real-time data

This is a very common real-world and interview project.

## Problem Statement

### Create a Weather App where a user can:

- Enter a city name

- Fetch weather data from API

- Display temperature and condition

## Project Structure

### project/│├── index.html├── style.css└── script.js

## Step 1: HTML Structure

<!DOCTYPE html><html><head> <title>Weather App</title></head><body><h2>Weather App</h2><input type="text" id="city" placeholder="Enter city"><button id="btn">Get Weather</button><p id="result"></p><script src="script.js"></script></body></html>

## Step 2: API Setup

### Use a public weather API (example structure):

\`\`\`js
https://api.example.com/weather?city=Delhi
\`\`\`

### Response example:

\`\`\`js
{ "temp": 25, "condition": "Cloudy"}
\`\`\`

## Step 3: JavaScript Logic

\`\`\`js
let button = document.getElementById("btn");button.addEventListener("click", async function() { let city = document.getElementById("city").value; if (city === "") { alert("Enter city name"); return; } try { let response = await fetch(\`https://api.example.com/weather?city=\${city}\`); if (!response.ok) { throw new Error("City not found"); } let data = await response.json(); document.getElementById("result").innerText = \`Temperature: \${data.temp}°C, Condition: \${data.condition}\`; } catch (error) { document.getElementById("result").innerText = error.message; }});
\`\`\`

## Explanation

- Get city input

- Send API request

- Convert response to JSON

- Display result

- Handle errors

## Output

### User enters "Delhi":

### Temperature: 25°C, Condition: Cloudy

## Step 4: Improve UI (Optional)

\`\`\`js
body { font-family: Arial; text-align: center;}input { padding: 5px;}button { padding: 5px 10px;}
\`\`\`

## Using Real API (Example: OpenWeather)

\`\`\`js
let apiKey = "YOUR_API_KEY";let url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${apiKey}&units=metric\`;
\`\`\`

## Extract Data

\`\`\`js
let temp = data.main.temp;let condition = data.weather[0].main;
\`\`\`

## Real-World Example

\`\`\`js
document.getElementById("btn").addEventListener("click", async function() { let city = document.getElementById("city").value; let apiKey = "YOUR_API_KEY"; let url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${apiKey}&units=metric\`; try { let response = await fetch(url); let data = await response.json(); document.getElementById("result").innerText = \`\${data.name}: \${data.main.temp}°C, \${data.weather[0].main}\`; } catch { document.getElementById("result").innerText = "Error fetching data"; }});
\`\`\`

## Real-World Enhancements

- Add weather icons

- Show humidity and wind speed

- Add loading spinner

- Auto-detect location

- Add forecast (5-day)

## Common Mistakes

- Forgetting API key

- Wrong API URL

- Not handling errors

- Not checking response.ok

- Not parsing JSON correctly

## Interview Questions

- How does Fetch API work in this project?

- What is async/await?

- How do you handle API errors?

- What is JSON response?

- How to improve this app?

## Practice Exercises

- Add humidity display

- Add wind speed

- Add loading message

- Improve UI

- Handle invalid city

## Mini Practice Task

### Modify app:

- Show only temperature

## Challenge Task

### Build advanced weather app:

- Show 5-day forecast

- Add icons

- Save last searched city`,
    },
    {
      slug: "chapter-32-mini-e-commerce-ui",
      title: "MINI E-COMMERCE UI",
      summary: "This project builds a basic e-commerce interface using JavaScript. It demonstrates: Rendering products dynamically Managing cart functionality Updating UI in real-time Handling user interactions This is a practical project often expected in frontend roles.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 31,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# MINI E-COMMERCE UI

## Introduction

This project builds a basic e-commerce interface using JavaScript. It demonstrates:

Rendering products dynamically

Managing cart functionality

Updating UI in real-time

Handling user interactions

This is a practical project often expected in frontend roles.

## Problem Statement

### Create a Mini E-commerce UI where a user can:

- View products

- Add products to cart

- Remove products from cart

- See total price

## Project Structure

### project/│├── index.html├── style.css└── script.js

## Step 1: HTML Structure

<!DOCTYPE html><html><head> <title>E-commerce</title></head><body><h2>Products</h2><div id="productList"></div><h2>Cart</h2><ul id="cartList"></ul><p id="total"></p><script src="script.js"></script></body></html>

## Step 2: Product Data

\`\`\`js
let products = [ { id: 1, name: "Laptop", price: 50000 }, { id: 2, name: "Phone", price: 20000 }, { id: 3, name: "Headphones", price: 2000 }];let cart = [];
\`\`\`

## Step 3: Display Products

\`\`\`js
let productList = document.getElementById("productList");function renderProducts() { products.forEach(product => { let div = document.createElement("div"); div.innerHTML = \` \${product.name} - ₹\${product.price} <button onclick="addToCart(\${product.id})">Add</button> \`; productList.appendChild(div); });}renderProducts();
\`\`\`

## Step 4: Add to Cart

\`\`\`js
function addToCart(id) { let product = products.find(p => p.id === id); cart.push(product); renderCart();}
\`\`\`

## Step 5: Display Cart

\`\`\`js
let cartList = document.getElementById("cartList");let totalEl = document.getElementById("total");function renderCart() { cartList.innerHTML = ""; let total = 0; cart.forEach((item, index) => { let li = document.createElement("li"); li.innerHTML = \` \${item.name} - ₹\${item.price} <button onclick="removeFromCart(\${index})">Remove</button> \`; cartList.appendChild(li); total += item.price; }); totalEl.innerText = "Total: ₹" + total;}
\`\`\`

## Step 6: Remove from Cart

\`\`\`js
function removeFromCart(index) { cart.splice(index, 1); renderCart();}
\`\`\`

## Explanation

- products array stores items

- cart array stores selected items

- renderProducts shows products

- renderCart updates cart UI and total

## Output

- Products displayed with Add button

- Cart updates dynamically

- Total price updates

## Full Combined Code

\`\`\`js
let products = [ { id: 1, name: "Laptop", price: 50000 }, { id: 2, name: "Phone", price: 20000 }, { id: 3, name: "Headphones", price: 2000 }];let cart = [];let productList = document.getElementById("productList");let cartList = document.getElementById("cartList");let totalEl = document.getElementById("total");function renderProducts() { productList.innerHTML = ""; products.forEach(product => { let div = document.createElement("div"); div.innerHTML = \` \${product.name} - ₹\${product.price} <button onclick="addToCart(\${product.id})">Add</button> \`; productList.appendChild(div); });}function addToCart(id) { let product = products.find(p => p.id === id); cart.push(product); renderCart();}function removeFromCart(index) { cart.splice(index, 1); renderCart();}function renderCart() { cartList.innerHTML = ""; let total = 0; cart.forEach((item, index) => { let li = document.createElement("li"); li.innerHTML = \` \${item.name} - ₹\${item.price} <button onclick="removeFromCart(\${index})">Remove</button> \`; cartList.appendChild(li); total += item.price; }); totalEl.innerText = "Total: ₹" + total;}renderProducts();
\`\`\`

## Real-World Enhancements

- Add quantity feature

- Store cart in localStorage

- Add product images

- Add search/filter

- Add checkout system

## Common Mistakes

- Not updating UI after cart change

- Incorrect indexing in remove

- Forgetting to clear previous elements

- Not calculating total properly

- Direct DOM manipulation without structure

## Interview Questions

- How does cart system work?

- How to manage state in JavaScript?

- How to optimize rendering?

- How to persist cart data?

- How to improve this project?

## Practice Exercises

- Add quantity to cart

- Store cart in localStorage

- Add product images

- Add search feature

- Improve UI

## Mini Practice Task

### Add feature:

- Show number of items in cart

## Challenge Task

### Build advanced e-commerce UI:

- Add product filtering

- Add cart persistence

- Add checkout page`,
    },
    {
      slug: "chapter-33-javascript-interview-questions",
      title: "JAVASCRIPT INTERVIEW QUESTIONS",
      summary: "This chapter covers commonly asked JavaScript interview questions. These include conceptual, output-based, and scenario-based questions that are frequently asked in frontend and full-stack interviews.",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 32,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# JAVASCRIPT INTERVIEW QUESTIONS

## Introduction

This chapter covers commonly asked JavaScript interview questions. These include conceptual, output-based, and scenario-based questions that are frequently asked in frontend and full-stack interviews.

## Basic Concept Questions

### What is JavaScript

JavaScript is a high-level, interpreted programming language used to create dynamic and interactive web applications. It runs in the browser and can also run on the server using Node.js.

### Difference between var, let, const

### What is closure

A closure is a function that remembers variables from its outer scope even after the outer function has finished execution.

### What is hoisting

Hoisting is JavaScript behavior where variable and function declarations are moved to the top of their scope before execution.

### What is event loop

Event loop handles asynchronous operations and ensures non-blocking execution in JavaScript.

### Difference between == and ===

- == compares value only

- === compares value and type

### What is DOM

DOM is a representation of HTML document that allows JavaScript to access and modify elements.

## Output-Based Questions

### 1.

\`\`\`js
console.log(5 + "5");
\`\`\`

### Output:

### "55"

### 2.

\`\`\`js
console.log(typeof null);
\`\`\`

### Output:

### object

### 3.

\`\`\`js
console.log(0 == false);console.log(0 === false);
\`\`\`

### Output:

### true

### false

### 4.

\`\`\`js
let x;console.log(x);
\`\`\`

### Output:

### undefined

### 5.

\`\`\`js
console.log([] + []);
\`\`\`

### Output:

### "" (empty string)

### 6.

\`\`\`js
console.log([] + {});
\`\`\`

### Output:

### "[object Object]"

## Function-Based Questions

### What is a callback function

A function passed as an argument to another function.

### What are arrow functions

Short syntax functions introduced in ES6.

### Difference between function declaration and expression

- Declaration is hoisted

- Expression is not hoisted

### What is IIFE

Immediately Invoked Function Expression executes immediately after definition.

## Asynchronous JavaScript Questions

### What is Promise

An object that represents future completion of an async operation.

### What is async/await

A cleaner way to handle promises using synchronous-like syntax.

### What is callback hell

Nested callbacks making code unreadable.

### Difference between synchronous and asynchronous

- Synchronous → line by line

- Asynchronous → non-blocking

## DOM & Event Questions

### What is event bubbling

Event moves from child to parent.

### What is event delegation

Handling events on parent element instead of child.

### Difference between querySelector and getElementById

- querySelector uses CSS selectors

- getElementById uses id only

## Object & Array Questions

### Difference between map and forEach

- map returns new array

- forEach does not return

### What is destructuring

Extract values from arrays or objects into variables.

### What is spread operator

Used to expand elements.

### What is rest operator

Used to collect multiple values.

## Advanced Questions

### What is prototype

Mechanism for inheritance in JavaScript.

### What is this keyword

Refers to current object.

### What is class in JavaScript

Blueprint for creating objects.

### What is module

A file containing reusable code.

## Scenario-Based Questions

### How to handle API errors

Use try-catch with async/await and check response.ok.

### How to optimize performance

- Reduce DOM manipulation

- Use caching

- Optimize loops

### How to manage state in JavaScript

- Use variables

- Use localStorage

- Use frameworks

### How to debug JavaScript

- Use console.log

- Use DevTools

- Use breakpoints

## Coding Questions

### Reverse String

\`\`\`js
function reverse(str) { return str.split("").reverse().join("");}
\`\`\`

### Check Palindrome

\`\`\`js
function isPalindrome(str) { let reversed = str.split("").reverse().join(""); return str === reversed;}
\`\`\`

### Find Largest Number

\`\`\`js
function max(arr) { return Math.max(...arr);}
\`\`\`

## Common Mistakes in Interviews

- Not understanding basics

- Writing incorrect syntax

- Not explaining logic

- Ignoring edge cases

- Poor debugging skills

## Practice Tips

- Practice output questions daily

- Write code manually

- Explain concepts clearly

- Build projects

- Revise fundamentals

## Mini Practice Task

### Explain:

- Closure

- Promise

- Event loop

## Challenge Task

### Solve:

- Reverse string

- Find duplicates in array

- Implement simple API call`,
    },
    {
      slug: "chapter-34-coding-problems",
      title: "CODING PROBLEMS",
      summary: "This chapter contains important coding problems frequently asked in interviews. These problems help build logic, problem-solving ability, and coding confidence. Each problem includes: Problem statement Approach Code Explanation",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 33,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# CODING PROBLEMS

## Introduction

This chapter contains important coding problems frequently asked in interviews. These problems help build logic, problem-solving ability, and coding confidence.

Each problem includes:

Problem statement

Approach

Code

Explanation

## Problem 1: Reverse a String

### Problem

Reverse a given string.

### Approach

- Convert string to array

- Reverse array

- Join back to string

### Code

\`\`\`js
function reverseString(str) { return str.split("").reverse().join("");}console.log(reverseString("hello"));
\`\`\`

### Output

### olleh

### Explanation

- split("") → converts string to array

- reverse() → reverses array

- join("") → converts back to string

## Problem 2: Check Palindrome

### Problem

Check if a string is palindrome.

### Code

\`\`\`js
function isPalindrome(str) { let reversed = str.split("").reverse().join(""); return str === reversed;}console.log(isPalindrome("madam"));
\`\`\`

### Output

### true

## Problem 3: Find Maximum Number in Array

### Code

\`\`\`js
function findMax(arr) { return Math.max(...arr);}console.log(findMax([1, 5, 3, 9]));
\`\`\`

### Output

### 9

## Problem 4: Find Minimum Number

\`\`\`js
function findMin(arr) { return Math.min(...arr);}
\`\`\`

## Problem 5: Sum of Array

\`\`\`js
function sumArray(arr) { return arr.reduce((sum, num) => sum + num, 0);}
\`\`\`

## Problem 6: Count Vowels

\`\`\`js
function countVowels(str) { let count = 0; let vowels = "aeiou"; for (let char of str.toLowerCase()) { if (vowels.includes(char)) { count++; } } return count;}
\`\`\`

## Problem 7: Remove Duplicates from Array

\`\`\`js
function removeDuplicates(arr) { return [...new Set(arr)];}
\`\`\`

## Problem 8: Factorial

\`\`\`js
function factorial(n) { if (n === 0) return 1; return n * factorial(n - 1);}
\`\`\`

## Problem 9: Check Even or Odd

\`\`\`js
function isEven(n) { return n % 2 === 0;}
\`\`\`

## Problem 10: FizzBuzz

\`\`\`js
function fizzBuzz(n) { for (let i = 1; i <= n; i++) { if (i % 3 === 0 && i % 5 === 0) console.log("FizzBuzz"); else if (i % 3 === 0) console.log("Fizz"); else if (i % 5 === 0) console.log("Buzz"); else console.log(i); }}
\`\`\`

## Problem 11: Find Duplicate Elements

\`\`\`js
function findDuplicates(arr) { let seen = new Set(); let duplicates = []; for (let num of arr) { if (seen.has(num)) { duplicates.push(num); } else { seen.add(num); } } return duplicates;}
\`\`\`

## Problem 12: Sort Array

\`\`\`js
function sortArray(arr) { return arr.sort((a, b) => a - b);}
\`\`\`

## Problem 13: Capitalize First Letter

\`\`\`js
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1);}
\`\`\`

## Problem 14: Count Occurrences

\`\`\`js
function countOccurrences(arr, value) { return arr.filter(x => x === value).length;}
\`\`\`

## Problem 15: Flatten Array

\`\`\`js
function flatten(arr) { return arr.flat();}
\`\`\`

## Real-World Example

\`\`\`js
let prices = [100, 200, 300];let total = prices.reduce((sum, price) => sum + price, 0);console.log(total);
\`\`\`

## Common Mistakes

- Not handling edge cases

- Writing inefficient code

- Forgetting return statement

- Using wrong data structures

- Not understanding problem properly

## Interview Questions

- How to optimize array operations?

- Difference between map, filter, reduce?

- How to remove duplicates?

- How to reverse string?

- How to handle edge cases?

## Practice Exercises

- Reverse words in sentence

- Find second largest number

- Check anagram

- Merge two arrays

- Find missing number

## Mini Practice Task

### Solve:

- Reverse string

- Find max

- Remove duplicates

## Challenge Task

### Solve:

- Implement custom map function

- Implement custom reduce

- Build mini problem solver`,
    },
    {
      slug: "chapter-35-scenario-based-questions",
      title: "SCENARIO-BASED QUESTIONS",
      summary: "Scenario-based questions test your practical understanding of JavaScript. Instead of theory, you are given real-world situations and asked how you would solve them. These questions are commonly asked in interviews to evaluate: Problem-solving ability…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 34,
      tags: "javascript-for-web-development-master-book",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# SCENARIO-BASED QUESTIONS

## Introduction

Scenario-based questions test your practical understanding of JavaScript. Instead of theory, you are given real-world situations and asked how you would solve them.

These questions are commonly asked in interviews to evaluate:

Problem-solving ability

Real-world thinking

Code design skills

## Scenario 1: Form Not Submitting Correctly

### Problem

Form reloads page and data is not processed.

### Solution

\`\`\`js
form.addEventListener("submit", function(event) { event.preventDefault(); console.log("Form handled");});
\`\`\`

### Explanation

preventDefault() stops page reload and allows custom handling.

## Scenario 2: API Not Returning Data

### Problem

Data is not showing after API call.

### Solution

\`\`\`js
async function fetchData() { try { let response = await fetch("url"); if (!response.ok) { throw new Error("API error"); } let data = await response.json(); console.log(data); } catch (error) { console.log(error.message); }}
\`\`\`

### Explanation

Check response.ok and handle errors properly.

## Scenario 3: Button Click Not Working

### Problem

Click event is not triggered.

### Solution

\`\`\`js
document.getElementById("btn").addEventListener("click", function() { console.log("Clicked");});
\`\`\`

### Possible Causes

- Wrong ID

- Script loaded before DOM

- Event not attached

## Scenario 4: Slow Performance in Large List

### Problem

Rendering many elements slows down page.

### Solution

- Use document fragment

- Minimize DOM updates

\`\`\`js
let fragment = document.createDocumentFragment();for (let i = 0; i < 1000; i++) { let li = document.createElement("li"); li.innerText = i; fragment.appendChild(li);}list.appendChild(fragment);
\`\`\`

## Scenario 5: Duplicate Items in Array

### Problem

Array contains duplicate values.

### Solution

\`\`\`js
let unique = [...new Set(arr)];
\`\`\`

## Scenario 6: Data Lost After Page Reload

### Problem

User data disappears after refresh.

### Solution

### Use localStorage:

\`\`\`js
localStorage.setItem("data", JSON.stringify(data));
\`\`\`

## Scenario 7: Infinite Loop Issue

### Problem

Loop runs endlessly.

### Solution

### Check condition:

\`\`\`js
while (i < 10) { i++;}
\`\`\`

## Scenario 8: Cannot Access Variable Outside Function

### Problem

Variable not accessible.

### Solution

### Use proper scope:

\`\`\`js
function test() { let x = 10; return x;}let result = test();console.log(result);
\`\`\`

## Scenario 9: Handling Multiple Click Events

### Problem

Many elements need same event.

### Solution (Event Delegation)

\`\`\`js
document.getElementById("list").addEventListener("click", function(e) { console.log(e.target.innerText);});
\`\`\`

## Scenario 10: Form Validation Fails

### Problem

Invalid data is submitted.

### Solution

\`\`\`js
if (input.value === "") { alert("Required");}
\`\`\`

## Scenario 11: Incorrect Output in Async Code

### Problem

\`\`\`js
console.log("Start");setTimeout(() => console.log("Async"), 0);console.log("End");
\`\`\`

### Output

### Start

### End

### Async

### Explanation

Async code executes after synchronous code due to event loop.

## Scenario 12: Need to Clone Object

### Problem

Object changes affect original.

### Solution

\`\`\`js
let copy = { ...original };
\`\`\`

## Scenario 13: Sorting Not Working Properly

### Problem

\`\`\`js
[10, 2, 5].sort();
\`\`\`

### Output

### [10, 2, 5]

### Solution

\`\`\`js
[10, 2, 5].sort((a, b) => a - b);
\`\`\`

## Scenario 14: Cannot Handle API Errors

### Solution

### Use try-catch:

\`\`\`js
try { let data = await fetch(url);} catch (e) { console.log(e);}
\`\`\`

## Scenario 15: Need to Delay Execution

### Solution

\`\`\`js
setTimeout(() => { console.log("Delayed");}, 2000);
\`\`\`

## Real-World Scenario

### Shopping Cart Issue

### Problem: Total price incorrect

### Solution:

\`\`\`js
let total = cart.reduce((sum, item) => sum + item.price, 0);
\`\`\`

## Common Mistakes

- Ignoring error handling

- Not understanding async flow

- Poor DOM manipulation

- Incorrect scope usage

- Inefficient loops

## Interview Questions

- How to debug real-world issues?

- How to optimize performance?

- How to handle async problems?

- How to manage large data?

- How to design scalable code?

## Practice Exercises

- Fix a broken form

- Debug API issue

- Optimize loop

- Handle duplicates

- Improve UI performance

## Mini Practice Task

### Solve:

- Prevent form reload

- Fix event issue

## Challenge Task

### Build system:

- API integration

- Error handling

- Data persistence

### END OF BOOK`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 — Chapters 1–12", title: "INTRODUCTION TO JAVASCRIPT", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 0, tutorialSlug: "chapter-1-introduction-to-javascript" },
  { part: "Part 1 — Chapters 1–12", title: "SETTING UP ENVIRONMENT", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 1, tutorialSlug: "chapter-2-setting-up-environment" },
  { part: "Part 1 — Chapters 1–12", title: "VARIABLES AND DATA TYPES", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 2, tutorialSlug: "chapter-3-variables-and-data-types" },
  { part: "Part 1 — Chapters 1–12", title: "OPERATORS AND EXPRESSIONS", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 3, tutorialSlug: "chapter-4-operators-and-expressions" },
  { part: "Part 1 — Chapters 1–12", title: "CONTROL FLOW", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 4, tutorialSlug: "chapter-5-control-flow" },
  { part: "Part 1 — Chapters 1–12", title: "FUNCTIONS IN DEPTH", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 5, tutorialSlug: "chapter-6-functions-in-depth" },
  { part: "Part 1 — Chapters 1–12", title: "SCOPE AND CLOSURES", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 6, tutorialSlug: "chapter-7-scope-and-closures" },
  { part: "Part 1 — Chapters 1–12", title: "HOISTING", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 7, tutorialSlug: "chapter-8-hoisting" },
  { part: "Part 1 — Chapters 1–12", title: "EXECUTION CONTEXT & CALL STACK", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 8, tutorialSlug: "chapter-9-execution-context-call-stack" },
  { part: "Part 1 — Chapters 1–12", title: "OBJECTS IN JAVASCRIPT", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 9, tutorialSlug: "chapter-10-objects-in-javascript" },
  { part: "Part 1 — Chapters 1–12", title: "ARRAYS AND METHODS", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 10, tutorialSlug: "chapter-11-arrays-and-methods" },
  { part: "Part 1 — Chapters 1–12", title: "DESTRUCTURING", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 11, tutorialSlug: "chapter-12-destructuring" },
  { part: "Part 2 — Chapters 13–24", title: "SPREAD AND REST OPERATORS", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 12, tutorialSlug: "chapter-13-spread-and-rest-operators" },
  { part: "Part 2 — Chapters 13–24", title: "WHAT IS DOM", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 13, tutorialSlug: "chapter-14-what-is-dom" },
  { part: "Part 2 — Chapters 13–24", title: "SELECTING ELEMENTS", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 14, tutorialSlug: "chapter-15-selecting-elements" },
  { part: "Part 2 — Chapters 13–24", title: "EVENT HANDLING", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 15, tutorialSlug: "chapter-16-event-handling" },
  { part: "Part 2 — Chapters 13–24", title: "DOM PROJECT — TODO APP", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 16, tutorialSlug: "chapter-17-dom-project-todo-app" },
  { part: "Part 2 — Chapters 13–24", title: "CALLBACKS", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 17, tutorialSlug: "chapter-18-callbacks" },
  { part: "Part 2 — Chapters 13–24", title: "PROMISES", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 18, tutorialSlug: "chapter-19-promises" },
  { part: "Part 2 — Chapters 13–24", title: "ASYNC / AWAIT", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 19, tutorialSlug: "chapter-20-async-await" },
  { part: "Part 2 — Chapters 13–24", title: "PROTOTYPES AND INHERITANCE", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 20, tutorialSlug: "chapter-21-prototypes-and-inheritance" },
  { part: "Part 2 — Chapters 13–24", title: "CLASSES (ES6)", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 21, tutorialSlug: "chapter-22-classes-es6" },
  { part: "Part 2 — Chapters 13–24", title: "MODULES", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 22, tutorialSlug: "chapter-23-modules" },
  { part: "Part 2 — Chapters 13–24", title: "ERROR HANDLING", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 23, tutorialSlug: "chapter-24-error-handling" },
  { part: "Part 3 — Chapters 25–35", title: "WORKING WITH APIs", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 24, tutorialSlug: "chapter-25-working-with-apis" },
  { part: "Part 3 — Chapters 25–35", title: "FORM HANDLING & VALIDATION", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 25, tutorialSlug: "chapter-26-form-handling-validation" },
  { part: "Part 3 — Chapters 25–35", title: "LOCAL STORAGE & SESSION STORAGE", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 26, tutorialSlug: "chapter-27-local-storage-session-storage" },
  { part: "Part 3 — Chapters 25–35", title: "DEBUGGING TECHNIQUES", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 27, tutorialSlug: "chapter-28-debugging-techniques" },
  { part: "Part 3 — Chapters 25–35", title: "CALCULATOR PROJECT", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 28, tutorialSlug: "chapter-29-calculator-project" },
  { part: "Part 3 — Chapters 25–35", title: "TODO APP (ADVANCED WITH LOCAL STORAGE)", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 29, tutorialSlug: "chapter-30-todo-app-advanced-with-local-storage" },
  { part: "Part 3 — Chapters 25–35", title: "WEATHER APP (API BASED)", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 30, tutorialSlug: "chapter-31-weather-app-api-based" },
  { part: "Part 3 — Chapters 25–35", title: "MINI E-COMMERCE UI", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 31, tutorialSlug: "chapter-32-mini-e-commerce-ui" },
  { part: "Part 3 — Chapters 25–35", title: "JAVASCRIPT INTERVIEW QUESTIONS", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 32, tutorialSlug: "chapter-33-javascript-interview-questions" },
  { part: "Part 3 — Chapters 25–35", title: "CODING PROBLEMS", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 33, tutorialSlug: "chapter-34-coding-problems" },
  { part: "Part 3 — Chapters 25–35", title: "SCENARIO-BASED QUESTIONS", subtitle: "Part of Part 3 — Chapters 25–35 · Intermediate", order: 34, tutorialSlug: "chapter-35-scenario-based-questions" },
]

async function main() {
  const domain = await db.domain.findUnique({ where: { slug: "software-engineering" } })
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
    where: { slug: "javascript-web-development-master-book-path" },
    create: { slug: "javascript-web-development-master-book-path", title: "JavaScript for Web Development Master Book Roadmap", tagline: "The complete roadmap for JavaScript for Web Development Master Book - all parts in order.", description: "The complete roadmap for JavaScript for Web Development Master Book - all parts in order.", icon: "Globe", color: "oklch(0.68 0.17 240)", difficulty: 'intermediate', estimatedHours: 6, published: true },
    update: { title: "JavaScript for Web Development Master Book Roadmap", tagline: "The complete roadmap for JavaScript for Web Development Master Book - all parts in order.", description: "The complete roadmap for JavaScript for Web Development Master Book - all parts in order.", icon: "Globe", color: "oklch(0.68 0.17 240)", difficulty: 'intermediate', estimatedHours: 6 },
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
