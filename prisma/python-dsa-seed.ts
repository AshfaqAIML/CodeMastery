import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

// ============================================================
// Python DSA - imported by scripts/import-course/pipeline.py
// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.
// ============================================================

const subject = {
  slug: "python-dsa",
  name: "Python DSA",
  tagline: "Data structures and algorithms in Python — intuition, practice, and interviews.",
  description: "Learn data structures and algorithms using Python with topic-wise explanations and practice.",
  icon: "Code2",
  color: "oklch(0.66 0.16 160)",
  category: "Programming",
  order: 79,
  modules: [
    {
      slug: "part-1",
      title: "Part 1 — Chapters 1–12",
      summary: "Chapters 1 to 12 of Python DSA.",
      order: 1,
      difficulty: "intermediate",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-1-introduction-to-algorithms-and-problem-solving",
      title: "Introduction to Algorithms and Problem Solving",
      summary: "In computer science, most problems are solved by designing a clear sequence of steps that a computer can follow. These step-by-step instructions are called algorithms. An algorithm is a precise set of instructions used to solve a problem or perform a…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 0,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key takeaways from this chapter:"],
      selfAssessment: [],
      content: `# Introduction to Algorithms and Problem Solving

## Introduction

In computer science, most problems are solved by designing a clear sequence of steps that a computer can follow. These step-by-step instructions are called algorithms.

An algorithm is a precise set of instructions used to solve a problem or perform a computation.

Algorithms are the foundation of programming. Every software application—from simple calculators to large-scale systems like search engines—relies on algorithms to process data and produce results.

For example:

A search engine uses algorithms to find relevant web pages.

A navigation app uses algorithms to determine the shortest path between locations.

A social media platform uses algorithms to recommend posts or friends.

While algorithms define how problems are solved, data structures define how data is organized. Together, algorithms and data structures form the backbone of efficient software systems.

In this chapter, we will learn:

What algorithms are

Why data structures are important

How computers solve problems

How to think algorithmically

How to represent algorithms using pseudocode and flowcharts

This chapter builds the foundation for understanding all future data structures and algorithms in this book.

## Intuition Behind the Concept

Before studying algorithms formally, it is helpful to think about how humans solve problems step by step.

Consider a simple everyday activity.

### Example: Making Tea

### When making tea, you follow a sequence of steps:

- Boil water

- Add tea leaves

- Add sugar

- Add milk

- Pour into a cup

This sequence of steps is essentially an algorithm.

If the steps are followed correctly, the result will be tea. If the steps are incorrect or missing, the result may be wrong.

Another example is searching for a phone number in a directory.

### Example: Searching a Phone Directory

If the directory is unsorted, you may scan each name one by one.

If the directory is sorted alphabetically, you can quickly locate a name by jumping to the correct section.

This difference in strategy represents different algorithms, where one approach is more efficient than another.

Thus, algorithms are simply structured methods of solving problems efficiently.

## Problem the Concept Solves

Computers process enormous amounts of data. Without efficient algorithms and data structures, solving problems would be extremely slow.

Consider the problem of searching for a number in a list.

### Suppose we have:

### [3, 9, 12, 15, 21, 34, 40]

To find the number 21, one naive approach is to check every element.

This approach is called linear search.

But if the list is sorted, we can use a smarter approach called binary search, which reduces the number of comparisons drastically.

### Without good algorithms:

- Programs become slow

- Systems cannot scale

- Large datasets become difficult to process

### Efficient algorithms allow computers to:

- process large datasets

- respond quickly

- optimize resource usage

This is why algorithm design is a core skill for software engineers.

## Core Theory

## What is an Algorithm

An algorithm is a finite sequence of well-defined instructions used to solve a problem.

### Properties of an algorithm:

- Input – An algorithm may take zero or more inputs.

- Output – It must produce at least one output.

- Definiteness – Each step must be clearly defined.

- Finiteness – The algorithm must terminate after a finite number of steps.

- Effectiveness – Each operation must be simple enough to perform.

### Example algorithm:

Find the largest number in a list.

### Steps:

- Start with the first number as the maximum.

- Compare it with the next number.

- If the next number is larger, update the maximum.

- Continue until the list ends.

- Output the maximum number.

## Why Data Structures Matter

Algorithms operate on data. The way data is stored significantly affects algorithm efficiency.

A data structure is a method of organizing and storing data so that it can be accessed and modified efficiently.

### Examples:

### For example:

Searching for an element in a list may take longer than searching in a hash table, because the data is organized differently.

### Thus:

### Good algorithms + appropriate data structures = efficient programs

## Real-World Examples of Algorithms

Algorithms appear in almost every modern technology.

### Examples include:

### Search Engines

Google uses ranking algorithms to determine which pages appear first in search results.

### Navigation Systems

GPS applications compute the shortest path using graph algorithms such as Dijkstra’s algorithm.

### Social Media

Platforms like Facebook and Instagram use recommendation algorithms to show relevant posts.

### Banking Systems

Fraud detection algorithms analyze transaction patterns.

### Streaming Platforms

Netflix and Spotify use algorithms to recommend movies or music.

## How Computers Solve Problems

### Computers solve problems through the following steps:

- Input – Receive data

- Processing – Apply algorithms

- Output – Produce results

### Example:

Problem: Find the largest number in a list.

### Input:

### [10, 45, 22, 78, 34]

### Processing:

Compare numbers step by step.

### Output:

### 78

The algorithm transforms input data into meaningful output.

## Algorithmic Thinking

Algorithmic thinking is the ability to solve problems by breaking them into smaller logical steps.

### This process typically involves:

- Understanding the problem

- Breaking the problem into sub-problems

- Designing a sequence of steps

- Testing the solution

### Example:

Problem: Sort a list of numbers.

### Algorithmic thinking suggests:

- Compare elements

- Swap them if needed

- Repeat until the list is sorted

This logical approach is essential for programming and software engineering.

## Writing Step-by-Step Solutions

Before writing code, it is helpful to describe the solution as clear steps.

### Example problem:

Find the largest number in a list.

### Step-by-step solution:

- Start

- Assume first number is largest

- Compare with next number

- Update largest if needed

- Repeat until end

- Print largest number

- Stop

This process helps programmers design solutions before coding.

## Pseudocode

Pseudocode is a simplified way of writing algorithms using plain language that resembles programming logic.

It avoids strict programming syntax.

### Example pseudocode:

\`\`\`py
Algorithm FindLargest(A)max ← A[0]for each element in A: if element > max: max ← elementreturn max
\`\`\`

### Advantages of pseudocode:

- easy to understand

- language independent

- focuses on logic instead of syntax

## Flowcharts

A flowchart is a visual representation of an algorithm.

It shows the flow of execution using symbols.

### Common symbols:

### Example flowchart logic:

### Start |Read number |Is number > max ? |Yes → Update max |No |Continue loop |End

Flowcharts help visualize complex algorithms.

## Visualization

Example algorithm: Finding the largest number.

### List:

### [5, 12, 7, 20, 15]

### Step-by-step comparison:

Initial max = 5Compare 12 → max = 12Compare 7 → max = 12Compare 20 → max = 20Compare 15 → max = 20

### Final result:

### Largest number = 20

This visualization helps understand how the algorithm processes each element.

## Python Implementation

Example: Find the largest number in a list.

\`\`\`py
def find_largest(numbers): # assume first element is largest largest = numbers[0] for num in numbers: if num > largest: largest = num return largestnumbers = [5, 12, 7, 20, 15]result = find_largest(numbers)print("Largest number:", result)
\`\`\`

## Code Walkthrough

Step 1: The function receives a list of numbers.

### numbers = [5, 12, 7, 20, 15]

Step 2: The first element is assumed to be the largest.

### largest = numbers[0]

Step 3: The loop checks each number.

### for num in numbers

Step 4: If a number is greater than the current largest value, update it.

### if num > largest

Step 5: After checking all elements, the final value is returned.

## Time and Space Complexity

### For a list of n elements:

### Time Complexity

The algorithm must examine every element.

### Space Complexity

### O(1)

Only one variable (largest) is used.

## Variations and Related Techniques

Many algorithmic problems involve similar patterns.

### Related techniques include:

### Searching Algorithms

- Linear Search

- Binary Search

### Sorting Algorithms

- Bubble Sort

- Merge Sort

- Quick Sort

### Optimization Techniques

- Divide and Conquer

- Dynamic Programming

- Greedy Algorithms

These techniques will be explored in later chapters.

## Real-World Applications

Algorithms are essential in many real-world systems.

### Search Engines

Algorithms rank pages based on relevance and popularity.

### Navigation Systems

Shortest path algorithms determine the fastest routes.

### Databases

Indexing algorithms allow fast retrieval of records.

### Operating Systems

Scheduling algorithms decide which processes run next.

### Recommendation Systems

Machine learning algorithms suggest products or content.

## Common Mistakes Beginners Make

### Writing unclear algorithm steps

Steps must be precise and unambiguous.

### Ignoring edge cases

### Examples:

- empty list

- single element list

### Inefficient solutions

Using nested loops unnecessarily can make algorithms slow.

### Mixing algorithm logic with programming syntax

Always design the algorithm before coding.

## Interview Tips

Interviewers frequently test algorithmic thinking.

### Common questions include:

- Find the maximum element

- Reverse a list

- Detect duplicates

- Find missing numbers

### Interviewers expect candidates to:

- Explain the logic

- Analyze time complexity

- Write clean code

- Handle edge cases

Practice writing algorithms clearly before implementing them.

## Summary

• An algorithm is a step-by-step method for solving a problem.

• Algorithms must be finite, well-defined, and effective.

• Data structures organize data for efficient processing.

• Algorithmic thinking involves breaking problems into smaller steps.

• Pseudocode helps describe algorithms independent of programming languages.

• Flowcharts visualize algorithm flow.

• Efficient algorithms improve program performance and scalability.

## Practice Section

## Conceptual Questions

- What is an algorithm?

- What are the key properties of a good algorithm?

- Why are data structures important in algorithm design?

- What is the difference between pseudocode and actual code?

- Why are flowcharts useful when designing algorithms?

## Coding Exercises

- Write a Python function to find the smallest element in a list.

- Write a program that counts the number of occurrences of a number in a list.

- Write a Python function that reverses a list without using built-in functions.

## Interview-Level Problems

- Given a list of integers, find the second largest number.

- Given a list of numbers, determine whether duplicates exist in the list.

If you want, I can also generate the next chapter (Python Basics for Data Structures) in the same professional textbook style, so your book builds chapter by chapter.`,
    },
    {
      slug: "chapter-2-python-basics-for-data-structures",
      title: "Python Basics for Data Structures",
      summary: "Before studying advanced data structures and algorithms, it is essential to understand the Python programming concepts used to implement them. Data structures such as arrays, stacks, queues, trees, and graphs are ultimately implemented using programming…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 1,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts learned in this chapter:"],
      selfAssessment: [],
      content: `# Python Basics for Data Structures

## Introduction

Before studying advanced data structures and algorithms, it is essential to understand the Python programming concepts used to implement them.

Data structures such as arrays, stacks, queues, trees, and graphs are ultimately implemented using programming constructs like variables, loops, functions, and collections. Python provides powerful built-in structures that make algorithm implementation easier and more expressive.

In this chapter, we will review the Python fundamentals that are most important for understanding data structures and algorithms.

The topics covered include:

Variables and memory

Python data types

Input and output

Conditional statements

Loops

Functions

Lists and tuples

Dictionaries and sets

These concepts form the programming foundation required to implement and analyze algorithms effectively.

## Intuition Behind the Concept

Programming can be compared to giving instructions to a computer.

Imagine instructing a robot to organize books in a library.

### To complete this task, the robot must:

- Remember information about books

- Make decisions

- Repeat tasks

- Store collections of books

- Follow reusable instructions

### These tasks correspond directly to programming constructs:

Python provides tools that allow programmers to perform these operations efficiently.

When implementing algorithms, these programming tools allow us to translate logical steps into executable programs.

## Problem the Concept Solves

Algorithms describe the logical solution to a problem, but programming languages provide the mechanism to implement those solutions.

### For example, suppose we want to solve the problem:

Find the largest number in a list.

### The algorithm describes the steps:

- Start with the first element.

- Compare with the next element.

- Update the maximum value.

### To implement this algorithm in Python, we need:

- variables to store values

- loops to iterate through elements

- conditions to compare numbers

- functions to organize the solution

Without understanding these programming constructs, implementing algorithms becomes difficult.

Therefore, mastering these Python basics enables us to convert algorithmic ideas into working programs.

## Core Theory

## Variables and Memory

A variable is a named location used to store data in memory.

In Python, variables are created when a value is assigned.

### Example:

### x = 10name = "Alice"price = 19.99

### Here:

- x stores an integer

- name stores a string

- price stores a floating-point number

Python automatically manages memory allocation.

### Dynamic Typing

Python uses dynamic typing, meaning the variable type is determined automatically.

### Example:

### x = 10x = "Hello"

The variable x can hold different types during program execution.

### Memory Reference

Variables in Python store references to objects in memory.

### Example:

### a = [1, 2, 3]b = a

Both a and b reference the same list object.

Changing one will affect the other.

## Data Types

A data type defines the type of value a variable can store.

### Common Python data types include:

### Example:

### age = 25height = 5.8name = "John"is_student = True

Understanding data types is important because algorithms manipulate data stored in these structures.

## Input and Output

Programs interact with users using input and output operations.

### Input

Python uses the input() function to receive user input.

### Example:

### name = input("Enter your name: ")

### Output

The print() function displays results.

### Example:

\`\`\`py
print("Hello", name)
\`\`\`

### Example program:

### number = int(input("Enter a number: "))print("You entered:", number)

This interaction allows algorithms to process user-provided data.

## Conditional Statements

Conditional statements allow programs to make decisions.

### Python supports:

- if

- elif

- else

### Example:

### number = 10if number > 0: print("Positive number")else: print("Negative number")

### Example with multiple conditions:

score = 85if score >= 90: print("Grade A")elif score >= 80: print("Grade B")else: print("Grade C")

Conditional logic is essential for implementing algorithms.

## Loops

Loops allow programs to repeat actions multiple times.

### Two main types exist in Python:

### For Loop

Used to iterate through sequences.

### Example:

### for i in range(5): print(i)

### Output:

### 01234

### While Loop

Repeats as long as a condition is true.

### Example:

### i = 0while i < 5: print(i) i += 1

### Loops are heavily used in algorithms for:

- searching

- sorting

- traversing data structures

## Functions

A function is a reusable block of code that performs a specific task.

Functions help organize programs and improve readability.

### Example:

\`\`\`py
def greet(name): print("Hello", name)greet("Alice")
\`\`\`

Functions can return values.

### Example:

\`\`\`py
def add(a, b): return a + bresult = add(5, 3)print(result)
\`\`\`

In algorithm design, functions are used to implement reusable operations.

## Lists and Tuples

Lists and tuples store ordered collections of elements.

### Lists

Lists are mutable, meaning they can be modified.

### Example:

### numbers = [10, 20, 30, 40]numbers.append(50)numbers.remove(20)print(numbers)

### Common list operations:

Lists behave similarly to dynamic arrays.

### Tuples

Tuples are immutable collections.

### Example:

### coordinates = (10, 20)

Tuples cannot be modified after creation.

They are often used for fixed data structures.

## Dictionaries and Sets

### Dictionaries

A dictionary stores key-value pairs.

### Example:

\`\`\`py
student = { "name": "Ali", "age": 21, "grade": "A"}print(student["name"])
\`\`\`

Dictionaries provide fast lookup operations, making them useful in many algorithms.

### Sets

A set is an unordered collection of unique elements.

### Example:

\`\`\`py
numbers = {1, 2, 3, 4}numbers.add(5)
\`\`\`

### Sets are useful for:

- removing duplicates

- membership testing

## Visualization

### Example list traversal:

### List:

### [10, 20, 30, 40]

### Index positions:

### Index: 0 1 2 3 ┌───┬───┬───┬───┐Value │10 │20 │30 │40 │ └───┴───┴───┴───┘

### Traversal:

### Step 1 → 10Step 2 → 20Step 3 → 30Step 4 → 40

Traversal is a common operation used in many algorithms.

## Python Implementation

Example: Reverse a string.

\`\`\`py
def reverse_string(text): reversed_text = "" for char in text: reversed_text = char + reversed_text return reversed_textword = "algorithm"result = reverse_string(word)print("Reversed string:", result)
\`\`\`

## Code Walkthrough

Step 1: The function receives a string.

### text = "algorithm"

Step 2: An empty string is created to store the reversed result.

### reversed_text = ""

Step 3: The loop iterates through each character.

### for char in text

Step 4: Each character is added to the front of the new string.

### reversed_text = char + reversed_text

Step 5: After processing all characters, the reversed string is returned.

## Time and Space Complexity

Let n be the length of the string.

### Time Complexity

Each character is processed once.

### O(n)

### Space Complexity

A new string of length n is created.

### O(n)

## Variations and Related Techniques

Python provides alternative ways to reverse a string.

### Using slicing

### text[::-1]

### Using reversed()

### "".join(reversed(text))

However, implementing algorithms manually helps understand the logic behind operations.

## Real-World Applications

Python collections are used in many software systems.

### Web Applications

Lists store user sessions and request data.

### Databases

Dictionaries represent records and query results.

### Data Analysis

Lists and arrays process large datasets.

### Machine Learning

Data structures store model parameters and training data.

## Common Mistakes Beginners Make

### Confusing mutable and immutable types

Lists can be modified; tuples cannot.

### Infinite loops

Forgetting to update loop variables.

### Incorrect indexing

Python indexing starts at 0, not 1.

### Modifying lists during iteration

This can lead to unexpected behavior.

## Interview Tips

### Common beginner interview questions include:

- Reverse a string

- Find the maximum element in a list

- Count frequency of characters

- Remove duplicates from a list

### Interviewers usually evaluate:

- understanding of loops

- ability to manipulate lists

- clean Python coding style

Strong knowledge of Python basics helps solve algorithm problems efficiently.

## Summary

• Variables store values in memory.

• Python supports multiple data types such as integers, strings, lists, dictionaries, and sets.

• Input and output operations allow programs to interact with users.

• Conditional statements enable decision-making in programs.

• Loops allow repeated execution of code.

• Functions help organize and reuse code.

• Lists, tuples, dictionaries, and sets store collections of data.

These concepts form the programming foundation for implementing data structures and algorithms.

## Practice Section

## Conceptual Questions

- What is the difference between a list and a tuple?

- Why are functions useful in programming?

- What is the difference between a for loop and a while loop?

- Why are dictionaries useful for fast lookups?

- What is the difference between mutable and immutable data types?

## Coding Exercises

- Write a Python function that finds the maximum element in a list.

- Write a program that counts the frequency of characters in a string.

- Write a Python function that removes duplicates from a list.

## Interview-Level Problems

- Given a string, determine whether it is a palindrome.

- Given a list of integers, return the indices of two numbers whose sum equals a target value.`,
    },
    {
      slug: "chapter-3-understanding-time-and-space-complexity",
      title: "Understanding Time and Space Complexity",
      summary: "When designing algorithms, correctness is not the only important factor. An algorithm must also be efficient. As input sizes grow larger, inefficient algorithms may become too slow or consume excessive memory. Time complexity and space complexity are measures…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 2,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key ideas from this chapter:"],
      selfAssessment: [],
      content: `# Understanding Time and Space Complexity

## Introduction

When designing algorithms, correctness is not the only important factor. An algorithm must also be efficient. As input sizes grow larger, inefficient algorithms may become too slow or consume excessive memory.

Time complexity and space complexity are measures used to evaluate the performance of algorithms.

Time complexity describes how long an algorithm takes to run as the input size increases.

Space complexity describes how much memory an algorithm uses.

Understanding algorithm efficiency is essential in computer science because real-world applications often deal with large datasets.

For example:

A search engine processes billions of web pages.

A social network manages millions of users.

A navigation system computes routes across thousands of locations.

If inefficient algorithms are used in such systems, the software would become slow or unusable.

In this chapter, we will learn:

Why algorithm efficiency matters

What time complexity is

What space complexity is

Big-O notation

Best, average, and worst-case analysis

How algorithm growth affects performance

This chapter introduces the tools needed to analyze and compare algorithms.

## Intuition Behind the Concept

To understand algorithm efficiency, consider a simple real-life scenario.

### Example: Searching for a Name in a Phone Book

Suppose you want to find a person named John in a phone book.

There are two possible approaches.

### Approach 1: Check Every Name

You start at the first page and read each name until you find John.

This may require checking many entries.

### Approach 2: Use Alphabetical Ordering

Because the phone book is sorted alphabetically, you can jump directly to the section where names starting with J appear.

This approach is much faster.

Both approaches solve the same problem, but one is more efficient.

Algorithm analysis helps us measure this difference.

## Problem the Concept Solves

When solving computational problems, multiple algorithms may exist.

Consider sorting numbers.

### Example list:

### [8, 3, 5, 2, 9]

### There are many sorting algorithms:

- Bubble Sort

- Merge Sort

- Quick Sort

- Heap Sort

All of them produce a sorted list, but their performance differs dramatically.

For small lists, the difference may not be noticeable. However, for large datasets the difference becomes significant.

### Example:

### Sorting 10 elements

→ almost any algorithm works.

### Sorting 10 million elements

→ inefficient algorithms become extremely slow.

### Algorithm analysis helps developers:

- compare different solutions

- predict performance

- design scalable systems

## Core Theory

## Why Algorithm Efficiency Matters

Suppose an algorithm processes a list of numbers.

### If the algorithm performs:

- 10 operations for 10 inputs

- 100 operations for 100 inputs

- 1000 operations for 1000 inputs

the algorithm scales linearly.

However, some algorithms grow much faster.

### Example:

This rapid growth causes performance problems.

Algorithm efficiency determines whether software can handle large-scale data.

## Time Complexity

Time complexity measures how the running time of an algorithm grows as input size increases.

Instead of measuring exact time in seconds, computer scientists measure the number of operations performed.

Let n represent the input size.

### Example:

### If an algorithm checks each element in a list once:

### operations = n

This is called linear time complexity.

### Example: Linear Search

### Algorithm:

Search for a number in a list by checking each element.

### Python implementation:

\`\`\`py
def linear_search(arr, target): for i in range(len(arr)): if arr[i] == target: return i return -1
\`\`\`

If the list contains n elements, the algorithm may check up to n elements.

### Time complexity:

### O(n)

## Space Complexity

Space complexity measures how much memory an algorithm uses relative to input size.

### Memory usage includes:

- variables

- data structures

- recursion stack

- temporary storage

### Example:

\`\`\`py
def sum_list(numbers): total = 0 for num in numbers: total += num return total
\`\`\`

### Memory usage:

- one variable (total)

- one loop variable

### Space complexity:

### O(1)

This is called constant space complexity.

## Big-O Notation

Big-O notation describes the upper bound of algorithm growth.

It focuses on how performance scales as n becomes very large.

### Common Big-O complexities:

### Big-O ignores:

- constants

- lower-order terms

### Example:

### 5n + 20

### In Big-O notation:

### O(n)

Because the linear term dominates growth.

## Best, Average, and Worst Case

Algorithm performance can vary depending on input.

### Best Case

The minimum time required.

### Example:

Searching for the first element in a list.

### Average Case

Expected performance across typical inputs.

### Worst Case

The maximum time required.

### Example:

Searching for the last element in a list.

### Example for linear search:

## Growth of Algorithms

Understanding algorithm growth helps predict performance.

### Consider the following complexities:

### O(1)O(log n)O(n)O(n log n)O(n²)O(2ⁿ)

### Visualization:

Input Size (n) → Performance GrowthO(1) → constantO(log n) → slow growthO(n) → linear growthO(n²) → rapid growthO(2ⁿ) → extremely fast growth

### Example comparison:

Quadratic algorithms become inefficient very quickly.

## Visualization

### Example: Nested Loops

### for i in range(n): for j in range(n): print(i, j)

### Visualization:

i = 0 → run j loop n timesi = 1 → run j loop n timesi = 2 → run j loop n times...

### Total operations:

### n × n = n²

### Time complexity:

### O(n²)

## Python Implementation

Example: Counting pairs in a list.

\`\`\`py
def count_pairs(numbers): count = 0 for i in range(len(numbers)): for j in range(len(numbers)): count += 1 return countnums = [1, 2, 3, 4]print(count_pairs(nums))
\`\`\`

## Code Walkthrough

Step 1: The function receives a list of numbers.

### numbers = [1,2,3,4]

Step 2: Two nested loops iterate over the list.

### Outer loop:

### for i in range(len(numbers))

### Inner loop:

### for j in range(len(numbers))

Step 3: For every iteration of the outer loop, the inner loop runs completely.

### If n = 4:

### Total operations = 4 × 4 = 16

Thus the algorithm runs in quadratic time.

## Time and Space Complexity

Let n represent list size.

### Time Complexity

### Nested loops:

### O(n²)

### Space Complexity

Only one variable (count) is used.

### O(1)

## Variations and Related Techniques

Many techniques are used to reduce algorithm complexity.

### Examples:

### Divide and Conquer

Break problems into smaller parts.

### Examples:

- Merge Sort

- Quick Sort

- Binary Search

### Dynamic Programming

Reuse previously computed results.

### Example:

- Fibonacci optimization

- Knapsack problem

### Greedy Algorithms

Choose the best option at each step.

### Example:

- Activity selection

- Minimum spanning tree

These techniques help design more efficient algorithms.

## Real-World Applications

Algorithm complexity analysis is crucial in real systems.

### Search Engines

Efficient indexing allows rapid search across billions of pages.

### Databases

Query optimization relies on algorithm analysis.

### Navigation Systems

Shortest path algorithms must run quickly.

### Operating Systems

Scheduling algorithms must efficiently manage processes.

### Machine Learning

Training algorithms must handle large datasets.

## Common Mistakes Beginners Make

### Ignoring algorithm efficiency

Beginners often focus only on correctness.

### Misunderstanding nested loops

Nested loops usually increase complexity significantly.

### Overlooking worst-case scenarios

Worst-case analysis is important for reliability.

### Misinterpreting Big-O notation

Big-O measures growth, not exact execution time.

## Interview Tips

Algorithm complexity is one of the most common topics in coding interviews.

### Interviewers frequently ask candidates to:

- analyze time complexity

- compare different solutions

- optimize inefficient code

### Example question:

### What is the time complexity of binary search?

### Answer:

### O(log n)

Candidates should be comfortable analyzing loops, recursion, and nested structures.

## Summary

• Time complexity measures how running time grows with input size.

• Space complexity measures memory usage.

• Big-O notation describes algorithm growth rates.

• Common complexities include O(1), O(log n), O(n), O(n log n), O(n²).

• Algorithms may have best, average, and worst-case performance.

• Efficient algorithms are essential for large-scale systems.

Understanding complexity analysis helps developers design faster and more scalable programs.

## Practice Section

## Conceptual Questions

- What is the difference between time complexity and space complexity?

- Why is Big-O notation used instead of exact runtime?

- What is the time complexity of a single loop that runs n times?

- Why do nested loops often result in O(n²) complexity?

- What is the difference between best-case and worst-case complexity?

## Coding Exercises

- Write a Python function that counts the number of elements greater than a given value in a list.

- Write a program that prints all pairs of elements in a list.

- Write a function that finds the sum of the first n natural numbers.

## Interview-Level Problems

- Given a sorted list, implement binary search and analyze its time complexity.

- Given a list of integers, determine whether any pair of numbers sums to a target value.`,
    },
    {
      slug: "chapter-4-arrays-and-python-lists",
      title: "Arrays and Python Lists",
      summary: "One of the most fundamental data structures in computer science is the array. Arrays are used to store collections of elements in a structured and efficient manner. Almost every programming language provides some form of array structure because many…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 3,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key points from this chapter:"],
      selfAssessment: [],
      content: `# Arrays and Python Lists

## Introduction

One of the most fundamental data structures in computer science is the array. Arrays are used to store collections of elements in a structured and efficient manner. Almost every programming language provides some form of array structure because many algorithms rely on them for organizing and processing data.

In Python, the closest equivalent to arrays is the list. Python lists behave like dynamic arrays, meaning they can grow or shrink during program execution.

Arrays and lists are used in many applications, including:

storing collections of numbers

managing sequences of data

implementing other data structures such as stacks and queues

building algorithms for searching and sorting

Understanding arrays and lists is important because they form the foundation for many other data structures and algorithms. In this chapter, we will explore how arrays work, how Python lists behave internally, and how to perform common operations such as traversal, insertion, and deletion.

## Intuition Behind the Concept

Imagine a row of lockers in a school hallway.

### Each locker has:

- a number

- a fixed position

- space to store an item

If a student wants to store something in locker number 5, they go directly to locker 5.

This idea is similar to how arrays work in memory.

An array stores elements in contiguous memory locations, and each element can be accessed using its index.

### Example array:

Index: 0 1 2 3 4 ┌───┬───┬───┬───┬───┐Value │10 │20 │30 │40 │50 │ └───┴───┴───┴───┴───┘

To access the value 30, we use index 2.

Because the location is known immediately, accessing an element in an array is extremely fast.

## Problem the Concept Solves

Suppose we want to store the marks of 100 students.

Without arrays, we would need 100 separate variables.

### Example:

### mark1mark2mark3...mark100

Managing such variables becomes difficult.

Arrays solve this problem by storing multiple values in a single data structure.

### Example:

### marks = [78, 85, 90, 67, 88]

### Now we can easily:

- access elements

- update values

- iterate through all marks

- perform computations

Arrays allow efficient management of large collections of data.

## Core Theory

## Definition of Arrays

An array is a collection of elements stored in contiguous memory locations, where each element can be accessed using an index.

### Key characteristics of arrays:

- elements are stored sequentially

- each element has an index

- elements usually have the same data type (in many languages)

### Example:

### arr = [5, 10, 15, 20]

### Here:

- arr[0] = 5

- arr[1] = 10

- arr[2] = 15

- arr[3] = 20

## Static vs Dynamic Arrays

Arrays can be classified into two types.

### Static Arrays

Static arrays have a fixed size that cannot change after creation.

### Example in languages like C:

### int arr[5]

Once created, the array size remains constant.

### Dynamic Arrays

Dynamic arrays can grow or shrink during program execution.

Python lists behave as dynamic arrays.

### Example:

### numbers = [1, 2, 3]numbers.append(4)numbers.append(5)

The list automatically expands to accommodate new elements.

Internally, Python occasionally allocates extra memory to allow efficient resizing.

## Array Traversal

Traversal means visiting every element in an array.

### Example array:

### [10, 20, 30, 40]

### Traversal steps:

### Visit 10Visit 20Visit 30Visit 40

### Python traversal example:

### arr = [10, 20, 30, 40]for value in arr: print(value)

### Traversal is commonly used in:

- searching algorithms

- computing sums

- processing datasets

## Insertion in Arrays

Insertion means adding an element to an array.

### Example:

### Initial array:

### [10, 20, 40, 50]

Insert 30 at index 2.

### Result:

### [10, 20, 30, 40, 50]

Elements after index 2 must shift right.

### Visualization:

Before insertionIndex: 0 1 2 3 10 20 40 50After insertionIndex: 0 1 2 3 4 10 20 30 40 50

### In Python:

### arr.insert(2, 30)

## Deletion in Arrays

Deletion removes an element from an array.

### Example:

### Initial array:

### [10, 20, 30, 40, 50]

Delete element 30.

### Result:

### [10, 20, 40, 50]

Elements shift left to fill the gap.

### Python example:

### arr.remove(30)

### Or using index:

### del arr[2]

## Visualization

### Example array:

### Index: 0 1 2 3 ┌───┬───┬───┬───┐Value │15 │25 │35 │45 │ └───┴───┴───┴───┘

### Access element at index 2:

### arr[2] → 35

### Insertion example:

### Before:15 25 35 45Insert 30 at index 2After:15 25 30 35 45

## Python Implementation

Example: Find duplicates in an array.

\`\`\`py
def find_duplicates(arr): duplicates = [] for i in range(len(arr)): for j in range(i + 1, len(arr)): if arr[i] == arr[j] and arr[i] not in duplicates: duplicates.append(arr[i]) return duplicatesnumbers = [1, 2, 3, 2, 4, 5, 1]print(find_duplicates(numbers))
\`\`\`

### Output:

### [2, 1]

## Code Walkthrough

### Step 1:

The function receives an array.

### numbers = [1,2,3,2,4,5,1]

### Step 2:

Two nested loops compare elements.

Outer loop selects an element.

Inner loop checks remaining elements.

### Step 3:

If two elements match, they are added to the duplicates list.

### Step 4:

The algorithm returns the list of duplicate values.

## Time and Space Complexity

Let n represent the array size.

### Time Complexity

The nested loops compare all element pairs.

### O(n²)

### Space Complexity

The duplicates list stores repeated elements.

### O(n)

## Variations and Related Techniques

Several variations of array algorithms exist.

### Rotation of Arrays

### Example:

### [1,2,3,4,5]Rotate left → [2,3,4,5,1]

### Moving Zeros to End

### Example:

### Input:[0,1,0,3,12]Output:[1,3,12,0,0]

### Prefix Sum Arrays

Used for fast range sum queries.

### Example:

### prefix[i] = sum of elements from index 0 to i

These techniques appear frequently in algorithm problems.

## Real-World Applications

Arrays are used in many real-world systems.

### Image Processing

Images are stored as arrays of pixel values.

### Databases

Tables often use array-like structures for indexing.

### Scientific Computing

Large datasets are stored in arrays for numerical analysis.

### Game Development

Game boards and grids are implemented using arrays.

## Common Mistakes Beginners Make

### Off-by-one errors

Accessing invalid indices.

### Example:

### arr[len(arr)]

This causes an error.

### Correct:

### arr[len(arr)-1]

### Modifying arrays during iteration

Removing elements while looping may cause logical errors.

### Inefficient nested loops

Some problems can be solved faster using hash tables.

## Interview Tips

Arrays are one of the most common topics in coding interviews.

### Common interview problems include:

- Two Sum

- Maximum subarray

- Rotate array

- Move zeros to end

- Find duplicates

### Interviewers expect candidates to:

- analyze time complexity

- optimize naive solutions

- handle edge cases

## Summary

• Arrays store elements in contiguous memory locations.

• Python lists behave like dynamic arrays.

• Elements are accessed using indices.

• Common operations include traversal, insertion, and deletion.

• Array operations may require shifting elements.

• Many algorithms and data structures rely on arrays.

Arrays form the foundation for more complex data structures studied later in this book.

## Practice Section

## Conceptual Questions

- What is the difference between static and dynamic arrays?

- Why is array indexing fast?

- What happens internally when inserting into the middle of an array?

- Why are arrays efficient for sequential data storage?

- What are the limitations of arrays?

## Coding Exercises

- Write a Python function that rotates an array to the left by one position.

- Write a program that moves all zeros in a list to the end.

- Write a Python function that returns the maximum element in an array.

## Interview-Level Problems

- Given an array of integers, find two numbers whose sum equals a target value.

- Given an array of integers, find the maximum subarray sum.`,
    },
    {
      slug: "chapter-5-strings-and-string-algorithms",
      title: "Strings and String Algorithms",
      summary: "Strings are one of the most widely used data types in programming. A string is a sequence of characters used to represent text, such as words, sentences, or symbols. Examples of strings include: \"hello\"\"data structures\"\"12345\" In Python, strings are used in…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 4,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:"],
      selfAssessment: [],
      content: `# Strings and String Algorithms

## Introduction

Strings are one of the most widely used data types in programming. A string is a sequence of characters used to represent text, such as words, sentences, or symbols.

Examples of strings include:

"hello""data structures""12345"

In Python, strings are used in many applications such as:

processing user input

searching text in documents

validating passwords

analyzing data

building search engines

processing natural language

Many real-world systems rely heavily on string algorithms. For example:

search engines analyze text on web pages

messaging applications process user messages

compilers analyze source code

DNA analysis tools compare biological sequences

Because of this, efficient string manipulation and string algorithms are extremely important in computer science.

In this chapter, we will learn:

how strings are represented

how to traverse and manipulate strings

common string algorithms

practical problems such as palindrome detection and anagram checking

These concepts form the foundation for more advanced algorithms like pattern matching and text search.

## Intuition Behind the Concept

Think of a string as a row of characters arranged in order.

### For example, the word "algorithm" can be visualized as:

Index: 0 1 2 3 4 5 6 7 8 ┌─┬─┬─┬─┬─┬─┬─┬─┬─┐Chars │a│l│g│o│r│i│t│h│m│ └─┴─┴─┴─┴─┴─┴─┴─┴─┘

Each character has a position called an index.

Using the index, we can access characters directly.

### Example in Python:

### word = "algorithm"print(word[0])

### Output:

### a

### Because strings are ordered sequences, we can:

- traverse them

- extract substrings

- compare characters

- search patterns

This ordered structure makes strings ideal for text processing.

## Problem the Concept Solves

Many computational problems involve processing text.

### Examples include:

- checking whether a word is a palindrome

- determining whether two words are anagrams

- finding a substring inside a string

- analyzing DNA sequences

- detecting keywords in documents

Without efficient string algorithms, tasks involving large text datasets would become extremely slow.

### For example:

A search engine may need to process billions of words across web pages.

Efficient string algorithms allow systems to process text quickly and accurately.

## Core Theory

## String Representation

In Python, a string is an immutable sequence of characters.

### Example:

### text = "data"

### Memory representation:

### Index: 0 1 2 3 ┌───┬───┬───┬───┐Chars │ d │ a │ t │ a │ └───┴───┴───┴───┘

Because strings are immutable, their characters cannot be modified directly.

### Example:

### text[0] = 'D'

This will produce an error.

Instead, a new string must be created.

## String Traversal

Traversal means visiting each character in the string.

### Example string:

### "hello"

### Traversal order:

### h → e → l → l → o

### Python example:

### text = "hello"for char in text: print(char)

### Traversal is used in many string algorithms such as:

- counting characters

- checking patterns

- searching substrings

## String Manipulation Techniques

Python provides several ways to manipulate strings.

### Concatenation

Combining strings.

### first = "data"second = "science"result = first + " " + secondprint(result)

### Output:

### data science

### Slicing

Extracting a portion of a string.

### text = "algorithm"print(text[0:4])

### Output:

### algo

### Length of String

### len(text)

### Converting Case

### text.lower()text.upper()

## Palindrome Check

A palindrome is a word that reads the same forward and backward.

### Examples:

### madamracecarlevel

### Algorithm:

- Compare first and last characters

- Move toward the center

- If all characters match → palindrome

### Python implementation:

\`\`\`py
def is_palindrome(text): left = 0 right = len(text) - 1 while left < right: if text[left] != text[right]: return False left += 1 right -= 1 return Trueprint(is_palindrome("racecar"))
\`\`\`

### Output:

### True

## Longest Substring Without Repetition

### Problem:

Find the longest substring that contains no repeated characters.

### Example:

### Input: "abcabcbb"Output: 3

### Substring:

### abc

This problem is commonly solved using the sliding window technique.

### Basic idea:

- expand the window

- track characters

- shrink when duplicates appear

## Anagram Detection

Two strings are anagrams if they contain the same characters in a different order.

### Example:

### listensilent

### Algorithm:

- Count frequency of characters

- Compare frequencies

### Python implementation:

\`\`\`py
def is_anagram(s1, s2): if len(s1) != len(s2): return False return sorted(s1) == sorted(s2)print(is_anagram("listen", "silent"))
\`\`\`

### Output:

### True

## Visualization

### Palindrome example:

### racecar

### Comparison process:

### r == ra == ac == c

### Visualization:

### r a c e c a r↑ ↑

### Move inward:

### ↑ ↑

Continue until the center is reached.

## Python Implementation

Example: Count frequency of characters.

\`\`\`py
def character_frequency(text): freq = {} for char in text: if char in freq: freq[char] += 1 else: freq[char] = 1 return freqprint(character_frequency("banana"))
\`\`\`

### Output:

\`\`\`py
{'b':1,'a':3,'n':2}
\`\`\`

## Code Walkthrough

### Step 1:

Create an empty dictionary.

\`\`\`py
freq = {}
\`\`\`

### Step 2:

Traverse the string character by character.

### Step 3:

If the character already exists in the dictionary, increase its count.

### Step 4:

Otherwise create a new entry.

### Step 5:

Return the dictionary containing character frequencies.

## Time and Space Complexity

Let n be the length of the string.

### Time Complexity

### Traversal of string:

### O(n)

### Space Complexity

### Dictionary storing characters:

### O(n)

## Variations and Related Techniques

Several advanced string techniques exist.

### Examples:

### Sliding Window

Used for substring problems.

### Example:

### Longest substring without repetition

### Prefix Arrays

Used for pattern searching.

### Pattern Matching Algorithms

### Examples include:

- Knuth–Morris–Pratt (KMP)

- Rabin–Karp

- Boyer–Moore

These algorithms allow fast text searching.

## Real-World Applications

String algorithms appear in many systems.

### Search Engines

Search engines analyze keywords within documents.

### Natural Language Processing

Chatbots and translation systems process human language.

### Bioinformatics

DNA sequences are processed using string matching algorithms.

### Compilers

Programming language compilers analyze source code strings.

## Common Mistakes Beginners Make

### Modifying immutable strings

Strings cannot be modified directly.

### Incorrect indexing

Accessing characters beyond the string length causes errors.

### Inefficient string concatenation in loops

Repeated concatenation can slow programs.

### Ignoring case sensitivity

### Example:

### Hello != hello

## Interview Tips

Strings are extremely common in coding interviews.

### Popular problems include:

- palindrome check

- anagram detection

- longest substring without repetition

- string compression

- pattern matching

### Interviewers expect candidates to:

- handle edge cases

- write clean string traversal logic

- optimize solutions when possible

## Summary

• Strings are sequences of characters.

• Python strings are immutable.

• Strings can be traversed using loops.

• Common operations include slicing, concatenation, and comparison.

• Important problems include palindrome detection, substring analysis, and anagram checking.

• Efficient string algorithms are crucial for text processing applications.

## Practice Section

## Conceptual Questions

- What is a string in Python?

- Why are Python strings immutable?

- What is string traversal?

- What is an anagram?

- What is a substring?

## Coding Exercises

- Write a Python function to check whether a string is a palindrome.

- Write a program that counts the number of vowels in a string.

- Write a Python function that reverses a string without using built-in functions.

## Interview-Level Problems

- Given a string, find the longest substring without repeating characters.

- Given two strings, determine whether they are anagrams.`,
    },
    {
      slug: "chapter-6-memory-allocation-and-pointers-in-programming",
      title: "Memory Allocation and Pointers in Programming",
      summary: "Every program that runs on a computer uses memory (RAM) to store data and instructions. Memory allows a program to:",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 5,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts covered in this chapter:", "Programs use RAM to store instructions and data.", "Memory layout includes code, data, heap, and stack segments.", "Pointers store memory addresses of variables.", "Static memory allocation occurs at compile time.", "Dynamic memory allocation occurs during runtime using heap memory.", "Important functions include malloc(), calloc(), realloc(), and free().", "Incorrect memory usage can cause memory leaks, dangling pointers, and buffer overflows.", "Dynamic memory allocation is essential for implementing advanced data structures."],
      selfAssessment: [],
      content: `# Memory Allocation and Pointers in Programming

## Introduction to Memory in Programming

Every program that runs on a computer uses memory (RAM) to store data and instructions. Memory allows a program to:

- store variables

- execute instructions

- process data

- manage program state during execution

When a program starts running, the operating system assigns a portion of RAM to that program. This memory is organized into different sections so that code, variables, and runtime data can be managed efficiently.

### Memory management is extremely important in programming because:

- computers have limited memory

- programs must store data efficiently

- improper memory usage can cause crashes or security vulnerabilities

- large software systems must manage memory carefully for performance and stability

In languages such as C and C++, programmers have direct control over memory management. Understanding how memory works is essential for:

- data structures and algorithms

- operating systems

- system-level programming

- debugging memory errors

- performing well in technical interviews

### In this chapter, we will study:

- how memory is organized inside a running program

- static vs dynamic memory allocation

- pointers and how they interact with memory

- dynamic allocation functions such as malloc, calloc, realloc, and free

Pointers play a central role in memory management, so we will also explore them in detail.

## Memory Layout of a Program

When a program executes, its memory is divided into several regions. Each region has a specific purpose.

### A simplified memory layout looks like this:

High Memory-------------------------Stack-------------------------Heap-------------------------Data Segment-------------------------Code / Text Segment-------------------------Low Memory

Let us examine each segment.

## Code / Text Segment

The code segment (also called the text segment) stores the compiled program instructions.

### This includes:

- machine instructions

- compiled functions

- program logic

### Example functions stored here:

### main()printf()scanf()

### Characteristics:

- usually read-only

- cannot be modified during program execution

- shared across program instances in some systems

## Data Segment

The data segment stores global and static variables.

### Example:

\`\`\`py
int global_var = 10;static int counter = 0;
\`\`\`

This segment is divided into two parts.

### Initialized Data Segment

Stores variables that are initialized at declaration.

### Example:

\`\`\`py
int x = 5;
\`\`\`

### Uninitialized Data Segment (BSS)

Stores variables declared but not initialized.

### Example:

\`\`\`py
int y;
\`\`\`

These variables are automatically initialized to zero by the system.

## Heap

The heap is used for dynamic memory allocation.

### Memory is allocated during runtime using functions such as:

### malloc()calloc()realloc()

### Characteristics of the heap:

- memory is allocated manually

- memory size can change during execution

- programmer must explicitly free memory

The heap grows upwards in memory.

### Dynamic data structures such as:

- linked lists

- trees

- graphs

- dynamic arrays

use heap memory.

## Stack

The stack stores temporary program data used during function calls.

### Examples stored in the stack:

- local variables

- function parameters

- return addresses

### Example:

\`\`\`py
void function(){ int x = 10;}
\`\`\`

The variable x is stored on the stack.

### Characteristics:

- follows LIFO (Last In First Out) order

- memory allocated automatically

- memory freed automatically when a function returns

The stack grows downwards in memory.

## Introduction to Pointers

A pointer is a variable that stores the memory address of another variable.

Instead of storing a value directly, a pointer stores the location in memory where the value exists.

### Example:

\`\`\`py
int x = 10;
\`\`\`

### Memory representation:

### Address Value1000 10

### Now we create a pointer:

\`\`\`py
int *ptr;ptr = &x;
\`\`\`

### Here:

- &x means the address of x

- ptr stores that address

### Visualization:

### Variable Address Valuex 1000 10ptr 2000 1000

Thus ptr points to the location of x.

## Pointer Syntax

### Pointer declaration:

\`\`\`py
int *ptr;
\`\`\`

### Pointer initialization:

\`\`\`py
int x = 5;int *ptr = &x;
\`\`\`

### Accessing value using pointer:

\`\`\`py
printf("%d", *ptr);
\`\`\`

Here *ptr means value stored at the address.

## Pointer Operators

Two operators are used with pointers.

### Address-of Operator (&)

Returns the memory address of a variable.

### Example:

\`\`\`py
int x = 10;printf("%p", &x);
\`\`\`

### Dereference Operator (*)

Accesses the value stored at a memory address.

### Example:

\`\`\`py
int x = 10;int *ptr = &x;printf("%d", *ptr);
\`\`\`

### Output:

### 10

## Static Memory Allocation

Static memory allocation occurs when memory is allocated at compile time.

The size of memory must be known before program execution.

### Example:

\`\`\`py
int a = 10;
\`\`\`

Memory for a is allocated during compilation.

## Static Arrays

### Example:

\`\`\`py
int arr[5];
\`\`\`

This array can store exactly five integers.

Memory is reserved during compilation.

## Global Variables

### Example:

\`\`\`py
int count = 0;
\`\`\`

Global variables exist throughout program execution.

## Advantages

- faster access

- simple implementation

- automatic memory management

## Limitations

- fixed memory size

- memory cannot expand

- may waste memory

## Dynamic Memory Allocation

Dynamic memory allocation allows programs to request memory during execution.

Memory is taken from the heap.

### Example:

\`\`\`py
int *ptr;ptr = (int*) malloc(5 * sizeof(int));
\`\`\`

This allocates memory for 5 integers during runtime.

Dynamic allocation is useful when the required memory size is unknown beforehand.

## malloc() Function

The malloc() function allocates memory from the heap.

## Syntax

\`\`\`py
pointer = (type*) malloc(size);
\`\`\`

### Example:

\`\`\`py
int *ptr;ptr = (int*) malloc(10 * sizeof(int));
\`\`\`

This allocates memory for 10 integers.

### Important characteristics:

- memory contents are uninitialized

- returns NULL if allocation fails

### Example program:

\`\`\`py
#include <stdio.h>#include <stdlib.h>int main(){ int *arr; int n = 5; arr = (int*) malloc(n * sizeof(int)); for(int i = 0; i < n; i++) { arr[i] = i + 1; } for(int i = 0; i < n; i++) { printf("%d ", arr[i]); } free(arr); return 0;}
\`\`\`

## calloc() Function

calloc() allocates memory for multiple elements and initializes them to zero.

## Syntax

\`\`\`py
pointer = (type*) calloc(number_of_elements, size_of_each_element);
\`\`\`

### Example:

\`\`\`py
int *ptr;ptr = (int*) calloc(5, sizeof(int));
\`\`\`

This allocates memory for 5 integers initialized to 0.

## realloc() Function

realloc() resizes previously allocated memory.

## Syntax

\`\`\`py
pointer = realloc(pointer, new_size);
\`\`\`

### Example:

\`\`\`py
ptr = realloc(ptr, 10 * sizeof(int));
\`\`\`

This increases memory capacity.

## free() Function

Memory allocated using malloc() or calloc() must be released using free().

### Example:

\`\`\`py
free(ptr);
\`\`\`

This returns memory back to the system.

### To avoid errors:

\`\`\`py
ptr = NULL;
\`\`\`

## Common Memory Errors

### Memory Leak

Occurs when allocated memory is not freed.

### Dangling Pointer

Pointer referencing freed memory.

### Double Free

Freeing the same memory twice.

### Buffer Overflow

Writing beyond allocated memory boundaries.

### Example:

\`\`\`py
int arr[5];arr[10] = 5;
\`\`\`

## Comparison Tables

## Static vs Dynamic Memory

## malloc vs calloc vs realloc

## Real-World Applications

Dynamic memory allocation is essential in many systems.

### Data Structures

### Used in:

- linked lists

- trees

- graphs

### Operating Systems

Memory management, process scheduling, and virtual memory.

### Databases

Dynamic memory is used for query processing and indexing.

### Game Engines

Memory allocation is used for game objects, physics engines, and graphics.

## Interview Questions

- What is memory allocation in programming?

- What is the difference between stack and heap memory?

- What is a pointer?

- What is the difference between malloc and calloc?

- What is a dangling pointer?

- What is a memory leak?

- What does realloc() do?

- Why must memory be freed?

- What is buffer overflow?

- Why are pointers important for data structures?

## Practice Exercises

- Write a program to dynamically allocate an integer array using malloc.

- Write a program that demonstrates pointer usage.

- Write a program that resizes an array using realloc.

- Write a program that counts numbers using dynamically allocated memory.

- Implement a simple dynamic array.

## Summary

Understanding memory allocation and pointers is crucial for systems programming, operating systems, data structures, and efficient software design.`,
    },
    {
      slug: "chapter-7-linked-lists",
      title: "Linked Lists",
      summary: "A linked list is a fundamental data structure used to store a collection of elements in a sequential manner. Unlike arrays, where elements are stored in contiguous memory locations, linked lists store elements in separate memory locations connected using…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 6,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "A linked list stores elements as nodes connected by pointers.", "Each node contains data and a pointer to the next node.", "Linked lists allow efficient insertion and deletion.", "Types include singly linked lists, doubly linked lists, and circular linked lists.", "Linked lists are widely used in memory management, graph representation, and dynamic data structures."],
      selfAssessment: [],
      content: `# Linked Lists

## Introduction

A linked list is a fundamental data structure used to store a collection of elements in a sequential manner. Unlike arrays, where elements are stored in contiguous memory locations, linked lists store elements in separate memory locations connected using pointers (or references).

Linked lists are widely used in computer science because they provide flexible memory usage and efficient insertion and deletion operations.

For example:

inserting an element in the middle of an array requires shifting many elements

inserting an element in a linked list only requires updating pointers

Linked lists are used in many real-world systems such as:

memory management in operating systems

implementing stacks and queues

hash tables with chaining

graph adjacency lists

In this chapter, we will study:

nodes and pointers

singly linked lists

doubly linked lists

circular linked lists

insertion, deletion, and reversal operations

common interview problems

Understanding linked lists is important because they introduce pointer-based data structures, which are used to build more complex structures like trees and graphs.

## Intuition Behind Linked Lists

Imagine a treasure hunt game.

Each clue tells you where the next clue is hidden.

### Example:

### Clue1 → Clue2 → Clue3 → Clue4

You cannot jump directly to Clue4 unless you follow the chain from the beginning.

This is exactly how a linked list works.

### Each element (called a node) contains:

- the data

- a pointer to the next node

### Visualization:

### [10 | next] → [20 | next] → [30 | next] → [40 | NULL]

### Here:

- the first node is called the head

- the last node points to NULL

## Nodes and Pointers

A node is the fundamental unit of a linked list.

### Each node contains two parts:

- data – the value stored in the node

- next pointer – a reference to the next node

### Structure of a node:

### ┌──────────┬───────────┐│ data │ next │└──────────┴───────────┘

### Example linked list:

Head ↓┌────┬────┐ ┌────┬────┐ ┌────┬────┐│10 │ •──┼──→ │20 │ •──┼──→ │30 │NULL│└────┴────┘ └────┴────┘ └────┴────┘

Each node stores the memory reference of the next node.

## Singly Linked List

A singly linked list is the simplest type of linked list.

### Each node contains:

- data

- pointer to the next node

### Structure:

### Head → Node1 → Node2 → Node3 → NULL

### Example:

### → 20 → 30 → 40 → NULL

Traversal always starts from the head.

## Python Implementation of Singly Linked List

First we define a Node class.

\`\`\`py
class Node: def __init__(self, data): self.data = data self.next = None
\`\`\`

Now we create the LinkedList class.

\`\`\`py
class LinkedList: def __init__(self): self.head = None
\`\`\`

## Inserting a Node

### Insert at Beginning

\`\`\`py
def insert_at_beginning(self, data): new_node = Node(data) new_node.next = self.head self.head = new_node
\`\`\`

### Example:

### Before:20 → 30 → 40Insert 10After:10 → 20 → 30 → 40

### Insert at End

\`\`\`py
def insert_at_end(self, data): new_node = Node(data) if self.head is None: self.head = new_node return temp = self.head while temp.next: temp = temp.next temp.next = new_node
\`\`\`

## Deleting a Node

Example: delete a node by value.

\`\`\`py
def delete_node(self, key): temp = self.head if temp and temp.data == key: self.head = temp.next return prev = None while temp and temp.data != key: prev = temp temp = temp.next if temp is None: return prev.next = temp.next
\`\`\`

### Example:

### Before:10 → 20 → 30 → 40Delete 20After:10 → 30 → 40

## Reverse a Linked List

Reversing a linked list is a common interview problem.

### Example:

### Original:10 → 20 → 30 → 40Reversed:40 → 30 → 20 → 10

### Python implementation:

\`\`\`py
def reverse(self): prev = None current = self.head while current: next_node = current.next current.next = prev prev = current current = next_node self.head = prev
\`\`\`

## Doubly Linked List

### A doubly linked list stores two pointers:

- pointer to next node

- pointer to previous node

### Structure:

### NULL ← 10 ⇄ 20 ⇄ 30 ⇄ 40 → NULL

### Node structure:

### ┌────────┬─────────┬────────┐│ prev │ data │ next │└────────┴─────────┴────────┘

### Advantages:

- traversal in both directions

- easier deletion operations

### Disadvantages:

- extra memory required for previous pointer

## Circular Linked List

In a circular linked list, the last node points back to the first node.

### Example:

### → 20 → 30 → 40↑ ↓└────────────────┘

There is no NULL pointer.

### Circular lists are used in:

- round-robin scheduling

- multiplayer game loops

- playlist cycling

## Skills Learned

### After studying linked lists, students learn:

- pointer-based data structures

- memory-efficient storage

- dynamic memory allocation

- traversal using references

- building complex structures

### These concepts form the foundation for advanced structures such as:

- trees

- graphs

- hash tables

## Example Problems

### Detect Cycle in Linked List

A cycle occurs when a node points back to a previous node.

### Example:

### → 20 → 30 → 40 ↑ ↓ └────────┘

The Floyd’s Cycle Detection Algorithm (Tortoise and Hare) is commonly used.

### Find Middle Element

### Use two pointers:

- slow pointer moves 1 step

- fast pointer moves 2 steps

When fast pointer reaches the end, slow pointer is at the middle.

### Merge Two Sorted Lists

### Example:

### List1: 1 → 3 → 5List2: 2 → 4 → 6Merged:1 → 2 → 3 → 4 → 5 → 6

## Time Complexity

## Exercises

### Conceptual Questions

- What is a linked list?

- What is a node in a linked list?

- What is the difference between singly and doubly linked lists?

- Why are linked lists memory efficient?

- What is a circular linked list?

### Coding Exercises

- Implement a LinkedList class in Python.

- Write a function to insert a node at the beginning.

- Write a function to delete a node by value.

- Write a program to reverse a linked list.

- Write a program to find the middle node.

### Interview Problems

- Detect a cycle in a linked list.

- Merge two sorted linked lists.

- Remove the Nth node from the end.

- Find the intersection point of two linked lists.

## Summary

Understanding linked lists is essential because they introduce pointer-based thinking, which is required for many advanced algorithms and systems programming concepts.`,
    },
    {
      slug: "chapter-8-stacks",
      title: "Stacks",
      summary: "A stack is a fundamental linear data structure that follows the principle of Last In, First Out (LIFO). This means that the element inserted last is the first one to be removed. Stacks are widely used in computer science and software systems for managing data…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 7,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "A stack is a linear data structure that follows Last In First Out (LIFO).", "Elements are inserted and removed only from the top.", "Basic operations include push, pop, peek, and isEmpty.", "Stacks can be implemented using arrays (lists) or linked lists.", "Stacks are widely used in expression evaluation, recursion, syntax checking, and undo operations."],
      selfAssessment: [],
      content: `# Stacks

## Introduction

A stack is a fundamental linear data structure that follows the principle of Last In, First Out (LIFO). This means that the element inserted last is the first one to be removed.

Stacks are widely used in computer science and software systems for managing data where the most recently added element must be accessed first.

Common applications of stacks include:

expression evaluation in compilers

undo operations in text editors

browser history navigation

recursion and function call management

syntax parsing

Understanding stacks is important because they help implement many algorithms and system-level operations.

In this chapter we will study:

stack concept and LIFO principle

stack operations

stack implementation using lists

stack implementation using linked lists

applications of stacks

common stack interview problems

## Intuition Behind the Concept

Consider a stack of plates in a kitchen.

### When plates are stacked:

- new plates are placed on top

- plates are removed from the top

### Visualization:

### Top┌─────┐│ 30 │├─────┤│ 20 │├─────┤│ 10 │└─────┘Bottom

### If we insert a new plate:

### Top┌─────┐│ 40 │├─────┤│ 30 │├─────┤│ 20 │├─────┤│ 10 │└─────┘

### If we remove a plate:

- the top plate 40 is removed first.

This behavior defines the Last In First Out (LIFO) property of stacks.

## Problem the Concept Solves

### Stacks solve problems where we need to:

- keep track of recent operations

- reverse order of operations

- evaluate nested expressions

### Example:

In a text editor, pressing undo removes the most recent change.

### Sequence of operations:

### Type AType BType C

### Undo operations remove them in reverse order:

### Undo → CUndo → BUndo → A

Stacks allow us to store and retrieve operations in exactly this order.

## Core Theory

A stack supports a limited set of operations.

### Push

Adds an element to the top of the stack.

### Example:

### Push(10)Push(20)Push(30)

### Stack becomes:

### Top302010

### Pop

Removes the top element from the stack.

### Example:

### Pop()

Removes 30.

### Peek

Returns the top element without removing it.

### isEmpty

Checks whether the stack contains elements.

### Size

Returns the number of elements in the stack.

## Stack Visualization

### Example operations:

### Push(10)Push(20)Push(30)Pop()

### Visualization:

### Step 110Step 22010Step 3302010Step 4 (Pop)2010

## Stack Implementation Using Python List

Python lists can easily be used as stacks.

### Implementation

\`\`\`py
class Stack: def __init__(self): self.stack = [] def push(self, value): self.stack.append(value) def pop(self): if not self.is_empty(): return self.stack.pop() def peek(self): if not self.is_empty(): return self.stack[-1] def is_empty(self): return len(self.stack) == 0 def size(self): return len(self.stack)
\`\`\`

### Example Usage

### s = Stack()s.push(10)s.push(20)s.push(30)print(s.pop())print(s.peek())

### Output:

### 3020

## Stack Implementation Using Linked List

Stacks can also be implemented using linked lists.

This approach avoids array resizing limitations.

### Node Class

\`\`\`py
class Node: def __init__(self, data): self.data = data self.next = None
\`\`\`

### Stack Class

\`\`\`py
class Stack: def __init__(self): self.top = None def push(self, data): new_node = Node(data) new_node.next = self.top self.top = new_node def pop(self): if self.top is None: return None popped = self.top.data self.top = self.top.next return popped
\`\`\`

## Applications of Stacks

Stacks are widely used in real-world systems.

## Expression Evaluation

### Stacks help evaluate expressions like:

### (3 + 5) * (2 + 4)

## Syntax Checking

### Programming languages use stacks to check:

\`\`\`py
(){}[]
\`\`\`

Balanced parentheses.

## Function Calls

The call stack stores function calls during recursion.

### Example:

### main() → functionA() → functionB()

Each function call is pushed onto the stack.

## Undo/Redo Operations

### Applications like:

- Microsoft Word

- Photoshop

- code editors

use stacks to track user actions.

## Example Problems

## Balanced Parentheses

### Given:

### ((a+b)*(c+d))

Check if parentheses are balanced.

### Algorithm:

- Push opening bracket onto stack

- Pop when closing bracket appears

- If stack empty at end → balanced

## Next Greater Element

Find the next greater element for each array element.

### Example:

### Input: [4,5,2,10]Output: [5,10,10,-1]

Stacks help solve this efficiently.

## Time Complexity

Stack operations are generally constant time.

## Common Mistakes Beginners Make

### Stack Overflow

Occurs when pushing elements beyond capacity.

### Stack Underflow

Occurs when popping from an empty stack.

### Incorrect push/pop order

Incorrect order can break algorithm logic.

## Interview Tips

Stacks frequently appear in coding interviews.

### Common questions include:

- balanced parentheses

- next greater element

- evaluate postfix expressions

- implement stack using queues

- implement min stack

### Interviewers expect candidates to understand:

- LIFO behavior

- stack operations

- applications in algorithms

## Exercises

## Conceptual Questions

- What is a stack data structure?

- What does LIFO mean?

- What are the main operations of a stack?

- Why are stacks used in recursion?

- What is stack overflow?

## Coding Exercises

- Implement a stack using Python lists.

- Implement a stack using linked lists.

- Write a program to reverse a string using a stack.

## Interview Problems

- Check for balanced parentheses.

- Implement a Min Stack that supports retrieving the minimum element.

- Evaluate a postfix expression.

## Summary

Stacks are an essential building block for many algorithms and systems programming concepts.

## Introduction

A stack is a fundamental linear data structure that follows the principle of Last In, First Out (LIFO). This means that the element inserted last is the first one to be removed.

Stacks are widely used in computer science and software systems for managing data where the most recently added element must be accessed first.

Common applications of stacks include:

expression evaluation in compilers

undo operations in text editors

browser history navigation

recursion and function call management

syntax parsing

Understanding stacks is important because they help implement many algorithms and system-level operations.

In this chapter we will study:

stack concept and LIFO principle

stack operations

stack implementation using lists

stack implementation using linked lists

applications of stacks

common stack interview problems

## Intuition Behind the Concept

Consider a stack of plates in a kitchen.

### When plates are stacked:

- new plates are placed on top

- plates are removed from the top

### Visualization:

### Top┌─────┐│ 30 │├─────┤│ 20 │├─────┤│ 10 │└─────┘Bottom

### If we insert a new plate:

### Top┌─────┐│ 40 │├─────┤│ 30 │├─────┤│ 20 │├─────┤│ 10 │└─────┘

### If we remove a plate:

- the top plate 40 is removed first.

This behavior defines the Last In First Out (LIFO) property of stacks.

## Problem the Concept Solves

### Stacks solve problems where we need to:

- keep track of recent operations

- reverse order of operations

- evaluate nested expressions

### Example:

In a text editor, pressing undo removes the most recent change.

### Sequence of operations:

### Type AType BType C

### Undo operations remove them in reverse order:

### Undo → CUndo → BUndo → A

Stacks allow us to store and retrieve operations in exactly this order.

## Core Theory

A stack supports a limited set of operations.

### Push

Adds an element to the top of the stack.

### Example:

### Push(10)Push(20)Push(30)

### Stack becomes:

### Top302010

### Pop

Removes the top element from the stack.

### Example:

### Pop()

Removes 30.

### Peek

Returns the top element without removing it.

### isEmpty

Checks whether the stack contains elements.

### Size

Returns the number of elements in the stack.

## Stack Visualization

### Example operations:

### Push(10)Push(20)Push(30)Pop()

### Visualization:

### Step 110Step 22010Step 3302010Step 4 (Pop)2010

## Stack Implementation Using Python List

Python lists can easily be used as stacks.

### Implementation

\`\`\`py
class Stack: def __init__(self): self.stack = [] def push(self, value): self.stack.append(value) def pop(self): if not self.is_empty(): return self.stack.pop() def peek(self): if not self.is_empty(): return self.stack[-1] def is_empty(self): return len(self.stack) == 0 def size(self): return len(self.stack)
\`\`\`

### Example Usage

### s = Stack()s.push(10)s.push(20)s.push(30)print(s.pop())print(s.peek())

### Output:

### 3020

## Stack Implementation Using Linked List

Stacks can also be implemented using linked lists.

This approach avoids array resizing limitations.

### Node Class

\`\`\`py
class Node: def __init__(self, data): self.data = data self.next = None
\`\`\`

### Stack Class

\`\`\`py
class Stack: def __init__(self): self.top = None def push(self, data): new_node = Node(data) new_node.next = self.top self.top = new_node def pop(self): if self.top is None: return None popped = self.top.data self.top = self.top.next return popped
\`\`\`

## Applications of Stacks

Stacks are widely used in real-world systems.

## Expression Evaluation

### Stacks help evaluate expressions like:

### (3 + 5) * (2 + 4)

## Syntax Checking

### Programming languages use stacks to check:

\`\`\`py
(){}[]
\`\`\`

Balanced parentheses.

## Function Calls

The call stack stores function calls during recursion.

### Example:

### main() → functionA() → functionB()

Each function call is pushed onto the stack.

## Undo/Redo Operations

### Applications like:

- Microsoft Word

- Photoshop

- code editors

use stacks to track user actions.

## Example Problems

## Balanced Parentheses

### Given:

### ((a+b)*(c+d))

Check if parentheses are balanced.

### Algorithm:

- Push opening bracket onto stack

- Pop when closing bracket appears

- If stack empty at end → balanced

## Next Greater Element

Find the next greater element for each array element.

### Example:

### Input: [4,5,2,10]Output: [5,10,10,-1]

Stacks help solve this efficiently.

## Time Complexity

Stack operations are generally constant time.

## Common Mistakes Beginners Make

### Stack Overflow

Occurs when pushing elements beyond capacity.

### Stack Underflow

Occurs when popping from an empty stack.

### Incorrect push/pop order

Incorrect order can break algorithm logic.

## Interview Tips

Stacks frequently appear in coding interviews.

### Common questions include:

- balanced parentheses

- next greater element

- evaluate postfix expressions

- implement stack using queues

- implement min stack

### Interviewers expect candidates to understand:

- LIFO behavior

- stack operations

- applications in algorithms

## Exercises

## Conceptual Questions

- What is a stack data structure?

- What does LIFO mean?

- What are the main operations of a stack?

- Why are stacks used in recursion?

- What is stack overflow?

## Coding Exercises

- Implement a stack using Python lists.

- Implement a stack using linked lists.

- Write a program to reverse a string using a stack.

## Interview Problems

- Check for balanced parentheses.

- Implement a Min Stack that supports retrieving the minimum element.

- Evaluate a postfix expression.

## Summary

Stacks are an essential building block for many algorithms and systems programming concepts.`,
    },
    {
      slug: "chapter-9-recursion-fundamentals",
      title: "Recursion Fundamentals",
      summary: "Recursion is a powerful technique in computer science where a function calls itself to solve smaller instances of a problem. Many complex problems become easier to solve when they are broken down into smaller subproblems, and recursion provides a natural way…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 8,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Recursion occurs when a function calls itself.", "Recursive functions require a base case and recursive case.", "Each recursive call creates a stack frame.", "Recursion is useful for problems with repeating substructures.", "Many algorithms such as merge sort, quick sort, and tree traversal rely on recursion."],
      selfAssessment: [],
      content: `# Recursion Fundamentals

## Introduction

Recursion is a powerful technique in computer science where a function calls itself to solve smaller instances of a problem. Many complex problems become easier to solve when they are broken down into smaller subproblems, and recursion provides a natural way to express such solutions.

Recursion plays a major role in many algorithms and data structures, including:

tree traversal algorithms

divide-and-conquer algorithms

graph algorithms

backtracking problems

dynamic programming

Examples of algorithms that use recursion include:

Merge Sort

Quick Sort

Binary Search

Tree Traversals

Depth-First Search (DFS)

Understanding recursion is important because it helps programmers develop algorithmic thinking and solve problems that are difficult to implement using simple loops.

In this chapter, we will study:

recursive thinking

base case and recursive case

stack frames and function calls

recursive problem solving

common recursion examples such as factorial and Fibonacci

## Intuition Behind Recursion

To understand recursion, imagine looking into two mirrors facing each other.

The reflection repeats infinitely.

Similarly, in recursion a function keeps calling itself repeatedly until a stopping condition is reached.

Another simple example is mathematical factorial.

### Factorial definition:

### n! = n × (n-1)!

### Example:

### 5! = 5 × 4 × 3 × 2 × 1

### Using recursion:

### 5! = 5 × 4!4! = 4 × 3!3! = 3 × 2!2! = 2 × 1!1! = 1

Each step reduces the problem into a smaller version of itself.

## Problem the Concept Solves

Some problems are naturally recursive in nature.

### Example:

### Directory Traversal

### A directory may contain:

- files

- subdirectories

Each subdirectory may again contain more directories.

### Structure:

### Folder ├── File1 ├── FolderA │ ├── File2 │ └── FolderB │ └── File3

To process all files, the program must repeatedly process subdirectories inside directories.

Recursion handles this naturally.

Without recursion, implementing such hierarchical processing becomes complicated.

## Core Theory

### A recursive function contains two essential components:

- Base Case

- Recursive Case

## Base Case

The base case stops the recursion.

Without a base case, the function would call itself indefinitely, causing a program crash.

### Example:

### factorial(1) = 1

This is the stopping condition.

## Recursive Case

The recursive case reduces the problem into a smaller version of itself.

### Example:

### factorial(n) = n × factorial(n-1)

Each call reduces n.

## Visualization of Recursion

### Example: factorial of 4

factorial(4) | → 4 × factorial(3) | → 3 × factorial(2) | → 2 × factorial(1) | → 1

### Return phase:

### factorial(1) = 1factorial(2) = 2factorial(3) = 6factorial(4) = 24

## Python Implementation

### Factorial using recursion

\`\`\`py
def factorial(n): if n == 1: return 1 return n * factorial(n - 1)print(factorial(5))
\`\`\`

### Output:

### 120

## Code Walkthrough

### Call:

### factorial(5)

### Execution steps:

factorial(5)= 5 × factorial(4)factorial(4)= 4 × factorial(3)factorial(3)= 3 × factorial(2)factorial(2)= 2 × factorial(1)factorial(1)= 1

Return values propagate upward.

## Stack Frames in Recursion

Every recursive call creates a new stack frame.

### The stack stores:

- function parameters

- local variables

- return addresses

### Visualization of recursive calls:

### Stackfactorial(1)factorial(2)factorial(3)factorial(4)factorial(5)

As recursion returns, stack frames are removed one by one.

## Example Problems

## Fibonacci Sequence

### Fibonacci definition:

### F(n) = F(n-1) + F(n-2)

### Base cases:

### F(0) = 0F(1) = 1

### Python implementation:

\`\`\`py
def fibonacci(n): if n <= 1: return n return fibonacci(n-1) + fibonacci(n-2)print(fibonacci(6))
\`\`\`

### Output:

### 8

## Power Calculation

### Compute:

### x^n

### Recursive idea:

### x^n = x × x^(n-1)

### Python implementation:

\`\`\`py
def power(x, n): if n == 0: return 1 return x * power(x, n-1)
\`\`\`

## Time and Space Complexity

Recursion complexity depends on the number of recursive calls.

### Example:

### Factorial recursion:

### Time Complexity: O(n)Space Complexity: O(n)

Space complexity arises due to recursive stack frames.

## Variations and Related Techniques

Several algorithm techniques rely on recursion.

## Divide and Conquer

Problems are divided into smaller parts.

### Examples:

- Merge Sort

- Quick Sort

- Binary Search

## Backtracking

Explores all possible solutions.

### Examples:

- N-Queens

- Sudoku solver

## Dynamic Programming

Optimizes recursive solutions by storing results.

### Example:

- Fibonacci optimization

## Real-World Applications

Recursion is widely used in real systems.

## File System Traversal

Operating systems recursively search directory structures.

## Compilers

Parsing expressions often uses recursive algorithms.

## Graphics

Fractal graphics rely heavily on recursion.

## Artificial Intelligence

Game-tree exploration uses recursive search algorithms.

## Common Mistakes Beginners Make

### Missing base case

Leads to infinite recursion.

### Excessive recursion depth

Too many recursive calls can cause stack overflow.

### Inefficient recursion

### Example:

Naive Fibonacci recursion has exponential complexity.

## Interview Tips

Recursion is a common topic in coding interviews.

### Interviewers test:

- understanding of base cases

- recursive problem breakdown

- stack behavior

### Common interview problems:

- factorial

- Fibonacci

- reverse linked list recursively

- tree traversals

- permutations

## Exercises

## Conceptual Questions

- What is recursion?

- What is a base case in recursion?

- What happens if a recursive function has no base case?

- What is a stack frame?

- Why does recursion consume extra memory?

## Coding Exercises

- Write a recursive function to compute factorial.

- Write a recursive program to print numbers from 1 to n.

- Write a recursive function to reverse a string.

## Interview Problems

- Implement Fibonacci using recursion.

- Write a recursive function to compute the power of a number.

- Print all permutations of a string.

## Summary

Recursion is a powerful programming technique that allows complex problems to be solved elegantly by breaking them into smaller, manageable subproblems.`,
    },
    {
      slug: "chapter-10-divide-and-conquer-algorithms",
      title: "Divide and Conquer Algorithms",
      summary: "Many computational problems become easier to solve when they are broken into smaller pieces. One of the most powerful techniques that follows this idea is the Divide and Conquer strategy. Divide and Conquer is an algorithm design technique where a problem is:…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 9,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Divide and Conquer breaks a problem into smaller subproblems.", "The technique consists of divide, conquer, and combine steps.", "Important algorithms using this technique include binary search, merge sort, and quick sort.", "Divide-and-conquer algorithms significantly improve efficiency.", "These algorithms are widely used in search systems, databases, and parallel computing."],
      selfAssessment: [],
      content: `# Divide and Conquer Algorithms

## Introduction

Many computational problems become easier to solve when they are broken into smaller pieces. One of the most powerful techniques that follows this idea is the Divide and Conquer strategy.

Divide and Conquer is an algorithm design technique where a problem is:

Divided into smaller subproblems

Solved recursively

Combined to obtain the final solution

This technique is used in some of the most efficient algorithms in computer science, including:

Merge Sort

Quick Sort

Binary Search

Strassen’s Matrix Multiplication

Divide and Conquer algorithms are particularly useful when solving problems involving large datasets because they significantly reduce computational complexity.

In this chapter, we will study:

the concept of divide and conquer

recursive problem decomposition

binary search algorithm

merge sort

quick sort

These algorithms are important both in academic study and technical interviews.

## Intuition Behind Divide and Conquer

Imagine you need to organize a large pile of documents.

### Instead of sorting everything at once, you could:

- divide the documents into smaller piles

- sort each pile individually

- merge the sorted piles together

This strategy is much easier than handling the entire pile at once.

The same concept applies to algorithms.

### General pattern:

Divide → Break problem into smaller partsConquer → Solve each part recursivelyCombine → Merge solutions

### Example visualization:

### Problem |Divide / \\Sub1 Sub2 | |Solve Solve \\ / Combine | Final Solution

## Problem the Concept Solves

### Some computational problems are difficult to solve directly because:

- the input size is very large

- operations become too slow

- naive algorithms have poor performance

### For example:

Sorting a list of 1 million numbers using a simple algorithm like bubble sort would be extremely slow.

However, divide-and-conquer algorithms like merge sort can solve the same problem much faster.

### Divide and conquer improves efficiency by:

- reducing problem size

- enabling recursion

- improving time complexity

## Core Theory

A divide-and-conquer algorithm follows three steps.

## Divide

Break the original problem into smaller subproblems.

### Example:

Split an array into two halves.

## Conquer

Solve each subproblem recursively.

If the subproblem becomes small enough, solve it directly.

## Combine

Merge the results of the subproblems to produce the final result.

## Binary Search

Binary search is a classic example of the divide-and-conquer technique.

It searches for an element in a sorted array by repeatedly dividing the search space in half.

### Example array:

### [2, 5, 8, 12, 16, 23, 38]

Search for 12.

### Step 1:

### Middle element = 12

Element found immediately.

If the element is smaller or larger, the search continues in the left or right half.

## Binary Search Algorithm

### Steps:

- Find the middle element

- If target equals middle → return index

- If target < middle → search left half

- If target > middle → search right half

## Python Implementation

\`\`\`py
def binary_search(arr, target): left = 0 right = len(arr) - 1 while left <= right: mid = (left + right) // 2 if arr[mid] == target: return mid elif arr[mid] < target: left = mid + 1 else: right = mid - 1 return -1
\`\`\`

## Time Complexity

Binary search reduces the search space by half each step.

### Time complexity:

### O(log n)

## Merge Sort

Merge sort is a divide-and-conquer sorting algorithm.

### Steps:

- divide the array into two halves

- recursively sort each half

- merge the sorted halves

### Example:

### [8, 3, 5, 2]

### Divide:

### [8, 3] [5, 2]

### Divide again:

### [8] [3] [5] [2]

### Merge sorted pairs:

### [3, 8] [2, 5]

### Final merge:

### [2, 3, 5, 8]

## Python Implementation

\`\`\`py
def merge_sort(arr): if len(arr) > 1: mid = len(arr) // 2 left = arr[:mid] right = arr[mid:] merge_sort(left) merge_sort(right) i = j = k = 0 while i < len(left) and j < len(right): if left[i] < right[j]: arr[k] = left[i] i += 1 else: arr[k] = right[j] j += 1 k += 1 while i < len(left): arr[k] = left[i] i += 1 k += 1 while j < len(right): arr[k] = right[j] j += 1 k += 1
\`\`\`

## Time Complexity

### Merge sort runs in:

### O(n log n)

This makes it significantly faster than many simple sorting algorithms.

## Quick Sort

Quick sort is another divide-and-conquer sorting algorithm.

### Idea:

- choose a pivot element

- partition the array around the pivot

- recursively sort the subarrays

### Example:

### [8, 3, 5, 2]

### Choose pivot:

### 8

### Partition:

### [3, 5, 2] 8

Sort left side recursively.

### Final result:

### [2, 3, 5, 8]

## Python Implementation

\`\`\`py
def quick_sort(arr): if len(arr) <= 1: return arr pivot = arr[len(arr)//2] left = [x for x in arr if x < pivot] middle = [x for x in arr if x == pivot] right = [x for x in arr if x > pivot] return quick_sort(left) + middle + quick_sort(right)
\`\`\`

## Time Complexity

### Average case:

### O(n log n)

### Worst case:

### O(n²)

## Visualization of Divide and Conquer

### Example with merge sort:

[8,3,5,2] [8,3,5,2] / \\ [8,3] [5,2] / \\ / \\ [8] [3] [5] [2]Merge phase [3,8] [2,5] \\ / [2,3,5,8]

## Variations and Related Techniques

Several algorithms use divide-and-conquer ideas.

### Examples:

- Strassen’s matrix multiplication

- Karatsuba multiplication

- Fast Fourier Transform (FFT)

These algorithms significantly improve computational performance.

## Real-World Applications

Divide and conquer algorithms are widely used in real systems.

## Search Engines

Binary search is used in indexing structures.

## Databases

Efficient sorting algorithms process large datasets.

## Graphics Processing

Divide and conquer helps process large images.

## Parallel Computing

Problems can be divided among multiple processors.

## Common Mistakes Beginners Make

### Choosing poor pivot in quick sort

This can degrade performance.

### Incorrect recursion termination

Missing base case causes infinite recursion.

### Incorrect merging logic

Improper merge implementation can produce incorrect results.

## Interview Tips

Divide-and-conquer algorithms appear frequently in coding interviews.

### Common interview questions include:

- implement binary search

- implement merge sort

- implement quick sort

- analyze time complexity

### Candidates should understand:

- recursive thinking

- algorithm complexity

- when divide-and-conquer is applicable

## Exercises

## Conceptual Questions

- What is the divide-and-conquer strategy?

- What are the three steps of divide and conquer?

- Why is binary search efficient?

- What is the difference between merge sort and quick sort?

- Why does merge sort guarantee O(n log n) time?

## Coding Exercises

- Implement binary search using recursion.

- Implement merge sort in Python.

- Implement quick sort.

## Interview Problems

- Find the kth smallest element in an array.

- Count inversions in an array using merge sort.

- Find the majority element using divide and conquer.

## Summary

Understanding divide-and-conquer strategies helps programmers design efficient and scalable algorithms.`,
    },
    {
      slug: "chapter-11-tree-data-structures",
      title: "Tree Data Structures",
      summary: "A tree is a hierarchical data structure that represents relationships between elements in a parent–child structure. Trees are widely used in computer science because many real-world systems naturally form hierarchical structures. Examples of hierarchical…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 10,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "A tree is a hierarchical data structure.", "Each element in a tree is called a node.", "The top node is called the root.", "A binary tree allows at most two children per node.", "Tree traversal methods include inorder, preorder, and postorder.", "Trees are widely used in file systems, databases, AI, and web technologies."],
      selfAssessment: [],
      content: `# Tree Data Structures

## Introduction

A tree is a hierarchical data structure that represents relationships between elements in a parent–child structure. Trees are widely used in computer science because many real-world systems naturally form hierarchical structures.

Examples of hierarchical structures include:

file systems in operating systems

organization charts in companies

XML and HTML document structures

decision trees in machine learning

database indexing structures

Unlike linear data structures such as arrays, stacks, and queues, trees organize data in multiple levels, allowing efficient searching, insertion, and hierarchical representation.

In this chapter, we will learn:

basic tree terminology

binary trees

tree representation

tree traversal algorithms

Trees form the foundation for many advanced data structures such as binary search trees, heaps, B-trees, and tries.

## Intuition Behind Trees

Consider a family tree.

### Example:

### Grandparent / \\ Parent1 Parent2 / \\ \\ Child1 Child2 Child3

### Each person has:

- a parent

- possibly multiple children

This structure naturally forms a tree-like hierarchy.

Similarly, in computer science, a tree represents relationships between data elements where:

- one element is the root

- other elements branch out as children

### Visualization of a simple tree:

### / \\ 5 15 / \\ \\ 2 7 20

## Problem the Concept Solves

Linear data structures store data sequentially.

### Example:

### → 20 → 30 → 40 → 50

Searching in a large linear structure can be inefficient.

However, hierarchical structures like trees can significantly improve performance.

### For example:

- searching in an unsorted list takes O(n)

- searching in a balanced binary search tree takes O(log n)

### Trees allow efficient:

- searching

- insertion

- hierarchical data representation

## Core Theory

## Basic Tree Terminology

Understanding tree terminology is essential.

### Node

A node is the basic element of a tree that stores data.

### Root

The root is the topmost node of the tree.

### Example:

### Root → 10

### Parent

A node that has child nodes.

### Example:

### is parent of 5 and 15

### Child

Nodes that descend from a parent node.

### Leaf Node

A node with no children.

### Example:

### 2, 7, 20

### Edge

The connection between two nodes.

### Height of Tree

The number of edges on the longest path from root to leaf.

### Depth of Node

The number of edges from the root to that node.

## Binary Tree

A binary tree is a tree where each node can have at most two children.

### These children are called:

- left child

- right child

### Example:

### / \\ 5 15 / \\ \\ 2 7 20

### Properties of binary trees:

- maximum children per node = 2

- nodes arranged hierarchically

- efficient for searching and sorting algorithms

## Tree Representation

Trees can be represented in memory using two main approaches.

## Linked Representation

### Each node contains:

- data

- pointer to left child

- pointer to right child

### Example node structure:

┌───────────┬──────────┬──────────┐│ data │ left │ right │└───────────┴──────────┴──────────┘

### Python implementation:

\`\`\`py
class Node: def __init__(self, data): self.data = data self.left = None self.right = None
\`\`\`

## Array Representation

Binary trees can also be stored in arrays.

### Example tree:

### / \\ 2 3 / \\ 4 5

### Array representation:

### Index: 0 1 2 3 4Value: [1, 2, 3, 4, 5]

### Child index formulas:

### Left child = 2*i + 1Right child = 2*i + 2

## Tree Traversal

Traversal means visiting all nodes of a tree in a specific order.

Three main traversal methods exist.

## Inorder Traversal

### Order:

### Left → Root → Right

### Example tree:

### / \\ 5 15

### Traversal:

### → 10 → 15

### Python implementation:

\`\`\`py
def inorder(root): if root: inorder(root.left) print(root.data) inorder(root.right)
\`\`\`

## Preorder Traversal

### Order:

### Root → Left → Right

### Traversal:

### → 5 → 15

### Python implementation:

\`\`\`py
def preorder(root): if root: print(root.data) preorder(root.left) preorder(root.right)
\`\`\`

## Postorder Traversal

### Order:

### Left → Right → Root

### Traversal:

### → 15 → 10

### Python implementation:

\`\`\`py
def postorder(root): if root: postorder(root.left) postorder(root.right) print(root.data)
\`\`\`

## Visualization of Traversals

### Example tree:

### / \\ 5 15 / \\ 2 7

### Traversal results:

### Inorder : 2 5 7 10 15Preorder : 10 5 2 7 15Postorder : 2 7 5 15 10

## Python Example — Building a Tree

root = Node(10)root.left = Node(5)root.right = Node(15)root.left.left = Node(2)root.left.right = Node(7)

### Tree created:

### / \\ 5 15 / \\ 2 7

## Time Complexity of Traversals

Every node is visited once.

## Variations and Related Trees

Several important tree structures exist.

### Examples include:

- Binary Search Trees (BST)

- AVL Trees

- Red-Black Trees

- Heaps

- B-Trees

- Tries

These structures optimize searching and indexing operations.

## Real-World Applications

Trees are widely used in computing systems.

## File Systems

Operating systems organize files using tree structures.

### Example:

### Root ├── Documents │ ├── file1 │ └── file2 └── Downloads

## Databases

Database indexing uses tree structures such as B-Trees.

## Artificial Intelligence

Decision trees are used in machine learning.

## Web Technologies

HTML documents form a DOM tree structure.

## Common Mistakes Beginners Make

### Confusing tree traversal orders

Understanding traversal order is essential.

### Missing base condition in recursion

This may cause infinite recursion.

### Incorrect child pointer assignments

Improper node linking breaks the tree structure.

## Interview Tips

Tree problems frequently appear in technical interviews.

### Common interview topics include:

- tree traversal

- tree height calculation

- lowest common ancestor

- binary tree inversion

- balanced tree checking

### Interviewers expect candidates to:

- understand recursion

- implement traversal algorithms

- analyze complexity

## Exercises

## Conceptual Questions

- What is a tree data structure?

- What is the root of a tree?

- What is a leaf node?

- What is the difference between depth and height?

- What is a binary tree?

## Coding Exercises

- Implement a binary tree in Python.

- Write a function for inorder traversal.

- Write a program to calculate tree height.

## Interview Problems

- Find the maximum depth of a binary tree.

- Check if a binary tree is symmetric.

- Find the lowest common ancestor of two nodes.

## Summary

Understanding trees is essential because they form the foundation for many advanced data structures and efficient algorithms used in modern computing systems.`,
    },
    {
      slug: "chapter-12-binary-search-trees-bst",
      title: "Binary Search Trees (BST)",
      summary: "A Binary Search Tree (BST) is a special type of binary tree that maintains a specific ordering property among its elements. This ordering allows efficient searching, insertion, and deletion operations. In a Binary Search Tree: all values in the left subtree…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 11,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key points from this chapter:", "A Binary Search Tree (BST) is a binary tree with an ordering property.", "For every node: left subtree < node < right subtree.", "BST supports efficient search, insertion, and deletion operations.", "Inorder traversal of a BST produces sorted data.", "BST performance depends on tree balance.", "Balanced variants such as AVL trees and Red-Black trees improve performance."],
      selfAssessment: [],
      content: `# Binary Search Trees (BST)

## Introduction

A Binary Search Tree (BST) is a special type of binary tree that maintains a specific ordering property among its elements. This ordering allows efficient searching, insertion, and deletion operations.

In a Binary Search Tree:

all values in the left subtree of a node are smaller than the node

all values in the right subtree of a node are greater than the node

Because of this property, many operations on a BST can be performed much faster than in unsorted data structures such as arrays or linked lists.

Binary Search Trees are widely used in:

database indexing

searching systems

memory management

dictionary implementations

symbol tables in compilers

In this chapter, we will study:

properties of binary search trees

insertion operations

deletion operations

searching in BST

validation of BST

lowest common ancestor problem

BSTs are extremely important in both academic studies and coding interviews.

## Intuition Behind Binary Search Trees

Consider a sorted list of numbers.

### Example:

### [2, 5, 7, 10, 15, 20]

If we want to search for a number, we often use binary search, which repeatedly divides the list into halves.

A Binary Search Tree organizes data so that binary search can be performed naturally.

### Example BST:

### / \\ 5 15 / \\ \\ 2 7 20

### If we want to search for 7:

- Compare with root (10) → smaller → go left

- Compare with 5 → larger → go right

- Found 7

This reduces the search space quickly.

## Problem the Concept Solves

Searching in an unsorted list requires scanning every element.

### Example:

### → 20 → 30 → 40 → 50

### Worst-case search time:

### O(n)

### But in a balanced Binary Search Tree:

### / \\ 20 40 / \\ 10 50

Searching requires fewer comparisons.

### Time complexity becomes:

### O(log n)

This efficiency makes BSTs extremely useful for large datasets.

## Core Theory

## BST Property

### For every node in a BST:

### Left subtree values < Node value < Right subtree values

### Example:

### / \\ 30 70 / \\ / \\ 20 40 60 80

### Here:

- values left of 50 are smaller

- values right of 50 are larger

This property must hold for every node in the tree.

## Searching in BST

Searching begins at the root.

### Steps:

- compare target value with current node

- if equal → found

- if smaller → move to left subtree

- if larger → move to right subtree

### Python Implementation

\`\`\`py
def search(root, key): if root is None or root.data == key: return root if key < root.data: return search(root.left, key) return search(root.right, key)
\`\`\`

## Insertion in BST

Insertion follows the same rule as searching.

### Steps:

- start from root

- compare new value with current node

- move left or right accordingly

- insert node when empty position found

### Example insertion:

Insert 25 into the tree.

### / \\ 20 40

### Result:

### / \\ 20 40 \\ 25

### Python Implementation

\`\`\`py
def insert(root, key): if root is None: return Node(key) if key < root.data: root.left = insert(root.left, key) else: root.right = insert(root.right, key) return root
\`\`\`

## Deletion in BST

Deletion is more complex than insertion.

There are three cases.

## Case 1 — Node with No Children (Leaf Node)

Simply remove the node.

### Example:

### / 5

### Delete 5:

### 10

## Case 2 — Node with One Child

Replace node with its child.

### Example:

### / 5 \\ 7

### Delete 5:

### / 7

## Case 3 — Node with Two Children

Replace node with inorder successor.

### Example:

### / \\ 30 70

Inorder successor of 50 is 60.

### Python Implementation

\`\`\`py
def delete(root, key): if root is None: return root if key < root.data: root.left = delete(root.left, key) elif key > root.data: root.right = delete(root.right, key) else: if root.left is None: return root.right elif root.right is None: return root.left temp = min_value_node(root.right) root.data = temp.data root.right = delete(root.right, temp.data) return root
\`\`\`

## BST Traversals

Tree traversals are commonly used with BSTs.

### Example tree:

### / \\ 30 70 / \\ / \\ 20 40 60 80

### Inorder Traversal

### 30 40 50 60 70 80

### Important property:

Inorder traversal of BST produces sorted output.

## Visualization

### BST example:

### Insert: 50, 30, 70, 20, 40 50 / \\ 30 70 / \\ 20 40

### Search for 40:

### → left30 → right40 → found

## Time Complexity

Worst case occurs when the tree becomes skewed.

### Example:

### \\ 20 \\ 30 \\ 40

## Example Problems

## Validate BST

Check whether a tree satisfies BST property.

## Lowest Common Ancestor (LCA)

Find the lowest node that is an ancestor of two nodes.

### Example:

### / \\ 10 30 / \\ 5 15

LCA of 5 and 15 is 10.

## Kth Smallest Element

Use inorder traversal.

## Variations and Related Trees

Binary Search Trees have several improved variants.

### Examples include:

- AVL Trees (self-balancing BST)

- Red-Black Trees

- Splay Trees

- B-Trees

These structures ensure better performance.

## Real-World Applications

Binary search trees are widely used in computing systems.

## Databases

Database indexes often use tree structures.

## File Systems

Directory structures sometimes use tree-based indexing.

## Memory Management

Operating systems track memory blocks using tree structures.

## Compiler Design

Symbol tables often use BST-based implementations.

## Common Mistakes Beginners Make

### Forgetting BST property

Nodes must always satisfy ordering rules.

### Incorrect deletion logic

Handling two-child deletion incorrectly.

### Ignoring worst-case complexity

Unbalanced BST behaves like linked list.

## Interview Tips

BST problems frequently appear in coding interviews.

### Common problems include:

- insert into BST

- delete node from BST

- validate BST

- lowest common ancestor

- kth smallest element

### Interviewers expect candidates to:

- understand recursion

- implement BST operations

- analyze complexity

## Exercises

### Conceptual Questions

- What is a Binary Search Tree?

- What property must every BST satisfy?

- Why does inorder traversal produce sorted output?

- What happens when BST becomes skewed?

- What is an inorder successor?

### Coding Exercises

- Implement BST insertion in Python.

- Implement BST search.

- Write a program to find minimum element in BST.

### Interview Problems

- Validate a binary search tree.

- Find lowest common ancestor.

- Find kth smallest element in BST.

## Summary

Binary Search Trees are fundamental data structures used in many searching, indexing, and database systems.`,
    },
      ],
    },
    {
      slug: "part-2",
      title: "Part 2 — Chapters 13–24",
      summary: "Chapters 13 to 24 of Python DSA.",
      order: 2,
      difficulty: "intermediate",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-13-heaps-and-priority-queues",
      title: "Heaps and Priority Queues",
      summary: "A heap is a special type of tree-based data structure that satisfies the heap property. Heaps are mainly used to implement priority queues, where elements are processed based on priority rather than insertion order. In many real-world applications, tasks must…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 12,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key points from this chapter:", "A heap is a complete binary tree that satisfies the heap property.", "Types include min heap and max heap.", "Heaps are commonly implemented using arrays.", "Heap operations include insert, delete, and heapify.", "Heaps efficiently implement priority queues.", "Heap-based algorithms such as heap sort have O(n log n) complexity."],
      selfAssessment: [],
      content: `# Heaps and Priority Queues

## Introduction

A heap is a special type of tree-based data structure that satisfies the heap property. Heaps are mainly used to implement priority queues, where elements are processed based on priority rather than insertion order.

In many real-world applications, tasks must be executed according to priority. For example:

operating system process scheduling

event-driven simulations

network packet management

shortest path algorithms such as Dijkstra’s algorithm

In these cases, we want to efficiently retrieve the highest-priority element.

Heaps provide an efficient way to support such operations.

In this chapter we will study:

heap data structure

min heap and max heap

heap representation

heap operations

heapify process

heap sort

applications of priority queues

Heaps are also very important for technical interviews and algorithm design.

## Intuition Behind Heaps

Imagine a priority task list.

### Suppose tasks have priorities:

### Task A – Priority 1Task B – Priority 5Task C – Priority 3Task D – Priority 2

Instead of processing tasks in arrival order, we want to process highest priority first.

### Correct order:

### Task B → Task C → Task D → Task A

A heap helps us efficiently find and remove the highest priority element.

## Problem the Concept Solves

Suppose we maintain a list of numbers and repeatedly need to find the largest or smallest element.

### Example:

### [5, 2, 8, 1, 9]

### If we use a normal array:

- finding maximum requires scanning all elements

- time complexity = O(n)

### But using a heap:

- maximum or minimum can be retrieved in O(1) time

- insertion and deletion take O(log n) time

This makes heaps highly efficient for priority-based operations.

## Core Theory

## Heap Definition

A heap is a complete binary tree that satisfies the heap property.

Two main types exist.

## Max Heap

### In a max heap:

### Parent ≥ Children

### Example:

### / \\ 30 40 / \\ / 10 20 35

The largest element is always at the root.

## Min Heap

### In a min heap:

### Parent ≤ Children

### Example:

### / \\ 8 9 / \\ 15 12

The smallest element is always at the root.

## Heap Representation

Heaps are usually stored in arrays rather than linked structures.

### Example heap:

### / \\ 20 30 / \\ 40 50

### Array representation:

### Index: 0 1 2 3 4Value: 10 20 30 40 50

### Index relationships:

\`\`\`py
Parent = (i-1) // 2Left Child = 2*i + 1Right Child = 2*i + 2
\`\`\`

## Heap Operations

## Insert Operation

### Steps:

- insert element at end

- restore heap property using heapify-up

### Example:

### Insert 15

### Before 10 / \\ 20 30

### After insertion:

### / \\ 15 30 / 20

## Extract (Remove Root)

### Steps:

- remove root element

- replace with last element

- restore heap property using heapify-down

### Example:

### Remove 10

### Before 10 / \\ 20 30

### After removal:

### / 30

## Heapify Process

Heapify restores the heap property.

### Two types:

### Heapify Up

Used after insertion.

### Heapify Down

Used after deletion.

### Example:

### Parent: 20Child: 5

Swap to maintain min heap.

## Python Implementation (Min Heap)

\`\`\`py
import heapqheap = []heapq.heappush(heap, 10)heapq.heappush(heap, 5)heapq.heappush(heap, 20)print(heapq.heappop(heap))
\`\`\`

### Output:

### 5

Python's heapq module implements a min heap.

## Heap Sort

Heap sort is a sorting algorithm based on heaps.

### Steps:

- build max heap

- swap root with last element

- reduce heap size

- repeat heapify

### Example:

### Input:[4, 10, 3, 5, 1]

### Sorted result:

### [1, 3, 4, 5, 10]

### Python Implementation

\`\`\`py
import heapqarr = [4,10,3,5,1]heapq.heapify(arr)sorted_list = []while arr: sorted_list.append(heapq.heappop(arr))print(sorted_list)
\`\`\`

## Visualization

### Example max heap:

### / \\ 70 60 / \\ 40 50

### Remove root:

### / \\ 50 60 / 40

Heap property maintained.

## Time Complexity

## Priority Queue

A priority queue is an abstract data structure where elements are processed based on priority.

### Example:

### Priority: High → Medium → Low

Heap is the most efficient way to implement priority queues.

## Real-World Applications

## Operating Systems

CPU scheduling uses priority queues.

## Graph Algorithms

### Algorithms such as:

- Dijkstra’s shortest path

- Prim’s minimum spanning tree

use heaps.

## Event Simulation

Simulation systems schedule events by priority.

## Networking

Routers process packets based on priority.

## Common Mistakes Beginners Make

### Confusing heap with binary search tree

Heap maintains priority, not sorted order.

### Incorrect index calculations

Parent/child index formulas must be correct.

### Forgetting heapify step

Heap property must be maintained after insertion or deletion.

## Interview Tips

Heaps frequently appear in coding interviews.

### Common problems include:

- find k largest elements

- top k frequent elements

- merge k sorted lists

- median of data stream

### Candidates should understand:

- heap property

- heap operations

- priority queue implementation

## Exercises

## Conceptual Questions

- What is a heap data structure?

- What is the difference between min heap and max heap?

- Why are heaps implemented using arrays?

- What is heapify?

- What is a priority queue?

## Coding Exercises

- Implement a min heap in Python.

- Implement heap insertion operation.

- Implement heap sort.

## Interview Problems

- Find the k largest elements in an array.

- Merge k sorted arrays using heap.

- Find the median of a stream of numbers.

## Summary

Heaps are powerful data structures widely used in scheduling, graph algorithms, and large-scale systems.`,
    },
    {
      slug: "chapter-14-hash-tables",
      title: "Hash Tables",
      summary: "A hash table is a data structure used to store data in key–value pairs and allows extremely fast data retrieval. Hash tables are designed to provide constant-time average performance for insertion, deletion, and search operations. Hash tables are widely used…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 13,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "A hash table stores data in key–value pairs.", "A hash function converts keys into array indices.", "Hash tables provide O(1) average-time operations.", "Collisions occur when multiple keys map to the same index.", "Collision resolution techniques include chaining and open addressing.", "Hash tables are widely used in databases, caching systems, and compilers."],
      selfAssessment: [],
      content: `# Hash Tables

## Introduction

A hash table is a data structure used to store data in key–value pairs and allows extremely fast data retrieval. Hash tables are designed to provide constant-time average performance for insertion, deletion, and search operations.

Hash tables are widely used in many software systems such as:

databases

caches

compilers

dictionaries and maps

symbol tables

For example, when you search for a contact in your phone by name, the system must quickly locate the associated phone number. Hash tables enable such fast lookups.

In this chapter, we will learn:

the concept of hashing

hash functions

collision resolution techniques

chaining

open addressing

practical problems solved using hashing

Hash tables are extremely important in both real-world software development and technical interviews.

## Intuition Behind Hash Tables

Imagine a library with thousands of books.

Instead of searching every shelf, the library may assign each book a unique catalog number that directly points to its storage location.

### Example:

### Book Title → Location Code

If we know the code, we can immediately find the book.

Hash tables work in a similar way.

A hash function converts a key into an index where the value is stored.

### Example:

### Key → Hash Function → Index

### Example mapping:

### "apple" → 3"banana" → 7"grape" → 2

This index determines where the data is stored in memory.

## Problem the Concept Solves

### Suppose we store data in an array:

### ["Alice", "Bob", "Charlie", "David"]

To find "Charlie", we must scan each element.

### Worst-case time complexity:

### O(n)

With hashing, we compute the index directly.

### Example:

### hash("Charlie") → index 5

Now we access the value instantly.

### Average search time becomes:

### O(1)

This makes hash tables extremely efficient for large datasets.

## Core Theory

## Hash Function

A hash function converts a key into an index in the hash table.

### Example:

### hash(key) → index

### Example function:

### index = key % table_size

### Example:

### key = 25table size = 10index = 25 % 10 = 5

Thus the value is stored at index 5.

### A good hash function should:

- distribute keys uniformly

- minimize collisions

- be fast to compute

## Hash Table Structure

A hash table typically consists of an array of buckets.

### Example:

### Index Value0 —1 —2 apple3 banana4 —5 orange

Each index stores data associated with a key.

## Collisions

A collision occurs when two different keys produce the same hash index.

### Example:

### hash("apple") → 5hash("grape") → 5

Both map to the same index.

Collisions must be handled properly.

Two common techniques exist.

## Collision Resolution — Chaining

In separate chaining, each table index stores a linked list of elements.

### Example:

### Index Values0 —1 —2 apple → grape3 banana

If multiple keys map to the same index, they are stored in a linked list.

### Advantages:

- simple implementation

- flexible storage

### Disadvantages:

- additional memory overhead

## Collision Resolution — Open Addressing

In open addressing, elements are stored directly in the table.

If a collision occurs, the algorithm searches for another empty slot.

Several probing techniques exist.

## Linear Probing

Search sequentially for the next empty slot.

### Example:

### index = hash(key)if occupied: index + 1

### Example:

### Index Value3 apple4 banana5 grape

## Quadratic Probing

Search using quadratic intervals.

### Example:

### index + 1²index + 2²index + 3²

## Double Hashing

Uses two hash functions.

### Example:

### index = h1(key) + i*h2(key)

Double hashing reduces clustering.

## Python Implementation

Python provides built-in hash tables through dictionaries.

### Example:

\`\`\`py
data = {}data["apple"] = 10data["banana"] = 20data["orange"] = 15print(data["banana"])
\`\`\`

### Output:

### 20

Dictionary operations use hashing internally.

## Visualization

### Example hash table:

### Index Data0 —1 apple2 —3 banana → mango4 —5 orange

Here index 3 contains a chain due to collision.

## Time Complexity

Worst case occurs when many collisions occur.

## Example Problems

## Two Sum Problem

### Given:

### nums = [2,7,11,15]target = 9

### Output:

### [0,1]

Using a hash table allows solving this in O(n) time.

## Frequency Counting

Count occurrences of elements.

### Example:

### Input:banana

### Output:

### b:1a:3n:2

Hash tables make counting efficient.

## Real-World Applications

Hash tables are widely used in computing systems.

## Databases

Hash indexing enables fast record retrieval.

## Caching Systems

Systems like Redis use hashing to store data quickly.

## Compilers

Symbol tables store variable names and attributes.

## Password Storage

Passwords are stored using hash functions for security.

## Common Mistakes Beginners Make

### Poor hash function

This leads to many collisions.

### Ignoring load factor

A high load factor reduces performance.

### Incorrect collision handling

Improper collision handling may cause data loss.

## Interview Tips

Hashing appears frequently in coding interviews.

### Common problems include:

- two sum

- longest substring without repeating characters

- group anagrams

- top k frequent elements

Interviewers expect candidates to recognize problems that can be solved using hash maps or sets.

## Exercises

## Conceptual Questions

- What is hashing?

- What is a hash function?

- What causes collisions in a hash table?

- What is separate chaining?

- What is open addressing?

## Coding Exercises

- Implement a hash table using chaining.

- Implement frequency counting using hashing.

- Implement a simple dictionary.

## Interview Problems

- Solve the Two Sum problem.

- Find the first non-repeating character in a string.

- Group anagrams using hashing.

## Summary

Hash tables are among the most powerful data structures for building high-performance software systems.`,
    },
    {
      slug: "chapter-15-graph-representation",
      title: "Graph Representation",
      summary: "A graph is a powerful data structure used to represent relationships between objects. Unlike linear data structures such as arrays or trees, graphs can represent complex networks of connections. Graphs are widely used in many real-world systems, including:…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 14,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "A graph represents relationships between objects.", "Graphs consist of vertices and edges.", "Graphs can be directed or undirected.", "Graphs can also be weighted or unweighted.", "Common graph representations include adjacency matrix and adjacency list.", "Graphs are used in many real-world systems such as social networks, navigation systems, and communication networks."],
      selfAssessment: [],
      content: `# Graph Representation

## Introduction

A graph is a powerful data structure used to represent relationships between objects. Unlike linear data structures such as arrays or trees, graphs can represent complex networks of connections.

Graphs are widely used in many real-world systems, including:

social networks (friends and followers)

transportation networks (roads and flights)

computer networks (routers and connections)

recommendation systems

dependency graphs in compilers

In a graph:

vertices (nodes) represent objects

edges represent connections between objects

For example, in a social network:

each person is a vertex

friendships are edges

In this chapter, we will learn:

basic graph terminology

directed vs undirected graphs

graph representation techniques

adjacency matrix

adjacency list

Graph representation is important because it determines how efficiently graph algorithms can be implemented.

## Intuition Behind Graphs

Consider a map of cities connected by roads.

### Example:

### City A ---- City B | | | |City C ---- City D

Each city represents a vertex, and each road represents an edge.

This network can be modeled using a graph.

### Visualization:

### Vertices: A, B, C, DEdges: (A,B), (A,C), (B,D), (C,D)

Graphs allow us to represent such relationships clearly.

## Problem the Concept Solves

Many problems involve connections between entities.

### Examples include:

### Social Networks

People connected by friendships.

### Navigation Systems

Cities connected by roads.

### Internet

Computers connected through networks.

### Recommendation Systems

Users connected to products or movies.

Using graphs allows algorithms to analyze these relationships efficiently.

## Core Theory

## Basic Graph Terminology

### Vertex (Node)

A vertex represents an entity.

### Example:

### A, B, C, D

### Edge

An edge represents a connection between two vertices.

### Example:

### (A, B)

### Degree

The degree of a vertex is the number of edges connected to it.

### Example:

### A connected to B and CDegree(A) = 2

### Path

A path is a sequence of vertices connected by edges.

### Example:

### A → B → D

### Cycle

A cycle occurs when a path starts and ends at the same vertex.

### Example:

### A → B → C → A

## Directed vs Undirected Graphs

## Undirected Graph

Edges have no direction.

### Example:

### A — B

### This means:

### A connected to BB connected to A

### Visualization:

### A — B| |C — D

## Directed Graph

Edges have a direction.

### Example:

### A → B

### This means:

- A points to B

- B does not necessarily point to A

### Example:

### A → B → C

### Directed graphs are used in:

- web links

- dependency graphs

- task scheduling

## Weighted Graphs

In some graphs, edges have weights or costs.

### Example:

### A --5-- BA --3-- C

### Here numbers represent:

- distance

- cost

- time

### Weighted graphs are used in:

- GPS navigation

- network routing

- shortest path algorithms

## Graph Representation

Graphs must be stored in memory in a way that allows efficient operations.

### Two common representations are:

- Adjacency Matrix

- Adjacency List

## Adjacency Matrix

An adjacency matrix is a 2D matrix used to represent a graph.

If there is an edge between two vertices, the matrix entry is 1.

Otherwise, it is 0.

### Example graph:

### A — B| |C — D

### Adjacency matrix:

### A B C DA [ 0 1 1 0 ]B [ 1 0 0 1 ]C [ 1 0 0 1 ]D [ 0 1 1 0 ]

### Advantages:

- easy to implement

- constant time edge lookup

### Disadvantages:

- consumes more memory

- inefficient for sparse graphs

## Adjacency List

An adjacency list stores neighbors for each vertex.

### Example graph:

### A — B| |C — D

### Adjacency list:

### A → B, CB → A, DC → A, DD → B, C

### Advantages:

- memory efficient

- ideal for sparse graphs

### Disadvantages:

- edge lookup slower than matrix

## Python Implementation

## Adjacency List Implementation

\`\`\`py
class Graph: def __init__(self): self.graph = {} def add_edge(self, u, v): if u not in self.graph: self.graph[u] = [] self.graph[u].append(v) def display(self): for node in self.graph: print(node, "->", self.graph[node])g = Graph()g.add_edge("A","B")g.add_edge("A","C")g.add_edge("B","D")g.display()
\`\`\`

### Output:

### A -> ['B', 'C']B -> ['D']

## Visualization

### Example graph:

### A / \\ B C \\ / D

### Adjacency list:

### A → B, CB → A, DC → A, DD → B, C

### Adjacency matrix:

### A B C DA [ 0 1 1 0 ]B [ 1 0 0 1 ]C [ 1 0 0 1 ]D [ 0 1 1 0 ]

## Time Complexity Comparison

### Where:

### V = number of verticesE = number of edges

## Variations and Related Concepts

Graphs can be classified into several types.

### Examples include:

- directed graphs

- undirected graphs

- weighted graphs

- cyclic graphs

- acyclic graphs

### Special graphs include:

- trees

- directed acyclic graphs (DAGs)

## Real-World Applications

Graphs are used in many computing systems.

## Social Networks

Users connected by friendships.

## Navigation Systems

Cities connected by roads.

## Internet Routing

Routers connected by network links.

## Recommendation Systems

Users connected to items.

## Common Mistakes Beginners Make

### Confusing edges and vertices

Edges represent relationships.

### Choosing wrong representation

Adjacency matrix may waste memory.

### Ignoring graph direction

Directed and undirected graphs behave differently.

## Interview Tips

Graph representation is the foundation for graph algorithms.

### Interview problems often involve:

- BFS traversal

- DFS traversal

- shortest path algorithms

- cycle detection

### Candidates should understand:

- adjacency matrix

- adjacency list

- graph traversal techniques

## Exercises

### Conceptual Questions

- What is a graph data structure?

- What is a vertex and edge?

- What is the difference between directed and undirected graphs?

- What is an adjacency matrix?

- What is an adjacency list?

### Coding Exercises

- Implement a graph using adjacency list in Python.

- Implement adjacency matrix representation.

- Write a program to count the number of edges in a graph.

### Interview Problems

- Detect cycle in an undirected graph.

- Find connected components.

- Implement graph traversal.

## Summary

Graph representation is essential for implementing powerful graph algorithms such as BFS, DFS, and shortest path algorithms.`,
    },
    {
      slug: "chapter-16-graph-traversal-algorithms",
      title: "Graph Traversal Algorithms",
      summary: "Graphs represent relationships between entities, but simply storing a graph is not enough. To analyze a graph, we must visit and process its vertices in a systematic way. This process is called graph traversal. Graph traversal algorithms allow us to explore…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 15,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Graph traversal means visiting all nodes of a graph.", "Two main traversal methods are Breadth-First Search (BFS) and Depth-First Search (DFS).", "BFS explores nodes level by level using a queue.", "DFS explores nodes deeply before backtracking using a stack or recursion.", "Both algorithms have O(V + E) complexity.", "Graph traversal forms the foundation for many advanced algorithms."],
      selfAssessment: [],
      content: `# Graph Traversal Algorithms

## Introduction

Graphs represent relationships between entities, but simply storing a graph is not enough. To analyze a graph, we must visit and process its vertices in a systematic way. This process is called graph traversal.

Graph traversal algorithms allow us to explore all vertices and edges in a graph. These algorithms are the foundation for solving many complex problems such as:

shortest path finding

cycle detection

connectivity analysis

network routing

social network analysis

Two fundamental graph traversal algorithms exist:

Breadth-First Search (BFS)

Depth-First Search (DFS)

These algorithms explore graphs in different ways and are used as building blocks for many advanced graph algorithms.

In this chapter we will study:

Breadth-First Search (BFS)

Depth-First Search (DFS)

applications of graph traversal

implementation using Python

## Intuition Behind Graph Traversal

Imagine exploring a maze with multiple paths.

You can explore the maze in two different ways.

### Method 1: Explore Nearby Paths First

You visit all rooms close to the entrance before going deeper.

This is similar to Breadth-First Search (BFS).

### Method 2: Follow One Path Until the End

You choose one path and continue exploring until no further path exists.

This is similar to Depth-First Search (DFS).

Both strategies eventually explore the entire maze, but they follow different exploration patterns.

## Problem the Concept Solves

Suppose we have a network of connected cities.

### Example graph:

### A / \\ B C / \\ \\ D E F

### We may want to answer questions such as:

- Can we reach city F from city A?

- What is the shortest path from A to E?

- Are all cities connected?

Graph traversal algorithms allow us to answer such questions efficiently.

## Breadth-First Search (BFS)

Breadth-First Search explores nodes level by level.

It visits all neighbors of a node before moving to the next level.

BFS uses a queue data structure.

## BFS Algorithm Steps

- Start from the source vertex.

- Mark it as visited.

- Add it to a queue.

- Remove a vertex from the queue.

- Visit all unvisited neighbors.

- Add neighbors to the queue.

- Repeat until the queue becomes empty.

## BFS Visualization

### Example graph:

### A / \\ B C / \\ \\ D E F

### Traversal starting from A:

### Level 1: ALevel 2: B, CLevel 3: D, E, F

### BFS order:

### A → B → C → D → E → F

## BFS Python Implementation

from collections import dequedef bfs(graph, start): visited = set() queue = deque([start]) visited.add(start) while queue: vertex = queue.popleft() print(vertex) for neighbor in graph[vertex]: if neighbor not in visited: visited.add(neighbor) queue.append(neighbor)

### Example graph:

\`\`\`py
graph = { "A": ["B","C"], "B": ["D","E"], "C": ["F"], "D": [], "E": [], "F": []}bfs(graph, "A")
\`\`\`

### Output:

### A B C D E F

## Depth-First Search (DFS)

Depth-First Search explores the graph as deep as possible before backtracking.

### DFS uses either:

- recursion, or

- a stack

## DFS Algorithm Steps

- Start from the source node.

- Mark it as visited.

- Visit one unvisited neighbor.

- Continue exploring deeper.

- Backtrack when no neighbors remain.

## DFS Visualization

### Using the same graph:

### A / \\ B C / \\ \\ D E F

### DFS order:

### A → B → D → E → C → F

DFS goes deep before exploring other branches.

## DFS Python Implementation

\`\`\`py
def dfs(graph, vertex, visited): visited.add(vertex) print(vertex) for neighbor in graph[vertex]: if neighbor not in visited: dfs(graph, neighbor, visited)visited = set()dfs(graph, "A", visited)
\`\`\`

### Output:

### A B D E C F

## BFS vs DFS

## Time Complexity

Both BFS and DFS visit every vertex and edge once.

### Time complexity:

### O(V + E)

### Where:

### V = number of verticesE = number of edges

## Example Problems

## Path Finding

Determine whether a path exists between two vertices.

## Connected Components

Identify groups of connected vertices.

## Cycle Detection

Detect cycles in directed or undirected graphs.

## Topological Sorting

Used in dependency scheduling problems.

## Real-World Applications

Graph traversal algorithms are widely used.

## Social Networks

Finding friends-of-friends connections.

## Web Crawlers

Search engines use BFS to crawl web pages.

## GPS Navigation

Pathfinding algorithms explore road networks.

## Artificial Intelligence

Game trees use DFS for exploring possible moves.

## Common Mistakes Beginners Make

### Forgetting visited set

Without marking visited nodes, traversal may loop infinitely.

### Incorrect recursion base cases

DFS recursion must handle visited nodes properly.

### Using wrong traversal method

Some problems require BFS instead of DFS.

## Interview Tips

Graph traversal is one of the most frequently tested topics in coding interviews.

### Common interview questions include:

- implement BFS

- implement DFS

- detect cycle in graph

- find shortest path in unweighted graph

- count connected components

### Candidates should understand:

- graph representation

- traversal logic

- complexity analysis

## Exercises

## Conceptual Questions

- What is graph traversal?

- What is Breadth-First Search?

- What is Depth-First Search?

- What data structures are used in BFS and DFS?

- What is the difference between BFS and DFS?

## Coding Exercises

- Implement BFS using Python.

- Implement DFS using recursion.

- Write a program to count connected components in a graph.

## Interview Problems

- Detect a cycle in a graph.

- Find the shortest path in an unweighted graph.

- Determine whether a graph is connected.

## Summary

Understanding BFS and DFS is essential for solving many real-world problems involving networks, navigation, and dependency systems.`,
    },
    {
      slug: "chapter-17-shortest-path-algorithms",
      title: "Shortest Path Algorithms",
      summary: "In many real-world applications, we often need to find the shortest path between two points. For example: finding the fastest route in GPS navigation determining the shortest network path between computers optimizing delivery routes in logistics systems…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 16,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Shortest path algorithms find the minimum distance between nodes in a graph.", "Dijkstra’s algorithm works for graphs with non-negative weights.", "Bellman–Ford works with negative weights and detects negative cycles.", "Floyd–Warshall finds shortest paths between all vertex pairs.", "These algorithms are widely used in navigation systems, networking, and optimization problems."],
      selfAssessment: [],
      content: `# Shortest Path Algorithms

## Introduction

In many real-world applications, we often need to find the shortest path between two points. For example:

finding the fastest route in GPS navigation

determining the shortest network path between computers

optimizing delivery routes in logistics systems

routing packets in the internet

Graphs are commonly used to model these problems, where:

vertices (nodes) represent locations or systems

edges represent connections between them

weights represent distance, cost, or time

A shortest path algorithm determines the path between two vertices that has the minimum total cost.

In this chapter we will study three important shortest path algorithms:

Dijkstra’s Algorithm

Bellman–Ford Algorithm

Floyd–Warshall Algorithm

These algorithms are widely used in networking, transportation systems, and optimization problems.

## Intuition Behind Shortest Path Problems

Consider a map of cities connected by roads with distances.

### Example graph:

### A / \\ 4/ \\2 B C | \\ | 5| 1\\ |3 D E

Suppose we want to find the shortest route from A to E.

### Possible paths:

### A → C → E = 2 + 3 = 5A → B → D → E = 4 + 5 + 3 = 12

### The shortest path is:

### A → C → E

Shortest path algorithms automate this process efficiently even for very large graphs.

## Problem the Concept Solves

In large networks, manually calculating paths is impossible.

### Examples include:

### GPS Navigation

Maps may contain millions of roads.

### Internet Routing

Routers must quickly determine the shortest path for data packets.

### Logistics

Companies must optimize delivery routes.

Shortest path algorithms allow systems to compute optimal routes efficiently.

## Core Theory

## Types of Shortest Path Problems

Shortest path problems can be categorized into three types.

### Single Source Shortest Path

Find shortest paths from one node to all other nodes.

### Example algorithm:

### Dijkstra’s Algorithm

### Single Source with Negative Edges

If edges may have negative weights.

### Example algorithm:

### Bellman-Ford Algorithm

### All-Pairs Shortest Path

Find shortest paths between every pair of vertices.

### Example algorithm:

### Floyd-Warshall Algorithm

## Dijkstra’s Algorithm

Dijkstra’s algorithm computes the shortest paths from a single source node to all other nodes in a graph with non-negative edge weights.

The algorithm works by repeatedly selecting the vertex with the smallest tentative distance.

## Algorithm Steps

- Assign distance 0 to the source node.

- Assign infinity to all other nodes.

- Select the node with the smallest distance.

- Update distances of its neighbors.

- Repeat until all nodes are processed.

## Visualization

### Example graph:

### A / \\ 4 1 B C \\ / 2 3 D

Start from A.

### Initial distances:

### A = 0B = ∞C = ∞D = ∞

### After updates:

### A → C = 1A → B = 4A → C → D = 1 + 3 = 4

### Final shortest distances:

### A = 0B = 4C = 1D = 4

## Python Implementation (Dijkstra)

\`\`\`py
import heapqdef dijkstra(graph, start): distances = {node: float('inf') for node in graph} distances[start] = 0 priority_queue = [(0, start)] while priority_queue: current_distance, current_node = heapq.heappop(priority_queue) for neighbor, weight in graph[current_node]: distance = current_distance + weight if distance < distances[neighbor]: distances[neighbor] = distance heapq.heappush(priority_queue, (distance, neighbor)) return distances
\`\`\`

## Time Complexity

### Using a priority queue:

### O((V + E) log V)

### Where:

### V = verticesE = edges

## Bellman–Ford Algorithm

Bellman–Ford also computes shortest paths from a single source.

Unlike Dijkstra’s algorithm, it can handle negative edge weights.

However, it is slower.

## Algorithm Idea

Relax all edges repeatedly.

If a shorter path is found, update the distance.

## Algorithm Steps

- Initialize distances.

- Relax all edges V-1 times.

- Check for negative cycles.

## Python Implementation (Bellman–Ford)

\`\`\`py
def bellman_ford(vertices, edges, source): distance = [float('inf')] * vertices distance[source] = 0 for _ in range(vertices - 1): for u, v, w in edges: if distance[u] + w < distance[v]: distance[v] = distance[u] + w return distance
\`\`\`

## Negative Cycles

A negative cycle occurs when the total weight of a cycle is negative.

### Example:

### A → B → C → ATotal weight = -5

In such cases, shortest paths cannot be determined.

Bellman–Ford detects such cycles.

## Floyd–Warshall Algorithm

Floyd–Warshall computes shortest paths between all pairs of vertices.

It uses dynamic programming.

## Algorithm Idea

Try every vertex as an intermediate point.

### Example:

### distance[i][j] = min(distance[i][j], distance[i][k] + distance[k][j])

## Python Implementation (Floyd–Warshall)

\`\`\`py
def floyd_warshall(graph): n = len(graph) dist = graph for k in range(n): for i in range(n): for j in range(n): dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) return dist
\`\`\`

## Algorithm Comparison

## Real-World Applications

Shortest path algorithms are widely used.

## GPS Navigation

Applications like Google Maps compute shortest routes.

## Internet Routing

Protocols determine shortest network paths.

## Transportation Systems

Airline routes and train networks.

## Robotics

Robots navigate environments using shortest path planning.

## Common Mistakes Beginners Make

### Using Dijkstra with negative weights

This leads to incorrect results.

### Incorrect relaxation step

Distance updates must follow algorithm rules.

### Ignoring graph representation

Efficiency depends on data structures used.

## Interview Tips

Shortest path problems appear frequently in technical interviews.

### Common questions include:

- implement Dijkstra’s algorithm

- detect negative cycles

- find shortest path in grid

- minimum cost path problems

### Interviewers expect candidates to:

- understand graph traversal

- choose appropriate algorithm

- analyze complexity

## Exercises

## Conceptual Questions

- What is the shortest path problem?

- What is the difference between Dijkstra and Bellman–Ford?

- Why does Dijkstra fail with negative weights?

- What is a negative cycle?

- What is the Floyd–Warshall algorithm used for?

## Coding Exercises

- Implement Dijkstra’s algorithm.

- Implement Bellman–Ford algorithm.

- Implement Floyd–Warshall algorithm.

## Interview Problems

- Find the shortest path in a weighted graph.

- Detect negative cycle in graph.

- Solve minimum cost path in a grid.

## Summary

Shortest path algorithms are essential tools for solving network optimization and routing problems in modern computing systems.`,
    },
    {
      slug: "chapter-18-minimum-spanning-trees-mst",
      title: "Minimum Spanning Trees (MST)",
      summary: "In many real-world systems, we need to connect multiple locations while minimizing the total cost of the connections. For example: connecting cities using roads with minimum construction cost building a network of computers with minimum cable length designing…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 17,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "A Minimum Spanning Tree (MST) connects all vertices with minimum total edge weight.", "MST contains V−1 edges and has no cycles.", "Two main algorithms are Prim’s algorithm and Kruskal’s algorithm.", "Prim’s algorithm grows the tree from a starting node.", "Kruskal’s algorithm selects edges based on smallest weight.", "MST algorithms are widely used in network design, transportation systems, and machine learning."],
      selfAssessment: [],
      content: `# Minimum Spanning Trees (MST)

## Introduction

In many real-world systems, we need to connect multiple locations while minimizing the total cost of the connections. For example:

connecting cities using roads with minimum construction cost

building a network of computers with minimum cable length

designing electrical power grids

laying pipelines between oil stations

These problems can be modeled using graphs, where:

vertices represent locations

edges represent possible connections

weights represent the cost of the connection

A Minimum Spanning Tree (MST) is a subset of edges that connects all vertices of a graph with the minimum possible total weight, without forming cycles.

Minimum spanning trees are very important in computer science, networking, and optimization.

In this chapter, we will study:

the concept of minimum spanning trees

properties of spanning trees

Prim’s algorithm

Kruskal’s algorithm

real-world applications of MST

## Intuition Behind Minimum Spanning Trees

Imagine connecting several cities using roads.

### Example graph:

### A / \\ 4/ \\3 B C \\ / 2 5 D

We want to connect all cities while minimizing total cost.

### Possible connections:

### A–B = 4A–C = 3B–D = 2C–D = 5

### If we select the edges:

### A–C (3)C–D (5)B–D (2)

### Total cost:

### + 5 + 2 = 10

### But if we choose:

### A–C (3)B–D (2)A–B (4)

### Total cost:

### + 2 + 4 = 9

This is the minimum spanning tree.

## Problem the Concept Solves

Suppose we have a network with n nodes.

If we connect every node to every other node, the cost becomes extremely high.

Instead, we want to connect all nodes with minimum number of edges and minimum total cost.

### Properties of a spanning tree:

### Connects all vertices2. Contains no cycles3. Has exactly (V - 1) edges

### Where:

### V = number of vertices

### Minimum spanning tree ensures:

- full connectivity

- minimum cost

## Core Theory

## Spanning Tree

A spanning tree is a subgraph that connects all vertices of the graph without forming cycles.

### Example graph:

### A -- B| / |C -- D

### Possible spanning tree:

### A -- B|C -- D

## Minimum Spanning Tree

A minimum spanning tree is the spanning tree with the smallest total edge weight.

### Important characteristics:

### Unique if all edge weights are different2. Contains exactly (V - 1) edges3. No cycles

## Prim’s Algorithm

Prim’s algorithm builds the MST by expanding from a starting node.

It always selects the minimum weight edge connecting the tree to a new vertex.

## Algorithm Steps

- Start from any vertex.

- Add the smallest edge connecting the tree to a new vertex.

- Repeat until all vertices are included.

## Prim’s Algorithm Visualization

### Example graph:

### A / \\ 2/ \\3 B C \\ / 1 4 D

### Step 1:

### Start from A

### Step 2:

### Select smallest edge:

### A–B (2)

### Step 3:

### Next smallest edge:

### B–D (1)

### Step 4:

### Next smallest edge:

### A–C (3)

### MST edges:

### A–BB–DA–C

### Total cost:

### + 1 + 3 = 6

## Python Implementation (Prim’s Algorithm)

\`\`\`py
import heapqdef prim(graph, start): visited = set() min_heap = [(0, start)] total_cost = 0 while min_heap: weight, node = heapq.heappop(min_heap) if node not in visited: visited.add(node) total_cost += weight for neighbor, cost in graph[node]: if neighbor not in visited: heapq.heappush(min_heap, (cost, neighbor)) return total_cost
\`\`\`

## Kruskal’s Algorithm

Kruskal’s algorithm builds the MST by selecting edges in increasing order of weight.

It uses the Union-Find (Disjoint Set) data structure to avoid cycles.

## Algorithm Steps

- Sort all edges by weight.

- Add the smallest edge.

- Check if it forms a cycle.

- If no cycle, include the edge.

- Repeat until V-1 edges are selected.

## Kruskal’s Algorithm Visualization

### Example edges:

### (A,B) = 4(A,C) = 3(B,D) = 2(C,D) = 5

### Sort edges:

### (B,D) = 2(A,C) = 3(A,B) = 4(C,D) = 5

### Select edges:

### (B,D)(A,C)(A,B)

Stop after V-1 edges.

## Python Implementation (Kruskal)

\`\`\`py
def kruskal(vertices, edges): edges.sort(key=lambda x: x[2]) parent = list(range(vertices)) def find(v): if parent[v] != v: parent[v] = find(parent[v]) return parent[v] def union(u, v): parent[find(u)] = find(v) mst = [] cost = 0 for u, v, w in edges: if find(u) != find(v): union(u, v) mst.append((u, v, w)) cost += w return mst, cost
\`\`\`

## Algorithm Comparison

## Visualization Example

### Graph:

### A / \\ 2 3 B C \\ / 1 4 D

### Minimum Spanning Tree:

### A / \\ 2 3 B \\ 1 D

## Real-World Applications

Minimum spanning trees are used in many real systems.

## Network Design

Connecting computers with minimum cable cost.

## Electrical Grid Design

Power stations connected efficiently.

## Transportation Networks

Designing railway or road networks.

## Clustering in Machine Learning

Used in hierarchical clustering algorithms.

## Common Mistakes Beginners Make

### Confusing MST with shortest path

MST minimizes total cost of network, not path length between nodes.

### Ignoring cycle detection in Kruskal

Cycles must be avoided.

### Incorrect edge sorting

Edges must be sorted before Kruskal’s algorithm.

## Interview Tips

Minimum spanning tree problems frequently appear in coding interviews.

### Common interview topics include:

- implement Prim’s algorithm

- implement Kruskal’s algorithm

- understand Union-Find data structure

### Candidates should understand:

- graph representation

- greedy algorithm strategy

- cycle detection

## Exercises

## Conceptual Questions

- What is a spanning tree?

- What is a minimum spanning tree?

- What is the difference between Prim’s and Kruskal’s algorithms?

- Why must MST have V−1 edges?

- Why must MST not contain cycles?

## Coding Exercises

- Implement Prim’s algorithm in Python.

- Implement Kruskal’s algorithm.

- Implement Union-Find data structure.

## Interview Problems

- Find MST of a weighted graph.

- Connect cities with minimum cost.

- Design minimum cost network.

## Summary

Minimum spanning trees provide efficient solutions for network optimization problems in many real-world systems.`,
    },
    {
      slug: "chapter-19-greedy-algorithms",
      title: "Greedy Algorithms",
      summary: "A greedy algorithm is an algorithmic strategy that makes the best possible choice at each step with the hope of finding the global optimal solution. Instead of considering all possible solutions, greedy algorithms make locally optimal decisions and move…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 18,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Greedy algorithms make locally optimal decisions at each step.", "They rely on greedy choice property and optimal substructure.", "Classic examples include activity selection and coin change.", "Greedy algorithms are efficient and easy to implement.", "However, greedy strategies do not always produce optimal solutions."],
      selfAssessment: [],
      content: `# Greedy Algorithms

## Introduction

A greedy algorithm is an algorithmic strategy that makes the best possible choice at each step with the hope of finding the global optimal solution.

Instead of considering all possible solutions, greedy algorithms make locally optimal decisions and move forward without reconsidering previous choices.

Greedy algorithms are widely used in many optimization problems such as:

minimum spanning tree algorithms

shortest path algorithms

scheduling problems

resource allocation problems

Examples of greedy algorithms include:

Activity Selection Problem

Huffman Coding

Prim’s Algorithm

Kruskal’s Algorithm

Dijkstra’s Algorithm

Greedy algorithms are important because they often produce efficient and simple solutions for complex optimization problems.

In this chapter, we will study:

greedy algorithm strategy

properties of greedy algorithms

activity selection problem

coin change problem

advantages and limitations of greedy methods

## Intuition Behind Greedy Algorithms

Imagine you are buying items with limited money and want to maximize value.

Instead of analyzing every possible combination, you might choose the most valuable item available first.

### Example:

### Items:A – value 100B – value 50C – value 20

### Greedy strategy:

### Pick item A firstThen BThen C

The algorithm makes the best immediate decision without worrying about future consequences.

This approach often works for many optimization problems.

## Problem the Concept Solves

Some problems require finding optimal solutions among many possibilities.

### For example:

### Scheduling Tasks

Choose maximum number of activities without overlapping.

### Currency Change

Find minimum number of coins to make an amount.

### Data Compression

Use optimal encoding for characters.

Instead of checking every possible combination, greedy algorithms build solutions step-by-step by selecting the best immediate option.

## Core Theory

Greedy algorithms rely on two important properties.

## Greedy Choice Property

A problem has the greedy choice property if a globally optimal solution can be achieved by choosing the locally optimal choice at each step.

### Example:

Choosing the shortest edge in Kruskal’s algorithm always leads toward the optimal solution.

## Optimal Substructure

A problem exhibits optimal substructure if the optimal solution of the problem contains optimal solutions to its subproblems.

### Example:

Shortest path problems.

### If the shortest path from A to C passes through B, then:

### Shortest(A → B)+Shortest(B → C)

forms the shortest path from A to C.

## Activity Selection Problem

The activity selection problem is a classic greedy algorithm problem.

### Problem:

Given a set of activities with start and finish times, select the maximum number of non-overlapping activities.

### Example:

### Goal:

Select maximum number of activities without overlapping.

## Greedy Strategy

- Sort activities by finish time.

- Select the first activity.

- Select the next activity whose start time is greater than or equal to the previous finish time.

## Visualization

### Sorted activities:

### A1 (1,3)A2 (2,5)A3 (4,7)A4 (6,9)A5 (8,10)

### Selection process:

### Select A1Select A3Select A5

### Maximum activities:

### A1, A3, A5

## Python Implementation

\`\`\`py
def activity_selection(activities): activities.sort(key=lambda x: x[1]) selected = [activities[0]] last_finish = activities[0][1] for start, finish in activities[1:]: if start >= last_finish: selected.append((start, finish)) last_finish = finish return selectedactivities = [(1,3),(2,5),(4,7),(6,9),(8,10)]print(activity_selection(activities))
\`\`\`

## Coin Change Problem

### Problem:

Given coins of different denominations, find the minimum number of coins needed to make a given amount.

### Example:

### Coins:

### 1, 5, 10, 25

### Amount:

### 63

### Greedy solution:

### + 25 + 10 + 1 + 1 + 1

### Total coins:

### coins

The greedy algorithm always selects the largest denomination first.

## Python Implementation

\`\`\`py
def coin_change(coins, amount): coins.sort(reverse=True) result = [] for coin in coins: while amount >= coin: amount -= coin result.append(coin) return resultcoins = [1,5,10,25]amount = 63print(coin_change(coins, amount))
\`\`\`

## Visualization

### Example coin selection:

Amount = 63Pick 25 → remaining 38Pick 25 → remaining 13Pick 10 → remaining 3Pick 1 → remaining 2Pick 1 → remaining 1Pick 1 → remaining 0

## Time Complexity

### For most greedy algorithms:

### O(n log n)

This often comes from sorting operations.

## Advantages of Greedy Algorithms

Greedy algorithms have several benefits.

### Simple implementation

They are often easier to implement than dynamic programming algorithms.

### Efficient performance

Greedy algorithms typically run faster.

### Low memory usage

They do not store many intermediate states.

## Limitations of Greedy Algorithms

Greedy algorithms do not always produce optimal solutions.

### Example:

### Coin denominations:

### 1, 3, 4

### Amount:

### 6

### Greedy solution:

### + 1 + 1 = 3 coins

### Optimal solution:

### + 3 = 2 coins

Thus greedy strategy fails for this case.

## Real-World Applications

Greedy algorithms are widely used in many systems.

## Network Design

Minimum spanning tree algorithms use greedy strategy.

## Data Compression

Huffman coding uses greedy algorithms to generate optimal codes.

## Scheduling Systems

Operating systems schedule tasks using greedy strategies.

## Routing Systems

Shortest path algorithms often use greedy methods.

## Common Mistakes Beginners Make

### Assuming greedy always works

Some problems require dynamic programming instead.

### Ignoring sorting step

Many greedy algorithms require sorting before selection.

### Not verifying optimal substructure

Greedy only works when specific properties exist.

## Interview Tips

Greedy algorithms frequently appear in coding interviews.

### Common problems include:

- activity selection

- coin change

- job scheduling

- Huffman coding

### Interviewers expect candidates to:

- recognize greedy patterns

- justify greedy choice property

- analyze complexity

## Exercises

## Conceptual Questions

- What is a greedy algorithm?

- What is the greedy choice property?

- What is optimal substructure?

- Why do greedy algorithms work for activity selection?

- When does greedy fail?

## Coding Exercises

- Implement activity selection algorithm.

- Implement coin change using greedy strategy.

- Solve job scheduling problem.

## Interview Problems

- Minimum number of platforms required at a railway station.

- Huffman coding problem.

- Fractional knapsack problem.

## Summary

Greedy algorithms are powerful tools for solving optimization problems efficiently, and they play an important role in many real-world computing systems.`,
    },
    {
      slug: "chapter-20-dynamic-programming",
      title: "Dynamic Programming",
      summary: "Many computational problems involve solving complex tasks by breaking them into smaller overlapping subproblems. A powerful technique used to solve such problems efficiently is called Dynamic Programming (DP). Dynamic programming is an algorithm design…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 19,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Dynamic programming solves problems with overlapping subproblems efficiently.", "It stores intermediate results to avoid recomputation.", "Two main approaches are memoization (top-down) and tabulation (bottom-up).", "Classic problems include Fibonacci, knapsack, and longest common subsequence.", "Dynamic programming significantly improves performance compared to naive recursion."],
      selfAssessment: [],
      content: `# Dynamic Programming

## Introduction

Many computational problems involve solving complex tasks by breaking them into smaller overlapping subproblems. A powerful technique used to solve such problems efficiently is called Dynamic Programming (DP).

Dynamic programming is an algorithm design technique used when:

problems can be broken into smaller subproblems

subproblems overlap

results of subproblems can be reused

Instead of solving the same subproblem repeatedly, dynamic programming stores the result of each subproblem and reuses it later.

This significantly improves efficiency.

Dynamic programming is widely used in problems such as:

shortest path algorithms

resource optimization

sequence alignment in bioinformatics

machine learning algorithms

financial optimization problems

Classic dynamic programming problems include:

Fibonacci sequence optimization

Knapsack problem

Longest common subsequence

Matrix chain multiplication

In this chapter we will study:

dynamic programming principles

memoization

tabulation

classic DP problems such as Fibonacci, knapsack, and LCS

## Intuition Behind Dynamic Programming

Consider the Fibonacci sequence.

### Definition:

### F(n) = F(n-1) + F(n-2)

### Example:

### F(5) = F(4) + F(3)

### If we compute Fibonacci using recursion:

F(5)├── F(4)│ ├── F(3)│ │ ├── F(2)│ │ └── F(1)│ └── F(2)└── F(3) ├── F(2) └── F(1)

Notice that F(3) and F(2) are calculated multiple times.

Dynamic programming avoids this repeated work by storing computed results.

## Problem the Concept Solves

Recursive solutions often lead to exponential time complexity.

### Example:

### Recursive Fibonacci:

### Time Complexity = O(2ⁿ)

This becomes extremely slow for large values of n.

Dynamic programming reduces complexity by storing results.

### Optimized complexity:

### O(n)

Thus dynamic programming improves performance significantly.

## Core Theory

Dynamic programming relies on two key properties.

## Overlapping Subproblems

A problem has overlapping subproblems if the same subproblems are solved multiple times.

### Example:

In Fibonacci recursion, F(3) is computed repeatedly.

## Optimal Substructure

A problem has optimal substructure if an optimal solution can be constructed from optimal solutions of its subproblems.

### Example:

Shortest path problems.

### If the shortest path from A to C passes through B, then:

### Shortest(A → B)+Shortest(B → C)

forms the shortest path.

## Approaches to Dynamic Programming

There are two main approaches.

## Memoization (Top-Down Approach)

Memoization uses recursion but stores results of subproblems in a cache.

### Example:

\`\`\`py
def fibonacci(n, memo={}): if n in memo: return memo[n] if n <= 1: return n memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo) return memo[n]print(fibonacci(10))
\`\`\`

Memoization avoids repeated computations.

## Tabulation (Bottom-Up Approach)

Tabulation builds the solution iteratively starting from the smallest subproblem.

### Example:

\`\`\`py
def fibonacci(n): dp = [0]*(n+1) dp[1] = 1 for i in range(2, n+1): dp[i] = dp[i-1] + dp[i-2] return dp[n]print(fibonacci(10))
\`\`\`

Tabulation often uses arrays or tables to store results.

## Fibonacci Optimization

### Example:

### F(0) = 0F(1) = 1F(2) = 1F(3) = 2F(4) = 3F(5) = 5

### DP table:

### n: 0 1 2 3 4 5dp: 0 1 1 2 3 5

## Knapsack Problem

The 0/1 Knapsack Problem is a classic dynamic programming problem.

### Problem:

Given items with weights and values, determine the maximum value that can be carried in a knapsack with limited capacity.

### Example:

### Knapsack capacity:

### 5

### Goal:

Maximize value.

## DP Table Approach

### We build a table:

### dp[i][w]

### Where:

### i = number of itemsw = capacity

## Python Implementation

\`\`\`py
def knapsack(weights, values, capacity): n = len(weights) dp = [[0]*(capacity+1) for _ in range(n+1)] for i in range(1, n+1): for w in range(capacity+1): if weights[i-1] <= w: dp[i][w] = max( values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w] ) else: dp[i][w] = dp[i-1][w] return dp[n][capacity]weights = [1,2,3]values = [6,10,12]print(knapsack(weights, values, 5))
\`\`\`

## Longest Common Subsequence (LCS)

Given two sequences, find the longest subsequence present in both sequences.

### Example:

### String 1: ABCDGHString 2: AEDFHR

### Longest common subsequence:

### ADH

## DP Table Visualization

A B C D G H 0 0 0 0 0 0 0A 0 1 1 1 1 1 1E 0 1 1 1 1 1 1D 0 1 1 1 2 2 2F 0 1 1 1 2 2 2H 0 1 1 1 2 2 3R 0 1 1 1 2 2 3

## Python Implementation

\`\`\`py
def lcs(X, Y): m = len(X) n = len(Y) dp = [[0]*(n+1) for _ in range(m+1)] for i in range(1, m+1): for j in range(1, n+1): if X[i-1] == Y[j-1]: dp[i][j] = dp[i-1][j-1] + 1 else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) return dp[m][n]print(lcs("ABCDGH","AEDFHR"))
\`\`\`

## Time Complexity

Dynamic programming significantly reduces complexity.

### Example:

## Real-World Applications

Dynamic programming is widely used.

## Bioinformatics

DNA sequence alignment.

## Finance

Optimal investment strategies.

## Machine Learning

Optimization algorithms.

## Network Routing

Shortest path computations.

## Common Mistakes Beginners Make

### Not identifying overlapping subproblems

DP only works when subproblems repeat.

### Confusing greedy with dynamic programming

Greedy makes local choices, DP evaluates all possibilities.

### Incorrect DP table construction

DP states must represent subproblems correctly.

## Interview Tips

Dynamic programming is one of the most frequently tested topics in coding interviews.

### Common DP problems include:

- Fibonacci optimization

- knapsack problem

- longest common subsequence

- longest increasing subsequence

- coin change

### Interviewers expect candidates to:

- identify DP patterns

- define correct DP state

- write efficient solutions.

## Exercises

## Conceptual Questions

- What is dynamic programming?

- What are overlapping subproblems?

- What is optimal substructure?

- What is the difference between memoization and tabulation?

- Why is dynamic programming more efficient than recursion?

## Coding Exercises

- Implement Fibonacci using dynamic programming.

- Solve the 0/1 knapsack problem.

- Implement longest common subsequence.

## Interview Problems

- Coin change problem.

- Longest increasing subsequence.

- Minimum path sum in grid.

## Summary

Dynamic programming is one of the most powerful algorithm design techniques used in solving complex optimization problems in modern computing.`,
    },
    {
      slug: "chapter-21-backtracking",
      title: "Backtracking",
      summary: "Backtracking is a powerful algorithmic technique used to solve problems that require exploring all possible solutions while eliminating invalid ones efficiently. Backtracking works by incrementally building a solution and abandoning a partial solution as soon…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 20,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Backtracking is a recursive algorithmic technique used to explore possible solutions.", "It builds solutions incrementally and backtracks when a solution becomes invalid.", "Problems solved using backtracking include permutations, N-Queens, and Sudoku.", "Backtracking explores solution spaces using decision trees.", "Although backtracking may have exponential complexity, pruning invalid paths makes it practical."],
      selfAssessment: [],
      content: `# Backtracking

## Introduction

Backtracking is a powerful algorithmic technique used to solve problems that require exploring all possible solutions while eliminating invalid ones efficiently.

Backtracking works by incrementally building a solution and abandoning a partial solution as soon as it determines that the solution cannot lead to a valid final result.

This technique is widely used in problems involving:

permutations and combinations

puzzle solving

constraint satisfaction problems

decision trees

path finding

Some classic problems solved using backtracking include:

N-Queens problem

Sudoku solver

Permutations generation

Subset generation

Maze solving

Backtracking is often described as a systematic trial-and-error method.

In this chapter we will study:

the concept of backtracking

decision trees

constraint solving

classic backtracking problems such as N-Queens and permutations

## Intuition Behind Backtracking

Imagine solving a maze.

At each junction you have several possible paths.

You choose one path and move forward.

### If the path leads to a dead end:

- you go back to the previous junction

- try another path

This process of exploring and reversing decisions is called backtracking.

### Example decision tree:

### Start ├── Path A │ ├── A1 │ └── A2 └── Path B ├── B1 └── B2

If A1 fails, we go back and try A2.

## Problem the Concept Solves

Many problems require checking all possible configurations.

### Example:

### Sudoku

Try numbers in each cell while respecting Sudoku rules.

### N-Queens

Place queens on a chessboard so that no queen attacks another.

### Permutations

Generate all possible arrangements of elements.

A brute force solution would test every possibility.

Backtracking improves this by pruning invalid branches early.

## Core Theory

Backtracking algorithms follow a common structure.

### Steps:

- Choose a candidate solution.

- Check whether the candidate is valid.

- If valid, continue building the solution.

- If invalid, backtrack and try another option.

### General structure:

### chooseexploreunchoose (backtrack)

## Decision Tree Representation

Backtracking problems can be visualized using decision trees.

\`\`\`py
Example: permutations of {1,2,3}
\`\`\`

[] / | \\ [1] [2] [3] / \\ / \\ / \\ [1,2][1,3] ...

The algorithm explores each branch until all possibilities are tested.

## Example Problem — Permutations

### Problem:

Generate all permutations of a list of numbers.

### Example input:

### [1,2,3]

### Output:

### [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]

## Python Implementation

\`\`\`py
def permutations(nums): result = [] def backtrack(path): if len(path) == len(nums): result.append(path[:]) return for num in nums: if num not in path: path.append(num) backtrack(path) path.pop() backtrack([]) return resultprint(permutations([1,2,3]))
\`\`\`

## N-Queens Problem

The N-Queens problem asks us to place N queens on an N×N chessboard so that no two queens attack each other.

### Rules:

- queens cannot share the same row

- queens cannot share the same column

- queens cannot share the same diagonal

### Example solution for 4 queens:

. Q . .. . . QQ . . .. . Q .

## Python Implementation

\`\`\`py
def solve_n_queens(n): board = [-1]*n solutions = [] def is_safe(row, col): for i in range(row): if board[i] == col or \\ abs(board[i] - col) == abs(i - row): return False return True def backtrack(row): if row == n: solutions.append(board[:]) return for col in range(n): if is_safe(row, col): board[row] = col backtrack(row+1) board[row] = -1 backtrack(0) return solutionsprint(solve_n_queens(4))
\`\`\`

## Sudoku Solver

Sudoku puzzles can also be solved using backtracking.

### Steps:

- Find an empty cell.

- Try numbers 1–9.

- Check if the number is valid.

- Continue recursively.

- Backtrack if no number works.

Backtracking systematically explores all possibilities until a valid solution is found.

## Time Complexity

Backtracking algorithms often have exponential complexity.

### Example:

However, pruning invalid solutions significantly reduces computation.

## Visualization

\`\`\`py
Example: generating permutations of {1,2}
\`\`\`

### [] / \\ [1] [2] / \\[1,2] [2,1]

Each branch represents a decision.

## Real-World Applications

Backtracking is used in many real-world systems.

## Puzzle Solvers

Sudoku, crossword puzzles, and board games.

## Artificial Intelligence

Game search algorithms explore possible moves.

## Constraint Satisfaction Problems

Scheduling, resource allocation, and planning.

## Combinatorial Optimization

Generating combinations and subsets.

## Common Mistakes Beginners Make

### Forgetting to undo choices

Backtracking requires removing the last decision.

### Incorrect constraint checking

Invalid solutions must be pruned early.

### Inefficient state representation

State variables must represent the current partial solution correctly.

## Interview Tips

Backtracking problems frequently appear in coding interviews.

### Common interview problems include:

- permutations and combinations

- subsets generation

- N-Queens

- Sudoku solver

- word search in grid

### Interviewers expect candidates to:

- build decision trees

- manage recursion carefully

- prune invalid branches efficiently.

## Exercises

## Conceptual Questions

- What is backtracking?

- How does backtracking differ from brute force?

- What is a decision tree in backtracking?

- Why is pruning important?

- What types of problems use backtracking?

## Coding Exercises

- Generate permutations of a list.

- Generate subsets of a set.

- Implement N-Queens solver.

## Interview Problems

- Solve Sudoku puzzle.

- Generate all combinations of numbers.

- Word search in a grid.

## Summary

Backtracking is an essential technique for solving constraint satisfaction and combinatorial problems in computer science.`,
    },
    {
      slug: "chapter-22-sliding-window-and-two-pointers",
      title: "Sliding Window and Two Pointers",
      summary: "Many algorithm problems involve processing arrays or strings efficiently. A common challenge is to analyze subarrays or substrings while minimizing unnecessary computations. Two powerful techniques used to solve such problems efficiently are: Sliding Window…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 21,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Sliding window processes subarrays efficiently by maintaining a moving window.", "Two pointers technique uses two indices to traverse arrays or strings.", "Both techniques reduce time complexity from O(n²) to O(n) in many problems.", "Sliding window is useful for subarray and substring problems.", "Two pointers are useful for sorted arrays and pair searching problems."],
      selfAssessment: [],
      content: `# Sliding Window and Two Pointers

## Introduction

Many algorithm problems involve processing arrays or strings efficiently. A common challenge is to analyze subarrays or substrings while minimizing unnecessary computations.

Two powerful techniques used to solve such problems efficiently are:

Sliding Window

Two Pointers

These techniques allow us to reduce the time complexity of many problems from O(n²) to O(n).

They are widely used in problems involving:

subarrays and substrings

searching pairs of numbers

finding maximum or minimum values in ranges

string processing

sequence analysis

Examples of problems solved using these techniques include:

longest substring without repeating characters

maximum sum subarray

pair sum in sorted arrays

removing duplicates from sorted arrays

Sliding window and two-pointer techniques are extremely common in technical interviews and competitive programming.

## Intuition Behind Sliding Window

Suppose we want to calculate the sum of every subarray of size 3.

### Example array:

### [2, 1, 5, 1, 3, 2]

### Naive approach:

### (2+1+5)(1+5+1)(5+1+3)(1+3+2)

This requires recomputing sums repeatedly.

Instead, we move a window across the array.

### Visualization:

### Window size = 3[2, 1, 5] 1 3 2 2 [1, 5, 1] 3 2 2 1 [5, 1, 3] 2 2 1 5 [1, 3, 2]

### Instead of recalculating the sum each time, we:

- subtract the element leaving the window

- add the element entering the window

This improves efficiency.

## Problem the Concept Solves

Many problems require analyzing subarrays or substrings.

### Example problems include:

- maximum sum of subarray of size k

- longest substring without repeating characters

- smallest window containing certain characters

### Brute-force methods examine all possible subarrays:

### O(n²)

### Sliding window processes elements sequentially:

### O(n)

This leads to significant performance improvement.

## Core Theory

## Sliding Window Technique

Sliding window uses a range of elements that moves across the array.

Two main types exist.

### Fixed Window Size

Window size remains constant.

### Example:

- maximum sum subarray of size k

### Variable Window Size

Window expands or shrinks depending on conditions.

### Example:

- longest substring without repeating characters

## Example Problem — Maximum Sum Subarray of Size K

### Given:

### Array: [2,1,5,1,3,2]K = 3

### Goal:

Find the maximum sum of any subarray of size 3.

### Subarrays:

### [2,1,5] = 8[1,5,1] = 7[5,1,3] = 9[1,3,2] = 6

### Maximum sum:

### 9

## Python Implementation

\`\`\`py
def max_sum_subarray(arr, k): window_sum = sum(arr[:k]) max_sum = window_sum for i in range(k, len(arr)): window_sum += arr[i] window_sum -= arr[i-k] max_sum = max(max_sum, window_sum) return max_sumarr = [2,1,5,1,3,2]print(max_sum_subarray(arr,3))
\`\`\`

## Two Pointers Technique

The two pointers technique uses two indices to traverse a data structure.

These pointers typically move toward each other or move in the same direction.

### Two pointers are commonly used for:

- sorted arrays

- searching pairs

- removing duplicates

- partitioning problems

## Example — Pair Sum in Sorted Array

### Problem:

Given a sorted array, find two numbers whose sum equals a target.

### Example:

### Array = [1,2,3,4,6]Target = 6

### Solution:

### + 4 = 6

## Algorithm

- Initialize two pointers.

### left = 0right = n-1

- Check sum.

- if sum < target → move left pointer

- if sum > target → move right pointer

- if equal → solution found

## Python Implementation

\`\`\`py
def pair_sum(arr, target): left = 0 right = len(arr)-1 while left < right: current = arr[left] + arr[right] if current == target: return (arr[left], arr[right]) elif current < target: left += 1 else: right -= 1 return Noneprint(pair_sum([1,2,3,4,6],6))
\`\`\`

## Example — Longest Substring Without Repeating Characters

### Problem:

Find the longest substring without repeating characters.

### Example:

### Input: "abcabcbb"Output: 3

### Longest substring:

### "abc"

## Python Implementation

\`\`\`py
def longest_substring(s): char_set = set() left = 0 max_length = 0 for right in range(len(s)): while s[right] in char_set: char_set.remove(s[left]) left += 1 char_set.add(s[right]) max_length = max(max_length, right-left+1) return max_lengthprint(longest_substring("abcabcbb"))
\`\`\`

## Visualization

### Sliding window example:

### Array = [1,2,3,4,5]Window size = 3[1,2,3] 4 51 [2,3,4] 51 2 [3,4,5]

### Two pointer example:

### [1,2,3,4,6]Left → 1Right → 6

Move pointers depending on conditions.

## Time Complexity

Both techniques significantly reduce unnecessary computations.

## Real-World Applications

Sliding window and two pointers are widely used.

## Network Monitoring

Analyzing packet streams in real time.

## Text Processing

Finding patterns in large documents.

## Data Analytics

Analyzing time-series data.

## Bioinformatics

Analyzing DNA sequences.

## Common Mistakes Beginners Make

### Incorrect window updates

Forgetting to remove elements leaving the window.

### Infinite loops with two pointers

Improper pointer movement.

### Ignoring sorted requirement

Some two-pointer problems require sorted arrays.

## Interview Tips

Sliding window and two pointers are very common interview topics.

### Typical interview questions include:

- longest substring without repeating characters

- maximum sum subarray

- pair sum problems

- container with most water

Candidates should practice recognizing patterns that can be solved using these techniques.

## Exercises

## Conceptual Questions

- What is the sliding window technique?

- What is the two pointers technique?

- Why is sliding window more efficient than brute force?

- When should two pointers be used?

- What is the difference between fixed and variable window?

## Coding Exercises

- Find maximum sum subarray of size k.

- Find pair of numbers that sum to target.

- Remove duplicates from sorted array.

## Interview Problems

- Longest substring without repeating characters.

- Container with most water problem.

- Minimum window substring.

## Summary

Sliding window and two pointers are essential techniques for solving array and string problems efficiently in modern algorithm design.`,
    },
    {
      slug: "chapter-23-searching-algorithms",
      title: "Searching Algorithms",
      summary: "Searching is one of the most fundamental operations in computer science. Many applications require locating specific data within a collection of elements. Examples include: searching a contact in a phone directory finding a product in an online store…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 22,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Searching algorithms locate elements in a collection of data.", "Linear search checks elements sequentially.", "Binary search divides the search space repeatedly and requires sorted data.", "Interpolation search estimates the target location for faster searching in uniformly distributed arrays.", "Binary search is widely used because of its O(log n) efficiency."],
      selfAssessment: [],
      content: `# Searching Algorithms

## Introduction

Searching is one of the most fundamental operations in computer science. Many applications require locating specific data within a collection of elements.

Examples include:

searching a contact in a phone directory

finding a product in an online store

retrieving a record from a database

searching words in a dictionary

Searching algorithms determine whether an element exists in a data structure and where it is located.

Different searching algorithms are used depending on how the data is organized.

In this chapter we will study three important searching algorithms:

Linear Search

Binary Search

Interpolation Search

Understanding these algorithms is important for both algorithm design and technical interviews.

## Intuition Behind Searching

Suppose we want to find a number in a list.

### Example:

### [4, 8, 15, 16, 23, 42]

If the list is unsorted, we must check elements one by one.

However, if the list is sorted, we can apply smarter strategies such as binary search, which divides the search space repeatedly.

Thus, the structure of the data strongly affects the efficiency of searching algorithms.

## Problem the Concept Solves

Suppose we have a list containing millions of elements.

If we search sequentially every time, the process becomes slow.

### Example:

### 1,000,000 elements

Searching sequentially might require checking every element.

### Time complexity:

### O(n)

Efficient searching algorithms reduce the number of comparisons dramatically.

### For example:

### Binary search requires:

### O(log n)

This improvement is extremely important in large-scale applications.

## Linear Search

Linear search is the simplest searching algorithm.

It checks each element of the list sequentially until the target element is found.

## Algorithm Steps

- Start from the first element.

- Compare each element with the target.

- If match found → return index.

- If end of list reached → element not found.

## Example

### Array:

### [5, 9, 2, 7, 6]

### Search for:

### 7

### Process:

### → no 9 → no 2 → no 7 → found

## Python Implementation

\`\`\`py
def linear_search(arr, target): for i in range(len(arr)): if arr[i] == target: return i return -1arr = [5,9,2,7,6]print(linear_search(arr,7))
\`\`\`

## Time Complexity

## Binary Search

Binary search is a highly efficient algorithm used to search in sorted arrays.

Instead of scanning elements sequentially, binary search repeatedly divides the search space in half.

## Algorithm Steps

- Find the middle element.

- If target equals middle → return index.

- If target < middle → search left half.

- If target > middle → search right half.

- Repeat until element found or range becomes empty.

## Visualization

### Example array:

### [2, 5, 8, 12, 16, 23, 38]

### Search for:

### 16

### Steps:

Middle = 1216 > 12 → search rightMiddle = 2316 < 23 → search leftMiddle = 16 → found

## Python Implementation

\`\`\`py
def binary_search(arr, target): left = 0 right = len(arr) - 1 while left <= right: mid = (left + right) // 2 if arr[mid] == target: return mid elif arr[mid] < target: left = mid + 1 else: right = mid - 1 return -1
\`\`\`

## Time Complexity

### Binary search complexity:

### O(log n)

### Example comparisons needed:

Binary search is therefore extremely efficient.

## Recursive Binary Search

Binary search can also be implemented using recursion.

## Python Implementation

\`\`\`py
def binary_search_recursive(arr, target, left, right): if left > right: return -1 mid = (left + right) // 2 if arr[mid] == target: return mid elif arr[mid] < target: return binary_search_recursive(arr, target, mid+1, right) else: return binary_search_recursive(arr, target, left, mid-1)
\`\`\`

## Interpolation Search

Interpolation search improves binary search when data is uniformly distributed.

Instead of checking the middle element, it estimates the likely position of the target.

### Example formula:

### pos = low + ((target - arr[low]) * (high - low) / (arr[high] - arr[low]))

This technique works similarly to searching in a dictionary, where you estimate where a word might appear.

## Example

### Array:

### [10, 20, 30, 40, 50, 60]

### Searching for:

### 50

Interpolation predicts an index close to the target rather than starting at the exact middle.

## Python Implementation

\`\`\`py
def interpolation_search(arr, target): low = 0 high = len(arr) - 1 while low <= high and target >= arr[low] and target <= arr[high]: pos = low + int(((target - arr[low]) * (high - low)) / (arr[high] - arr[low])) if arr[pos] == target: return pos if arr[pos] < target: low = pos + 1 else: high = pos - 1 return -1
\`\`\`

## Algorithm Comparison

## Visualization

### Binary search tree view:

### Search Range[2 5 8 12 16 23 38]Step 1 → 12 Step 2 → 23 Step 3 → 16

## Real-World Applications

Searching algorithms are used in many systems.

## Databases

Efficient record retrieval.

## Search Engines

Finding indexed documents.

## Operating Systems

Locating files in directory structures.

## Online Stores

Searching products in large catalogs.

## Common Mistakes Beginners Make

### Using binary search on unsorted arrays

Binary search requires sorted data.

### Incorrect midpoint calculation

Incorrect formula may cause infinite loops.

### Off-by-one errors

Loop conditions must be handled carefully.

## Interview Tips

Searching algorithms frequently appear in coding interviews.

### Common interview problems include:

- binary search implementation

- search in rotated sorted array

- find first and last occurrence of element

- peak element in array

### Candidates should practice:

- iterative binary search

- recursive binary search

- boundary condition handling

## Exercises

## Conceptual Questions

- What is searching in data structures?

- What is the difference between linear search and binary search?

- Why must binary search use sorted data?

- What is interpolation search?

- When is interpolation search useful?

## Coding Exercises

- Implement linear search.

- Implement binary search.

- Implement interpolation search.

## Interview Problems

- Search in rotated sorted array.

- Find first occurrence of element.

- Find peak element.

## Summary

Efficient searching algorithms are essential for building fast and scalable software systems.`,
    },
    {
      slug: "chapter-24-sorting-algorithms",
      title: "Sorting Algorithms",
      summary: "Sorting is one of the most fundamental operations in computer science. It involves arranging elements in a specific order, usually ascending or descending. Sorting is important because many algorithms become more efficient when the data is sorted. For…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 23,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Sorting arranges elements in ascending or descending order.", "Simple algorithms include bubble sort, selection sort, and insertion sort.", "Efficient algorithms include merge sort, quick sort, and heap sort.", "Divide-and-conquer algorithms provide O(n log n) performance.", "Sorting is fundamental for many applications such as searching, indexing, and data analysis."],
      selfAssessment: [],
      content: `# Sorting Algorithms

## Introduction

Sorting is one of the most fundamental operations in computer science. It involves arranging elements in a specific order, usually ascending or descending.

Sorting is important because many algorithms become more efficient when the data is sorted. For example:

binary search requires sorted data

database queries often sort records

search engines rank results

operating systems organize processes

Examples of sorted data:

Input : [8, 3, 5, 2, 9]Sorted : [2, 3, 5, 8, 9]

Sorting algorithms are widely used in data processing, machine learning, databases, and system design.

In this chapter we will study several important sorting algorithms:

Bubble Sort

Selection Sort

Insertion Sort

Merge Sort

Quick Sort

Heap Sort

Each algorithm has different performance characteristics and use cases.

## Intuition Behind Sorting

Imagine organizing books on a shelf by title.

### You could:

- compare two books and swap them if they are out of order

- repeatedly find the smallest book and place it first

- insert each book in the correct position

Each of these approaches corresponds to different sorting algorithms.

Understanding these intuitive ideas helps explain how sorting algorithms work.

## Problem the Concept Solves

Suppose we have a dataset of millions of elements.

### Example:

### [45, 12, 78, 23, 56, 90, 11]

### Without sorting:

- searching becomes slow

- analyzing patterns becomes difficult

- indexing becomes inefficient

Sorting organizes the data so that operations such as searching, merging, and analysis become easier.

Efficient sorting algorithms are therefore essential for high-performance systems.

## Bubble Sort

Bubble sort is one of the simplest sorting algorithms.

It repeatedly compares adjacent elements and swaps them if they are in the wrong order.

The process continues until the entire array becomes sorted.

## Example

### [5, 3, 8, 4]

### Pass 1:

### 3 → swap → [3,5,8,4]5 8 → correct8 4 → swap → [3,5,4,8]

### Pass 2:

### 5 → correct5 4 → swap → [3,4,5,8]

### Sorted array:

### [3,4,5,8]

## Python Implementation

\`\`\`py
def bubble_sort(arr): n = len(arr) for i in range(n): for j in range(0, n-i-1): if arr[j] > arr[j+1]: arr[j], arr[j+1] = arr[j+1], arr[j] return arr
\`\`\`

## Time Complexity

Bubble sort is mainly used for educational purposes.

## Selection Sort

Selection sort repeatedly selects the smallest element from the unsorted portion and places it at the beginning.

## Example

### [64, 25, 12, 22, 11]

### Step 1:

### Smallest = 11[11, 25, 12, 22, 64]

### Step 2:

### Smallest = 12[11, 12, 25, 22, 64]

Continue until sorted.

## Python Implementation

\`\`\`py
def selection_sort(arr): n = len(arr) for i in range(n): min_index = i for j in range(i+1, n): if arr[j] < arr[min_index]: min_index = j arr[i], arr[min_index] = arr[min_index], arr[i] return arr
\`\`\`

## Time Complexity

### O(n²)

Selection sort performs the same number of comparisons regardless of input.

## Insertion Sort

Insertion sort builds the sorted array one element at a time.

It works similarly to arranging playing cards in your hand.

## Example

### [5, 2, 4, 6]

### Step 1:

### [5]

### Step 2:

### Insert 2 → [2,5]

### Step 3:

### Insert 4 → [2,4,5]

### Step 4:

### Insert 6 → [2,4,5,6]

## Python Implementation

\`\`\`py
def insertion_sort(arr): for i in range(1, len(arr)): key = arr[i] j = i - 1 while j >= 0 and arr[j] > key: arr[j+1] = arr[j] j -= 1 arr[j+1] = key return arr
\`\`\`

## Time Complexity

Insertion sort is efficient for small datasets.

## Merge Sort

Merge sort is a divide-and-conquer algorithm.

### Steps:

- divide array into two halves

- recursively sort each half

- merge sorted halves

## Visualization

\`\`\`py
[8,3,5,2]Divide[8,3] [5,2]Divide[8] [3] [5] [2]Merge[3,8] [2,5]Final merge[2,3,5,8]
\`\`\`

## Python Implementation

\`\`\`py
def merge_sort(arr): if len(arr) <= 1: return arr mid = len(arr)//2 left = merge_sort(arr[:mid]) right = merge_sort(arr[mid:]) result = [] i = j = 0 while i < len(left) and j < len(right): if left[i] < right[j]: result.append(left[i]) i += 1 else: result.append(right[j]) j += 1 result.extend(left[i:]) result.extend(right[j:]) return result
\`\`\`

## Time Complexity

### O(n log n)

Merge sort is very efficient for large datasets.

## Quick Sort

Quick sort is another divide-and-conquer sorting algorithm.

### Steps:

- choose a pivot element

- partition array into smaller and larger elements

- recursively sort partitions

## Example

### [8,3,5,2]Pivot = 5Left : [3,2]Right : [8]Sorted result:[2,3,5,8]

## Python Implementation

\`\`\`py
def quick_sort(arr): if len(arr) <= 1: return arr pivot = arr[len(arr)//2] left = [x for x in arr if x < pivot] middle = [x for x in arr if x == pivot] right = [x for x in arr if x > pivot] return quick_sort(left) + middle + quick_sort(right)
\`\`\`

## Time Complexity

Quick sort is widely used because it performs well in practice.

## Heap Sort

Heap sort uses a binary heap data structure.

### Steps:

- build a max heap

- extract largest element

- rebuild heap

## Python Implementation

\`\`\`py
import heapqdef heap_sort(arr): heapq.heapify(arr) sorted_arr = [] while arr: sorted_arr.append(heapq.heappop(arr)) return sorted_arr
\`\`\`

## Algorithm Comparison

## Real-World Applications

Sorting algorithms are used in many systems.

## Databases

Sorting records before indexing.

## Search Engines

Ranking results by relevance.

## Data Analytics

Sorting large datasets before analysis.

## Operating Systems

Scheduling processes.

## Common Mistakes Beginners Make

### Incorrect swap operations

Swapping must be implemented correctly.

### Ignoring algorithm complexity

Using inefficient algorithms for large datasets.

### Incorrect recursion handling

Merge sort and quick sort require careful recursion.

## Interview Tips

Sorting algorithms frequently appear in coding interviews.

### Common interview questions include:

- implement quick sort

- merge sort

- find kth largest element

- sort linked list

### Candidates should understand:

- algorithm complexity

- divide-and-conquer techniques

- in-place sorting methods

## Exercises

## Conceptual Questions

- What is sorting?

- Why is sorting important in algorithms?

- What is the difference between merge sort and quick sort?

- Which sorting algorithms are stable?

- What is the best-case complexity of insertion sort?

## Coding Exercises

- Implement bubble sort.

- Implement insertion sort.

- Implement merge sort.

## Interview Problems

- Find kth largest element in array.

- Sort a linked list.

- Sort nearly sorted array.

## Summary

Efficient sorting algorithms are essential for building high-performance data processing systems.`,
    },
      ],
    },
    {
      slug: "part-3",
      title: "Part 3 — Chapters 25–30",
      summary: "Chapters 25 to 30 of Python DSA.",
      order: 3,
      difficulty: "intermediate",
      estimatedMinutes: 180,
      tutorials: [
    {
      slug: "chapter-25-bit-manipulation",
      title: "Bit Manipulation",
      summary: "Computers store and process all information in binary form, using only two digits: 0 and 1. These binary digits are called bits. Bit manipulation refers to techniques used to operate directly on the binary representation of numbers using bitwise operators.…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 24,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Bit manipulation operates directly on binary representations of numbers.", "Bitwise operators include AND, OR, XOR, NOT, and bit shifts.", "Bit operations are extremely fast and memory-efficient.", "Bit manipulation is useful for subset generation, optimization, and low-level programming.", "Many algorithmic problems can be solved elegantly using bit tricks."],
      selfAssessment: [],
      content: `# Bit Manipulation

## Introduction

Computers store and process all information in binary form, using only two digits: 0 and 1. These binary digits are called bits.

Bit manipulation refers to techniques used to operate directly on the binary representation of numbers using bitwise operators.

Bit manipulation is important because it allows algorithms to:

perform operations very quickly

optimize memory usage

solve certain problems efficiently

manipulate data at the lowest level

Bitwise techniques are widely used in:

system programming

cryptography

graphics processing

network protocols

competitive programming

In this chapter we will study:

bitwise operators

common bit manipulation tricks

subset generation using bits

practical examples and applications

Bit manipulation is a common topic in technical interviews and competitive programming contests.

## Intuition Behind Bits

A bit represents the smallest unit of data in computing.

### Example:

### Decimal 5 = Binary 101

Each position represents a power of two.

### Example:

### Binary : 1 0 1Position: 2² 2¹ 2⁰Value : 4 0 1Total : 5

Binary representation allows computers to perform operations efficiently using logic circuits.

## Problem the Concept Solves

Many operations involving numbers can be performed faster using bit manipulation.

### Example tasks include:

- checking if a number is even or odd

- multiplying or dividing by powers of two

- toggling specific bits

- generating subsets of a set

Bit manipulation often provides solutions with very low time complexity.

## Core Theory

## Bitwise Operators

Python supports several bitwise operators.

### | Right shift |

These operators work directly on the binary representation of numbers.

## Bitwise AND (&)

The AND operator returns 1 only if both bits are 1.

### Example:

### = 1013 = 011-----------AND = 001 = 1

### Python example:

\`\`\`py
print(5 & 3)
\`\`\`

### Output:

### 1

## Bitwise OR (|)

The OR operator returns 1 if either bit is 1.

### Example:

### = 1013 = 011-----------OR = 111 = 7

### Python example:

\`\`\`py
print(5 | 3)
\`\`\`

### Output:

### 7

## Bitwise XOR (^)

The XOR operator returns 1 when bits are different.

### Example:

### = 1013 = 011-----------XOR = 110 = 6

### Python example:

\`\`\`py
print(5 ^ 3)
\`\`\`

### Output:

### 6

## Bitwise NOT (~)

The NOT operator inverts all bits.

### Example:

### ~5

Binary representation flips bits.

### Python example:

\`\`\`py
print(~5)
\`\`\`

### Output:

### -6

This occurs because Python uses two’s complement representation.

## Bit Shift Operators

Bit shifts move bits left or right.

## Left Shift (<<)

Shifts bits to the left.

Equivalent to multiplying by powers of two.

### Example:

### << 1

### Binary:

### → 1010

### Result:

### 10

### Python example:

\`\`\`py
print(5 << 1)
\`\`\`

## Right Shift (>>)

Shifts bits to the right.

Equivalent to dividing by powers of two.

### Example:

### >> 1

### Binary:

### → 0100

### Result:

### 4

### Python example:

\`\`\`py
print(8 >> 1)
\`\`\`

## Common Bit Manipulation Tricks

## Check if Number is Even

A number is even if its last bit is 0.

### Example:

\`\`\`py
def is_even(n): return (n & 1) == 0
\`\`\`

## Check if Number is Power of Two

### A number is power of two if:

### n & (n-1) == 0

### Example:

\`\`\`py
def is_power_of_two(n): return n > 0 and (n & (n-1)) == 0
\`\`\`

## Swap Two Numbers Using XOR

### a = 5b = 3a = a ^ bb = a ^ ba = a ^ b

### Result:

### a = 3b = 5

## Subset Generation Using Bit Manipulation

Bit manipulation can generate all subsets of a set.

### Example set:

### [1,2,3]

### Total subsets:

### 2^n = 8

Binary representation helps generate subsets.

### Example:

000 → []001 → [1]010 → [2]011 → [1,2]100 → [3]101 → [1,3]110 → [2,3]111 → [1,2,3]

## Python Implementation

\`\`\`py
def generate_subsets(nums): n = len(nums) for mask in range(1 << n): subset = [] for i in range(n): if mask & (1 << i): subset.append(nums[i]) print(subset)generate_subsets([1,2,3])
\`\`\`

## Visualization

### Example subset generation:

Numbers = [A,B,C]Binary Subset000 []001 [A]010 [B]011 [A,B]100 [C]101 [A,C]110 [B,C]111 [A,B,C]

## Time Complexity

### Subset generation complexity:

### O(2^n)

Bit manipulation makes subset generation simple and efficient.

## Real-World Applications

Bit manipulation is widely used in computing.

## Cryptography

Encryption algorithms use bitwise operations.

## Graphics Processing

Pixel data manipulation.

## Networking

Protocol headers use bit-level operations.

## Game Development

State representation using bit masks.

## Common Mistakes Beginners Make

### Misunderstanding bitwise vs logical operators

### Example:

### & vs and| vs or

### Forgetting binary representation

Understanding binary is essential.

### Incorrect bit shifting

Shifting too many bits may produce unexpected results.

## Interview Tips

Bit manipulation problems frequently appear in coding interviews.

### Common problems include:

- single number problem

- power of two detection

- counting set bits

- subset generation

### Interviewers expect candidates to understand:

- bitwise operators

- XOR properties

- efficient bit tricks.

## Exercises

## Conceptual Questions

- What is a bit in computing?

- What is the difference between AND and OR operations?

- What does XOR represent?

- What are bit shift operators?

- Why are bit operations efficient?

## Coding Exercises

- Check if a number is even using bit manipulation.

- Check if a number is power of two.

- Generate all subsets of a set using bit masks.

## Interview Problems

- Find the single number in an array where every other number appears twice.

- Count number of set bits in an integer.

- Generate all subsets of a set.

## Summary

Bit manipulation techniques provide powerful tools for solving problems efficiently in systems programming, algorithm design, and competitive programming.`,
    },
    {
      slug: "chapter-26-string-pattern-matching-algorithms",
      title: "String Pattern Matching Algorithms",
      summary: "Strings are one of the most commonly used data types in programming. Many applications require searching for patterns or substrings within larger text data. Examples include: searching keywords in documents DNA sequence matching in bioinformatics plagiarism…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 25,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "String pattern matching finds a pattern within a text.", "The naive algorithm compares characters sequentially.", "KMP algorithm improves efficiency using the LPS table.", "Rabin–Karp algorithm uses hashing for faster comparisons.", "Efficient pattern matching is essential for search engines, text processing, and bioinformatics."],
      selfAssessment: [],
      content: `# String Pattern Matching Algorithms

## Introduction

Strings are one of the most commonly used data types in programming. Many applications require searching for patterns or substrings within larger text data.

Examples include:

searching keywords in documents

DNA sequence matching in bioinformatics

plagiarism detection

search engines finding relevant content

text editors implementing find-and-replace functionality

The task of locating a pattern within a larger text is called string pattern matching.

A string pattern matching algorithm determines whether a smaller string (pattern) exists within a larger string (text) and identifies its position.

In this chapter we will study two important pattern matching algorithms:

Knuth–Morris–Pratt (KMP) Algorithm

Rabin–Karp Algorithm

These algorithms improve efficiency compared to simple brute-force searching.

## Intuition Behind Pattern Matching

Suppose we want to find a word inside a paragraph.

### Example:

### Text: AABAACAADAABAABAPattern: AABA

We slide the pattern across the text and compare characters.

### Visualization:

### AABAACAADAABAABAAABA AABA AABA AABA

Whenever characters match completely, the pattern is found.

However, naive matching can be inefficient because it repeatedly compares characters that were already matched before.

Advanced algorithms avoid this unnecessary repetition.

## Problem the Concept Solves

Suppose a text contains millions of characters.

Searching a pattern repeatedly using naive methods becomes inefficient.

### Example:

### Text length = nPattern length = m

### Naive algorithm complexity:

### O(n × m)

Efficient algorithms reduce redundant comparisons and improve performance.

### For example:

### KMP algorithm → O(n)

This makes pattern matching feasible for large-scale text processing.

## Naive Pattern Matching

Before studying advanced algorithms, it is useful to understand the naive approach.

The naive method compares the pattern with every possible substring in the text.

## Example

### Text:

### ABABDABACDABABCABAB

### Pattern:

### ABABCABAB

The algorithm checks each position until a match is found.

## Python Implementation

\`\`\`py
def naive_search(text, pattern): n = len(text) m = len(pattern) for i in range(n - m + 1): if text[i:i+m] == pattern: print("Pattern found at index", i)
\`\`\`

## Time Complexity

### Worst case: O(n × m)

This becomes inefficient for large inputs.

## Knuth–Morris–Pratt (KMP) Algorithm

The KMP algorithm improves pattern matching by avoiding unnecessary comparisons.

Instead of restarting from the beginning after a mismatch, KMP uses information about previous matches.

The key idea is to precompute a table called the Longest Prefix Suffix (LPS) array.

## Longest Prefix Suffix (LPS)

The LPS array stores the length of the longest prefix which is also a suffix.

### Example pattern:

### ABABCABAB

### LPS array:

### [0,0,1,2,0,1,2,3,4]

This table helps determine how far the pattern should shift after a mismatch.

## KMP Algorithm Steps

- Compute the LPS array.

- Compare pattern with text.

- If mismatch occurs, use LPS to shift pattern.

- Continue until pattern is found or text ends.

## Python Implementation (KMP)

\`\`\`py
def compute_lps(pattern): lps = [0] * len(pattern) length = 0 i = 1 while i < len(pattern): if pattern[i] == pattern[length]: length += 1 lps[i] = length i += 1 else: if length != 0: length = lps[length - 1] else: lps[i] = 0 i += 1 return lpsdef kmp_search(text, pattern): lps = compute_lps(pattern) i = 0 j = 0 while i < len(text): if pattern[j] == text[i]: i += 1 j += 1 if j == len(pattern): print("Pattern found at index", i-j) j = lps[j-1] elif i < len(text) and pattern[j] != text[i]: if j != 0: j = lps[j-1] else: i += 1
\`\`\`

## Time Complexity (KMP)

### O(n + m)

### Where:

### n = length of textm = length of pattern

This makes KMP very efficient.

## Rabin–Karp Algorithm

The Rabin–Karp algorithm uses hashing to find patterns.

Instead of comparing characters directly, the algorithm compares hash values.

If the hash of the pattern matches the hash of a substring, a detailed comparison is performed.

## Rabin–Karp Idea

### Example:

### Text: GEEKSFORGEEKSPattern: GEEK

### Compute hash values:

### Hash(GEEK)Hash(GEEK)

If hashes match, verify characters.

This approach significantly reduces comparisons.

## Python Implementation (Rabin–Karp)

\`\`\`py
def rabin_karp(text, pattern): n = len(text) m = len(pattern) pattern_hash = hash(pattern) for i in range(n - m + 1): substring = text[i:i+m] if hash(substring) == pattern_hash: if substring == pattern: print("Pattern found at index", i)
\`\`\`

## Time Complexity

Worst case occurs due to hash collisions.

## Algorithm Comparison

## Visualization

### Example:

### Text: ABCDABCDABEEPattern: ABCDABE

Pattern shifts based on LPS values instead of restarting.

## Real-World Applications

String pattern matching is widely used.

## Search Engines

Finding keywords in documents.

## Bioinformatics

DNA and protein sequence matching.

## Text Editors

Find-and-replace operations.

## Cybersecurity

Detecting malware signatures.

## Common Mistakes Beginners Make

### Incorrect LPS array computation

This leads to incorrect pattern shifts.

### Ignoring hash collisions in Rabin–Karp

Hash matches must be verified.

### Incorrect boundary conditions

Index calculations must be handled carefully.

## Interview Tips

String matching problems frequently appear in coding interviews.

### Common interview questions include:

- implement KMP algorithm

- implement Rabin–Karp

- find repeated substring patterns

- longest prefix-suffix problems

### Candidates should understand:

- prefix tables

- hashing techniques

- string manipulation.

## Exercises

## Conceptual Questions

- What is string pattern matching?

- What is the limitation of naive pattern matching?

- What is the LPS array in KMP?

- How does Rabin–Karp use hashing?

- Why is KMP more efficient than naive search?

## Coding Exercises

- Implement naive pattern matching.

- Implement KMP algorithm.

- Implement Rabin–Karp algorithm.

## Interview Problems

- Find first occurrence of pattern in string.

- Detect repeated substring pattern.

- Longest prefix which is also suffix.

## Summary

String matching algorithms play a crucial role in text processing and large-scale information retrieval systems.`,
    },
    {
      slug: "chapter-27-advanced-graph-algorithms",
      title: "Advanced Graph Algorithms",
      summary: "Graphs are powerful data structures used to model relationships between objects. While basic graph algorithms such as BFS, DFS, shortest path algorithms, and minimum spanning trees are very important, more advanced graph techniques are required to solve…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 26,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Topological sorting provides an ordering of tasks in a Directed Acyclic Graph.", "Kahn’s algorithm and DFS-based methods can perform topological sorting.", "Strongly connected components (SCC) represent groups of vertices mutually reachable.", "Kosaraju’s algorithm efficiently identifies SCCs.", "These algorithms are widely used in dependency management, compilers, and network analysis."],
      selfAssessment: [],
      content: `# Advanced Graph Algorithms

## Introduction

Graphs are powerful data structures used to model relationships between objects. While basic graph algorithms such as BFS, DFS, shortest path algorithms, and minimum spanning trees are very important, more advanced graph techniques are required to solve complex real-world problems.

Advanced graph algorithms help solve problems such as:

determining dependency order in tasks

detecting strongly connected components

analyzing complex networks

scheduling operations in distributed systems

In this chapter we will study two important advanced graph algorithms:

Topological Sorting

Strongly Connected Components (SCC)

These algorithms are widely used in compilers, task scheduling systems, dependency resolution systems, and network analysis.

## Intuition Behind Directed Graph Dependencies

Many real-world problems involve dependencies between tasks.

### Example:

### Suppose we must complete tasks in the following order:

### Task A → Task B → Task C

### This means:

- Task B cannot start until Task A is completed.

- Task C cannot start until Task B is completed.

Such relationships are modeled using a Directed Acyclic Graph (DAG).

### Visualization:

### A → B → C

To execute tasks correctly, we must determine a valid order that satisfies all dependencies.

This ordering is obtained using topological sorting.

## Problem the Concept Solves

Suppose we are compiling a large software project.

Some files depend on other files.

### Example:

### A → BA → CB → DC → D

File D depends on both B and C.

We must compile files in the correct order to avoid errors.

Graph algorithms help determine the correct order automatically.

## Topological Sorting

Topological sorting is an ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge:

### u → v

vertex u appears before v in the ordering.

## Example of Topological Sort

### Consider the following graph:

### A → B → DA → C → D

### Possible topological order:

### A, B, C, D

### Another valid order:

### A, C, B, D

Topological sorting is not always unique.

## Topological Sorting Using DFS

Topological sorting can be implemented using Depth-First Search.

### Idea:

- Perform DFS traversal.

- Push nodes onto a stack when finished.

- Reverse the stack to obtain topological order.

## Python Implementation

\`\`\`py
from collections import defaultdictdef topological_sort(graph): visited = set() stack = [] def dfs(node): visited.add(node) for neighbor in graph[node]: if neighbor not in visited: dfs(neighbor) stack.append(node) for node in graph: if node not in visited: dfs(node) return stack[::-1]graph = {"A": ["B","C"],"B": ["D"],"C": ["D"],"D": []}print(topological_sort(graph))
\`\`\`

## Topological Sort Using Kahn’s Algorithm

Another method uses in-degree counting.

### Steps:

- Compute in-degree of each node.

- Add nodes with in-degree = 0 to queue.

- Remove node and update neighbors.

- Repeat until graph is processed.

## Python Implementation

\`\`\`py
from collections import dequedef kahn_topological(graph): indegree = {u:0 for u in graph} for u in graph: for v in graph[u]: indegree[v] += 1 queue = deque([u for u in graph if indegree[u] == 0]) result = [] while queue: node = queue.popleft() result.append(node) for neighbor in graph[node]: indegree[neighbor] -= 1 if indegree[neighbor] == 0: queue.append(neighbor) return result
\`\`\`

## Strongly Connected Components (SCC)

In a directed graph, a strongly connected component is a group of vertices where every vertex is reachable from every other vertex.

### Example:

### A → B → C↑ ↓└───────┘

### Here:

### A, B, C

form a strongly connected component.

## Kosaraju’s Algorithm

Kosaraju’s algorithm is used to find strongly connected components.

### Steps:

- Perform DFS and store vertices by finish time.

- Reverse all graph edges.

- Perform DFS in order of decreasing finish time.

Each DFS traversal identifies one SCC.

## Python Implementation

\`\`\`py
def kosaraju(graph): visited = set() stack = [] def dfs(node): visited.add(node) for neighbor in graph[node]: if neighbor not in visited: dfs(neighbor) stack.append(node) for node in graph: if node not in visited: dfs(node) reversed_graph = {node: [] for node in graph} for node in graph: for neighbor in graph[node]: reversed_graph[neighbor].append(node) visited.clear() scc = [] def dfs_reverse(node, component): visited.add(node) component.append(node) for neighbor in reversed_graph[node]: if neighbor not in visited: dfs_reverse(neighbor, component) while stack: node = stack.pop() if node not in visited: component = [] dfs_reverse(node, component) scc.append(component) return scc
\`\`\`

## Time Complexity

### Where:

### V = number of verticesE = number of edges

## Visualization

### Example graph:

### → 2 → 3↑ ↓└───────┘

### SCC:

\`\`\`py
{1,2,3}
\`\`\`

### Another graph:

### → 2 → 34 → 5

### SCCs:

\`\`\`py
{1}{2}{3}{4}{5}
\`\`\`

## Real-World Applications

Advanced graph algorithms are widely used.

## Task Scheduling

Topological sorting determines the correct execution order of tasks.

## Compiler Design

Detect dependencies between program modules.

## Social Network Analysis

Strongly connected components identify communities.

## Package Management Systems

Tools like npm and pip resolve dependency graphs.

## Common Mistakes Beginners Make

### Applying topological sort on cyclic graphs

Topological sorting works only on Directed Acyclic Graphs (DAGs).

### Incorrect DFS ordering in Kosaraju algorithm

The order of DFS traversal is important.

### Forgetting to reverse graph edges

Reversing edges is a critical step.

## Interview Tips

Advanced graph algorithms appear in many coding interviews.

### Common questions include:

- detect cycle in directed graph

- topological sorting

- course schedule problems

- strongly connected components

### Candidates should understand:

- graph traversal

- DFS ordering

- dependency graphs.

## Exercises

## Conceptual Questions

- What is topological sorting?

- What type of graph is required for topological sort?

- What is a strongly connected component?

- How does Kosaraju’s algorithm work?

- Why are SCCs important in graph analysis?

## Coding Exercises

- Implement topological sorting using DFS.

- Implement Kahn’s algorithm.

- Implement Kosaraju’s algorithm.

## Interview Problems

- Course schedule problem.

- Detect cycle in directed graph.

- Find strongly connected components.

## Summary

Advanced graph algorithms allow us to solve complex dependency and connectivity problems in large-scale systems and real-world networks.`,
    },
    {
      slug: "chapter-28-coding-interview-patterns",
      title: "Coding Interview Patterns",
      summary: "Technical coding interviews often test not only programming knowledge but also the ability to recognize problem-solving patterns. Many interview questions appear different on the surface but can be solved using a few common algorithmic strategies. Recognizing…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 27,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Many interview problems follow common algorithmic patterns.", "Important patterns include two pointers, sliding window, fast & slow pointers, binary search, DFS, and BFS.", "Recognizing patterns helps solve problems faster.", "These techniques are widely used in technical interviews and real-world software systems."],
      selfAssessment: [],
      content: `# Coding Interview Patterns

## Introduction

Technical coding interviews often test not only programming knowledge but also the ability to recognize problem-solving patterns. Many interview questions appear different on the surface but can be solved using a few common algorithmic strategies.

Recognizing these patterns helps programmers solve problems more quickly and efficiently.

Some of the most common patterns used in coding interviews include:

Two Pointers Pattern

Sliding Window Pattern

Fast & Slow Pointers Pattern

Binary Search Pattern

Depth-First Search (DFS) Pattern

Breadth-First Search (BFS) Pattern

These patterns appear frequently in interview questions asked by companies such as Google, Amazon, Microsoft, and Meta.

In this chapter, we will study these patterns and understand when to use them.

## Why Interview Patterns Are Important

Many interview problems look complex but follow predictable structures.

### For example:

- problems involving subarrays or substrings often use sliding window

- problems involving sorted arrays often use two pointers

- problems involving trees or graphs often use DFS or BFS

Recognizing the pattern reduces the time needed to design a solution.

Instead of inventing a new algorithm, we apply a known strategy.

## Two Pointers Pattern

The two pointers technique uses two indices to traverse a data structure.

It is especially useful for sorted arrays or linked lists.

## When to Use

### Use this pattern when:

- working with sorted arrays

- searching pairs in arrays

- removing duplicates

- partitioning arrays

## Example Problem — Pair Sum

Given a sorted array, find two numbers whose sum equals a target.

### Example:

### Array: [1,2,3,4,6]Target: 6

### Solution:

### + 4 = 6

## Python Implementation

\`\`\`py
def pair_sum(arr, target): left = 0 right = len(arr) - 1 while left < right: current = arr[left] + arr[right] if current == target: return (arr[left], arr[right]) elif current < target: left += 1 else: right -= 1
\`\`\`

## Sliding Window Pattern

Sliding window is useful for problems involving subarrays or substrings.

The window moves across the array while maintaining certain conditions.

## When to Use

### Use sliding window when:

- analyzing contiguous subarrays

- finding longest substring

- calculating running sums

## Example Problem — Maximum Sum Subarray

### Example:

### Array: [2,1,5,1,3,2]Window size: 3

### Maximum sum subarray:

### [5,1,3] = 9

## Python Implementation

\`\`\`py
def max_sum_subarray(arr, k): window_sum = sum(arr[:k]) max_sum = window_sum for i in range(k, len(arr)): window_sum += arr[i] window_sum -= arr[i-k] max_sum = max(max_sum, window_sum) return max_sum
\`\`\`

## Fast & Slow Pointers Pattern

This technique uses two pointers moving at different speeds.

It is commonly used in linked list problems.

## Applications

- detecting cycles in linked lists

- finding middle of linked list

- palindrome linked list

## Example — Cycle Detection

### Slow pointer → moves 1 stepFast pointer → moves 2 steps

If a cycle exists, the pointers eventually meet.

## Python Implementation

\`\`\`py
def has_cycle(head): slow = head fast = head while fast and fast.next: slow = slow.next fast = fast.next.next if slow == fast: return True return False
\`\`\`

## Binary Search Pattern

Binary search is used when the search space can be divided into halves.

## When to Use

### Use binary search when:

- array is sorted

- searching for threshold values

- minimizing or maximizing values

## Example Problem

Find an element in sorted array.

### Example:

### [2,5,8,12,16]

### Search:

### 12

## Python Implementation

\`\`\`py
def binary_search(arr, target): left = 0 right = len(arr)-1 while left <= right: mid = (left + right)//2 if arr[mid] == target: return mid elif arr[mid] < target: left = mid + 1 else: right = mid - 1
\`\`\`

## Depth-First Search (DFS) Pattern

DFS explores structures as deep as possible before backtracking.

### Used in:

- trees

- graphs

- backtracking problems

## Example — Tree Traversal

### / \\ 5 15

### DFS traversal:

### → 5 → 15

## Python Implementation

\`\`\`py
def dfs(graph, node, visited): visited.add(node) for neighbor in graph[node]: if neighbor not in visited: dfs(graph, neighbor, visited)
\`\`\`

## Breadth-First Search (BFS) Pattern

BFS explores nodes level by level.

It uses a queue data structure.

## Applications

- shortest path in unweighted graph

- level order traversal of tree

- network broadcasting

## Example

### A / \\ B C

### BFS order:

### A → B → C

## Python Implementation

from collections import dequedef bfs(graph, start): visited = set([start]) queue = deque([start]) while queue: node = queue.popleft() print(node) for neighbor in graph[node]: if neighbor not in visited: visited.add(neighbor) queue.append(neighbor)

## Pattern Comparison

## Real-World Applications

These patterns appear in many real-world systems.

## Search Engines

Binary search and string algorithms help locate data efficiently.

## Social Networks

Graph traversal algorithms analyze connections.

## Network Routing

Shortest path algorithms use BFS and DFS concepts.

## Data Analytics

Sliding window methods analyze time-series data.

## Common Mistakes Beginners Make

### Misidentifying patterns

Choosing the wrong technique leads to inefficient solutions.

### Incorrect pointer movement

Two-pointer solutions require careful pointer updates.

### Ignoring edge cases

Empty arrays and single elements must be handled.

## Interview Tips

Interviewers often expect candidates to recognize patterns quickly.

### Typical interview strategy:

- Identify input type (array, tree, graph).

- Recognize known pattern.

- Apply correct algorithm.

- Analyze time complexity.

Practicing pattern recognition significantly improves interview performance.

## Exercises

## Conceptual Questions

- What are coding interview patterns?

- When should sliding window be used?

- What problems use fast and slow pointers?

- When should binary search be applied?

- What is the difference between DFS and BFS?

## Coding Exercises

- Find pair with target sum using two pointers.

- Find longest substring without repeating characters.

- Detect cycle in linked list.

## Interview Problems

- Container with most water problem.

- Minimum window substring.

- Course schedule problem using graph traversal.

## Summary

Mastering coding interview patterns is essential for becoming a strong problem solver and successful software engineer.`,
    },
    {
      slug: "chapter-29-solving-interview-problems-step-by-step",
      title: "Solving Interview Problems Step-by-Step",
      summary: "Solving algorithm problems in coding interviews requires more than knowing data structures and algorithms. Interviewers evaluate how you analyze problems, design solutions, and write clean code. A structured approach helps candidates solve problems…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 28,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Successful coding interviews require a structured problem-solving approach.", "Candidates should start by understanding the problem and analyzing examples.", "Begin with a brute-force solution, then optimize it.", "Write clean, readable code and test edge cases.", "Always explain time and space complexity."],
      selfAssessment: [],
      content: `# Solving Interview Problems Step-by-Step

## Introduction

Solving algorithm problems in coding interviews requires more than knowing data structures and algorithms. Interviewers evaluate how you analyze problems, design solutions, and write clean code.

A structured approach helps candidates solve problems efficiently under time pressure.

In most coding interviews, candidates are expected to:

understand the problem clearly

analyze possible approaches

implement an efficient solution

test the solution with edge cases

In this chapter we will learn a systematic method for solving interview problems step-by-step.

This approach helps avoid common mistakes and improves problem-solving speed.

## Step 1 — Understand the Problem

The first step is to fully understand the problem statement.

### Before writing code, clarify:

- What are the inputs?

- What output is expected?

- Are there any constraints?

- Can the input contain duplicates?

- What is the size of the input?

### Example problem:

Find two numbers in an array whose sum equals a target value.

### Example input:

### Array = [2,7,11,15]Target = 9

### Expected output:

### Indices = [0,1]

Understanding the problem prevents incorrect solutions.

## Step 2 — Analyze Examples

Work through a few examples manually.

### Example:

### Array = [3,2,4]Target = 6

### Possible pairs:

### + 2 = 53 + 4 = 72 + 4 = 6 ✓

### Solution:

### Indices = [1,2]

Analyzing examples helps identify patterns and edge cases.

## Step 3 — Consider the Brute Force Solution

Start with the simplest possible approach.

### Brute force solution:

Check every possible pair.

### Python implementation:

\`\`\`py
def two_sum(nums, target): for i in range(len(nums)): for j in range(i+1, len(nums)): if nums[i] + nums[j] == target: return [i, j]
\`\`\`

### Time complexity:

### O(n²)

Although inefficient, brute force provides a starting point.

## Step 4 — Optimize the Solution

Look for ways to improve performance.

### Observation:

Instead of checking all pairs, we can use a hash table to store visited numbers.

### Optimized solution:

\`\`\`py
def two_sum(nums, target): hashmap = {} for i, num in enumerate(nums): complement = target - num if complement in hashmap: return [hashmap[complement], i] hashmap[num] = i
\`\`\`

### Time complexity:

### O(n)

Optimization reduces the number of operations significantly.

## Step 5 — Write Clean Code

### During interviews, code should be:

- readable

- well-structured

- logically organized

### Example:

\`\`\`py
def two_sum(nums, target): visited = {} for index, value in enumerate(nums): required = target - value if required in visited: return [visited[required], index] visited[value] = index
\`\`\`

Clear variable names improve readability.

## Step 6 — Test with Edge Cases

Always test the solution with edge cases.

### Examples:

### Empty arraySingle element arrayNegative numbersLarge inputsDuplicate numbers

### Example tests:

### two_sum([1,2,3],4)two_sum([3,3],6)two_sum([-1,-2,-3],-5)

Handling edge cases demonstrates strong problem-solving ability.

## Step 7 — Analyze Time and Space Complexity

Interviewers expect candidates to explain complexity.

### Example:

### For optimized two-sum solution:

### Time complexity:

### O(n)

### Space complexity:

### O(n)

Explaining complexity shows algorithmic understanding.

## Common Interview Problem Patterns

Many problems fall into recognizable categories.

### Examples include:

Recognizing these patterns speeds up problem solving.

## Example Interview Problem

### Problem: Find the Maximum Subarray Sum

Given an array, find the contiguous subarray with the largest sum.

### Example:

### Input:[-2,1,-3,4,-1,2,1,-5,4]

### Output:

### 6

### Subarray:

### [4,-1,2,1]

## Solution — Kadane's Algorithm

Kadane's algorithm uses dynamic programming.

### Python implementation:

\`\`\`py
def max_subarray(nums): current_sum = nums[0] max_sum = nums[0] for num in nums[1:]: current_sum = max(num, current_sum + num) max_sum = max(max_sum, current_sum) return max_sum
\`\`\`

### Time complexity:

### O(n)

## Communication During Interviews

Coding interviews evaluate communication skills.

### Candidates should:

- explain reasoning clearly

- describe algorithm steps

- discuss trade-offs

### Example explanation:

"The brute force solution has O(n²) complexity. We can improve it using a hash table to achieve O(n) time complexity."

Clear explanations demonstrate understanding.

## Common Mistakes Candidates Make

### Jumping directly to coding

Always analyze the problem first.

### Ignoring edge cases

Edge cases frequently cause bugs.

### Writing overly complex code

Simple solutions are often preferred.

### Not explaining thought process

Interviewers want to see your reasoning.

## Interview Strategy

### A good interview strategy follows this order:

### Understand the problem2. Analyze examples3. Discuss brute force solution4. Optimize the solution5. Implement code6. Test edge cases7. Explain complexity

Following this method increases success in coding interviews.

## Practice Problems

Below are common interview problems for practice.

### Arrays

- Two Sum

- Maximum Subarray

- Rotate Array

### Strings

- Longest substring without repeating characters

- Valid palindrome

- Group anagrams

### Trees

- Maximum depth of binary tree

- Binary tree level order traversal

### Graphs

- Number of islands

- Course schedule

### Dynamic Programming

- Climbing stairs

- Coin change

## Exercises

### Conceptual Questions

- Why should we start with brute force solutions?

- Why are edge cases important?

- What is the benefit of optimization?

- Why is time complexity analysis necessary?

- Why should candidates explain their thought process?

### Coding Exercises

- Implement the Two Sum problem.

- Implement Kadane’s algorithm.

- Implement binary search.

### Interview Practice

- Longest substring without repeating characters.

- Find first missing positive number.

- Merge intervals.

## Summary

Following this systematic approach helps candidates perform confidently in technical interviews and real-world problem solving.`,
    },
    {
      slug: "chapter-30-real-interview-practice-problems",
      title: "Real Interview Practice Problems",
      summary: "After learning data structures, algorithms, and problem-solving techniques, the most important step toward becoming job-ready is practice. Coding interviews often test the ability to: recognize algorithm patterns apply data structures correctly optimize…",
      difficulty: "intermediate",
      estimatedMinutes: 10,
      order: 29,
      tags: "python-dsa",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Key concepts from this chapter:", "Coding interviews test algorithmic thinking and problem-solving ability.", "Practicing real interview problems builds confidence and coding skills.", "Important topics include arrays, strings, linked lists, trees, graphs, and dynamic programming.", "Candidates should practice analyzing problems, writing efficient solutions, and explaining complexity."],
      selfAssessment: [],
      content: `# Real Interview Practice Problems

## Introduction

After learning data structures, algorithms, and problem-solving techniques, the most important step toward becoming job-ready is practice.

Coding interviews often test the ability to:

recognize algorithm patterns

apply data structures correctly

optimize brute-force solutions

write clean and efficient code

Practicing real interview questions helps improve:

algorithmic thinking

coding speed

debugging ability

confidence during interviews

This chapter contains a collection of interview-style problems covering the major topics learned in this book:

arrays

strings

linked lists

trees

graphs

dynamic programming

These problems resemble those asked in technical interviews at companies such as Amazon, Google, Microsoft, Meta, and Apple.

## Array Problems

## Problem 1 — Two Sum

Given an array of integers and a target value, return the indices of two numbers whose sum equals the target.

### Example:

### Input:nums = [2,7,11,15]target = 9Output:[0,1]

### Python Solution:

\`\`\`py
def two_sum(nums, target): hashmap = {} for i, num in enumerate(nums): complement = target - num if complement in hashmap: return [hashmap[complement], i] hashmap[num] = i
\`\`\`

### Time Complexity:

### O(n)

## Problem 2 — Maximum Subarray

Find the contiguous subarray with the largest sum.

### Example:

### Input:[-2,1,-3,4,-1,2,1,-5,4]Output:6

### Subarray:

### [4,-1,2,1]

### Python Solution (Kadane’s Algorithm):

\`\`\`py
def max_subarray(nums): current_sum = nums[0] max_sum = nums[0] for num in nums[1:]: current_sum = max(num, current_sum + num) max_sum = max(max_sum, current_sum) return max_sum
\`\`\`

## Problem 3 — Rotate Array

Rotate an array to the right by k steps.

### Example:

### Input:[1,2,3,4,5,6,7], k = 3Output:[5,6,7,1,2,3,4]

### Python Solution:

\`\`\`py
def rotate_array(nums, k): k = k % len(nums) nums[:] = nums[-k:] + nums[:-k]
\`\`\`

## String Problems

## Problem 4 — Longest Substring Without Repeating Characters

### Example:

### Input:"abcabcbb"Output:3

### Longest substring:

### "abc"

### Python Solution:

\`\`\`py
def longest_substring(s): char_set = set() left = 0 max_length = 0 for right in range(len(s)): while s[right] in char_set: char_set.remove(s[left]) left += 1 char_set.add(s[right]) max_length = max(max_length, right-left+1) return max_length
\`\`\`

## Problem 5 — Valid Palindrome

Determine if a string is a palindrome.

### Example:

### Input:"racecar"Output:True

### Python Solution:

\`\`\`py
def is_palindrome(s): left = 0 right = len(s) - 1 while left < right: if s[left] != s[right]: return False left += 1 right -= 1 return True
\`\`\`

## Linked List Problems

## Problem 6 — Reverse Linked List

Reverse a singly linked list.

### Example:

### → 2 → 3 → 4Result:4 → 3 → 2 → 1

### Python Solution:

\`\`\`py
def reverse_list(head): prev = None current = head while current: next_node = current.next current.next = prev prev = current current = next_node return prev
\`\`\`

## Problem 7 — Detect Cycle in Linked List

Determine whether a linked list contains a cycle.

### Python Solution:

\`\`\`py
def has_cycle(head): slow = head fast = head while fast and fast.next: slow = slow.next fast = fast.next.next if slow == fast: return True return False
\`\`\`

## Tree Problems

## Problem 8 — Maximum Depth of Binary Tree

### Example tree:

### / \\ 9 20 / \\ 15 7

### Output:

### 3

### Python Solution:

\`\`\`py
def max_depth(root): if not root: return 0 left = max_depth(root.left) right = max_depth(root.right) return 1 + max(left, right)
\`\`\`

## Graph Problems

## Problem 9 — Number of Islands

Given a grid of land (1) and water (0), count the number of islands.

### Example:

### 1 0 01 0 0 10 0 1 1

### Output:

### 3

### Python Solution:

\`\`\`py
def num_islands(grid): rows = len(grid) cols = len(grid[0]) def dfs(r,c): if r<0 or c<0 or r>=rows or c>=cols or grid[r][c]=='0': return grid[r][c]='0' dfs(r+1,c) dfs(r-1,c) dfs(r,c+1) dfs(r,c-1) count = 0 for r in range(rows): for c in range(cols): if grid[r][c]=='1': dfs(r,c) count+=1 return count
\`\`\`

## Dynamic Programming Problems

## Problem 10 — Climbing Stairs

You can climb 1 or 2 steps at a time.

Find the number of ways to reach step n.

### Example:

### Input: 4Output: 5

### Python Solution:

\`\`\`py
def climb_stairs(n): if n <= 2: return n a = 1 b = 2 for i in range(3,n+1): c = a + b a = b b = c return b
\`\`\`

## Additional Interview Problem Categories

To master coding interviews, candidates should practice problems from these categories.

### Arrays

- Two Sum

- Product of Array Except Self

- Maximum Subarray

### Strings

- Longest substring without repeating characters

- Valid anagram

- Minimum window substring

### Linked Lists

- Reverse linked list

- Merge two sorted lists

- Detect cycle

### Trees

- Binary tree traversal

- Lowest common ancestor

- Balanced binary tree

### Graphs

- Number of islands

- Course schedule

- Graph traversal

### Dynamic Programming

- Fibonacci optimization

- Coin change

- Longest increasing subsequence

## Interview Preparation Tips

### To prepare effectively for coding interviews:

- Practice solving problems daily.

- Learn common algorithm patterns.

- Analyze time and space complexity.

- Practice writing clean code.

- Simulate interview conditions.

Platforms such as LeetCode, HackerRank, and Codeforces provide excellent practice problems.

## Summary

Regular practice with real interview questions is essential for becoming a job-ready software engineer and succeeding in technical interviews.`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 — Chapters 1–12", title: "Introduction to Algorithms and Problem Solving", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 0, tutorialSlug: "chapter-1-introduction-to-algorithms-and-problem-solving" },
  { part: "Part 1 — Chapters 1–12", title: "Python Basics for Data Structures", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 1, tutorialSlug: "chapter-2-python-basics-for-data-structures" },
  { part: "Part 1 — Chapters 1–12", title: "Understanding Time and Space Complexity", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 2, tutorialSlug: "chapter-3-understanding-time-and-space-complexity" },
  { part: "Part 1 — Chapters 1–12", title: "Arrays and Python Lists", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 3, tutorialSlug: "chapter-4-arrays-and-python-lists" },
  { part: "Part 1 — Chapters 1–12", title: "Strings and String Algorithms", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 4, tutorialSlug: "chapter-5-strings-and-string-algorithms" },
  { part: "Part 1 — Chapters 1–12", title: "Memory Allocation and Pointers in Programming", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 5, tutorialSlug: "chapter-6-memory-allocation-and-pointers-in-programming" },
  { part: "Part 1 — Chapters 1–12", title: "Linked Lists", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 6, tutorialSlug: "chapter-7-linked-lists" },
  { part: "Part 1 — Chapters 1–12", title: "Stacks", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 7, tutorialSlug: "chapter-8-stacks" },
  { part: "Part 1 — Chapters 1–12", title: "Recursion Fundamentals", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 8, tutorialSlug: "chapter-9-recursion-fundamentals" },
  { part: "Part 1 — Chapters 1–12", title: "Divide and Conquer Algorithms", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 9, tutorialSlug: "chapter-10-divide-and-conquer-algorithms" },
  { part: "Part 1 — Chapters 1–12", title: "Tree Data Structures", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 10, tutorialSlug: "chapter-11-tree-data-structures" },
  { part: "Part 1 — Chapters 1–12", title: "Binary Search Trees (BST)", subtitle: "Part of Part 1 — Chapters 1–12 · Intermediate", order: 11, tutorialSlug: "chapter-12-binary-search-trees-bst" },
  { part: "Part 2 — Chapters 13–24", title: "Heaps and Priority Queues", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 12, tutorialSlug: "chapter-13-heaps-and-priority-queues" },
  { part: "Part 2 — Chapters 13–24", title: "Hash Tables", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 13, tutorialSlug: "chapter-14-hash-tables" },
  { part: "Part 2 — Chapters 13–24", title: "Graph Representation", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 14, tutorialSlug: "chapter-15-graph-representation" },
  { part: "Part 2 — Chapters 13–24", title: "Graph Traversal Algorithms", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 15, tutorialSlug: "chapter-16-graph-traversal-algorithms" },
  { part: "Part 2 — Chapters 13–24", title: "Shortest Path Algorithms", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 16, tutorialSlug: "chapter-17-shortest-path-algorithms" },
  { part: "Part 2 — Chapters 13–24", title: "Minimum Spanning Trees (MST)", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 17, tutorialSlug: "chapter-18-minimum-spanning-trees-mst" },
  { part: "Part 2 — Chapters 13–24", title: "Greedy Algorithms", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 18, tutorialSlug: "chapter-19-greedy-algorithms" },
  { part: "Part 2 — Chapters 13–24", title: "Dynamic Programming", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 19, tutorialSlug: "chapter-20-dynamic-programming" },
  { part: "Part 2 — Chapters 13–24", title: "Backtracking", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 20, tutorialSlug: "chapter-21-backtracking" },
  { part: "Part 2 — Chapters 13–24", title: "Sliding Window and Two Pointers", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 21, tutorialSlug: "chapter-22-sliding-window-and-two-pointers" },
  { part: "Part 2 — Chapters 13–24", title: "Searching Algorithms", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 22, tutorialSlug: "chapter-23-searching-algorithms" },
  { part: "Part 2 — Chapters 13–24", title: "Sorting Algorithms", subtitle: "Part of Part 2 — Chapters 13–24 · Intermediate", order: 23, tutorialSlug: "chapter-24-sorting-algorithms" },
  { part: "Part 3 — Chapters 25–30", title: "Bit Manipulation", subtitle: "Part of Part 3 — Chapters 25–30 · Intermediate", order: 24, tutorialSlug: "chapter-25-bit-manipulation" },
  { part: "Part 3 — Chapters 25–30", title: "String Pattern Matching Algorithms", subtitle: "Part of Part 3 — Chapters 25–30 · Intermediate", order: 25, tutorialSlug: "chapter-26-string-pattern-matching-algorithms" },
  { part: "Part 3 — Chapters 25–30", title: "Advanced Graph Algorithms", subtitle: "Part of Part 3 — Chapters 25–30 · Intermediate", order: 26, tutorialSlug: "chapter-27-advanced-graph-algorithms" },
  { part: "Part 3 — Chapters 25–30", title: "Coding Interview Patterns", subtitle: "Part of Part 3 — Chapters 25–30 · Intermediate", order: 27, tutorialSlug: "chapter-28-coding-interview-patterns" },
  { part: "Part 3 — Chapters 25–30", title: "Solving Interview Problems Step-by-Step", subtitle: "Part of Part 3 — Chapters 25–30 · Intermediate", order: 28, tutorialSlug: "chapter-29-solving-interview-problems-step-by-step" },
  { part: "Part 3 — Chapters 25–30", title: "Real Interview Practice Problems", subtitle: "Part of Part 3 — Chapters 25–30 · Intermediate", order: 29, tutorialSlug: "chapter-30-real-interview-practice-problems" },
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
    where: { slug: "python-dsa-path" },
    create: { slug: "python-dsa-path", title: "Python DSA Roadmap", tagline: "The complete roadmap for Python DSA - all parts in order.", description: "The complete roadmap for Python DSA - all parts in order.", icon: "Code2", color: "oklch(0.66 0.16 160)", difficulty: 'intermediate', estimatedHours: 5, published: true },
    update: { title: "Python DSA Roadmap", tagline: "The complete roadmap for Python DSA - all parts in order.", description: "The complete roadmap for Python DSA - all parts in order.", icon: "Code2", color: "oklch(0.66 0.16 160)", difficulty: 'intermediate', estimatedHours: 5 },
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
