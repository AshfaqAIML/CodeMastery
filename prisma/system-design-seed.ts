import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

// ============================================================
// System Design - imported by scripts/import-course/book.py
// Source: System Design.docx (Chapters 1-3)
// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.
// ============================================================

const subject = {
  slug: "system-design",
  name: "System Design",
  tagline: "Design systems that scale - from requests and clients to trade-offs and capacity thinking.",
  description: "A guided foundations course on system design: what systems are made of, how the web and backend systems work, and how to think about requirements and capacity. Every chapter explains each term on first use, with real-world problems, architecture diagrams, worked examples, trade-off analysis, and interview questions.",
  icon: "Network",
  color: "oklch(0.68 0.2 30)",
  category: "Backend",
  order: 10,
  modules: [
    {
      slug: "part-1-system-design",
      title: "Part 1 - System Design",
      summary: "Part 1 of the course.",
      order: 1,
      difficulty: "beginner",
      estimatedMinutes: 90,
      tutorials: [
    {
      slug: "chapter-1-what-is-system-design",
      title: "Chapter 1 — What Is System Design?",
      summary: "Many beginners think system design means: “Learn Redis, Kafka, Kubernetes, microservices, load balancers, and draw fancy architecture diagrams.” That is a misunderstanding.",
      difficulty: "beginner",
      estimatedMinutes: 49,
      order: 0,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should be able to explain:", "What a system is.", "What a software system is.", "What system design actually means.", "What a client is.", "What a server is.", "What a request and response are.", "What a database is.", "What a service is.", "What an API is.", "What architecture means.", "Why small programs and large systems are different."],
      prerequisites: [],
      whereItFits: "Many beginners think system design means: “Learn Redis, Kafka, Kubernetes, microservices, load balancers, and draw fancy architecture diagrams.” That is a misunderstanding.",
      keyTakeaways: ["System design is the discipline of organizing software components so that a system can meet its goals reliably, efficiently, and maintainably.", "A software system is more than a program.", "It includes:", "clients,", "servers,", "data stores,", "communication paths,", "business rules,", "failure handling,", "security,"],
      selfAssessment: [],
      content: `# Chapter 1 — What Is System Design?

## Why This Matters

Many beginners think system design means:

“Learn Redis, Kafka, Kubernetes, microservices, load balancers, and draw fancy architecture diagrams.”

That is a misunderstanding.

Those technologies may be useful, but they are not the core skill.

The core skill is reasoning:

Given a problem, users, data, traffic, failures, and constraints, what structure should the software have?

System design matters because real software rarely runs in a perfect world.

In the real world:

- Many users may arrive at the same time.

- Networks may become slow or fail.

- Servers may crash.

- Databases may become bottlenecks.

- Data may need to be protected.

- Features may need to change without breaking everything.

- The system must remain understandable, operable, and affordable.

A program that works on your laptop is not the same as a system that serves thousands or millions of users.

System design teaches you how to bridge that gap.

## Prerequisites

For this chapter:

No prior System Design knowledge is required.

Basic programming knowledge is helpful but not mandatory.

You should ideally understand simple ideas such as:

- variables,

- functions,

- data structures,

- reading input,

- producing output,

- storing data somewhere.

If you do not know those yet, you can still read this chapter, but some examples will become clearer after basic programming practice.

# Start With a Real-World Problem

Imagine you build a small application called TaskTracker.

TaskTracker lets a user create tasks.

Example:

- Tasks:

- 1. Buy milk

- 2. Study system design

- 3. Call friend

At first, the application runs only on your laptop.

You store the tasks in a local file.

For personal use, this is fine.

It is simple.

It works.

It does not need complicated infrastructure.

Now suppose your friends want to use it.

Then your college club wants to use it.

Then a small company wants to use it for employee tasks.

Suddenly, your simple program faces new problems.

## Problem 1: Many Users Need Access at the Same Time

Your original program was designed for one user on one computer.

Now ten, hundred, or thousand users may want to use it at the same time.

Can your program handle that?

Maybe not.

## Problem 2: Data Must Be Shared Correctly

Suppose two users edit the same task list at the same time.

User A marks task 1 as done.

User B edits the title of task 1.

What should happen?

Should one change overwrite the other?

Should both changes survive?

Should the system prevent simultaneous edits?

These are system design questions.

## Problem 3: Data Must Not Disappear

If your laptop crashes, are the tasks lost?

If the file becomes corrupted, can users recover their data?

If the application restarts, does the data remain?

A real system needs durable storage.

## Problem 4: Users Are Not Sitting Next to Your Laptop

Your friends use their own phones or computers.

They are not directly running your local program.

Your program must be reachable from outside your machine.

That means something must listen for incoming requests over a network.

## Problem 5: Security Matters

Not everyone should see everyone else’s tasks.

You need to know:

- Who is the user?

- Is this user allowed to view this task?

- Is this user allowed to delete this task?

- Is this user allowed to assign this task to someone else?

Security cannot be an afterthought.

## Problem 6: Performance Matters

If opening the task list takes 10 seconds, users will complain.

If creating a task takes 5 seconds, the system feels broken.

You need to understand where delays come from.

## Problem 7: Failure Is Normal

Computers crash.

Networks disconnect.

Disks fill up.

External services fail.

Software bugs appear.

A system that works only when everything is perfect is not a robust system.

## The Main Lesson

Your original question was:

“How do I write a function to add a task?”

The new question becomes:

“How do I build a system that many users can rely on safely, quickly, and continuously?”

That is system design.

# Intuition

A system is a collection of parts that work together to achieve a goal.

Examples:

- A car is a system.

- A school is a system.

- A restaurant kitchen is a system.

- A website backend is a system.

A software system is a system where the important parts are:

- programs,

- data,

- computers,

- networks,

- storage systems,

- communication protocols.

System design is the process of deciding:

- What parts the system should have.

- What each part is responsible for.

- How the parts communicate.

- Where data is stored.

- How the system behaves when traffic grows.

- How the system handles failure.

- What trade-offs are acceptable.

A useful beginner definition:

System design is the art and discipline of organizing software components so that a system can meet its goals reliably, efficiently, and maintainably.

Another way to say it:

Programming tells a computer what to do.

System design decides how many computers, what data, and what rules are needed to do it reliably for many users.

# Core Concept

Let us build the vocabulary slowly.

We will introduce each term using this pattern:

Simple explanation → formal term → example → practical use

## 1. What Is an Application?

### Simple explanation

An application is software that does something for a user.

### Formal term

Application, or app.

### Example

A todo app, chat app, banking app, video streaming app, food delivery app.

### Practical use

When designing a system, the application defines the user-facing purpose.

But an application is not always the whole system.

For example, a chat application may include:

- the mobile app on your phone,

- the server that stores messages,

- the database that keeps conversation history,

- the notification service that alerts other users.

So the application is the product, but the system includes all supporting parts.

## 2. What Is a Component?

### Simple explanation

A component is a part of the system with a specific job.

### Formal term

Component, module, or subsystem.

### Example

In a food delivery system, components may include:

- user interface,

- order processing,

- payment processing,

- restaurant notification,

- delivery tracking,

- database.

### Practical use

System design often begins by dividing a large problem into smaller components.

But division must be meaningful.

A component should have a clear responsibility.

Bad example:

“Put everything in one giant component called \`Main\`.”

That may work for a tiny program, but it becomes difficult to maintain, scale, and debug.

Better example:

“Separate user authentication from order processing because they change for different reasons and have different security needs.”

However, separation has costs.

More components mean:

- more communication,

- more deployment complexity,

- more things that can fail,

- more operational overhead.

This is one of the first major lessons of system design:

Every architectural decision has benefits and costs.

## 3. What Is a Client?

### Simple explanation

A client is the part that asks for something.

### Formal term

Client.

### Example

Your web browser is a client.

Your mobile app is a client.

Another internal service asking for data can also be a client.

### Practical use

In backend system design, the client is often the user’s device or application.

But “client” does not always mean human-facing software.

A server can be a client when it asks another server for something.

Example:

\`Order Service asks Payment Service to charge a card.\`

Here:

- Order Service is the client.

- Payment Service is the server.

So client and server are roles, not fixed types of software.

## 4. What Is a Server?

This term confuses many beginners because people use “server” in two different ways.

### Meaning 1: Server as a computer

A server can be a physical or virtual computer that provides services to other computers.

Example:

A powerful computer in a data center running a website.

### Meaning 2: Server as software

A server can also be a program that listens for requests and responds to them.

Example:

A web server program that handles incoming requests.

### Formal definition for system design

In system design, when we say “server,” we usually mean:

A software component, running on one or more computers, that receives requests from clients and performs work.

### Example

A backend server may:

- receive a request to create a task,

- check that the user is logged in,

- validate the task text,

- save the task in a database,

- return a success response.

### Practical use

Servers are where much of the backend logic lives.

But a server is not magical.

It is just a program running on hardware with limits:

- CPU limit,

- memory limit,

- disk limit,

- network limit,

- operating system limits.

When we scale a system, we often care about whether the server program, the server machine, or both need more capacity.

## 5. What Is a Request?

### Simple explanation

A request is a message asking the system to do something.

### Formal term

Request.

### Example

When you click “Save Task,” your app may create a request like:

- Create a new task:

- Title: Study system design

- Priority: High

- Owner: user_123

### Practical use

In web systems, requests often use HTTP, but for now you can think of a request more generally:

A request is an instruction sent from a client to a server.

A good request usually contains enough information for the server to understand what to do.

For example:

- Which user is making the request?

- What action is requested?

- What data is needed?

- Is the request allowed?

Later, we will study web requests in detail.

For Chapter 1, remember:

Clients send requests. Servers process requests.

## 6. What Is a Response?

### Simple explanation

A response is the answer sent back after processing a request.

### Formal term

Response.

### Example

After saving the task, the server may respond:

- Success:

- Task ID: 987

- Created at: 2026-10-05 10:30:00

Or:

- Error:

- Task title cannot be empty.

### Practical use

Responses are not only data.

They also communicate status.

Did the request succeed?

Was it rejected?

Was there a server error?

Was the user not authorized?

A well-designed system gives clear responses so clients know what happened.

## 7. What Is a Service?

### Simple explanation

A service is a part of the system that provides a specific capability.

### Formal term

Service.

### Example

In a ride-sharing system, services may include:

- user service,

- ride service,

- driver service,

- payment service,

- location service,

- notification service.

### Practical use

The word “service” is often used when we want to emphasize business capability.

For example:

“The payment service is responsible for charging users.”

A service may be:

- a small part inside one application,

- a separate program running on its own server,

- a group of servers working together.

Do not confuse “service” with “microservice” yet.

A microservice is one architectural style of building services.

For now:

A service is a functional part of the system that does a specific job.

## 8. What Is a Database?

### Simple explanation

A database is a system for storing and retrieving data reliably.

### Formal term

Database.

### Example

A user table may store:

| user_id | email | created_at |
| --- | --- | --- |
| 1 | alice@example.com | 2026-01-01 |
| 2 | bob@example.com | 2026-01-02 |

A task table may store:

| task_id | user_id | title | status |
| --- | --- | --- | --- |
| 10 | 1 | Buy milk | open |
| 11 | 1 | Study system design | open |

### Practical use

Applications often need data to survive restarts.

If you store tasks only in memory, they disappear when the program stops.

A database helps with:

- persistence, meaning data survives restarts,

- structured querying, meaning you can ask for specific data,

- concurrency control, meaning multiple users can access data safely,

- durability, meaning data is not easily lost,

- relationships, meaning data can refer to other data.

A database is not just a file.

It is a specialized system for managing data.

However, not all data belongs in a traditional database.

For example:

- videos may be stored in object storage,

- temporary session data may be stored in a cache,

- logs may be stored in a log system,

- search indexes may be stored in a search engine.

So the broader term is data store.

A database is one type of data store.

## 9. What Is an API?

We will study APIs deeply later, but you need a basic definition now.

### Simple explanation

An API is a contract that defines how one part of a system can talk to another part.

### Formal term

Application Programming Interface, or API.

### Example

A task app may expose an API endpoint:

\`POST /tasks\`

Meaning:

Send a request to create a task.

The API defines:

- the endpoint,

- the method,

- the input format,

- the output format,

- the errors,

- the authentication rules.

### Practical use

APIs are boundaries.

They allow components to communicate without knowing each other’s internal details.

For example, the mobile app does not need to know exactly how the server stores tasks in the database.

It only needs to know the API.

This separation is powerful.

It allows you to change internals without breaking clients, as long as the API remains compatible.

## 10. What Is Architecture?

### Simple explanation

Architecture is the arrangement of system components and the rules for how they interact.

### Formal term

System architecture, software architecture, backend architecture.

### Example

A simple architecture:

\`Client → Server → Database\`

A slightly larger architecture:

\`\`\`text
Mobile App → API Server → Database
                  ↓
            Notification Service


\`\`\`
### Practical use

Architecture is not just boxes.

It answers:

- Which component owns which responsibility?

- Where is data stored?

- How do components communicate?

- What happens when traffic grows?

- What happens when a component fails?

- Which parts are critical?

- Which parts can be delayed or degraded?

A good architecture makes the system easier to understand, operate, scale, and evolve.

A bad architecture may work initially but become painful as the system grows.

## 11. What Are Functional Requirements?

A functional requirement describes what the system must do.

### Example

For TaskTracker:

- Users can create tasks.

- Users can update tasks.

- Users can delete tasks.

- Users can mark tasks as done.

- Users can assign tasks to other users.

Functional requirements define features.

## 12. What Are Non-Functional Requirements?

A non-functional requirement describes how well the system must behave.

### Example

For TaskTracker:

- Task creation should complete within 300 milliseconds for most requests.

- The system should remain available 99.9% of the time.

- The system should support 10,000 concurrent users.

- User data must be protected.

- Committed tasks must not be lost due to ordinary server failures.

Non-functional requirements are extremely important in system design.

Many beginners focus only on features.

But real systems and interviews care deeply about behavior under pressure.

## 13. Important System Qualities

Here are some terms you will hear often.

| Quality | Simple meaning | Example question |
| --- | --- | --- |
| Scalability | Can the system handle growth? | What happens when users increase from 1,000 to 1,000,000? |
| Availability | Is the system usable when needed? | What percentage of time is the app working? |
| Reliability | Does it behave correctly over time? | Does it avoid data loss and strange errors? |
| Performance | How fast and efficient is it? | How long does a request take? |
| Latency | Delay before response | Does the user wait 100ms or 2 seconds? |
| Throughput | Amount of work done per time | How many requests per second can it handle? |
| Fault tolerance | Can it survive failures? | If one server dies, does the whole system die? |
| Security | Is data and access protected? | Can one user see another user’s private tasks? |
| Maintainability | Can engineers change it safely? | Can we add a feature without breaking everything? |
| Observability | Can we understand what is happening inside? | Can we find why requests became slow? |
| Cost | Is the design economically reasonable? | Do we need expensive hardware for a tiny app? |

Do not memorize these yet.

Just understand that system design is not only about functionality.

It is about behavior, limits, and trade-offs.

# Important Terminology

Here is a compact terminology table for Chapter 1.

| Term | Plain explanation |
| --- | --- |
| System | A set of parts working together toward a goal |
| Software system | A system made of programs, data, computers, and communication |
| Application | Software that provides functionality to users |
| Component | A part of the system with a specific responsibility |
| Client | The part that sends a request |
| Server | The part that receives and processes requests |
| Request | A message asking the system to do something |
| Response | The answer returned after processing a request |
| Service | A system part that provides a specific capability |
| Database | A system for storing and retrieving data reliably |
| Data store | Any place where data is stored |
| API | A defined way for components to communicate |
| Architecture | The structure and interaction rules of system components |
| Backend | Server-side systems that handle logic, data, and integration |
| Frontend | User-facing interface, such as a web page or mobile app |
| Scale | Growth in users, traffic, data, or complexity |
| Bottleneck | The part that limits overall system performance |
| Failure | A component or process not working as expected |
| Trade-off | Losing one benefit to gain another |

# Mental Model

A useful beginner mental model is:

\`\`\`text
User Action
    ↓
Client creates Request
    ↓
Server processes Request
    ↓
Server reads/writes Data
    ↓
Server sends Response
    ↓
Client shows Result

\`\`\`

This is the heartbeat of many backend systems.

Let us expand it slightly.

- +------------------+

- User ---> | Client           |

- +------------------+

- |

- | request

- v

- +------------------+

- | Server           |

- +------------------+

- |

- | read/write

- v

- +------------------+

- | Data Store       |

- +------------------+

- |

- | result

- v

- +------------------+

- | Response         |

- +------------------+

- |

- v

- User

This model is simple, but extremely important.

Almost every backend system can be understood by asking:

- Who is the user or caller?

- What client sends the request?

- What server processes it?

- What data does it need?

- What response does it return?

- What can fail along the way?

# Architecture Diagram

Let us start with the smallest serious backend architecture.

## Minimal Backend Architecture

- [Client]

- |

- | request

- v

- [Server]

- |

- | query

- v

- [Database]

This diagram has three parts.

## 1. Client

The client is what the user interacts with.

Examples:

- web browser,

- mobile app,

- desktop application,

- another service.

Its job is to:

- collect user input,

- send requests,

- display responses.

## 2. Server

The server receives requests and applies business logic.

Business logic means the rules of the application.

For TaskTracker, business logic includes:

- a task must belong to a user,

- a task title cannot be empty,

- a user can only edit their own tasks,

- completed tasks may be archived.

The server is a good place for these rules because clients cannot be trusted.

A malicious or buggy client might send invalid data.

The server must protect the system.

## 3. Database

The database stores durable data.

For TaskTracker, it may store:

- users,

- tasks,

- task status,

- timestamps.

Its job is to make data retrieval and updates reliable.

# Why Each Component Exists

A diagram is meaningless unless you understand why each box exists.

Let us ask:

What happens if we remove a component?

## What If We Remove the Server?

Suppose clients talk directly to the database.

\`[Client] → [Database]\`

This seems simple, but it is dangerous.

Problems:

- Every client needs database credentials.

- Anyone could run arbitrary queries.

- Business rules are duplicated in every client.

- Security becomes extremely difficult.

- Changing the database schema breaks all clients.

- You cannot easily control access, rate limits, validation, or auditing.

So the server acts as a controlled gateway.

## What If We Remove the Database?

Suppose the server stores tasks only in memory.

\`[Client] → [Server with in-memory data]\`

Problems:

- If the server restarts, data is lost.

- If there are multiple servers, they may have different data.

- Querying large datasets becomes inefficient.

- Durability is poor.

- Concurrent updates are harder to manage safely.

So the database provides reliable storage.

## What If Everything Runs on One Computer?

You can run client, server, and database on the same machine during development.

That is fine.

But in production, separating responsibilities often helps with:

- security,

- scaling,

- maintenance,

- failure isolation,

- team ownership.

However, separation is not automatically good.

It adds complexity.

This is your first major lesson:

Architecture is about choosing boundaries that reduce pain more than they add complexity.

# Step-by-Step Request Flow

Let us trace a real request.

Suppose a user creates a task in TaskTracker.

## User Action

The user types:

\`Study system design\`

and clicks Save.

## Request

The client sends a request to the server.

Conceptually:

- Create task

- User: alice

- Title: Study system design

In a real web system, this might be an HTTP request, but we do not need details yet.

## Routing

The request reaches the server.

The server identifies:

- which operation is being requested,

- which user sent it,

- whether the request is valid.

## Processing

The server applies business rules.

Example checks:

- Is Alice logged in?

- Is the title non-empty?

- Is the title too long?

- Does Alice have permission to create tasks?

- Should the task be assigned an ID?

- Should the creation timestamp be added?

## Data Access

The server asks the database to store the task.

Conceptual database operation:

- INSERT task

- task_id = generated

- user_id = alice

- title = "Study system design"

- status = "open"

- created_at = now

The database saves the data and returns confirmation.

## Response

The server sends a response to the client:

- Success

- Task ID: 123

The client updates the UI and shows the new task.

## Failure Case

Many things can fail.

### Client fails to send request

The user may have no network.

The client should show a friendly error and allow retry.

### Server receives invalid request

The title may be empty.

The server should reject it with a clear error.

### Server crashes while processing

The task may not be saved.

The client should retry safely.

This raises an important question:

If the user retries, will the task be created twice?

That is a system design problem involving idempotency, which we will study later.

### Database fails

The server cannot save the task.

It should return an error, not pretend success.

### Database saves but response is lost

The server may save the task, but the client never receives confirmation.

The user may retry.

Now the system must avoid duplicates.

This is why failure analysis is central to system design.

# Simple Example

Let us compare three versions of TaskTracker.

## Version 1: Local Program

\`[User] → [Local App] → [Local File]\`

Good for:

- personal use,

- learning,

- prototypes.

Bad for:

- multiple users,

- remote access,

- security,

- reliability,

- scale.

## Version 2: Simple Web App

\`[Browser] → [Web Server] → [Database]\`

Good for:

- small teams,

- hundreds of users,

- centralized data,

- easier updates.

Still limited when:

- traffic grows,

- features become complex,

- reliability requirements increase.

## Version 3: Growing System

- [Mobile App / Browser]

- |

- v

- [API Server]

- |     |

- |     v

- |  [Notification Service]

- v

- [Database]

Now the system has more components.

Why?

Because new needs appeared.

Maybe users want push notifications when a task is assigned.

So a notification service is introduced.

But notice:

We did not start with notifications.

We added it because a requirement demanded it.

This is important.

Do not add components just because they look impressive.

Add them because they solve real problems.

# Practical Example: Photo Sharing System

Let us look at a more realistic system.

Imagine a simple photo-sharing application.

Users can:

- upload photos,

- add captions,

- view their own photos,

- share photos with friends.

A basic architecture might look like this:

- [Mobile App]

- |

- v

- [API Server]

- |

- +----> [Metadata Database]

- |

- +----> [Image Storage]

- |

- +----> [Notification Service]

Let us explain each component.

## Mobile App

The client.

It allows users to:

- pick a photo,

- write a caption,

- press upload,

- view photos.

## API Server

The backend entry point.

It handles requests such as:

- upload photo,

- get photo feed,

- delete photo,

- follow friend.

It enforces rules:

- user must be authenticated,

- photo size must be acceptable,

- user can only delete their own photos.

## Metadata Database

Stores information about photos, not necessarily the photo files themselves.

Example:

| photo_id | user_id | caption | created_at | storage_path |
| --- | --- | --- | --- | --- |
| 1001 | alice | Sunset beach | 2026-10-05 | /images/a/1001.jpg |

Why separate metadata from image files?

Because images can be large.

Databases are excellent for structured records and queries, but storing huge binary files inside a traditional database may not always be ideal.

This is a design decision with trade-offs.

## Image Storage

A data store optimized for files.

It stores the actual image bytes.

Examples of generic categories:

- object storage,

- file storage,

- block storage.

We will not focus on vendor names yet.

The important idea:

Choose the data store based on the shape and access pattern of the data.

## Notification Service

When Alice shares a photo with Bob, Bob may need a notification.

The API server may tell the notification service:

\`Send notification to Bob: Alice shared a photo.\`

Why separate it?

Because sending notifications may involve:

- mobile push services,

- email providers,

- retry logic,

- rate limits,

- templates.

That is a different responsibility from handling photo uploads.

But again, separation adds complexity.

For a tiny app, you might initially do notifications inside the API server.

Later, if it becomes complex, you extract it.

# Small Systems vs Large Systems

A beginner must understand that small systems and large systems fail in different ways.

## Small System

Characteristics:

- few users,

- one server,

- one database,

- simple deployment,

- limited failure scenarios.

Main concerns:

- correctness,

- simplicity,

- development speed.

## Large System

Characteristics:

- many users,

- many servers,

- multiple data stores,

- asynchronous workflows,

- partial failures,

- complex operations.

Main concerns:

- scalability,

- availability,

- reliability,

- security,

- observability,

- cost,

- maintainability.

The danger is not that large systems are impossible.

The danger is treating a small system like a large one too early, or treating a large system like a small one too late.

# Scaling Example

Now let us think about growth.

Suppose TaskTracker starts with 10 users.

One server may be enough.

Then it grows to 10,000 users.

Then to 1,000,000 users.

What changes?

## Level 1: Tiny System

- 10 users

- 1 server

- 1 database

Questions:

- Is the server busy?

- Is the database slow?

- Are there errors?

- Is the code simple enough?

At this level, simplicity is valuable.

Do not overengineer.

## Level 2: Growing System

- 10,000 users

- possibly more capable server

- possibly separate database server

- monitoring becomes useful

You may ask:

- Are requests taking longer?

- Is the database doing too many reads?

- Are we running out of memory?

- Are peak hours causing slowdowns?

Here, measurement matters.

You cannot scale wisely without knowing where the bottleneck is.

## Level 3: Large System

- 1,000,000 users

- many servers

- replicated database

- caching

- asynchronous work

- observability

- security controls

- failure handling

At this level, the system is no longer just “an app.”

It is a distributed platform.

But you do not jump here immediately.

You evolve toward it as requirements demand.

## A Simple Capacity Thought Experiment

Suppose your app has:

\`100,000 daily users\`

Each user creates:

\`10 requests per day\`

Total requests per day:

\`100,000 × 10 = 1,000,000 requests/day\`

There are:

\`24 × 60 × 60 = 86,400 seconds/day\`

Average requests per second:

\`1,000,000 / 86,400 ≈ 11.6 requests/second\`

But traffic is not perfectly smooth.

People use the app more during certain hours.

Suppose peak traffic is 5 times average:

\`11.6 × 5 ≈ 58 requests/second\`

This does not mean your system must be perfect at 58 requests/second forever.

But it gives you a starting point.

You can ask:

- Can one server handle 58 requests/second?

- Can the database handle the associated reads and writes?

- What if peak is 10x?

- What if users double next year?

This is capacity thinking.

For now, understand:

System design begins with numbers, not logos.

# Failure Scenario

A mature system designer asks:

What can fail?

Let us list common failures in a simple client-server-database system.

\`[Client] → [Server] → [Database]\`

## Failure 1: Client Cannot Reach Server

Possible causes:

- no internet,

- DNS problem,

- server down,

- firewall blocking,

- mobile network issue.

Effect:

- user sees loading error.

Design responses:

- retry with backoff,

- show cached data if available,

- provide clear error message.

## Failure 2: Server Crashes

Possible causes:

- bug,

- out of memory,

- unhandled exception,

- hardware failure.

Effect:

- requests fail.

Design responses:

- automatic restart,

- multiple server instances,

- health checks,

- monitoring and alerting.

## Failure 3: Database Becomes Slow

Possible causes:

- too many queries,

- missing indexes,

- lock contention,

- large tables,

- inefficient schema.

Effect:

- API responses become slow.

Design responses:

- query optimization,

- indexing,

- caching,

- read replicas,

- partitioning.

Again, do not worry about these terms yet.

The important thing is to recognize that slowness has causes and mitigations.

## Failure 4: Database Loses Data

Possible causes:

- disk failure,

- corruption,

- bad migration,

- accidental deletion.

Effect:

- users lose tasks or photos.

Design responses:

- backups,

- replication,

- write-ahead logging,

- recovery procedures,

- testing restores.

## Failure 5: Network Partition

Sometimes one component can talk to some parts but not others.

Example:

- Server can talk to Client

- Server cannot talk to Database

Effect:

- partial failure.

This is especially important in distributed systems.

A single computer failure is bad.

A partial network failure is trickier because some parts appear alive while others are unreachable.

## Single Point of Failure

A single point of failure is a component whose failure stops the whole system.

Example:

\`[Client] → [One Server] → [One Database]\`

If the one server fails, the system fails.

If the one database fails, the system fails.

That may be acceptable for a small internal tool.

It may be unacceptable for a banking system.

So reliability requirements determine how much redundancy you need.

# Trade-Offs

System design is not about finding the perfect architecture.

It is about choosing acceptable trade-offs.

A trade-off means:

To gain something, you give up something else.

Let us look at beginner-friendly examples.

## Trade-Off 1: One Server vs Multiple Servers

### One server

Advantages:

- simple,

- cheap,

- easy to debug,

- easy to deploy.

Disadvantages:

- limited capacity,

- single point of failure,

- harder to scale during traffic spikes.

When useful:

- small apps,

- early prototypes,

- low traffic internal tools.

When not useful:

- high availability requirements,

- large traffic,

- mission-critical systems.

### Multiple servers

Advantages:

- more capacity,

- better fault tolerance,

- can handle traffic growth.

Disadvantages:

- more complex,

- requires request distribution,

- may require shared state handling,

- more operational overhead.

When useful:

- growing traffic,

- availability requirements,

- load isolation.

When not useful:

- tiny system where complexity outweighs benefit.

## Trade-Off 2: Store Data in Database vs Store Files Separately

### Store everything in database

Advantages:

- simpler transactional behavior,

- one system to manage,

- easier consistency in some cases.

Disadvantages:

- large binary data may bloat database,

- backup/restore may become heavy,

- database may become a bottleneck.

### Store metadata in database and files in object/file storage

Advantages:

- database stays lightweight,

- file storage can scale independently,

- better for large media.

Disadvantages:

- two systems to coordinate,

- possible inconsistency if file upload succeeds but metadata insert fails.

This is a classic system design issue:

When data lives in multiple places, keeping them consistent becomes harder.

## Trade-Off 3: Do Work Immediately vs Do Work Later

Some operations can be done synchronously.

Synchronous means:

The system waits for the work to finish before responding.

Example:

\`User uploads photo → server saves photo → server responds\`

Some operations can be done asynchronously.

Asynchronous means:

The system accepts the work and processes it later.

Example:

- User uploads photo → server accepts upload → server responds

- Later, background process creates thumbnail

### Immediate processing

Advantages:

- simpler user expectation,

- result is ready sooner,

- easier to return errors immediately.

Disadvantages:

- user waits longer,

- server resources tied up,

- slow external dependencies hurt response time.

### Later processing

Advantages:

- faster response,

- better resilience to slow tasks,

- work can be retried,

- heavy processing isolated.

Disadvantages:

- user may not see result immediately,

- more complex status tracking,

- possible duplicate processing,

- eventual consistency.

For now, understand:

Doing work later can improve responsiveness, but it makes the system harder to reason about.

## Trade-Off 4: Simplicity vs Scalability

A simple system is easier to build.

A scalable system is easier to grow.

But scalability often adds complexity.

Example:

A single-server app is simple.

A multi-region, multi-database, event-driven system is scalable but complex.

The mistake is not complexity itself.

The mistake is unnecessary complexity.

Ask:

What problem does this component solve today?

What problem might it solve tomorrow?

What new failure modes does it introduce?

What is the cost of adding it now versus adding it later?

## Trade-Off 5: Performance vs Cost

You can often make a system faster by adding resources.

More CPUs.

More memory.

Faster disks.

More replicas.

Better networking.

But resources cost money.

A good designer asks:

Is this performance improvement worth the cost?

For a small internal tool, maybe not.

For a global e-commerce platform during holiday traffic, maybe yes.

# Common Beginner Mistakes

Let us explicitly name mistakes that new learners often make.

## Mistake 1: Thinking System Design Is Only Diagrams

Diagrams help communicate, but they are not the design itself.

The design is the reasoning behind the boxes.

## Mistake 2: Starting with Technology Names

Beginners often say:

Use Kafka.

Use Redis.

Use Kubernetes.

Use microservices.

But the correct first question is:

What problem are we solving?

Technology is a solution, not a requirement.

## Mistake 3: Ignoring Requirements

If you do not know:

- number of users,

- read/write pattern,

- data size,

- latency needs,

- availability needs,

you cannot choose a good architecture.

## Mistake 4: Overengineering Early

Building a system for 100 million users when you have 100 users is usually wasteful.

It slows development and introduces unnecessary failure modes.

## Mistake 5: Assuming One Machine Can Grow Forever

You can upgrade a machine, but there are limits.

Eventually, you need to distribute work.

## Mistake 6: Forgetting Failure

Beginners design happy paths.

Experienced designers design for:

- timeouts,

- retries,

- crashes,

- partial failures,

- data corruption,

- network partitions.

## Mistake 7: Confusing Scalability with Performance

Scalability is about handling growth.

Performance is about speed and efficiency.

A system can be fast for 100 users but not scalable to 10 million.

A system can be scalable but poorly optimized and expensive.

## Mistake 8: Confusing Availability with Reliability

Availability means the system is usable.

Reliability means it behaves correctly and predictably.

A system can be available but wrong.

Example:

It responds quickly, but loses user data.

That is available but not reliable.

## Mistake 9: Ignoring Data Modeling

Many system problems are actually data problems.

If your data model is poor, scaling becomes harder.

## Mistake 10: Copying Famous Architectures

Just because a large company uses an architecture does not mean it is right for your system.

Their scale, team size, history, and constraints may be completely different.

# Deep Dive: What Does a System Designer Actually Do?

A system designer does not simply “know many technologies.”

A system designer translates goals into structure.

Here is a practical thinking sequence.

## Step 1: Understand the Purpose

Ask:

What is the system for?

Example:

TaskTracker helps users create, organize, and complete tasks.

Without purpose, architecture has no direction.

## Step 2: Identify Users and Actors

Ask:

Who uses the system?

Possible actors:

- end users,

- admins,

- mobile apps,

- web browsers,

- internal services,

- third-party systems.

Example:

For TaskTracker:

- regular users,

- team admins,

- notification service,

- analytics service.

## Step 3: Define Functional Requirements

Ask:

What must the system do?

Examples:

- create task,

- update task,

- delete task,

- list tasks,

- assign task,

- mark task complete.

## Step 4: Define Non-Functional Requirements

Ask:

How well must it do it?

Examples:

- support 100,000 users,

- 99.9% availability,

- p95 latency under 300ms,

- no loss of committed tasks,

- role-based access control.

## Step 5: Estimate Scale

Ask:

How much traffic and data are we talking about?

Examples:

- daily active users,

- requests per second,

- storage per user,

- growth rate,

- read/write ratio.

## Step 6: Design the Data Model

Ask:

What entities exist?

How are they related?

How will they be accessed?

For TaskTracker:

- User,

- Task,

- Project,

- Assignment,

- Comment.

Example relationship:

- User has many Tasks

- Task belongs to User

- Task may belong to Project

- Task may have many Comments

Data modeling is foundational.

A weak data model can make everything else harder.

## Step 7: Define APIs

Ask:

What operations does the system expose?

Examples:

\`\`\`text
POST /tasks
GET /tasks
PATCH /tasks/{task_id}
DELETE /tasks/{task_id}

\`\`\`

APIs define boundaries between components.

## Step 8: Draw High-Level Architecture

Ask:

What components are needed?

How do they interact?

Start simple.

Only add complexity when justified.

## Step 9: Trace Request Flows

Ask:

What happens step by step for important operations?

Examples:

- create task,

- list tasks,

- delete task,

- receive notification.

Request flow reveals hidden problems.

## Step 10: Find Bottlenecks

Ask:

Which component will fail first under load?

Common bottlenecks:

- database,

- single server,

- network,

- disk I/O,

- external APIs,

- locks,

- hot data items.

## Step 11: Plan for Failure

Ask:

What if this component dies?

What if the network delays?

What if a dependency returns errors?

What if data becomes inconsistent?

## Step 12: Evaluate Trade-Offs

Ask:

Why this design instead of another?

What do we gain?

What do we lose?

What is the simplest design that satisfies requirements?

# The System Design Question Checklist

You should eventually be able to look at any system and ask these questions automatically.

## Purpose

- What does the system need to do?

- Who uses it?

- What is out of scope?

## Requirements

- What are the functional requirements?

- What are the non-functional requirements?

- What is the expected traffic?

- What is the expected data size?

- What latency is acceptable?

- What availability is required?

## Data

- Where is data stored?

- What is the shape of the data?

- Is it relational, document-like, key-value, file-based, or event-based?

- How often is it read?

- How often is it written?

- Does it need strong consistency?

## Requests

- How does a request enter the system?

- Which component handles it?

- What downstream components are called?

- What happens on success?

- What happens on failure?

## Scaling

- Which component becomes a bottleneck first?

- Can it be scaled vertically?

- Can it be scaled horizontally?

- Can reads and writes be separated?

- Can heavy work be moved off the main request path?

## Reliability

- What single points of failure exist?

- What happens if a server fails?

- What happens if the database fails?

- What happens if a network call times out?

- How do we recover?

## Security

- Who is allowed to do what?

- How are users authenticated?

- How is data protected?

- Are inputs validated?

- Are secrets managed safely?

## Observability

- How do we know the system is healthy?

- What metrics matter?

- What logs matter?

- How do we debug a slow request?

- How do we detect failures quickly?

## Trade-offs

- Why this architecture?

- What alternatives were considered?

- What complexity did we accept?

- What risks remain?

This checklist is one of the most valuable things in this chapter.

Save it mentally.

You will use it repeatedly.

# Active Learning Checks

System design is learned by thinking, not only reading.

Pause and answer these before moving on.

## Think About It

Question:

You built an app that works perfectly on your laptop. Why might it fail when 10,000 users try to use it over the internet?

Think before reading the answer.

Answer direction:

Because the original app was designed for one local user. It may not handle:

- concurrent requests,

- remote access,

- authentication,

- durable shared storage,

- network failures,

- increased data volume,

- server resource limits.

The problem is not only “more users.”

The problem is a different operating environment.

## Predict

Question:

In this architecture:

\`[Client] → [Server] → [Database]\`

If the database becomes very slow, what will users observe?

Answer direction:

Users may see:

- loading spinners,

- timeouts,

- delayed saves,

- error messages,

- inconsistent UI states.

The server may also become backed up waiting for the database, causing more requests to fail.

## Find the Bottleneck

Question:

Consider this system:

- [All Clients]

- |

- v

- [One Application Server]

- |

- v

- [One Database]

Traffic increases 100x.

Which component is likely to become a bottleneck first?

Answer direction:

It depends on the workload, but common first bottlenecks are:

- The single application server, if CPU/memory/network saturates.

- The database, if queries become frequent or expensive.

Often, the database becomes a serious bottleneck because many application requests translate into many database reads/writes.

But you cannot know for sure without measuring.

## Find the Failure

Question:

What happens if the only server crashes?

\`[Client] → [One Server] → [Database]\`

Answer direction:

The system becomes unavailable.

All requests fail until the server is restarted or replaced.

This is a single point of failure.

## Compare

Question:

Which architecture is better?

Architecture A:

\`[Client] → [One Server] → [Database]\`

Architecture B:

\`\`\`text
[Client] → [Load Balancer] → [Server 1]
                         ↘ [Server 2]
                              ↓
                          [Database]

\`\`\`

Answer direction:

Neither is automatically better.

Architecture A is simpler and cheaper.

Architecture B can handle more traffic and survive one server failure, but it is more complex.

The right choice depends on requirements.

# Architecture Exercise

## Weak Design

You are asked to build a simple blog system.

A beginner proposes this architecture:

- [Browser]

- |

- v

- [Database]

The browser connects directly to the database.

Users run SQL queries from the browser to read and write blog posts.

## Your Task

Find the problems.

Ask yourself:

- Is this secure?

- Can we enforce business rules?

- What happens if many users connect at once?

- What happens if the database schema changes?

- Can we easily add authentication?

- Can we easily rate-limit abusive users?

## Hint 1

Ask:

Who should trust whom?

A browser is outside your control.

It may be modified, automated, or malicious.

## Hint 2

Ask:

Where should business rules live?

Rules such as:

- only authors can publish posts,

- posts must have titles,

- users cannot delete other users’ posts,

should not depend on every browser behaving correctly.

## Hint 3

Ask:

What component can sit between the client and database?

A server can validate, authenticate, authorize, throttle, log, and coordinate.

## Improved Architecture

- [Browser]

- |

- v

- [Blog Server]

- |

- v

- [Database]

Now the server:

- receives requests from browsers,

- checks authentication,

- validates input,

- enforces permissions,

- queries the database safely,

- returns structured responses.

This is still simple, but much safer and more maintainable.

# Design Exercise

## Problem

Design a very simple system called SharedNotes.

Users can:

- create a note,

- view their own notes,

- edit their own notes,

- delete their own notes.

Assume:

- 1,000 users,

- low traffic,

- data must survive restarts,

- users must log in.

Do not worry about advanced scaling yet.

## Step 1: Clarify Requirements

Ask:

- Is there collaboration?

- Are notes public or private?

- Do we need search?

- Do we need version history?

- What devices are used?

For this exercise, assume:

- notes are private,

- no collaboration,

- no search,

- no version history,

- web browser clients.

## Step 2: Functional Requirements

The system must:

- register users,

- log in users,

- create notes,

- list notes for a user,

- edit notes,

- delete notes.

## Step 3: Non-Functional Requirements

For this small system:

- data must persist,

- users must only access their own notes,

- response time should be reasonable,

- system should be simple to operate.

## Step 4: Data Model

Possible entities:

### User

| field | example |
| --- | --- |
| user_id | 1 |
| email | alice@example.com |
| password | hashed value |
| created_at | 2026-10-05 10:00:00 |

### Note

| field | example |
| --- | --- |
| note_id | 101 |
| user_id | 1 |
| title | Meeting notes |
| body | Discuss project plan |
| created_at | 2026-10-05 10:05:00 |
| updated_at | 2026-10-05 10:05:00 |

Relationship:

- User has many Notes

- Note belongs to User

## Step 5: API Design

Possible endpoints:

\`\`\`text
POST   /users/register
POST   /users/login
POST   /notes
GET    /notes
GET    /notes/{note_id}
PATCH  /notes/{note_id}
DELETE /notes/{note_id}

\`\`\`

## Step 6: High-Level Architecture

- [Browser]

- |

- v

- [Note Server]

- |

- v

- [Database]

## Step 7: Request Flow for Creating a Note

\`\`\`text
User fills note form
   ↓
Browser sends create-note request
   ↓
Note Server checks login
   ↓
Note Server validates title/body
   ↓
Note Server inserts note into Database
   ↓
Database confirms save
   ↓
Note Server returns success response
   ↓
Browser shows saved note

\`\`\`

## Step 8: Failure Cases

What can fail?

- User not logged in.

- Note title empty.

- Database unavailable.

- Response lost after save.

- Server crashes during insert.

The system should handle these with clear errors and safe retries.

## Sample Final Design

- [Browser]

- |

- v

- [Note Server]

- |

- +--> Authentication check

- |

- +--> Validation

- |

- v

- [Database]

- |

- v

- Saved notes

This design is intentionally simple.

It is appropriate for the stated scale.

If traffic grows to 100,000 users, you would revisit bottlenecks and reliability.

But for 1,000 users, simplicity is a strength.

# Practice Questions

Try answering these without rereading the chapter.

## Conceptual Questions

- What is the difference between a program and a system?

- What is a client?

- What is a server?

- What is a request?

- What is a response?

- What is a database?

- What is an API?

- What is architecture?

- What is a functional requirement?

- What is a non-functional requirement?

- What is a bottleneck?

- What is a single point of failure?

- What is a trade-off?

- Why is failure analysis important?

- Why should you not start system design by choosing technologies?

## Short Answer Direction

You do not need perfect wording.

You need correct understanding.

Example:

Question: What is a server?

Acceptable answer:

A server is a program or computer that receives requests from clients and processes them.

Even better:

In system design, a server is a component that receives requests, applies business logic, accesses data stores, and returns responses.

# Interview Questions

These are beginner-to-intermediate questions you may hear.

## Question 1

Interviewer: What does system design mean to you?

Good answer direction:

System design is the process of deciding how software components, data stores, and communication paths should be arranged so that a system meets functional and non-functional requirements reliably and efficiently.

## Question 2

Interviewer: Why do we need a server instead of letting clients talk directly to the database?

Good answer direction:

A server enforces business rules, authentication, authorization, validation, rate limiting, and security. It also provides a stable API so clients do not depend directly on database internals.

## Question 3

Interviewer: What is the difference between scalability and performance?

Good answer direction:

Performance is how fast or efficient the system is under a given load. Scalability is how well the system handles increasing load. A system can be performant at small scale but fail to scale.

## Question 4

Interviewer: What is a single point of failure?

Good answer direction:

A component whose failure causes the whole system to fail. For example, one server or one database with no redundancy.

## Question 5

Interviewer: When would you keep a system simple instead of making it highly scalable?

Good answer direction:

When current requirements do not justify complexity. Early-stage systems often benefit from simplicity because it reduces development cost, operational burden, and failure modes. You scale when measurements and requirements show the need.

# Self-Check

Ask yourself honestly:

- Can I explain what a client is?

- Can I explain what a server is?

- Can I explain what a request and response are?

- Can I explain why a database is needed?

- Can I explain what an API is?

- Can I explain what architecture means?

- Can I distinguish functional from non-functional requirements?

- Can I explain what a bottleneck is?

- Can I explain what a single point of failure is?

- Can I explain why trade-offs matter?

- Can I trace a simple request from user to database and back?

- Can I identify what can fail in a basic client-server-database system?

If you answered yes to most of these, you are ready to move deeper.

If not, reread the sections on clients, servers, requests, responses, databases, and the step-by-step request flow.

# DSA/Backend/Coding Connection

System design connects strongly to data structures and algorithms.

At a small scale, you choose data structures for a program.

At a large scale, you choose data stores and communication patterns for a system.

Examples:

| Programming Concept | System Design Analogy |
| --- | --- |
| Array | Ordered storage, sequential access |
| Hash map | Key-value store, fast lookup by key |
| Linked list | Chains of records or events |
| Tree | Hierarchical data, indexes, organizational structures |
| Graph | Social networks, routes, dependencies |
| Queue | Background jobs, message buffers |
| Stack | Call chains, undo history |
| Sorting/searching algorithms | Indexing, query optimization, ranking |
| Big-O complexity | Bottleneck analysis, scalability reasoning |

For example, if you need fast lookup by user ID, a hash-map-like key-value store may be natural.

If you need relationships and transactions, a relational database may be more appropriate.

If you need to process tasks later, a queue-like mechanism may be useful.

The underlying idea is similar:

Choose the structure that matches the access pattern and constraints.

System design is, in many ways, data structures and algorithms applied at the scale of machines, networks, and organizations.`,
    },
    {
      slug: "chapter-2-how-the-web-and-backend-systems-work",
      title: "Chapter 2 — How the Web and Backend Systems Work",
      summary: "Backend systems exist to receive and process requests.",
      difficulty: "beginner",
      estimatedMinutes: 54,
      order: 1,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should understand:", "what a network is,", "what the internet is,", "what a client is in a real web system,", "what a server is in a real web system,", "what an IP address is,", "what a domain name is,", "what DNS does,", "what a URL is,", "what a port is,", "what HTTP is,", "what HTTPS is,"],
      prerequisites: [],
      whereItFits: "Backend systems exist to receive and process requests.",
      keyTakeaways: ["This chapter explained how web and backend systems actually communicate.", "The key path is:", "User action", "↓", "Client creates request", "DNS resolves domain to IP", "TCP connection is established", "TLS handshake secures HTTPS", "HTTP request is sent", "Server processes request"],
      selfAssessment: [],
      content: `# Chapter 2 — How the Web and Backend Systems Work

In Chapter 1, you learned the basic mental model:

\`Client → Server → Database\`

That model is correct, but it is still too abstract.

Now we need to answer a more concrete question:

When a user opens a website or mobile app, what actually happens between their device and the backend system?

This chapter explains how the web and backend systems work from a beginner’s perspective.

You will learn how a request travels from a browser or mobile app, through the internet, to a server, and back again.

We will cover:

- the internet,

- clients and servers,

- IP addresses,

- domain names,

- DNS,

- URLs,

- ports,

- HTTP,

- HTTPS,

- TCP at a conceptual level,

- requests and responses,

- what happens when you type a URL,

- common failure points,

- and how this understanding helps you design backend systems.

This chapter is not meant to make you a networking expert.

It is meant to give you the mental model needed to understand backend architecture.

## Why This Matters

Backend systems exist to receive and process requests.

If you do not understand how requests reach a backend, you cannot properly design or debug the backend.

For example, consider these problems:

- A user says: “The website is slow.”

- A user says: “I cannot log in.”

- A user says: “The app shows a network error.”

- A user says: “The page returns 404.”

- A user says: “The SSL certificate warning appeared.”

- A user says: “The API works locally but not in production.”

To answer these, you need to know where the request is failing.

Is it:

- DNS?

- network connectivity?

- TLS/HTTPS?

- the web server?

- the application server?

- the database?

- the client app?

- a firewall?

- a timeout?

System design becomes much easier when you can trace the path of a request.

## Prerequisites

You should have read Chapter 1 and understand:

- client,

- server,

- request,

- response,

- database,

- API,

- architecture,

- basic system design vocabulary.

No networking background is required.

# Start With a Real-World Problem

Suppose you have a simple web application called TaskTracker.

A user opens their browser and types:

The browser shows a list of tasks.

That seems simple.

But many things had to happen:

- The browser had to understand the URL.

- It had to find the server’s IP address.

- It had to open a network connection.

- It had to establish a secure HTTPS connection.

- It had to send an HTTP request.

- The server had to receive the request.

- The server had to check whether the user is logged in.

- The server had to fetch tasks from a database or cache.

- The server had to send an HTTP response.

- The browser had to render the tasks.

If any one of these steps fails, the user sees an error.

Now suppose the page takes 8 seconds to load.

Where is the problem?

It could be:

- DNS is slow,

- the network is slow,

- the server is overloaded,

- the database query is slow,

- the response payload is too large,

- the browser is doing heavy rendering,

- or a third-party service is delaying the response.

Without understanding the request path, you are guessing.

With understanding, you can investigate systematically.

# Intuition

The internet is a huge network of connected computers.

For two computers to communicate, they need several things:

- An address

They need to know where to send the message.

- A route

The message must travel through networks.

- A reliable delivery mechanism

Messages may be lost, reordered, or duplicated.

- A shared language

Both sides must understand the message format.

- Security, if needed

The message should not be readable or modifiable by attackers.

A useful analogy is sending a physical letter.

| Letter Analogy | Internet Equivalent |
| --- | --- |
| Recipient address | IP address |
| Human-readable name like “Alice’s house” | Domain name |
| Phonebook that maps name to address | DNS |
| Postal system | Internet/network routing |
| Numbered envelopes and delivery confirmation | TCP |
| Language of the letter | HTTP |
| Sealed envelope | HTTPS/TLS |
| Contents of the letter | Request/response body |

System design does not require you to know every detail of the postal system.

But you do need to know that letters can be lost, delayed, misdelivered, opened, or forged.

Similarly, network requests can fail, become slow, be intercepted, or be rejected.

# Core Concept

We will now build the concepts one by one.

Each term will follow this pattern:

Simple explanation → formal term → example → practical use

## 1. What Is a Network?

### Simple explanation

A network is a group of computers that can communicate with each other.

### Formal term

Computer network.

### Example

Your home Wi-Fi network connects:

- your laptop,

- your phone,

- your smart TV,

- your router.

The internet is a global network of networks.

### Practical use

Backend systems communicate over networks.

A mobile app on a user’s phone may talk to a server in a data center thousands of kilometers away.

Networks introduce:

- delay, called latency,

- limited capacity, called bandwidth,

- packet loss,

- routing failures,

- firewalls,

- security risks.

This is why system design must account for network behavior.

## 2. What Is the Internet?

### Simple explanation

The internet is the global system of interconnected computer networks that use standard communication rules.

### Formal term

Internet.

### Example

When your browser loads a webpage, it communicates with servers around the world using the internet.

### Practical use

In system design, “the internet” is often treated as an unreliable medium.

Requests may:

- take time,

- fail,

- be retried,

- be blocked,

- be intercepted,

- arrive out of order,

- or never arrive.

A robust backend assumes the network is not perfect.

## 3. What Is a Client in a Web System?

### Simple explanation

A client is the software that asks for something.

### Formal term

Client.

### Example

In a web system, the client is often:

- a browser,

- a mobile app,

- a desktop app,

- a command-line tool,

- or another service.

### Practical use

The client initiates requests.

For example:

\`Browser asks server for the task list.\`

The client is usually outside your full control.

Users may:

- use old browsers,

- have slow networks,

- modify requests,

- use automated scripts,

- or go offline.

Therefore, the backend must never blindly trust the client.

## 4. What Is a Server in a Web System?

### Simple explanation

A server is the software or machine that receives requests and responds to them.

### Formal term

Server.

### Example

A TaskTracker backend server may receive this request:

\`Give me the tasks for user Alice.\`

It may respond:

\`Here are Alice's tasks.\`

### Practical use

Servers are where backend logic lives.

They may:

- authenticate users,

- validate input,

- enforce permissions,

- query databases,

- call other services,

- generate responses,

- log activity,

- and handle errors.

A server is not just hardware.

It is a program running on hardware.

That program has limits:

- CPU,

- memory,

- disk,

- network,

- open connections,

- threads/processes,

- database connections.

System design often begins by asking whether these limits are sufficient.

## 5. What Is an IP Address?

### Simple explanation

An IP address is a numeric address that identifies a device on a network.

### Formal term

IP address, Internet Protocol address.

### Example

An IPv4 address looks like:

\`192.0.2.15\`

An IPv6 address looks like:

\`2001:db8::1\`

### Practical use

Computers route messages using IP addresses.

When your browser wants to contact \`tasktracker.example\`, it eventually needs an IP address.

For example:

\`tasktracker.example → 198.51.100.24\`

Important beginner points:

- IP addresses are not usually memorable.

- A server’s IP address can change.

- One domain name may map to multiple IP addresses.

- One IP address may serve multiple domain names.

- Private IP addresses are used inside networks.

- Public IP addresses are reachable over the internet.

There is also a special address:

\`localhost\`

or:

\`127.0.0.1\`

This refers to your own machine.

It is extremely useful during development.

Example:

This means:

Connect to port 8080 on my own computer.

## 6. What Is a Domain Name?

### Simple explanation

A domain name is a human-readable name for a website or service.

### Formal term

Domain name.

### Example:

- tasktracker.example

- google.com

- api.mycompany.com

### Practical use

Domain names make systems easier to use and easier to operate.

Instead of telling users:

\`Visit 198.51.100.24\`

you tell them:

\`Visit tasktracker.example\`

Domain names also give flexibility.

If your server IP changes, users can still use the same domain name.

You only update DNS.

## 7. What Is DNS?

### Simple explanation

DNS is like a phonebook for the internet.

It converts domain names into IP addresses.

### Formal term

Domain Name System, or DNS.

### Example:

\`tasktracker.example → 198.51.100.24\`

### Practical use

Before a browser can connect to a server, it usually needs to know the server’s IP address.

DNS provides that mapping.

## How DNS Works Conceptually

Suppose your browser wants to visit:

The browser may not know the IP address of \`tasktracker.example\`.

So it asks a DNS resolver.

A DNS resolver is a service that helps find DNS records.

Conceptual flow:

- Browser

- |

- v

- DNS Resolver

- |

- v

- DNS System

- |

- v

- Returns IP address

- |

- v

- Browser connects to IP address

A simplified DNS lookup:

- 1. Browser asks: "What is the IP address of tasktracker.example?"

- 2. Resolver checks its cache.

- 3. If not cached, resolver asks DNS servers.

- 4. DNS system returns an IP address.

- 5. Resolver returns the IP address to the browser.

- 6. Browser connects to that IP address.

DNS can also return multiple IP addresses.

For example:

- tasktracker.example → 198.51.100.24

- tasktracker.example → 198.51.100.25

This can be used for:

- redundancy,

- load distribution,

- geographic routing.

You do not need to master DNS internals yet.

For system design, remember:

DNS translates human-friendly names into machine-friendly addresses.

## Important DNS Record Types

You may hear these terms:

| Record Type | Simple Meaning |
| --- | --- |
| A record | Maps a domain name to an IPv4 address |
| AAAA record | Maps a domain name to an IPv6 address |
| CNAME record | Maps one domain name to another domain name |
| TXT record | Stores arbitrary text, often used for verification or policies |
| MX record | Mail exchange record, used for email routing |

For backend web systems, the most common ones are:

- A,

- AAAA,

- CNAME.

Example:

- A    tasktracker.example    198.51.100.24

- CNAME api.tasktracker.example  tasktracker.example

This means:

\`api.tasktracker.example points to tasktracker.example\`

## DNS Caching

DNS results are often cached.

Caching makes repeated lookups faster.

But caching can also cause delays when DNS records change.

For example, if you move your service to a new IP address, some clients may still use the old IP until their DNS cache expires.

This is important in system design because:

DNS changes are not instantly visible everywhere.

## 8. What Is a URL?

### Simple explanation

A URL is an address that points to a resource on the web.

### Formal term

Uniform Resource Locator, or URL.

### Example:

### Practical use

A URL tells the client:

- what protocol to use,

- which host to contact,

- which port to use, if not default,

- which path to request,

- what query parameters to send,

- and optionally which fragment to focus on.

## Parts of a URL

Consider this URL:

Breakdown:

| Part | Value | Meaning |
| --- | --- | --- |
| Scheme | https | Use HTTPS protocol |
| Host | tasktracker.example | Domain name of the server |
| Port | 8443 | Specific service endpoint on the server |
| Path | /tasks | Resource being requested |
| Query | status=open&page=2 | Extra parameters |
| Fragment | today | Client-side section identifier |

The fragment is usually not sent to the server.

It is used by the browser.

For example:

The browser may scroll to the section with ID \`installation\`.

## Default Ports

If the port is not specified, default ports are used.

For HTTP:

means port 80.

For HTTPS:

means port 443.

So these are equivalent:

and:

## 9. What Is a Port?

### Simple explanation

A port is like a door number on a computer.

A computer can run many services at the same time.

Ports help separate them.

### Formal term

Port.

### Example:

- IP address: 198.51.100.24

- Port: 443

Together:

\`198.51.100.24:443\`

This identifies a specific service on that machine.

### Practical use

Common ports:

| Port | Common Use |
| --- | --- |
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8080 | Common development HTTP server |

Important beginner distinction:

An IP address identifies a machine.

A port identifies a service on that machine.

Example:

- 198.51.100.24:80

- 198.51.100.24:443

- 198.51.100.24:22

These are three different services on the same machine.

## 10. What Is TCP?

### Simple explanation

TCP is a protocol that helps two computers exchange data reliably over a network.

### Formal term

Transmission Control Protocol, or TCP.

### Example

When your browser connects to a web server over HTTPS, it usually creates a TCP connection first.

### Practical use

The internet sends data in small chunks called packets.

Packets can be:

- lost,

- delayed,

- duplicated,

- or received out of order.

TCP helps solve these problems by providing:

- ordered delivery,

- error detection,

- retransmission of lost data,

- flow control,

- connection management.

A simple analogy:

IP is like writing an address on an envelope.

TCP is like a postal service that ensures pages arrive in order and missing pages are resent.

## TCP Connection Conceptually

Before HTTP data is exchanged, TCP usually establishes a connection.

Simplified idea:

- Client: "Can we talk?"

- Server: "Yes."

- Client: "Okay, starting now."

This is often called a three-way handshake, but you do not need to memorize the exact packet names.

What matters is:

TCP creates a reliable stream between two endpoints.

Once the TCP connection exists, HTTP messages can be sent over it.

## TCP Timeouts

TCP connections can fail or stall.

For example:

- the server may be down,

- a firewall may block the connection,

- the network may drop packets,

- the server may be overloaded.

If no response arrives, the client or server may eventually time out.

Timeouts are extremely important in system design.

A request that waits forever is worse than a request that fails clearly.

Later, you will learn how to design with:

- timeouts,

- retries,

- circuit breakers,

- backpressure,

- graceful degradation.

For now, understand:

Network calls are not instantaneous and not guaranteed.

## 11. What Is HTTP?

### Simple explanation

HTTP is the standard language used by clients and servers to exchange requests and responses on the web.

### Formal term

HyperText Transfer Protocol, or HTTP.

### Example

A browser may send:

- GET /tasks HTTP/1.1

- Host: tasktracker.example

The server may respond:

\`\`\`text
HTTP/1.1 200 OK
Content-Type: application/json

{"tasks": []}


\`\`\`
### Practical use

HTTP defines:

- request methods,

- request headers,

- request bodies,

- response status codes,

- response headers,

- response bodies.

HTTP is a request-response protocol.

That means:

The client sends a request.

The server sends a response.

Usually, the server does not spontaneously send data unless using special mechanisms such as WebSockets or server-sent events.

Those are advanced topics.

For standard backend design, start with request-response thinking.

## HTTP Methods

HTTP methods describe the desired action.

Common methods:

| Method | Simple Meaning |
| --- | --- |
| GET | Read data |
| POST | Create data or submit data |
| PUT | Replace data |
| PATCH | Update part of data |
| DELETE | Remove data |

Examples:

- GET /tasks

- POST /tasks

- PUT /tasks/123

- PATCH /tasks/123

- DELETE /tasks/123

For now, just understand that the method is part of the request.

You will study APIs more deeply later.

## HTTP Headers

Headers are extra metadata sent with a request or response.

Examples of request headers:

- Host: tasktracker.example

- Authorization: Bearer abc123

- Accept: application/json

- User-Agent: Mozilla/5.0

Examples of response headers:

- Content-Type: application/json

- Content-Length: 128

- Cache-Control: no-store

- Set-Cookie: session=xyz; Secure; HttpOnly

Headers can carry:

- authentication information,

- content type,

- caching instructions,

- cookies,

- request identifiers,

- CORS information,

- compression information.

In system design, headers often matter for:

- security,

- caching,

- observability,

- API versioning,

- load balancing,

- tracing.

## HTTP Body

The body is the main payload of a request or response.

For example, a POST request may have a JSON body:

\`\`\`text
{
  "title": "Study system design",
  "priority": "high"
}

\`\`\`

A response may have a JSON body:

\`\`\`text
{
  "task_id": 123,
  "status": "created"
}

\`\`\`

Not every request has a body.

For example, a simple GET request often has no body.

## HTTP Status Codes

Status codes tell the client what happened.

They are grouped by first digit.

| Range | General Meaning |
| --- | --- |
| 1xx | Informational |
| 2xx | Success |
| 3xx | Redirection |
| 4xx | Client error |
| 5xx | Server error |

Common status codes:

| Code | Meaning |
| --- | --- |
| 200 OK | Request succeeded |
| 201 Created | Resource created |
| 204 No Content | Success, but no response body |
| 301 Moved Permanently | Resource permanently moved |
| 302 Found | Temporary redirect |
| 400 Bad Request | Invalid request |
| 401 Unauthorized | Authentication required or failed |
| 403 Forbidden | Authenticated but not allowed |
| 404 Not Found | Resource not found |
| 409 Conflict | Conflict with current state |
| 429 Too Many Requests | Rate limited |
| 500 Internal Server Error | Server failed unexpectedly |
| 502 Bad Gateway | Upstream server invalid response |
| 503 Service Unavailable | Server temporarily unable to handle request |
| 504 Gateway Timeout | Upstream server timed out |

Beginners often confuse these.

Important distinctions:

- 401 means “who are you?” or “login failed.”

- 403 means “I know who you are, but you are not allowed.”

- 404 means “that thing does not exist or is not visible.”

- 500 means “the server had a problem.”

- 503 often means “temporarily overloaded or under maintenance.”

Status codes are part of the contract between client and server.

Good status codes make systems easier to debug and operate.

## 12. What Is HTTPS?

### Simple explanation

HTTPS is HTTP secured with encryption.

### Formal term

HyperText Transfer Protocol Secure, or HTTPS.

HTTPS is HTTP running inside TLS.

### Simple formula:

\`HTTPS = HTTP + TLS\`

### Practical use

HTTPS protects data in transit.

It provides:

- Confidentiality

Eavesdroppers cannot easily read the data.

- Integrity

Attackers cannot easily modify the data without detection.

- Authentication

The client can verify it is talking to the intended server.

## Why HTTP Alone Is Dangerous

Suppose a user sends this over plain HTTP:

\`password: secret123\`

Anyone who can intercept the network traffic may see:

\`secret123\`

This is unacceptable for real systems.

HTTPS encrypts the communication so that passive observers cannot easily read the contents.

## What Is TLS?

### Simple explanation

TLS is a protocol that encrypts communication between two endpoints.

### Formal term

Transport Layer Security, or TLS.

Older name: SSL.

You may hear both, but TLS is the modern term.

### Practical use

TLS is used for:

- HTTPS websites,

- secure API calls,

- encrypted database connections,

- secure service-to-service communication,

- email security,

- and many other network protocols.

## TLS Certificates

For HTTPS, the server presents a certificate.

A certificate helps prove:

This public key belongs to this domain.

Certificates are issued by Certificate Authorities, or CAs.

Conceptually:

- Certificate Authority says:

- "I verify that this certificate belongs to tasktracker.example."

Browsers trust many well-known CAs.

If the certificate is invalid, expired, mismatched, or untrusted, the browser shows a warning.

Common TLS errors:

- certificate expired,

- certificate name mismatch,

- self-signed certificate not trusted,

- incomplete certificate chain,

- system clock wrong.

For system design, the important point is:

HTTPS requires correct certificate management.

## TLS Handshake Conceptually

Before encrypted HTTP data is sent, the client and server perform a TLS handshake.

Simplified:

- Client: Hello, here are my supported encryption options.

- Server: Hello, here is my certificate and chosen option.

- Client: I verify your certificate and generate a shared secret.

- Server: Okay.

- Both: Now we can encrypt HTTP traffic.

You do not need to memorize the cryptographic details.

What matters:

- TLS adds setup time,

- TLS provides security,

- certificate mistakes cause failures,

- HTTPS is usually worth the overhead.

## 13. What Is JSON?

### Simple explanation

JSON is a common text format for exchanging structured data.

### Formal term

JavaScript Object Notation, or JSON.

### Example:

\`\`\`text
{
  "task_id": 123,
  "title": "Study system design",
  "status": "open",
  "tags": ["learning", "backend"]
}


\`\`\`
### Practical use

Many web APIs use JSON because:

- it is readable,

- it supports nested data,

- it is widely supported,

- it works well with HTTP.

Other formats exist, such as XML, Protocol Buffers, MessagePack, and CSV.

The best format depends on the system.

For beginner web backend design, JSON is the most common starting point.

# Important Terminology

| Term | Plain Explanation |
| --- | --- |
| Network | Connected computers that can communicate |
| Internet | Global network of networks |
| Client | The side that sends a request |
| Server | The side that receives and responds to requests |
| IP address | Numeric address of a device on a network |
| Domain name | Human-readable name for a service |
| DNS | System that maps domain names to IP addresses |
| URL | Address of a resource on the web |
| Port | Service endpoint on a machine |
| TCP | Reliable transport protocol |
| HTTP | Request-response protocol for web communication |
| HTTPS | HTTP secured using TLS |
| TLS | Encryption and authentication protocol |
| Request | Message asking the server to do something |
| Response | Answer returned by the server |
| Header | Metadata attached to a request or response |
| Body | Main data payload of a request or response |
| Status code | Numeric result of a request |
| JSON | Common structured data format |
| localhost | Special address referring to your own machine |
| Packet | Small unit of data sent over a network |
| Latency | Delay before data arrives or response completes |
| Bandwidth | Amount of data that can be transferred per time |

# Mental Model

A useful mental model is layered communication.

Conceptually:

\`\`\`text
User intention
    ↓
Browser or mobile app creates an HTTP request
    ↓
HTTPS/TLS secures the message
    ↓
TCP provides reliable delivery
    ↓
IP routes packets across networks
    ↓
Server receives the request
    ↓
Application logic processes it
    ↓
Database or other data store is accessed
    ↓
Response travels back through the layers
    ↓
Client displays result

\`\`\`

A simpler stack:

\`\`\`text
HTTP / HTTPS
    ↓
TCP
    ↓
IP
    ↓
Network hardware

\`\`\`

You do not need to implement these layers.

But when debugging, it helps to know which layer may be failing.

Example:

| Symptom | Likely Layer |
| --- | --- |
| Cannot resolve domain | DNS |
| Connection refused | TCP/port/firewall/server |
| SSL certificate warning | TLS |
| 404 Not Found | HTTP/application routing |
| 500 Internal Server Error | Application/server |
| Slow database response | Backend/data layer |
| App crashes before request | Client |

# Architecture Diagram

Let us start with the simplest real web architecture.

## Local Development Architecture

- [Browser]

- |

- |

- v

- [Server Running on Same Computer]

- |

- v

- [Database]

This is common during development.

The browser and server run on the same machine.

\`localhost\` means “this computer.”

Port \`8080\` identifies the server process.

No public internet is required.

## Internet-Facing Architecture

- [User Browser]

- |

- | 1. DNS lookup

- v

- [DNS System]

- |

- | returns IP address

- v

- [User Browser]

- |

- | 2. HTTPS request

- v

- [Server at IP:443]

- |

- | 3. Query

- v

- [Database]

This is closer to production.

The browser first resolves the domain name, then connects to the server’s IP address over HTTPS.

## More Realistic Request Path

- [Client]

- |

- | HTTPS request

- v

- [Network / Internet]

- |

- v

- [Firewall / Security Group]

- |

- v

- [Web Server / API Server]

- |

- +--> [Authentication]

- |

- +--> [Business Logic]

- |

- +--> [Database]

- |

- +--> [Cache]

- |

- v

- [HTTP Response]

You do not need to understand every component yet.

The important idea is:

A request passes through multiple stages, and each stage can add delay, security checks, or failure modes.

# Step-by-Step Request Flow

Let us trace a concrete request.

Suppose a user visits:

## Step 1: User Action

The user opens the browser and enters the URL.

Or the user clicks a link.

Or the mobile app requests the task list.

## Step 2: Browser Parses the URL

The browser extracts:

- Scheme: https

- Host: tasktracker.example

- Path: /tasks

- Query: status=open

- Port: default 443

## Step 3: Browser Checks DNS Cache

The browser may already know the IP address.

If not, it asks the operating system or a DNS resolver.

## Step 4: DNS Lookup

The DNS system returns an IP address:

\`tasktracker.example → 198.51.100.24\`

If DNS fails, the browser cannot connect.

Typical error:

- Server not found

- DNS probe failed

## Step 5: Browser Opens a TCP Connection

The browser connects to:

\`198.51.100.24:443\`

TCP establishes a reliable connection.

If the server is down or firewall blocks the port, this may fail.

Typical errors:

- Connection refused

- Connection timed out

- Network unreachable

## Step 6: TLS Handshake

Because the scheme is HTTPS, the browser and server perform a TLS handshake.

The server presents its certificate.

The browser verifies:

- the certificate is valid,

- it belongs to tasktracker.example,

- it is not expired,

- it is issued by a trusted authority,

- the connection parameters are secure.

If TLS fails, the browser shows a security warning.

Typical errors:

- SSL certificate has expired

- Hostname mismatch

- Unable to establish secure connection

## Step 7: Browser Sends HTTP Request

Now encrypted HTTP traffic can be sent.

Conceptual request:

- GET /tasks?status=open HTTP/1.1

- Host: tasktracker.example

- Authorization: Bearer eyJhbGciOi...

- Accept: application/json

- User-Agent: Mozilla/5.0

The request says:

Give me the open tasks for the authenticated user.

## Step 8: Server Receives the Request

The server accepts the connection and reads the HTTP request.

It may:

- decode the path,

- parse query parameters,

- inspect headers,

- check authentication,

- enforce rate limits,

- create a request ID for logging.

## Step 9: Server Applies Business Logic

The server determines what to do.

For this request, it may:

- identify the user from the authentication token,

- check that the user is allowed to view tasks,

- decide which tasks to return,

- apply filters such as status=open,

- prepare pagination,

- choose whether to read from cache or database.

## Step 10: Server Accesses Data

The server may query the database.

Conceptual SQL:

\`\`\`text
SELECT task_id, title, status, created_at
FROM tasks
WHERE user_id = 42
  AND status = 'open'
ORDER BY created_at DESC
LIMIT 50;

\`\`\`

The database returns rows.

The server converts them into a response format, often JSON.

## Step 11: Server Sends HTTP Response

Conceptual response:

\`\`\`text
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: private, max-age=0

{
  "tasks": [
    {
      "task_id": 101,
      "title": "Buy milk",
      "status": "open"
    },
    {
      "task_id": 102,
      "title": "Study system design",
      "status": "open"
    }
  ]
}

\`\`\`

## Step 12: Browser Receives Response

The browser:

- checks the status code,

- parses headers,

- reads the body,

- hands data to the web application,

- renders the task list.

## Step 13: Connection May Be Reused

Modern HTTP often reuses connections for multiple requests.

This avoids repeating TCP and TLS setup for every asset or API call.

This is an optimization, but it also means connection management becomes part of system behavior.

# Failure Cases in the Request Flow

Let us examine what can fail at each step.

## DNS Failure

Symptom:

- Site cannot be reached

- Server not found

Possible causes:

- domain typo,

- DNS record missing,

- DNS resolver outage,

- stale DNS cache,

- network DNS blocked.

System design lesson:

DNS is a dependency. If DNS fails, users may not reach your system even if your servers are healthy.

## TCP Connection Failure

Symptom:

- Connection refused

- Connection timed out

Possible causes:

- server down,

- wrong port,

- firewall blocking,

- security group misconfigured,

- server overloaded,

- network route failure.

System design lesson:

A server must be reachable on the expected port and able to accept new connections.

## TLS Failure

Symptom:

- Certificate warning

- Secure connection failed

Possible causes:

- expired certificate,

- wrong domain in certificate,

- missing intermediate certificate,

- incorrect system clock,

- unsupported cipher suite.

System design lesson:

HTTPS requires certificate lifecycle management.

## HTTP 4xx Client Errors

Examples:

- 400 Bad Request

- 401 Unauthorized

- 403 Forbidden

- 404 Not Found

Possible causes:

- malformed request,

- missing authentication,

- insufficient permissions,

- wrong URL path,

- invalid parameter.

System design lesson:

Clear client errors help users and developers understand what went wrong.

## HTTP 5xx Server Errors

Examples:

- 500 Internal Server Error

- 502 Bad Gateway

- 503 Service Unavailable

- 504 Gateway Timeout

Possible causes:

- application bug,

- database failure,

- dependency timeout,

- server overload,

- deployment issue,

- upstream service unavailable.

System design lesson:

Server errors should be monitored, logged, and handled gracefully.

## Slow Response

Symptom:

\`Page takes many seconds to load\`

Possible causes:

- slow DNS,

- slow network,

- slow TLS handshake,

- slow server code,

- slow database query,

- large response body,

- too many requests,

- client-side rendering bottleneck.

System design lesson:

Latency has many sources. Measure each stage.

# Simple Example: Localhost Server

During development, you may run:

This bypasses public DNS and internet routing.

Flow:

- Browser

- |

- v

- Operating system loopback interface

- |

- v

- Server listening on port 8080

- |

- v

- Database

Why is this useful?

It lets you test backend behavior without deploying publicly.

But it hides some production issues:

- DNS,

- TLS certificates,

- firewalls,

- load balancers,

- multi-server state,

- real network latency,

- cloud networking.

So local success does not guarantee production success.

# Practical Example: Mobile App Login

Now consider a mobile app logging in.

The app sends:

\`\`\`text
POST /v1/sessions HTTP/1.1
Host: api.tasktracker.example
Content-Type: application/json

{
  "email": "",
  "password": "secret123"
}

\`\`\`

The server may respond:

\`\`\`text
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJhbGciOi...",
  "expires_in": 3600
}

\`\`\`

Then the app uses the token for future requests:

- GET /v1/tasks HTTP/1.1

- Host: api.tasktracker.example

- Authorization: Bearer eyJhbGciOi...

If the password is wrong:

\`\`\`text
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "invalid_credentials"
}

\`\`\`

Important design points:

- The password should be sent only over HTTPS.

- The server should hash passwords, not store plain text.

- The response should not reveal whether the email exists, if that matters for security.

- Tokens should expire.

- Login attempts should be rate limited.

- All login events should be logged carefully, without logging passwords.

This example shows how web mechanics connect directly to security and API design.

# Practical Example: Browser Loading a Web Page

When a browser loads an HTML page, it may make many requests.

Example:

The server returns HTML:

- <html>

- <head>

- <link rel="stylesheet" href="/styles.css">

- </head>

- <body>

- <div id="app"></div>

- <script src="/app.js"></script>

- </body>

- </html>

The browser then requests:

- /styles.css

- /app.js

The JavaScript may then request API data:

So one user action can create many network requests.

This matters for system design because:

- static assets can be cached,

- API requests may be dynamic,

- too many requests can overload the server,

- DNS and TLS setup may happen multiple times,

- connection reuse can improve performance,

- CDNs can serve static files closer to users.

You do not need to master CDNs yet.

But understand:

A “page load” is often many requests, not one.

# Scaling Example

At small scale, the architecture may be:

\`[Browser] → [Server] → [Database]\`

At larger scale, the request path becomes longer.

Example:

- [Clients]

- |

- v

- [DNS]

- |

- v

- [Load Balancer]

- |

- +--> [Server 1]

- |

- +--> [Server 2]

- |

- +--> [Server 3]

- |

- v

- [Database]

Why do these components appear?

Because the simple system hits limits.

## Limit 1: One server cannot handle all traffic

Solution: use multiple servers.

But then clients need to know which server to contact.

A load balancer can distribute requests.

## Limit 2: One server failure takes down the system

Solution: redundancy.

If one server fails, others can continue serving requests.

## Limit 3: Users are geographically far from the server

Solution: edge caching, CDNs, regional deployments.

These reduce latency by serving content closer to users.

## Limit 4: Database becomes a bottleneck

Solution: caching, read replicas, partitioning, query optimization.

You will study these later.

For now, the key lesson is:

Scaling changes the request path. Components are added to solve specific bottlenecks or failure modes.

# Failure Scenario

Let us practice failure thinking.

Consider this architecture:

\`[Browser] → [Server] → [Database]\`

Ask:

What can fail?

## Failure 1: Browser Cannot Reach Server

Possible causes:

- user offline,

- DNS failure,

- firewall block,

- server IP wrong,

- server down.

Effect:

- no response.

Mitigation:

- clear error message,

- retry logic,

- health checks,

- monitoring from multiple locations.

## Failure 2: Server Is Running but Overloaded

Symptoms:

- slow responses,

- timeouts,

- 503 errors.

Causes:

- too many requests,

- expensive queries,

- thread pool exhaustion,

- memory pressure,

- CPU saturation.

Mitigation:

- autoscaling,

- rate limiting,

- caching,

- async processing,

- load shedding,

- better queries.

## Failure 3: Database Is Down

Effect:

- server cannot read or write data.

Possible server behavior:

- return 500,

- return 503,

- serve stale cached data if safe,

- disable write features but allow reads from cache.

Mitigation:

- database replication,

- failover,

- backups,

- circuit breakers,

- graceful degradation.

## Failure 4: Network Between Server and Database Fails

This is subtle.

The server may be alive.

The database may be alive.

But they cannot talk.

Effect:

- partial failure.

Mitigation:

- timeouts,

- retries where safe,

- health checks,

- observability,

- failover.

This is one of the most important lessons in distributed systems:

Just because a component is running does not mean it is reachable.

## Failure 5: Response Is Sent but Lost

The server may save data successfully, but the response never reaches the client.

The client may retry.

Now the system must avoid duplicate side effects.

This introduces the need for:

- idempotency,

- unique request IDs,

- deduplication,

- careful retry design.

You will study this later.

For now, remember:

A failed request does not always mean the operation did not happen.

# Trade-Offs

Every design choice has trade-offs.

Here are some relevant to web communication.

## Trade-Off 1: HTTP vs HTTPS

### HTTP

Advantages:

- simpler,

- no certificate management,

- slightly less handshake overhead.

Disadvantages:

- unencrypted,

- insecure,

- unsuitable for login, payments, personal data,

- often blocked or warned against by browsers.

### HTTPS

Advantages:

- encryption,

- integrity,

- authentication,

- required for modern web security.

Disadvantages:

- certificate management,

- TLS handshake overhead,

- more operational complexity.

Recommendation:

Use HTTPS almost always.

Plain HTTP is mostly acceptable only for local development or very special internal cases.

## Trade-Off 2: Domain Name vs Direct IP Address

### Domain name

Advantages:

- human-friendly,

- flexible,

- supports DNS changes,

- supports multiple IPs,

- enables TLS certificates more naturally.

Disadvantages:

- depends on DNS,

- requires DNS management.

### Direct IP

Advantages:

- avoids DNS lookup.

Disadvantages:

- hard to remember,

- inflexible,

- bad for TLS,

- difficult to migrate,

- exposes infrastructure details.

Recommendation:

Use domain names for production services.

Hardcoding IP addresses is usually a bad idea.

## Trade-Off 3: TCP vs UDP

This is conceptual, not a deep networking lesson.

### TCP

Advantages:

- reliable,

- ordered,

- widely used for HTTP.

Disadvantages:

- connection setup overhead,

- head-of-line blocking in some cases,

- can be slower for real-time traffic.

### UDP

Advantages:

- lower overhead,

- faster for some real-time use cases.

Disadvantages:

- unreliable,

- unordered,

- application must handle loss and ordering if needed.

Examples:

- web pages, APIs, databases: usually TCP.

- live video, VoIP, games: sometimes UDP.

- DNS queries: often UDP, though TCP can be used.

For beginner backend system design, most web APIs use TCP/HTTP/HTTPS.

## Trade-Off 4: Connection Reuse vs New Connection Per Request

### New connection per request

Advantages:

- simpler mental model.

Disadvantages:

- repeated TCP/TLS setup,

- higher latency,

- more resource usage.

### Connection reuse

Advantages:

- faster,

- lower overhead.

Disadvantages:

- more complex connection management,

- idle connections consume resources.

Modern systems often reuse connections.

## Trade-Off 5: Caching DNS vs Fresh DNS

### Caching

Advantages:

- faster lookups,

- less DNS load.

Disadvantages:

- stale records after changes.

### No caching

Advantages:

- always fresh.

Disadvantages:

- slower,

- more DNS traffic,

- more DNS failure exposure.

Recommendation:

Use caching with reasonable TTL values.

TTL means time to live.

It tells clients how long they may cache a DNS record.

# Common Beginner Mistakes

## Mistake 1: Thinking the Internet Is Magic

Beginners often say:

The request goes to the server.

But they cannot explain:

- how the server is found,

- how the connection is made,

- how data is secured,

- where failures happen.

You should be able to trace the path at a high level.

## Mistake 2: Confusing Domain Name and Server

A domain name is not a server.

It is a label.

DNS maps that label to one or more IP addresses.

The IP address points to a machine or network endpoint.

The server software runs on that endpoint.

## Mistake 3: Thinking HTTP Is Secure Because It Works

HTTP sends data in plain text.

If you need confidentiality or integrity, use HTTPS.

## Mistake 4: Ignoring Ports

A service may be running but unreachable because:

- wrong port,

- firewall,

- security group,

- bound to localhost instead of all interfaces.

Example:

A server listening only on:

\`127.0.0.1:8080\`

may not be reachable from another machine.

It may need to listen on:

\`0.0.0.0:8080\`

depending on the environment.

## Mistake 5: Assuming Localhost Behavior Matches Production

Localhost avoids many production concerns:

- DNS,

- TLS,

- firewalls,

- load balancers,

- multiple servers,

- cloud networking,

- real latency.

Always test in an environment close to production.

## Mistake 6: Thinking 404 Means the Server Is Down

A 404 means the server responded, but the requested resource was not found.

If the server were down, you would usually see:

- connection refused,

- timeout,

- DNS error,

- 502/503/504 from a proxy.

## Mistake 7: Confusing Latency and Bandwidth

Latency is delay.

Bandwidth is capacity.

A connection can have:

- high bandwidth but high latency,

- low bandwidth but low latency,

- both good,

- both bad.

Example:

- Satellite link may have high bandwidth but high latency.

- A congested local network may have low latency but very little available bandwidth.

System design must consider both.

## Mistake 8: Forgetting That Clients Can Be Malicious

Browsers and mobile apps can be modified.

Attackers can:

- replay requests,

- change parameters,

- forge headers,

- scan endpoints,

- overload the system.

The server must validate and authorize everything.

## Mistake 9: Thinking HTTPS Encrypts Everything Forever

HTTPS protects data in transit between client and server.

It does not automatically protect:

- data stored on the server,

- data in database backups,

- data accessed by malicious insiders,

- data on the user’s compromised device,

- data logged incorrectly.

Security is broader than transport encryption.

## Mistake 10: Ignoring Timeouts

A request without a timeout can hang.

That can consume:

- server threads,

- database connections,

- memory,

- user patience.

Production systems need explicit timeouts.

# Deep Dive

Now we go slightly deeper, but still beginner-friendly.

## Deep Dive 1: URL Anatomy in More Detail

Example:

Parts:

| Component | Value |
| --- | --- |
| Scheme | https |
| User info | alice:secret |
| Host | tasktracker.example |
| Port | 8443 |
| Path | /projects/42/tasks |
| Query | status=open&page=2 |
| Fragment | today |

User info in URLs is rarely used in modern APIs and is generally discouraged for sensitive credentials.

Do not put passwords in URLs.

Reasons:

- URLs may be logged,

- URLs may appear in browser history,

- URLs may be leaked via referrer headers,

- query strings are often cached.

Use request bodies and headers for sensitive data.

## Deep Dive 2: Query Parameters vs Path Parameters

Path parameter:

\`/tasks/123\`

Meaning:

Get task with ID 123.

Query parameter:

\`/tasks?status=open&page=2\`

Meaning:

Get tasks, filtered by status and paginated.

General guideline:

- Use path parameters for identifying a specific resource.

- Use query parameters for filtering, sorting, pagination, and optional options.

Examples:

- GET /users/42

- GET /users?active=true&sort=created_at

- GET /tasks/123/comments?page=2

This is introductory. You will study API design more formally later.

## Deep Dive 3: HTTP Request Example

A more complete GET request:

- GET /tasks?status=open HTTP/1.1

- Host: tasktracker.example

- Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

- Accept: application/json

- User-Agent: TaskTrackerMobile/2.1

- X-Request-ID: 7f9c2d6a-3b5e-4a91-9f2c-123456789abc

- Connection: keep-alive

Important headers:

| Header | Purpose |
| --- | --- |
| Host | Tells the server which domain is being requested |
| Authorization | Carries authentication credentials |
| Accept | Tells server what response format client prefers |
| User-Agent | Identifies client software |
| X-Request-ID | Custom header often used for tracing |
| Connection | Controls connection reuse |

The \`Host\` header is especially important because many servers host multiple domains on the same IP address.

## Deep Dive 4: HTTP Response Example

\`\`\`text
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 256
Cache-Control: private, no-store
X-Request-ID: 7f9c2d6a-3b5e-4a91-9f2c-123456789abc
Date: Mon, 05 Oct 2026 10:30:00 GMT

{
  "tasks": [
    {"task_id": 101, "title": "Buy milk"},
    {"task_id": 102, "title": "Study system design"}
  ],
  "next_page": null
}

\`\`\`

Important response headers:

| Header | Purpose |
| --- | --- |
| Content-Type | Format of response body |
| Content-Length | Size of body |
| Cache-Control | Caching instructions |
| Set-Cookie | Instructs browser to store cookie |
| X-Request-ID | Helps correlate logs and traces |

## Deep Dive 5: Cookies vs Authorization Headers

Browsers often use cookies for session authentication.

Example response:

\`Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Lax\`

Mobile apps and many APIs often use headers:

\`Authorization: Bearer token123\`

Conceptual differences:

| Mechanism | Common Use | Notes |
| --- | --- | --- |
| Cookie | Browser sessions | Automatically sent by browser for matching domain |
| Authorization header | APIs, mobile apps | Explicitly set by client |
| JWT | Token-based auth | Often sent in Authorization header or cookie |

You do not need to master authentication yet.

But understand:

The backend must know who the user is and what they are allowed to do.

## Deep Dive 6: TCP Three-Way Handshake Conceptually

Simplified:

\`\`\`text
Client → Server: SYN
Server → Client: SYN-ACK
Client → Server: ACK

\`\`\`

You do not need to memorize the abbreviations.

The point is:

- TCP establishes state before data transfer.

- This setup takes time.

- If many new connections are created, the server may spend resources managing them.

- Connection reuse reduces overhead.

In system design, connection behavior affects:

- latency,

- throughput,

- resource usage,

- load balancer configuration,

- database connection pooling,

- timeout tuning.

## Deep Dive 7: TLS Certificate Chain

A server certificate may not be directly trusted by the browser.

Instead, it may be signed by an intermediate certificate authority, which is signed by a root certificate authority.

Conceptual chain:

- Root CA

- |

- v

- Intermediate CA

- |

- v

- Server Certificate for tasktracker.example

The browser verifies the chain.

If the server sends an incomplete chain, TLS may fail even if the certificate itself is valid.

Operational lesson:

Certificate deployment is not just about the certificate file. It also about the chain and private key.

## Deep Dive 8: Why HTTPS Has Overhead

HTTPS adds:

- DNS lookup,

- TCP handshake,

- TLS handshake,

- encryption/decryption,

- certificate verification.

This increases latency, especially for first connection.

However, the security benefits are usually worth it.

Optimizations include:

- HTTP/2 or HTTP/3,

- connection reuse,

- session resumption,

- OCSP stapling,

- TLS 1.3,

- edge caching,

- keep-alive.

You do not need to understand all of these now.

The key idea:

Security has cost, but modern systems usually accept that cost.

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

Why does a browser need DNS before connecting to a web server?

Answer direction:

Because the browser needs an IP address to route network packets. Domain names are human-friendly, but networks route using IP addresses.

## Predict

Question:

If a user sees:

\`DNS probe failed\`

is the web server definitely down?

Answer direction:

No.

The server may be healthy, but DNS resolution failed.

Possible causes:

- bad DNS record,

- resolver issue,

- local network DNS block,

- typo in domain name.

## Find the Failure

Question:

A user sees:

\`Your connection is not private\`

What layer is likely failing?

Answer direction:

TLS.

Possible causes:

- expired certificate,

- hostname mismatch,

- untrusted certificate authority,

- captive portal,

- wrong system clock.

## Find the Bottleneck

Question:

A page load has these timings:

- DNS: 10 ms

- TCP connect: 20 ms

- TLS handshake: 40 ms

- Waiting for server response: 2,500 ms

- Download response: 50 ms

- Browser rendering: 100 ms

Where is the main bottleneck?

Answer direction:

Waiting for server response: 2,500 ms.

This suggests the backend is slow, possibly due to:

- database query,

- external API call,

- inefficient code,

- lock contention,

- resource saturation.

## Compare

Question:

Which is better for production?

Architecture A:

\`Mobile app hardcoded to connect to 198.51.100.24:443\`

Architecture B:

\`Mobile app connects to api.tasktracker.example over HTTPS\`

Answer direction:

Architecture B is better.

It allows:

- IP changes,

- load balancing,

- TLS certificates,

- DNS-based failover,

- easier operations.

Hardcoding IPs is fragile.

# Architecture Exercise

## Weak Design

A beginner builds an internal API and tells clients:

\`Connect to 10.0.1.15:8080\`

There is no domain name.

There is no HTTPS.

The server runs on one machine.

The database runs on the same machine.

There is no monitoring.

## Your Task

Identify the problems.

Ask:

- What happens if the IP changes?

- What happens if the machine fails?

- What happens if traffic grows?

- What happens if someone intercepts traffic?

- What happens if the server crashes silently?

- What happens if clients need to know whether the service is healthy?

## Hint 1

Think about addressing.

Hardcoded IPs are brittle.

## Hint 2

Think about security.

Internal traffic may still need encryption.

## Hint 3

Think about failure detection.

If no monitoring exists, you may learn about failure from users.

## Improved Design Direction

A better starting design:

- Clients

- |

- | HTTPS

- v

- api.internal.example

- |

- v

- DNS / service discovery

- |

- v

- Load Balancer or reverse proxy

- |

- +--> App Server 1

- +--> App Server 2

- |

- v

- Database

- |

- v

- Backups / replication

Add:

- TLS certificates,

- health checks,

- logs,

- metrics,

- alerts,

- database backups,

- configuration management.

This is more complex, but it removes several single points of failure and operational blind spots.

For a tiny internal tool, some of this may be overkill.

The correct answer depends on requirements.

# Design Exercise

## Problem

Design the request flow for a user posting a comment in a blog system.

Requirements:

- User is logged in.

- User submits comment text.

- Comment is saved.

- Other users can later view the comment.

- Use a simple architecture.

Do not worry about massive scale yet.

## Step 1: Clarify

Questions you might ask:

- Is the user authenticated by session cookie or token?

- Can users edit comments?

- Are comments moderated?

- How long is the comment?

- Do we need real-time updates?

For this exercise, assume:

- authenticated user,

- plain text comment,

- no moderation,

- no real-time updates.

## Step 2: Functional Requirements

The system must:

- accept a comment,

- associate it with a user and blog post,

- validate the comment,

- store it,

- return success or error.

## Step 3: Non-Functional Requirements

For this small system:

- comment submission should be reasonably fast,

- comments should persist,

- users should not be able to comment as someone else,

- invalid input should be rejected.

## Step 4: API Design

Possible endpoint:

\`POST /posts/{post_id}/comments\`

Request body:

\`\`\`text
{
  "body": "Great article!"
}

\`\`\`

Response:

\`\`\`text
{
  "comment_id": 77,
  "post_id": 12,
  "user_id": 42,
  "body": "Great article!",
  "created_at": "2026-10-05T10:30:00Z"
}

\`\`\`

## Step 5: Data Model

Comment table:

| Field | Example |
| --- | --- |
| comment_id | 77 |
| post_id | 12 |
| user_id | 42 |
| body | Great article! |
| created_at | 2026-10-05 10:30:00 |

Relationships:

- Post has many Comments

- Comment belongs to Post

- Comment belongs to User

## Step 6: High-Level Architecture

- [Browser]

- |

- | HTTPS POST

- v

- [Blog Server]

- |

- | INSERT

- v

- [Database]

## Step 7: Request Flow

\`\`\`text
User types comment and clicks Submit
   ↓
Browser sends POST /posts/12/comments
   ↓
Blog server receives request
   ↓
Server checks authentication
   ↓
Server validates comment body
   ↓
Server inserts comment into database
   ↓
Database confirms save
   ↓
Server returns 201 Created with comment JSON
   ↓
Browser displays comment

\`\`\`

## Step 8: Failure Cases

| Failure | Result |
| --- | --- |
| User not logged in | 401 Unauthorized |
| Comment empty | 400 Bad Request |
| Post does not exist | 404 Not Found |
| Database down | 500 or 503 |
| Response lost after save | Client may retry; server should handle duplicates carefully |
| Comment too long | 400 or 413 depending on design |

## Final Simple Design

- [Browser]

- |

- v

- [Blog Server]

- |

- +--> Auth check

- |

- +--> Validation

- |

- v

- [Database]

This is appropriate for a small blog.

If traffic grows, you may add:

- caching,

- rate limiting,

- spam detection,

- asynchronous moderation,

- database replicas,

- observability.

But you should not add all of these without a reason.

# Practice Questions

Try answering these without rereading.

## Conceptual Questions

- What is the difference between an IP address and a domain name?

- What does DNS do?

- What is a URL?

- What is a port?

- What is TCP responsible for?

- What is HTTP responsible for?

- What is HTTPS?

- What is TLS?

- What is the difference between a request header and a request body?

- What does status code 404 mean?

- What does status code 500 mean?

- What does status code 503 mean?

- Why is localhost useful?

- Why should clients not talk directly to databases?

- What can fail between a browser and a server?

## Short Answer Direction

Example:

Question: What is DNS?

Acceptable answer:

DNS maps domain names to IP addresses.

Better answer:

DNS is a distributed naming system that translates human-readable domain names into machine-routable IP addresses, allowing clients to locate servers.

# Interview Questions

These are common beginner-to-intermediate questions.

## Question 1

Interviewer: What happens when you type a URL into a browser?

Good answer direction:

You should give a structured answer:

- Browser parses URL.

- Browser performs DNS lookup if needed.

- Browser opens TCP connection to server IP and port.

- If HTTPS, browser performs TLS handshake.

- Browser sends HTTP request.

- Server processes request, possibly accessing database or other services.

- Server sends HTTP response.

- Browser renders response.

- Connection may be reused or closed.

Then mention failure points:

- DNS failure,

- TCP timeout,

- TLS certificate error,

- HTTP error status,

- slow backend,

- client rendering issues.

## Question 2

Interviewer: What is the difference between HTTP and HTTPS?

Good answer direction:

HTTP is plain text and does not encrypt data in transit. HTTPS uses TLS to provide encryption, integrity, and authentication. Modern backend systems should generally use HTTPS.

## Question 3

Interviewer: What is the difference between an IP address and a domain name?

Good answer direction:

An IP address is a numeric network address used for routing. A domain name is a human-readable label mapped to one or more IP addresses through DNS. Domain names provide flexibility and usability.

## Question 4

Interviewer: What is a port?

Good answer direction:

A port identifies a specific service or endpoint on a machine. For example, HTTPS commonly uses port 443, while HTTP commonly uses port 80.

## Question 5

Interviewer: Why do we need TCP if IP already delivers packets?

Good answer direction:

IP provides addressing and routing, but packets can be lost, duplicated, or reordered. TCP provides reliable, ordered, connection-oriented communication on top of IP.

## Question 6

Interviewer: A user says the website is down. How do you begin diagnosing it?

Good answer direction:

Start from the request path:

- Can other users reach it?

- Is it DNS?

- Is the server accepting connections?

- Is TLS working?

- Is the application returning errors?

- Is the database healthy?

- Are logs and metrics showing failures?

- Is it client-specific or widespread?

This shows systematic thinking.

# Self-Check

Ask yourself:

- Can I explain what happens when a user enters a URL?

- Can I explain the difference between DNS, TCP, TLS, and HTTP?

- Can I explain why HTTPS is important?

- Can I read a URL and identify its parts?

- Can I explain what a port is?

- Can I distinguish between client errors and server errors?

- Can I identify possible failure points in a basic web request?

- Can I explain why a backend server is needed instead of direct database access?

- Can I trace a simple POST request from browser to database and back?

If yes, you are ready to build on this foundation.

If not, review:

- DNS,

- URL anatomy,

- HTTP request/response structure,

- HTTPS/TLS,

- and the step-by-step request flow.

# DSA/Backend/Coding Connection

The concepts in this chapter connect directly to programming and backend development.

| Programming Concept | System Design Connection |
| --- | --- |
| Serialization/deserialization | Converting objects to JSON for HTTP bodies |
| State machines | TCP/TLS connection states |
| Queues | Request buffering, backpressure |
| Timeouts | Network and database call limits |
| Retries | Handling transient failures |
| Hashing | Password storage, tokens, cache keys |
| Parsing | URL parsing, header parsing |
| Buffers | Network read/write handling |
| Concurrency | Handling many simultaneous requests |
| Logging | Request IDs, error tracking |
| Data structures | Representing requests, responses, routes |

For example, when your backend receives JSON, it must deserialize it into program objects.

When it sends a response, it serializes objects back into JSON.

When it makes an external API call, it must handle timeouts and retries.

When it accepts many requests, it must manage concurrency and resource limits.

So system design is not separate from coding.

It is coding extended to networks, machines, and failure.`,
    },
    {
      slug: "chapter-3-requirements-and-capacity-thinking",
      title: "Chapter 3 — Requirements and Capacity Thinking",
      summary: "Imagine a product manager says: “Build us a task management app.” That sentence is not enough.",
      difficulty: "beginner",
      estimatedMinutes: 61,
      order: 2,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should be able to:", "distinguish between functional and non-functional requirements,", "identify users and actors in a system,", "estimate traffic from user counts,", "calculate requests per second,", "estimate storage requirements,", "estimate bandwidth requirements,", "understand read-heavy and write-heavy systems,", "understand latency, throughput, scalability, availability, and reliability,", "use peak traffic factors,", "avoid common estimation mistakes,", "make reasonable assumptions and state them clearly,"],
      prerequisites: [],
      whereItFits: "Imagine a product manager says: “Build us a task management app.” That sentence is not enough.",
      keyTakeaways: ["This chapter taught you how to begin system design with requirements and capacity thinking.", "The main idea is:", "Do not start with technology. Start with the problem, users, scale, and constraints.", "You learned:", "functional requirements describe what the system does,", "non-functional requirements describe how well it must do it,", "user counts must be converted into active users and requests,", "average RPS is calculated from daily requests,", "peak RPS requires a peak factor assumption,", "reads and writes often have different scaling characteristics,"],
      selfAssessment: [],
      content: `# Chapter 3 — Requirements and Capacity Thinking

In Chapter 2, you learned how a request travels from a client to a server and back.

You now understand a basic path like this:

\`\`\`text
User
  ↓
Client
  ↓
DNS / Network
  ↓
Server
  ↓
Database
  ↓
Response

\`\`\`

That gives you the mechanical picture.

But real system design does not begin with mechanics.

It begins with questions:

What are we building?

Who will use it?

How many users?

How much traffic?

How much data?

How fast must it be?

How reliable must it be?

What happens when things fail?

This chapter teaches you how to translate vague product ideas into concrete engineering constraints.

This skill is called requirements thinking and capacity thinking.

It is one of the most important skills in system design.

## Why This Matters

Imagine a product manager says:

“Build us a task management app.”

That sentence is not enough.

You need to know:

- Will 10 people use it or 10 million?

- Will users create 1 task per day or 100?

- Do we need real-time collaboration?

- Must tasks be searchable?

- How quickly must the app respond?

- Can the system be down for one hour per month?

- Do we need mobile apps?

- Are tasks private or shared?

- Do we need file attachments?

- Must we keep data for 7 years?

- Is this internal or public?

- What countries will users be in?

The answers change the design dramatically.

A system for 10 users can be simple.

A system for 10 million users needs careful planning.

A system with strict reliability needs redundancy.

A system with heavy reads may need caching.

A system with heavy writes may need partitioning or queues.

A system with large files may need object storage.

A system with global users may need multi-region deployment.

Without requirements and capacity thinking, architecture is guesswork.

## Prerequisites

You should understand from earlier chapters:

- what a client is,

- what a server is,

- what a request and response are,

- what a database is,

- what a basic backend architecture looks like,

- how a request travels over the web.

No advanced mathematics is required.

We will use simple multiplication and division.

The important skill is not calculation speed.

The important skill is choosing reasonable assumptions.

# Start With a Real-World Problem

Suppose you are asked to design a system called TaskTracker.

The basic idea is:

Users can create tasks, view tasks, update tasks, and delete tasks.

A beginner may immediately think:

“I will use a server and a database.”

That is not wrong, but it is too vague.

Now consider two different versions of TaskTracker.

## Version A: Small Internal Tool

Used by:

- one company,

- 200 employees,

- mostly during work hours,

- low traffic,

- data is not public,

- occasional downtime is acceptable.

A simple architecture may be enough:

- [Browser]

- |

- v

- [One Server]

- |

- v

- [One Database]

This is cheap, simple, and easy to maintain.

## Version B: Global Public Product

Used by:

- 10 million registered users,

- 1 million daily active users,

- users across many countries,

- mobile and web clients,

- high expectations for speed,

- downtime is very costly,

- tasks may include attachments,

- data must be durable and secure.

Now the same simple architecture may fail:

- one server may not handle traffic,

- one database may become a bottleneck,

- users far away may experience high latency,

- a single failure may make the product unavailable,

- storage may grow quickly,

- bandwidth may become expensive,

- security and privacy requirements become more serious.

The product description is the same:

A task management app.

But the system design is very different.

This is why requirements matter.

# Intuition

Requirements are constraints.

They tell you what the system must satisfy.

Capacity thinking is the process of converting vague statements into numbers.

For example:

Vague:

“The system should be fast.”

Better:

“95% of task-list requests should complete within 300 milliseconds.”

Vague:

“We expect many users.”

Better:

“We expect 100,000 daily active users, each making about 20 requests per day.”

Vague:

“We need to store a lot of data.”

Better:

“We expect 100,000 new tasks per day, each about 1 KB, so about 100 MB of new task data per day.”

You do not need perfect numbers.

You need reasonable numbers.

System design interviews and real engineering discussions reward clear assumptions more than false precision.

# Core Concept

We will build this chapter around a simple sequence:

\`\`\`text
Purpose
  ↓
Users
  ↓
Functional Requirements
  ↓
Non-Functional Requirements
  ↓
Traffic Estimation
  ↓
Storage Estimation
  ↓
Bandwidth Estimation
  ↓
Bottlenecks
  ↓
Architectural Implications

\`\`\`

Let us go step by step.

## 1. Functional Requirements

### Simple explanation

Functional requirements describe what the system must do.

### Formal term

Functional requirement.

### Example

For TaskTracker:

- Users can register.

- Users can log in.

- Users can create tasks.

- Users can view their tasks.

- Users can update tasks.

- Users can delete tasks.

- Users can mark tasks as done.

- Users can assign tasks to teammates.

### Practical use

Functional requirements define the features of the system.

They answer:

What operations must the system support?

In system design, functional requirements influence:

- APIs,

- data models,

- services,

- permissions,

- workflows,

- background jobs,

- integrations.

But functional requirements alone are not enough.

You also need to know how well the system must perform these functions.

## 2. Non-Functional Requirements

### Simple explanation

Non-functional requirements describe how the system should behave while doing its job.

### Formal term

Non-functional requirement, often abbreviated as NFR.

### Example

For TaskTracker:

- The system should support 100,000 daily active users.

- Task creation should usually complete within 300 milliseconds.

- The system should be available 99.9% of the time.

- Committed tasks must not be lost during ordinary server failures.

- Users must only see their own tasks unless shared.

- The system should handle peak traffic 5 times higher than average.

- Data should be encrypted in transit.

### Practical use

Non-functional requirements often drive the real architecture.

Features can often be added later.

But changing a system from:

- low traffic to high traffic,

- single region to multi-region,

- weak consistency to strong consistency,

- best-effort storage to durable storage,

can be much harder.

This is why interviews focus heavily on non-functional requirements.

## 3. Users and Actors

Before estimating traffic, identify who uses the system.

### Types of users

For TaskTracker, possible users include:

- regular users,

- team admins,

- guests,

- mobile app users,

- web browser users,

- internal support staff,

- automated integrations,

- analytics systems.

### Actors are not always humans

An actor is anything that interacts with the system.

Examples:

- a human using a browser,

- a mobile app,

- a cron job,

- another service,

- an admin dashboard,

- a webhook from a third-party system.

### Why this matters

Different actors create different traffic patterns.

For example:

- Humans may make bursts of requests.

- Mobile apps may make periodic sync requests.

- Automated systems may make steady high-volume requests.

- Admin tools may make rare but powerful operations.

So when you ask:

Who uses the system?

you are also asking:

What kind of load will the system see?

## 4. Scale: Registered Users, Active Users, Concurrent Users

Beginners often confuse different kinds of user counts.

Let us define them clearly.

### Registered users

Total number of accounts created.

Example:

\`1,000,000 registered users\`

This does not mean all of them are using the system right now.

### Daily active users, DAU

Number of distinct users who use the system at least once per day.

Example:

\`100,000 DAU\`

This is usually more useful than registered users.

### Monthly active users, MAU

Number of distinct users who use the system at least once per month.

Example:

\`500,000 MAU\`

### Concurrent users

Number of users actively using the system at the same moment.

Example:

\`5,000 concurrent users\`

This is harder to estimate directly, but it matters for connections, sessions, and real-time systems.

### Important lesson

Do not design only from registered users.

A system with 10 million registered users may only have 100,000 daily active users.

Or it may have 5 million daily active users.

The difference is enormous.

## 5. Requests Per User Per Day

Traffic is not determined only by user count.

You also need to know how much each user does.

Example:

- 100,000 daily active users

- Each user makes 20 requests per day

Total daily requests:

\`100,000 × 20 = 2,000,000 requests/day\`

This is a basic capacity calculation.

The number of requests per user per day depends on the product.

A social media app may have very high request counts.

A tax filing app may have very low request counts.

A chat app may have many small requests or persistent connections.

A video streaming app may have relatively few API requests but huge bandwidth usage.

So you must ask:

What does a typical user do in the system?

## 6. Average Requests Per Second

Once you know daily requests, convert to requests per second.

There are:

- 24 hours/day

- 60 minutes/hour

- 60 seconds/minute

So:

\`24 × 60 × 60 = 86,400 seconds/day\`

If the system receives:

\`2,000,000 requests/day\`

Then average requests per second is:

\`2,000,000 / 86,400 ≈ 23.1 requests/second\`

This is called average RPS, where RPS means requests per second.

### Important warning

Average RPS is often misleading.

Traffic is not evenly spread across the day.

People use systems more during certain hours.

For a work tool, traffic may spike during office hours.

For a entertainment app, traffic may spike in the evening.

For a global product, spikes may happen in different regions at different times.

Therefore, we also estimate peak traffic.

## 7. Peak Traffic and Peak Factor

### Simple explanation

Peak traffic is the highest expected load during busy periods.

### Formal term

Peak load, peak QPS/RPS.

A common beginner method is to use a peak factor.

For example:

\`Peak RPS = Average RPS × Peak Factor\`

Possible peak factors:

| System Type | Reasonable Peak Factor |
| --- | --- |
| Global consumer app | 2x to 5x |
| Work-hour business app | 3x to 10x |
| Flash sale / event system | 10x or more |
| Internal low-traffic tool | 2x to 3x |

This is not a universal law.

It is an assumption.

You should state it.

Example:

“I assume peak traffic is 5 times average traffic.”

For TaskTracker:

- Average RPS ≈ 23

- Peak factor = 5

- Peak RPS ≈ 115

So the system should be designed to handle around 100–120 requests per second at peak, at least initially.

Again, these numbers are not magical.

They are reasoning tools.

## 8. Read Traffic vs Write Traffic

Not all requests are equal.

Some requests only read data.

Some requests change data.

### Read request

A request that retrieves data without modifying it.

Examples:

- View task list

- View task details

- Search tasks

- View profile

### Write request

A request that changes data.

Examples:

- Create task

- Update task

- Delete task

- Add comment

- Upload attachment

### Why this matters

Reads and writes often have different costs.

Reads may be cacheable.

Writes usually must be handled carefully to preserve correctness.

Many systems are read-heavy.

For example:

\`90% reads, 10% writes\`

Some systems are write-heavy:

- log ingestion

- metrics collection

- IoT sensor data

- clickstream analytics

If you ignore the read/write ratio, you may design the wrong system.

### Example

Suppose TaskTracker has:

- 2,000,000 requests/day

- 90% reads

- 10% writes

Then:

- Reads/day = 1,800,000

- Writes/day = 200,000

Average RPS:

- Reads/sec = 1,800,000 / 86,400 ≈ 20.8

- Writes/sec = 200,000 / 86,400 ≈ 2.3

Peak RPS with factor 5:

- Peak reads/sec ≈ 104

- Peak writes/sec ≈ 11.6

This tells you something important:

Reads may dominate the load.

That may make caching useful later.

But writes still need durability and correctness.

## 9. Latency

### Simple explanation

Latency is delay.

It is the time between when something starts and when it finishes.

### Formal term

Latency.

### Example

If a user clicks “Save Task” and the system responds in 200 milliseconds, the request latency is 200 ms.

### Common units

- 1 second = 1,000 milliseconds

- 1 millisecond = 1,000 microseconds

Backend systems often care about:

- 10 ms,

- 50 ms,

- 100 ms,

- 300 ms,

- 1 second,

- several seconds.

### Average latency is not enough

Suppose 100 requests have these latencies:

- 99 requests take 10 ms

- 1 request takes 10,000 ms

Average latency:

- (99 × 10 + 1 × 10,000) / 100

- = (990 + 10,000) / 100

- = 10,990 / 100

- = 109.9 ms

The average looks okay.

But one user waited 10 seconds.

That may be unacceptable.

This is why engineers use percentiles.

## 10. Percentiles: p50, p95, p99

A percentile describes how many requests are faster than a given latency.

### p50, median

50% of requests are faster than this value.

Example:

\`p50 = 50 ms\`

Meaning:

Half of requests complete in 50 ms or less.

### p95

95% of requests are faster than this value.

Example:

\`p95 = 300 ms\`

Meaning:

95 out of 100 requests complete in 300 ms or less.

### p99

99% of requests are faster than this value.

Example:

\`p99 = 1,000 ms\`

Meaning:

99 out of 100 requests complete in 1 second or less.

### Why percentiles matter

Tail latency often matters more than average latency.

A system may feel broken if 1% of requests take 10 seconds, even if the average is fine.

In interviews and real systems, it is better to say:

“We target p95 latency under 300 ms.”

than:

“The system should be fast.”

## 11. Throughput

### Simple explanation

Throughput is how much work the system can do per unit of time.

### Formal term

Throughput.

### Examples

- 1,000 requests per second

- 500 MB per second

- 10,000 events per minute

- 200 database writes per second

### Latency vs throughput

Latency is time per request.

Throughput is number of requests per time.

They are related but not the same.

Example:

A coffee shop may serve one customer in 2 minutes.

That is latency.

If it serves 30 customers per hour, that is throughput.

A system can have:

- low latency but low throughput,

- high latency but high throughput,

- both good,

- both bad.

### Why this matters

If you only ask “How fast is one request?”, you may miss capacity limits.

You must also ask:

How many requests can the system handle at the same time?

## 12. Capacity

### Simple explanation

Capacity is the maximum load a system can handle while still meeting requirements.

### Formal term

Capacity.

Example:

\`The service can handle 500 requests per second with p95 latency under 300 ms.\`

Capacity is not just “maximum possible load.”

It is maximum acceptable load under constraints.

A system might technically accept 1,000 RPS, but if latency becomes terrible or errors increase, its useful capacity may be lower.

## 13. Scalability

### Simple explanation

Scalability is the ability of a system to handle growth by adding resources.

### Formal term

Scalability.

### Example

If traffic doubles, can the system continue working by adding more servers, more database capacity, or better distribution of load?

### Vertical scaling

Vertical scaling means making one machine bigger.

Example:

\`1 server with 2 CPUs → 1 server with 16 CPUs\`

Simple, but limited.

### Horizontal scaling

Horizontal scaling means adding more machines.

Example:

\`1 server → 10 servers\`

More complex, but often more flexible.

You will study this deeply later.

For now, understand:

Scalability is about growth, not just speed.

## 14. Availability

### Simple explanation

Availability means the system is usable when users expect it to be usable.

### Formal term

Availability.

It is often expressed as a percentage.

Examples:

| Availability | Meaning |
| --- | --- |
| 99% | Down about 3.65 days/year |
| 99.9% | Down about 8.76 hours/year |
| 99.99% | Down about 52.6 minutes/year |
| 99.999% | Down about 5.26 minutes/year |

### How to calculate

If availability is 99.9%, downtime fraction is:

\`100% - 99.9% = 0.1%\`

As a decimal:

\`0.1% = 0.001\`

Downtime per year:

\`0.001 × 365 × 24 hours ≈ 8.76 hours\`

Downtime per day:

\`0.001 × 24 × 60 minutes ≈ 1.44 minutes\`

1.44 minutes is about 86 seconds.

### Why this matters

A small internal tool may tolerate 99% availability.

A payment system may require 99.99% or higher.

Availability requirements influence:

- redundancy,

- failover,

- health checks,

- deployment strategy,

- disaster recovery,

- monitoring.

## 15. Reliability

### Simple explanation

Reliability means the system behaves correctly and consistently over time.

### Formal term

Reliability.

### Availability vs reliability

Availability means:

Is the system up?

Reliability means:

Does it work correctly when up?

A system can be available but unreliable.

Example:

The website loads quickly, but sometimes loses user data.

That is available but not reliable.

A reliable system should:

- avoid data loss,

- handle failures gracefully,

- return correct results,

- avoid corrupt state,

- recover from errors,

- behave predictably under load.

## 16. Performance

### Simple explanation

Performance describes how well the system uses time and resources.

### Formal term

Performance.

It includes:

- latency,

- throughput,

- resource utilization,

- response time,

- efficiency.

### Performance vs scalability

Performance is often about current behavior.

Scalability is about behavior under growth.

Example:

The system currently handles 100 RPS with 100 ms latency.

That is performance.

If traffic grows to 10,000 RPS, can it still meet acceptable latency by adding resources?

That is scalability.

## 17. Durability

### Simple explanation

Durability means data survives failures.

### Formal term

Durability.

### Example

If a user creates a task and the system confirms success, that task should not disappear because one server restarted.

Durability concerns include:

- disk failures,

- database crashes,

- backup loss,

- corruption,

- accidental deletion,

- region failure.

Durability is especially important for:

- financial data,

- medical data,

- user accounts,

- messages,

- orders,

- legal records.

## 18. Consistency, Introduced Lightly

You will study consistency deeply later, but you need a beginner intuition now.

### Simple explanation

Consistency describes how up-to-date and synchronized data appears to users.

### Example

Suppose Alice updates her profile.

Bob views Alice’s profile one second later.

Does Bob see the new data immediately?

Or may he see old data for a while?

Different systems make different choices.

A banking system may require strong consistency.

A social media like counter may tolerate temporary inconsistency.

For now, just understand:

Consistency is a non-functional requirement, and it affects architecture.

## 19. Security and Privacy Requirements

Security is also part of requirements.

Ask:

- Who can access the system?

- What data is sensitive?

- Must data be encrypted?

- Can users access other users’ data?

- Are there compliance rules?

- Do we need audit logs?

- Are there rate limits to prevent abuse?

Examples:

For TaskTracker:

- users must log in,

- passwords must be stored securely,

- API traffic should use HTTPS,

- users must only access their own tasks,

- admin actions should be audited.

For a healthcare system:

- stricter privacy rules,

- encryption at rest,

- detailed access logging,

- data retention policies.

Security requirements are not optional details.

They shape architecture.

## 20. Cost

A real system design must consider cost.

Ask:

- How many servers are needed?

- How much storage is needed?

- How much bandwidth is needed?

- Do we need expensive high-availability infrastructure?

- Can we use cheaper storage for old data?

- Do we need multi-region support?

- What operational effort is required?

A perfectly scalable but unnecessarily expensive design may be a bad design.

Good engineering balances:

- performance,

- reliability,

- complexity,

- cost,

- time to build.

# Important Terminology

| Term | Plain Explanation |
| --- | --- |
| Functional requirement | What the system must do |
| Non-functional requirement | How well the system must do it |
| DAU | Daily active users |
| MAU | Monthly active users |
| Concurrent users | Users active at the same moment |
| Request | One call to the system |
| RPS | Requests per second |
| QPS | Queries per second, often similar to RPS |
| Average RPS | Requests per second over a whole day |
| Peak RPS | Requests per second during busy periods |
| Read request | Retrieves data |
| Write request | Changes data |
| Read/write ratio | Proportion of reads versus writes |
| Latency | Delay of a request |
| Throughput | Amount of work per time |
| Capacity | Maximum acceptable load |
| Scalability | Ability to handle growth |
| Availability | Percentage of time system is usable |
| Reliability | Correct and dependable behavior |
| Durability | Data survives failures |
| Consistency | How synchronized data appears |
| Payload | Data sent in request or response body |
| Bandwidth | Data transfer capacity per time |
| Storage estimation | How much disk space data will need |
| Back-of-the-envelope calculation | Quick approximate engineering estimate |
| Assumption | A stated belief used to make calculations |
| Percentile | Value below which a given percentage of observations fall |
| p95 | 95% of requests are faster than this |
| p99 | 99% of requests are faster than this |

# Mental Model

A powerful beginner mental model is:

\`\`\`text
Product Goal
   ↓
Users
   ↓
Actions per User
   ↓
Requests per Day
   ↓
Requests per Second
   ↓
Reads vs Writes
   ↓
Data Size per Request
   ↓
Storage and Bandwidth
   ↓
Latency and Availability Targets
   ↓
Architectural Choices

\`\`\`

You should not jump directly to:

- Use Redis

- Use Kafka

- Use microservices

- Use Kubernetes

First pass through the model above.

Architecture should be a response to requirements.

# Architecture Diagram: Requirements Driving Design

Here is a conceptual diagram.

It is not a deployment diagram.

It shows how requirements influence components.

- +----------------------+

- | Product Requirements |

- +----------------------+

- |

- +------------------+------------------+

- |                  |                  |

- v                  v                  v

- Functional Req.    Non-Functional Req.   Scale Estimates

- |                  |                  |

- |                  v                  |

- |          +----------------+         |

- |          | Constraints    |         |

- |          | latency        |         |

- |          | availability   |         |

- |          | durability     |         |

- |          | security       |         |

- |          | cost           |         |

- |          +----------------+         |

- |                  |                  |

- +------------------+------------------+

- |

- v

- +-------------------+

- | Architecture Ideas|

- +-------------------+

- | caching?          |

- | queues?           |

- | replicas?         |

- | shards?           |

- | multiple servers? |

- | object storage?   |

- +-------------------+

The lesson:

Components are not chosen because they are popular.

They are chosen because requirements create problems they solve.

# Step-by-Step Capacity Estimation Method

Let us build a repeatable method.

## Step 1: Define the System

Example:

TaskTracker allows users to create, view, update, and delete tasks.

## Step 2: Identify Users

Example:

1 million registered users.

## Step 3: Estimate Active Users

Assumption:

10% of registered users are daily active.

Calculation:

- DAU = 1,000,000 × 10%

- = 100,000 users/day

## Step 4: Estimate Requests per User per Day

Assumption:

Each active user makes 20 requests per day.

Calculation:

- Total requests/day = 100,000 × 20

- = 2,000,000 requests/day

## Step 5: Convert to Average RPS

- Seconds/day = 86,400

- Average RPS = 2,000,000 / 86,400

- ≈ 23 RPS

## Step 6: Estimate Peak RPS

Assumption:

Peak traffic is 5 times average.

- Peak RPS = 23 × 5

- ≈ 115 RPS

## Step 7: Split Reads and Writes

Assumption:

90% reads, 10% writes.

- Reads/day = 2,000,000 × 90%

- = 1,800,000

- Writes/day = 2,000,000 × 10%

- = 200,000

Average:

- Read RPS = 1,800,000 / 86,400 ≈ 20.8

- Write RPS = 200,000 / 86,400 ≈ 2.3

Peak:

- Peak read RPS ≈ 104

- Peak write RPS ≈ 11.6

## Step 8: Estimate Payload Size

Assumption:

Average read response is 5 KB.

Average write request is 1 KB.

Read bandwidth/day:

\`1,800,000 × 5 KB = 9,000,000 KB\`

Convert to GB:

\`9,000,000 KB / 1,000,000 = 9 GB/day\`

Write bandwidth/day:

- 200,000 × 1 KB = 200,000 KB

- = 0.2 GB/day

Total approximate API bandwidth:

\`9.2 GB/day\`

Average bandwidth:

- 9.2 GB/day / 86,400 seconds/day

- ≈ 0.106 MB/s

Peak bandwidth with 5x factor:

\`≈ 0.53 MB/s\`

These numbers are small, but the method matters.

If payload were 100 KB instead of 5 KB, bandwidth would be 20 times larger.

## Step 9: Estimate Storage Growth

Assumption:

Each active user creates 1 task per day.

\`New tasks/day = 100,000\`

Assume each task row is about 1 KB.

- Storage/day = 100,000 × 1 KB

- = 100,000 KB

- = 100 MB/day

Per month:

- 100 MB × 30 = 3,000 MB

- = 3 GB/month

Per year:

- 100 MB × 365 = 36,500 MB

- ≈ 36.5 GB/year

If each task has comments, attachments, history, or metadata, storage may grow much faster.

## Step 10: Identify Likely Bottlenecks

From these estimates:

- Peak RPS is modest: around 115.

- Writes are low: around 12 per second at peak.

- Reads dominate.

- Storage growth is manageable.

- Bandwidth is not huge unless payloads grow.

Possible bottlenecks:

- Inefficient database queries.

- One application server if requests are expensive.

- Lock contention if many users update shared tasks.

- Large payloads if task lists include too much data.

- Missing indexes if queries filter by user, status, or date.

At this scale, a simple architecture may still be enough, but you should know where it may hurt.

# Simple Unit Conversions You Should Know

You do not need to memorize everything, but these help.

## Time

- 1 minute = 60 seconds

- 1 hour = 3,600 seconds

- 1 day = 86,400 seconds

- 1 week = 604,800 seconds

- 30 days ≈ 2,592,000 seconds

## Data Size

For rough estimates, using decimal units is often fine:

- 1 KB ≈ 1,000 bytes

- 1 MB ≈ 1,000 KB ≈ 1,000,000 bytes

- 1 GB ≈ 1,000 MB ≈ 1,000,000,000 bytes

- 1 TB ≈ 1,000 GB ≈ 1,000,000,000,000 bytes

In computing, binary units also exist:

- 1 KiB = 1,024 bytes

- 1 MiB = 1,024 KiB

- 1 GiB = 1,024 MiB

For back-of-the-envelope estimates, the difference is usually acceptable if you are consistent.

## Useful Approximations

- 1 million seconds ≈ 11.6 days

- 1 billion seconds ≈ 31.7 years

- 86,400 seconds/day ≈ 100,000 seconds/day for rough math

Using 100,000 seconds per day can make mental math easier:

\`2,000,000 requests/day / 100,000 ≈ 20 RPS\`

The exact value is 23 RPS, but 20 is fine for a quick estimate if you state the approximation.

# Example 1: TaskTracker, Detailed

Let us repeat the TaskTracker example in a clean interview-style format.

## Clarification

You are designing a task management system.

Assumptions:

- 1 million registered users.

- 100,000 daily active users.

- Each user makes 20 requests/day.

- 90% reads, 10% writes.

- Peak traffic is 5x average.

- Average read response is 5 KB.

- Average write request is 1 KB.

- Each user creates 1 task/day.

- Each task is about 1 KB.

- Target p95 latency: 300 ms.

- Target availability: 99.9%.

## Traffic

- Daily requests = 100,000 × 20 = 2,000,000

- Average RPS = 2,000,000 / 86,400 ≈ 23

- Peak RPS ≈ 23 × 5 = 115

## Reads/Writes

- Peak reads/sec ≈ 104

- Peak writes/sec ≈ 12

## Bandwidth

- Read bandwidth/day ≈ 1,800,000 × 5 KB = 9 GB/day

- Write bandwidth/day ≈ 200,000 × 1 KB = 0.2 GB/day

- Total ≈ 9.2 GB/day

## Storage

- New tasks/day = 100,000

- Task storage/day = 100 MB/day

- Task storage/year ≈ 36.5 GB/year

## Architectural Implications

Possible implications:

- One well-designed server may handle 115 RPS if requests are cheap.

- Database indexing is important.

- Caching may help because reads dominate.

- Availability target of 99.9% suggests some redundancy.

- Storage growth is not alarming yet.

- Bandwidth is not the main concern unless payloads grow.

This does not give a full architecture.

But it gives constraints.

# Example 2: Photo Sharing System

Now consider a more media-heavy system.

## Product

Users can:

- upload photos,

- view photos,

- share photos with friends.

## Assumptions

- 10 million monthly active users.

- 20% are daily active: 2 million DAU.

- 1% of DAU upload one photo per day: 20,000 uploads/day.

- Average photo size: 3 MB.

- Each uploaded photo is viewed 50 times per day.

- Average peak factor: 5x.

- We initially ignore thumbnails and CDN caching.

## Upload Traffic

- Uploads/day = 20,000

- Average uploads/sec = 20,000 / 86,400 ≈ 0.23

- Peak uploads/sec ≈ 0.23 × 5 ≈ 1.15

Upload request count is small.

But upload data size is large.

\`Upload storage/day = 20,000 × 3 MB = 60,000 MB = 60 GB/day\`

Per month:

\`60 GB × 30 = 1,800 GB = 1.8 TB/month\`

Per year:

\`60 GB × 365 = 21,900 GB ≈ 21.9 TB/year\`

This is already a serious storage concern.

## View Traffic

- Views/day = 20,000 photos × 50 views = 1,000,000 views/day

- Average views/sec = 1,000,000 / 86,400 ≈ 11.6

- Peak views/sec ≈ 11.6 × 5 = 58

## View Bandwidth

If every view downloads the full 3 MB photo:

\`Bandwidth/day = 1,000,000 × 3 MB = 3,000,000 MB = 3 TB/day\`

Average bandwidth:

- 3 TB/day / 86,400 sec/day

- = 3,000 GB/day / 86,400

- ≈ 34.7 MB/s

Peak bandwidth:

\`34.7 × 5 ≈ 173.5 MB/s\`

This is much larger than TaskTracker.

## Lessons

For photo systems:

- request count may be modest,

- bandwidth may be huge,

- storage growth may be fast,

- full-size image delivery may be wasteful,

- thumbnails and resizing may be important,

- caching and CDN-like distribution may be valuable,

- object storage may be more appropriate than putting large files in a database.

This example shows why you must estimate both:

- requests per second

- bytes per second

A system can have low RPS but very high bandwidth.

# Example 3: Chat System

Now consider a chat application.

## Product

Users can:

- send messages,

- receive messages,

- view conversation history.

## Assumptions

- 1 million DAU.

- Each user sends 20 messages/day.

- Each message is delivered to 1 recipient on average.

- Each user opens the app 10 times/day.

- Each app open causes 5 API requests.

- Average message size: 200 bytes.

- Peak factor: 5x.

## Message Writes

- Messages/day = 1,000,000 × 20 = 20,000,000

- Average writes/sec = 20,000,000 / 86,400 ≈ 231

- Peak writes/sec ≈ 1,157

This is much write-heavier than TaskTracker.

## Message Delivery

If each message is delivered to one recipient:

\`Deliveries/day = 20,000,000\`

Depending on architecture, delivery may involve:

- pushing to online users,

- storing unread state,

- sending notifications,

- fetching history.

## API Requests from App Opens

- App opens/day = 1,000,000 × 10 = 10,000,000

- API requests/day = 10,000,000 × 5 = 50,000,000

- Average API RPS = 50,000,000 / 86,400 ≈ 579

- Peak API RPS ≈ 2,895

Total request load is significant.

## Storage

Message storage/day:

\`20,000,000 × 200 bytes = 4,000,000,000 bytes = 4 GB/day\`

Per year:

\`4 GB × 365 ≈ 1.46 TB/year\`

This does not include metadata, read receipts, attachments, or indexes.

## Lessons

Chat systems may be:

- write-heavy,

- delivery-heavy,

- sensitive to latency,

- dependent on online/offline state,

- requiring efficient history storage,

- requiring careful fan-out design.

“Fan-out” means delivering one message to many recipients.

You will study this later.

For now, notice how different this is from TaskTracker.

# Read-Heavy vs Write-Heavy Systems

## Read-Heavy System

Most requests retrieve data.

Examples:

- news site,

- product catalog,

- social feed,

- video metadata,

- documentation site.

Common concerns:

- caching,

- CDN,

- read replicas,

- efficient indexes,

- precomputation.

## Write-Heavy System

Most requests change data.

Examples:

- logs,

- metrics,

- IoT sensors,

- clickstream,

- chat messages,

- trading events.

Common concerns:

- durable writes,

- batching,

- queues,

- partitioning,

- storage efficiency,

- compaction,

- eventual consistency.

## Balanced System

Reads and writes are both significant.

Examples:

- e-commerce,

- ride booking,

- collaboration tools.

Common concerns:

- transaction correctness,

- locking,

- cache invalidation,

- inventory consistency,

- state machines.

# Traffic Patterns Are Not Uniform

A critical beginner lesson:

Users do not arrive like a perfect faucet.

Traffic has shapes.

## Example: Work Tool

TaskTracker may see:

- Low traffic at night

- High traffic during office hours

- Spike at 9 AM

- Spike before deadlines

## Example: Entertainment App

A video app may see:

- Low traffic in morning

- High traffic in evening

- Weekend spikes

## Example: Global System

A global app may see:

- Asia peak while Europe sleeps

- Europe peak while America sleeps

- America peak while Asia sleeps

This can smooth global traffic, but local peaks still matter.

## Example: Event System

A ticket sales system may see:

- Almost no traffic

- Then huge spike when sales open

This is much harder than average traffic.

So always ask:

Is traffic steady, bursty, seasonal, event-driven, or regional?

# Peak Factor: How to Choose It

There is no single correct peak factor.

But you can reason.

## Low Variability

If usage is steady:

\`Peak factor = 2x\`

Example:

- internal monitoring,

- background data pipeline.

## Moderate Variability

\`Peak factor = 3x to 5x\`

Example:

- business app,

- consumer app with daily rhythm.

## High Variability

\`Peak factor = 10x or more\`

Example:

- flash sale,

- ticket release,

- breaking news,

- live sports voting.

## Important Interview Phrase

You can say:

“I assume average traffic is X RPS. Since usage may spike during peak hours, I will design for a peak factor of 5, giving about Y RPS. If the product expects event-driven spikes, we may need a higher factor or elastic scaling.”

This shows maturity.

# Storage Estimation in More Detail

Storage estimation is not only about raw data size.

You must consider:

- primary data,

- indexes,

- metadata,

- replicas,

- backups,

- logs,

- temporary files,

- thumbnails,

- deleted data,

- compression,

- growth over time.

## Example: Task Row

A task may contain:

- task_id: 8 bytes

- user_id: 8 bytes

- title: up to 200 bytes

- description: up to 2,000 bytes

- status: 20 bytes

- created_at: 8 bytes

- updated_at: 8 bytes

Raw data may be a few hundred bytes to a few KB.

But indexes and database overhead may increase storage.

A rough estimate of 1 KB per task is reasonable for simple tasks.

If descriptions are long, maybe 5 KB or more.

## Indexes

Indexes speed up queries but take space.

If you index:

- user_id,

- status,

- created_at,

- title search,

storage may increase significantly.

## Replicas

If you keep 2 replicas for durability, data may be stored multiple times.

Example:

- Base storage = 100 GB

- Replication factor = 2

- Effective storage = 200 GB

## Backups

Backups add more storage.

If you keep daily backups for 30 days:

- Backup storage may be tens or hundreds of times daily change,

- depending on full vs incremental backups.

## Compression

Compression can reduce storage.

Text data often compresses well.

Images and videos may already be compressed.

## Deletion

Deleted data may not disappear immediately.

Systems may keep:

- soft deletes,

- tombstones,

- version history,

- audit logs.

So storage estimates should be conservative.

# Bandwidth Estimation in More Detail

Bandwidth is often forgotten by beginners.

They estimate requests but not bytes.

Ask:

How many bytes does each request or response carry?

## Factors affecting bandwidth

- payload size,

- compression,

- caching,

- image/video size,

- API verbosity,

- polling frequency,

- number of clients,

- CDN usage,

- protocol overhead.

## Example: Verbose API

Suppose a task list returns 100 tasks.

Each task JSON is 1 KB.

Response size:

\`100 KB\`

If 1 million such requests/day:

\`100 KB × 1,000,000 = 100,000,000 KB = 100 GB/day\`

That is significant.

If the API returned only 20 fields but only 3 are needed, bandwidth is wasted.

This is why API design matters.

# Latency Budgets

When a user expects a response in 300 ms, you must divide that time among components.

Example:

- Total target: 300 ms

- Network: 50 ms

- Server processing: 50 ms

- Cache lookup: 5 ms

- Database query: 150 ms

- Serialization: 10 ms

- Remaining buffer: 35 ms

If the database query alone takes 250 ms, the target is impossible without optimization.

This is called a latency budget.

It helps you find where to improve.

## Common latency sources

- client rendering,

- DNS,

- TCP connection,

- TLS handshake,

- network round trips,

- load balancer,

- application code,

- cache lookup,

- database query,

- external API calls,

- serialization,

- queue waiting time.

In system design, you should think:

Where is time being spent?

# Availability Targets and Failure Thinking

If the system must be 99.9% available, you need to ask:

What failures can cause downtime?

Examples:

- server crash,

- database crash,

- disk full,

- network partition,

- bad deployment,

- dependency outage,

- region outage,

- traffic overload.

A single-server, single-database design may not meet high availability.

Why?

Because if either component fails, the system fails.

\`[Client] → [One Server] → [One Database]\`

This has single points of failure.

For 99.9% availability, you may need:

- multiple servers,

- health checks,

- automatic restarts,

- database failover,

- monitoring,

- careful deployments.

You do not need to design all of this now.

But requirements should trigger these thoughts.

# Reliability Targets and Data Loss

If the requirement is:

Committed tasks must not be lost.

Then you must think about:

- durable database writes,

- replication,

- backups,

- recovery testing,

- idempotent retries,

- transaction safety.

If the requirement is:

It is acceptable to lose a few recent analytics events.

Then you may choose cheaper, faster, less durable mechanisms.

Different data can have different reliability requirements.

Example:

| Data Type | Durability Need |
| --- | --- |
| Payment record | Very high |
| User task | High |
| Analytics event | Medium/low |
| Cache entry | Low |
| Temporary session | Low to medium |

This is an important architectural insight:

Not all data deserves the same cost and guarantees.

# Capacity Thinking for Different System Types

## 1. CRUD Web App

Examples:

- TaskTracker,

- blog,

- internal admin tool.

Estimate:

- DAU,

- requests/user/day,

- read/write ratio,

- row size,

- index overhead.

Likely concerns:

- database queries,

- authentication,

- caching,

- simple horizontal scaling.

## 2. Media System

Examples:

- photo sharing,

- video streaming,

- file storage.

Estimate:

- upload size,

- playback/download size,

- view counts,

- thumbnail generation,

- storage growth,

- bandwidth.

Likely concerns:

- object storage,

- CDN,

- transcoding,

- bandwidth cost,

- metadata database.

## 3. Chat/Messaging System

Estimate:

- messages/user/day,

- recipients per message,

- online users,

- history reads,

- delivery acknowledgements.

Likely concerns:

- write throughput,

- fan-out,

- real-time delivery,

- message storage,

- ordering,

- unread counts.

## 4. Notification System

Estimate:

- events/day,

- recipients/event,

- channels: push, email, SMS,

- provider rate limits,

- retry volume.

Likely concerns:

- queues,

- batching,

- throttling,

- delivery status,

- dead letters,

- idempotency.

## 5. Search System

Estimate:

- queries/day,

- documents indexed,

- document size,

- update frequency,

- result size.

Likely concerns:

- index size,

- query latency,

- relevance,

- incremental updates,

- hot queries.

## 6. Analytics/Event Pipeline

Estimate:

- events/sec,

- event size,

- retention period,

- aggregation queries,

- late events.

Likely concerns:

- ingestion throughput,

- storage format,

- batching,

- partitioning,

- query performance,

- cost.

# Trade-Offs Introduced by Requirements

Requirements force trade-offs.

Here are beginner-level examples.

## Trade-Off 1: Accuracy vs Speed of Estimation

### Fast estimate

Advantages:

- useful for early design,

- helps interviews,

- avoids paralysis.

Disadvantages:

- may be wrong,

- may miss edge cases.

### Detailed model

Advantages:

- more accurate,

- better for capacity planning.

Disadvantages:

- slower,

- requires real data,

- may be premature.

When to use:

- Early design: fast estimate.

- Production planning: measured data.

## Trade-Off 2: Overestimate vs Underestimate

### Overestimate

Advantages:

- safer for traffic spikes,

- better user experience during peaks.

Disadvantages:

- higher cost,

- wasted resources.

### Underestimate

Advantages:

- lower initial cost.

Disadvantages:

- slowdowns,

- outages,

- poor user experience.

Good engineers aim for reasonable estimates with headroom and monitoring.

## Trade-Off 3: Simplicity vs High Availability

A highly available system often has:

- multiple servers,

- replicas,

- failover,

- health checks,

- more complex deployments.

A simple system has:

- one server,

- one database,

- easier debugging.

If availability requirement is low, simplicity may win.

If availability requirement is high, complexity may be necessary.

## Trade-Off 4: Performance vs Cost

You can improve performance by adding:

- faster hardware,

- more replicas,

- caches,

- CDNs,

- better databases,

- more engineers.

All cost money.

Ask:

Is 50 ms improvement worth 2x infrastructure cost?

It depends on the business.

For ads or e-commerce, maybe yes.

For an internal tool, maybe no.

## Trade-Off 5: Strong Consistency vs Availability

This is advanced, but you can build intuition now.

Strong consistency means:

Once data is written, everyone sees the latest version immediately.

This can be harder when network failures happen.

Eventual consistency means:

Data may be temporarily outdated, but will become consistent later.

This can improve availability and scale.

Examples:

- Bank balance: strong consistency may be preferred.

- Social media like count: eventual consistency may be acceptable.

You will study this later.

For now, understand:

Consistency requirements affect architecture.

## Trade-Off 6: Synchronous Processing vs Asynchronous Processing

Synchronous means:

Wait for work to finish before responding.

Asynchronous means:

Accept work now, process later.

Trade-offs:

| Approach | Advantage | Disadvantage |
| --- | --- | --- |
| Synchronous | Simpler user expectation | Slower response, tighter coupling |
| Asynchronous | Faster acceptance, resilient | Status tracking, eventual visibility |

Requirements decide.

If the user must see the result immediately, synchronous may be needed.

If the task is heavy, asynchronous may be better.

# Common Beginner Mistakes

## Mistake 1: Jumping to Architecture Too Early

Beginners say:

Use microservices.

Use Kafka.

Use Redis.

But they have not answered:

- What problem exists?

- What scale?

- What latency?

- What failure model?

- What consistency?

- What cost?

Architecture should follow requirements.

## Mistake 2: Using Registered Users Instead of Active Users

10 million registered users does not mean 10 million active users.

Always ask:

What is DAU or MAU?

## Mistake 3: Assuming Traffic Is Even

Average RPS is rarely enough.

You must consider peaks.

## Mistake 4: Ignoring Payload Size

Two systems with the same RPS can have wildly different bandwidth needs.

One request may be 100 bytes.

Another may be 10 MB.

Always estimate bytes, not just requests.

## Mistake 5: Ignoring Read/Write Ratio

A read-heavy system and a write-heavy system scale differently.

If you do not know the ratio, ask.

## Mistake 6: Confusing Latency and Throughput

Latency is time per request.

Throughput is requests per time.

A system can be fast for one request but unable to handle many.

## Mistake 7: Confusing Availability and Reliability

Availability means up.

Reliability means correct and dependable.

A system can be up but wrong.

## Mistake 8: Not Stating Assumptions

If you say:

100 RPS.

The interviewer or teammate may ask:

Based on what?

Better:

Assuming 100,000 DAU and 20 requests/user/day, average RPS is about 23. With a 5x peak factor, peak is about 115 RPS.

## Mistake 9: False Precision

Do not say:

The system will need exactly 37.42 servers.

Unless you have strong data.

Better:

This suggests on the order of tens of servers, depending on per-server capacity.

## Mistake 10: Ignoring Growth

Today’s 100,000 DAU may become 1,000,000 DAU next year.

Ask:

What growth should we plan for?

You do not need to build for 100x today, but you should avoid designs that cannot grow.

## Mistake 11: Ignoring Operational Complexity

A design may be theoretically scalable but hard to operate.

Ask:

- How many components?

- How many failure modes?

- How do we deploy?

- How do we monitor?

- How do we recover?

- What skills does the team have?

## Mistake 12: Treating All Data as Equal

Some data is temporary.

Some data is critical.

Some data is large.

Some data is frequently accessed.

Different data may need different storage and reliability strategies.

# Deep Dive

Now we go a bit deeper, but still beginner-friendly.

## Deep Dive 1: How to Estimate Requests per User per Day

This is often the hardest assumption.

You can reason by user behavior.

Example for TaskTracker:

A user may:

- Open app: 1 request

- Load task list: 3 requests

- View task details: 5 requests

- Create task: 2 requests

- Update task: 4 requests

- Delete/archive: 1 request

- Search/filter: 4 requests

Total:

\`20 requests/day\`

This is not scientific.

It is a plausible model.

For interviews, say:

“I assume a typical active user makes around 20 requests per day, including app opens, list loads, and task mutations.”

That is enough.

## Deep Dive 2: Estimating Concurrent Connections

Sometimes you need to estimate how many users are connected at once.

A rough method:

\`Concurrent users ≈ DAU × average session minutes/day / 1,440\`

There are 1,440 minutes in a day.

Example:

- DAU = 100,000

- Average usage = 15 minutes/day

- Concurrent users ≈ 100,000 × 15 / 1,440

- ≈ 1,042

This is still average concurrency.

Peak concurrency may be several times higher.

For chat or real-time systems, concurrency matters more.

For simple request-response APIs, RPS often matters more.

## Deep Dive 3: Estimating Database Queries per API Request

One API request may cause multiple database queries.

Example:

\`GET /tasks\`

May cause:

- 1 query for user

- 1 query for tasks

- 1 query for project names

- 1 query for comments count

So:

\`1 API request → 4 database queries\`

If peak API RPS is 100, peak database query rate may be 400.

This is a common hidden bottleneck.

Always ask:

How many downstream operations does one user request trigger?

## Deep Dive 4: Estimating Cache Hit Rate

If caching is used, not every request reaches the database.

Example:

- Peak read RPS = 100

- Cache hit rate = 80%

Then:

- Cache reads/sec = 80

- Database reads/sec = 20

A high cache hit rate can dramatically reduce database load.

But cache hit rate depends on:

- data popularity,

- TTL,

- invalidation strategy,

- workload,

- cache size.

Do not assume 100% hit rate.

## Deep Dive 5: Hot Keys and Hot Partitions

Some data is accessed much more than other data.

Examples:

- a celebrity profile,

- a viral post,

- a popular product,

- a breaking news article,

- one large tenant in a multi-tenant system.

This can create hotspots.

A hotspot is a small piece of data or one shard receiving disproportionate traffic.

Even if average load is fine, a hot key can overload one cache node or database shard.

Beginner intuition:

Traffic is not always evenly distributed across data.

## Deep Dive 6: Estimating Message Queue Load

If asynchronous processing is used, estimate event volume.

Example:

- 100,000 task creations/day

- Each creation triggers:

- - notification event

- - analytics event

- - audit event

Total events/day:

\`300,000 events/day\`

Average:

\`300,000 / 86,400 ≈ 3.5 events/sec\`

Peak with 5x:

\`≈ 17.5 events/sec\`

If each event is 2 KB:

- Average data rate = 3.5 × 2 KB = 7 KB/s

- Peak data rate = 17.5 × 2 KB = 35 KB/s

Small, but the method matters.

At larger scale, queues must handle bursts and retries.

## Deep Dive 7: Storage Growth Formula

A general formula:

- Storage/day = new records/day × average record size

- + indexes overhead

- + replicas/backups

Simplified:

\`Storage/day ≈ new records/day × record size × overhead factor\`

Overhead factor might be:

- 1.2 for indexes

- 2 for one replica

- 3 for backups and replicas

Example:

- 100,000 tasks/day

- 1 KB/task

- overhead factor = 2

- Storage/day ≈ 100,000 × 1 KB × 2

- = 200,000 KB

- = 200 MB/day

## Deep Dive 8: Bandwidth Formula

\`Bandwidth/day = requests/day × average response/request size\`

For bidirectional traffic:

- Total bandwidth/day =

- read responses/day × response size

- + write requests/day × request size

- + other payloads

Peak bandwidth:

\`Peak bandwidth ≈ average bandwidth × peak factor\`

But if caching or compression is used:

\`Effective origin bandwidth = total bandwidth × miss rate × compression factor\`

Example:

- Total view bandwidth = 3 TB/day

- CDN cache hit rate = 90%

- Origin bandwidth = 10% × 3 TB = 300 GB/day

This is why CDNs and caching can dramatically reduce backend load.

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

Why is “1 million users” not enough information for system design?

Answer direction:

Because it does not tell you:

- how many are active,

- what they do,

- how often,

- how much data they generate,

- whether traffic is read-heavy or write-heavy,

- what latency and availability targets are.

The same user count can mean very different system loads.

## Predict

Question:

A system has 10,000 DAU and each user makes 100 requests/day.

Is the average RPS likely closer to:

- 1 RPS

- 10 RPS

- 100 RPS

- 1,000 RPS

Answer direction:

- 10,000 × 100 = 1,000,000 requests/day

- 1,000,000 / 86,400 ≈ 11.6 RPS

So closer to 10 RPS.

## Find the Bottleneck

Question:

A photo app has only 50 uploads/sec at peak, but users complain that photos load slowly.

What might be the bottleneck?

Answer direction:

Possibly bandwidth or storage retrieval, not request count.

Large files, lack of caching, slow image processing, or distant storage can cause slowness even with modest RPS.

## Compare

Question:

Which system likely needs more write capacity?

System A:

- News website

- 99% reads

- 1% writes

System B:

- IoT sensor platform

- 95% writes

- 5% reads

Assume both have 1 million requests/day.

Answer direction:

System B.

- System A writes/day ≈ 10,000

- System B writes/day ≈ 950,000

Write-heavy systems often need different design concerns.

## Design This

Question:

You are building a simple internal wiki for 500 employees.

What requirements would you ask for before designing?

Answer direction:

Ask:

- daily active users,

- pages created/edited per day,

- page size,

- attachments,

- search needs,

- permissions,

- uptime expectations,

- backup requirements,

- authentication method,

- peak usage times.

# Architecture Exercise

## Weak Design

A startup builds a file-sharing service.

They say:

“We have 100,000 registered users.”

Their architecture:

- [Browser]

- |

- v

- [One Server]

- |

- v

- [One Database storing files as binary columns]

No caching.

No monitoring.

No backups.

No rate limiting.

No file size limits.

## Your Task

Identify problems using requirements and capacity thinking.

Ask:

- What is DAU?

- What is upload frequency?

- What is average file size?

- What is download frequency?

- What is storage growth?

- What happens if one large file upload saturates the server?

- What happens if the database stores huge files?

- What happens if the server or database fails?

- What happens if users upload malicious or enormous files?

## Hint 1: Requirements Hint

Before architecture, clarify:

- expected active users,

- file sizes,

- upload/download ratio,

- retention policy,

- availability target.

## Hint 2: Storage Hint

Storing large binary files directly in a traditional database may cause:

- bloated database,

- slow backups,

- memory pressure,

- poor scalability.

A separate file/object store is often better.

## Hint 3: Bandwidth Hint

File-sharing systems may be bandwidth-heavy, not request-heavy.

Estimate bytes per second, not just requests per second.

## Hint 4: Reliability Hint

If files are precious, one database with no backups is risky.

Ask:

- replication,

- versioning,

- durability,

- recovery.

## Improved Design Direction

A better high-level direction:

- [Browser]

- |

- v

- [API Server]

- |

- +--> [Metadata Database]

- |

- +--> [Object/File Storage]

- |

- +--> [Background Processing]

Add:

- file size limits,

- authentication,

- virus scanning if needed,

- bandwidth monitoring,

- storage lifecycle policies,

- backups,

- CDN or caching for downloads,

- asynchronous thumbnail/preview generation.

This is not the final design.

But it shows how requirements change architecture.

# Design Exercise: Estimate Capacity for a Pastebin-Like System

Now you practice.

We will design requirements and estimates for a simple system called CodeShare.

Users can:

- paste text,

- get a short link,

- view the pasted text,

- optionally set expiration.

Do not worry about full architecture yet.

Focus on requirements and capacity.

## Step 1: Clarify the Problem

Questions you might ask:

- Is this public or private?

- Do users need accounts?

- What is maximum paste size?

- How long are pastes stored?

- Are pastes frequently viewed?

- Do we need syntax highlighting?

- Do we need delete/edit?

- Is spam a concern?

For this exercise, assume:

- anonymous users can create pastes,

- pastes are public unless deleted,

- maximum paste size: 100 KB,

- default retention: 30 days,

- average paste size: 5 KB,

- 10,000 pastes created/day,

- average views per paste: 20/day,

- peak factor: 5x.

## Step 2: Functional Requirements

The system must:

- create a paste,

- return a short identifier,

- retrieve a paste by identifier,

- expire old pastes,

- optionally delete pastes.

## Step 3: Non-Functional Requirements

Possible targets:

- p95 read latency: 100 ms,

- p95 write latency: 200 ms,

- availability: 99.9%,

- storage: retain pastes for 30 days,

- abuse prevention: rate limiting,

- data durability: pastes should not be lost unexpectedly.

## Step 4: Traffic Estimation

Creates/day:

\`10,000\`

Views/day:

\`10,000 pastes × 20 views = 200,000 views/day\`

Total requests/day:

\`210,000 requests/day\`

Average RPS:

\`210,000 / 86,400 ≈ 2.43 RPS\`

Peak RPS:

\`2.43 × 5 ≈ 12.15 RPS\`

This is small.

But bandwidth may matter.

## Step 5: Bandwidth Estimation

Write bandwidth/day:

\`10,000 × 5 KB = 50,000 KB = 50 MB/day\`

Read bandwidth/day:

\`200,000 × 5 KB = 1,000,000 KB = 1 GB/day\`

Total:

\`≈ 1.05 GB/day\`

Average bandwidth:

\`1.05 GB/day / 86,400 ≈ 12.5 KB/s\`

Peak:

\`≈ 62.5 KB/s\`

Still small, but if average paste size were 100 KB, read bandwidth would be 20 GB/day.

So payload size matters.

## Step 6: Storage Estimation

Pastes created/day:

\`10,000\`

Average size:

\`5 KB\`

Raw storage/day:

\`50 MB/day\`

Retention:

\`30 days\`

Raw storage:

\`50 MB × 30 = 1,500 MB = 1.5 GB\`

Add metadata, indexes, and overhead:

\`maybe 2–5 GB total\`

This is very manageable.

## Step 7: Likely Bottlenecks

At this scale:

- database likely fine,

- server likely fine,

- bandwidth likely fine.

But possible issues:

- abusive large pastes,

- spam,

- hot pastes going viral,

- inefficient retrieval,

- lack of expiration cleanup,

- no rate limiting.

A simple architecture may be enough, but you should still think about abuse and expiry.

## Hint System if You Want to Try Yourself

If you prefer to solve before reading the solution, use these hints.

### Hint 1 — Requirements Hint

Ask:

- What is the maximum paste size?

- How long are pastes kept?

- Are reads much more common than writes?

### Hint 2 — Architecture Hint

A key-value store or simple database may be enough.

But consider expiration.

### Hint 3 — Scaling Hint

If one paste becomes viral, read traffic may spike.

Caching may help.

### Hint 4 — Reliability Hint

If pastes are important, avoid losing them on restart.

Use durable storage and backups.

## Final Solution Direction

A reasonable simple design:

- [Browser]

- |

- v

- [API Server]

- |

- v

- [Database or Key-Value Store]

With:

- rate limiting,

- maximum paste size,

- expiration job,

- durable storage,

- basic monitoring.

If traffic grows:

- [Browser]

- |

- v

- [Load Balancer]

- |

- +--> [API Server 1]

- +--> [API Server 2]

- |

- v

- [Cache]

- |

- v

- [Database]

But only add complexity when needed.

For the estimated scale, a simple design is appropriate.

# Practice Questions

Try answering these without rereading.

## Conceptual Questions

- What is the difference between functional and non-functional requirements?

- Why are daily active users often more useful than registered users?

- What does RPS mean?

- How do you convert requests/day to requests/second?

- Why is peak traffic important?

- What is a peak factor?

- What is the difference between reads and writes?

- Why is read/write ratio important?

- What is latency?

- What is throughput?

- What is the difference between average latency and p95 latency?

- What is availability?

- What is reliability?

- What is durability?

- Why must you estimate payload size?

- What is bandwidth?

- What is storage estimation?

- Why can a system have low RPS but high bandwidth?

- What is a bottleneck?

- Why should you state assumptions clearly?

## Calculation Questions

### Question 1

A system has 50,000 DAU.

Each user makes 12 requests/day.

What is average RPS?

Direction:

- 50,000 × 12 = 600,000 requests/day

- 600,000 / 86,400 ≈ 6.94 RPS

### Question 2

If peak factor is 4, what is peak RPS?

Direction:

\`6.94 × 4 ≈ 27.8 RPS\`

### Question 3

The system has 80% reads and 20% writes.

What are peak read and write RPS?

Direction:

- Peak total ≈ 27.8

- Peak reads ≈ 22.2

- Peak writes ≈ 5.6

### Question 4

Average read response is 4 KB.

What is read bandwidth/day?

Direction:

- Reads/day = 600,000 × 80% = 480,000

- 480,000 × 4 KB = 1,920,000 KB = 1.92 GB/day

### Question 5

The system creates 10,000 records/day.

Each record is 2 KB.

How much storage per day?

Direction:

\`10,000 × 2 KB = 20,000 KB = 20 MB/day\`

### Question 6

If retention is 90 days, how much raw storage?

Direction:

\`20 MB × 90 = 1,800 MB = 1.8 GB\`

### Question 7

A service has 99.9% availability.

How much downtime per day?

Direction:

- 0.1% of day

- 0.001 × 24 × 60 = 1.44 minutes

### Question 8

A service has 99.99% availability.

How much downtime per year?

Direction:

- 0.01% of year

- 0.0001 × 365 × 24 ≈ 52.6 minutes

# Interview Questions

These are common beginner-to-intermediate system design interview questions.

## Question 1

Interviewer: Before designing a system, what do you do first?

Good answer direction:

I clarify the problem and requirements. I ask about users, scale, core features, latency, availability, data size, read/write pattern, and constraints. Then I make explicit assumptions and estimate capacity before proposing architecture.

## Question 2

Interviewer: How would you estimate traffic for a URL shortener?

Good answer direction:

You might say:

Assume some number of daily active users or daily created links. Estimate average requests per user or per link. Compute total requests/day, convert to average RPS, then apply a peak factor. Also estimate storage from number of links and average metadata size. For a URL shortener, reads are likely much heavier than writes.

Example:

- 1 million new links/day

- 10 clicks per link/day

- Total reads/day = 10 million

- Average RPS ≈ 116

- Peak with 5x ≈ 580

This is enough for an initial estimate.

## Question 3

Interviewer: What is the difference between scalability and performance?

Good answer direction:

Performance describes how fast or efficient the system is under current load. Scalability describes how well the system can handle increasing load by adding resources or changing structure. A system can be performant at small scale but fail to scale.

## Question 4

Interviewer: Why do you care about p95 latency instead of only average latency?

Good answer direction:

Average latency can hide bad tail experiences. p95 tells us what most users experience near the slower end. For user-facing systems, tail latency often matters because a small percentage of very slow requests can make the product feel unreliable.

## Question 5

Interviewer: A system has low RPS but users complain it is slow. What could be wrong?

Good answer direction:

Possible causes:

- large payloads,

- slow database queries,

- expensive computation,

- external dependency latency,

- network distance,

- lock contention,

- insufficient resources,

- cold caches,

- inefficient serialization.

Low RPS does not guarantee low latency.

## Question 6

Interviewer: How do you know whether to add caching?

Good answer direction:

Look for:

- read-heavy workload,

- repeated access to same data,

- expensive database queries,

- latency requirements,

- backend bottlenecks.

But caching introduces:

- invalidation complexity,

- stale data,

- memory cost,

- hot key risk.

So caching is useful when read patterns and freshness requirements allow it.

## Question 7

Interviewer: What assumptions would you make for a chat system?

Good answer direction:

Ask or assume:

- DAU,

- messages per user per day,

- average message size,

- average recipients per message,

- online vs offline users,

- history retention,

- read receipts,

- peak concurrency,

- delivery latency target.

Then estimate writes, reads, fan-out, storage, and bandwidth.

## Question 8

Interviewer: Why is it dangerous to design only for average traffic?

Good answer direction:

Because real systems experience spikes. If you only handle average load, peak traffic can cause queueing, timeouts, errors, or cascading failures. You need headroom, autoscaling, rate limiting, or graceful degradation depending on requirements.

# Self-Check

Ask yourself honestly:

- Can I explain the difference between functional and non-functional requirements?

- Can I estimate daily requests from DAU and requests per user?

- Can I convert daily requests to average RPS?

- Can I apply a peak factor and explain why?

- Can I distinguish reads from writes and explain why the ratio matters?

- Can I explain latency, throughput, and capacity in simple words?

- Can I explain why p95 latency matters?

- Can I estimate storage from records per day and record size?

- Can I estimate bandwidth from requests and payload size?

- Can I identify likely bottlenecks from estimates?

- Can I explain why jumping to Redis or Kafka without requirements is a mistake?

If you can answer most of these, you are ready to continue.

If not, practice the calculation examples again.

The goal is not memorization.

The goal is comfort with reasoning.

# DSA/Backend/Coding Connection

Capacity thinking connects strongly to data structures, algorithms, and backend coding.

| Programming Concept | System Design Connection |
| --- | --- |
| Big-O complexity | Expensive algorithms become bottlenecks at scale |
| Hash maps | Key-value stores, caching, fast lookups |
| Arrays/lists | Ordered records, pagination |
| Trees/indexes | Database indexes, search structures |
| Graphs | Social networks, dependencies, routes |
| Queues | Background jobs, buffering, async processing |
| Serialization | JSON payloads, request/response bodies |
| Memory usage | Server capacity, cache size |
| I/O operations | Database and disk bottlenecks |
| Concurrency | Handling many simultaneous requests |
| Timeouts | Network and dependency limits |
| Retries | Failure handling |
| Rate limiting | Protecting capacity |

For example, an algorithm that is fine for 100 items may be terrible for 10 million items.

In system design, that becomes:

A query that is fine for one user may become a bottleneck when millions of users execute it every day.

Similarly, a data structure choice in code often mirrors a storage choice in architecture:

- fast lookup by key → hash map / key-value store,

- range queries → sorted structure / database index,

- relationships → graph or relational model,

- append-heavy events → log structure / queue,

- hierarchical data → tree or nested document model.

System design is large-scale programming.

The same principles of efficiency, correctness, and resource limits apply.`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 - System Design", title: "Chapter 1 — What Is System Design?", subtitle: "Part of Part 1 - System Design · Beginner", order: 0, tutorialSlug: "chapter-1-what-is-system-design" },
  { part: "Part 1 - System Design", title: "Chapter 2 — How the Web and Backend Systems Work", subtitle: "Part of Part 1 - System Design · Beginner", order: 1, tutorialSlug: "chapter-2-how-the-web-and-backend-systems-work" },
  { part: "Part 1 - System Design", title: "Chapter 3 — Requirements and Capacity Thinking", subtitle: "Part of Part 1 - System Design · Beginner", order: 2, tutorialSlug: "chapter-3-requirements-and-capacity-thinking" },
]

async function main() {
  const domain = await db.domain.findUnique({ where: { slug: "backend-systems" } })
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
    where: { slug: "system-design-path" },
    create: { slug: "system-design-path", title: "System Design Roadmap", tagline: "The complete roadmap for System Design - all chapters in order.", description: "Follow the course exactly as written: system design foundations, web and backend systems, and requirements and capacity thinking. Each step is one chapter of the System Design subject.", icon: "Network", color: "oklch(0.68 0.2 30)", difficulty: 'beginner', estimatedHours: 6, published: true },
    update: { title: "System Design Roadmap", tagline: "The complete roadmap for System Design - all chapters in order.", description: "Follow the course exactly as written: system design foundations, web and backend systems, and requirements and capacity thinking. Each step is one chapter of the System Design subject.", icon: "Network", color: "oklch(0.68 0.2 30)", difficulty: 'beginner', estimatedHours: 6 },
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
