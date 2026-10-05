import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

// ============================================================
// System Design - imported by scripts/import-course/book.py
// Source: System Design (1).docx (Chapters 1-9)
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
      estimatedMinutes: 270,
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
    {
      slug: "chapter-4-apis-and-system-interfaces",
      title: "Chapter 4 — APIs and System Interfaces",
      summary: "Imagine you are building TaskTracker. Users need to: create tasks, view tasks, update tasks, delete tasks, mark tasks as done.",
      difficulty: "beginner",
      estimatedMinutes: 71,
      order: 3,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should understand:", "what an API is,", "what an endpoint is,", "what a resource is,", "what HTTP methods mean,", "how to design clean URLs,", "how request bodies and response bodies work,", "what headers are used for,", "what JSON is and why APIs use it,", "what status codes mean,", "how to design errors consistently,", "what authentication and authorization mean at the API level,"],
      prerequisites: [],
      whereItFits: "Imagine you are building TaskTracker. Users need to: create tasks, view tasks, update tasks, delete tasks, mark tasks as done.",
      keyTakeaways: ["This chapter taught you that APIs are not just URLs.", "They are architectural contracts.", "You learned:", "an API defines how clients communicate with a system,", "endpoints represent operations,", "resources represent things the system manages,", "HTTP methods express intent,", "GET should be safe,", "POST often creates data and may need idempotency,", "PUT replaces data,"],
      selfAssessment: [],
      content: `# Chapter 4 — APIs and System Interfaces

In Chapter 2, you learned how a browser or mobile app sends an HTTP request to a server.

In Chapter 3, you learned how to clarify requirements and estimate scale before designing a system.

Now we need to connect those two ideas.

A backend system must expose its functionality in a way that clients can use safely, predictably, and efficiently.

That exposed functionality is usually described by an API.

This chapter teaches you what an API is, how to design one, and why API decisions strongly affect the rest of the system architecture.

An API is not just a technical detail.

It is a contract.

It defines:

- what operations the system supports,

- what inputs are allowed,

- what outputs are returned,

- what errors look like,

- how clients authenticate,

- how requests can be retried safely,

- how large responses are controlled,

- how the system can evolve without breaking clients.

If the API is poorly designed, the whole system becomes harder to scale, secure, debug, and maintain.

If the API is well designed, many architectural problems become easier to reason about.

## Why This Matters

Imagine you are building TaskTracker.

Users need to:

- create tasks,

- view tasks,

- update tasks,

- delete tasks,

- mark tasks as done.

Now imagine multiple clients need to use the same backend:

- web browser,

- mobile app,

- desktop app,

- admin dashboard,

- third-party integration,

- internal service.

If each client invents its own way to talk to the backend, the system becomes chaotic.

One client may send:

\`/createTask\`

Another may send:

\`/addTask\`

Another may send:

\`/doAction?action=create\`

This creates problems:

- inconsistent behavior,

- duplicated logic,

- hard-to-test interfaces,

- unclear errors,

- difficult caching,

- difficult security,

- difficult monitoring,

- difficult evolution.

A well-designed API gives all clients one clear contract.

For example:

\`\`\`text
POST /v1/tasks
GET /v1/tasks
GET /v1/tasks/{task_id}
PATCH /v1/tasks/{task_id}
DELETE /v1/tasks/{task_id}

\`\`\`

This is not just prettier.

It affects the entire architecture.

Good API design helps answer questions like:

- Which requests can be cached?

- Which requests are safe to retry?

- Which requests change data?

- Which requests should be rate limited?

- Which requests need strong authorization?

- Which requests may become bottlenecks?

- Which requests should be asynchronous?

- How do we evolve the system without breaking clients?

System design is deeply connected to API design.

## Prerequisites

Before reading this chapter, you should understand:

- what a client is,

- what a server is,

- what a request and response are,

- what HTTP is,

- what HTTPS is,

- what a URL is,

- what headers and bodies are,

- basic status codes,

- functional and non-functional requirements,

- simple traffic estimation.

If you read Chapters 1–3, you are ready.

# Start With a Real-World Problem

Suppose your team builds TaskTracker.

At first, there is only one web client.

The developer creates an endpoint:

\`POST /createTask\`

It accepts form data:

\`title=Study+system+design\`

It returns HTML.

This may work initially.

Then a mobile app team joins.

They want JSON, not HTML.

So another endpoint appears:

\`POST /mobile/createTask\`

Then an internal admin tool needs to create tasks on behalf of users.

So another endpoint appears:

\`POST /admin/createTask\`

Then someone wants to update a task.

They add:

\`POST /updateTask\`

Then someone wants to delete a task.

They add:

\`POST /deleteTask\`

Soon the API looks like this:

- POST /createTask

- POST /updateTask

- POST /deleteTask

- POST /getTasks

- POST /markDone

- POST /mobile/createTask

- POST /admin/createTask

This is a common beginner mistake.

Every action becomes a new verb-based endpoint.

The API becomes hard to understand, hard to secure, hard to cache, and hard to evolve.

Now ask:

What happens when traffic grows?

What happens when a client retries a failed request?

What happens when we need to version the API?

What happens when we need rate limiting?

What happens when we need to add pagination?

What happens when we need to support third-party developers?

A weak API makes all of these harder.

A better API starts with resources and consistent operations.

For example:

\`\`\`text
GET    /v1/tasks
POST   /v1/tasks
GET    /v1/tasks/{task_id}
PATCH  /v1/tasks/{task_id}
DELETE /v1/tasks/{task_id}

\`\`\`

This is simpler, more predictable, and easier to operate.

But the important lesson is not “always use this style.”

The important lesson is:

API design defines the boundary between clients and the backend, and that boundary affects the entire system.

# Intuition

An API is like a menu in a restaurant.

When you eat at a restaurant, you do not walk into the kitchen and start cooking.

You use a menu.

The menu tells you:

- what dishes are available,

- what options exist,

- what modifiers are allowed,

- what you can request,

- what you will receive.

The kitchen can change its internal processes without changing the menu.

For example, the chef may change:

- ingredients,

- cooking method,

- station layout,

- staff schedule,

but as long as the dish ordered from the menu is produced correctly, the customer experience remains stable.

An API works similarly.

It is a contract between:

\`\`\`text
Client
   ↓
API
   ↓
Backend implementation

\`\`\`

The client should not need to know:

- which database is used,

- how many servers exist,

- whether caching is used,

- whether work is asynchronous,

- which internal service handles the request.

The client only needs to know the API.

A good API:

- is predictable,

- is documented,

- enforces rules,

- returns clear errors,

- supports safe retries,

- avoids exposing internal complexity unnecessarily,

- can evolve over time.

A bad API:

- leaks internal implementation details,

- is inconsistent,

- returns unclear errors,

- encourages unsafe retries,

- becomes hard to change,

- creates hidden coupling between clients and backend internals.

# Core Concept

Let us build API design from first principles.

## 1. What Is an API?

### Simple explanation

An API is a defined way for one software component to communicate with another.

### Formal term

Application Programming Interface, or API.

### Example

A TaskTracker backend may expose:

\`GET /v1/tasks\`

This tells clients:

You can request a list of tasks from this endpoint.

### Practical use

APIs are used between:

- browser and backend,

- mobile app and backend,

- service and service,

- partner system and platform,

- internal tool and production system.

An API can be:

- public,

- private,

- internal,

- partner-facing,

- mobile-specific,

- web-specific.

The key idea:

An API is a boundary with rules.

## 2. What Is an Endpoint?

### Simple explanation

An endpoint is a specific address and operation exposed by an API.

### Formal term

Endpoint.

### Example:

\`GET /v1/tasks/{task_id}\`

This endpoint means:

Retrieve one task by its ID.

Another endpoint:

\`POST /v1/tasks\`

This means:

Create a new task.

### Practical use

Endpoints are the individual operations clients can call.

A system may have dozens, hundreds, or thousands of endpoints.

Good endpoint design keeps the API understandable and manageable.

## 3. What Is a Resource?

### Simple explanation

A resource is a thing your API lets clients operate on.

### Formal term

Resource.

### Examples

In TaskTracker:

- task,

- user,

- project,

- comment,

- attachment.

In a blog system:

- post,

- comment,

- author,

- tag.

In a payment system:

- payment,

- refund,

- invoice.

### Practical use

Many modern APIs are designed around resources.

Instead of thinking:

- createTask

- updateTask

- deleteTask

we think:

\`tasks\`

and then apply operations to that resource:

\`\`\`text
GET    /tasks
POST   /tasks
GET    /tasks/{task_id}
PATCH  /tasks/{task_id}
DELETE /tasks/{task_id}

\`\`\`

This does not mean every API must be resource-oriented.

But it is a useful beginner model because it encourages consistency.

## 4. What Is a Collection Endpoint?

A collection endpoint represents a group of resources.

Example:

- GET  /tasks

- POST /tasks

\`/tasks\` can mean:

- list all tasks,

- create a new task.

The HTTP method distinguishes the operation.

### Practical use

Collection endpoints are common for:

- listing items,

- searching items,

- creating new items.

Example:

- GET /tasks?status=open

- POST /tasks

## 5. What Is an Item Endpoint?

An item endpoint represents one specific resource.

Example:

\`\`\`text
GET    /tasks/{task_id}
PATCH  /tasks/{task_id}
DELETE /tasks/{task_id}

\`\`\`

Here \`{task_id}\` is a path parameter.

Example:

\`GET /tasks/123\`

means:

Get task with ID 123.

### Practical use

Item endpoints are used for:

- reading one object,

- updating one object,

- deleting one object,

- performing actions on one object.

## 6. HTTP Methods

HTTP methods describe the intended action of a request.

The most common methods are:

| Method | Simple Meaning | Common Use |
| --- | --- | --- |
| GET | Read data | Retrieve a task list or task details |
| POST | Create or submit | Create a new task |
| PUT | Replace data | Replace a task entirely |
| PATCH | Partial update | Update only the task title |
| DELETE | Remove data | Delete a task |

Let us explain each carefully.

### GET

Use GET to read data.

Example:

- GET /v1/tasks?status=open HTTP/1.1

- Host: tasktracker.example

- Authorization: Bearer token123

GET should not change server state.

That means:

A GET request should not create, update, or delete data.

This is important for caching and safety.

Browsers, proxies, and clients may retry or prefetch GET requests.

If GET changes data, bad things can happen.

Example of bad design:

\`GET /tasks/delete?id=123\`

This is dangerous because a browser prefetch or accidental reload could delete data.

Use:

\`DELETE /v1/tasks/123\`

instead.

### POST

Use POST to create data or trigger an operation.

Example:

\`\`\`text
POST /v1/tasks HTTP/1.1
Host: tasktracker.example
Content-Type: application/json
Authorization: Bearer token123

{
  "title": "Study system design",
  "status": "open"
}

\`\`\`

POST is not automatically idempotent.

That means:

Sending the same POST request multiple times may create multiple resources.

Example:

- POST /tasks

- { "title": "Buy milk" }

If the client sends this twice and the server is not careful, two tasks may be created.

This is why idempotency matters for important POST operations.

We will discuss it soon.

### PUT

Use PUT to replace a resource.

Example:

\`\`\`text
PUT /v1/tasks/123 HTTP/1.1
Content-Type: application/json

{
  "title": "Study system design",
  "status": "done",
  "priority": "high"
}

\`\`\`

PUT usually means:

Replace the entire task with this new representation.

PUT is generally idempotent.

If you send the same PUT request multiple times, the final state should be the same as if you sent it once.

Example:

- Set task 123 title to "Buy milk"

- Set task 123 title to "Buy milk"

- Set task 123 title to "Buy milk"

Final result:

\`title = "Buy milk"\`

PUT is less commonly used than PATCH in many modern APIs, but it is useful when full replacement is intentional.

### PATCH

Use PATCH to update part of a resource.

Example:

\`\`\`text
PATCH /v1/tasks/123 HTTP/1.1
Content-Type: application/json

{
  "status": "done"
}

\`\`\`

This means:

Change only the status field. Leave other fields unchanged.

PATCH is very common for user-facing updates.

However, PATCH is not automatically idempotent unless designed carefully.

For example:

\`\`\`text
{
  "increment_view_count": true
}

\`\`\`

If sent twice, the count may increase twice.

That is not idempotent.

But:

\`\`\`text
{
  "status": "done"
}

\`\`\`

is usually idempotent because setting status to done twice has the same final effect as setting it once.

### DELETE

Use DELETE to remove a resource.

Example:

- DELETE /v1/tasks/123 HTTP/1.1

- Authorization: Bearer token123

DELETE is generally idempotent.

Deleting a task once removes it.

Deleting it again may return:

\`404 Not Found\`

or success, depending on design.

The important point is that the final state is the same: the task is deleted.

## 7. Safety and Idempotency

These two words appear often in API design.

Let us define them simply.

### Safe method

A safe method does not change server state.

GET is safe.

HEAD is also safe, though we will not focus on it.

### Idempotent method

An idempotent method can be applied multiple times without causing additional side effects beyond the first application.

PUT is usually idempotent.

DELETE is usually idempotent.

PATCH may or may not be idempotent.

POST is usually not idempotent unless protected by an idempotency key.

Why does this matter?

Because networks fail.

A client may send a request, receive no response, and retry.

If the operation is not idempotent, retrying may create duplicates.

Example:

- User clicks Pay.

- Client sends POST /payments.

- Server charges card.

- Response is lost.

- Client retries POST /payments.

- Server charges card again.

This is unacceptable.

Good API design anticipates retries.

## 8. Request Structure

An HTTP request has several parts.

Example:

\`\`\`text
POST /v1/tasks HTTP/1.1
Host: tasktracker.example
Authorization: Bearer token123
Content-Type: application/json
Idempotency-Key: 9f8b7c6d-5e4f-4a3b-8c9d-0e1f2a3b4c5d

{
  "title": "Study system design",
  "priority": "high"
}

\`\`\`

Parts:

| Part | Example | Meaning |
| --- | --- | --- |
| Method | POST | Create or submit |
| Path | /v1/tasks | Resource endpoint |
| Query | ?status=open | Optional parameters |
| Headers | Authorization, Content-Type | Metadata |
| Body | JSON object | Main data payload |

## 9. Query Parameters

Query parameters appear after \`?\` in a URL.

Example:

\`GET /v1/tasks?status=open&sort=created_at&limit=20\`

They are commonly used for:

- filtering,

- sorting,

- pagination,

- search terms,

- optional options.

Example:

- GET /v1/tasks?status=open

- GET /v1/tasks?q=design

- GET /v1/tasks?sort=-created_at

- GET /v1/tasks?limit=20&cursor=abc123

Important rule:

Query parameters should not be used to identify the main resource.

For example, this is usually poor:

\`GET /getTask?id=123\`

Better:

\`GET /tasks/123\`

The resource is task 123, so it belongs in the path.

## 10. Path Parameters

Path parameters identify a specific resource.

Example:

- GET /v1/tasks/123

- PATCH /v1/tasks/123

- DELETE /v1/tasks/123

Here \`123\` is the task ID.

Path parameters are good for:

- resource IDs,

- hierarchical relationships,

- specific object operations.

Example:

\`GET /v1/projects/42/tasks\`

This means:

Get tasks belonging to project 42.

Be careful with deep nesting.

This may be okay:

\`GET /v1/projects/42/tasks\`

This may be too deep:

\`GET /v1/users/1/projects/42/tasks/99/comments/7/reactions/3\`

Deep nesting can make APIs rigid and hard to evolve.

## 11. Headers

Headers carry metadata.

Examples:

- Authorization: Bearer token123

- Content-Type: application/json

- Accept: application/json

- Idempotency-Key: 9f8b7c6d-5e4f-4a3b-8c9d-0e1f2a3b4c5d

- X-Request-ID: req_12345

Common request headers:

| Header | Purpose |
| --- | --- |
| Authorization | Authentication credentials |
| Content-Type | Format of request body |
| Accept | Preferred response format |
| Idempotency-Key | Safe retry identifier |
| X-Request-ID | Correlate logs and traces |
| User-Agent | Client identification |
| Cache-Control | Caching instructions |

Common response headers:

| Header | Purpose |
| --- | --- |
| Content-Type | Format of response body |
| Cache-Control | Caching policy |
| ETag | Version identifier for cache validation |
| Retry-After | When client may retry |
| X-RateLimit-Limit | Rate limit allowance |
| X-RateLimit-Remaining | Remaining requests in window |
| X-Request-ID | Request correlation |

Headers are powerful because they allow metadata to be communicated without mixing it into the main payload.

## 12. Request Body

The body contains the main data for the request.

Example:

\`\`\`text
{
  "title": "Study system design",
  "priority": "high",
  "due_date": "2026-10-10"
}

\`\`\`

Bodies are commonly used with:

- POST,

- PUT,

- PATCH.

GET requests usually do not have bodies.

Some HTTP implementations technically allow bodies with GET, but in normal API design, avoid it.

Why?

Because caches, proxies, and clients may not handle GET bodies consistently.

## 13. Response Body

The response body contains the result.

Example:

\`\`\`text
{
  "task_id": "123",
  "title": "Study system design",
  "status": "open",
  "priority": "high",
  "created_at": "2026-10-05T10:30:00Z"
}

\`\`\`

For errors:

\`\`\`text
{
  "error": {
    "code": "validation_error",
    "message": "Title is required",
    "details": [
      {
        "field": "title",
        "issue": "must_not_be_empty"
      }
    ]
  }
}

\`\`\`

A consistent response format makes clients easier to write.

## 14. JSON

### Simple explanation

JSON is a text format for structured data.

### Formal term

JavaScript Object Notation.

### Example:

\`\`\`text
{
  "task_id": 123,
  "title": "Study system design",
  "tags": ["backend", "learning"],
  "completed": false
}


\`\`\`
### Why APIs use JSON

JSON is:

- human-readable,

- widely supported,

- easy to parse,

- good for nested data,

- common in web and mobile ecosystems.

Other formats exist:

| Format | Common Use |
| --- | --- |
| JSON | Web APIs, mobile APIs |
| XML | Older enterprise APIs, some standards |
| Protocol Buffers | High-performance internal services |
| MessagePack | Compact binary serialization |
| CSV | Data export/import |
| Form data | Simple browser forms |

For beginner backend system design, JSON is the default assumption.

## 15. Status Codes

Status codes tell the client the result of a request.

They are part of the API contract.

Common status codes:

| Code | Meaning | Typical Use |
| --- | --- | --- |
| 200 OK | Success | GET succeeded |
| 201 Created | Resource created | POST succeeded |
| 202 Accepted | Request accepted for processing | Async job started |
| 204 No Content | Success, no body | DELETE succeeded |
| 301 Moved Permanently | Permanent redirect | URL changed forever |
| 302 Found | Temporary redirect | URL changed temporarily |
| 304 Not Modified | Cached version still valid | Conditional GET |
| 400 Bad Request | Invalid request | Malformed JSON, invalid parameter |
| 401 Unauthorized | Authentication required or failed | Missing/invalid token |
| 403 Forbidden | Authenticated but not allowed | User cannot access resource |
| 404 Not Found | Resource not found | Unknown task ID |
| 405 Method Not Allowed | Method not supported | POST to read-only endpoint |
| 409 Conflict | Conflict with current state | Duplicate creation |
| 410 Gone | Resource intentionally removed | Deleted permanently |
| 413 Payload Too Large | Request body too large | File too big |
| 415 Unsupported Media Type | Wrong content type | Expected JSON, got XML |
| 422 Unprocessable Entity | Syntactically valid but semantically wrong | Valid JSON but business rule fails |
| 429 Too Many Requests | Rate limited | Too many calls |
| 500 Internal Server Error | Unexpected server failure | Bug or crash |
| 501 Not Implemented | Operation not supported | Endpoint not built yet |
| 502 Bad Gateway | Invalid response from upstream | Proxy/backend issue |
| 503 Service Unavailable | Temporarily unavailable | Overload/maintenance |
| 504 Gateway Timeout | Upstream timed out | Dependency too slow |

Beginners often misuse status codes.

Important distinctions:

### 400 vs 422

Use 400 when the request itself is malformed.

Example:

- Invalid JSON

- Unknown query parameter

- Wrong type

Use 422 when the request is syntactically valid but cannot be processed due to semantic errors.

Example:

\`\`\`text
{
  "email": "not-an-email"
}

\`\`\`

The JSON is valid, but the value is invalid.

Some APIs simply use 400 for both. That is acceptable if consistent.

### 401 vs 403

Use 401 when the client has not authenticated.

Meaning:

Who are you?

Use 403 when the client is authenticated but not allowed.

Meaning:

I know who you are, but you cannot do this.

Example:

- No token → 401

- Valid token but user tries to delete another user's task → 403

### 404 vs 403

This is subtle.

If a resource exists but the user cannot access it, should the API return 403 or 404?

Both can be correct depending on security requirements.

Returning 404 hides existence.

Example:

\`GET /private-documents/999\`

If the document exists but belongs to another user, returning 404 may prevent attackers from discovering which IDs exist.

Returning 403 tells the client:

This resource exists, but you are forbidden.

For many public APIs, 403 is clearer.

For sensitive systems, 404 may be safer.

This is a trade-off.

### 500 vs 503

Use 500 for unexpected server errors.

Use 503 when the service is temporarily unable to handle requests, such as overload or maintenance.

Example:

\`\`\`text
Bug in code → 500
Database overloaded → 503
Deployment in progress → 503
Dependency down → 502/503/504 depending on architecture

\`\`\`

## 16. Error Design

A good API returns errors in a consistent format.

Bad error:

\`Something went wrong\`

Worse error:

\`NullPointerException at com.example.TaskService.create(TaskService.java:87)\`

This leaks internal details and is not useful to the client.

Better error:

\`\`\`text
{
  "error": {
    "code": "task_title_required",
    "message": "Task title is required.",
    "request_id": "req_12345"
  }
}

\`\`\`

For validation errors:

\`\`\`text
{
  "error": {
    "code": "validation_error",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "title",
        "code": "required",
        "message": "Title must not be empty."
      },
      {
        "field": "priority",
        "code": "invalid_enum",
        "message": "Priority must be low, medium, or high."
      }
    ],
    "request_id": "req_12345"
  }
}

\`\`\`

Why include \`request_id\`?

Because it helps support engineers and users correlate logs.

If a user reports an error, they can provide the request ID.

Then engineers can find the corresponding log entry.

## 17. Authentication at the API Level

Authentication means:

Verifying who the caller is.

Common API authentication methods:

| Method | Simple Description |
| --- | --- |
| API key | A secret string identifying a client |
| Session cookie | Browser cookie representing a logged-in session |
| Bearer token | Token sent in Authorization header |
| JWT | Signed token containing claims |
| OAuth 2.0 | Delegated authorization framework |
| mTLS | Mutual TLS, often for service-to-service security |

For beginner web APIs, the most common pattern is:

\`Authorization: Bearer <token>\`

Example:

- GET /v1/tasks HTTP/1.1

- Host: tasktracker.example

- Authorization: Bearer eyJhbGciOi...

The server validates the token and determines the user identity.

Important:

Authentication is not the same as authorization.

Authentication:

Who are you?

Authorization:

Are you allowed to do this?

Example:

- Authenticated user: Alice

- Requested resource: Bob's private task

- Result: 403 Forbidden

## 18. Authorization at the API Level

Authorization decides whether an authenticated caller can perform an operation.

Examples:

- Can this user read this task?

- Can this user delete this project?

- Can this admin impersonate a user?

- Can this service call this internal endpoint?

Common authorization models:

| Model | Simple Idea |
| --- | --- |
| Ownership check | User can access only their own resources |
| Role-based access control, RBAC | Roles grant permissions |
| Attribute-based access control, ABAC | Decisions depend on attributes/context |
| Policy-based | External policy engine decides |

Example ownership check:

- Task belongs to user_id = 42

- Requesting user_id = 42

- Allowed

Example RBAC:

- User role = admin

- Admin can delete any task

- Allowed

API design must make authorization easy to enforce consistently.

If authorization logic is scattered across many endpoints, mistakes happen.

## 19. Idempotency

### Simple explanation

Idempotency means:

Doing the same thing multiple times has the same effect as doing it once.

### Formal term

Idempotent operation.

### Example without idempotency

Client sends:

\`\`\`text
POST /v1/payments
{
  "amount": 100,
  "currency": "USD"
}

\`\`\`

Network fails after server charges card.

Client retries.

Server charges card again.

Bad.

### Example with idempotency key

Client sends:

\`\`\`text
POST /v1/payments
Idempotency-Key: pay_12345
{
  "amount": 100,
  "currency": "USD"
}

\`\`\`

Server stores:

\`Idempotency key pay_12345 → payment result\`

If the same key arrives again, server returns the original result instead of charging again.

This makes retries safe.

### Where idempotency matters

Especially important for:

- payments,

- order creation,

- message sending,

- ticket booking,

- inventory reservation,

- any operation with external side effects.

### API design implication

If an endpoint is retry-sensitive, design it with idempotency in mind.

Possible mechanisms:

- client-generated idempotency key,

- unique business key,

- database uniqueness constraint,

- deduplication table,

- request hash plus key.

Example:

\`Idempotency-Key: 7c9e6679-7425-40de-944b-e07fc1f90ae7\`

The server may store the key for a limited time, such as 24 hours.

## 20. Pagination

### Why pagination exists

If a user has 100,000 tasks, returning all tasks in one response is dangerous.

Problems:

- huge response body,

- high memory usage,

- slow serialization,

- network saturation,

- client rendering freeze,

- database strain.

Pagination limits the amount of data returned at once.

Example:

\`GET /v1/tasks?limit=20\`

returns at most 20 tasks.

### Offset Pagination

Offset pagination uses a starting position.

Example:

- GET /v1/tasks?limit=20&offset=0

- GET /v1/tasks?limit=20&offset=20

- GET /v1/tasks?limit=20&offset=40

Response:

\`\`\`text
{
  "items": [...],
  "limit": 20,
  "offset": 20,
  "total": 1500
}

\`\`\`

Advantages:

- simple,

- allows jumping to page numbers,

- easy for admin tables.

Disadvantages:

- can become slow for large offsets,

- data may shift if new items are inserted,

- duplicates or missing items can occur without stable ordering.

Example problem:

If new tasks are inserted at the top while the user pages through results, page boundaries may shift.

### Cursor Pagination

Cursor pagination uses an opaque pointer to the next page.

Example:

\`GET /v1/tasks?limit=20\`

Response:

\`\`\`text
{
  "items": [...],
  "next_cursor": "eyJpZCI6MTIzfQ"
}

\`\`\`

Next request:

\`GET /v1/tasks?limit=20&cursor=eyJpZCI6MTIzfQ\`

Advantages:

- efficient for large datasets,

- stable for feeds and timelines,

- avoids deep offset problems.

Disadvantages:

- cannot easily jump to arbitrary page numbers,

- cursor format should be opaque,

- requires stable ordering.

Cursor pagination is often better for:

- social feeds,

- chat history,

- event streams,

- large mobile lists.

Offset pagination may be acceptable for:

- admin dashboards,

- small datasets,

- pages where jumping to page 7 is required.

### Maximum Page Size

Always enforce a maximum page size.

Bad:

\`GET /v1/tasks?limit=1000000\`

Good:

\`limit max = 100\`

If client requests more than allowed, either:

- clamp to max, or

- return 400 Bad Request.

Be consistent.

## 21. Filtering, Sorting, and Searching

APIs often need optional parameters.

Filtering:

- GET /v1/tasks?status=open

- GET /v1/tasks?priority=high

- GET /v1/tasks?due_before=2026-10-10

Sorting:

- GET /v1/tasks?sort=created_at

- GET /v1/tasks?sort=-created_at

A leading \`-\` may mean descending order.

Searching:

\`GET /v1/tasks?q=system+design\`

Combining:

\`GET /v1/tasks?status=open&q=design&sort=-created_at&limit=20\`

Important architectural point:

Every filter and sort option may require database indexes.

If users frequently query:

\`WHERE user_id = ? AND status = ? ORDER BY created_at DESC\`

then a composite index may be needed:

\`(user_id, status, created_at)\`

API design and database design are connected.

## 22. API Versioning

Systems change.

An API that worked yesterday may need to change tomorrow.

Versioning helps avoid breaking existing clients.

Common versioning strategies:

### URL versioning

- GET /v1/tasks

- GET /v2/tasks

Advantages:

- simple,

- visible,

- easy to route,

- easy to cache.

Disadvantages:

- URLs change,

- can encourage large breaking versions.

### Header versioning

\`Accept-Version: v1\`

or:

\`X-API-Version: 1\`

Advantages:

- URLs remain stable.

Disadvantages:

- harder to debug,

- less visible,

- caching and routing can become more complex.

### Query parameter versioning

\`GET /tasks?version=1\`

Usually not recommended as the primary strategy because versioning is not really a resource filter.

### No explicit versioning, backward-compatible evolution

Change API carefully without breaking old clients.

Example:

- add optional fields,

- avoid removing fields,

- avoid changing field meanings,

- deprecate gradually.

Advantages:

- simpler surface area.

Disadvantages:

- difficult when breaking changes are unavoidable.

For beginner system design, URL versioning is often the clearest:

- /v1/

- /v2/

But you should explain the trade-off.

## 23. Deprecation

If you version APIs, you must also retire old versions.

A good deprecation process:

- Announce future removal.

- Add warning header.

- Monitor usage.

- Provide migration guide.

- Remove only after deadline.

Example response header:

- Deprecation: true

- Sunset: Sat, 01 Jan 2027 00:00:00 GMT

- Link: </v2/tasks>; rel="successor-version"

This is advanced, but important in real platforms.

## 24. Rate Limiting

Rate limiting restricts how many requests a client can make in a time window.

Why?

To protect:

- backend capacity,

- database,

- fairness,

- abuse prevention,

- cost control.

Example:

\`100 requests per minute per user\`

If exceeded:

- HTTP/1.1 429 Too Many Requests

- Retry-After: 30

Common rate limit headers:

- X-RateLimit-Limit: 100

- X-RateLimit-Remaining: 42

- X-RateLimit-Reset: 1767628800

Rate limiting can be applied at:

- API gateway,

- load balancer,

- application server,

- per endpoint,

- per user,

- per API key,

- per IP,

- per tenant.

API design should decide which endpoints are expensive and need stricter limits.

Example:

\`\`\`text
GET /tasks → moderate limit
POST /tasks → moderate limit
POST /reports/export → strict limit
POST /password/reset → very strict limit

\`\`\`

## 25. Caching-Friendly API Design

Caching can dramatically reduce backend load.

But caching depends heavily on API design.

GET requests are usually cacheable.

POST, PUT, PATCH, DELETE are usually not cacheable in the same way.

Example:

\`GET /v1/tasks/123\`

may be cached.

But if the task is private, caching must be careful.

Use headers:

- Cache-Control: private, max-age=30

- ETag: "version-17"

The client can later ask:

- GET /v1/tasks/123

- If-None-Match: "version-17"

If unchanged, server returns:

\`304 Not Modified\`

This saves bandwidth.

API design implications:

- Use stable resource URLs.

- Use ETags or version fields.

- Avoid unnecessary dynamic data in cacheable responses.

- Separate public and private cacheability.

- Do not put secrets in URLs if caching may store them.

We will study caching deeply later, but API design is where cacheability begins.

## 26. Synchronous vs Asynchronous API Patterns

Some operations can complete quickly.

Example:

\`Create a task\`

The server can save it and respond immediately.

Some operations are slow.

Example:

- Generate a large report

- Transcode a video

- Process a bulk import

- Send millions of notifications

If the client waits, the request may time out.

An asynchronous API pattern may be better.

Example:

\`\`\`text
POST /v1/reports
{
  "type": "monthly_usage",
  "month": "2026-09"
}

\`\`\`

Response:

\`\`\`text
HTTP/1.1 202 Accepted
{
  "job_id": "job_987",
  "status_url": "/v1/jobs/job_987"
}

\`\`\`

Client later checks:

\`GET /v1/jobs/job_987\`

Response:

\`\`\`text
{
  "job_id": "job_987",
  "status": "running",
  "progress": 45
}

\`\`\`

When finished:

\`\`\`text
{
  "job_id": "job_987",
  "status": "succeeded",
  "result_url": "/v1/reports/rpt_555/download"
}

\`\`\`

This changes architecture:

- API server accepts work quickly.

- Queue stores job.

- Workers process job.

- Status is stored somewhere.

- Client polls or receives webhook.

Asynchronous APIs improve responsiveness but add complexity.

## 27. Webhooks

A webhook is a callback from server to client.

Instead of client polling:

- Is it done yet?

- Is it done yet?

- Is it done yet?

the server sends an event:

\`It is done.\`

Example:

\`\`\`text
POST
{
  "event": "payment.succeeded",
  "payment_id": "pay_123"
}

\`\`\`

Webhooks require:

- retries,

- signatures,

- idempotent handling,

- ordering considerations,

- security.

They are common in payment APIs, third-party integrations, and event-driven systems.

## 28. API Styles

There are several API styles.

You do not need to master all now, but you should know the landscape.

### REST-style APIs

Resource-oriented.

Example:

- GET    /tasks

- POST   /tasks

- GET    /tasks/123

- PATCH  /tasks/123

- DELETE /tasks/123

Uses HTTP methods, status codes, URLs, headers.

Common for public web APIs.

### RPC-style APIs

Operation-oriented.

Example:

- POST /CreateTask

- POST /UpdateTask

- POST /DeleteTask

Can be simple, but may become inconsistent if not designed carefully.

Common in internal systems, especially with gRPC.

### gRPC

A high-performance RPC framework often using Protocol Buffers.

Example conceptually:

\`\`\`text
service TaskService {
  rpc CreateTask(CreateTaskRequest) returns (CreateTaskResponse);
}

\`\`\`

Advantages:

- fast,

- typed,

- good for internal service-to-service communication.

Disadvantages:

- less browser-friendly,

- requires tooling,

- not always ideal for public REST-like APIs.

### GraphQL

Client asks for exactly the fields it needs.

Example conceptually:

\`\`\`text
query {
  task(id: "123") {
    title
    status
    assignee {
      name
    }
  }
}

\`\`\`

Advantages:

- flexible client queries,

- reduces over-fetching,

- useful for complex frontends.

Disadvantages:

- harder caching,

- harder rate limiting,

- complex server resolution,

- risk of expensive queries.

GraphQL is powerful but not automatically better.

### WebSockets

Persistent bidirectional connection.

Useful for:

- chat,

- live updates,

- collaborative editing,

- real-time dashboards.

Not a replacement for normal request-response APIs.

Often used alongside HTTP APIs.

## 29. How API Design Affects Architecture

This is the most important systems-thinking part of the chapter.

APIs are not isolated.

They shape architecture.

### API endpoints define access patterns

If clients frequently call:

\`GET /tasks?status=open&sort=-created_at\`

the database likely needs an index:

\`(user_id, status, created_at)\`

If clients frequently call:

\`GET /users/{user_id}/friends\`

you may need friendship tables, join tables, or denormalized friend lists.

API access patterns drive data model design.

### API payload size affects bandwidth

If:

\`GET /tasks\`

returns full task objects with descriptions, comments, attachments, and history, responses may become huge.

Better API design may return summaries:

\`\`\`text
{
  "task_id": 123,
  "title": "Study system design",
  "status": "open",
  "updated_at": "..."
}

\`\`\`

and provide details separately:

\`GET /tasks/123\`

This reduces bandwidth and improves scalability.

### API caching depends on endpoint semantics

Cacheable:

\`GET /products/123\`

Harder to cache:

\`GET /feed?user_id=42&timestamp=now\`

Private user data may still be cacheable, but only with private cache controls.

API design must decide:

- what is public,

- what is private,

- what changes often,

- what can be stale,

- what needs freshness.

### API retries require idempotency

If clients retry:

\`POST /orders\`

without idempotency, duplicate orders may occur.

So architecture may need:

- idempotency key store,

- unique constraints,

- request deduplication,

- careful database transactions.

### API rate limits protect downstream systems

If one endpoint is expensive:

\`POST /analytics/export\`

it may need stricter limits than:

\`GET /tasks\`

Rate limiting can be implemented at:

- gateway,

- service,

- database-aware layer.

### API versioning affects deployment

If \`/v1\` and \`/v2\` coexist, the system may run multiple implementations.

This affects:

- routing,

- monitoring,

- deprecation,

- cost,

- operational complexity.

### API authentication affects security architecture

If all endpoints require user tokens, the gateway or service must validate tokens.

If internal services call each other, they may need service-to-service authentication.

API design determines where security checks happen.

### API observability depends on request identifiers

Good APIs include request IDs.

Example:

\`X-Request-ID: req_12345\`

This allows logs, metrics, and traces to be correlated.

Without request IDs, debugging distributed systems becomes much harder.

# Important Terminology

| Term | Plain Explanation |
| --- | --- |
| API | Contract for how components communicate |
| Endpoint | Specific API operation address |
| Resource | Thing the API operates on |
| Collection | Group of resources, e.g. /tasks |
| Item | Single resource, e.g. /tasks/123 |
| HTTP method | Action type: GET, POST, PUT, PATCH, DELETE |
| Request body | Main data sent by client |
| Response body | Main data returned by server |
| Header | Metadata attached to request/response |
| Query parameter | Optional parameter after ? |
| Path parameter | Parameter identifying resource in URL path |
| Status code | Numeric result of request |
| JSON | Common structured data format |
| Authentication | Verifying identity |
| Authorization | Checking permissions |
| Idempotency | Repeating request has same effect as once |
| Idempotency key | Client-provided key for safe retries |
| Pagination | Splitting large result sets into pages |
| Cursor | Opaque pointer to next page |
| Offset | Numerical starting position for pagination |
| Filtering | Restricting results by criteria |
| Sorting | Ordering results |
| Versioning | Managing API changes over time |
| Rate limiting | Restricting request frequency |
| Cacheability | Whether response can be stored and reused |
| ETag | Version identifier for cache validation |
| Webhook | Server-initiated callback to client |
| REST | Resource-oriented API style |
| RPC | Remote procedure call style |
| GraphQL | Query language for APIs |
| gRPC | High-performance RPC framework |
| WebSocket | Persistent bidirectional connection |

# Mental Model

A useful API design mental model is:

\`\`\`text
Requirements
   ↓
Resources
   ↓
Operations
   ↓
HTTP Methods
   ↓
Input/Output Contracts
   ↓
Errors
   ↓
Auth/Authz
   ↓
Pagination/Filtering
   ↓
Idempotency
   ↓
Versioning
   ↓
Rate Limiting
   ↓
Architecture Implications

\`\`\`

Do not start with:

\`What framework should I use?\`

Start with:

\`What operations does the system need to support?\`

Then:

- What data do clients need to send?

- What data do clients need to receive?

- What errors must be clear?

- What requests must be retry-safe?

- What responses can be cached?

- What endpoints are expensive?

# Architecture Diagram

Let us place APIs inside a backend architecture.

## Simple API Architecture

- [Client]

- |

- | HTTPS request

- v

- [API Server]

- |

- | read/write

- v

- [Database]

This is the minimum.

The API server exposes endpoints and talks to the database.

## More Realistic API Architecture

- [Browser / Mobile App]

- |

- | HTTPS API request

- v

- [API Gateway / Load Balancer]

- |

- | routing, TLS, rate limiting

- v

- [Task API Service]

- |

- | authentication

- | validation

- | business rules

- |

- +--> [Cache]

- |

- +--> [Database]

- |

- +--> [Message Queue]

Let us explain each component.

## API Gateway / Load Balancer

This may sit in front of the API service.

It can handle:

- routing,

- TLS termination,

- load balancing,

- rate limiting,

- request IDs,

- basic authentication checks,

- blocking abusive traffic.

Do not think of it as mandatory for every system.

A small app may have only one API server.

But as traffic and security needs grow, an edge layer becomes useful.

## Task API Service

This is the application layer.

It handles:

- parsing requests,

- validating input,

- authenticating users,

- authorizing actions,

- applying business rules,

- reading/writing data,

- returning responses.

This is where the API contract is implemented.

## Cache

The API service may check cache before database.

Example:

\`GET /tasks/123\`

may be served from cache if valid.

Caching depends on API design:

- cacheable endpoint,

- stable key,

- acceptable staleness,

- invalidation strategy.

## Database

The database stores persistent data.

API endpoints determine what queries are needed.

Example:

\`GET /tasks?status=open\`

may require:

\`\`\`text
SELECT ...
FROM tasks
WHERE user_id = ?
  AND status = 'open'
ORDER BY created_at DESC
LIMIT ?;

\`\`\`

The API shape influences database indexes and performance.

## Message Queue

Some API operations may publish background jobs.

Example:

\`POST /tasks/123/comments\`

may:

- save comment,

- publish notification event.

The queue decouples fast API response from slower notification delivery.

# Step-by-Step Request Flow

Let us trace an important request:

\`Create a task\`

API:

\`POST /v1/tasks\`

Headers:

- Authorization: Bearer token123

- Content-Type: application/json

- Idempotency-Key: task_create_987

Body:

\`\`\`text
{
  "title": "Study system design",
  "priority": "high"
}

\`\`\`

## Step 1: Client Prepares Request

The client:

- gets user token,

- builds JSON body,

- generates idempotency key,

- sends HTTPS request.

## Step 2: DNS and Network

The client resolves:

\`tasktracker.example\`

to an IP address.

Then it opens a secure HTTPS connection.

You learned this in Chapter 2.

## Step 3: API Gateway / Load Balancer

The request reaches the edge.

The edge may:

- terminate TLS,

- assign a request ID,

- apply rate limiting,

- route to a healthy API server.

Example header added:

\`X-Request-ID: req_555\`

## Step 4: API Server Receives Request

The API server:

- parses method, path, headers, body,

- checks Content-Type,

- validates JSON structure,

- checks authentication token,

- identifies user ID.

If token invalid:

\`401 Unauthorized\`

If user authenticated but not allowed:

\`403 Forbidden\`

## Step 5: Validation

The server validates:

- title not empty,

- title length acceptable,

- priority valid,

- user allowed to create tasks.

If invalid:

\`400 Bad Request\`

or:

\`422 Unprocessable Entity\`

with structured error.

## Step 6: Idempotency Check

The server checks whether \`Idempotency-Key: task_create_987\` has been seen before.

If yes:

- return previously stored response,

- do not create another task.

If no:

- continue.

## Step 7: Business Logic

The server applies rules:

- generate task ID,

- set status to open,

- set created_at,

- set updated_at,

- assign owner user ID.

## Step 8: Database Write

The server inserts the task.

Conceptual SQL:

\`\`\`text
INSERT INTO tasks (
  task_id,
  user_id,
  title,
  priority,
  status,
  created_at,
  updated_at
) VALUES (
  123,
  42,
  'Study system design',
  'high',
  'open',
  NOW(),
  NOW()
);

\`\`\`

## Step 9: Store Idempotency Result

The server stores:

\`Idempotency key task_create_987 → response 201 + task JSON\`

This may be in database, cache, or dedicated store.

## Step 10: Optional Background Work

The server may publish an event:

\`TaskCreated\`

to a queue for:

- analytics,

- notifications,

- search indexing.

The API response does not need to wait for all background work.

## Step 11: Response

The server returns:

\`\`\`text
HTTP/1.1 201 Created
Location: /v1/tasks/123
Content-Type: application/json
X-Request-ID: req_555

{
  "task_id": "123",
  "title": "Study system design",
  "priority": "high",
  "status": "open",
  "created_at": "2026-10-05T10:30:00Z"
}

\`\`\`

## Step 12: Client Updates UI

The client shows the new task.

If the response is lost and client retries with the same idempotency key, the server returns the same result without creating a duplicate.

# Failure Case in Request Flow

Let us examine failures.

## Failure 1: Invalid JSON

Request body:

\`{ title: Study system design }\`

Missing quotes.

Server should return:

\`400 Bad Request\`

**Error:**

\`\`\`text
{
  "error": {
    "code": "malformed_json",
    "message": "Request body is not valid JSON."
  }
}

\`\`\`

## Failure 2: Missing Authentication

No token.

Server returns:

\`401 Unauthorized\`

## Failure 3: User Not Allowed

Authenticated user tries to create task for another user without permission.

Server returns:

\`403 Forbidden\`

## Failure 4: Validation Failure

Empty title.

Server returns:

\`422 Unprocessable Entity\`

with field details.

## Failure 5: Database Timeout

Server cannot save task.

Server returns:

\`503 Service Unavailable\`

or:

\`500 Internal Server Error\`

depending on policy.

If using idempotency, client may retry safely.

## Failure 6: Response Lost After Save

Database saved task, but response did not reach client.

Client retries with same idempotency key.

Server sees key already exists and returns original success response.

No duplicate task is created.

## Failure 7: Rate Limit Exceeded

Client sends too many requests.

Server returns:

- 429 Too Many Requests

- Retry-After: 30

# Simple Example: TaskTracker API

Let us design a minimal API for TaskTracker.

## Functional Requirements

Users can:

- register,

- log in,

- create tasks,

- list tasks,

- view task,

- update task,

- delete task,

- mark task done.

## API Endpoints

### Authentication

- POST /v1/auth/register

- POST /v1/auth/login

- POST /v1/auth/logout

Example login request:

\`\`\`text
{
  "email": "",
  "password": "secret123"
}

\`\`\`

Example login response:

\`\`\`text
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600
}

\`\`\`

### Tasks

\`\`\`text
GET    /v1/tasks
POST   /v1/tasks
GET    /v1/tasks/{task_id}
PATCH  /v1/tasks/{task_id}
DELETE /v1/tasks/{task_id}
POST   /v1/tasks/{task_id}/complete

\`\`\`

Maybe \`complete\` is an action endpoint.

Alternative:

\`\`\`text
PATCH /v1/tasks/{task_id}
{
  "status": "done"
}

\`\`\`

Both can be reasonable.

The action endpoint is clearer for some workflows.

The PATCH endpoint is more resource-oriented.

Choose based on consistency and domain semantics.

## Example: List Tasks

Request:

- GET /v1/tasks?status=open&limit=20&sort=-created_at HTTP/1.1

- Host: tasktracker.example

- Authorization: Bearer token123

Response:

\`\`\`text
{
  "items": [
    {
      "task_id": "123",
      "title": "Study system design",
      "status": "open",
      "created_at": "2026-10-05T10:30:00Z"
    }
  ],
  "next_cursor": "eyJpZCI6MTIzfQ",
  "has_more": true
}

\`\`\`

## Example: Create Task

Request:

\`\`\`text
POST /v1/tasks HTTP/1.1
Authorization: Bearer token123
Content-Type: application/json
Idempotency-Key: 9f8b7c6d-5e4f-4a3b-8c9d-0e1f2a3b4c5d

{
  "title": "Buy milk",
  "priority": "medium"
}

\`\`\`

Response:

\`\`\`text
HTTP/1.1 201 Created
Location: /v1/tasks/124

{
  "task_id": "124",
  "title": "Buy milk",
  "priority": "medium",
  "status": "open",
  "created_at": "2026-10-05T10:35:00Z"
}

\`\`\`

## Example: Update Task

Request:

\`\`\`text
PATCH /v1/tasks/124 HTTP/1.1
Authorization: Bearer token123
Content-Type: application/json

{
  "status": "done"
}

\`\`\`

Response:

\`\`\`text
HTTP/1.1 200 OK

{
  "task_id": "124",
  "title": "Buy milk",
  "priority": "medium",
  "status": "done",
  "updated_at": "2026-10-05T10:40:00Z"
}

\`\`\`

## Example: Delete Task

Request:

- DELETE /v1/tasks/124 HTTP/1.1

- Authorization: Bearer token123

Response:

\`HTTP/1.1 204 No Content\`

No body.

# Practical Example: Photo Sharing API

Now consider a photo-sharing system.

Users can:

- upload photos,

- add captions,

- view their photos,

- share photos,

- delete photos.

A simple API:

\`\`\`text
POST   /v1/photos
GET    /v1/photos
GET    /v1/photos/{photo_id}
PATCH  /v1/photos/{photo_id}
DELETE /v1/photos/{photo_id}
POST   /v1/photos/{photo_id}/share

\`\`\`

## Upload Problem

Photos can be large.

If the client sends the full photo directly to the API server:

- POST /v1/photos

- Content-Type: image/jpeg

- <binary photo>

the API server must handle large uploads.

This may cause:

- memory pressure,

- timeouts,

- bandwidth saturation,

- slow responses.

A better pattern may be:

- 1. Client asks API for upload permission.

- 2. API returns temporary upload URL.

- 3. Client uploads file directly to storage.

- 4. Client tells API upload completed.

- 5. API stores metadata and triggers processing.

Conceptual API:

\`POST /v1/upload-intents\`

Request:

\`\`\`text
{
  "filename": "sunset.jpg",
  "content_type": "image/jpeg",
  "size_bytes": 3145728
}

\`\`\`

Response:

\`\`\`text
{
  "upload_id": "upl_123",
  "upload_url": "",
  "expires_at": "2026-10-05T10:45:00Z"
}

\`\`\`

Client uploads to storage.

Then:

\`POST /v1/photos\`

Request:

\`\`\`text
{
  "upload_id": "upl_123",
  "caption": "Sunset beach"
}

\`\`\`

Response:

\`\`\`text
{
  "photo_id": "ph_456",
  "status": "processing",
  "thumbnail_url": null
}

\`\`\`

Later, thumbnail is ready:

\`GET /v1/photos/ph_456\`

Response:

\`\`\`text
{
  "photo_id": "ph_456",
  "caption": "Sunset beach",
  "status": "ready",
  "image_url": "",
  "thumbnail_url": ""
}

\`\`\`

This API design changes architecture:

- API server does not stream huge files,

- object storage handles uploads,

- background workers generate thumbnails,

- CDN serves images,

- metadata database tracks photo state.

This is a powerful lesson:

API design often determines whether your backend remains simple or becomes overloaded.

# Scaling Example

Now let us think about growth.

Suppose TaskTracker grows from 1,000 users to 1,000,000 users.

How does API design affect scaling?

## Scaling Problem 1: Large Lists

Bad endpoint:

\`GET /v1/tasks\`

returns all tasks.

If a user has 100,000 tasks, response becomes huge.

Fix:

\`GET /v1/tasks?limit=20&cursor=...\`

This reduces memory, bandwidth, and database load.

## Scaling Problem 2: Repeated Reads

Many clients repeatedly request the same data.

Example:

\`GET /v1/tasks/123\`

If the task rarely changes, caching helps.

API can support caching:

- Cache-Control: private, max-age=30

- ETag: "v17"

Client can revalidate:

- GET /v1/tasks/123

- If-None-Match: "v17"

Server returns:

\`304 Not Modified\`

This saves bandwidth.

## Scaling Problem 3: Expensive Searches

Endpoint:

\`GET /v1/tasks?q=some+long+search+term\`

may require full-text search.

A relational database may not be ideal at scale.

Architecture may add:

- search index,

- Elasticsearch/OpenSearch-like system,

- denormalized search documents.

API design may separate:

- GET /v1/tasks

- GET /v1/search/tasks?q=...

to make expensive operations explicit and rate-limited.

## Scaling Problem 4: Write Bursts

Endpoint:

\`POST /v1/tasks\`

may receive bursts.

If each request does heavy work synchronously:

- send email,

- update search index,

- compute analytics,

- notify followers,

the API becomes slow.

Fix:

- save core task,

- publish events,

- return quickly,

- process side effects asynchronously.

API response:

\`\`\`text
{
  "task_id": "123",
  "status": "created"
}

\`\`\`

Background systems handle the rest.

## Scaling Problem 5: Abusive Clients

One client may flood the API.

Fix:

- rate limiting,

- quotas,

- API keys,

- per-user limits,

- per-endpoint limits,

- blocking repeated violations.

API should communicate limits clearly:

- 429 Too Many Requests

- Retry-After: 10

# Failure Scenario

Let us practice failure thinking for APIs.

## Failure 1: Client Sends Wrong Content-Type

Client sends XML but API expects JSON.

Server should return:

\`415 Unsupported Media Type\`

## Failure 2: Client Uses Wrong Method

Client sends:

\`GET /v1/tasks\`

to create a task.

Server should return:

\`405 Method Not Allowed\`

## Failure 3: Resource Does Not Exist

Client requests:

\`GET /v1/tasks/999999\`

Server returns:

\`404 Not Found\`

## Failure 4: Duplicate Creation

Client tries to create a task with a unique constraint, such as:

\`one active task per project per user\`

Server returns:

\`409 Conflict\`

**Error:**

\`\`\`text
{
  "error": {
    "code": "duplicate_task",
    "message": "An active task already exists for this project."
  }
}

\`\`\`

## Failure 5: Server Crash During Request

If the server crashes before committing data, no change occurs.

Client may retry.

If the operation is idempotent or protected by idempotency key, retry is safe.

## Failure 6: Database Slow

API may time out.

Possible responses:

\`504 Gateway Timeout\`

or:

\`503 Service Unavailable\`

The API should not hang forever.

Timeouts must be configured.

## Failure 7: Authentication Service Down

If token validation depends on an external auth service and that service fails, the API may reject all requests.

This is a single point of failure.

Mitigations:

- local token validation for JWTs,

- cached introspection,

- circuit breakers,

- degraded modes where safe.

## Failure 8: Rate Limiter Down

If rate limiter fails open, system may be overloaded.

If it fails closed, legitimate users may be blocked.

Choice depends on risk.

For public APIs, failing open with alerts may be preferable.

For payment APIs, failing closed may be safer.

This is a trade-off.

# Trade-Offs

API design is full of trade-offs.

Let us examine major ones.

## Trade-Off 1: Resource-Oriented REST vs Action-Oriented RPC

### Resource-oriented

- GET    /tasks

- POST   /tasks

- PATCH  /tasks/123

- DELETE /tasks/123

Advantages:

- predictable,

- aligns with HTTP,

- easier caching,

- easier documentation,

- good for public APIs.

Disadvantages:

- some business actions do not fit cleanly,

- can become verbose.

Example awkward action:

\`Transfer money from account A to account B\`

Resource-oriented may use:

\`POST /transfers\`

which is actually fine.

But some operations are naturally actions.

### Action-oriented RPC

- POST /CreateTask

- POST /TransferMoney

- POST /CancelOrder

Advantages:

- explicit operations,

- can be simpler for complex workflows,

- common in internal systems.

Disadvantages:

- may ignore HTTP semantics,

- caching and tooling may be less natural,

- can become inconsistent if not governed.

When to use:

- Public web APIs: resource-oriented often works well.

- Internal high-performance services: RPC/gRPC may be better.

- Complex domain commands: action endpoints may be clearer.

Do not treat REST as a religion.

Choose based on team, clients, and operational needs.

## Trade-Off 2: JSON vs Binary Formats

### JSON

Advantages:

- readable,

- debuggable,

- widely supported,

- easy for browser/mobile clients.

Disadvantages:

- larger payloads,

- slower parsing than some binary formats,

- less strict typing unless schema enforced.

### Binary formats, e.g. Protocol Buffers

Advantages:

- compact,

- fast,

- strongly typed schemas.

Disadvantages:

- less human-readable,

- requires tooling,

- harder for casual public API consumers.

When to use:

- Public HTTP APIs: JSON often best.

- Internal service-to-service: binary may be better.

- Mobile with bandwidth concerns: consider compression or binary.

## Trade-Off 3: Offset Pagination vs Cursor Pagination

### Offset

Advantages:

- simple,

- page jumps,

- familiar.

Disadvantages:

- slow for large offsets,

- unstable with inserts/deletes.

### Cursor

Advantages:

- efficient,

- stable,

- good for feeds.

Disadvantages:

- no arbitrary page jumps,

- opaque cursors can confuse clients.

When to use:

- Admin tables: offset may be okay.

- Social feeds/chat history: cursor usually better.

- Very large datasets: cursor often safer.

## Trade-Off 4: PUT vs PATCH

### PUT

Advantages:

- clear full replacement,

- idempotent.

Disadvantages:

- client must send entire object,

- risk of accidental field loss.

### PATCH

Advantages:

- efficient partial updates,

- better for mobile clients.

Disadvantages:

- may not be idempotent,

- merge semantics can be complex.

When to use:

- Full replacement: PUT.

- Partial update: PATCH.

- Critical idempotent update: design carefully.

## Trade-Off 5: Synchronous Response vs Asynchronous Job

### Synchronous

Advantages:

- simpler client flow,

- immediate result,

- easier error handling.

Disadvantages:

- slow operations block,

- timeouts,

- resource consumption.

### Asynchronous

Advantages:

- fast acceptance,

- better scalability,

- retries and workers.

Disadvantages:

- client must poll or receive webhook,

- status tracking,

- eventual visibility.

When to use:

- Fast operation: synchronous.

- Slow/heavy operation: asynchronous.

- User must see result immediately: synchronous if possible.

- Result can be ready later: asynchronous.

## Trade-Off 6: URL Versioning vs Header Versioning

### URL versioning

- /v1/tasks

- /v2/tasks

Advantages:

- visible,

- simple routing,

- easy caching.

Disadvantages:

- URL churn,

- may encourage large breaking versions.

### Header versioning

\`Accept-Version: v1\`

Advantages:

- stable URLs.

Disadvantages:

- less visible,

- harder debugging,

- caching complexity.

When to use:

- Public APIs: URL versioning often clearer.

- Internal APIs: header or no explicit versioning may be fine.

## Trade-Off 7: Stateless Tokens vs Server-Side Sessions

### Stateless tokens, e.g. JWT

Advantages:

- easy horizontal scaling,

- no session store needed for validation,

- good for APIs/mobile.

Disadvantages:

- hard to revoke before expiry,

- token size,

- claim management.

### Server-side sessions

Advantages:

- easy logout/revocation,

- smaller client token/cookie.

Disadvantages:

- session store required,

- extra lookup,

- operational dependency.

When to use:

- Short-lived tokens + refresh tokens: common.

- Session store: useful when instant revocation matters.

- Hybrid: often best.

This is introductory. Security gets deeper later.

## Trade-Off 8: Broad Endpoints vs Fine-Grained Endpoints

Broad:

\`GET /v1/tasks/123\`

returns task plus comments, attachments, assignees, history.

Fine-grained:

- GET /v1/tasks/123

- GET /v1/tasks/123/comments

- GET /v1/tasks/123/attachments

Advantages of broad:

- fewer client round trips.

Disadvantages of broad:

- over-fetching,

- larger payloads,

- harder caching,

- more expensive queries.

Advantages of fine-grained:

- smaller payloads,

- better caching,

- clearer ownership.

Disadvantages:

- more requests,

- client complexity,

- possible N+1 request patterns.

When to use:

- Mobile/low bandwidth: fine-grained or field selection.

- Desktop admin: broad may be okay.

- Complex frontends: GraphQL or composite endpoints may help.

# Common Beginner Mistakes

## Mistake 1: Using Verbs in Every Endpoint

Bad:

- POST /createTask

- POST /getTasks

- POST /deleteTask

Better:

\`\`\`text
POST /tasks
GET /tasks
DELETE /tasks/{task_id}

\`\`\`

Why?

HTTP methods already express actions.

## Mistake 2: Using GET for Side Effects

Bad:

\`GET /tasks/delete/123\`

Why dangerous?

Browsers, crawlers, prefetchers, and retries may trigger unintended deletions.

Use:

\`DELETE /tasks/123\`

## Mistake 3: No Pagination

Bad:

\`GET /tasks\`

returns all tasks.

Why bad?

Large responses, memory issues, slow clients, database strain.

Use:

\`GET /tasks?limit=20&cursor=...\`

## Mistake 4: Returning Huge Objects Unnecessarily

Bad:

\`\`\`text
{
  "task": {
    "title": "Buy milk",
    "full_history": "...",
    "all_comments": "...",
    "attachments_base64": "..."
  }
}

\`\`\`

Why bad?

Over-fetching wastes bandwidth.

Return summary in list endpoints.

Fetch details separately when needed.

## Mistake 5: Inconsistent Error Format

One endpoint returns:

\`\`\`text
{
  "message": "bad input"
}

\`\`\`

Another returns:

\`Error: title required\`

Another returns HTML.

Why bad?

Clients cannot handle errors reliably.

Use a consistent error envelope.

## Mistake 6: Leaking Internal Details

Bad error:

\`SQL syntax error near 'tasks' at line 42\`

Why bad?

Security risk and confusing to clients.

Return safe error plus request ID.

Log details internally.

## Mistake 7: Ignoring Idempotency

Important operations like payments or order creation must handle retries.

If not, duplicates happen.

Use idempotency keys or unique constraints.

## Mistake 8: No Authentication or Authorization

Every endpoint must answer:

- Who is calling?

- Are they allowed?

Do not rely on client honesty.

## Mistake 9: Treating API as Database Schema

Bad:

\`GET /task_rows?where=user_id=42\`

This leaks internals and couples clients to schema.

APIs should express domain concepts, not database tables.

## Mistake 10: No Versioning Plan

If you never plan for change, every modification breaks clients.

You do not need \`/v1\` forever, but you need a compatibility strategy.

## Mistake 11: Over-Nesting Resources

Bad:

\`GET /users/1/projects/2/tasks/3/comments/4/reactions/5\`

Why bad?

Rigid, hard to evolve, difficult to cache and authorize.

Better:

\`GET /reactions/5\`

or:

\`GET /comments/4/reactions\`

depending on domain.

## Mistake 12: Using 200 OK for Errors

Bad:

\`\`\`text
HTTP/1.1 200 OK

{
  "error": "invalid token"
}

\`\`\`

Why bad?

Clients, proxies, monitoring, and retries may treat it as success.

Use proper status codes.

## Mistake 13: Ignoring Rate Limits

Public APIs will be abused.

Without rate limiting, one client can harm others.

## Mistake 14: No Request IDs

Without request IDs, debugging distributed systems becomes painful.

Add them early.

## Mistake 15: Copying Big Company APIs Without Understanding Constraints

Netflix, Google, and Amazon have specific clients, teams, scale, and history.

Their API style may not fit your system.

Understand the problem before copying the solution.

# Deep Dive

Now we go deeper into important API design topics.

## Deep Dive 1: Designing Good Resource Names

Use nouns, not verbs.

Examples:

- /tasks

- /users

- /projects

- /comments

- /payments

- /orders

Use plural collections commonly:

\`GET /tasks\`

Some APIs use singular:

\`GET /task\`

Either can work, but be consistent.

Plural is common in REST-style APIs.

## Deep Dive 2: When Action Endpoints Are Acceptable

Not everything fits CRUD.

Examples:

\`\`\`text
POST /orders/{order_id}/cancel
POST /payments/{payment_id}/refund
POST /users/{user_id}/reset-password
POST /tasks/{task_id}/complete

\`\`\`

These represent domain commands.

A pure resource approach might use:

\`\`\`text
PATCH /orders/{order_id}
{
  "status": "cancelled"
}

\`\`\`

But action endpoints can be clearer when:

- the operation has side effects,

- the state transition is meaningful,

- validation is complex,

- the client intent is explicit.

Do not force everything into CRUD if it makes the API less understandable.

## Deep Dive 3: Nested Resources Carefully

Nested resources can express ownership.

Example:

\`GET /projects/42/tasks\`

This is often fine.

But avoid deep nesting when the child can be accessed independently.

Example:

\`GET /comments/77\`

may be better than:

\`GET /tasks/123/comments/77\`

if comments have their own lifecycle.

Rule of thumb:

Nest only when the parent is needed to identify or scope the child.

## Deep Dive 4: Designing Request Payloads

Keep payloads focused.

Example create task:

\`\`\`text
{
  "title": "Study system design",
  "description": "Chapter 4",
  "priority": "high",
  "due_date": "2026-10-10",
  "project_id": "42"
}

\`\`\`

Do not accept fields that clients should not control.

Bad:

\`\`\`text
{
  "title": "Study system design",
  "user_id": "attacker_chosen_user",
  "created_at": "1999-01-01",
  "is_admin": true
}

\`\`\`

The server should derive trusted fields:

- owner,

- timestamps,

- permissions,

- internal status.

This prevents mass assignment vulnerabilities.

## Deep Dive 5: Designing Response Payloads

Responses should match client needs.

List response:

\`\`\`text
{
  "items": [
    {
      "task_id": "123",
      "title": "Study system design",
      "status": "open",
      "updated_at": "2026-10-05T10:30:00Z"
    }
  ],
  "next_cursor": "abc",
  "has_more": true
}

\`\`\`

Detail response:

\`\`\`text
{
  "task_id": "123",
  "title": "Study system design",
  "description": "Read chapter and do exercises",
  "status": "open",
  "priority": "high",
  "project": {
    "project_id": "42",
    "name": "Learning"
  },
  "assignee": {
    "user_id": "42",
    "display_name": "Alice"
  },
  "created_at": "2026-10-05T10:30:00Z",
  "updated_at": "2026-10-05T10:30:00Z"
}

\`\`\`

Avoid returning internal fields unless needed:

- password_hash

- internal_notes

- deleted_flag

- raw_audit_data

## Deep Dive 6: Consistent Field Naming

Pick a convention and follow it.

Examples:

- snake_case: task_id, created_at

- camelCase: taskId, createdAt

JSON APIs often use snake_case or camelCase depending on ecosystem.

Important:

Do not mix styles randomly.

Consistency reduces client bugs.

## Deep Dive 7: Dates and Times

Use ISO 8601 / RFC 3339 style timestamps.

Example:

\`2026-10-05T10:30:00Z\`

The \`Z\` means UTC.

Store times in UTC internally.

Convert to user timezone in presentation layer if needed.

Avoid ambiguous formats:

- 05/10/2026

- 10/05/2026

These can mean different things in different regions.

## Deep Dive 8: IDs

Choose IDs carefully.

Options:

| ID Type | Example | Pros | Cons |
| --- | --- | --- | --- |
| Auto-increment integer | 123 | compact, ordered | predictable, may leak count |
| UUID | 9f8b... | globally unique, hard to guess | larger, less ordered |
| ULID | 01H... | sortable, unique | slightly less common |
| Short code | abc123 | compact, user-friendly | collision management |
| Opaque string | task_123 | clear prefix | length |

For public APIs, avoid exposing sequential IDs if enumeration attacks matter.

Example bad:

- GET /users/1

- GET /users/2

- GET /users/3

Attackers can discover all users.

Use random or opaque IDs when appropriate.

## Deep Dive 9: Idempotency Implementation

A simple idempotency design:

Client sends:

\`Idempotency-Key: 9f8b7c6d-5e4f-4a3b-8c9d-0e1f2a3b4c5d\`

Server stores:

- idempotency_records

- -------------------

- key

- request_hash

- response_status

- response_body

- created_at

- expires_at

When request arrives:

- Check if key exists.

- If exists and request hash matches, return stored response.

- If exists but request hash differs, return conflict.

- If not exists, process request.

- Store result.

Why request hash?

To prevent a client from reusing the same key with a different body.

Example:

- First request:

- Idempotency-Key: abc

- Body: amount=100

- Second request:

- Idempotency-Key: abc

- Body: amount=999999

The server should reject the second request as conflicting.

## Deep Dive 10: Rate Limiting Algorithms, Briefly

You will study rate limiting more deeply later, but API designers should know common approaches.

### Fixed window

Count requests per minute.

Simple, but can allow bursts at window boundaries.

### Sliding window

More accurate, smoother.

More state.

### Token bucket

Allows bursts up to bucket size.

Common and flexible.

### Leaky bucket

Smooths output rate.

Good for protecting downstream systems.

API responses should communicate limits clearly.

## Deep Dive 11: API Documentation

A real API needs documentation.

Documentation should include:

- endpoints,

- methods,

- request parameters,

- response schemas,

- error codes,

- authentication,

- rate limits,

- examples,

- versioning,

- deprecation policy.

Tools like OpenAPI can describe REST APIs formally.

You do not need to master tools now.

The architectural lesson:

If the API contract is not documented, it becomes tribal knowledge and harder to evolve.

## Deep Dive 12: API Gateway vs Application-Level Handling

Some concerns can be handled at the edge:

- TLS termination,

- basic routing,

- rate limiting,

- request IDs,

- authentication token validation,

- WAF/security filtering.

Some concerns belong in the application:

- business rules,

- domain validation,

- authorization based on resource ownership,

- transactional behavior.

Do not put all logic in the gateway.

Do not put all logic in the service either.

Choose boundaries based on clarity, performance, and operational needs.

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

Why is this endpoint dangerous?

\`GET /tasks/delete/123\`

Answer direction:

Because GET requests may be retried, prefetched, cached, or triggered accidentally by browsers and crawlers. Deleting data with GET violates the expectation that GET is safe.

Use:

\`DELETE /tasks/123\`

## Predict

Question:

A client sends:

\`\`\`text
POST /v1/payments
{
  "amount": 100
}

\`\`\`

The server charges the card, but the response is lost. The client retries the exact same request.

What may happen if there is no idempotency mechanism?

Answer direction:

The server may charge the card again, creating a duplicate payment.

## Find the Bottleneck

Question:

An API endpoint:

\`GET /v1/tasks\`

returns all tasks for a user.

Traffic grows. Users have large task lists.

What becomes a bottleneck?

Answer direction:

Multiple things:

- database query returns too many rows,

- server memory grows during serialization,

- response payload becomes large,

- network bandwidth increases,

- client rendering slows.

Pagination is needed.

## Find the Failure

Question:

A user updates a task:

\`\`\`text
PATCH /v1/tasks/123
{
  "status": "done"
}

\`\`\`

The server returns success, but the client does not receive the response due to network failure.

The user retries.

Is this dangerous?

Answer direction:

Usually not, if setting status to done is idempotent.

Doing it twice results in the same final state.

But if the PATCH incremented a counter, retry could be dangerous.

## Compare

Question:

Which is better for a social feed?

Option A:

\`GET /feed?offset=100000&limit=20\`

Option B:

\`GET /feed?cursor=abc123&limit=20\`

Answer direction:

Option B is usually better for large feeds.

Deep offsets can be slow and unstable. Cursors are more efficient and stable.

## Design This

Question:

Design API endpoints for a blog system with posts and comments.

Answer direction:

Possible endpoints:

\`\`\`text
GET    /v1/posts
POST   /v1/posts
GET    /v1/posts/{post_id}
PATCH  /v1/posts/{post_id}
DELETE /v1/posts/{post_id}

GET    /v1/posts/{post_id}/comments
POST   /v1/posts/{post_id}/comments
DELETE /v1/comments/{comment_id}

\`\`\`

Could also use:

\`GET /v1/comments?post_id=123\`

depending on access patterns.

# Architecture Exercise

## Weak API Design

A beginner builds an order system with these endpoints:

- POST /doOrder

- POST /cancelOrder

- POST /getOrderDetails

- POST /updateOrderStatus

- GET /adminGetAllOrders

Requests are form-encoded.

Responses are plain text.

Errors look like:

\`error\`

No authentication.

No pagination.

No idempotency.

No versioning.

## Your Task

Identify the problems.

Ask:

- Is the interface predictable?

- Can clients know what failed?

- Can retries be safe?

- Can responses be cached?

- Can the API evolve?

- Can abuse be controlled?

- Can monitoring work well?

- Can mobile and web clients use it easily?

## Hint 1 — Requirements Hint

Clarify:

- Who uses the API?

- What operations are needed?

- Which operations change data?

- Which operations are read-only?

- Which operations are expensive?

- Which operations need retries?

## Hint 2 — Architecture Hint

Move toward resource-oriented endpoints and JSON.

Use HTTP methods correctly.

Add authentication headers.

Add structured errors.

Add pagination for lists.

Add idempotency for important writes.

Add versioning.

## Hint 3 — Scaling Hint

Expensive endpoints need rate limits and possibly async processing.

Large list endpoints need pagination.

Read-heavy endpoints may need caching.

## Hint 4 — Reliability Hint

Critical write endpoints need idempotency and clear failure semantics.

Timeouts must be defined.

Retry behavior must be safe.

## Improved Design Direction

\`\`\`text
POST   /v1/orders
GET    /v1/orders
GET    /v1/orders/{order_id}
PATCH  /v1/orders/{order_id}
POST   /v1/orders/{order_id}/cancel
DELETE /v1/orders/{order_id}

\`\`\`

Headers:

- Authorization: Bearer token

- Content-Type: application/json

- Idempotency-Key: order_create_123

- X-Request-ID: req_555

Responses:

\`\`\`text
{
  "order_id": "ord_123",
  "status": "created",
  "items": [...],
  "total_amount": 4999,
  "currency": "cents"
}

\`\`\`

Errors:

\`\`\`text
{
  "error": {
    "code": "insufficient_inventory",
    "message": "One or more items are out of stock.",
    "request_id": "req_555"
  }
}

\`\`\`

List:

\`GET /v1/orders?status=open&limit=20&cursor=abc\`

This is still not a complete system design, but it is a much better interface.

# Design Exercise: URL Shortener API

Now let us apply API design to a classic beginner system.

Design the API for a URL shortener.

Users can:

- submit a long URL,

- receive a short link,

- redirect from short link to long URL,

- optionally get link metadata,

- optionally delete link.

Do not design full architecture yet.

Focus on API.

## Step 1: Clarify Requirements

Questions:

- Do users need accounts?

- Can anonymous users create links?

- Can users customize short codes?

- Should links expire?

- Should we track click analytics?

- Should deleting a link be permanent?

- Is the API public or internal?

Assume:

- anonymous users can create links,

- authenticated users can manage their links,

- short codes are base62 strings,

- links can optionally expire,

- click analytics are optional,

- deletion is soft-delete.

## Step 2: Functional Requirements

System must:

- create short link,

- redirect short link,

- retrieve link metadata,

- list user links,

- delete link,

- optionally update expiration.

## Step 3: API Design

### Create short link

\`POST /v1/links\`

Request:

\`\`\`text
{
  "url": "",
  "custom_code": "promo",
  "expires_at": "2026-12-31T23:59:59Z"
}

\`\`\`

Response:

\`\`\`text
201 Created
 {
  "short_code": "promo",
  "short_url": "",
  "created_at": "2026-10-05T10:30:00Z",
  "expires_at": "2026-12-31T23:59:59Z"
}

\`\`\`

If custom code is taken:

\`\`\`text
409 Conflict
 {
  "error": {
    "code": "short_code_taken",
    "message": "The requested short code is already in use."
  }
}

\`\`\`

### Redirect

This is not a normal JSON API endpoint.

It is a browser-facing redirect.

\`GET /{short_code}\`

Example:

\`GET /promo\`

Response:

- 302 Found

- Location:

Or:

\`301 Moved Permanently\`

if the mapping is permanent.

Use 302 if you want to track clicks or allow future changes.

Use 301 if you want browsers to cache the redirect aggressively.

This is a trade-off.

### Get link metadata

\`GET /v1/links/{short_code}\`

Response:

\`\`\`text
{
  "short_code": "promo",
  "url": "",
  "created_at": "2026-10-05T10:30:00Z",
  "expires_at": "2026-12-31T23:59:59Z",
  "click_count": 1542,
  "active": true
}

\`\`\`

Requires authentication and ownership check.

### List user links

\`GET /v1/links?limit=20&cursor=abc\`

Response:

\`\`\`text
{
  "items": [
    {
      "short_code": "promo",
      "short_url": "",
      "click_count": 1542,
      "created_at": "2026-10-05T10:30:00Z"
    }
  ],
  "next_cursor": "def",
  "has_more": true
}

\`\`\`

### Delete link

\`DELETE /v1/links/{short_code}\`

Response:

\`204 No Content\`

Soft delete means the link no longer redirects, but metadata may remain for audit or recovery.

## Step 4: Failure Cases

| Failure | Status |
| --- | --- |
| Invalid URL | 400 or 422 |
| URL blocked for security | 400 with error code |
| Custom code taken | 409 |
| Link not found | 404 |
| Link expired | 410 or 404 depending policy |
| User not authorized | 403 or 404 |
| Rate limit exceeded | 429 |
| Storage failure | 500/503 |

## Step 5: Architectural Implications

This API suggests:

- redirect endpoint is read-heavy and cache-sensitive,

- metadata endpoint requires auth,

- custom codes require uniqueness checks,

- click analytics may be write-heavy,

- expiration cleanup may be background job,

- abuse prevention may require rate limiting and URL scanning.

You do not need to solve all of this now.

But notice:

The API already reveals many system design concerns.

# Practice Questions

Try answering without rereading.

## Conceptual Questions

- What is an API?

- What is an endpoint?

- What is a resource?

- What is the difference between GET and POST?

- What does it mean for an HTTP method to be safe?

- What does idempotent mean?

- Why is using GET for deletion dangerous?

- What is the difference between authentication and authorization?

- What is a status code?

- When should you use 401?

- When should you use 403?

- When should you use 404?

- When should you use 409?

- When should you use 429?

- When should you use 503?

- What is pagination?

- What is the difference between offset and cursor pagination?

- What is an idempotency key?

- What is API versioning?

- What is rate limiting?

- What is a webhook?

- What is the difference between synchronous and asynchronous API patterns?

- Why should error responses be consistent?

- Why should clients not send trusted fields like user_id or created_at?

- How does API design affect database indexing?

## Status Code Matching

Choose the best status code.

### Question 1

Client sends malformed JSON.

Answer:

\`400 Bad Request\`

### Question 2

Client has no authentication token.

Answer:

\`401 Unauthorized\`

### Question 3

Client is authenticated but tries to delete another user's task.

Answer:

\`403 Forbidden\`

or sometimes 404 for privacy.

### Question 4

Client requests a task ID that does not exist.

Answer:

\`404 Not Found\`

### Question 5

Client tries to create a link with a custom short code that already exists.

Answer:

\`409 Conflict\`

### Question 6

Client sends too many requests.

Answer:

\`429 Too Many Requests\`

### Question 7

Server is temporarily overloaded.

Answer:

\`503 Service Unavailable\`

### Question 8

Server has an unexpected bug.

Answer:

\`500 Internal Server Error\`

## API Design Questions

### Question 1

Redesign this endpoint:

\`POST /getTasksByUser\`

Better:

\`GET /v1/users/{user_id}/tasks\`

or:

\`GET /v1/tasks?user_id={user_id}\`

depending on ownership and access model.

### Question 2

Redesign this endpoint:

\`GET /deleteTask?id=123\`

Better:

\`DELETE /v1/tasks/123\`

### Question 3

A list endpoint returns all records.

Add pagination.

Example:

\`GET /v1/tasks?limit=20&cursor=abc\`

### Question 4

A payment endpoint can be retried by clients.

How do you prevent duplicate charges?

Answer direction:

Use an idempotency key:

\`Idempotency-Key: pay_123\`

Server stores result and returns same response for retries.

# Interview Questions

These are common beginner-to-intermediate system design interview questions.

## Question 1

Interviewer: What is an API and why does it matter in system design?

Good answer direction:

An API is a contract that defines how clients interact with a system. It matters because it establishes boundaries, determines access patterns, affects caching, security, retry safety, scalability, and allows the backend to evolve without breaking clients.

## Question 2

Interviewer: How would you design the API for a URL shortener?

Good answer direction:

You might say:

I would separate the public redirect endpoint from the management API. For creation: \`POST /v1/links\`. For redirect: \`GET /{short_code}\` returning 301 or 302. For metadata: \`GET /v1/links/{short_code}\` with authentication. For listing: paginated \`GET /v1/links\`. I would handle custom code conflicts with 409 and rate limiting for abuse prevention.

## Question 3

Interviewer: What is the difference between 401 and 403?

Good answer direction:

401 means unauthenticated: the server does not know who the caller is or authentication failed. 403 means authenticated but forbidden: the server knows the caller but the caller lacks permission.

## Question 4

Interviewer: Why is idempotency important?

Good answer direction:

Networks fail and clients retry. If operations are not idempotent, retries can create duplicate side effects such as double payments or duplicate orders. Idempotency keys or unique constraints make retries safe.

## Question 5

Interviewer: When would you use cursor pagination instead of offset pagination?

Good answer direction:

Cursor pagination is better for large, frequently changing datasets such as feeds or chat history. It avoids deep offset performance problems and provides more stable iteration. Offset pagination can be useful for admin tables where page jumps are needed.

## Question 6

Interviewer: Should an API ever return all data for a list endpoint?

Good answer direction:

Usually no. Returning all data can cause large payloads, memory pressure, slow responses, and denial-of-service risk. APIs should paginate by default and enforce maximum page sizes.

## Question 7

Interviewer: How does API design affect database design?

Good answer direction:

API access patterns determine which queries are needed. Frequent filters, sorts, and joins imply indexes or data model choices. For example, \`GET /tasks?status=open&sort=-created_at\` suggests an index on \`(user_id, status, created_at)\`.

## Question 8

Interviewer: What is the difference between a synchronous and asynchronous API?

Good answer direction:

A synchronous API completes the work before responding. An asynchronous API accepts the request and processes work later, often returning a job ID and status endpoint or using webhooks. Asynchronous APIs improve responsiveness for slow operations but add complexity.

## Question 9

Interviewer: How would you version an API?

Good answer direction:

Common approaches include URL versioning like \`/v1/\`, header versioning, or backward-compatible evolution. URL versioning is simple and visible, while header versioning keeps URLs stable. The choice depends on client ecosystem, operational tooling, and how breaking changes are expected.

## Question 10

Interviewer: What security concerns should an API address?

Good answer direction:

Authentication, authorization, input validation, rate limiting, HTTPS, secure token handling, avoiding sensitive data leakage, consistent error messages, protection against enumeration, and audit logging. The API should never trust client-provided identity or permissions.

# Self-Check

Ask yourself honestly:

- Can I explain what an API is in simple words?

- Can I distinguish between resource endpoints and action endpoints?

- Can I explain GET, POST, PUT, PATCH, and DELETE?

- Can I explain why GET should not delete data?

- Can I explain authentication vs authorization?

- Can I choose appropriate status codes for common failures?

- Can I design a consistent error response?

- Can I explain idempotency and why retries need it?

- Can I explain pagination and compare offset vs cursor?

- Can I explain why API design affects database indexes?

- Can I explain why API design affects caching?

- Can I explain synchronous vs asynchronous API patterns?

- Can I identify beginner API mistakes?

- Can I redesign a poor API into a clearer one?

If you can answer most of these, you are ready to move deeper.

If not, review:

- HTTP methods,

- status codes,

- idempotency,

- pagination,

- authentication vs authorization,

- and the request flow examples.

# DSA/Backend/Coding Connection

API design connects strongly to programming and backend development.

| Programming Concept | API/System Design Connection |
| --- | --- |
| Function signature | API endpoint contract |
| Parameters | Path/query/body inputs |
| Return value | Response body |
| Exceptions | Error status codes and error objects |
| Pure function | Safe GET-like operation |
| Side effects | POST/PATCH/DELETE operations |
| Hash map | Key-value lookup by resource ID |
| Unique constraint | Idempotency/duplicate prevention |
| Queue | Asynchronous job API |
| Iterator/cursor | Pagination |
| Serialization | JSON request/response bodies |
| Validation | Input sanitization and schema checks |
| Authentication middleware | Token/session verification |
| Authorization logic | Permission checks |
| Big-O complexity | Expensive endpoints and query patterns |

A function in code has:

- inputs

- outputs

- side effects

- errors

An API endpoint has the same idea, but across a network:

- method

- path

- headers

- body

- status code

- response body

- side effects

- failure behavior

System design is partly about designing functions that span machines.

That is why API thinking is so important.`,
    },
    {
      slug: "chapter-5-databases-and-data-modeling",
      title: "Chapter 5 — Databases and Data Modeling",
      summary: "Imagine TaskTracker stores tasks in a simple text file: Buy milk Study system design Call friend For one user on one laptop, that may be fine.",
      difficulty: "beginner",
      estimatedMinutes: 67,
      order: 4,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should understand:", "what data storage is,", "why files are often not enough,", "what a database is,", "what a database management system is,", "what persistence means,", "what a schema is,", "what relational databases are,", "what tables, rows, and columns are,", "what primary keys are,", "what foreign keys are,", "what unique constraints are,"],
      prerequisites: [],
      whereItFits: "Imagine TaskTracker stores tasks in a simple text file: Buy milk Study system design Call friend For one user on one laptop, that may be fine.",
      keyTakeaways: ["This chapter taught you how backend systems store and organize data.", "You learned:", "databases provide persistence, querying, constraints, transactions, and recovery,", "relational databases store data in tables with rows and columns,", "primary keys uniquely identify rows,", "foreign keys express relationships,", "indexes speed up reads but cost writes and storage,", "transactions make groups of operations all-or-nothing,", "ACID describes reliable transactional behavior,", "concurrency control prevents lost updates and race conditions,"],
      selfAssessment: [],
      content: `# Chapter 5 — Databases and Data Modeling

In Chapter 4, you learned how clients communicate with a backend through APIs.

An API defines operations such as:

\`\`\`text
POST /v1/tasks
GET  /v1/tasks
PATCH /v1/tasks/{task_id}
DELETE /v1/tasks/{task_id}

\`\`\`

But those operations must do something real.

When a user creates a task, the system must remember it.

When a user lists tasks, the system must retrieve them.

When a user updates a task, the system must change stored data safely.

When a user deletes a task, the system must remove or mark it as deleted.

That means the system needs a place to store data.

This chapter teaches you how backend systems store, organize, retrieve, protect, and model data.

You will learn what databases are, why they exist, how relational databases work, how NoSQL databases differ, how to design data models, and how database choices affect the rest of the system.

This is one of the most important chapters in the course.

Why?

Because many system design problems are actually data problems.

If your data model is weak, your API becomes awkward, your queries become slow, your scaling becomes difficult, and your consistency guarantees become fragile.

If your data model is strong, many architectural decisions become clearer.

## Why This Matters

Imagine TaskTracker stores tasks in a simple text file:

- Buy milk

- Study system design

- Call friend

For one user on one laptop, that may be fine.

But now suppose:

- many users use the system,

- tasks have owners, statuses, priorities, due dates, comments, and attachments,

- users update tasks concurrently,

- the server restarts,

- the file becomes corrupted,

- one user tries to read while another writes,

- you need to search by status, due date, assignee, and project,

- you need to guarantee that a task is not lost after the system says “saved.”

A plain file becomes dangerous.

You need a database.

A database helps with:

- durable storage,

- structured querying,

- concurrency control,

- data integrity,

- transactions,

- indexing,

- backup and recovery,

- access control.

But a database is not a magic box.

It has limits.

It has trade-offs.

It must be designed around how the system actually uses data.

This chapter teaches you how to make those decisions.

## Prerequisites

Before this chapter, you should understand:

- what a client is,

- what a server is,

- what an API is,

- what a request and response are,

- what functional and non-functional requirements are,

- basic traffic estimation,

- basic HTTP methods.

No prior database knowledge is required.

# Start With a Real-World Problem

Suppose you build TaskTracker.

At first, you store tasks in memory:

\`tasks = []\`

When a user creates a task, you append it:

\`tasks.append({"title": "Buy milk"})\`

This works until the server restarts.

Then all tasks disappear.

So you move tasks to a file:

\`tasks.json\`

Now data survives restarts.

But new problems appear.

## Problem 1: Concurrent Writes

Two users update the file at the same time.

User A reads the file.

User B reads the file.

User A writes changes.

User B writes changes.

User B may overwrite User A’s changes.

This is called a lost update.

A database helps manage concurrent access.

## Problem 2: Efficient Querying

You want to answer questions like:

Give me all open tasks for user Alice, sorted by due date.

With a file, you may need to read the whole file and filter manually.

That is slow.

A database can use indexes to find matching rows quickly.

## Problem 3: Data Integrity

You want to ensure:

- every task has a valid owner,

- task IDs are unique,

- email addresses are unique,

- status is one of allowed values,

- a comment belongs to an existing task.

With files, these rules are easy to violate accidentally.

A database can enforce constraints.

## Problem 4: Partial Failures

Suppose creating a task also creates an activity log entry.

What if the task is saved but the log fails?

Should the whole operation be undone?

A database transaction can make multiple operations succeed together or fail together.

## Problem 5: Recovery

If the server crashes in the middle of writing data, can the database recover?

Can it avoid corrupting files?

Can it restore from backups?

Databases are designed for these problems.

## Problem 6: Scale

If the system grows from 100 users to 1 million users, the database may become the bottleneck.

You will need to think about:

- indexes,

- query efficiency,

- connection limits,

- replication,

- partitioning,

- caching,

- data model choices.

This chapter focuses on modeling and choosing data stores.

Later, you will learn how to scale them.

# Intuition

A database is like a highly organized warehouse for data.

Imagine a warehouse with:

- shelves,

- labeled bins,

- inventory records,

- rules for where items can be placed,

- a system for finding items quickly,

- a process for recording changes safely,

- guards preventing unauthorized access.

A file is like throwing items into a cardboard box.

It may work when there are only a few items.

But when there are many items, many people, and many operations, you need structure.

A database provides structure.

A useful beginner mental model:

\`\`\`text
Application needs data
   ↓
Database stores data
   ↓
Database provides safe ways to read/write data

\`\`\`

But there is an important distinction:

A database is not just storage.

A database is storage plus rules plus query ability plus concurrency control plus recovery mechanisms.

# Core Concept

Let us build database understanding step by step.

## 1. What Is Data?

### Simple explanation

Data is facts the system needs to remember.

### Examples

For TaskTracker:

- user email,

- task title,

- task status,

- due date,

- comment text,

- project name.

For a blog:

- post title,

- post body,

- author,

- published date,

- comments.

For a chat app:

- sender,

- receiver,

- message body,

- timestamp,

- delivery status.

### Practical use

System design asks:

What data must the system store?

How is that data used?

Who can access it?

How often is it read?

How often is it written?

What shape does it have?

What consistency does it need?

Data shape and access patterns drive database choice.

## 2. What Is Persistence?

### Simple explanation

Persistence means data survives after the program stops.

### Formal term

Persistence.

### Example

If a task is stored only in memory, it disappears when the server restarts.

If it is stored in a database, it remains.

### Practical use

Backend systems usually need persistence for important data.

Examples of persistent data:

- user accounts,

- orders,

- payments,

- messages,

- tasks,

- blog posts.

Examples of possibly non-persistent data:

- temporary cache entries,

- short-lived session tokens,

- in-progress UI state,

- some analytics buffers.

Not all data needs the same durability.

## 3. What Is a Database?

### Simple explanation

A database is a system for storing and retrieving data reliably.

### Formal term

Database.

### Example

A TaskTracker database may store:

- users

- tasks

- comments

- projects

### Practical use

A database helps with:

- persistence,

- querying,

- indexing,

- constraints,

- transactions,

- concurrency control,

- recovery.

Important beginner distinction:

A database is not just a file on disk.

It is software plus data plus rules plus operational mechanisms.

## 4. What Is a DBMS?

### Simple explanation

A DBMS is the software that manages a database.

### Formal term

Database Management System.

### Examples

Conceptual examples:

- PostgreSQL,

- MySQL,

- SQLite,

- MongoDB,

- Redis,

- Cassandra,

- DynamoDB.

### Practical use

When people say “database,” they often mean the DBMS plus the stored data.

In system design, you usually care about:

- what kind of DBMS,

- what data model,

- what consistency model,

- what access patterns,

- what operational constraints.

## 5. What Is a Schema?

### Simple explanation

A schema is the structure of the data.

It defines what tables exist, what columns exist, and what rules apply.

### Formal term

Schema.

### Example

A tasks table schema may be:

- tasks

- -----

- task_id

- user_id

- title

- status

- priority

- due_at

- created_at

- updated_at

Rules may include:

- task_id is unique,

- user_id must refer to an existing user,

- title cannot be empty,

- status must be one of: open, done, archived.

### Practical use

Schemas can be:

- strict, as in many relational databases,

- flexible, as in many document databases,

- absent or dynamic, in some key-value stores.

A strict schema helps enforce data quality.

A flexible schema can make changes easier.

Both have trade-offs.

# Relational Databases

Relational databases are the most common starting point for backend systems.

They store data in tables.

They are called “relational” because tables can relate to each other.

Examples conceptually include:

- PostgreSQL,

- MySQL,

- SQLite,

- MariaDB.

You do not need to memorize product differences yet.

Learn the model.

## 6. What Is a Table?

### Simple explanation

A table is a collection of similar records.

### Formal term

Table, relation.

### Example

A \`users\` table stores user records.

| user_id | email | password_hash | created_at |
| --- | --- | --- | --- |
| 1 | alice@example.com | $2b$10$abc... | 2026-01-01 |
| 2 | bob@example.com | $2b$10$xyz... | 2026-01-02 |

A \`tasks\` table stores task records.

| task_id | user_id | title | status | created_at |
| --- | --- | --- | --- | --- |
| 10 | 1 | Buy milk | open | 2026-10-05 |
| 11 | 1 | Study system design | open | 2026-10-05 |

### Practical use

Tables are good for structured data with consistent fields.

Examples:

- users,

- orders,

- products,

- invoices,

- tasks,

- blog posts.

## 7. What Is a Row?

### Simple explanation

A row is one record.

### Formal term

Row, tuple, record.

### Example

One row in the \`tasks\` table represents one task.

- task_id = 10

- user_id = 1

- title = Buy milk

- status = open

### Practical use

Rows usually represent entities:

- one user,

- one task,

- one order,

- one comment.

## 8. What Is a Column?

### Simple explanation

A column is one field or attribute of a record.

### Formal term

Column, attribute, field.

### Example

In the \`tasks\` table:

- task_id

- user_id

- title

- status

- priority

- due_at

- created_at

- updated_at

### Practical use

Columns define what information is stored about each entity.

Choosing columns carefully is part of data modeling.

## 9. What Is a Primary Key?

### Simple explanation

A primary key is a value that uniquely identifies one row in a table.

### Formal term

Primary key.

### Example

In \`tasks\`, \`task_id\` may be the primary key.

| task_id | title |
| --- | --- |
| 10 | Buy milk |
| 11 | Study system design |

No two rows can have the same \`task_id\`.

### Requirements for a good primary key

A primary key should be:

- unique,

- stable,

- non-null,

- simple to index,

- hard to guess if security matters.

### Common primary key choices

| Choice | Example | Pros | Cons |
| --- | --- | --- | --- |
| Auto-increment integer | 1, 2, 3 | compact, ordered, easy | predictable, may leak count |
| UUID | 9f8b7c6d-... | globally unique, hard to guess | larger, less ordered |
| ULID | 01H... | sortable, unique | less common |
| Short code | abc123 | compact, user-friendly | collision handling |
| Composite key | (user_id, project_code) | natural uniqueness | more complex |

For beginner system design, auto-increment integers are common.

For distributed systems or public APIs, UUIDs or opaque IDs may be better.

There is no universal winner.

## 10. What Is a Foreign Key?

### Simple explanation

A foreign key is a column that points to a row in another table.

### Formal term

Foreign key.

### Example

In the \`tasks\` table:

\`user_id\`

refers to:

\`users.user_id\`

This means:

Every task must belong to a valid user.

\`tasks.user_id → users.user_id\`

### Practical use

Foreign keys help enforce relationships and data integrity.

If you try to insert a task with \`user_id = 999\` and no such user exists, the database can reject it.

This prevents orphan records.

## 11. What Is a Unique Constraint?

### Simple explanation

A unique constraint prevents duplicate values in a column or set of columns.

### Formal term

Unique constraint.

### Example

A \`users\` table may require unique email:

\`email UNIQUE\`

So two users cannot have the same email.

Another example:

\`UNIQUE (user_id, project_id, task_number)\`

could ensure each project has unique task numbers per user.

### Practical use

Unique constraints are essential for correctness.

They prevent accidental duplicates at the database level.

For example:

- one account per email,

- one username per user,

- one active subscription per user,

- one order item per product per order.

## 12. What Is NOT NULL?

### Simple explanation

A NOT NULL constraint requires a column to have a value.

### Formal term

NOT NULL constraint.

### Example:

\`title NOT NULL\`

means a task must have a title.

### Practical use

Use NOT NULL for fields that must always exist.

Be careful with optional fields.

Sometimes NULL is acceptable.

Sometimes an empty string or explicit status value is better.

This depends on your application logic.

# Relationships

Relationships are one of the most important parts of data modeling.

You must understand how entities relate.

Common relationship types:

- one-to-one,

- one-to-many,

- many-to-one,

- many-to-many.

## 13. One-to-One Relationship

### Simple explanation

One row in table A relates to exactly one row in table B.

### Example

A user may have one profile.

- User has one Profile

- Profile belongs to one User

Tables:

- users

- -----

- user_id

- email

- user_profiles

- -------------

- user_id

- bio

- avatar_url

Here \`user_profiles.user_id\` is both a foreign key and a unique constraint.

### Practical use

One-to-one relationships are often used to separate rarely accessed or optional data.

Example:

- user account data,

- user detailed profile data.

But do not over-split tables without reason.

Sometimes one table is simpler.

## 14. One-to-Many Relationship

### Simple explanation

One row in table A relates to many rows in table B.

### Example

A user can have many tasks.

- User has many Tasks

- Task belongs to one User

Tables:

- users

- -----

- user_id

- email

- tasks

- -----

- task_id

- user_id

- title

- status

The \`tasks.user_id\` column points to \`users.user_id\`.

### Practical use

This is the most common relationship.

Examples:

- one user has many orders,

- one blog post has many comments,

- one project has many tasks,

- one conversation has many messages.

## 15. Many-to-One Relationship

Many-to-one is just one-to-many viewed from the other side.

Example:

\`Many tasks belong to one user.\`

In the \`tasks\` table, each task row has one \`user_id\`.

## 16. Many-to-Many Relationship

### Simple explanation

Many rows in table A relate to many rows in table B.

### Example

A student can enroll in many courses.

A course can have many students.

\`Student many-to-many Course\`

Relational databases cannot directly store many-to-many relationships in one column.

You need a join table.

Tables:

- students

- --------

- student_id

- name

- courses

- -------

- course_id

- title

- enrollments

- -----------

- student_id

- course_id

- enrolled_at

The \`enrollments\` table connects students and courses.

### Practical use

Many-to-many relationships appear often.

Examples:

- users and groups,

- posts and tags,

- tasks and labels,

- products and categories,

- drivers and vehicles,

- orders and coupons.

### Important modeling lesson

Do not store many-to-many data as a comma-separated list.

Bad:

- posts

- -----

- post_id

- title

- tag_ids "1,2,3,4"

Why bad?

- hard to query,

- hard to enforce validity,

- hard to update,

- hard to index,

- prone to corruption.

Better:

- post_tags

- ---------

- post_id

- tag_id

# Example Data Model: TaskTracker

Let us model TaskTracker properly.

## Entities

Likely entities:

- User,

- Project,

- Task,

- Comment,

- Label,

- Assignment.

## Relationships

Possible relationships:

- User has many Projects

- Project has many Tasks

- Task belongs to Project

- Task belongs to User as owner

- Task can have many Comments

- Comment belongs to Task

- Comment belongs to User as author

- Task can have many Labels

- Label can belong to many Tasks

- Task can be assigned to many Users

- User can be assigned to many Tasks

## Simplified Tables

### users

| column | type idea | constraint |
| --- | --- | --- |
| user_id | integer/UUID | primary key |
| email | string | unique, not null |
| password_hash | string | not null |
| created_at | timestamp | not null |

### projects

| column | type idea | constraint |
| --- | --- | --- |
| project_id | integer/UUID | primary key |
| owner_user_id | integer/UUID | foreign key to users |
| name | string | not null |
| created_at | timestamp | not null |

### tasks

| column | type idea | constraint |
| --- | --- | --- |
| task_id | integer/UUID | primary key |
| project_id | integer/UUID | foreign key to projects |
| owner_user_id | integer/UUID | foreign key to users |
| title | string | not null |
| description | text | nullable |
| status | enum/string | not null |
| priority | enum/string | nullable |
| due_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | not null |

### comments

| column | type idea | constraint |
| --- | --- | --- |
| comment_id | integer/UUID | primary key |
| task_id | integer/UUID | foreign key to tasks |
| user_id | integer/UUID | foreign key to users |
| body | text | not null |
| created_at | timestamp | not null |

### labels

| column | type idea | constraint |
| --- | --- | --- |
| label_id | integer/UUID | primary key |
| name | string | not null |
| color | string | nullable |

### task_labels

| column | type idea | constraint |
| --- | --- | --- |
| task_id | integer/UUID | foreign key |
| label_id | integer/UUID | foreign key |
| added_at | timestamp | not null |

Primary key could be composite:

\`PRIMARY KEY (task_id, label_id)\`

### assignments

| column | type idea | constraint |
| --- | --- | --- |
| task_id | integer/UUID | foreign key |
| user_id | integer/UUID | foreign key |
| assigned_at | timestamp | not null |
| assigned_by | integer/UUID | foreign key |

This is still simplified, but it shows how relationships become tables.

# Entity Relationship Diagram

A simple conceptual diagram:

- [users]

- |

- | 1

- |

- | many

- v

- [projects]

- |

- | 1

- |

- | many

- v

- [tasks]

- |

- | 1

- |

- | many

- v

- [comments]

And many-to-many:

- [tasks] many-to-many [labels]

- via task_labels

- [tasks] many-to-many [users]

- via assignments

In ASCII:

- users

- |

- | owns

- v

- projects

- |

- | contains

- v

- tasks

- | \\

- |  \\

- |   \\-- task_labels --> labels

- |

- \\------ assignments --> users

- |

- v

- comments

You do not need perfect diagramming skill.

You need to understand relationships.

# Indexes

## 17. What Is an Index?

### Simple explanation

An index is a data structure that helps the database find rows quickly.

### Formal term

Index.

### Analogy

Imagine a book.

Without an index, to find all mentions of “distributed systems,” you may read every page.

With an index, you jump directly to the relevant pages.

A database index works similarly.

### Example

Suppose users frequently run:

\`\`\`text
SELECT *
FROM tasks
WHERE user_id = 42
  AND status = 'open'
ORDER BY created_at DESC
LIMIT 20;

\`\`\`

Without an index, the database may scan many rows.

With an index on:

\`(user_id, status, created_at)\`

the database can find matching tasks much faster.

## 18. How Indexes Work Conceptually

Most relational databases use index structures similar to balanced trees, often B-trees.

You do not need to implement one.

The important idea:

An index stores values in an ordered way and points to the rows containing those values.

For example, an index on \`email\` may conceptually look like:

\`\`\`text
 → row 1
   → row 2
 → row 3

\`\`\`

When you search by email, the database can jump directly to the row.

## 19. Composite Indexes

A composite index contains multiple columns.

Example:

\`INDEX (user_id, status, created_at)\`

This helps queries that filter or sort using those columns in a compatible order.

Example good query:

- WHERE user_id = 42

- AND status = 'open'

- ORDER BY created_at DESC

Example maybe less effective query:

- WHERE status = 'open'

- ORDER BY created_at DESC

because it does not start with \`user_id\`.

Different databases handle this differently, but the beginner lesson is:

Index column order matters.

## 20. Index Trade-Offs

Indexes are not free.

### Advantages

- faster reads,

- faster filtering,

- faster sorting,

- faster uniqueness checks,

- better scalability for query-heavy systems.

### Disadvantages

- slower writes,

- more storage,

- more maintenance,

- possible index bloat,

- more complexity in query planning.

Every time you insert, update, or delete a row, the database may also update all relevant indexes.

So too many indexes can hurt write performance.

### Rule of thumb

Create indexes based on real access patterns.

Do not index every column blindly.

Ask:

Which queries run frequently?

Which columns are filtered, joined, sorted, or required to be unique?

# SQL Conceptually

SQL is the standard language used by many relational databases.

You do not need to master SQL for system design, but you should understand common operations.

## 21. SELECT

SELECT reads data.

Example:

\`\`\`text
SELECT task_id, title, status
FROM tasks
WHERE user_id = 42
  AND status = 'open'
ORDER BY created_at DESC
LIMIT 20;

\`\`\`

Meaning:

Give me up to 20 open tasks for user 42, newest first.

## 22. INSERT

INSERT creates data.

Example:

\`\`\`text
INSERT INTO tasks (
  user_id,
  title,
  status,
  created_at,
  updated_at
) VALUES (
  42,
  'Study system design',
  'open',
  NOW(),
  NOW()
);

\`\`\`

Meaning:

Create a new task.

## 23. UPDATE

UPDATE changes data.

Example:

\`\`\`text
UPDATE tasks
SET status = 'done',
    updated_at = NOW()
WHERE task_id = 123;

\`\`\`

Meaning:

Mark task 123 as done.

Important:

Always be careful with UPDATE.

Without WHERE, you may update all rows.

## 24. DELETE

DELETE removes data.

Example:

- DELETE FROM tasks

- WHERE task_id = 123;

In many systems, you may prefer soft delete:

\`\`\`text
UPDATE tasks
SET deleted_at = NOW()
WHERE task_id = 123;

\`\`\`

Then queries usually include:

\`WHERE deleted_at IS NULL\`

Soft delete has trade-offs, discussed later.

## 25. JOIN

JOIN combines rows from related tables.

Example:

\`\`\`text
SELECT tasks.title, users.email
FROM tasks
JOIN users ON tasks.user_id = users.user_id
WHERE tasks.status = 'open';

\`\`\`

Meaning:

Get open tasks along with owner email.

Joins are powerful but can become expensive if not indexed properly.

# Transactions

## 26. What Is a Transaction?

### Simple explanation

A transaction is a group of database operations that are treated as one all-or-nothing unit.

### Formal term

Transaction.

### Example

Suppose transferring money involves:

- 1. Deduct $100 from Alice.

- 2. Add $100 to Bob.

If step 1 succeeds but step 2 fails, money disappears.

That is unacceptable.

A transaction ensures both happen or neither happens.

## 27. ACID

ACID describes properties of reliable transactions.

| Letter | Meaning | Simple explanation |
| --- | --- | --- |
| A | Atomicity | All operations happen, or none happen |
| C | Consistency | Database moves from valid state to valid state |
| I | Isolation | Concurrent transactions do not interfere incorrectly |
| D | Durability | Once committed, data survives failures |

Let us explain each simply.

### Atomicity

Atomicity means:

All or nothing.

Example:

- BEGIN TRANSACTION

- INSERT order

- INSERT order_items

- UPDATE inventory

- COMMIT

If any step fails:

\`ROLLBACK\`

The database undoes the partial work.

### Consistency

Consistency means:

The database should not end up in an invalid state.

Example:

- order total matches items,

- inventory does not go negative,

- foreign keys remain valid,

- unique constraints remain satisfied.

Consistency is enforced by constraints, application rules, and transactions.

### Isolation

Isolation means:

Transactions running at the same time should not see each other’s incomplete changes in confusing ways.

Example:

Two users try to buy the last concert ticket.

Without proper isolation/locking, both may think they succeeded.

The database helps prevent this.

Different isolation levels provide different guarantees and performance trade-offs.

Beginner intuition:

Stronger isolation is safer but may reduce concurrency.

### Durability

Durability means:

Once the database says the transaction committed, the data should survive crashes.

Databases use techniques such as write-ahead logs, checkpoints, and replication to provide durability.

You do not need implementation details yet.

Just remember:

Durability is why committed data should not disappear after ordinary failures.

## 28. Transaction Example: Creating an Order

Suppose an e-commerce system creates an order.

Operations:

- 1. Check inventory.

- 2. Reserve inventory.

- 3. Create order row.

- 4. Create order item rows.

- 5. Create payment intent.

These should happen atomically.

Conceptual transaction:

\`\`\`text
BEGIN

SELECT stock FROM products WHERE product_id = 77 FOR UPDATE;

IF stock >= 1 THEN
    UPDATE products SET stock = stock - 1 WHERE product_id = 77;
    INSERT INTO orders (...);
    INSERT INTO order_items (...);
    COMMIT;
ELSE
    ROLLBACK;
    RETURN "out_of_stock";
END IF;

\`\`\`

The exact syntax is less important than the idea:

Either the whole order succeeds, or nothing partially happens.

# Concurrency and Locks

## 29. Why Concurrency Matters

Real systems have many users acting at the same time.

Suppose two users update the same task.

User A sets status to \`done\`.

User B sets priority to \`high\`.

If the system is not careful, one update may overwrite the other.

Databases provide concurrency control.

## 30. Pessimistic Locking

### Simple explanation

Lock the row while you work on it.

Others must wait.

Example:

\`\`\`text
SELECT *
FROM tasks
WHERE task_id = 123
FOR UPDATE;

\`\`\`

Then update.

This prevents conflicting changes.

### Advantages

- strong protection against conflicts,

- simpler reasoning in some cases.

### Disadvantages

- reduces concurrency,

- can cause waiting,

- can cause deadlocks if not careful.

Use when conflicts are common or correctness is critical.

## 31. Optimistic Concurrency Control

### Simple explanation

Do not lock. Instead, check whether the row changed since you read it.

Common method: version column.

- tasks

- -----

- task_id

- title

- status

- version

User A reads task with version 5.

User B reads task with version 5.

User A updates:

\`\`\`text
UPDATE tasks
SET status = 'done',
    version = 6
WHERE task_id = 123
  AND version = 5;

\`\`\`

This succeeds.

User B tries:

\`\`\`text
UPDATE tasks
SET priority = 'high',
    version = 6
WHERE task_id = 123
  AND version = 5;

\`\`\`

This fails because version is now 6.

The application can reload and retry or tell the user:

Someone else changed this task. Please review and try again.

### Advantages

- better concurrency,

- no long locks,

- good for collaborative systems.

### Disadvantages

- conflicts must be handled by application,

- retries may be needed.

### Practical use

Optimistic concurrency is common for user-edited documents, profiles, tasks, and CMS content.

# NoSQL Databases

NoSQL does not mean “no SQL.”

It usually means “not primarily relational.”

NoSQL databases are designed for specific data shapes, scale patterns, or access patterns.

Important rule:

NoSQL is not automatically better or worse.

It is a different set of trade-offs.

## 32. Key-Value Stores

### Simple explanation

A key-value store maps keys to values.

You ask for a value by providing its key.

### Example

- session:abc123 → { user_id: 42, expires_at: ... }

- user_profile:42 → { name: "Alice", avatar: "..." }

### Operations

Typical operations:

- GET key

- SET key value

- DELETE key

### Advantages

- very simple,

- fast lookups,

- easy to scale,

- good for caches and sessions.

### Disadvantages

- limited querying,

- no rich relationships,

- hard to answer “find all tasks for user” unless key design supports it.

### Good uses

- caching,

- session storage,

- simple lookup tables,

- feature flags,

- counters,

- temporary tokens.

Conceptual examples:

- Redis,

- Memcached,

- DynamoDB,

- RocksDB.

## 33. Document Databases

### Simple explanation

A document database stores semi-structured documents, often JSON-like.

Each document can have its own fields.

### Example

An order document:

\`\`\`text
{
  "order_id": "ord_123",
  "user_id": "usr_42",
  "status": "paid",
  "items": [
    {
      "product_id": "prod_77",
      "quantity": 2,
      "price_cents": 1500
    },
    {
      "product_id": "prod_88",
      "quantity": 1,
      "price_cents": 900
    }
  ],
  "shipping_address": {
    "line1": "123 Main St",
    "city": "Springfield"
  },
  "created_at": "2026-10-05T10:30:00Z"
}


\`\`\`
### Advantages

- flexible schema,

- natural fit for JSON APIs,

- can embed related data,

- good for hierarchical objects.

### Disadvantages

- duplication can occur,

- updating embedded data can be complex,

- relationships are not as natural as in relational databases,

- transactions may be weaker or more complex depending on system.

### Good uses

- catalogs,

- content management,

- user profiles,

- event payloads,

- documents with variable fields.

Conceptual examples:

- MongoDB,

- Couchbase,

- Firestore,

- DynamoDB with document-like usage.

## 34. Column-Family / Wide-Column Stores

### Simple explanation

These stores organize data by columns rather than rows.

They are often good for massive write throughput and time-series-like access.

### Example

Sensor readings:

- user_id = 42

- timestamp = 2026-10-05T10:00:00Z

- temperature = 22.5

- humidity = 48

Data may be partitioned by user and time.

### Advantages

- good for large-scale writes,

- efficient for certain analytical access patterns,

- can compress well.

### Disadvantages

- not ideal for ad hoc relational queries,

- data modeling must match access patterns very carefully,

- operational complexity can be high.

### Good uses

- logs,

- metrics,

- IoT data,

- event streams,

- analytical workloads.

Conceptual examples:

- Cassandra,

- HBase,

- Bigtable-like systems.

## 35. Graph Databases

### Simple explanation

Graph databases store entities as nodes and relationships as edges.

They are good when relationships are the main thing you query.

### Example

Social network:

- Alice --follows--> Bob

- Bob --follows--> Carol

- Carol --likes--> Post123

Query:

Find friends of friends of Alice who liked posts about system design.

### Advantages

- natural for highly connected data,

- efficient traversal of relationships,

- good for recommendation, fraud detection, social graphs.

### Disadvantages

- not always best for simple tabular data,

- can be operationally specialized,

- queries may become complex.

### Good uses

- social networks,

- knowledge graphs,

- fraud detection,

- recommendation engines,

- network topology.

Conceptual examples:

- Neo4j,

- Amazon Neptune,

- JanusGraph.

# Other Important Data Stores

A backend system often uses more than one kind of data store.

This is called polyglot persistence.

Simple meaning:

Use different stores for different kinds of data.

## 36. Object Storage

### Simple explanation

Object storage stores files as objects.

Each object has data, metadata, and a unique key.

### Examples

- photos,

- videos,

- backups,

- uploaded documents,

- static assets.

### Why not database?

Large binary files can bloat databases.

Object storage is designed for:

- large files,

- high durability,

- HTTP access,

- metadata,

- versioning,

- lifecycle policies.

Conceptual examples:

- AWS S3,

- Google Cloud Storage,

- Azure Blob Storage,

- MinIO.

Important architectural pattern:

- Metadata in database

- File bytes in object storage

Example:

- photos table

- ------------

- photo_id

- user_id

- caption

- storage_key

- created_at

The database stores \`storage_key\`, not the whole image.

## 37. Search Indexes

### Simple explanation

Search indexes are optimized for text search and relevance ranking.

### Example

Users search:

\`"system design caching"\`

A relational database can do simple text matching, but full-text search at scale often needs a dedicated search engine.

### Good uses

- site search,

- product search,

- log search,

- document search.

Conceptual examples:

- Elasticsearch,

- OpenSearch,

- Solr,

- Meilisearch,

- Typesense.

Pattern:

- Primary database stores authoritative data

- Search index stores searchable copies

- Events update search index

## 38. Time-Series Databases

### Simple explanation

Time-series databases store measurements over time.

### Examples

- metrics,

- sensor readings,

- server stats,

- application events.

### Good uses

- monitoring,

- analytics,

- IoT.

Conceptual examples:

- Prometheus,

- InfluxDB,

- TimescaleDB.

## 39. Caches as Data Stores

A cache can act like a data store for temporary data.

Examples:

- session data,

- frequently accessed objects,

- computed results,

- rate limit counters.

But caches are usually not the primary source of truth.

Important distinction:

- Cache = speed

- Database = authority

If the cache loses data, the system should recover from the database.

If the database loses data, that may be a disaster.

# Choosing SQL vs NoSQL

This is one of the most common beginner confusion points.

People ask:

Is SQL better than NoSQL?

The correct answer is:

It depends.

More precisely:

Choose the data model based on access patterns, consistency requirements, schema stability, relationships, scale, operational constraints, and team familiarity.

## 40. When Relational Databases Are Often Good

Use a relational database when you need:

- strong relationships,

- transactions,

- ad hoc querying,

- data integrity constraints,

- structured schema,

- reporting,

- joins,

- uniqueness rules,

- mature operational tooling.

Examples:

- user accounts,

- orders,

- payments,

- invoices,

- inventory,

- task management,

- CRM systems.

A relational database is often a safe default for business applications.

## 41. When NoSQL May Be Good

Use NoSQL when:

- access patterns are simple and predictable,

- you need very high scale for specific operations,

- data is naturally document-like,

- schema varies a lot,

- you need low-latency key lookups,

- you are storing large numbers of events,

- relationships are graph-like and central,

- operational requirements favor a specialized store.

Examples:

- sessions in key-value store,

- product catalog documents,

- IoT events in wide-column store,

- social graph in graph database,

- cache in Redis-like store.

## 42. Decision Table

| Need | Often Better Fit |
| --- | --- |
| Strong transactions | Relational database |
| Complex relationships | Relational or graph, depending query pattern |
| Simple key lookup | Key-value store |
| Flexible JSON documents | Document database |
| Massive time-series writes | Column-family or time-series store |
| Social graph traversal | Graph database |
| Large file storage | Object storage |
| Full-text search | Search index |
| Temporary fast reads | Cache |
| Ad hoc reporting | Relational data warehouse or OLAP system |

Do not memorize this as law.

Use it as a starting point.

# Data Modeling Process

Now let us build a repeatable method.

Data modeling is not just “make tables.”

It is designing how the system remembers reality.

## Step 1: Identify Entities

Ask:

What important things does the system track?

For TaskTracker:

- User,

- Project,

- Task,

- Comment,

- Label.

For a ride booking system:

- Rider,

- Driver,

- Vehicle,

- Trip,

- LocationUpdate,

- Payment,

- Rating.

For a chat system:

- User,

- Conversation,

- Message,

- Participant,

- ReadReceipt.

## Step 2: Identify Attributes

Ask:

What information do we need about each entity?

For Task:

- task_id

- project_id

- owner_user_id

- title

- description

- status

- priority

- due_at

- created_at

- updated_at

- deleted_at

Do not add fields “just in case.”

Each field has storage, validation, and maintenance cost.

But also do not omit fields required by access patterns.

## Step 3: Identify Relationships

Ask:

How do entities relate?

Examples:

- User has many Tasks

- Task belongs to Project

- Task has many Comments

- Task many-to-many Labels

- Task many-to-many Assignees

Define cardinality:

| Cardinality | Meaning |
| --- | --- |
| One-to-one | One row relates to one row |
| One-to-many | One row relates to many rows |
| Many-to-many | Many rows relate to many rows |

## Step 4: Identify Access Patterns

This is crucial.

Ask:

How will the system query this data?

Examples for TaskTracker:

- Get all open tasks for a user, sorted by due date.

- Get all tasks in a project.

- Get comments for a task.

- Search tasks by title.

- Get tasks assigned to me.

- Get overdue tasks.

Each access pattern may imply indexes or denormalization.

Example:

\`WHERE user_id = ? AND status = ? ORDER BY due_at\`

suggests index:

\`(user_id, status, due_at)\`

Example:

\`WHERE assigned_user_id = ?\`

may require an assignment table indexed by user.

## Step 5: Define Constraints

Ask:

What must always be true?

Examples:

- email unique,

- task title not empty,

- task status in allowed set,

- comment body not empty,

- assignment must reference existing task and user,

- only one active username change per day,

- order total must match items.

Constraints protect data quality.

Do not rely only on application code.

Application code can have bugs.

Database constraints can catch invalid states.

## Step 6: Choose Storage Model

Ask:

Which store fits the data shape and access pattern?

Examples:

- Users, tasks, orders: relational database.

- Sessions: key-value store.

- Product catalog with variable attributes: document database.

- Friend graph: graph database.

- Photos: object storage plus metadata database.

- Logs: time-series or column store.

- Search: search index.

## Step 7: Design Schema

Now define tables, columns, keys, and relationships.

Example:

- tasks

- -----

- task_id PK

- project_id FK

- owner_user_id FK

- title NOT NULL

- status NOT NULL

- priority

- due_at

- created_at NOT NULL

- updated_at NOT NULL

- deleted_at

Indexes:

- idx_tasks_owner_status_due

- ON tasks (owner_user_id, status, due_at)

- idx_tasks_project

- ON tasks (project_id)

## Step 8: Consider Growth and Evolution

Ask:

- How much data will this create per day?

- How long must we retain it?

- Will schema change often?

- Will queries change?

- Will traffic become read-heavy or write-heavy?

- Do we need archival?

- Do we need soft deletes?

- Do we need audit history?

Data modeling is not only for today.

It should not overpredict the future, but it should avoid obvious traps.

# Normalization and Denormalization

## 43. What Is Normalization?

### Simple explanation

Normalization is organizing data to reduce duplication and dependency.

### Example

Instead of storing user email inside every task row, store user once in \`users\` and refer to \`user_id\`.

Bad:

- tasks

- -----

- task_id

- user_email

- title

Better:

- users

- -----

- user_id

- email

- tasks

- -----

- task_id

- user_id

- title

### Advantages

- less duplication,

- easier updates,

- better consistency,

- smaller storage in many cases.

### Disadvantages

- queries may need joins,

- read performance may suffer if not indexed,

- can be more complex for some access patterns.

## 44. What Is Denormalization?

### Simple explanation

Denormalization means intentionally duplicating data to improve read performance.

### Example

A task list page often needs:

- task title,

- owner name,

- project name.

Normalized:

- tasks

- users

- projects

Query requires joins.

Denormalized:

- tasks

- -----

- task_id

- title

- owner_name

- project_name

- owner_user_id

- project_id

Now the task list can be read faster.

### Advantages

- faster reads,

- fewer joins,

- simpler query for some endpoints.

### Disadvantages

- data can become inconsistent,

- updates must touch multiple places,

- more storage,

- more complex write logic.

### When denormalization may be useful

- read-heavy workloads,

- expensive joins,

- stable derived fields,

- reporting/dashboards,

- feeds and timelines.

### Important warning

Do not denormalize without a plan for keeping copies consistent.

# Soft Deletes, Audit Fields, and Versioning

## 45. Soft Deletes

### Simple explanation

Instead of removing a row, mark it as deleted.

Example:

\`deleted_at timestamp NULL\`

Query normally:

\`\`\`text
SELECT *
FROM tasks
WHERE deleted_at IS NULL;


\`\`\`
### Advantages

- recovery possible,

- audit history preserved,

- foreign key relationships easier to keep,

- useful for user-facing “trash” features.

### Disadvantages

- queries must remember filter,

- unique constraints become tricky,

- storage grows,

- “deleted” data may raise privacy/compliance concerns.

### Hard delete

Actually remove the row.

Use when:

- privacy requires deletion,

- data is temporary,

- storage matters,

- relationships can be safely removed.

Many systems use a combination:

- soft delete for user recoverability,

- hard delete after retention period,

- anonymization for compliance.

## 46. Audit Fields

Common fields:

- created_at

- updated_at

- created_by

- updated_by

- deleted_at

- version

They help answer:

- When was this created?

- Who changed it?

- When was it last updated?

- Is this stale?

- Can we detect concurrent edits?

## 47. Version Columns

A version column supports optimistic concurrency.

Example:

- tasks

- -----

- task_id

- title

- status

- version

Each update increments version.

This helps prevent lost updates.

# Data Types and Practical Choices

You do not need to master every database type, but some choices matter.

## 48. Strings

Use appropriate length limits.

Examples:

- email: maybe 254 characters,

- username: 3–30 characters,

- title: 200 characters,

- body: text type.

Validate length in API and database.

## 49. Money

Do not store money as floating-point numbers if precision matters.

Bad:

\`amount = 19.99\`

Floating point can cause rounding errors.

Better:

- amount_cents = 1999

- currency = USD

Store integer cents plus currency code.

For accounting systems, consider decimal types with proper scale.

## 50. Timestamps

Store timestamps in UTC.

Example:

\`2026-10-05T10:30:00Z\`

Convert to user timezone only in presentation.

Avoid storing local time with ambiguous offsets unless you know why you need it.

## 51. Booleans and Enums

Status fields are often better as enums or controlled strings.

Example:

\`status: open | in_progress | done | archived\`

Do not allow arbitrary client-supplied status values.

Validate against allowed set.

## 52. JSON Columns

Many relational databases support JSON columns.

Example:

- tasks

- -----

- task_id

- title

- metadata JSON

This can be useful for flexible attributes.

But be careful:

- querying JSON can be harder,

- indexing JSON may be limited,

- schema drift can become messy,

- validation may move to application code.

Use JSON columns intentionally, not as an excuse to avoid modeling.

# Request Flow: Reading and Writing Data

Let us connect databases to APIs.

## Flow 1: Create Task

API:

\`POST /v1/tasks\`

User action:

\`User clicks Save.\`

Request:

\`\`\`text
{
  "title": "Study system design",
  "project_id": "42"
}

\`\`\`

Flow:

\`\`\`text
Client
  ↓
API Server
  ↓
Authenticate user
  ↓
Validate input
  ↓
Check project ownership/access
  ↓
INSERT INTO tasks (...)
  ↓
Database commits row
  ↓
Return task JSON

\`\`\`

Database operation:

\`\`\`text
INSERT INTO tasks (
  project_id,
  owner_user_id,
  title,
  status,
  created_at,
  updated_at
) VALUES (
  42,
  1,
  'Study system design',
  'open',
  NOW(),
  NOW()
);

\`\`\`

Failure cases:

- invalid project ID,

- user not allowed,

- database constraint violation,

- database timeout,

- transaction rollback.

## Flow 2: List Open Tasks

API:

\`GET /v1/tasks?status=open&limit=20\`

Flow:

\`\`\`text
Client
  ↓
API Server
  ↓
Authenticate user
  ↓
Build query
  ↓
SELECT tasks
  ↓
Database uses index
  ↓
Return paginated results

\`\`\`

Database query:

\`\`\`text
SELECT task_id, title, status, due_at, created_at
FROM tasks
WHERE owner_user_id = 1
  AND status = 'open'
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 21;

\`\`\`

Why \`LIMIT 21\` if page size is 20?

To know whether there is a next page.

If 21 rows return, there is more data.

Return only 20 items and a cursor.

## Flow 3: Update Task

API:

\`PATCH /v1/tasks/123\`

Request:

\`\`\`text
{
  "status": "done"
}

\`\`\`

Flow:

\`\`\`text
Client
  ↓
API Server
  ↓
Authenticate
  ↓
Load task or check version
  ↓
Authorize owner/editor
  ↓
UPDATE tasks
  ↓
Return updated task

\`\`\`

With optimistic concurrency:

\`\`\`text
UPDATE tasks
SET status = 'done',
    updated_at = NOW(),
    version = version + 1
WHERE task_id = 123
  AND version = 5;

\`\`\`

If zero rows updated, someone else changed it.

Return conflict or reload.

# Simple Example: Blog Data Model

Let us model a blog.

## Entities

- User,

- Post,

- Comment,

- Tag.

## Relationships

- User has many Posts

- Post has many Comments

- Post many-to-many Tags

## Tables

### users

- user_id

- email

- password_hash

- created_at

### posts

- post_id

- author_user_id

- title

- slug

- body

- status

- published_at

- created_at

- updated_at

### comments

- comment_id

- post_id

- user_id

- body

- created_at

### tags

- tag_id

- name

### post_tags

- post_id

- tag_id

## Useful Indexes

For viewing published posts:

\`INDEX (status, published_at)\`

For author posts:

\`INDEX (author_user_id, published_at)\`

For comments:

\`INDEX (post_id, created_at)\`

For slug lookup:

\`UNIQUE INDEX (slug)\`

# Practical Example: Chat Data Model

Chat systems have different access patterns.

Users often need:

- conversations list,

- messages in a conversation,

- unread counts,

- last message preview.

## Entities

- User,

- Conversation,

- Participant,

- Message,

- ReadState.

## Tables

### users

- user_id

- display_name

- created_at

### conversations

- conversation_id

- type

- created_at

- last_message_at

Type may be \`direct\` or \`group\`.

### participants

- conversation_id

- user_id

- joined_at

- role

Primary key:

\`(conversation_id, user_id)\`

### messages

- message_id

- conversation_id

- sender_user_id

- body

- created_at

Index:

\`INDEX (conversation_id, created_at)\`

### read_states

- conversation_id

- user_id

- last_read_message_id

- last_read_at

Primary key:

\`(conversation_id, user_id)\`

## Access Pattern

Get messages:

\`\`\`text
SELECT message_id, sender_user_id, body, created_at
FROM messages
WHERE conversation_id = 77
  AND created_at < 'cursor_time'
ORDER BY created_at DESC
LIMIT 50;

\`\`\`

This suggests index:

\`(conversation_id, created_at)\`

## Design Insight

Chat systems can become write-heavy.

Message storage may need partitioning by conversation or time.

You will study scaling later.

For now, notice how access patterns shape indexes and tables.

# Practical Example: E-Commerce Order Data Model

Orders require strong consistency.

## Entities

- User,

- Product,

- Order,

- OrderItem,

- Payment,

- ShippingAddress.

## Tables

### users

- user_id

- email

### products

- product_id

- name

- price_cents

- currency

- stock_quantity

- version

### orders

- order_id

- user_id

- status

- total_cents

- currency

- created_at

- updated_at

### order_items

- order_id

- product_id

- quantity

- unit_price_cents

Primary key:

\`(order_id, product_id)\`

### payments

- payment_id

- order_id

- amount_cents

- currency

- status

- provider_payment_id

- created_at

## Transaction Example

Create order:

- BEGIN

- Lock/check product stock.

- If enough stock:

- UPDATE products SET stock_quantity = stock_quantity - ?, version = version + 1

- WHERE product_id = ? AND stock_quantity >= ?;

- INSERT INTO orders ...

- INSERT INTO order_items ...

- COMMIT

- ELSE:

- ROLLBACK

Important:

The exact implementation depends on database capabilities and scale.

But the architectural idea is:

Order creation must avoid overselling inventory.

# Choosing Primary Keys in System Design

Primary key choice affects storage, indexing, distribution, and security.

## Auto-Increment Integer

Example:

\`task_id = 123\`

Advantages:

- small,

- fast,

- naturally ordered,

- good for local indexes.

Disadvantages:

- predictable,

- hard to generate across distributed systems without coordination,

- may expose business volume.

Use when:

- single database,

- internal IDs,

- ordering is useful,

- enumeration risk is low.

## UUID

Example:

\`9f8b7c6d-5e4f-4a3b-8c9d-0e1f2a3b4c5d\`

Advantages:

- globally unique,

- can be generated by clients/services,

- harder to guess than sequential IDs.

Disadvantages:

- larger,

- random UUIDs can hurt index locality,

- less human-friendly.

Use when:

- distributed generation,

- public IDs,

- merge across systems.

Variants like UUIDv7 or ULID can provide time-sortable properties.

## Short Codes

Example:

Advantages:

- compact,

- user-friendly.

Disadvantages:

- collision handling,

- limited namespace,

- may need alphabet choices,

- abuse/enumeration considerations.

Use when:

- URLs,

- invite codes,

- coupon codes.

# Common Beginner Mistakes

## Mistake 1: Storing Everything in One Giant JSON Blob

Example:

- users

- -----

- user_id

- everything JSON

Why bad?

- hard to query,

- hard to index,

- hard to enforce constraints,

- hard to update parts safely,

- easy to create inconsistent data.

Sometimes JSON is useful.

But do not use it to avoid modeling.

## Mistake 2: No Indexes for Frequent Queries

If every request runs:

\`WHERE user_id = ? AND status = ?\`

and there is no index, the database may scan too much data.

Symptoms:

- slow API,

- high CPU,

- high I/O,

- timeouts under load.

Lesson:

Data model must match access patterns.

## Mistake 3: Indexing Everything

Too many indexes hurt writes.

Every insert/update/delete may update multiple indexes.

Lesson:

Index based on real query needs.

## Mistake 4: Ignoring Relationships

Beginners may store:

\`task.owner_email\`

instead of:

\`task.owner_user_id\`

Then if email changes, many rows must update.

Also, you cannot enforce that the email belongs to a real user.

Lesson:

Use keys and relationships.

## Mistake 5: Storing Large Files in Database Rows

Putting images or videos directly in database columns may cause:

- bloated database,

- slow backups,

- memory pressure,

- poor scalability.

Better:

- metadata in database

- file bytes in object storage

## Mistake 6: Using Database as Cache

A database should usually be the source of truth.

A cache is for speed.

If you store only temporary cache-like data in the primary database, you may waste capacity and create cleanup problems.

Conversely, if you treat cache as source of truth, data loss becomes likely.

## Mistake 7: No Constraints

If the database allows:

- duplicate emails,

- invalid statuses,

- orphan comments,

- negative quantities,

then bugs will eventually create bad data.

Use constraints where appropriate.

## Mistake 8: SELECT * in Application Code

\`SELECT *\` may fetch unnecessary columns.

Problems:

- more bandwidth,

- more memory,

- schema changes may break assumptions,

- harder to optimize.

Select needed fields.

## Mistake 9: Ignoring Concurrency

Two users edit the same document.

Without versioning or locking, one update may overwrite another.

Lesson:

Decide concurrency strategy early.

## Mistake 10: Overnormalizing Without Access Pattern Thought

Fully normalized schemas are elegant but may require many joins for common reads.

If the system is read-heavy, some denormalization or materialized views may help.

Do not normalize purely for theory.

Model for real queries.

## Mistake 11: Undernormalizing Causing Update Anomalies

Storing user name in every task row means changing a user name requires updating many rows.

If one update fails, data becomes inconsistent.

Lesson:

Avoid unnecessary duplication unless you have a consistency plan.

## Mistake 12: No Plan for Deletion and Retention

Data accumulates.

Ask:

- Do we keep deleted records?

- For how long?

- Can users request deletion?

- Do logs expire?

- Do old analytics move to cheaper storage?

Without retention policy, storage and compliance become problems.

## Mistake 13: Copying Schema from Another System

A chat schema may not fit a task tracker.

A social graph schema may not fit an order system.

Access patterns differ.

Lesson:

Model from your requirements.

# Deep Dive

Now we go deeper into important database design ideas.

## Deep Dive 1: Cardinality and Participation

Cardinality describes how many rows can relate.

Examples:

- One user can have many tasks.

- One task belongs to one user.

This is one-to-many.

- One post can have many tags.

- One tag can belong to many posts.

This is many-to-many.

Participation asks:

Is the relationship required?

Example:

- A task must have an owner: required participation.

- A task may have a due date: optional.

This affects NOT NULL constraints.

## Deep Dive 2: Surrogate Keys vs Natural Keys

### Surrogate key

An artificial ID with no business meaning.

Example:

\`user_id = 987654\`

Advantages:

- stable,

- simple,

- independent of business data.

Disadvantages:

- extra column,

- may be less meaningful to humans.

### Natural key

A real-world identifier.

Example:

- username

- email

- national_id

- sku

Advantages:

- meaningful,

- can enforce uniqueness naturally.

Disadvantages:

- may change,

- may be sensitive,

- may vary by country/system.

Common pattern:

- Use surrogate primary key.

- Enforce natural key uniqueness with unique constraint.

Example:

- users

- -----

- user_id PK

- email UNIQUE

## Deep Dive 3: Composite Primary Keys

A composite primary key uses multiple columns.

Example:

- enrollments

- -----------

- student_id

- course_id

- enrolled_at

- PRIMARY KEY (student_id, course_id)

This prevents duplicate enrollment.

Advantages:

- expresses natural uniqueness,

- can reduce need for extra ID.

Disadvantages:

- foreign keys become more complex,

- joining can be harder,

- some ORMs/tools handle composite keys less smoothly.

Use when natural composite uniqueness is clear.

## Deep Dive 4: Junction / Bridge Tables

Many-to-many relationships require a bridge table.

Example:

- post_tags

- ---------

- post_id

- tag_id

- created_at

- PRIMARY KEY (post_id, tag_id)

- INDEX (tag_id, post_id)

Why index both directions?

Because queries may be:

\`WHERE post_id = ?\`

and:

\`WHERE tag_id = ?\`

Different access patterns need different indexes.

## Deep Dive 5: Materialized Views and Precomputation

Sometimes it is useful to store computed results.

Example:

- user_task_counts

- ----------------

- user_id

- open_count

- done_count

- updated_at

Instead of counting tasks every time, update counts periodically or on events.

Advantages:

- faster reads,

- reduced database load.

Disadvantages:

- extra consistency complexity,

- stale data possible,

- update logic required.

Use when read patterns justify it.

## Deep Dive 6: Event Sourcing, Introduced Lightly

Normal database model:

\`Store current state.\`

Event sourcing:

- Store sequence of events.

- Reconstruct state by replaying events.

Example:

- TaskCreated

- TaskTitleUpdated

- TaskCompleted

- TaskAssigned

Advantages:

- audit trail,

- replayability,

- temporal queries.

Disadvantages:

- complexity,

- snapshots needed,

- harder ad hoc querying,

- event schema evolution.

Do not adopt event sourcing just because it sounds advanced.

Use when audit/replay is genuinely important.

## Deep Dive 7: CQRS, Introduced Lightly

CQRS means Command Query Responsibility Segregation.

Simple idea:

Separate write model and read model.

Writes update authoritative data.

Reads use optimized views/indexes.

Example:

\`\`\`text
Command side:
CreateOrder → Orders DB

Query side:
OrderSummaryView → Search index / read DB

\`\`\`

Advantages:

- optimize reads and writes separately,

- scale read-heavy systems.

Disadvantages:

- eventual consistency,

- more components,

- more complexity.

Again, not automatic. Use when needs justify it.

## Deep Dive 8: Data Ownership and Source of Truth

A critical system design question:

Which store is authoritative?

Example:

- User email:

- - Auth service DB may be source of truth.

- - Search index has copy.

- - Cache has copy.

- - Analytics warehouse has copy.

If copies disagree, which one wins?

Usually the source of truth wins.

Other stores must be updated from events or sync jobs.

Lesson:

Every copied datum needs a freshness and reconciliation strategy.

## Deep Dive 9: Schema Migrations

Real systems change.

You may need to:

- add column,

- rename column,

- backfill data,

- add index,

- split table,

- remove column.

Migrations should be safe.

Common pattern:

- Add new column as nullable.

- Backfill old rows gradually.

- Write to both old and new fields.

- Read from new field.

- Remove old field later.

This avoids downtime and large locks.

You will encounter this more in operations and scaling chapters.

For now, understand:

Database evolution is a system design concern, not just a coding detail.

## Deep Dive 10: Privacy and Data Minimization

Databases store personal data.

Ask:

- Do we need this field?

- How long do we keep it?

- Who can access it?

- Is it encrypted?

- Can users delete it?

- Is it logged accidentally?

Example:

Do not store full credit card numbers unless you have a very strong reason and compliance capability.

Store tokens from payment provider instead.

Lesson:

Less sensitive data stored means less risk.

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

Why is storing tasks in a JSON file risky for a multi-user backend?

Answer direction:

Because concurrent writes can overwrite each other, queries can be inefficient, constraints are hard to enforce, transactions are difficult, corruption is easier, and recovery is harder.

## Predict

Question:

A system has a \`tasks\` table with 100 million rows.

Users frequently query:

\`WHERE user_id = 42 AND status = 'open'\`

There is no index on \`user_id\` or \`status\`.

What happens as traffic grows?

Answer direction:

The database may scan many rows for each query.

Latency increases.

CPU and disk I/O increase.

Under load, queries may time out.

The database becomes a bottleneck.

## Find the Bottleneck

Question:

An API endpoint:

\`GET /v1/tasks\`

returns all tasks for a user.

Some users have 50,000 tasks.

What is likely to break?

Answer direction:

- database returns huge result set,

- server memory grows during serialization,

- response payload becomes large,

- network bandwidth increases,

- client rendering slows.

Fix with pagination and selective columns.

## Find the Failure

Question:

A transaction inserts an order and updates inventory.

The order insert succeeds, but inventory update fails.

What should happen?

Answer direction:

The transaction should roll back.

Neither partial order nor partial inventory change should remain.

## Compare

Question:

Which storage is better for session data?

Option A:

\`Relational database table sessions\`

Option B:

\`Key-value store with TTL\`

Answer direction:

Option B is often better for sessions because:

- lookup by session ID is simple,

- expiration/TTL is natural,

- high read/write rate,

- less need for joins or complex queries.

But Option A may be acceptable for small systems or if sessions need relational integrity.

## Design This

Question:

Model a simple forum.

Entities:

- User,

- Thread,

- Post,

- Category.

Relationships:

- Category has many Threads.

- Thread has many Posts.

- User writes many Posts.

- User starts many Threads.

What tables and keys would you create?

Answer direction:

- users

- -----

- user_id PK

- username

- email

- password_hash

- created_at

- categories

- ----------

- category_id PK

- name

- slug

- threads

- -------

- thread_id PK

- category_id FK

- author_user_id FK

- title

- created_at

- last_post_at

- posts

- -----

- post_id PK

- thread_id FK

- author_user_id FK

- body

- created_at

- updated_at

Indexes:

- threads(category_id, last_post_at)

- posts(thread_id, created_at)

- users(email UNIQUE)

- categories(slug UNIQUE)

# Architecture Exercise

## Weak Design

A beginner builds a task app with one table:

- tasks

- -----

- id

- data JSON

Every task is stored as a JSON blob:

\`\`\`text
{
  "title": "Buy milk",
  "user_email": "",
  "status": "open",
  "comments": [
    {"author": "", "text": "Done?"}
  ]
}

\`\`\`

Queries filter JSON fields.

No foreign keys.

No separate users table.

No indexes except primary key.

## Your Task

Identify problems.

Ask:

- Can we enforce valid user?

- Can we update comments efficiently?

- Can we query by user and status?

- Can we avoid duplicating user email?

- Can we enforce unique task IDs?

- Can we handle concurrent updates?

- Can we index common fields?

- What happens if JSON schema changes?

## Hint 1 — Requirements Hint

Ask:

What are the real access patterns?

Likely:

- list tasks by user,

- filter by status,

- add comments,

- update task fields,

- enforce user identity.

## Hint 2 — Architecture Hint

Separate entities:

- users,

- tasks,

- comments.

Use relational tables for structured data.

Use foreign keys.

## Hint 3 — Scaling Hint

Add indexes for frequent filters and sorts.

Avoid fetching entire JSON if only some fields are needed.

## Hint 4 — Reliability Hint

Use constraints to prevent invalid data.

Use transactions for multi-row operations.

## Improved Design Direction

- users

- -----

- user_id PK

- email UNIQUE

- password_hash

- created_at

- tasks

- -----

- task_id PK

- owner_user_id FK

- title NOT NULL

- status NOT NULL

- created_at

- updated_at

- deleted_at

- comments

- --------

- comment_id PK

- task_id FK

- author_user_id FK

- body NOT NULL

- created_at

Indexes:

- tasks(owner_user_id, status, created_at)

- comments(task_id, created_at)

This is easier to query, safer, and more scalable.

# Design Exercise: Pastebin Data Model

Design the data model for a simple Pastebin-like system.

Users can:

- create a paste,

- retrieve a paste by ID,

- set expiration,

- optionally delete paste.

Assume:

- anonymous users can create pastes,

- paste body can be up to 100 KB,

- pastes expire after 30 days by default,

- reads are much more frequent than writes,

- no user accounts yet.

## Step 1: Clarify Requirements

Questions:

- Are pastes public?

- Do we need password protection?

- Do we need syntax highlighting metadata?

- Do we need view counts?

- Do we need edit history?

- How long do we retain deleted pastes?

Assume:

- public pastes,

- no password,

- optional language field,

- no view counts initially,

- no edit history,

- hard delete after expiry.

## Step 2: Identify Entities

- Paste.

Maybe later:

- User,

- Folder,

- Revision.

But keep simple.

## Step 3: Attributes

Paste:

- paste_id

- body

- language

- expires_at

- created_at

Maybe:

- size_bytes

- checksum

## Step 4: Access Patterns

Create:

\`INSERT paste\`

Read:

\`SELECT paste WHERE paste_id = ?\`

Expiration cleanup:

- SELECT pastes WHERE expires_at < NOW()

- DELETE expired pastes

## Step 5: Storage Choice Options

Option A: Relational database.

Good if:

- paste size is moderate,

- you want simple transactions,

- you may add users later.

Option B: Key-value store.

Good if:

- access is mainly by paste_id,

- expiration/TTL is native,

- high read volume.

Option C: Object storage plus metadata DB.

Probably overkill for 100 KB text pastes.

Better for large files.

## Step 6: Simple Relational Schema

- pastes

- ------

- paste_id PK

- body TEXT NOT NULL

- language VARCHAR(50)

- expires_at TIMESTAMP NOT NULL

- created_at TIMESTAMP NOT NULL

Index:

\`INDEX (expires_at)\`

for cleanup.

Primary key may be short code or UUID.

If public URL uses short code:

- pastes

- ------

- short_code PK

- body

- language

- expires_at

- created_at

Unique short code generation is an architectural concern.

## Step 7: Simple Key-Value Design

Key:

\`paste:{short_code}\`

Value:

\`\`\`text
{
  "body": "...",
  "language": "python",
  "expires_at": "2026-11-04T10:30:00Z",
  "created_at": "2026-10-05T10:30:00Z"
}

\`\`\`

TTL:

\`30 days\`

Advantages:

- fast reads,

- natural expiration.

Disadvantages:

- harder to query by language or creation date,

- less relational flexibility.

For this access pattern, key-value may be excellent.

## Hint System

If you want to try before reading solution:

### Hint 1 — Requirements Hint

Ask:

- What is the main read pattern?

- Is expiration important?

- Do we need search?

### Hint 2 — Architecture Hint

If access is mostly by ID, key-value is attractive.

If you need relationships later, relational may be better.

### Hint 3 — Scaling Hint

Read-heavy systems may benefit from caching.

But source of truth should still be durable.

### Hint 4 — Reliability Hint

Pastes should not disappear before expiry unless deleted.

Use durable storage and backups if product requires it.

## Final Solution Direction

For a simple Pastebin:

\`Key-value store with TTL\`

is often a good fit.

Conceptual architecture:

- [Client]

- |

- v

- [API Server]

- |

- v

- [Key-Value Store]

Create:

- SET paste:abc123 → JSON body, language, created_at

- EXPIRE paste:abc123 30 days

Read:

\`GET paste:abc123\`

If you later add users, search, permissions, and analytics, you may introduce:

- [Metadata Database]

- [Object/Document Store]

- [Search Index]

Start simple.

Evolve when requirements demand.

# Practice Questions

Try answering without rereading.

## Conceptual Questions

- What is persistence?

- What is a database?

- What is a schema?

- What is a table?

- What is a row?

- What is a column?

- What is a primary key?

- What is a foreign key?

- What is a unique constraint?

- What is an index?

- What is a transaction?

- What does ACID mean?

- What is a one-to-many relationship?

- What is a many-to-many relationship?

- What is a join table?

- What is normalization?

- What is denormalization?

- What is a key-value store?

- What is a document database?

- What is object storage?

- Why might you store files outside the database?

- What is soft delete?

- What is optimistic concurrency control?

- What is a composite key?

- Why do access patterns matter in data modeling?

## Modeling Questions

### Question 1

Model a blog with users, posts, comments, and tags.

Expected entities:

- users

- posts

- comments

- tags

- post_tags

Relationships:

- User has many Posts

- Post has many Comments

- Post many-to-many Tags

### Question 2

Model a system where a user can belong to many teams, and a team can have many users.

Expected:

- users

- teams

- team_members

\`team_members\` is a join table.

### Question 3

Model an order system where an order has many items and each item refers to a product.

Expected:

- orders

- order_items

- products

Relationships:

- Order has many OrderItems

- OrderItem references Product

### Question 4

A task can have many labels, and a label can belong to many tasks.

What table do you need?

Answer:

\`task_labels\`

join table.

## Index Questions

### Question 1

Query:

\`\`\`text
SELECT *
FROM tasks
WHERE user_id = ?
  AND status = ?
ORDER BY created_at DESC
LIMIT 20;

\`\`\`

What index might help?

Answer:

\`(user_id, status, created_at)\`

### Question 2

Why can too many indexes hurt performance?

Answer direction:

Because writes must update indexes, increasing latency and storage.

### Question 3

You often query by email.

What constraint/index is useful?

Answer:

\`UNIQUE INDEX on email\`

## Transaction Questions

### Question 1

Why use a transaction for transferring money?

Answer direction:

To ensure both debit and credit happen together, preventing lost money.

### Question 2

What does rollback mean?

Answer direction:

Undo operations in the transaction so database returns to prior valid state.

### Question 3

Two users try to buy the last ticket.

How can the database prevent overselling?

Answer direction:

Use transaction with locking or conditional update:

\`\`\`text
UPDATE tickets
SET remaining = remaining - 1
WHERE event_id = 42
  AND remaining > 0;

\`\`\`

If zero rows updated, ticket is gone.

# Interview Questions

These are common beginner-to-intermediate system design interview questions.

## Question 1

Interviewer: Why do we need a database instead of storing data in files?

Good answer direction:

Databases provide durable storage, structured querying, indexing, constraints, transactions, concurrency control, and recovery. Files can work for simple cases, but multi-user systems need stronger guarantees and efficient access patterns.

## Question 2

Interviewer: What is the difference between SQL and NoSQL?

Good answer direction:

SQL databases are usually relational, schema-oriented, and strong in transactions and joins. NoSQL databases include key-value, document, column-family, and graph stores, often optimized for specific access patterns, scale, or flexibility. The choice depends on data shape, queries, consistency needs, and operational constraints.

## Question 3

Interviewer: When would you choose a relational database?

Good answer direction:

When data has relationships, requires transactions, needs strong consistency, has a relatively stable schema, and benefits from ad hoc querying and constraints. Examples: users, orders, payments, invoices.

## Question 4

Interviewer: When would you choose a key-value store?

Good answer direction:

When access is mostly by key, queries are simple, latency matters, and data does not need complex relationships. Examples: sessions, caches, feature flags, simple lookup tables.

## Question 5

Interviewer: What is an index and what is its trade-off?

Good answer direction:

An index speeds up reads by providing an ordered structure to locate rows. The trade-off is slower writes and extra storage because indexes must be maintained on insert/update/delete.

## Question 6

Interviewer: How would you model a many-to-many relationship?

Good answer direction:

Use a join/bridge table with foreign keys to both entities. For example, \`post_tags(post_id, tag_id)\` for posts and tags. Add indexes for both query directions.

## Question 7

Interviewer: What is a transaction?

Good answer direction:

A transaction groups operations so they either all commit or all rollback. It provides atomicity and helps maintain consistency, especially for operations like order creation or money transfer.

## Question 8

Interviewer: What is ACID?

Good answer direction:

Atomicity: all or nothing. Consistency: valid state to valid state. Isolation: concurrent transactions do not interfere incorrectly. Durability: committed data survives failures.

## Question 9

Interviewer: Would you store images in a database?

Good answer direction:

Usually not for large images. Store image bytes in object storage and metadata in the database. This keeps the database lighter and lets file storage scale independently.

## Question 10

Interviewer: How do you handle two users editing the same record?

Good answer direction:

Use locking or optimistic concurrency. Pessimistic locking prevents concurrent edits but reduces throughput. Optimistic concurrency uses version numbers and detects conflicts. Choice depends on conflict frequency and user experience.

## Question 11

Interviewer: What is denormalization and when is it useful?

Good answer direction:

Denormalization duplicates data to speed up reads. It is useful in read-heavy systems where joins are expensive. The cost is more complex updates and possible inconsistency, so it needs a synchronization strategy.

## Question 12

Interviewer: How do access patterns influence database design?

Good answer direction:

Frequent filters, sorts, joins, and lookups determine indexes, table structure, and whether denormalization or separate stores are needed. A good data model is shaped by how data is read and written, not only by what entities exist.

# Self-Check

Ask yourself honestly:

- Can I explain why a database is needed instead of files?

- Can I define table, row, column, schema, primary key, and foreign key?

- Can I model one-to-many and many-to-many relationships?

- Can I explain what an index does and its trade-off?

- Can I explain what a transaction is?

- Can I explain ACID in simple words?

- Can I describe key-value, document, column-family, and graph stores?

- Can I explain when to use object storage instead of database rows?

- Can I choose between SQL and NoSQL based on access patterns?

- Can I identify problems in a weak data model?

- Can I design a simple schema for TaskTracker, blog, chat, or Pastebin?

- Can I explain why concurrency matters?

- Can I explain normalization and denormalization trade-offs?

If you can answer most of these, you have a strong foundation.

If not, review:

- relationships,

- indexes,

- transactions,

- NoSQL categories,

- and the data modeling process.

# DSA/Backend/Coding Connection

Database concepts connect strongly to data structures and algorithms.

| Programming Concept | Database/System Design Connection |
| --- | --- |
| Hash map | Key-value store, fast lookup by key |
| Array/list | Ordered rows, pagination |
| Tree/B-tree | Database indexes |
| Graph | Graph databases, social networks, dependencies |
| Queue | Background jobs, event pipelines |
| Set | Unique constraints, tags, memberships |
| Struct/class | Table row/entity |
| Foreign key | Pointer/reference to another object |
| Transaction | Atomic multi-step state change |
| Lock | Mutex/concurrency control |
| Serialization | Storing objects as JSON/documents |
| Big-O complexity | Query cost, index effectiveness, scan vs lookup |

For example:

- A hash map gives fast lookup by key.

A key-value store does the same at system scale.

- A tree index speeds search.

A database index does the same for rows.

- A graph traverses relationships.

A graph database is optimized for that.

- A lock protects shared state.

Database transactions and concurrency control protect shared data.

System design often feels new, but many ideas are data structures and algorithms applied across machines, networks, and persistent storage.`,
    },
    {
      slug: "chapter-6-database-scaling",
      title: "Chapter 6 — Database Scaling",
      summary: "In many real systems, the application server is not the first thing that breaks.",
      difficulty: "beginner",
      estimatedMinutes: 65,
      order: 5,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should understand:", "what a database bottleneck is,", "how to identify whether the database is the problem,", "why scaling a database is harder than scaling an application server,", "what vertical scaling means,", "what horizontal scaling means,", "how indexes reduce database load,", "how query optimization helps before adding infrastructure,", "what connection pooling is,", "what database replication is,", "what primary and replica databases are,", "how read replicas reduce read load,"],
      prerequisites: [],
      whereItFits: "In many real systems, the application server is not the first thing that breaks.",
      keyTakeaways: ["This chapter taught you how databases become bottlenecks and how to scale them responsibly.", "The main idea is:", "Database scaling begins with measurement and optimization, not with sharding.", "You learned:", "a bottleneck is the limiting component,", "databases often bottleneck because they hold shared state,", "vertical scaling makes one machine bigger,", "horizontal scaling distributes work across machines,", "indexes and query optimization can dramatically reduce database load,", "connection pooling protects the database and improves latency,"],
      selfAssessment: ["Avoid cross-shard transactions", "Use saga pattern", "Use distributed transaction protocols", "Better shard key", "Sub-sharding", "Caching", "Replication", "Rate limiting", "Precomputation", "Isolate hot entities"],
      content: `# Chapter 6 — Database Scaling

In Chapter 5, you learned how backend systems store data using databases and how to model entities, relationships, indexes, transactions, and different storage types.

That gave you the foundation:

\`\`\`text
API operations
   ↓
Business logic
   ↓
Data model
   ↓
Database

\`\`\`

But a data model that works for 100 users may not work for 1,000,000 users.

A database that answers queries quickly when the table has 10,000 rows may become painfully slow when the table has 10 billion rows.

A single database server that handles 10 requests per second may fail when the system receives 10,000 requests per second.

This chapter teaches you how databases become bottlenecks and how backend systems scale them.

Database scaling is one of the hardest parts of system design because databases are stateful.

A web server can often be duplicated easily.

A database cannot simply be duplicated without thinking about:

- which copy accepts writes,

- how copies stay synchronized,

- what happens when copies disagree,

- how to split data,

- how to route requests,

- how to preserve consistency,

- how to recover from failure.

This chapter builds those ideas from first principles.

## Why This Matters

In many real systems, the application server is not the first thing that breaks.

The database often is.

Why?

Because application servers can often be made stateless.

If one application server dies, another can take its place.

If traffic doubles, you can add more application servers.

But a database stores the shared truth.

Many application servers often depend on the same database.

If the database becomes slow:

- API responses become slow,

- timeouts increase,

- user requests fail,

- background jobs pile up,

- caches may miss and overload the database further,

- the whole system can degrade.

A common beginner mistake is:

“The system is slow. Add more servers.”

But if the bottleneck is the database, adding more application servers may make things worse.

More application servers can create more database connections and more queries.

The database may collapse under even higher load.

So before scaling, you must understand:

Where is the bottleneck?

Is it reads?

Is it writes?

Is it a missing index?

Is it a bad query?

Is it connection exhaustion?

Is it lock contention?

Is it disk I/O?

Is it CPU?

Is it network?

Is it data size?

Is it one hot piece of data?

Database scaling is not one technique.

It is a sequence of decisions.

## Prerequisites

Before this chapter, you should understand:

- what a database is,

- what tables, rows, columns, primary keys, and foreign keys are,

- what indexes are,

- what transactions are,

- what read and write operations are,

- basic API request flow,

- basic capacity estimation,

- the difference between latency and throughput.

If you read Chapter 5, you are ready.

# Start With a Real-World Problem

Imagine TaskTracker again.

At first, it has:

- 1 application server

- 1 database server

Architecture:

- [Browser]

- |

- v

- [Task Server]

- |

- v

- [Database]

For 1,000 users, this works fine.

Then the product grows.

Now there are:

\`100,000 daily active users\`

Each user makes around 20 requests per day.

From Chapter 3:

- 100,000 × 20 = 2,000,000 requests/day

- Average RPS ≈ 23

- Peak RPS ≈ 115

That does not sound enormous.

But each API request may cause multiple database queries.

For example:

\`GET /tasks\`

may cause:

- 1 query for user

- 1 query for tasks

- 1 query for project names

- 1 query for unread comment counts

So one API request may become four database queries.

At peak:

\`115 API requests/sec × 4 queries/request ≈ 460 database queries/sec\`

Now the database is doing much more work than the API server.

Users begin to complain:

- “The task list takes 5 seconds to load.”

- “Saving a task sometimes fails.”

- “The app spins forever in the morning.”

You check the database and discover:

- the tasks table has 50 million rows,

- there is no index for the common query,

- many queries scan large ranges,

- the database CPU is at 95%,

- disk I/O is saturated,

- connection pool is exhausted,

- some queries hold locks for seconds.

The database is the bottleneck.

Now what?

You have several possible responses:

- Fix the queries.

- Add indexes.

- Reduce unnecessary database calls.

- Add caching.

- Use a bigger database server.

- Add read replicas.

- Split data across multiple databases.

- Redesign the data model.

- Move some work off the critical request path.

The correct answer depends on the problem.

This chapter teaches you how to choose.

# Intuition

Scaling a database means making it handle more data, more reads, more writes, or more concurrency without violating its reliability and correctness requirements.

A useful analogy is a library.

A small library has:

- one librarian,

- one shelf,

- one catalog.

If only a few visitors come, this works.

But when thousands of visitors arrive, problems appear:

- too many people asking the librarian at once,

- the catalog becomes slow,

- popular books are requested constantly,

- some shelves become crowded,

- returning books may block borrowing,

- the librarian may become overwhelmed.

Possible solutions:

- Make the librarian faster.

This is like vertical scaling.

- Organize books better.

This is like indexing.

- Add more librarians.

This is like adding application servers, but only helps if the catalog and shelves can handle it.

- Add copies of popular books.

This is like caching or read replicas.

- Split the library into branches.

This is like sharding.

- Let visitors self-serve using better catalogs.

This is like query optimization and precomputed views.

The important lesson:

Database scaling is not just “add more computers.”

It is often about reducing unnecessary work, organizing data better, separating reads and writes, and distributing load carefully.

# Core Concept

We will build database scaling in a practical order.

\`\`\`text
Measure
   ↓
Optimize queries and indexes
   ↓
Reduce unnecessary database work
   ↓
Scale vertically
   ↓
Scale reads with replicas
   ↓
Scale writes/storage with partitioning/sharding
   ↓
Handle hotspots and failure
   ↓
Evaluate trade-offs

\`\`\`

Do not skip to sharding before understanding indexing and replication.

Sharding is powerful, but it adds major complexity.

## 1. What Is a Bottleneck?

### Simple explanation

A bottleneck is the part of the system that limits overall performance.

### Formal term

Bottleneck.

### Example

If the application server can handle 10,000 requests per second but the database can only handle 1,000 queries per second, the database is the bottleneck.

### Practical use

Before scaling, you must identify the bottleneck.

Common database bottleneck symptoms:

| Symptom | Possible Cause |
| --- | --- |
| Queries take longer as data grows | Missing index, full table scan |
| CPU high | Expensive queries, sorting, joins, compression |
| Disk I/O high | Large scans, poor indexes, insufficient cache |
| Many waiting connections | Connection pool exhaustion |
| Lock timeouts | Contended rows, long transactions |
| Replication lag grows | Write volume exceeds replica capacity |
| One shard overloaded | Hot key or bad shard key |
| Memory high | Large result sets, cached pages, bad queries |

A good system designer does not say:

“The database is slow.”

They ask:

“Slow because of what resource?”

Is it:

- CPU?

- memory?

- disk I/O?

- network?

- locks?

- connections?

- query plan?

- data distribution?

This distinction matters because different causes require different solutions.

## 2. Why Databases Become Bottlenecks

Databases become bottlenecks for several reasons.

### Reason 1: Many requests share the same data store

Application servers can be duplicated.

But if all servers use one database, the database receives the combined load of all servers.

Example:

\`10 app servers × 100 queries/sec each = 1,000 queries/sec to one database\`

### Reason 2: Reads can be expensive

A read may seem harmless, but reads can be very expensive if they:

- scan large tables,

- join many tables,

- sort huge result sets,

- return too many columns,

- lack indexes,

- request unbounded pages,

- repeat the same query many times.

### Reason 3: Writes can create contention

Writes may need to:

- lock rows,

- update indexes,

- maintain constraints,

- write logs,

- coordinate transactions,

- replicate to other nodes.

If many writes target the same row or table, they can wait on each other.

### Reason 4: Data grows over time

A table with 1,000 rows is easy to scan.

A table with 10 billion rows is not.

As data grows:

- indexes grow,

- queries may touch more pages,

- backups become heavier,

- maintenance becomes slower,

- cache efficiency may drop.

### Reason 5: Access patterns are uneven

Some data is accessed far more than other data.

Examples:

- a celebrity profile,

- a viral post,

- a popular product,

- one large tenant,

- one hot database row,

- one frequently updated counter.

Average load may look fine, but one small part of the database may be overloaded.

### Reason 6: Connection overhead

Database connections are not free.

Each connection may consume:

- memory,

- CPU,

- file descriptors,

- session state,

- transaction resources.

If hundreds of application servers each open hundreds of connections, the database may run out of capacity before it even processes queries.

## 3. Measure Before Scaling

A beginner must learn this rule:

Do not scale blindly. Measure first.

Useful database measurements:

| Metric | What It Tells You |
| --- | --- |
| Query latency | How long queries take |
| p95/p99 query latency | Tail behavior |
| Queries per second | Database throughput |
| Rows scanned | Whether queries are too broad |
| Index usage | Whether indexes are effective |
| CPU utilization | Compute saturation |
| Memory utilization | Cache and connection pressure |
| Disk IOPS | Storage read/write pressure |
| Connection count | Pool saturation |
| Lock wait time | Contention |
| Replication lag | Replica freshness |
| Cache hit rate | How much load is avoided |

Example:

If a query scans 10 million rows to return 20 results, the problem is probably indexing or query design.

If the database CPU is low but disk I/O is high, the problem may be too many page reads.

If connections are exhausted, adding more application servers without fixing connection behavior will hurt.

Measurement turns guessing into engineering.

# Vertical Scaling

## 4. What Is Vertical Scaling?

### Simple explanation

Vertical scaling means making one machine bigger.

### Formal term

Vertical scaling, scale up.

### Example

Change the database server from:

\`2 CPU cores, 8 GB RAM, 100 GB disk\`

to:

\`32 CPU cores, 128 GB RAM, 2 TB SSD\`

### Architecture

Before:

- [App Server]

- |

- v

- [Small Database Server]

After:

- [App Server]

- |

- v

- [Bigger Database Server]

### Advantages

- simple,

- no application changes,

- no data redistribution,

- often fastest initial fix,

- preserves strong consistency easily.

### Disadvantages

- limited by hardware maximum,

- single point of failure remains,

- can become expensive,

- does not solve all bottleneck types,

- may require downtime depending on environment.

### When useful

Vertical scaling is useful when:

- the system is still relatively small,

- the database is underpowered,

- you need a quick emergency fix,

- the workload benefits from more CPU/RAM/SSD,

- you are not ready for distributed complexity.

### When not enough

Vertical scaling may not be enough when:

- data exceeds one machine’s practical storage,

- write throughput exceeds one machine’s capacity,

- availability requirements demand redundancy,

- one hot key overloads one partition,

- network or I/O limits are reached.

Important beginner lesson:

Vertical scaling buys time, but it does not remove architectural limits.

# Query Optimization and Indexing

Before adding replicas or shards, often the best scaling move is to make the database do less unnecessary work.

## 5. Indexes as a Scaling Tool

From Chapter 5, you learned that indexes speed up reads.

In scaling, indexes are often the first major lever.

### Example

Suppose the common query is:

\`\`\`text
SELECT task_id, title, status, due_at
FROM tasks
WHERE owner_user_id = 42
  AND status = 'open'
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;

\`\`\`

Without a useful index, the database may scan many rows.

With an index like:

\`(owner_user_id, status, deleted_at, created_at)\`

the database can jump directly to relevant rows.

### Why this scales the database

A good index can reduce:

- rows scanned,

- CPU usage,

- disk I/O,

- query latency,

- lock duration,

- connection occupancy time.

If each query becomes 100x faster, the same database can often handle much more traffic.

### Index trade-off

Indexes cost writes.

Every insert, update, or delete may need to update indexes.

So do not add indexes blindly.

Add indexes for frequent, important access patterns.

## 6. Avoiding Expensive Query Patterns

Many database bottlenecks are caused by poor query patterns.

Common expensive patterns:

### Pattern 1: SELECT *

Bad:

\`\`\`text
SELECT *
FROM tasks
WHERE owner_user_id = 42;

\`\`\`

Why bad?

- returns unnecessary columns,

- increases network traffic,

- increases memory usage,

- may prevent covering indexes,

- makes schema changes riskier.

Better:

\`\`\`text
SELECT task_id, title, status, due_at, updated_at
FROM tasks
WHERE owner_user_id = 42;

\`\`\`

### Pattern 2: Unbounded lists

Bad:

\`\`\`text
SELECT *
FROM tasks
WHERE owner_user_id = 42;

\`\`\`

If the user has 100,000 tasks, this returns too much data.

Better:

\`\`\`text
SELECT ...
FROM tasks
WHERE owner_user_id = 42
ORDER BY created_at DESC
LIMIT 20;

\`\`\`

API pagination and database LIMIT must work together.

### Pattern 3: N+1 queries

Example:

Application fetches 20 tasks:

\`SELECT * FROM tasks WHERE owner_user_id = 42 LIMIT 20;\`

Then for each task, it fetches the owner separately:

- SELECT * FROM users WHERE user_id = 1;

- SELECT * FROM users WHERE user_id = 2;

- ...

This creates many small queries.

Better:

- join when appropriate,

- batch fetch with IN,

- cache reference data,

- denormalize if read patterns justify it.

Example batch:

\`\`\`text
SELECT *
FROM users
WHERE user_id IN (1,2,3,4,5);

\`\`\`

### Pattern 4: Sorting huge result sets

Bad:

\`\`\`text
SELECT *
FROM tasks
WHERE owner_user_id = 42
ORDER BY title;

\`\`\`

If there are millions of matching rows and no supporting index, sorting can be expensive.

Better:

- paginate,

- use indexed sort order,

- restrict sort fields,

- precompute common views if necessary.

### Pattern 5: Long transactions

Bad:

- BEGIN

- read user

- call external API

- update task

- send email

- update analytics

- COMMIT

Why bad?

- locks held longer,

- connection held longer,

- failure recovery more complex,

- concurrency reduced.

Better:

- keep transactions short,

- move slow side effects outside the transaction,

- use queues for non-critical work.

## 7. Connection Pooling

### Simple explanation

A connection pool is a reusable set of database connections maintained by the application or a proxy.

### Formal term

Connection pooling.

### Why needed

Opening a database connection can be expensive.

It may involve:

- TCP connection,

- authentication,

- memory allocation,

- session setup,

- transaction state.

If every request opens a new connection, the database may waste time managing connections.

### Example

Without pooling:

\`\`\`text
Request 1 → open DB connection → query → close
Request 2 → open DB connection → query → close
Request 3 → open DB connection → query → close

\`\`\`

With pooling:

- Request 1 → borrow connection from pool → query → return connection

- Request 2 → borrow connection from pool → query → return connection

### Architecture

- [App Server]

- |

- | connection pool

- v

- [Database]

Or with a pooler:

- [App Server 1] --\\

- [App Server 2] ---+--> [Connection Pooler] --> [Database]

- [App Server 3] --/

### Benefits

- reduces connection setup overhead,

- limits concurrent database connections,

- improves latency,

- protects database from connection storms.

### Risks

- pool too small: requests wait,

- pool too large: database overloaded,

- leaked connections: pool exhaustion,

- long transactions: connections held too long.

### Beginner rule

Application servers should have bounded database connection pools.

More application servers do not automatically mean more database capacity.

# Replication

Now we move from making one database faster to copying data across multiple databases.

## 8. What Is Replication?

### Simple explanation

Replication means copying data from one database to another so multiple database servers have the same or nearly the same data.

### Formal term

Database replication.

### Why replication exists

Replication helps with:

- read scaling,

- availability,

- disaster recovery,

- backup offloading,

- geographic distribution.

### Basic roles

- Primary database: accepts writes

- Replica database: receives copied data from primary

Sometimes primary is called:

- leader,

- master,

- writer.

Sometimes replica is called:

- follower,

- standby,

- reader.

For neutral language, use:

\`primary / replica\`

## 9. Primary and Replica Architecture

### Before replication

- [App Server]

- |

- v

- [One Database]

All reads and writes hit one database.

### After replication

- [App Server]

- |

- +--> writes --> [Primary DB]

- |                   |

- |                   | replication

- |                   v

- +--> reads  --> [Replica DB]

More explicit:

- Clients

- |

- v

- App Servers

- |

- +--> Write requests --> Primary Database

- |                           |

- |                           | replicate changes

- |                           v

- +--> Read requests  --> Replica Database 1

- Replica Database 2

## 10. How Replication Works Conceptually

The primary database records changes.

These changes are sent to replicas.

Replicas apply the changes.

Conceptual flow:

\`\`\`text
Client writes task
   ↓
Primary inserts row
   ↓
Primary writes change log
   ↓
Replica reads change log
   ↓
Replica applies insert
   ↓
Replica now contains task

\`\`\`

The exact mechanism depends on the database.

But the important idea is:

Writes happen on the primary. Changes are copied to replicas.

## 11. Synchronous vs Asynchronous Replication

Replication can be synchronous or asynchronous.

### Asynchronous replication

The primary does not wait for replicas to confirm before responding to the client.

Flow:

\`\`\`text
Client → Primary
Primary commits locally
Primary responds to client
Replicas apply changes later

\`\`\`

Advantages:

- lower write latency,

- better throughput,

- simpler failover behavior in some systems.

Disadvantages:

- replicas may lag,

- if primary crashes immediately after commit, a replica may not have the latest data,

- possible data loss during failure.

Use when:

- read scaling is important,

- some replication lag is acceptable,

- write latency matters.

### Synchronous replication

The primary waits for at least one replica to confirm receipt or commit before responding.

Flow:

\`\`\`text
Client → Primary
Primary writes
Replica confirms
Primary responds

\`\`\`

Advantages:

- stronger durability,

- less chance of losing committed writes,

- better consistency guarantees.

Disadvantages:

- higher write latency,

- replica failure can block writes unless configured carefully,

- more complex operations.

Use when:

- data loss is unacceptable,

- financial or critical records require strong durability.

### Semi-synchronous, conceptually

Some systems wait for confirmation from at least one replica but may relax behavior under failure.

You do not need deep details now.

The important trade-off:

Stronger durability often costs write latency and availability.

## 12. Read Replicas

### Simple explanation

A read replica is a copy of the database used to serve read queries.

### Purpose

Read replicas reduce load on the primary by moving reads elsewhere.

### Example

Before:

- Primary handles:

- - 100 writes/sec

- - 1,000 reads/sec

After:

- Primary handles:

- - 100 writes/sec

- - some critical reads

- Replica 1 handles:

- - 400 reads/sec

- Replica 2 handles:

- - 400 reads/sec

### Architecture

- App Servers

- |

- | writes

- v

- Primary DB

- |

- | replication

- +--> Replica DB 1

- +--> Replica DB 2

- +--> Replica DB 3

### Benefits

- scales read-heavy workloads,

- improves availability,

- allows backups from replicas,

- can place replicas closer to users,

- reduces primary load.

### Limitations

- does not scale writes,

- replicas may be stale,

- application must decide which reads go to replicas,

- failover may promote a replica,

- consistency becomes more complex.

## 13. Replication Lag

### Simple explanation

Replication lag is the delay between a write on the primary and that write appearing on a replica.

### Example

- 10:00:00.000 User updates profile on primary

- 10:00:00.050 Primary responds success

- 10:00:00.200 Replica receives update

Between 0.050 and 0.200, a read from the replica may show old data.

### Why lag happens

Causes:

- network delay,

- replica busy,

- large write bursts,

- expensive replica apply operations,

- replica hardware slower than primary,

- replication backlog.

### User-visible problem

User updates their display name:

- Primary: name = "Alice"

- Replica: name = "Old Alice"

User immediately reloads profile.

The app reads from replica and sees old name.

User thinks:

“Did my save fail?”

This is a classic scaling bug.

## 14. Read-Your-Own-Writes Consistency

### Simple explanation

Read-your-own-writes consistency means:

After a user makes a change, that user should see their own change when they read again.

### Problem with replicas

If writes go to primary but reads go to lagging replica, the user may not see their own write.

### Mitigations

#### Option 1: Read from primary after recent writes

For a short period after a user writes, route their reads to primary.

Example:

- User updates task

- Next 2 seconds: user's task reads go to primary

Advantages:

- simple.

Disadvantages:

- increases primary load,

- requires tracking recent writes.

#### Option 2: Use version tokens

The write response includes a version:

\`\`\`text
{
  "task_id": 123,
  "version": 17
}

\`\`\`

The client sends that version on subsequent reads:

\`GET /tasks/123?min_version=17\`

The system ensures the replica has at least version 17.

If not, it reads from primary or waits.

Advantages:

- precise.

Disadvantages:

- more complex.

#### Option 3: Session consistency

Within a user session, route reads to a replica that is known to be caught up enough.

Advantages:

- good user experience.

Disadvantages:

- requires session-aware routing or replica tracking.

#### Option 4: Accept eventual consistency

For some data, temporary staleness is acceptable.

Examples:

- like counts,

- view counts,

- non-critical profile fields,

- analytics.

Not acceptable for:

- payment confirmation,

- password change,

- critical order status,

- legal records.

Lesson:

Replication helps scale reads, but it forces you to think about freshness.

# Partitioning and Sharding

Replication copies the same data to multiple databases.

Partitioning and sharding split data into pieces.

This is necessary when one database cannot store or handle all writes.

## 15. What Is Partitioning?

### Simple explanation

Partitioning means dividing a large dataset into smaller pieces.

### Formal term

Partitioning.

### Example

Instead of one huge \`tasks\` table, split tasks by:

- user,

- date,

- region,

- tenant,

- status,

- hash range.

### Logical partitioning

A single database server may still store partitions, but the table is internally divided.

Example:

- tasks_2026_01

- tasks_2026_02

- tasks_2026_03

Benefits:

- easier maintenance,

- faster queries if partition pruning works,

- easier archival,

- smaller indexes per partition.

But logical partitioning on one server does not solve single-machine capacity limits.

## 16. What Is Sharding?

### Simple explanation

Sharding means distributing partitions of data across multiple database servers.

### Formal term

Shard.

### Example

- Shard 1: users 0–33

- Shard 2: users 34–66

- Shard 3: users 67–99

Each shard is a separate database server or cluster.

### Architecture

- App Server

- |

- v

- Shard Router

- |

- +--> Shard 1 Database

- +--> Shard 2 Database

- +--> Shard 3 Database

### Why shard?

Sharding can scale:

- storage capacity,

- write throughput,

- read throughput,

- connection capacity,

- operational isolation.

### Why sharding is hard

Sharding introduces complexity:

- where does each row live?

- how do queries find the right shard?

- how do joins across shards work?

- how do transactions spanning shards work?

- how do you rebalance data?

- what if one shard becomes hot?

- how do you back up and restore?

- how do you migrate schema?

Sharding is powerful, but it should not be your first reflex.

## 17. Shard Keys

### Simple explanation

A shard key determines which shard a piece of data belongs to.

### Formal term

Shard key.

### Example

For tasks, possible shard keys:

- task_id

- owner_user_id

- project_id

- tenant_id

- region

### Good shard key properties

A good shard key should:

- distribute load evenly,

- match common access patterns,

- avoid hotspots,

- allow most queries to target one shard,

- be stable over time,

- support growth.

## 18. Hash Sharding

### Simple explanation

Hash the shard key and map the result to a shard.

Example:

\`shard = hash(user_id) % number_of_shards\`

If there are 3 shards:

- hash(alice) % 3 = 0 → Shard 0

- hash(bob) % 3 = 2 → Shard 2

### Advantages

- even distribution,

- simple to implement,

- avoids range skew.

### Disadvantages

- range queries become difficult,

- resharding changes mapping and may require moving lots of data,

- queries without shard key may need to hit all shards.

### Good for

- user-based partitioning,

- tenant-based partitioning,

- key-value access patterns.

## 19. Range Sharding

### Simple explanation

Assign shards based on ranges.

Example:

- Shard 1: user_id 0–999,999

- Shard 2: user_id 1,000,000–1,999,999

- Shard 3: user_id 2,000,000–2,999,999

Or time ranges:

- Shard 2026-08

- Shard 2026-09

- Shard 2026-10

### Advantages

- range queries easier,

- time-based archival easier,

- predictable placement.

### Disadvantages

- hot ranges possible,

- monotonic keys can concentrate writes on one shard,

- rebalancing may be complex.

### Example problem

If user IDs are auto-incrementing and new users always get higher IDs, the last shard may receive all new writes.

That creates a hot shard.

## 20. Directory-Based Sharding

### Simple explanation

A lookup service or directory says where each entity lives.

Example:

- user_id 42 → shard 3

- user_id 99 → shard 1

### Advantages

- flexible placement,

- easier targeted resharding,

- can optimize for hotspots.

### Disadvantages

- directory becomes critical dependency,

- extra lookup,

- more operational complexity.

## 21. Choosing a Shard Key: Examples

### TaskTracker

Possible shard key:

\`owner_user_id\`

Why?

Most queries are:

- Give me my tasks.

- Update my task.

- List my projects.

If tasks are stored by owner, common queries hit one shard.

Risk:

A user with millions of tasks may create a hot shard.

Mitigation:

- sub-shard large users,

- separate archives,

- cache hot user data,

- use tenant/user grouping carefully.

### Chat system

Possible shard key:

\`conversation_id\`

Why?

Messages are usually read by conversation.

If shard by sender, a conversation’s messages may scatter across shards.

If shard by conversation, all messages for that conversation live together.

Risk:

A huge group chat may become hot.

Mitigation:

- sub-shard by time,

- cache recent messages,

- split archive,

- rate limit giant conversations.

### IoT sensor data

Possible shard key:

\`device_id + time bucket\`

Why?

Writes arrive continuously from many devices.

Time bucketing helps archival and range queries.

Risk:

One device may become very noisy.

Mitigation:

- hash device_id,

- separate hot devices,

- batch writes,

- use time-series store.

### Global e-commerce orders

Possible shard key:

\`tenant_id or region or user_id\`

Why?

Depends on access patterns.

If merchants mostly query their own orders, tenant_id may be good.

If users query their own orders, user_id may be good.

If legal/data residency matters, region may be required.

## 22. Cross-Shard Queries

Sharding makes single-shard queries efficient.

But global queries become harder.

Example:

\`\`\`text
SELECT COUNT(*)
FROM tasks
WHERE status = 'overdue';

\`\`\`

If tasks are sharded by user, this query may need to run on every shard and combine results.

This can be slow and expensive.

### Mitigations

- maintain aggregate tables,

- use search/analytics index,

- precompute counts,

- restrict global queries,

- route to read-only replicas or data warehouse,

- design API to avoid unbounded global scans.

Important lesson:

Sharding optimizes for known access patterns. It makes unknown or global access patterns harder.

## 23. Cross-Shard Transactions

Transactions spanning multiple shards are difficult.

Example:

\`Transfer money from user A to user B\`

If user A and user B live on different shards, the transaction touches two databases.

Coordinating atomic commit across databases is complex.

### Approaches

#### 1. Avoid cross-shard transactions

Design shard key so related data lives together.

Example:

- shard by account_group,

- shard by tenant,

- shard by conversation.

#### 2. Use saga pattern

Break transaction into steps with compensating actions.

Example:

Debit A

If success, credit B

If credit fails, compensate debit A

#### 3. Use distributed transaction protocols

Two-phase commit, three-phase commit, consensus-based systems.

These are powerful but complex.

Beginner takeaway:

Prefer data models and shard keys that keep related transactions on one shard.

## 24. Hot Partitions and Hot Keys

### Simple explanation

A hot partition is a shard or partition receiving disproportionate traffic.

A hot key is a specific key receiving disproportionate traffic.

### Examples

- one celebrity user,

- one viral post,

- one popular product,

- one large tenant,

- one global counter row,

- one frequently updated configuration row.

### Why dangerous

Even if total system load is fine, one shard may be overwhelmed while others are idle.

Example:

- Shard 1: 10 requests/sec

- Shard 2: 10 requests/sec

- Shard 3: 10,000 requests/sec

Shard 3 becomes the bottleneck.

### Mitigations

#### 1. Better shard key

Choose a key that distributes load.

#### 2. Sub-sharding

Split a hot entity into smaller pieces.

Example:

Instead of one row:

\`post_likes:post_123 = 1000000\`

Use buckets:

post_likes:post_123:bucket_0

post_likes:post_123:bucket_1

...

post_likes:post_123:bucket_9

Updates randomly choose a bucket.

Reads sum buckets.

#### 3. Caching

Serve frequent reads from cache.

#### 4. Replication

Add replicas for hot read shards.

#### 5. Rate limiting

Protect the hot shard from abusive traffic.

#### 6. Precomputation

Compute aggregates asynchronously.

#### 7. Isolate hot entities

Put known large tenants or viral content in dedicated shards.

## 25. Resharding

### Simple explanation

Resharding means moving data from one shard arrangement to another.

### Why needed

- shard grows too large,

- shard becomes hot,

- number of shards changes,

- business requirements change,

- hash modulo changes when shard count changes.

### Example

Current:

\`hash(user_id) % 3\`

Moving to:

\`hash(user_id) % 6\`

Many users may map to different shards.

Data must move.

### General migration strategy

- Add new shards.

- Double-write or stream changes.

- Backfill old data to new shards.

- Verify consistency.

- Switch reads gradually.

- Stop old writes.

- Clean up.

This is operationally difficult.

Beginner lesson:

Choose shard keys and growth plans carefully because moving data later is expensive.

# Scaling Reads and Writes Separately

A crucial system design skill is asking:

Is the bottleneck reads or writes?

Different answers lead to different solutions.

## 26. Scaling Reads

Read scaling techniques:

- indexing,

- query optimization,

- caching,

- read replicas,

- CDN for static assets,

- precomputed views,

- denormalization,

- search indexes,

- pagination,

- reducing payload size.

Read-heavy systems often benefit first from replicas and caching.

## 27. Scaling Writes

Write scaling techniques:

- vertical scaling,

- better write batching,

- reducing index count,

- shorter transactions,

- asynchronous side effects,

- partitioning/sharding,

- queue buffering,

- idempotent writes,

- eventual consistency where acceptable,

- separate hot writers,

- time-based partitioning.

Write scaling is harder because writes change shared state.

You cannot simply copy writes to many primaries without coordination unless the system is designed for multi-primary conflict resolution.

## 28. Write-Heavy Systems

Examples:

- logs,

- metrics,

- IoT events,

- clickstream,

- chat messages,

- trading events.

Common patterns:

- append-only writes,

- partition by time,

- batch inserts,

- compress data,

- move old data to cheaper storage,

- use queues to absorb bursts,

- avoid unnecessary indexes,

- use stores optimized for writes.

Example architecture:

- Producers

- |

- v

- Message Queue

- |

- v

- Batch Writers

- |

- v

- Time-Partitioned Storage

## 29. Read-Heavy Systems

Examples:

- news sites,

- product catalogs,

- social feeds,

- documentation,

- video metadata.

Common patterns:

- caching,

- replicas,

- precomputation,

- CDN,

- denormalization,

- search indexes.

Example architecture:

- Clients

- |

- v

- Load Balancer

- |

- v

- App Servers

- |

- +--> Cache

- |

- +--> Read Replicas

- ^

- |

- Primary DB

# Database Caching Strategies

You will study caching deeply in the next major topic, but database-related caching belongs here too.

## 30. Query Result Caching

Store the result of an expensive query.

Example:

- Key: tasks:user_42:status_open:page_1

- Value: serialized task list

- TTL: 30 seconds

Advantages:

- avoids repeated expensive queries.

Disadvantages:

- stale data,

- many variants,

- cache invalidation complexity,

- memory usage.

Use carefully.

## 31. Object Caching

Cache individual objects.

Example:

- task:123 → task JSON

- user:42 → user profile

Often better than query result caching because objects are reusable across endpoints.

## 32. Read-Through Cache

The application asks the cache for data.

If cache misses, the cache loads from database.

Conceptual:

- App → Cache

- Cache miss → Cache reads DB → Cache stores → Cache returns

Advantages:

- simpler application code.

Disadvantages:

- cache becomes more intelligent and complex.

## 33. Cache-Aside

Application checks cache first.

If miss, application reads database and writes cache.

- App → Cache

- Miss → App reads DB → App writes Cache → App returns

This is common and easier to reason about initially.

## 34. Write Patterns and Cache Invalidation

When data changes, cache may become stale.

Common strategies:

### Delete cache after write

- Update DB

- Delete cache key

Next read repopulates cache.

Often safer than updating cache directly.

### Update cache after write

- Update DB

- Update cache

Can be faster but riskier due to race conditions.

### TTL expiry

\`Cache expires after N seconds\`

Simple but allows stale reads.

### Event-based invalidation

\`DB change → event → invalidate cache\`

More complex but scalable.

Beginner rule:

Caching reduces database read load, but invalidation is one of the hardest problems in computer science.

# Request Flows

Let us trace important flows in scaled database architectures.

## Flow 1: Write with Primary and Async Replica

Architecture:

- App Server

- |

- v

- Primary DB

- |

- v

- Replica DB

Steps:

- 1. Client sends POST /tasks

- 2. App server validates request

- 3. App server opens transaction

- 4. Primary inserts task

- 5. Primary commits

- 6. Primary responds to app server

- 7. App server returns 201 Created to client

- 8. Replica receives change asynchronously

- 9. Replica applies change

Failure cases:

- primary commit fails → client gets error,

- primary responds but replica lags → future replica reads may be stale,

- primary crashes after commit but before replication → possible data loss if async,

- network partition between primary and replica → replication pauses.

## Flow 2: Read from Replica

- 1. Client sends GET /tasks

- 2. App server authenticates user

- 3. App server decides to read from replica

- 4. Replica executes query

- 5. Replica returns rows

- 6. App server returns JSON

Failure cases:

- replica down → route to another replica or primary,

- replica stale → user may see old data,

- replica overloaded → latency increases,

- replication lag high → freshness problem.

## Flow 3: Read-Your-Own-Write with Replica

- 1. User updates task

- 2. App writes to primary

- 3. Primary returns version 17

- 4. App stores version 17 in session or returns to client

- 5. User immediately loads task list

- 6. App checks if replica has version ≥ 17

- 7. If yes, read replica

- 8. If no, read primary or wait briefly

This avoids the “my save disappeared” problem.

## Flow 4: Sharded Write

- 1. Client creates task for user 42

- 2. App server computes shard = hash(42) % N

- 3. App server routes write to Shard 2

- 4. Shard 2 inserts task

- 5. Shard 2 responds

- 6. App server returns success

Failure cases:

- shard router down,

- shard unavailable,

- shard hot,

- mapping stale during resharding,

- cross-shard constraint violation.

## Flow 5: Sharded Read

- 1. Client requests tasks for user 42

- 2. App server computes shard from user_id

- 3. App server queries Shard 2

- 4. Shard 2 returns tasks

- 5. App server responds

If query lacks shard key:

\`GET /tasks?status=open\`

and shards are by user, the app may need to query all shards and merge results.

That is expensive.

# Simple Example: From One DB to Replicas

Start with:

- [App]

- |

- v

- [DB]

Problem:

\`Reads are overwhelming DB.\`

Add one replica:

- [App]

- |

- +--> writes --> [Primary DB]

- |                   |

- |                   v

- +--> reads ---> [Replica DB]

Now reads can use replica.

But if writes are the bottleneck, replicas do not help much.

# Simple Example: From One DB to Shards

Start with:

- [App]

- |

- v

- [DB]

Problem:

\`One DB cannot store all data or handle all writes.\`

Shard by user:

- [App]

- |

- v

- [Shard Router]

- |

- +--> [DB Shard 1: users 0-33]

- +--> [DB Shard 2: users 34-66]

- +--> [DB Shard 3: users 67-99]

Now writes and storage are distributed.

But global queries become harder.

# Practical Example: TaskTracker Scaling Path

Let us walk through realistic growth.

## Stage 1: Small System

- 1,000 users

- 1 app server

- 1 database

Likely enough.

Focus on:

- correct schema,

- basic indexes,

- backups,

- monitoring.

## Stage 2: Growing System

- 100,000 users

- multiple app servers

- 1 database

Possible issues:

- database connections,

- slow queries,

- repeated reads.

Solutions:

- add indexes,

- use connection pooling,

- add cache for hot reads,

- optimize N+1 queries,

- monitor database.

Architecture:

- Clients

- |

- v

- Load Balancer

- |

- +--> App Server 1

- +--> App Server 2

- |

- v

- Cache

- |

- v

- Database

## Stage 3: Read-Heavy System

- 1,000,000 users

- mostly reads

- some writes

Solutions:

- read replicas,

- caching,

- precomputed feeds/views,

- CDN for static assets.

Architecture:

- Clients

- |

- v

- Load Balancer

- |

- +--> App Servers

- |

- +--> Cache

- |

- +--> Read Replicas

- ^

- |

- Primary DB

## Stage 4: Write-Heavy or Storage-Heavy System

- 10,000,000 users

- large task history

- high write volume

Solutions:

- sharding,

- time-based partitioning,

- archival storage,

- queues for non-critical writes,

- separate analytics store.

Architecture:

- Clients

- |

- v

- API Layer

- |

- v

- Shard Router

- |

- +--> Shard 1 (Primary + Replicas)

- +--> Shard 2 (Primary + Replicas)

- +--> Shard 3 (Primary + Replicas)

- |

- +--> Search/Index Store

- +--> Analytics Warehouse

- +--> Object Storage for attachments

# Failure Scenario

Database scaling introduces new failure modes.

Let us examine them carefully.

## Failure 1: Primary Database Crashes

Architecture:

\`\`\`text
App → Primary DB
        |
        v
     Replica DB

\`\`\`

Effect:

- writes fail,

- reads from primary fail,

- reads from replica may continue if application routes there.

Mitigation:

- automatic failover,

- promote replica to primary,

- update routing,

- health checks,

- monitoring/alerting.

Risk:

If replication was asynchronous, the promoted replica may be missing recent writes.

This is a durability/availability trade-off.

## Failure 2: Replica Crashes

Effect:

- reads routed to that replica fail or become slow,

- primary may continue accepting writes.

Mitigation:

- route reads to other replicas,

- remove crashed replica from pool,

- provision replacement replica,

- monitor replication lag.

Replica failure is usually less severe than primary failure, but it reduces read capacity and redundancy.

## Failure 3: Replication Lag Grows

Effect:

- users may see stale data,

- analytics may be delayed,

- read-your-own-writes may fail,

- failover may lose more data if primary crashes.

Causes:

- write burst,

- slow replica hardware,

- network congestion,

- expensive replica operations,

- large transactions.

Mitigation:

- throttle writes,

- add replicas,

- improve replica hardware,

- batch replication,

- route critical reads to primary,

- alert on lag threshold.

## Failure 4: Network Partition Between Primary and Replica

Example:

- Primary can talk to App

- Replica can talk to App

- Primary cannot talk to Replica

Effect:

- replication stops,

- replica becomes stale,

- system must decide whether to continue writes.

Possible policies:

- continue writing to primary and accept lag,

- block writes to preserve consistency,

- degrade non-critical reads.

This is a distributed systems trade-off.

You will study it more deeply later.

## Failure 5: Connection Pool Exhaustion

Symptoms:

- requests wait for DB connection,

- API latency spikes,

- timeouts increase,

- database may show many idle or active connections.

Causes:

- too many app servers,

- pool size too large,

- slow queries holding connections,

- connection leaks,

- long transactions.

Mitigation:

- reduce query time,

- tune pool size,

- use pooler/proxy,

- enforce statement timeouts,

- fix leaks,

- limit concurrent work per request.

## Failure 6: Hot Shard Overload

Symptoms:

- one shard CPU/I/O high,

- other shards idle,

- requests for one user/product/post slow.

Causes:

- bad shard key,

- viral content,

- large tenant,

- skewed access pattern.

Mitigation:

- sub-shard,

- cache hot key,

- isolate hot tenant,

- rate limit,

- replicate reads,

- redesign shard key.

## Failure 7: Bad Migration Locks Table

Scenario:

You add a column or index to a huge table.

The database locks writes or consumes heavy I/O.

Effect:

- production slows or stops.

Mitigation:

- online schema migration tools,

- phased migrations,

- backfills in batches,

- maintain backward compatibility,

- test on staging,

- schedule low-traffic windows if needed.

## Failure 8: Disk Full

Effect:

- writes fail,

- database may become read-only,

- replication may stop,

- recovery can be urgent.

Mitigation:

- storage monitoring,

- alerts before full,

- retention policies,

- archival,

- compression,

- capacity planning,

- automatic expansion where safe.

## Failure 9: Cross-Shard Query Storm

A dashboard runs:

- SELECT COUNT(*)

- FROM tasks

- WHERE status = 'open'

across 100 shards.

Effect:

- all shards overloaded,

- latency spikes,

- operational dashboard harms production traffic.

Mitigation:

- precompute aggregates,

- use analytics warehouse,

- rate limit admin queries,

- route global queries to replicas,

- cache dashboard results.

# Trade-Offs

Database scaling is a sequence of trade-offs.

## Trade-Off 1: Optimize First vs Add Infrastructure

### Optimize first

Advantages:

- cheaper,

- faster to implement,

- reduces unnecessary load,

- often solves problem.

Disadvantages:

- may not be enough at extreme scale,

- requires engineering time and measurement.

### Add infrastructure

Advantages:

- can handle larger load,

- improves availability,

- enables growth.

Disadvantages:

- more cost,

- more complexity,

- more failure modes.

Rule:

Fix inefficient queries before buying expensive hardware.

But do not delay necessary infrastructure when measurements show real limits.

## Trade-Off 2: Vertical Scaling vs Horizontal Scaling

### Vertical

Advantages:

- simple,

- no data redistribution,

- preserves single-node consistency.

Disadvantages:

- limited,

- single point of failure,

- expensive at high end.

### Horizontal

Advantages:

- more scalable,

- better fault tolerance potential,

- can distribute load.

Disadvantages:

- complex,

- consistency challenges,

- operational overhead.

When to use:

- small/medium systems: vertical often okay.

- large systems: horizontal often necessary.

## Trade-Off 3: Replication vs Sharding

### Replication

Copies same data.

Advantages:

- easier read scaling,

- improves availability,

- simpler than sharding.

Disadvantages:

- does not solve write scaling,

- does not solve single-shard storage limit,

- lag/consistency issues.

### Sharding

Splits data.

Advantages:

- scales writes and storage,

- isolates load.

Disadvantages:

- complex routing,

- cross-shard queries hard,

- rebalancing hard,

- hotspots possible.

Rule:

Use replication for read scaling and availability. Use sharding when one database cannot handle writes/storage or when isolation is required.

## Trade-Off 4: Synchronous vs Asynchronous Replication

### Synchronous

Advantages:

- stronger durability,

- less data loss risk.

Disadvantages:

- higher write latency,

- replica failures can affect writes.

### Asynchronous

Advantages:

- lower write latency,

- better throughput.

Disadvantages:

- replication lag,

- possible data loss on primary failure.

Decision depends on data criticality.

Payments may prefer stronger durability.

Analytics events may tolerate async.

## Trade-Off 5: Strong Consistency vs Availability/Performance

Strong consistency:

Reads see the latest committed writes.

Benefits:

- simpler user expectations,

- safer for critical data.

Costs:

- may reduce availability during partitions,

- may increase latency,

- may limit scaling.

Eventual consistency:

Reads may see older data temporarily, but converge later.

Benefits:

- better availability,

- better scale,

- lower latency.

Costs:

- stale reads,

- more complex UX,

- not suitable for all data.

Examples:

| Data | Better Default |
| --- | --- |
| Bank balance | Strong consistency |
| Order payment status | Strong or carefully reconciled |
| Social like count | Eventual consistency |
| Product catalog browse | Eventual consistency often okay |
| User password change | Strong consistency |
| Analytics dashboard | Eventual consistency |

## Trade-Off 6: More Indexes vs Write Performance

More indexes:

- faster reads,

- slower writes,

- more storage.

Fewer indexes:

- faster writes,

- less storage,

- slower reads.

Choose based on access pattern.

## Trade-Off 7: Cache vs Database Authority

Cache:

- fast,

- reduces DB load,

- can be stale,

- adds invalidation complexity.

Database:

- authoritative,

- slower,

- durable,

- simpler consistency if no cache.

Use cache for reads that tolerate slight staleness and benefit from speed.

## Trade-Off 8: Single Source of Truth vs Multiple Stores

Single database:

- simpler consistency,

- easier transactions,

- operational bottleneck.

Multiple stores:

- optimized access patterns,

- better scale,

- more complexity,

- reconciliation needed.

Example:

- Primary DB = source of truth

- Search index = derived copy

- Cache = derived copy

- Analytics warehouse = derived copy

Every derived copy needs freshness rules.

# Common Beginner Mistakes

## Mistake 1: Adding Application Servers When Database Is Bottleneck

More app servers can increase database load.

If the database is already saturated, this makes things worse.

## Mistake 2: Sharding Too Early

Sharding adds major complexity.

Before sharding, try:

- indexing,

- query optimization,

- caching,

- replicas,

- vertical scaling,

- data archival.

## Mistake 3: Using Replicas to Scale Writes

Replicas usually help reads.

Writes still go to primary unless using complex multi-primary setups.

## Mistake 4: Ignoring Replication Lag

A user writes, then reads from replica, and sees old data.

This can make the product feel broken.

## Mistake 5: Choosing a Bad Shard Key

Examples of bad shard keys:

- monotonically increasing ID for range sharding,

- status field with few values,

- country field with huge skew,

- tenant field where one tenant dominates.

A bad shard key creates hotspots.

## Mistake 6: No Monitoring

You cannot scale what you cannot measure.

At minimum monitor:

- query latency,

- error rate,

- connections,

- CPU,

- disk I/O,

- replication lag,

- lock waits,

- cache hit rate.

## Mistake 7: Long Transactions

Long transactions hold locks and connections.

They reduce concurrency and can cascade into timeouts.

## Mistake 8: Selecting All Columns and All Rows

Unbounded queries destroy scalability.

Always paginate and select needed fields.

## Mistake 9: Treating Cache as Source of Truth

If cache is lost, data should not be lost.

The database remains authoritative unless explicitly designed otherwise.

## Mistake 10: Forgetting Backups and Restore Testing

A scaled database is useless if you cannot recover it.

Test restores regularly.

## Mistake 11: Ignoring Schema Migrations

Large tables make migrations dangerous.

Plan for online migration and backward compatibility.

## Mistake 12: Copying Big Tech Sharding Strategies

A company with 1 billion users may shard by many dimensions.

Your system with 100,000 users may not need that.

Understand the problem before copying the solution.

# Deep Dive

Now we go deeper into important scaling patterns.

## Deep Dive 1: The Database Scaling Ladder

A practical ladder:

- 1. Measure

- 2. Fix slow queries

- 3. Add/adjust indexes

- 4. Paginate and limit payloads

- 5. Reduce N+1 queries

- 6. Use connection pooling

- 7. Add caching

- 8. Scale vertically

- 9. Add read replicas

- 10. Partition large tables

- 11. Archive old data

- 12. Shard by access pattern

- 13. Separate stores for separate workloads

- 14. Use queues for write bursts

- 15. Consider multi-region or distributed database

Do not jump to step 12 if step 3 would solve the problem.

## Deep Dive 2: Read-Heavy vs Write-Heavy Decision Tree

- Is database slow?

- |

- +-- Yes

- |

- +-- Are reads dominating?

- |      |

- |      +-- Yes

- |      |     +-- Add indexes

- |      |     +-- Cache hot reads

- |      |     +-- Add read replicas

- |      |     +-- Precompute views

- |      |

- |      +-- No

- |            +-- Are writes dominating?

- |                   |

- |                   +-- Yes

- |                   |     +-- Shorten transactions

- |                   |     +-- Reduce indexes

- |                   |     +-- Batch writes

- |                   |     +-- Use queues

- |                   |     +-- Shard by write key

- |                   |

- |                   +-- No

- |                         +-- Check connections/locks/hardware

This tree is not exhaustive, but it trains the right instinct.

## Deep Dive 3: Partitioning by Time

Time-based partitioning is extremely useful for append-heavy data.

Example:

- messages_2026_08

- messages_2026_09

- messages_2026_10

Advantages:

- old partitions can be archived,

- queries often target recent time ranges,

- easier retention policies,

- smaller indexes per partition.

Disadvantages:

- cross-time queries may touch many partitions,

- hot current partition possible,

- requires routing logic.

Good for:

- logs,

- metrics,

- events,

- chat history,

- audit trails.

## Deep Dive 4: Partitioning by Tenant

Multi-tenant systems may partition by tenant.

Example:

\`\`\`text
tenant A → Shard 1
tenant B → Shard 2
tenant C → Shard 1

\`\`\`

Advantages:

- tenant isolation,

- easier billing/operational controls,

- data residency possibilities.

Disadvantages:

- large tenants can create hot shards,

- cross-tenant analytics harder,

- rebalancing tenants may be complex.

Mitigation:

- dedicated shards for giant tenants,

- sub-sharding,

- per-tenant rate limits.

## Deep Dive 5: Denormalization for Scale

Sometimes normalized schemas cause expensive reads.

Example:

A task list needs:

- task title,

- project name,

- owner name.

Normalized query:

\`\`\`text
SELECT tasks.title, projects.name, users.display_name
FROM tasks
JOIN projects ON tasks.project_id = projects.project_id
JOIN users ON tasks.owner_user_id = users.user_id
WHERE tasks.owner_user_id = 42;

\`\`\`

At scale, joins may be costly.

Denormalized task row may store:

- project_name

- owner_display_name

Then list query avoids joins.

But if project name changes, many task rows may need updating.

Use denormalization when:

- reads dominate,

- joined fields change rarely,

- consistency delay is acceptable,

- update path can handle propagation.

## Deep Dive 6: Materialized Views

A materialized view stores a precomputed query result.

Example:

- user_open_task_counts

- ---------------------

- user_id

- open_count

- updated_at

Instead of counting tasks on every request, read the precomputed count.

Advantages:

- fast reads,

- reduced database load.

Disadvantages:

- freshness management,

- extra storage,

- update complexity.

Refresh strategies:

- scheduled refresh,

- event-driven refresh,

- incremental refresh,

- full rebuild occasionally.

## Deep Dive 7: Database Proxy Layer

In complex systems, applications may not connect directly to databases.

A database proxy can provide:

- connection pooling,

- query routing,

- read/write splitting,

- failover,

- sharding,

- rate limiting,

- observability.

Conceptual:

- App Servers

- |

- v

- Database Proxy

- |

- +--> Primary

- +--> Replicas

- +--> Shards

Examples conceptually:

- PgBouncer for pooling,

- ProxySQL for MySQL routing,

- Vitess for MySQL sharding,

- cloud database proxies.

Do not memorize tools.

Understand the function:

A proxy can centralize database routing and protection logic.

## Deep Dive 8: Distributed SQL Databases

Some modern databases attempt to provide SQL-like semantics across multiple nodes.

They may offer:

- automatic replication,

- automatic sharding,

- distributed transactions,

- strong consistency,

- horizontal scale.

Conceptual examples:

- CockroachDB,

- Spanner-like systems,

- TiDB,

- YugabyteDB.

Advantages:

- less application-level sharding complexity.

Disadvantages:

- operational complexity,

- cost,

- latency trade-offs,

- consistency model details matter.

Beginner lesson:

A distributed database can hide some sharding complexity, but it does not remove trade-offs.

## Deep Dive 9: Idempotent Writes at Database Level

Retries can cause duplicate writes.

Database mechanisms can help:

- unique constraints,

- primary key conflicts,

- upserts,

- idempotency tables.

Example:

\`\`\`text
INSERT INTO payments (payment_id, order_id, amount)
VALUES ('pay_123', 'ord_999', 1000)
ON CONFLICT (payment_id) DO NOTHING;

\`\`\`

Exact syntax depends on database.

The idea:

Make repeated writes safe.

## Deep Dive 10: Backpressure and Load Shedding

If the database is overloaded, accepting more work can cause collapse.

Backpressure means signaling upstream components to slow down.

Examples:

- return 503,

- queue with limits,

- reject low-priority requests,

- reduce background jobs,

- rate limit expensive endpoints.

Load shedding means intentionally dropping some work to protect critical functionality.

Example:

- During database overload:

- - allow task reads from cache

- - block non-urgent analytics writes

- - queue notification updates

- - preserve login and payment paths

This is part of reliability engineering.

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

A system has 20 application servers and one database. Traffic doubles. The team adds 20 more application servers. The database becomes slower. Why?

Answer direction:

More application servers can create more concurrent database connections and more queries. If the database was already the bottleneck, adding app servers increases pressure instead of relieving it.

## Predict

Question:

A write goes to primary. A replica has 500 ms replication lag. User writes, then immediately reads from replica. What might happen?

Answer direction:

The user may see old data because the replica has not applied the write yet.

## Find the Bottleneck

Question:

Dashboard shows:

- Database CPU: 20%

- Disk I/O: 95%

- Query latency: high

- Rows scanned per query: millions

What is likely the bottleneck?

Answer direction:

Disk I/O due to inefficient queries scanning too much data. Indexes or query redesign may help more than adding CPU.

## Find the Failure

Question:

Primary database fails. There is one asynchronous replica with 10 seconds of lag. What is the risk?

Answer direction:

If the replica is promoted, writes from the last 10 seconds may be lost.

## Compare

Question:

Which is better for a read-heavy blog?

Option A:

\`One primary database\`

Option B:

\`One primary + three read replicas\`

Answer direction:

Option B is often better for read scaling, assuming replication lag is acceptable and reads can be routed safely.

## Design This

Question:

You have an event logging system receiving 50,000 events/sec. Reads are rare and mostly analytical. What database approach might be reasonable?

Answer direction:

- write-optimized store,

- time-based partitioning,

- batching,

- queue in front of writers,

- columnar or log storage,

- analytics warehouse for reads,

- avoid many indexes.

# Architecture Exercise

## Weak Design

A startup has:

- [App Server]

- |

- v

- [One Database]

Problems:

- tasks table has 200 million rows,

- no index on owner_user_id,

- API returns all tasks,

- each task list request also queries comments for every task,

- database connections are opened per request,

- no monitoring,

- no backups,

- one database crash stops everything.

## Your Task

Improve the design step by step.

Ask:

- What is the bottleneck?

- What can be fixed without adding servers?

- What infrastructure is justified?

- What failure risks remain?

- What trade-offs are introduced?

## Hint 1 — Measurement Hint

Check:

- query latency,

- rows scanned,

- connection count,

- CPU/disk I/O,

- lock waits.

Likely issues:

- full table scans,

- N+1 queries,

- unbounded responses,

- connection overhead.

## Hint 2 — Optimization Hint

Add:

- index on (owner_user_id, status, created_at),

- pagination,

- select only needed columns,

- batch comment counts,

- connection pooling,

- statement timeouts.

This may dramatically reduce load.

## Hint 3 — Availability Hint

Add:

- replica for backup/failover,

- monitoring,

- alerts,

- backups,

- tested restore.

## Hint 4 — Scaling Hint

If reads still dominate:

- add read replicas,

- add cache for hot task lists,

- precompute common views.

If writes/storage dominate:

- partition by user or time,

- archive old tasks,

- shard if necessary.

## Improved Architecture Direction

Initial improved design:

- Clients

- |

- v

- Load Balancer

- |

- +--> App Server 1

- +--> App Server 2

- |

- v

- Connection Pool

- |

- v

- Primary DB

- |

- v

- Replica DB

Add:

\`[Cache]\`

for hot reads.

Add:

- [Monitoring]

- [Backups]

- [Alerts]

Later, if needed:

- [Shard Router]

- |

- +--> Shard 1

- +--> Shard 2

- +--> Shard 3

The exact path depends on measurements.

# Design Exercise: Scaling TaskTracker

Now you practice a fuller scaling design.

## Problem

TaskTracker has:

- 1 million registered users

- 100,000 daily active users

- 20 requests/user/day

- 90% reads

- 10% writes

- Peak factor 5x

- Tasks table: 50 million rows

- Average task size: 1 KB

- Users frequently list open tasks sorted by created date

- Some users have many tasks

Design a database scaling strategy.

## Step 1: Clarify Requirements

Questions:

- Is read-your-own-writes important?

- Can users see stale task lists for a few seconds?

- Are there shared tasks?

- Do we need global search?

- Do we need analytics?

- What availability target?

- What durability target?

Assume:

- users should see their own updates quickly,

- slight staleness for other users is acceptable,

- no global admin scans in hot path,

- availability target 99.9%,

- committed tasks must not be lost.

## Step 2: Estimate Load

From earlier:

- Daily requests = 100,000 × 20 = 2,000,000

- Average RPS ≈ 23

- Peak RPS ≈ 115

Reads:

\`90% → peak reads ≈ 104/sec\`

Writes:

\`10% → peak writes ≈ 12/sec\`

But each request may cause multiple queries.

Assume average 3 database queries per API request:

\`Peak DB queries ≈ 115 × 3 = 345 queries/sec\`

This is not enormous, but with 50 million rows and bad indexes it can be painful.

## Step 3: Identify Bottleneck Type

Likely:

- read-heavy,

- repeated task list queries,

- large table,

- possible missing composite indexes,

- possible N+1 queries,

- possible connection pressure from multiple app servers.

## Step 4: First Fixes Before Infrastructure

Do these first:

### Indexes

Add:

\`tasks(owner_user_id, status, deleted_at, created_at)\`

Also:

- tasks(project_id, created_at)

- comments(task_id, created_at)

### Query changes

- paginate task lists,

- select only needed columns,

- batch fetch related data,

- avoid loading comments for every task in list view.

### Connection pooling

Use bounded pools per app server.

### Timeouts

Set database statement timeouts.

### Monitoring

Track:

- p95/p99 query latency,

- rows scanned,

- connection count,

- lock waits,

- replication lag if replicas added.

## Step 5: Add Caching

Cache hot task lists or individual tasks.

Example keys:

- task:123

- tasks:user_42:status_open:cursor_xyz

TTL:

\`short, e.g. 10–60 seconds\`

Invalidation:

\`On task update, delete affected task cache and user list caches\`

For read-your-own-writes, after a user write, avoid serving stale cache for that user briefly.

## Step 6: Add Read Replicas

Because reads dominate, add replicas.

Architecture:

- App Servers

- |

- +--> writes --> Primary DB

- |

- +--> reads --> Replica DB 1

- --> Replica DB 2

Handle replication lag:

- for recent user writes, read from primary or use version token,

- for non-critical reads, replica is fine.

## Step 7: Consider Partitioning/Archival

50 million rows may be okay with indexes, but growth continues.

Options:

- archive completed/archived tasks to colder storage,

- partition tasks by time or status,

- keep active tasks in hot table,

- move historical tasks to archive table.

Example:

- active_tasks

- archived_tasks

## Step 8: Consider Sharding Only If Needed

Shard by:

\`owner_user_id\`

if one primary cannot handle writes/storage or if tenant isolation is needed.

But at 12 peak writes/sec, sharding may be premature.

If future growth reaches millions of writes/sec or tens of billions of rows, sharding becomes more attractive.

## Step 9: Failure Handling

Add:

- replica promotion/failover,

- backups,

- point-in-time recovery,

- monitoring alerts,

- connection pool limits,

- circuit breakers for database calls,

- graceful degradation:

- serve cached task lists if DB slow,

- disable non-urgent writes,

- show error for critical writes rather than fake success.

## Final Scaling Design Direction

For current scale:

- Clients

- |

- v

- Load Balancer

- |

- +--> App Servers

- |

- +--> Cache

- |

- +--> Primary DB

- |

- v

- Replica DB 1

- Replica DB 2

With:

- proper indexes,

- pagination,

- connection pooling,

- monitoring,

- backups,

- read-your-own-write handling,

- archival plan.

Sharding is held in reserve unless measurements show primary limits.

This is a mature scaling path: solve inefficiency first, then add distributed complexity where required.

# Practice Questions

Try answering without rereading.

## Conceptual Questions

- What is a database bottleneck?

- Why are databases harder to scale than stateless app servers?

- What is vertical scaling?

- What is horizontal scaling?

- What is an index and how does it help scaling?

- What is connection pooling?

- What is replication?

- What is a primary database?

- What is a replica database?

- What is replication lag?

- What is read-your-own-writes consistency?

- What is synchronous replication?

- What is asynchronous replication?

- What is partitioning?

- What is sharding?

- What is a shard key?

- What is hash sharding?

- What is range sharding?

- What is a hot partition?

- What is resharding?

- Why are cross-shard queries difficult?

- Why are cross-shard transactions difficult?

- What is a materialized view?

- What is denormalization?

- What is load shedding?

## Scenario Questions

### Question 1

A database has high disk I/O and queries scan millions of rows.

What should you investigate first?

Answer direction:

Missing or ineffective indexes, expensive queries, unbounded result sets.

### Question 2

A system has 10 app servers and one database. Adding more app servers makes latency worse.

Why?

Answer direction:

Database is bottleneck; more app servers increase concurrent queries/connections.

### Question 3

Users complain that after updating their profile, they sometimes see old data.

What is a likely cause?

Answer direction:

Reads from lagging replicas.

### Question 4

One shard has 90% of traffic.

What is this problem called?

Answer direction:

Hot partition or hotspot.

### Question 5

Writes are the bottleneck.

Will adding read replicas help?

Answer direction:

Usually not much, because replicas mainly serve reads.

## Design Questions

### Question 1

Design a scaling strategy for a product catalog with 100 million reads/day and 10,000 writes/day.

Answer direction:

Read-heavy. Use indexes, caching, read replicas, CDN/static caching, possibly search index. Sharding likely unnecessary unless storage/write primary limits appear.

### Question 2

Design a scaling strategy for an IoT platform ingesting 1 million events/sec.

Answer direction:

Write-heavy. Use queues, batching, time partitioning, write-optimized store, minimal indexes, archival, possibly columnar/time-series database.

### Question 3

Design a multi-tenant SaaS database strategy.

Answer direction:

Consider tenant-based sharding, isolated schemas, dedicated shards for large tenants, rate limits, cross-tenant analytics in separate warehouse.

# Interview Questions

These are common beginner-to-intermediate system design interview questions.

## Question 1

Interviewer: How do you know if a database is the bottleneck?

Good answer direction:

I look at query latency, throughput, CPU, memory, disk I/O, connection counts, lock waits, rows scanned, and error rates. If application servers have capacity but database metrics are saturated or queries scan too much data, the database is likely the bottleneck.

## Question 2

Interviewer: What is the first thing you would do before adding replicas or shards?

Good answer direction:

I would measure and optimize. Often missing indexes, unbounded queries, N+1 patterns, long transactions, or poor connection management cause the problem. Infrastructure scaling should follow evidence.

## Question 3

Interviewer: What is the difference between replication and sharding?

Good answer direction:

Replication copies the same data to multiple databases, helping read scaling, availability, and recovery. Sharding splits different data onto different databases, helping scale storage and writes but adding routing and consistency complexity.

## Question 4

Interviewer: When would you use read replicas?

Good answer direction:

When reads dominate and users can tolerate small replication lag, or when critical reads can be routed carefully. Read replicas reduce primary load and improve availability.

## Question 5

Interviewer: What is replication lag and why does it matter?

Good answer direction:

Replication lag is the delay before a replica reflects writes from the primary. It matters because reads from replicas may return stale data, causing user confusion or incorrect application behavior unless handled with consistency strategies.

## Question 6

Interviewer: How would you handle read-your-own-writes in a replicated database?

Good answer direction:

I could route recent user reads to primary, use version tokens, enforce session consistency, or wait for replica freshness. The choice depends on traffic and consistency requirements.

## Question 7

Interviewer: What makes a good shard key?

Good answer direction:

A good shard key distributes load evenly, matches common access patterns, keeps related data together, avoids hotspots, and remains stable over time.

## Question 8

Interviewer: Why is sharding difficult?

Good answer direction:

It introduces routing complexity, cross-shard queries, distributed transactions, rebalancing, hotspots, operational overhead, and consistency challenges.

## Question 9

Interviewer: When would you choose synchronous replication?

Good answer direction:

When losing committed writes is unacceptable, such as payments or critical financial records. The cost is higher write latency and more complex failure handling.

## Question 10

Interviewer: What is a hot partition?

Good answer direction:

A shard or partition receiving disproportionate traffic, often due to a bad shard key or skewed access pattern. It can bottleneck the system even if other shards are idle.

## Question 11

Interviewer: How can caching help database scaling?

Good answer direction:

Caching reduces repeated expensive reads and lowers database load. But it introduces staleness, invalidation complexity, memory cost, and possible hot-key issues.

## Question 12

Interviewer: Would you shard a system with 100,000 daily users?

Good answer direction:

Probably not as a first step. I would measure, index, optimize queries, add caching, use connection pooling, and maybe add replicas. Sharding is justified when primary write/storage limits or isolation requirements appear.

# Self-Check

Ask yourself honestly:

- Can I explain why databases become bottlenecks?

- Can I distinguish read bottlenecks from write bottlenecks?

- Can I explain vertical vs horizontal scaling?

- Can I explain how indexes help scaling and what their cost is?

- Can I explain connection pooling?

- Can I explain primary/replica replication?

- Can I explain replication lag and read-your-own-writes?

- Can I compare synchronous and asynchronous replication?

- Can I explain partitioning and sharding?

- Can I choose a shard key for a simple system?

- Can I explain hot partitions and mitigations?

- Can I explain why cross-shard transactions are hard?

- Can I describe how caching reduces database load?

- Can I identify failure scenarios in a replicated or sharded database?

- Can I explain the trade-off between consistency, availability, latency, and cost?

If you can answer most of these, you are ready to move deeper.

If not, review:

- replication,

- shard keys,

- read-your-own-writes,

- connection pooling,

- and the database scaling ladder.

# DSA/Backend/Coding Connection

Database scaling connects strongly to data structures and algorithms.

| Programming Concept | Database Scaling Connection |
| --- | --- |
| Hash map | Hash sharding, key-value lookup |
| B-tree | Database indexes |
| Sorted array | Range partitioning, ordered scans |
| Linked list/log | Append-only event stores |
| Queue | Buffering write bursts |
| Cache/LRU | Query/object caching |
| Lock/mutex | Row locks, transaction contention |
| Divide and conquer | Partitioning/sharding |
| Consistent hashing | Distributed shard mapping |
| Bloom filter | Deduplication, probabilistic checks |
| Big-O complexity | Query cost and scan behavior |
| Serialization | Row/storage encoding, payload size |

For example:

- A hash map distributes keys across buckets.

Hash sharding distributes rows across shards.

- A B-tree speeds search.

A database index speeds row lookup.

- A queue buffers producers and consumers.

A message queue buffers write bursts to a database.

- A lock protects shared state.

Database transactions and locks protect concurrent writes.

System design is often large-scale data structures.

The same algorithmic thinking applies, but now across machines, networks, replicas, and failure modes.`,
    },
    {
      slug: "chapter-7-caching",
      title: "Chapter 7 — Caching",
      summary: "Imagine a product catalog system. One product page is viewed 100,000 times per day.",
      difficulty: "beginner",
      estimatedMinutes: 64,
      order: 6,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should understand:", "what a cache is,", "what a cache hit is,", "what a cache miss is,", "what a cache key is,", "what a cache value is,", "what TTL means,", "what cache eviction means,", "what cache invalidation means,", "what stale data means,", "where caches can live in a system,", "what local caching is,"],
      prerequisites: [],
      whereItFits: "Imagine a product catalog system. One product page is viewed 100,000 times per day.",
      keyTakeaways: ["This chapter taught you caching as a core system design tool.", "A cache stores copies of data in a faster place to avoid repeated expensive work.", "Caching can:", "reduce latency,", "reduce database load,", "improve throughput,", "protect systems during spikes,", "enable graceful degradation.", "But caching also introduces:", "stale data,"],
      selfAssessment: [],
      content: `# Chapter 7 — Caching

In Chapter 6, you learned how databases become bottlenecks and how systems scale them using indexing, query optimization, connection pooling, replication, partitioning, and sharding.

One important idea appeared repeatedly:

Many database reads are repeated reads of the same data.

For example:

- thousands of users viewing the same product page,

- many requests loading the same task details,

- repeated profile lookups for the same user,

- frequent reads of configuration data,

- repeated queries for trending posts,

- repeated requests for the same video metadata.

If every one of those reads goes to the database, the database may become slow even when the data has not changed.

This is where caching becomes extremely useful.

Caching means:

Storing a copy of data in a faster place so future requests can be served without doing the full expensive work again.

This chapter teaches caching from first principles.

You will learn what a cache is, how cache hits and misses work, where caches can live, how to invalidate caches, how to avoid stale data, how distributed caches work, and when caching helps or hurts.

Caching looks simple at first.

But in real systems, caching is one of the most powerful and most dangerous tools in backend architecture.

Powerful because it can reduce latency and database load dramatically.

Dangerous because it can cause stale data, inconsistent behavior, thundering herds, hot keys, and difficult debugging.

The goal of this chapter is not to teach you “use Redis.”

The goal is to teach you:

What problem caching solves, how it changes request flow, what trade-offs it introduces, and when it is appropriate.

## Why This Matters

Imagine a product catalog system.

One product page is viewed 100,000 times per day.

The product data changes only once per day.

If every view queries the database, the database does 100,000 reads for data that barely changes.

That is wasteful.

With caching, the system might do:

- First request: read database, store in cache

- Next many requests: read from cache

- When product changes: invalidate or update cache

Now the database may do only a few reads instead of 100,000.

This can:

- make responses faster,

- reduce database cost,

- improve scalability,

- protect the database during traffic spikes,

- allow more users to be served with the same infrastructure.

But caching also introduces questions:

- How long can users see old data?

- What happens when the product price changes?

- What happens if the cache is down?

- What happens if many cache entries expire at the same time?

- What happens if one product becomes extremely popular?

- What happens if the cache and database disagree?

- Should we delete the cache or update it?

- Should the cache be per-server or shared?

These are system design questions.

Caching is not just “store data in memory.”

Caching is a trade-off between speed, freshness, complexity, and reliability.

## Prerequisites

Before this chapter, you should understand:

- what a client is,

- what a server is,

- what a request and response are,

- what an API is,

- what a database is,

- what reads and writes are,

- what latency and throughput are,

- basic database scaling ideas from Chapter 6.

No prior caching knowledge is required.

# Start With a Real-World Problem

Suppose you run an online store.

Customers frequently view product pages.

A product page may need:

- product name,

- description,

- price,

- images,

- stock status,

- rating,

- seller name.

At small scale, the architecture may be:

- [Customer Browser]

- |

- v

- [Web Server]

- |

- v

- [Database]

Every product page request goes to the database.

Now suppose one product becomes popular.

Maybe it is on sale.

Maybe it was featured on the homepage.

Maybe thousands of users view it within minutes.

The database suddenly receives many repeated reads for the same product.

- GET /products/123

- GET /products/123

- GET /products/123

- GET /products/123

- ...

The product data has not changed, but the database keeps doing the same work.

Latency increases.

Database CPU increases.

Other requests slow down.

Eventually, the system may become unstable.

One solution is to add a cache.

- [Customer Browser]

- |

- v

- [Web Server]

- |      |

- |      v

- |   [Cache]

- |

- v

- [Database]

Now the first request may read from the database and store the product in the cache.

Later requests can read from the cache.

This is much faster.

But now new problems appear:

- What if the price changes?

- What if stock becomes zero?

- What if the cache contains old data?

- What if the cache server crashes?

- What if the popular product creates a hot key?

- What if many users request the product at the exact moment the cache entry expires?

This chapter explains how to handle those problems.

# Intuition

A cache is like a desk drawer next to your workspace.

Imagine you work in an office and often need the same documents.

Without a cache:

Every time you need a document, you walk to the central archive, search the shelves, copy the document, and return.

That is slow.

With a cache:

You keep frequently used documents in a drawer near your desk.

When you need one:

- if it is in the drawer, you use it immediately;

- if it is not there, you go to the archive, get it, and maybe put a copy in the drawer.

The drawer is the cache.

The archive is the database.

The important idea:

A cache stores copies of data in a faster place to avoid repeated expensive work.

But there is a catch.

If the original document in the archive changes, the copy in your drawer may become outdated.

In caching, outdated data is called stale data.

So caching gives you speed, but it forces you to manage freshness.

# Core Concept

Let us build caching carefully, one concept at a time.

## 1. What Is a Cache?

### Simple explanation

A cache is a storage layer that keeps copies of frequently or recently used data so future requests can be faster.

### Formal term

Cache.

### Example

A web server may cache product details:

- Key: product:123

- Value: { name: "Wireless Mouse", price: 2500, currency: "USD" }

### Practical use

Caches are used to reduce:

- database reads,

- expensive computation,

- external API calls,

- file access,

- rendering work,

- network latency.

A cache is usually faster than the original source of data.

Common cache characteristics:

- small compared to full database,

- temporary,

- optimized for reads,

- may lose data without catastrophic failure if the original source remains.

Important beginner rule:

A cache should usually not be the only place where important data exists.

If the cache disappears, the system should be able to rebuild it from the source of truth.

## 2. What Is a Cache Hit?

### Simple explanation

A cache hit means the requested data was found in the cache.

### Formal term

Cache hit.

### Example

Request:

\`Get product 123\`

Cache contains:

\`product:123 → product data\`

**Result:**

\`Cache hit\`

The server returns data from cache without querying the database.

### Practical use

High cache hit rate usually means:

- lower latency,

- less database load,

- better throughput.

## 3. What Is a Cache Miss?

### Simple explanation

A cache miss means the requested data was not found in the cache.

### Formal term

Cache miss.

### Example

Request:

\`Get product 456\`

Cache does not contain \`product:456\`.

**Result:**

\`Cache miss\`

The server must read from the database or another source.

### Practical use

Misses are normal.

A system design question is:

What happens after a miss?

Usually:

- Read from source of truth.

- Store result in cache.

- Return result to client.

But if many misses happen at once, the database may become overloaded.

## 4. What Is Cache Hit Rate?

### Simple explanation

Cache hit rate is the percentage of requests that find data in the cache.

### Formula

\`Hit rate = cache hits / total cache requests\`

Example:

- 10,000 requests

- 9,500 hits

- 500 misses

Hit rate:

\`9,500 / 10,000 = 95%\`

### Why it matters

If your system receives 10,000 reads per second and cache hit rate is 95%, only 500 reads per second reach the database.

\`Database reads/sec = total reads/sec × miss rate\`

Example:

- Total reads/sec = 10,000

- Hit rate = 95%

- Miss rate = 5%

- Database reads/sec = 10,000 × 5% = 500

That is a huge reduction.

But if hit rate is only 20%, the cache helps much less.

\`Database reads/sec = 10,000 × 80% = 8,000\`

So cache effectiveness depends on workload.

## 5. What Is a Cache Key?

### Simple explanation

A cache key is the identifier used to store and retrieve cached data.

### Formal term

Cache key.

### Example:

- product:123

- user:42:profile

- tasks:user:42:status:open:page:1

- feed:user:99

### Practical use

Cache key design is extremely important.

A good cache key:

- is unique for the data being cached,

- includes necessary dimensions,

- avoids collisions,

- is not too large,

- does not contain secrets unnecessarily,

- supports invalidation.

Bad key:

\`product\`

Why bad?

Because many products would collide.

Better:

\`product:123\`

But even that may not be enough.

If product data varies by language, region, or user, the key may need those dimensions:

- product:123:lang:en:region:US

- product:123:lang:fr:region:CA

If the key omits language, French users may see English data.

This is a classic caching bug.

## 6. What Is a Cache Value?

### Simple explanation

A cache value is the data stored under a cache key.

### Formal term

Cache value.

### Example:

\`\`\`text
{
  "product_id": 123,
  "name": "Wireless Mouse",
  "price_cents": 2500,
  "currency": "USD",
  "in_stock": true,
  "updated_at": "2026-10-05T10:30:00Z"
}


\`\`\`
### Practical use

Cache values can be:

- raw database rows,

- serialized objects,

- JSON responses,

- rendered HTML fragments,

- computed results,

- tokens,

- counters,

- lists.

Important design question:

Should we cache individual objects or whole query results?

This has trade-offs.

## 7. Object Caching vs Query Result Caching

### Object caching

Cache individual entities.

Example:

- product:123 → product object

- user:42 → user object

Advantages:

- reusable across endpoints,

- easier invalidation by object ID,

- smaller values,

- better hit rate across different queries.

Disadvantages:

- may still require assembling multiple objects,

- may need additional queries for lists.

### Query result caching

Cache the result of a specific query.

Example:

\`products:category:electronics:page:1:sort:price_asc → list of product IDs or full JSON\`

Advantages:

- very fast for repeated identical queries,

- avoids joins and sorting.

Disadvantages:

- many possible query combinations,

- harder invalidation,

- stale results easier,

- lower reuse across slightly different queries.

Beginner recommendation:

Start with object caching for individual resources. Use query result caching carefully for hot, repeated, well-defined queries.

## 8. What Is TTL?

### Simple explanation

TTL means time to live.

It is the amount of time a cache entry remains valid before it expires.

### Formal term

TTL, Time To Live.

### Example:

\`product:123 expires in 60 seconds\`

After 60 seconds, the cache entry is considered stale or removed.

### Why TTL matters

TTL limits how long stale data can be served.

If a product price changes but invalidation fails, TTL eventually forces a fresh read.

### TTL trade-offs

Short TTL:

- fresher data,

- more database load,

- lower cache hit rate.

Long TTL:

- less database load,

- higher hit rate,

- staler data.

Example:

- TTL = 5 seconds → fairly fresh, more DB reads

- TTL = 1 hour → much less DB load, but users may see old price for up to 1 hour

The right TTL depends on how often data changes and how much staleness users tolerate.

## 9. What Is Stale Data?

### Simple explanation

Stale data is old cached data that no longer matches the source of truth.

### Formal term

Stale cache entry.

### Example

Database:

\`price = 3000\`

Cache:

\`price = 2500\`

The cache is stale.

### Why it matters

Stale data can cause user confusion or business problems.

Examples:

- old price,

- old stock status,

- old user permissions,

- old password reset state,

- old payment status,

- old inventory count.

Some stale data is acceptable.

Some is not.

System design question:

How stale is too stale?

For a video view count, a few seconds or minutes may be fine.

For a payment confirmation, stale data may be unacceptable.

## 10. What Is Cache Invalidation?

### Simple explanation

Cache invalidation means removing or updating cached data when the underlying data changes.

### Formal term

Cache invalidation.

### Example

Product price changes in database.

System deletes cache key:

\`DELETE product:123\`

Next request misses cache, reads fresh data from database, and stores it again.

### Why invalidation is hard

When data changes, copies may exist in:

- local application caches,

- distributed cache,

- CDN,

- browser cache,

- search index,

- materialized views,

- mobile app cache.

Keeping all copies fresh is difficult.

There is a famous saying:

There are two hard problems in computer science: cache invalidation and naming things.

The exact quote varies, but the lesson is real:

Invalidation is harder than it looks.

## 11. Eviction

### Simple explanation

Eviction means removing old or less useful cache entries to make room for new ones.

### Formal term

Cache eviction.

### Why needed

Caches have limited memory.

If the cache is full, it must decide what to remove.

### Common eviction policies

| Policy | Simple Meaning |
| --- | --- |
| LRU | Remove Least Recently Used |
| LFU | Remove Least Frequently Used |
| FIFO | Remove First In, First Out |
| Random | Remove a random entry |
| TTL-based | Remove entries after their time expires |
| LRU-K / TinyLFU | More advanced frequency/recency hybrids |

### LRU example

Cache can hold 3 items.

Recently used:

\`A, B, C\`

New item D arrives.

LRU removes the least recently used item.

If A was used longest ago, remove A.

### LFU example

Remove the item used least often.

If A was accessed 1 time and B/C were accessed 100 times, remove A.

### Practical use

Eviction policy affects hit rate.

For many systems, LRU is a reasonable default.

But workloads with frequent scans can pollute the cache.

Advanced policies may help.

You do not need to master eviction algorithms now.

Understand:

Caches are finite. Eviction is how they stay within memory limits.

# Where Caches Can Live

A common beginner misconception is:

Cache means Redis.

No.

Caching can happen at many layers.

## 12. Browser Cache

The user’s browser can cache assets and sometimes API responses.

Examples:

- CSS files,

- JavaScript files,

- images,

- fonts,

- API responses with cache headers.

Advantages:

- no server request needed for cached assets,

- very fast for user.

Disadvantages:

- controlled by client,

- hard to invalidate centrally,

- privacy/security concerns.

Example headers:

\`Cache-Control: public, max-age=31536000\`

For static assets with versioned filenames:

\`/app.8f3a2b.css\`

browser caching is extremely powerful.

## 13. CDN Cache

A CDN, or Content Delivery Network, caches content near users at edge locations.

Good for:

- images,

- videos,

- CSS,

- JavaScript,

- downloadable files,

- static website assets.

Example:

- User in India requests image

- Edge server near India may already have it

- No need to fetch from origin server far away

Advantages:

- reduces latency,

- reduces origin bandwidth,

- scales static content well.

Disadvantages:

- cache invalidation can be slow,

- dynamic personalized content is harder,

- cost and complexity.

You will study CDNs more in networking chapters, but for caching, understand:

A CDN is a distributed cache for content delivered to users.

## 14. Application Local Cache

Each application server can keep its own in-memory cache.

Example:

\`\`\`text
App Server 1 local cache:
product:123 → data

App Server 2 local cache:
product:123 → data

\`\`\`

Advantages:

- extremely fast,

- no network hop,

- simple to start.

Disadvantages:

- inconsistent across servers,

- duplicated memory use,

- hard to invalidate globally,

- cold start after server restart,

- may cause different users to see different cached versions.

Local cache is useful for:

- configuration data,

- rarely changing reference data,

- process-wide constants,

- short-lived hot objects.

But if multiple app servers exist, local cache alone can create consistency problems.

## 15. Distributed Cache

A distributed cache is a shared cache accessible by multiple application servers.

Example:

- App Server 1 --\\

- App Server 2 ---+--> [Distributed Cache]

- App Server 3 --/

Advantages:

- shared across servers,

- more consistent than local cache,

- can be scaled independently,

- can store larger total memory than one app server.

Disadvantages:

- network hop,

- operational complexity,

- cache cluster can fail,

- hot keys can overload one cache node,

- requires serialization and key design.

Conceptual examples:

- Redis,

- Memcached,

- vendor-specific in-memory stores.

Important:

Do not learn Redis as a magic answer. Learn it as one implementation of a distributed key-value cache.

## 16. Database Cache

Databases often have internal caches.

Examples:

- buffer pool,

- query cache,

- index cache,

- execution plan cache.

Advantages:

- transparent to application,

- speeds repeated database work.

Disadvantages:

- limited control,

- still consumes database resources,

- does not reduce connection pressure,

- cannot serve requests if database is down.

Application-level caching can reduce load before requests even reach the database.

## 17. Operating System / File Cache

The operating system may cache file data in memory.

Example:

- frequently read files stay in OS page cache.

This is usually invisible to application designers, but it can affect performance.

For system design interviews, this is rarely the main focus.

But understand:

Caching exists at many layers, not only in application code.

# Cache Patterns

Now we study common ways applications use caches.

## 18. Cache-Aside Pattern

### Simple explanation

The application checks the cache first.

If data is present, use it.

If not, read from the database, store it in the cache, then return it.

This is called cache-aside because the cache sits beside the application logic.

### Read flow

\`\`\`text
Client request
   ↓
App checks cache
   |
   +-- hit → return cached data
   |
   +-- miss → read database
                ↓
              write cache
                ↓
              return data


\`\`\`
### Example pseudocode
def get_product(product_id):
    key = f"product:{product_id}"
    cached = cache.get(key)

    if cached is not None:
        return cached

    product = db.query_product(product_id)

    if product is not None:
        cache.set(key, product, ttl=60)

    return product


### Advantages

- simple to understand,

- application controls cache logic,

- works well with existing databases,

- cache can be disabled with less architectural change.

### Disadvantages

- application code must handle cache logic,

- race conditions possible,

- stale data possible,

- invalidation still required.

Cache-aside is one of the most common beginner-friendly patterns.

## 19. Read-Through Cache

### Simple explanation

The application asks the cache for data.

If the cache does not have it, the cache itself loads the data from the database.

### Flow

\`\`\`text
App asks cache for product:123
   |
   +-- cache hit → return data
   |
   +-- cache miss → cache reads database
                      ↓
                    cache stores data
                      ↓
                    returns data to app


\`\`\`
### Advantages

- simpler application code,

- cache logic centralized.

### Disadvantages:

- cache becomes more intelligent and complex,

- database connection logic may move into cache layer,

- harder to customize per-endpoint behavior.

Read-through is common in libraries and frameworks.

## 20. Write-Through Cache

### Simple explanation

When the application writes data, it writes to the cache and the database together.

### Flow

\`\`\`text
App updates product
   ↓
Write to cache
   ↓
Write to database
   ↓
Return success

\`\`\`

or depending on implementation:

- App writes to cache

- Cache writes to database

### Advantages

- cache stays fresh after writes,

- reads may hit cache often,

- useful when read-after-write consistency is important.

### Disadvantages

- write path becomes slower,

- if database write fails, cache may contain data that is not durable,

- more complex error handling.

Important caution:

Do not treat cache as source of truth.

If the database write fails, the cache should not keep the new value as if it succeeded.

## 21. Write-Around Cache

### Simple explanation

Writes go directly to the database, not to the cache.

The cache is updated only on reads.

### Flow

- App updates database

- Does not update cache

- Future reads may miss and load fresh data

### Advantages

- simpler write path,

- avoids writing data that may never be read.

### Disadvantages

- cache may remain stale until TTL expires or invalidation occurs,

- reads after writes may miss.

Often used with TTL or explicit invalidation.

## 22. Write-Back / Write-Behind Cache

### Simple explanation

The application writes to the cache first.

The cache later writes to the database.

### Flow

- App updates cache

- Cache acknowledges quickly

- Cache asynchronously writes to database

### Advantages

- very fast writes,

- can batch database writes,

- useful for some high-throughput systems.

### Disadvantages

- risk of data loss if cache crashes before database write,

- complex durability,

- harder consistency,

- not suitable for critical data unless carefully designed.

Beginner rule:

Avoid write-back caching for payments, orders, passwords, legal records, or any data that must not be lost.

## 23. Negative Caching

### Simple explanation

Cache the fact that something does not exist.

### Example

Request:

\`GET /products/999999\`

Database says:

\`Not found\`

Instead of querying the database every time for this nonexistent product, cache:

- product:999999 → NOT_FOUND

- TTL: 30 seconds

### Advantages

- protects database from repeated misses,

- useful against scanning attacks,

- reduces load for frequently requested missing keys.

### Disadvantages

- if object is created later, stale negative cache may hide it,

- needs careful invalidation on creation.

Negative caching is often overlooked by beginners.

# Cache Invalidation Strategies

Invalidation is the heart of caching difficulty.

Let us study common strategies.

## 24. TTL-Only Invalidation

### Simple explanation

Do nothing on write. Let cache entries expire after a time.

Example:

\`product:123 TTL = 60 seconds\`

If product changes, old data may remain up to 60 seconds.

### Advantages

- very simple,

- no write-path cache logic,

- robust if invalidation events are lost.

### Disadvantages

- stale data for TTL duration,

- not suitable for frequently changing critical data.

Use when:

- data changes slowly,

- staleness is acceptable,

- simplicity matters.

Examples:

- product descriptions,

- profile bios,

- configuration flags,

- non-critical metadata.

## 25. Delete-on-Write

### Simple explanation

When data changes, delete the cache key.

Next read repopulates cache from database.

### Flow

- Update database

- Delete cache key

Example:

- UPDATE products SET price = 3000 WHERE product_id = 123;

- DELETE cache key product:123

### Advantages

- simpler than updating cache directly,

- avoids writing partial or inconsistent cache objects,

- next read gets fresh data.

### Disadvantages

- causes cache miss after every write,

- race conditions possible,

- if delete fails, stale data remains until TTL.

Delete-on-write is often safer than update-on-write.

Why?

Because deleting forces the next reader to load the authoritative value from the database.

## 26. Update-on-Write

### Simple explanation

When data changes, update the cache value directly.

### Flow

- Update database

- Update cache

### Advantages

- avoids immediate cache miss,

- can provide fresh reads.

### Disadvantages

- more complex,

- risk of cache and database diverging,

- race conditions,

- may cache wrong version if concurrent writes happen.

Example race:

- Thread A updates DB to version 2

- Thread B updates DB to version 3

- Thread B updates cache to version 3

- Thread A updates cache to version 2

- Cache now stale even though DB is newer

This is why update-on-write must be done carefully.

## 27. Versioned Cache Keys

### Simple explanation

Include a version number in the cache key.

Example:

- product:123:v17

- product:123:v18

When product version changes, new key is used.

Old key may expire naturally.

### Advantages

- avoids some invalidation races,

- readers can request known version,

- useful for immutable or append-style data.

### Disadvantages

- old entries accumulate until TTL/eviction,

- clients must know current version,

- invalidation still needed for “latest version” pointers.

Versioned keys are useful in feeds, documents, and APIs with entity versions.

## 28. Event-Based Invalidation

### Simple explanation

When data changes, publish an event.

Cache invalidators consume the event and delete/update relevant cache keys.

### Flow

- App updates database

- Database/service publishes ProductUpdated event

- Event consumer invalidates cache keys

### Advantages

- decouples write path from cache invalidation,

- can invalidate multiple cache layers,

- scalable in complex systems.

### Disadvantages

- eventual consistency,

- events may be delayed or lost,

- requires message infrastructure,

- more operational complexity.

Use when:

- many caches depend on same data,

- invalidation must reach multiple services,

- TTL alone is too stale.

## 29. Invalidate by Pattern

Sometimes one entity change affects many cache keys.

Example:

Product price changes.

Cached keys may include:

- product:123

- products:category:electronics:page:1

- products:search:mouse

- user:42:wishlist

- feed:user:99

Deleting all related keys can be difficult.

Options:

- maintain lists of affected keys,

- use version tokens in values,

- use shorter TTL for aggregate caches,

- rebuild affected views asynchronously,

- avoid caching expensive aggregates if freshness matters.

Beginner lesson:

Object caches are easier to invalidate than query-result caches.

# The Cache Invalidation Race Condition

This is one of the most important caching concepts.

Suppose two operations happen concurrently:

- a read that misses cache,

- a write that updates database.

Bad sequence:

\`\`\`text
Time 1: Reader checks cache → miss
Time 2: Reader reads old value from database
Time 3: Writer updates database to new value
Time 4: Writer deletes cache key
Time 5: Reader writes old value into cache

\`\`\`

**Result:**

- Database has new value

- Cache has old value

The cache is now stale, and may remain stale until TTL expires.

This is a classic race condition.

## How to Reduce This Race

### Option 1: Use short TTL

Limits damage.

### Option 2: Delete cache after database write with some delay

Example:

- Update DB

- Delete cache

- Wait briefly

- Delete cache again

This is imperfect but sometimes used.

### Option 3: Use versioning

Reader only writes cache if version is still current.

Example:

- Read DB row with version 17

- Writer updates row to version 18

- Reader tries to cache version 17

- Cache rejects because current version is 18

This requires coordination.

### Option 4: Use transactional outbox or event-based invalidation

More robust but complex.

### Option 5: Avoid caching highly contended mutable data

If correctness matters more than speed, maybe do not cache it.

The important lesson:

Caching is not just storing data. It is managing concurrent copies of truth.

# Local Cache vs Distributed Cache

Let us compare these two major cache placements.

## 30. Local Cache

Each application server has its own cache in memory.

### Architecture

\`\`\`text
[App Server 1] → [Local Cache 1]
[App Server 2] → [Local Cache 2]
[App Server 3] → [Local Cache 3]


\`\`\`
### Advantages

- fastest access,

- no network hop,

- simple to add,

- no external dependency.

### Disadvantages

- inconsistent across servers,

- duplicate memory usage,

- hard to invalidate globally,

- cold cache after restart,

- different servers may have different hit rates.

### Good uses

- tiny reference data,

- configuration,

- feature flags,

- per-process caches,

- very short-lived hot objects.

## 31. Distributed Cache

A shared cache service used by all application servers.

### Architecture

- [App Server 1] --\\

- [App Server 2] ---+--> [Distributed Cache]

- [App Server 3] --/

### Advantages

- shared view across servers,

- can be larger than one server memory,

- easier global invalidation,

- better hit rate if workload is shared,

- can survive individual app server restarts.

### Disadvantages

- network latency,

- operational complexity,

- cache cluster failure risk,

- hot keys can overload one node,

- serialization overhead.

### Good uses

- product pages,

- user sessions,

- API response caching,

- counters,

- shared feeds,

- rate limit counters.

## 32. Multi-Level Caching

Large systems often use multiple cache layers.

Example:

\`\`\`text
Browser cache
   ↓
CDN cache
   ↓
Application local cache
   ↓
Distributed cache
   ↓
Database

\`\`\`

A request may be served at the fastest layer that has valid data.

Advantages:

- very low latency for hot content,

- reduced load at each lower layer.

Disadvantages:

- complex invalidation,

- harder debugging,

- different layers may have different staleness.

Beginner rule:

Do not add five cache layers prematurely. Start with one well-designed cache layer.

# Redis and Memcached as Concepts

You may hear:

Use Redis for caching.

But the architectural concept is:

Use a fast shared key-value store as a distributed cache.

Redis and Memcached are examples of such stores.

## 33. What Is an In-Memory Key-Value Store?

### Simple explanation

It is a system that stores data in memory as keys and values.

It is optimized for fast lookups.

### Example:

- SET product:123 {...}

- GET product:123

### Why useful for caching

- fast reads,

- simple API,

- supports TTL,

- can be shared across servers,

- can store small objects or serialized data.

### Important caution

If the in-memory store loses data, the application should still be able to recover from the database.

For critical data, the database remains source of truth.

## 34. Redis Conceptually

Redis is often used as:

- cache,

- session store,

- rate limiter,

- queue,

- pub/sub system,

- small data store.

For caching, important features conceptually include:

- key-value storage,

- TTL,

- in-memory performance,

- optional persistence,

- data structures like strings, hashes, lists, sets, sorted sets.

Do not memorize Redis commands.

Understand the architectural role:

Redis can act as a shared fast cache layer between application servers and databases.

## 35. Memcached Conceptually

Memcached is a simpler distributed memory cache.

Common characteristics:

- key-value,

- in-memory,

- TTL,

- eviction,

- usually no persistence.

Architectural role:

Memcached can act as a shared cache for simple key-value objects.

Again, the concept matters more than the product.

# Caching and Consistency

Caching creates copies.

Copies can disagree.

This section teaches consistency thinking.

## 36. What Is Cache Consistency?

### Simple explanation

Cache consistency describes how closely cached data matches the source of truth.

### Perfect consistency

Cache always matches database.

Hard and expensive.

### Eventual consistency

Cache may be stale temporarily but becomes correct later.

Common and often acceptable.

### Stale-while-revalidate

Serve stale data immediately while refreshing it in the background.

Useful for performance.

Example:

- Cache entry age: 70 seconds

- TTL: 60 seconds

- Stale window: 30 seconds

- Request arrives

- Serve stale data now

- Trigger background refresh

- Next request may get fresh data

This avoids database spikes when popular entries expire.

## 37. Read-Your-Own-Writes with Cache

Problem:

User updates their profile.

System writes to database.

Cache still has old profile.

User immediately reloads page and sees old data.

Feels broken.

Solutions:

### Option 1: Invalidate cache on write

- Update DB

- Delete cache key

Next read gets fresh data.

### Option 2: Update cache on write

- Update DB

- Update cache

Careful with races.

### Option 3: Route recent user reads to database

For a short time after write, avoid cache for that user.

### Option 4: Include version in response and request

Client sends known version; cache/database ensures freshness.

### Option 5: Use local session cache

After write, store new value in user session or client state temporarily.

The right choice depends on how important freshness is.

## 38. When Strong Consistency Is Needed

Avoid aggressive caching or use careful invalidation for:

- authentication state,

- password changes,

- payment status,

- account balance,

- inventory reservation,

- legal documents,

- permission changes,

- security-critical configuration.

Example:

If an admin revokes a user’s permission, stale cached permissions may allow unauthorized access.

That is dangerous.

For such data:

- use short TTL,

- validate permissions at action time,

- avoid caching authorization decisions too broadly,

- use event-based invalidation,

- check source of truth for critical operations.

# Cache Stampede / Thundering Herd

A cache stampede happens when many requests miss the cache at the same time and all hit the database.

## 39. How It Happens

Imagine a popular product page.

Cache TTL is 60 seconds.

At second 60, the cache entry expires.

Suddenly 1,000 requests arrive.

All see cache miss.

All query database.

Database load spikes.

\`\`\`text
Cache expired
   ↓
Many concurrent misses
   ↓
All read database
   ↓
Database overloaded

\`\`\`

This is called:

- cache stampede,

- thundering herd,

- dog-piling.

## 40. Mitigations

### Option 1: Request coalescing / mutex

Only one request is allowed to rebuild the cache.

Others wait or receive stale data.

Conceptual flow:

- Request arrives

- Cache miss

- Try to acquire lock for key

- If lock acquired:

- read DB

- write cache

- release lock

- else:

- wait briefly or serve stale

Advantages:

- protects database.

Disadvantages:

- adds complexity,

- waiting requests may experience latency.

### Option 2: Stale-while-revalidate

Serve old data immediately.

Refresh in background.

- Cache entry expired but stale copy available

- Return stale copy

- Async worker refreshes cache

Advantages:

- low latency,

- avoids DB spike.

Disadvantages:

- users may see stale data.

### Option 3: Jittered TTL

Instead of all entries expiring at exactly 60 seconds, add randomness.

Example:

\`TTL = 60 seconds ± random 10 seconds\`

This spreads expiration over time.

Useful when many keys are created at once.

### Option 4: Refresh-ahead

Proactively refresh cache before expiry for known hot keys.

Example:

\`If entry is 80% through TTL, background job refreshes it.\`

Advantages:

- hot keys remain fresh.

Disadvantages:

- requires background infrastructure.

### Option 5: Limit concurrency to database

Use semaphores, rate limits, or queues to prevent too many simultaneous DB rebuilds.

# Hot Keys

A hot key is a cache key that receives unusually high traffic.

## 41. Examples

- viral tweet,

- celebrity profile,

- flash-sale product,

- breaking news article,

- popular video metadata,

- global configuration key.

## 42. Why Hot Keys Are Dangerous

In a distributed cache, data is often distributed by key hash.

If one key is extremely popular, all traffic for that key may go to one cache node.

- Cache Node 1: low load

- Cache Node 2: low load

- Cache Node 3: overloaded because hot key lives here

This can create a bottleneck even though the cache cluster overall has capacity.

## 43. Hot Key Mitigations

### Local cache

Add a small local cache in front of distributed cache for hot keys.

\`App Server local cache → distributed cache → database\`

If one app server gets many requests for hot key, local cache can absorb them.

But be careful with consistency.

### Key replication

Store hot key under multiple shuffled keys.

Example:

- product:123:shard0

- product:123:shard1

- product:123:shard2

Readers randomly choose one shard.

Writers invalidate/update all shards.

This spreads load across cache nodes.

### Precomputation

Render or assemble hot response ahead of time.

Example:

\`homepage:featured_product:123 → fully rendered JSON/HTML\`

### CDN caching

For public content, cache at edge near users.

### Rate limiting

Protect backend from abusive or excessive hot-key traffic.

# Caching and APIs

API design strongly affects caching.

You learned API design in Chapter 4.

Now connect it to caching.

## 44. GET Requests Are Cache-Friendly

GET requests usually read data.

They can often be cached.

Example:

\`GET /v1/products/123\`

may be cacheable.

But not always.

If response is private or highly personalized, caching must be careful.

## 45. POST, PUT, PATCH, DELETE Usually Require Invalidation

Write operations change data.

They often require cache invalidation.

Example:

\`\`\`text
PATCH /v1/products/123
{
  "price_cents": 3000
}

\`\`\`

After successful update:

- Invalidate product:123

- Invalidate related list caches if needed

## 46. Cache-Control Headers

HTTP headers can tell clients and intermediaries how to cache.

Examples:

- Cache-Control: public, max-age=60

- Cache-Control: private, max-age=30

- Cache-Control: no-store

- Cache-Control: no-cache

Meanings conceptually:

| Directive | Simple Meaning |
| --- | --- |
| public | May be cached by shared caches |
| private | Only cache in user-specific browser/client |
| max-age=60 | Valid for 60 seconds |
| no-cache | Must revalidate before using cached copy |
| no-store | Do not store response anywhere |

Be careful:

\`no-cache\` does not mean “do not cache.”

It means “do not use cached copy without checking if it is still valid.”

\`no-store\` is stronger.

## 47. ETag and Conditional Requests

An ETag is a version identifier for a resource.

Example response:

\`ETag: "v17"\`

Client later asks:

- GET /v1/products/123

- If-None-Match: "v17"

If unchanged, server returns:

\`304 Not Modified\`

No body sent.

This saves bandwidth.

ETags are useful for:

- browser caching,

- API clients,

- mobile apps,

- conditional fetches.

# Caching Computations, Not Just Data

Caches are not only for database rows.

They can store expensive computed results.

## 48. Examples

- recommended feed,

- search results,

- price calculations,

- tax estimates,

- machine learning predictions,

- rendered HTML,

- aggregated statistics,

- thumbnails,

- resized images,

- reports.

Example:

- recommendations:user:42 → list of product IDs

- TTL: 5 minutes

Instead of recomputing recommendations for every request, cache them.

But if user behavior changes rapidly, recommendations may become stale.

Trade-off again.

# Caching External Service Responses

If your backend calls a third-party API, caching can reduce:

- latency,

- cost,

- rate limit pressure,

- failure impact.

Example:

- weather:city:Berlin → API response

- TTL: 10 minutes

But external services may have their own caching rules and license restrictions.

Also consider:

- what if external API changes,

- what if response contains secrets,

- what if stale data is harmful.

# Caching Failure Paths

Caching can help during failures.

Example:

If database is slow or down, cache may still serve recent reads.

This is called graceful degradation.

But be careful:

- stale data may be misleading,

- write operations may need to fail or queue,

- authorization data should not be trusted too long during security incidents.

Example:

- During DB outage:

- - serve product pages from cache

- - block checkout

- - show “inventory may be outdated”

This is often better than total failure.

# Simple Example: TaskTracker Task Details

Suppose TaskTracker has:

\`GET /v1/tasks/{task_id}\`

Task details are read often and change occasionally.

Simple cache-aside design:

\`\`\`text
Key: task:{task_id}
Value: task JSON
TTL: 60 seconds

\`\`\`

Read flow:

\`\`\`text
Client requests task 123
App checks cache
If hit → return task
If miss → read DB
Store in cache
Return task

\`\`\`

Write flow:

- Client updates task 123

- App updates DB

- App deletes cache key task:123

- Return success

Next read repopulates cache.

This is enough for a small system.

Potential issues:

- race condition between read and write,

- related list caches may still be stale,

- if user updates and immediately reads, ensure invalidation works.

# Practical Example: Product Catalog

Consider an e-commerce product page.

Data:

- product name,

- description,

- price,

- images,

- category,

- rating,

- stock status.

Some data changes often:

- stock status,

- price during promotions.

Some data changes rarely:

- description,

- images,

- category.

A better caching strategy may separate concerns.

Example:

\`\`\`text
product_basic:123 → name, description, images, category
TTL: 1 hour

product_price:123 → current price, promotion info
TTL: 10 seconds

product_stock:123 → in_stock, quantity_bucket
TTL: 2 seconds or not cached if critical
product_rating:123 → average rating, count
TTL: 5 minutes

\`\`\`

The API server assembles the response from multiple cached pieces.

Advantages:

- rarely changing data cached longer,

- volatile data cached shorter or fetched fresh,

- invalidation scoped by data type.

Disadvantages:

- more keys,

- more complexity,

- partial staleness possible.

This is a realistic architectural pattern:

Do not cache a giant object if parts of it have different freshness requirements.

# Scaling Example

Suppose a product API receives:

\`10,000 reads/sec\`

Without cache, database handles:

\`10,000 reads/sec\`

With cache hit rate:

\`95%\`

Database handles:

\`10,000 × 5% = 500 reads/sec\`

That is a 20x reduction in database read load.

If peak traffic doubles to:

\`20,000 reads/sec\`

and hit rate remains 95%:

\`Database reads/sec = 1,000\`

Still manageable.

But if cache hit rate drops to 50%:

\`Database reads/sec = 10,000\`

The database may struggle.

So cache hit rate is a critical operational metric.

## Estimating Cache Memory

Suppose:

- Average cached product object = 2 KB

- Number of hot products to cache = 100,000

Approximate memory:

\`100,000 × 2 KB = 200,000 KB = 200 MB\`

Add overhead for metadata, fragmentation, and eviction.

Maybe plan for 300–500 MB.

If objects are 100 KB, memory becomes:

\`100,000 × 100 KB = 10,000,000 KB = 10 GB\`

So cache size depends heavily on value size.

Beginner lesson:

Do not cache huge objects casually. Large values consume memory and may reduce hit rate.

# Failure Scenario

Caching introduces failure modes.

Let us examine them.

## Failure 1: Cache Server Down

Architecture:

\`App → Cache → DB\`

If cache fails, all requests may miss.

Effect:

- database load spikes,

- latency increases,

- possible database overload.

Mitigations:

- cache cluster replication,

- circuit breaker around cache,

- fallback to database,

- rate limiting,

- local cache as first aid,

- load shedding for non-critical requests.

Important:

If cache is down, system should degrade, not collapse.

## Failure 2: Cache Returns Stale Data

Effect:

- user sees old price,

- user sees old stock,

- user sees old profile,

- admin sees old metrics.

Mitigations:

- shorter TTL,

- invalidation on write,

- event-based invalidation,

- versioned responses,

- separate volatile fields,

- avoid caching critical data.

## Failure 3: Cache Stampede

Effect:

- many simultaneous misses hit DB.

Mitigations:

- mutex/coalescing,

- stale-while-revalidate,

- jittered TTL,

- refresh-ahead,

- request limits.

## Failure 4: Hot Key Overloads One Cache Node

Effect:

- one node saturates,

- latency rises for that key,

- other nodes idle.

Mitigations:

- local cache,

- key replication/sharding,

- CDN,

- precomputation,

- isolate hot entities.

## Failure 5: Invalidation Event Lost

Example:

- DB updated

- Invalidation event fails to publish or consume

- Cache remains stale

Mitigations:

- TTL as safety net,

- retry events,

- dead-letter queue for failed invalidations,

- reconciliation jobs,

- version checks.

## Failure 6: Cache Poisoning

Bad data is written into cache.

Example:

- serialization bug,

- attacker-controlled input becomes key/value,

- wrong object stored under key,

- corrupted computed result.

Mitigations:

- validate data before caching,

- schema/version in cache values,

- avoid caching unsafe user input,

- namespace keys carefully,

- test serialization,

- ability to flush namespaces.

## Failure 7: Memory Exhaustion

Cache grows too large.

Effects:

- eviction increases,

- hit rate drops,

- application latency may increase,

- cache node may become unstable.

Mitigations:

- set memory limits,

- choose eviction policy,

- monitor hit rate and eviction rate,

- reduce value size,

- split caches,

- use compression if appropriate.

## Failure 8: Network Partition to Cache

App servers can reach database but not cache.

Effect:

- cache unavailable,

- fallback to DB.

Mitigation:

- timeouts,

- circuit breaker,

- degrade gracefully.

# Trade-Offs

Caching is full of trade-offs.

Let us make them explicit.

## Trade-Off 1: Cache vs No Cache

### No cache

Advantages:

- simpler,

- always reads source of truth,

- no invalidation complexity,

- fewer moving parts.

Disadvantages:

- slower,

- more database load,

- less scalable.

### Cache

Advantages:

- faster reads,

- lower DB load,

- better spike handling.

Disadvantages:

- staleness,

- invalidation complexity,

- extra infrastructure,

- new failure modes.

When to use cache:

- repeated reads,

- expensive reads,

- tolerable staleness,

- high traffic.

When not to cache:

- rarely read data,

- strongly consistent critical data,

- write-heavy data with little reuse,

- data where staleness is dangerous.

## Trade-Off 2: TTL vs Active Invalidation

### TTL only

Advantages:

- simple,

- robust,

- no write-path complexity.

Disadvantages:

- stale up to TTL.

### Active invalidation

Advantages:

- fresher data.

Disadvantages:

- complex,

- events can fail,

- races possible.

Often combine both:

\`Active invalidation + TTL safety net\`

## Trade-Off 3: Local Cache vs Distributed Cache

### Local

Fast but inconsistent.

### Distributed

Shared but network hop and operational complexity.

Hybrid:

- Local cache for very hot, short-lived data

- Distributed cache for shared consistency

## Trade-Off 4: Delete Cache vs Update Cache

### Delete

Simpler, safer, causes miss.

### Update

Avoids miss, but race-prone.

Default beginner recommendation:

Delete on write, unless you have a strong reason and careful concurrency control.

## Trade-Off 5: Cache Individual Objects vs Cache Whole Responses

### Objects

Reusable, easier invalidation.

### Whole responses

Faster for exact repeated requests, harder invalidation.

Use whole-response caching for:

- hot public pages,

- stable rendered content,

- CDN-cacheable assets.

Use object caching for:

- personalized APIs,

- entities with independent updates,

- services composing multiple objects.

## Trade-Off 6: Freshness vs Performance

More freshness:

- shorter TTL,

- more invalidation,

- more DB reads.

More performance:

- longer TTL,

- more caching,

- more staleness.

Ask:

What is the acceptable staleness for this data?

Examples:

| Data | Acceptable Staleness |
| --- | --- |
| Video view count | Seconds to minutes |
| Product description | Minutes to hours |
| Product price | Seconds, maybe zero for checkout |
| Inventory count | Very low or zero at purchase time |
| User permissions | Very low |
| Password reset state | Very low |
| Analytics dashboard | Minutes to hours |

## Trade-Off 7: Simplicity vs Hit Rate

A simple cache may cache whole objects with one TTL.

A complex cache may split fields, use multi-level caching, refresh-ahead, and per-key policies.

Complexity can improve hit rate and freshness, but increases bugs and operational cost.

Start simple.

Optimize when measurements justify it.

# Common Beginner Mistakes

## Mistake 1: Caching Everything

Not all data benefits from caching.

Bad candidates:

- rarely accessed data,

- highly volatile critical data,

- huge objects,

- write-heavy data with no reuse,

- data where staleness is dangerous.

Cache selectively.

## Mistake 2: Treating Cache as Source of Truth

If cache is the only place data exists, losing cache means losing data.

For important data:

- Database = source of truth

- Cache = copy

## Mistake 3: No TTL

If a cache entry never expires and invalidation fails, stale data may live forever.

Always have a safety TTL unless you have a very strong reason.

## Mistake 4: Bad Cache Keys

Example:

\`user_profile\`

instead of:

\`user_profile:42\`

or forgetting language, region, tenant, or version.

Bad keys cause wrong data delivery.

## Mistake 5: Ignoring Invalidation

Adding cache without deciding how it becomes invalid is dangerous.

Ask:

- What changes this data?

- Which keys must be invalidated?

- What if invalidation fails?

- What is the maximum acceptable staleness?

## Mistake 6: Caching Private Data in Shared Cache Without Authorization Awareness

Example:

\`GET /v1/me/profile\`

If cached under a global key without user context, one user may see another user’s data.

Keys must include user/tenant context when needed.

## Mistake 7: Updating Cache Before Database Write

Dangerous pattern:

- Update cache

- Update database

- Database fails

- Cache now contains data that never existed durably

Usually:

- Update database first

- Then invalidate/update cache

## Mistake 8: Not Handling Cache Failure

If cache is down, application should not crash.

It should fall back to database, with timeouts and protection.

## Mistake 9: No Monitoring

Monitor:

- hit rate,

- miss rate,

- latency,

- eviction rate,

- memory usage,

- error rate,

- hot keys,

- invalidation failures.

Without metrics, caching becomes guesswork.

## Mistake 10: Caching Huge Values

Large cache values:

- consume memory,

- increase network transfer,

- slow serialization,

- reduce hit rate.

Consider compressing, splitting, or caching references instead.

## Mistake 11: Forgetting Serialization Costs

Cache values often must be encoded/decoded.

JSON is convenient but may be large and slow.

Binary formats may be better for high-throughput caches.

But binary formats reduce debuggability.

Choose intentionally.

## Mistake 12: Using Cache as Queue or Database Replacement

A cache can store temporary state, but do not misuse it as:

- durable order store,

- message queue,

- primary database,

- audit log.

Use appropriate systems for those jobs.

# Deep Dive

Now we go deeper into practical caching design.

## Deep Dive 1: Designing Cache Keys

A cache key should encode all dimensions that affect the value.

Example:

Product page varies by:

- product_id,

- language,

- region,

- currency,

- user segment,

- device type,

- experiment bucket.

Possible key:

\`product:123:lang:en:region:US:currency:USD:segment:new_user:exp:A\`

This can become long.

Alternatives:

- hash parts of the key,

- split into multiple cached objects,

- avoid caching personalized variations,

- use version tokens.

Important:

If two requests can legitimately receive different values, they must not share the same cache key.

Otherwise one user may receive another user’s data.

## Deep Dive 2: Cache Namespaces

Use namespaces to group keys.

Examples:

- product:123

- user:42

- feed:user:42

- session:abc

- rate_limit:user:42

Namespaces help:

- debugging,

- bulk invalidation,

- access control,

- metrics,

- eviction policies.

Some caches support patterns or tag-based invalidation.

But pattern deletion can be expensive.

Design keys so invalidation does not require scanning huge key spaces.

## Deep Dive 3: Cache Value Versions

Include schema version in cached values.

Example:

\`\`\`text
{
  "schema_version": 3,
  "data": { ... }
}

\`\`\`

Why?

If your application changes object format, old cached values may break new code.

On read:

- If schema_version != expected:

- treat as miss

- rebuild from database

This prevents deserialization bugs.

## Deep Dive 4: TTL Jitter

If many keys are created at the same time, they may expire at the same time.

Example:

- All homepage modules cached at 12:00 with TTL 300 seconds

- All expire at 12:05

- Database spike

Add jitter:

\`TTL = base_ttl + random(-10%, +10%)\`

Example:

\`base 300s → actual 270–330s\`

This smooths expiration.

## Deep Dive 5: Request Coalescing

When many requests miss for the same key, allow only one to fetch from DB.

Conceptual:

- Request 1 misses cache, acquires lock, reads DB

- Request 2 misses cache, sees lock, waits or gets stale

- Request 1 writes cache

- Request 2 reads cache

Implementation can use:

- distributed lock,

- local single-flight,

- lease,

- async refresh.

Be careful with lock failures and timeouts.

## Deep Dive 6: Stale-While-Revalidate

Serve stale data while refreshing.

Conceptual cache value:

\`\`\`text
{
  "data": { ... },
  "stored_at": 1000,
  "fresh_until": 1060,
  "stale_until": 1090
}

\`\`\`

Request at time 1070:

- Data is stale but within stale window

- Return data now

- Trigger background refresh

This is useful for:

- feeds,

- recommendations,

- dashboards,

- product listings,

- public content.

## Deep Dive 7: Cache and Database Connection Pressure

Caching can reduce database connections if requests spend less time waiting for DB.

But cache misses can still create bursts.

During cache warmup after deployment or failure, many requests may miss simultaneously.

Mitigations:

- warm cache before traffic,

- gradual rollout,

- refresh-ahead,

- rate limits,

- connection pool tuning.

## Deep Dive 8: Multi-Tenant Caching

In multi-tenant systems, keys must include tenant.

Example:

- tenant:acme:product:123

- tenant:globex:product:123

Never rely only on application filters if cache key lacks tenant.

Otherwise one tenant may read another tenant’s cached data.

Also consider:

- per-tenant rate limits,

- per-tenant cache quotas,

- isolating huge tenants.

## Deep Dive 9: Caching Authorization Decisions

Authorization decisions are sensitive.

Example:

\`Can user 42 delete task 123?\`

Caching this for too long may allow revoked permissions to continue working.

Safer patterns:

- cache user roles with short TTL,

- cache resource ownership metadata,

- evaluate critical permissions at action time,

- invalidate on permission change,

- audit important decisions.

Do not cache “allowed” forever.

## Deep Dive 10: Cache Observability

Useful cache metrics:

| Metric | Why It Matters |
| --- | --- |
| Hit rate | Shows cache effectiveness |
| Miss rate | Shows DB pressure |
| Cache latency | Adds to request latency |
| Eviction rate | Indicates memory pressure |
| Key count | Capacity planning |
| Memory usage | Operational health |
| Error rate | Cache failures |
| Hot keys | Skew detection |
| Invalidation lag | Freshness risk |
| Stampede events | Spike detection |

Dashboards should answer:

- Is cache improving DB load?

- Is cache stale?

- Are hot keys causing skew?

- Are evictions hurting hit rate?

- Is cache failure degrading system?

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

Why can caching make a system faster but also make debugging harder?

Answer direction:

Caching reduces work by serving copies, but copies may be stale, inconsistent, or distributed across layers. When a user sees wrong data, the problem may be in cache, invalidation, serialization, key design, or source data. You must trace which layer served the response.

## Predict

Question:

A cache has TTL 5 minutes. A product price changes at 10:00. The cache entry was stored at 9:58. Invalidation fails. What happens?

Answer direction:

Users may see the old price until the cache expires at 10:03, assuming no other invalidation.

## Find the Bottleneck

Question:

A system has:

- 10,000 reads/sec

- Cache hit rate 30%

- Database slow

What is likely happening?

Answer direction:

Most requests still miss cache and hit database.

Possible causes:

- cache too small,

- poor key design,

- data too volatile,

- workload not cache-friendly,

- frequent evictions,

- cold cache.

## Find the Failure

Question:

The distributed cache crashes completely. Database is healthy but not sized for full traffic.

What should the application do?

Answer direction:

Fall back to database carefully:

- use timeouts,

- circuit breakers,

- rate limiting,

- serve degraded content,

- prioritize critical endpoints,

- avoid thundering herd.

## Compare

Question:

Which is safer for a product price cache?

Option A:

\`Update cache before database\`

Option B:

\`Update database, then delete cache\`

Answer direction:

Option B is safer.

Updating cache before DB risks caching data that never became durable.

Delete after DB is simpler and avoids caching uncommitted values, though races still need attention.

## Design This

Question:

Design caching for a user notification count.

Requirements:

- displayed frequently,

- changes when notifications arrive/read,

- short staleness acceptable,

- high read traffic.

Answer direction:

Possible key:

\`notif_count:user:42\`

Value:

\`\`\`text
{
  "unread_count": 7,
  "version": 123
}

\`\`\`

TTL:

\`30–60 seconds\`

Invalidation:

- increment/decrement counters on events,

- or delete cache on notification state change,

- use atomic counter if cache supports it,

- reconcile periodically with database.

If exact count is critical, avoid long TTL or store authoritative count in DB/cache with careful updates.

# Architecture Exercise

## Weak Design

A beginner adds caching to an API like this:

- [Client]

- |

- v

- [App Server]

- |

- v

- [Cache]

- |

- v

- [Database]

Rules:

- cache every GET response,

- TTL = 1 hour,

- no invalidation on writes,

- cache key is just URL path,

- includes user-specific data,

- no monitoring.

Example key:

\`/tasks\`

Value:

\`\`\`text
{
  "user_id": 42,
  "tasks": [...]
}

\`\`\`

## Your Task

Identify the problems.

Ask:

- Can one user see another user’s tasks?

- What happens when tasks change?

- What happens when data is personalized?

- What happens if cache grows too large?

- What happens if cache misses spike?

- How do you know if cache is working?

## Hint 1 — Key Design Hint

The key \`/tasks\` is not enough if response depends on authenticated user.

Use:

\`tasks:user:42:status:open:cursor:xyz\`

or similar.

## Hint 2 — Invalidation Hint

Writes must invalidate or update relevant keys.

If user creates/updates/deletes task, cached task lists may become stale.

## Hint 3 — TTL Hint

One hour may be too long for mutable user data.

Use shorter TTL or active invalidation.

## Hint 4 — Monitoring Hint

Track hit rate, latency, evictions, and errors.

Without metrics, you cannot know if cache helps or harms.

## Improved Design Direction

- [Client]

- |

- v

- [App Server]

- |

- +--> [Distributed Cache]

- |

- +--> [Database]

Cache keys:

- task:123

- tasks:user:42:status:open:cursor:xyz

TTL:

- task details: 60 seconds

- task lists: 10–30 seconds

Write flow:

- Update DB

- Delete task:123

- Delete or version user list caches

Add:

- negative caching for missing tasks,

- request coalescing for hot tasks,

- cache failure fallback,

- metrics.

# Design Exercise: Caching a Product Catalog

Design a caching strategy for an online product catalog.

System requirements:

- 1 million daily active users,

- 10 million product page views/day,

- 100,000 products,

- product descriptions change rarely,

- prices change occasionally,

- stock changes frequently,

- users may see personalized recommendations,

- read latency target p95 < 200 ms,

- database should not handle all product page reads.

Do not design full architecture.

Focus on caching.

## Step 1: Clarify What Can Be Cached

Ask:

- Is product page public or personalized?

- How stale can price be?

- How stale can stock be?

- Are recommendations user-specific?

- Do we need exact inventory at checkout?

Assume:

- basic product info is public,

- price may be slightly stale but not too stale,

- stock must be accurate near purchase time,

- recommendations are personalized,

- product descriptions rarely change.

## Step 2: Separate Data by Volatility

Do not cache one giant product object with one TTL.

Split:

- product_core:123

- product_price:123

- product_stock:123

- product_media:123

- product_reviews_summary:123

- recommendations:user:42

## Step 3: Suggested TTLs

| Cache Key | Example TTL | Reason |
| --- | --- | --- |
| product_core:123 | 1 hour | changes rarely |
| product_media:123 | 1 day or versioned | images rarely change |
| product_price:123 | 10–60 seconds | price important |
| product_stock:123 | 1–5 seconds or no cache for checkout | stock volatile |
| product_reviews_summary:123 | 5–15 minutes | aggregate can be stale |
| recommendations:user:42 | 1–10 minutes | personalized, changes with behavior |

Exact values depend on business requirements.

## Step 4: Cache Pattern

Use cache-aside for reads:

- App checks cache

- If hit, return

- If miss, read DB

- Store in cache

- Return

For writes:

- Update DB

- Delete affected cache keys

For price change:

- Delete product_price:123

- Delete related list caches if needed

For stock change:

- Delete product_stock:123

- Or use atomic counter with short TTL

- At checkout, verify stock from authoritative source

## Step 5: Handle Hot Products

For flash-sale product:

- add local cache with very short TTL,

- replicate hot key,

- use CDN for static product assets,

- precompute product page fragments,

- rate limit non-critical reads,

- use stale-while-revalidate for non-critical fields.

Checkout stock should not rely on stale cache.

## Step 6: Handle Cache Stampede

Popular product cache expires.

Use:

- jittered TTL,

- request coalescing,

- stale-while-revalidate for core data,

- refresh-ahead for known hot products.

## Step 7: Monitor

Track:

- hit rate by key type

- cache latency

- DB reads saved

- evictions

- hot keys

- invalidation lag

- error rate

Example:

If product_core hit rate is 98%, great.

If product_stock hit rate is 98% but users complain about wrong availability, TTL may be too long.

## Hint System

If you want to try before reading further:

### Hint 1 — Requirements Hint

Ask which data can tolerate staleness.

### Hint 2 — Architecture Hint

Split cache by volatility instead of caching one giant object.

### Hint 3 — Scaling Hint

Hot products need special handling: local cache, key replication, refresh-ahead.

### Hint 4 — Reliability Hint

Cache failure should fall back to DB with protection, not collapse.

## Final Solution Direction

A reasonable caching design:

- Clients

- |

- v

- CDN for static assets

- |

- v

- Load Balancer

- |

- +--> App Servers

- |

- +--> Local cache for very hot short-lived data

- |

- +--> Distributed cache

- |

- +--> Database

Cache keys:

\`\`\`text
product_core:{id}
product_price:{id}
product_stock:{id}
product_media:{id}
reviews_summary:{id}
recommendations:user:{id}

\`\`\`

Patterns:

- cache-aside reads,

- delete-on-write invalidation,

- TTL safety net,

- request coalescing for hot keys,

- stale-while-revalidate for non-critical data,

- authoritative stock check at checkout.

This balances speed, freshness, and complexity.

# Practice Questions

Try answering without rereading.

## Conceptual Questions

- What is a cache?

- What is a cache hit?

- What is a cache miss?

- What is hit rate?

- What is a cache key?

- What is a cache value?

- What is TTL?

- What is stale data?

- What is cache invalidation?

- What is eviction?

- What is LRU?

- What is local cache?

- What is distributed cache?

- What is cache-aside?

- What is read-through?

- What is write-through?

- What is write-back?

- What is negative caching?

- What is a cache stampede?

- What is a hot key?

- Why is delete-on-write often safer than update-on-write?

- What is stale-while-revalidate?

- What is jittered TTL?

- Why should cache values include schema version?

- Why must cache keys include user/tenant/language when relevant?

## Scenario Questions

### Question 1

A system has 10,000 reads/sec and 90% cache hit rate.

How many reads reach the database?

Answer:

\`10,000 × 10% = 1,000 reads/sec\`

### Question 2

A cache entry has TTL 300 seconds. Invalidation fails after a write.

What is worst-case staleness?

Answer:

\`Up to 300 seconds, depending on when entry was cached and when write occurred.\`

### Question 3

Many cache keys expire at the same time and database spikes.

What is this problem?

Answer:

\`Cache stampede or thundering herd.\`

### Question 4

One product receives 90% of cache traffic and overloads one cache node.

What is this problem?

Answer:

\`Hot key.\`

### Question 5

User updates profile and immediately sees old profile.

What consistency problem is this?

Answer:

\`Read-your-own-writes violation due to stale cache.\`

## Design Questions

### Question 1

Would you cache a user’s password hash?

Answer direction:

Usually no, not in a shared cache. Authentication should check authoritative store or secure session/token system. Caching password hashes can create security risk.

### Question 2

Would you cache a payment confirmation status?

Answer direction:

Only carefully. Payment status is critical. If cached, use very short TTL, strong invalidation, and verify authoritative status before irreversible actions.

### Question 3

Would you cache a public product description?

Answer direction:

Yes, often good. It changes rarely and is read often. Use TTL and invalidation on update.

### Question 4

Would you cache search results for a rare query?

Answer direction:

Maybe not. Rare queries may not benefit and can waste memory. Cache hot queries instead.

# Interview Questions

These are common beginner-to-intermediate system design interview questions.

## Question 1

Interviewer: What is caching and why do we use it?

Good answer direction:

Caching stores copies of data or computed results in a faster layer to reduce latency and avoid repeated expensive work. It is used to reduce database load, speed up reads, absorb traffic spikes, and improve user experience. The trade-off is staleness and invalidation complexity.

## Question 2

Interviewer: What happens on a cache miss?

Good answer direction:

The application reads from the source of truth, such as the database, then optionally stores the result in cache with a TTL before returning it. If many misses happen simultaneously, the database may be protected using coalescing, stale-while-revalidate, or rate limiting.

## Question 3

Interviewer: How do you invalidate a cache?

Good answer direction:

Common strategies are TTL expiry, delete-on-write, update-on-write, versioned keys, and event-based invalidation. Delete-on-write plus TTL is often a safe default. For complex systems, events can invalidate multiple cache layers, but require retry and monitoring.

## Question 4

Interviewer: What is a cache stampede and how do you prevent it?

Good answer direction:

A cache stampede occurs when many requests miss the cache at once and overload the backend. Prevention includes request coalescing, mutex/lock per key, stale-while-revalidate, jittered TTL, refresh-ahead, and limiting concurrent rebuilds.

## Question 5

Interviewer: What is a hot key?

Good answer direction:

A hot key is a cache key receiving disproportionate traffic. In distributed caches, it can overload one node. Mitigations include local caching, replicating the key across multiple cache keys, CDN caching, precomputation, and isolating hot entities.

## Question 6

Interviewer: Should you cache user-specific data?

Good answer direction:

Yes, but carefully. Cache keys must include user or tenant identity, and responses must not leak private data across users. Personalized data may have shorter TTL and stronger invalidation. Authorization should still be enforced at request time.

## Question 7

Interviewer: What is the difference between local and distributed cache?

Good answer direction:

Local cache lives inside each application server and is fastest but inconsistent across servers. Distributed cache is shared across servers, more consistent and scalable, but adds network latency and operational complexity. Large systems may use both.

## Question 8

Interviewer: When is caching a bad idea?

Good answer direction:

When data is rarely read, highly volatile, security-critical, requires strong consistency, or when staleness causes harm. Also avoid caching huge objects without need. Caching adds complexity; use it when benefits exceed costs.

## Question 9

Interviewer: How do you handle read-your-own-writes with caching?

Good answer direction:

Invalidate cache on write, update cache carefully with versioning, route recent user reads to primary, use session consistency, or return fresh data to client and avoid cached stale reads.

## Question 10

Interviewer: How do you measure whether caching is working?

Good answer direction:

Track hit rate, miss rate, cache latency, eviction rate, database load reduction, error rate, hot keys, and invalidation lag. Also measure user-visible latency and business metrics.

# Self-Check

Ask yourself honestly:

- Can I explain what a cache is in simple words?

- Can I explain cache hit, miss, TTL, eviction, and invalidation?

- Can I describe cache-aside read flow?

- Can I explain why delete-on-write is often preferred?

- Can I explain what stale data is and when it is acceptable?

- Can I design a cache key for user-specific data?

- Can I explain local vs distributed cache trade-offs?

- Can I describe a cache stampede and mitigations?

- Can I explain hot keys and how to reduce them?

- Can I decide whether a given piece of data should be cached?

- Can I explain how caching affects database load?

- Can I identify failure modes introduced by caching?

If you can answer most of these, you understand caching at a beginner-to-intermediate system design level.

If not, review:

- cache-aside,

- invalidation races,

- TTL vs invalidation,

- hot keys,

- cache stampede,

- and cache key design.

# DSA/Backend/Coding Connection

Caching connects strongly to data structures and algorithms.

| Programming Concept | Caching Connection |
| --- | --- |
| Hash map | Cache key-value lookup |
| LRU cache | Eviction policy |
| LFU cache | Frequency-based eviction |
| TTL timer | Expiration |
| Lock/mutex | Request coalescing |
| Queue | Background refresh jobs |
| Serializer/deserializer | Encoding cache values |
| Version vector | Cache consistency |
| Bloom filter | Negative caching / membership checks |
| Consistent hashing | Distributed cache key placement |
| Big-O complexity | Cache lookup vs database scan |

For example, a simple in-memory cache is often just a hash map plus TTL and eviction policy.

A distributed cache extends that idea across many machines.

Request coalescing uses locking ideas.

Cache invalidation uses versioning and event processing.

So caching is another place where system design is large-scale data structures.`,
    },
    {
      slug: "chapter-8-scaling-application-servers-and-load-balancing",
      title: "Chapter 8 — Scaling Application Servers and Load Balancing",
      summary: "Most beginner systems start like this: [Client] | v [One Server] | v [Database] That is perfectly fine for small traffic.",
      difficulty: "beginner",
      estimatedMinutes: 63,
      order: 7,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should understand:", "what an application server is,", "what limits a single application server has,", "why traffic growth creates bottlenecks,", "what vertical scaling is,", "what horizontal scaling is,", "what application state is,", "what a stateless server is,", "what a stateful server is,", "why stateless architecture is easier to scale,", "what a load balancer is,", "where a load balancer sits in the architecture,"],
      prerequisites: [],
      whereItFits: "Most beginner systems start like this: [Client] | v [One Server] | v [Database] That is perfectly fine for small traffic.",
      keyTakeaways: ["This chapter taught you how to scale the application server layer.", "You learned:", "an application server processes requests and applies business logic,", "single servers have CPU, memory, network, connection, and concurrency limits,", "vertical scaling makes one server bigger,", "horizontal scaling adds more servers,", "horizontal scaling requires request distribution and state management,", "stateless application servers are easier to scale,", "state should be externalized to databases, caches, tokens, or object storage,", "load balancers distribute traffic and improve fault tolerance,"],
      selfAssessment: ["Distribution", "Fault tolerance", "Health checking", "Single stable entry point", "TLS termination", "Routing", "Session affinity", "Observability"],
      content: `# Chapter 8 — Scaling Application Servers and Load Balancing

In Chapter 7, you learned how caching can reduce repeated database reads and make read-heavy systems faster.

But caching does not solve every scaling problem.

Suppose your application server itself becomes too slow.

Maybe it spends too much time:

- authenticating users,

- validating requests,

- parsing JSON,

- calling multiple services,

- rendering responses,

- handling file uploads,

- maintaining many open connections,

- running expensive computations.

In that case, even if the database is healthy and the cache is working well, users may still experience slow responses.

This chapter teaches you how to scale the application server layer.

You will learn:

- what an application server does,

- why one server eventually becomes insufficient,

- what vertical scaling means,

- what horizontal scaling means,

- why statelessness matters,

- how load balancers work,

- what reverse proxies do,

- how health checks help,

- how sessions complicate scaling,

- what sticky sessions are,

- how autoscaling works conceptually,

- and what trade-offs appear when you move from one server to many servers.

This is one of the most important chapters for understanding real backend architecture.

## Why This Matters

Most beginner systems start like this:

- [Client]

- |

- v

- [One Server]

- |

- v

- [Database]

That is perfectly fine for small traffic.

But real systems grow.

A product may start with:

\`100 users\`

Then:

\`10,000 users\`

Then:

\`1,000,000 users\`

At some point, one application server cannot handle all incoming requests quickly enough.

You need more servers.

But adding more servers is not as simple as copying the same program onto another machine.

You must answer questions like:

- How does a client know which server to contact?

- How do requests get distributed?

- What happens if one server fails?

- What happens if a user logs in on one server and the next request goes to another server?

- Where is session data stored?

- How do you know a server is healthy?

- How do you add servers during traffic spikes?

- How do you remove servers when traffic drops?

- How do you deploy new code without downtime?

- Does adding more application servers overload the database?

These are core system design questions.

Understanding application server scaling prepares you for almost every real backend architecture.

## Prerequisites

Before reading this chapter, you should understand:

- what a client is,

- what a server is,

- what a request and response are,

- what an API is,

- what HTTP is,

- what a database is,

- what caching is,

- basic traffic estimation,

- basic database scaling ideas.

If you have read Chapters 1–7, you are ready.

# Start With a Real-World Problem

Imagine TaskTracker again.

At first, it runs on one server:

- [Browser]

- |

- v

- [Task Server]

- |

- v

- [Database]

For a small team, this works.

Then the product grows.

Suppose TaskTracker now has:

- 1 million registered users

- 100,000 daily active users

- 20 requests per active user per day

From Chapter 3:

- Daily requests = 100,000 × 20

- = 2,000,000 requests/day

Average requests per second:

\`2,000,000 / 86,400 ≈ 23 requests/sec\`

With a peak factor of 5:

\`Peak requests/sec ≈ 115\`

At first glance, 115 requests per second may not sound enormous.

But each request may require work:

- authenticate user,

- parse JSON,

- validate input,

- check permissions,

- query database,

- check cache,

- serialize response,

- log metrics,

- maybe call another service.

If each request takes 100 ms of CPU time, then 115 requests per second may require:

\`115 × 0.1 CPU-seconds = 11.5 CPU-seconds per second\`

That means more than 11 CPU cores running continuously just for request processing.

If the server has only 4 CPU cores, it is overloaded.

Users see:

- slow responses

- timeouts

- failed saves

- spinning loaders

Now what?

One option is to make the server bigger.

Another option is to add more servers.

But if you add more servers, new problems appear.

For example:

- User logs in on Server 1.

- Server 1 creates a session in its local memory.

- Next request goes to Server 2.

- Server 2 does not know the session.

- User appears logged out.

This is why scaling application servers requires more than just adding machines.

You need:

- a way to distribute requests,

- a way to manage state,

- a way to detect failure,

- a way to scale safely.

That is what this chapter teaches.

# Intuition

Imagine a small coffee shop with one cashier.

One cashier can handle a few customers per minute.

But during rush hour, a line forms.

Customers wait longer.

Some leave.

The shop has two main options.

## Option 1: Make the cashier faster

Give the cashier:

- a better register,

- more help,

- faster equipment.

This is like vertical scaling.

## Option 2: Add more cashiers

Open multiple checkout counters.

This is like horizontal scaling.

But if you add multiple cashiers, you need someone or something to direct customers to an available counter.

That director is like a load balancer.

Now suppose each cashier keeps customer orders written on paper in their own pocket.

If a customer starts an order at Cashier 1 and then moves to Cashier 2, Cashier 2 has no idea what the customer ordered.

That is like server-local session state.

To make multiple cashiers work well, the shop needs:

- a shared order system,

- or a ticket that the customer carries,

- or a rule that the same cashier handles the same customer.

The first two options are usually better for scaling.

The last option can work, but it creates problems when a cashier leaves or the shop gets busy.

This is the core idea of application server scaling:

Multiple servers can handle more traffic, but only if requests can be distributed and state is managed correctly.

# Core Concept

Let us build the concept step by step.

## 1. What Does an Application Server Do?

An application server is the backend component that receives client requests and performs application work.

For TaskTracker, an application server may:

- receive HTTP requests,

- authenticate the user,

- validate input,

- enforce business rules,

- read from cache,

- read from or write to database,

- call other services,

- generate responses,

- log events,

- emit metrics.

Conceptually:

- [Client]

- |

- | request

- v

- [Application Server]

- |

- | reads/writes

- v

- [Data Stores / Services]

The application server is where much of the business logic lives.

It is not just a passive messenger between client and database.

It makes decisions.

## 2. Limits of One Application Server

A single server has finite resources.

Important limits include:

| Resource | What It Affects |
| --- | --- |
| CPU | Request parsing, authentication, serialization, computation |
| Memory | Active requests, local caches, connection buffers, application objects |
| Network bandwidth | Amount of data sent/received per second |
| Network connections | Number of simultaneous client connections |
| Disk I/O | Logging, temporary files, local storage |
| Thread/process limits | How many requests can be handled concurrently |
| File descriptor limits | How many open sockets/files the process can have |
| Database connection pool | How many simultaneous database connections the server can use |

A server may appear “healthy” on one metric but fail on another.

Example:

- CPU is low,

- memory is low,

- but all database connections are busy.

Then requests wait for connections, and latency increases.

So when scaling application servers, you must measure what is actually saturated.

## 3. Signs That the Application Server Is the Bottleneck

Suppose users complain that the app is slow.

You check metrics.

Possible signs of application server bottleneck:

| Symptom | Possible Meaning |
| --- | --- |
| CPU usage near 100% | Server is computationally saturated |
| Memory usage near limit | Too many active requests or memory leak |
| Request queue grows | Server cannot accept work fast enough |
| Latency rises while database latency is normal | App server is the bottleneck |
| Connection timeouts to app server | Server cannot accept new connections |
| Thread pool exhausted | Not enough worker threads/processes |
| High error rate from app server | Server overload or crash |

Important beginner lesson:

If the database is slow, adding more application servers may make things worse.

If the application server is slow, adding more application servers may help.

You must know which one is the bottleneck.

# Vertical Scaling

## 4. What Is Vertical Scaling?

### Simple explanation

Vertical scaling means making one server bigger.

### Formal term

Vertical scaling, scale up.

### Example

You change your application server from:

\`2 CPU cores, 4 GB RAM\`

to:

\`16 CPU cores, 64 GB RAM\`

Architecture before:

- [Clients]

- |

- v

- [Small App Server]

- |

- v

- [Database]

Architecture after:

- [Clients]

- |

- v

- [Bigger App Server]

- |

- v

- [Database]

### Advantages

- simple,

- no major code changes,

- no request distribution needed,

- no shared session problem,

- often quick to implement.

### Disadvantages

- limited by maximum hardware size,

- single point of failure remains,

- can become expensive,

- may require restart/downtime,

- does not solve all scalability problems.

### When vertical scaling is useful

Vertical scaling is useful when:

- the system is still small,

- the server is underpowered,

- you need a quick fix,

- the application is difficult to make stateless,

- you are not ready for distributed complexity.

### When vertical scaling is not enough

Vertical scaling may not be enough when:

- traffic continues to grow,

- availability requirements are high,

- one machine cannot handle peak load,

- you need fault tolerance,

- you need geographic distribution,

- you need independent scaling of components.

Important lesson:

Vertical scaling buys time, but it does not remove architectural limits.

# Horizontal Scaling

## 5. What Is Horizontal Scaling?

### Simple explanation

Horizontal scaling means adding more servers and distributing work among them.

### Formal term

Horizontal scaling, scale out.

### Example

Instead of one server, you use three:

- [Clients]

- |

- v

- [Load Balancer]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

- |

- v

- [Database]

### Advantages

- can handle more traffic,

- can improve fault tolerance,

- can scale incrementally,

- can use cheaper commodity machines,

- can support autoscaling.

### Disadvantages

- more complex,

- requires request distribution,

- requires state management,

- requires health checks,

- requires deployment strategy,

- can increase load on database/cache,

- more things can fail.

### Key idea

Horizontal scaling is powerful, but it forces you to solve new problems:

- Where does session state live?

- How do requests reach the right server?

- How do you detect failed servers?

- How do you add/remove servers safely?

- How do you avoid overloading downstream systems?

This is why statelessness and load balancing are so important.

# Application State

## 6. What Is State?

### Simple explanation

State is information the system remembers between requests.

### Formal term

Application state, session state, server state.

### Examples

For a web application, state may include:

- logged-in session,

- shopping cart,

- partially completed form,

- user preferences,

- temporary upload progress,

- CSRF token,

- in-memory cache,

- local file uploads,

- active WebSocket connection,

- rate limit counters.

HTTP itself is stateless.

That means each HTTP request is independent unless the application adds context.

So backends create state by using:

- cookies,

- tokens,

- session IDs,

- database records,

- cache entries,

- client storage,

- service-to-service context.

## 7. Stateful vs Stateless Servers

This is one of the most important concepts in backend scaling.

### Stateful server

A stateful server stores information locally in memory or on local disk that is needed for future requests.

Example:

- Server 1 memory:

- session_id_abc → user_id 42

If the next request from that user goes to Server 2, Server 2 may not know the session.

This makes horizontal scaling harder.

### Stateless server

A stateless server does not require local memory from previous requests to handle a new request.

Any server can handle any request, as long as the request contains enough information or the server can access shared state.

Example:

- Client sends token

- Any server validates token

- Server reads user data from database/cache

- Server responds

The server itself does not need to remember the user between requests.

Important clarification:

Stateless does not mean the system has no state.

It means the application server does not rely on local state between requests.

The state still exists somewhere:

- database,

- cache,

- object storage,

- token,

- external service.

## 8. Why Stateless Architecture Is Easier to Scale

Stateless servers are easier to scale because:

- any server can handle any request,

- failed servers can be replaced,

- new servers can be added easily,

- load balancers can distribute traffic freely,

- deployments can roll servers one by one,

- autoscaling becomes simpler.

Compare:

### Stateful architecture problem

- User logs in

- Server 1 stores session locally

- Next request

- Load balancer sends to Server 2

- Server 2 does not know session

- Failure

### Stateless architecture solution

- User logs in

- Server issues token or stores session in shared store

- Next request

- Any server validates token or reads shared session

- Success

This is a major architectural advantage.

## 9. Common Ways to Handle State

There are several common patterns.

### Pattern 1: Store state in the database

Example:

- sessions

- --------

- session_id

- user_id

- created_at

- expires_at

- data

Advantages:

- durable,

- shared across servers,

- easy to reason about.

Disadvantages:

- database load,

- latency,

- not ideal for very frequent short-lived state.

Use for:

- important session data,

- auditability,

- long-lived state.

### Pattern 2: Store state in a distributed cache

Example:

- session:abc123 → { user_id: 42, csrf_token: "..." }

- TTL: 30 minutes

Advantages:

- fast,

- shared,

- natural expiration.

Disadvantages:

- cache may lose data,

- operational complexity,

- not always durable.

Use for:

- sessions,

- temporary tokens,

- rate limit counters,

- short-lived workflow state.

### Pattern 3: Store state on the client

Example:

- JWT,

- signed cookie,

- client-side token.

Advantages:

- server does not store session,

- scales well,

- reduces shared state dependency.

Disadvantages:

- hard to revoke,

- token size,

- security complexity,

- client may tamper if not signed/encrypted properly.

Use for:

- stateless APIs,

- mobile apps,

- short-lived access tokens.

### Pattern 4: Sticky sessions

Force the same user to always go to the same server.

Advantages:

- can keep local session state,

- easy migration from single-server app.

Disadvantages:

- server failure logs users out,

- scaling and rebalancing become harder,

- load may become uneven,

- deployment is harder.

Use sparingly.

Sticky sessions are often a workaround, not a long-term solution.

# Load Balancers

## 10. What Is a Load Balancer?

### Simple explanation

A load balancer is a component that receives client requests and distributes them across multiple servers.

### Formal term

Load balancer.

### Basic architecture

- [Clients]

- |

- v

- [Load Balancer]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

The load balancer provides a single entry point.

Clients do not need to know how many servers exist.

They connect to:

\`api.tasktracker.example\`

DNS points that name to the load balancer.

The load balancer forwards requests to healthy backend servers.

## 11. Problems a Load Balancer Solves

A load balancer helps with:

### 1. Distribution

It spreads traffic across servers.

Without it, clients would need to know server addresses.

### 2. Fault tolerance

If one server fails, the load balancer can stop sending traffic to it.

### 3. Health checking

It can detect unhealthy servers.

### 4. Single stable entry point

Clients use one domain/IP even if backend servers change.

### 5. TLS termination

It can handle HTTPS certificates and decrypt traffic before forwarding internally.

### 6. Routing

It can route different paths to different services.

Example:

- /api/tasks → Task Service

- /api/payments → Payment Service

### 7. Session affinity

It can optionally send the same client to the same server when needed.

### 8. Observability

It can log requests, metrics, and errors at the edge.

## 12. What a Load Balancer Does Not Solve

A load balancer is not magic.

It does not solve:

- slow database queries,

- bad application code,

- missing indexes,

- improper caching,

- stateful session problems,

- downstream service overload,

- traffic spikes beyond total backend capacity.

If all app servers are slow because the database is saturated, the load balancer cannot fix that.

It only distributes requests.

## 13. Load Balancing Algorithms

A load balancer must choose which server receives each request.

Common algorithms include:

### Round Robin

Send requests to servers in order.

\`\`\`text
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1

\`\`\`

Advantages:

- simple,

- fair for equal-sized requests.

Disadvantages:

- ignores server load,

- ignores request cost,

- may overload a server with expensive requests.

Use when:

- servers are similar,

- request cost is roughly equal.

### Weighted Round Robin

Assign weights based on server capacity.

Example:

- Server 1 weight 5

- Server 2 weight 3

- Server 3 weight 2

More capable servers receive more traffic.

Advantages:

- supports mixed server sizes.

Disadvantages:

- still does not react dynamically to current load.

Use when:

- servers have different capacities.

### Least Connections

Send new requests to the server with the fewest active connections.

Advantages:

- adapts to current load,

- useful when requests have varying durations.

Disadvantages:

- requires connection tracking,

- may not account for CPU/memory saturation.

Use when:

- request durations vary significantly.

### Least Response Time

Send requests to servers with lowest recent latency.

Advantages:

- responsive to real performance.

Disadvantages:

- more complex,

- may create feedback loops if not tuned.

Use when:

- latency matters and load balancer can measure it safely.

### IP Hash

Use client IP to decide which server receives the request.

Example:

\`hash(client_ip) % number_of_servers\`

Advantages:

- same client often reaches same server.

Disadvantages:

- NAT/proxies can make many clients appear from one IP,

- load may be uneven,

- server changes can disrupt mappings.

Use carefully.

### Consistent Hashing

A more advanced hashing method where adding/removing servers affects only a small portion of mappings.

Used often in:

- distributed caches,

- sharding,

- some load balancing scenarios.

You do not need to master it now.

The important idea:

Consistent hashing reduces disruption when the set of servers changes.

## 14. Sticky Sessions

### Simple explanation

Sticky sessions mean the load balancer tries to send all requests from the same user to the same server.

### Why used

Because that server may have local session state.

### Example

\`\`\`text
User logs in → Server 1
Server 1 stores session locally
Load balancer sticks user to Server 1


\`\`\`
### Advantages

- allows legacy stateful applications to scale somewhat,

- easy to enable in some load balancers.

### Disadvantages

- if Server 1 fails, user session may be lost,

- load balancing becomes less flexible,

- scaling out/in becomes harder,

- deployments become harder,

- hot servers possible.

### Beginner rule

Prefer stateless design or shared session storage over sticky sessions.

Sticky sessions may be acceptable temporarily, but they often become an architectural smell.

# Layer 4 vs Layer 7 Load Balancing

## 15. What Is Layer 4 Load Balancing?

Layer 4 refers to the transport layer, such as TCP or UDP.

A Layer 4 load balancer makes decisions based on:

- source IP,

- destination IP,

- source port,

- destination port.

It usually does not understand HTTP paths or headers.

### Advantages

- fast,

- simple,

- low overhead.

### Disadvantages

- cannot route by URL path,

- cannot inspect HTTP headers,

- limited health checking beyond connection success.

### Example

- Client connects to load balancer port 443

- Load balancer forwards TCP connection to backend server port 8080

## 16. What Is Layer 7 Load Balancing?

Layer 7 refers to the application layer, such as HTTP.

A Layer 7 load balancer understands:

- HTTP method,

- URL path,

- headers,

- cookies,

- host name,

- response status codes.

### Advantages

- route by path/host,

- better health checks,

- TLS termination,

- request rewriting,

- header injection,

- rate limiting,

- can retry certain requests,

- can serve error pages.

### Disadvantages

- more CPU/memory overhead,

- more complex.

### Example

\`\`\`text
/api/tasks → Task Service
/api/payments → Payment Service
/admin → Admin Service

\`\`\`

Many modern cloud load balancers and reverse proxies support Layer 7 features.

# Reverse Proxies

## 17. What Is a Reverse Proxy?

### Simple explanation

A reverse proxy is a server that sits in front of backend servers and receives client requests on their behalf.

### Formal term

Reverse proxy.

### Basic diagram

- [Clients]

- |

- v

- [Reverse Proxy]

- |

- +--> [Backend Server 1]

- +--> [Backend Server 2]

- +--> [Backend Server 3]

A reverse proxy appears to clients as the server.

Clients do not directly contact backend servers.

## 18. Forward Proxy vs Reverse Proxy

This distinction confuses beginners.

### Forward proxy

Sits on the client side.

It represents clients.

Example:

\`[Client] → [Forward Proxy] → [Internet]\`

Used for:

- corporate filtering,

- client anonymity,

- bypassing restrictions,

- caching outbound traffic.

### Reverse proxy

Sits on the server side.

It represents servers.

Example:

\`[Internet] → [Reverse Proxy] → [Backend Servers]\`

Used for:

- load balancing,

- TLS termination,

- routing,

- caching static assets,

- hiding backend details,

- request logging.

For backend system design, reverse proxies are much more common.

## 19. What a Reverse Proxy Can Do

A reverse proxy may:

- terminate TLS,

- compress responses,

- cache static files,

- route requests by path,

- add/remove headers,

- enforce rate limits,

- provide basic authentication,

- hide backend server identities,

- log requests,

- return standard error pages.

Example headers added:

- X-Forwarded-For: client_ip

- X-Forwarded-Proto: https

- X-Request-ID: req_12345

These headers help backend servers understand the original request context.

## 20. Load Balancer vs Reverse Proxy

These terms overlap.

A simple way to think:

| Component | Primary Focus |
| --- | --- |
| Load balancer | Distribute traffic across multiple servers |
| Reverse proxy | Receive requests on behalf of servers and forward them |

Many systems use a device/service that does both.

For example:

\`Client → Reverse proxy/load balancer → App servers\`

Conceptually:

- If the main job is distribution, call it a load balancer.

- If the main job is routing/edge handling, call it a reverse proxy.

- In practice, the same software may do both.

# Health Checks

## 21. What Is a Health Check?

### Simple explanation

A health check is a test used to determine whether a server is able to handle traffic.

### Formal term

Health check.

### Example

A load balancer periodically asks each app server:

- GET /health HTTP/1.1

- Host: app-server-1

If the server returns:

\`200 OK\`

it is considered healthy.

If it times out or returns an error, it may be marked unhealthy.

## 22. Liveness vs Readiness

These terms are common in modern systems.

### Liveness

Is the process running?

Example:

\`Can the server respond at all?\`

If liveness fails, the system may restart the server.

### Readiness

Is the server ready to accept traffic?

Example:

- Has it loaded configuration?

- Can it connect to required dependencies?

- Is it warmed up?

If readiness fails, the load balancer should not send traffic to it.

## 23. What Should a Health Check Include?

This depends on the system.

A basic health check may verify:

- process is running,

- HTTP server responds,

- required configuration loaded.

A readiness check may verify:

- database connection works,

- cache connection works,

- critical dependencies available,

- migration state is compatible.

But be careful.

If a health check depends on every downstream service, a minor dependency issue may remove all servers from rotation and cause a larger outage.

Common pattern:

- /health/live

- - very lightweight

- - does not check dependencies

- /health/ready

- - checks dependencies needed to serve traffic

## 24. Health Check Failure Modes

Health checks can cause problems if poorly configured.

### Too aggressive

Servers are marked unhealthy during temporary spikes.

Effect:

- flapping,

- reduced capacity,

- cascading failures.

### Too slow

Failed servers remain in rotation for too long.

Effect:

- users see errors.

### Too heavy

Health check itself overloads server.

Effect:

- health checks cause performance problems.

Good health checks are:

- fast,

- meaningful,

- appropriately timed,

- separated by purpose.

# Sessions and Scaling

## 25. What Is a Session?

A session is a way for a server to recognize a user across multiple requests.

Example:

- User logs in.

- Server creates session_id = abc123.

- Browser stores session_id in a cookie.

- Future requests include cookie.

- Server looks up abc123 and knows the user.

Conceptual:

\`session:abc123 → { user_id: 42, logged_in_at: ... }\`

## 26. Why Sessions Complicate Horizontal Scaling

If session data lives only in one server’s memory, then requests must go to that same server.

Problem:

- [Client]

- |

- v

- [Load Balancer]

- |

- +--> [Server 1] stores session locally

- +--> [Server 2] does not know session

If the load balancer sends the next request to Server 2, the user may appear logged out.

This is why horizontal scaling requires shared or client-held state.

## 27. Session Storage Options

Let us compare common approaches.

### Option A: In-memory session on one server

- Server memory:

- session_id → user data

Advantages:

- simple,

- fast.

Disadvantages:

- does not scale horizontally,

- server failure loses sessions,

- deployment disrupts sessions.

Use only for single-server systems or development.

### Option B: Sticky sessions

Load balancer sends same user to same server.

Advantages:

- allows local session memory,

- easier migration.

Disadvantages:

- server failure loses session,

- uneven load,

- scaling/deployment harder.

Use as a temporary measure.

### Option C: Shared session store

Sessions stored in database or distributed cache.

- App Server 1 --\\

- App Server 2 ---+--> [Session Store]

- App Server 3 --/

Advantages:

- any server can handle request,

- server failure does not necessarily lose session,

- easier horizontal scaling.

Disadvantages:

- extra network hop,

- session store becomes dependency,

- needs expiration/cleanup.

Common choice for browser sessions.

### Option D: Client-side token

Server gives client a token. Client sends token with each request.

Example:

\`Authorization: Bearer token_value\`

Advantages:

- server can be stateless,

- scales well,

- no shared session store required for validation if token is self-contained.

Disadvantages:

- revocation is harder,

- tokens can be large,

- security design matters,

- logout may require additional mechanisms.

Common for APIs and mobile apps.

### Option E: Hybrid

Short-lived access token plus refresh token or server-side session record.

Example:

- Access token: 15 minutes

- Refresh token/session record: stored server-side

Advantages:

- scalable,

- revocable,

- good security balance.

Disadvantages:

- more complex.

Many real systems use hybrid approaches.

# Autoscaling

## 28. What Is Autoscaling?

### Simple explanation

Autoscaling means automatically adding or removing servers based on load.

### Formal term

Autoscaling.

### Example

During low traffic:

\`2 app servers\`

During peak traffic:

\`10 app servers\`

After peak:

\`scale back to 2 or 3 servers\`

## 29. Why Autoscaling Is Useful

Autoscaling helps with:

- traffic spikes,

- cost efficiency,

- fault tolerance,

- operational automation,

- predictable capacity management.

Without autoscaling, you must manually predict peak capacity and keep servers running all the time.

That may be expensive or insufficient.

## 30. Scaling Metrics

Autoscalers need signals.

Common metrics:

| Metric | Meaning |
| --- | --- |
| CPU utilization | How busy processors are |
| Memory utilization | How full memory is |
| Requests per second | Incoming load |
| Average latency | Response slowdown |
| p95/p99 latency | Tail slowdown |
| Queue length | Backlog of pending work |
| Connection count | Active client connections |
| Custom application metric | Domain-specific load |

CPU is common but not always best.

A server may have low CPU but be blocked waiting for database responses.

In that case, latency or connection count may be better scaling signals.

## 31. Scale-Out and Scale-In

### Scale-out

Add more servers.

Used when load increases.

### Scale-in

Remove servers.

Used when load decreases.

Scale-in must be careful.

If you remove servers too aggressively, the next traffic spike may overload the remaining servers.

## 32. Cold Starts

A cold start happens when a new server begins handling traffic but is not yet ready.

Possible causes:

- application startup time,

- loading configuration,

- connecting to databases,

- warming caches,

- compiling JIT code,

- loading models,

- establishing connection pools.

During cold start, the server may be slow.

Mitigations:

- readiness checks,

- warm pools,

- pre-warming,

- gradual traffic shifting,

- minimum instance count.

## 33. Autoscaling Does Not Fix Everything

Autoscaling can add more application servers, but it cannot fix:

- a saturated database,

- a slow external API,

- missing indexes,

- memory leaks,

- inefficient algorithms,

- hot keys,

- connection pool exhaustion.

If the bottleneck is downstream, autoscaling app servers may make the problem worse.

Example:

- Database is slow.

- Autoscaler adds 20 app servers.

- Each app server opens database connections.

- Database collapses.

So autoscaling must be designed with downstream capacity in mind.

# Mental Model

A useful mental model is:

- Clients

- |

- v

- DNS

- |

- v

- Load Balancer / Reverse Proxy

- |

- +--> App Server 1

- +--> App Server 2

- +--> App Server 3

- |

- +--> Cache

- |

- +--> Database

- |

- +--> Other Services

The application tier becomes a pool of interchangeable workers.

Each server should be able to handle any request, assuming it can access shared state and dependencies.

# Architecture Diagram

Let us evolve the architecture step by step.

## Stage 1: Single Server

- [Client]

- |

- v

- [App Server]

- |

- v

- [Database]

Good for:

- development,

- tiny systems,

- low traffic.

Problems:

- single point of failure,

- limited capacity.

## Stage 2: Vertical Scaling

- [Client]

- |

- v

- [Bigger App Server]

- |

- v

- [Database]

Good for:

- quick growth,

- simple systems.

Problems:

- still single point of failure,

- limited maximum size.

## Stage 3: Multiple Servers Without Load Balancer

- [Client]

- |

- +--> [App Server 1]

- |

- +--> [App Server 2]

This is usually bad.

Problems:

- clients need to know server addresses,

- no central health checking,

- no easy failover,

- session state becomes difficult.

## Stage 4: Load Balanced Servers

- [Client]

- |

- v

- [Load Balancer]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

- |

- v

- [Database]

Now:

- clients use one entry point,

- traffic is distributed,

- failed servers can be removed,

- capacity can grow.

But if servers are stateful, session problems remain.

## Stage 5: Stateless Servers with Shared State

- [Client]

- |

- v

- [Load Balancer]

- |

- +--> [App Server 1] --\\

- +--> [App Server 2] ---+--> [Cache / Session Store]

- +--> [App Server 3] --/          |

- v

- [Database]

Now any app server can handle any request.

This is a robust horizontal scaling pattern.

## Stage 6: With Caching and Monitoring

- [Client]

- |

- v

- [Load Balancer / Reverse Proxy]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

- |

- +--> [Distributed Cache]

- |

- +--> [Database]

- |

- +--> [Metrics / Logs / Traces]

This resembles a realistic production system.

# Step-by-Step Request Flow

Let us trace a request in a load-balanced stateless architecture.

Suppose a user requests:

\`GET /v1/tasks?status=open\`

## Step 1: Client Resolves DNS

The client resolves:

\`api.tasktracker.example\`

DNS returns the load balancer IP address.

## Step 2: Client Opens HTTPS Connection

The client connects to the load balancer over HTTPS.

TCP and TLS handshakes happen.

The load balancer may terminate TLS.

## Step 3: Load Balancer Selects a Healthy Server

The load balancer checks which backend servers are healthy.

It chooses one using its algorithm, for example:

- least connections,

- round robin,

- weighted routing.

## Step 4: Load Balancer Forwards Request

The load balancer forwards the HTTP request to the selected app server.

It may add headers:

- X-Forwarded-For: client_ip

- X-Forwarded-Proto: https

- X-Request-ID: req_12345

These headers help the backend understand the original client and correlate logs.

## Step 5: App Server Authenticates Request

The app server reads the authentication token or session reference.

Example:

\`Authorization: Bearer token123\`

It validates the token or looks up session data in a shared store.

## Step 6: App Server Applies Business Logic

The server checks:

- is the user allowed to view tasks?

- what filters are requested?

- what pagination is needed?

- what fields should be returned?

## Step 7: App Server Reads Cache

The server may check:

\`tasks:user:42:status:open:cursor:xyz\`

If cache hit, it returns quickly.

If cache miss, it continues to database.

## Step 8: App Server Reads Database

The server queries the database using an appropriate index.

Example:

\`\`\`text
SELECT task_id, title, status, created_at
FROM tasks
WHERE owner_user_id = 42
  AND status = 'open'
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;

\`\`\`

## Step 9: App Server Builds Response

The server serializes data to JSON.

Example:

\`\`\`text
{
  "items": [
    {
      "task_id": "123",
      "title": "Study system design",
      "status": "open"
    }
  ],
  "next_cursor": "abc",
  "has_more": true
}

\`\`\`

## Step 10: Response Travels Back

The app server sends the response to the load balancer.

The load balancer sends it to the client.

If TLS was terminated at the load balancer, the internal connection may be plain HTTP or encrypted separately, depending on design.

## Step 11: Failure During Request

If the selected app server fails mid-request:

- the client may see a timeout or error,

- the load balancer may mark the server unhealthy,

- future requests go to other servers,

- retry behavior depends on method and idempotency.

For safe GET requests, retry may be acceptable.

For POST requests, retry must be careful to avoid duplicates.

# Simple Example: Two App Servers and Shared Session Store

Suppose a small web app has:

\`50,000 daily users\`

One app server is becoming slow.

The team adds a second server.

But the app stores login sessions in local memory.

Problem:

- User logs in on Server 1.

- Next request goes to Server 2.

- Server 2 says: not logged in.

Solution:

Move sessions to a shared store.

Architecture:

- [Browser]

- |

- v

- [Load Balancer]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- |

- v

- [Session Store / Cache]

- |

- v

- [Database]

Now either server can handle the request.

This is a simple but important scaling step.

# Practical Example: Mobile App API

Mobile apps often use token-based authentication.

Example login:

\`\`\`text
POST /v1/auth/login
{
  "email": "",
  "password": "secret"
}

\`\`\`

Response:

\`\`\`text
{
  "access_token": "eyJ...",
  "expires_in": 900
}

\`\`\`

Future requests:

- GET /v1/tasks

- Authorization: Bearer eyJ...

The API servers can be stateless because the token carries or references identity.

Architecture:

- [Mobile App]

- |

- v

- [Load Balancer]

- |

- +--> [API Server 1]

- +--> [API Server 2]

- +--> [API Server 3]

- |

- +--> [Cache]

- |

- +--> [Database]

Benefits:

- any server can handle any request,

- servers can be added/removed,

- mobile clients can retry safely if APIs are idempotent,

- deployments can roll servers gradually.

Concerns:

- token revocation,

- token expiry,

- refresh tokens,

- secure storage on device,

- rate limiting.

But from a scaling perspective, stateless tokens are powerful.

# Practical Example: E-Commerce Checkout

E-commerce systems often have stateful workflows:

- shopping cart,

- shipping address,

- payment step,

- order confirmation.

A naive design may store cart state in app server memory.

That does not scale well.

Better options:

## Option 1: Store cart in database/cache

\`cart:user:42 → items\`

Any server can read/update the cart.

## Option 2: Store cart ID on client

Client has:

\`cart_id=cart_987\`

Any server loads cart from shared store.

## Option 3: Use checkout session service

A dedicated service manages checkout state.

Architecture:

- [Browser]

- |

- v

- [Load Balancer]

- |

- +--> [Web Server 1]

- +--> [Web Server 2]

- |

- +--> [Cart Service / Session Store]

- |

- +--> [Payment Service]

- |

- +--> [Database]

Important:

Checkout must avoid duplicate orders.

That requires idempotency, which you learned in API design.

Scaling app servers does not remove the need for safe retries.

# Scaling Example

Suppose TaskTracker grows significantly.

## Initial State

- 100,000 DAU

- 23 average RPS

- 115 peak RPS

- 1 app server

- 1 database

One app server may be enough if requests are cheap.

## Growth Stage

- 1,000,000 DAU

- 230 average RPS

- 1,150 peak RPS

Now one app server may struggle, especially if each request causes multiple database queries or external calls.

You add load balancer and multiple app servers:

- [Client]

- |

- v

- [Load Balancer]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

- |

- v

- [Database]

But now the database may receive more concurrent connections.

If each app server has a connection pool of 20 connections:

\`3 servers × 20 connections = 60 database connections\`

If you scale to 30 servers:

\`30 × 20 = 600 database connections\`

The database may not handle that many connections efficiently.

So app server scaling must be coordinated with:

- database connection limits,

- connection pooling,

- caching,

- read replicas,

- query optimization.

This is a crucial lesson:

Scaling one layer can expose bottlenecks in another layer.

# Failure Scenario

Let us examine failures in a load-balanced application tier.

## Failure 1: One App Server Crashes

Architecture:

\`\`\`text
[Client]
   |
   v
[Load Balancer]
   |
   +--> [App Server 1]  ← crashes
   +--> [App Server 2]
   +--> [App Server 3]

\`\`\`

Effect:

- requests already on Server 1 may fail,

- new requests can be routed to Server 2 and 3.

Mitigation:

- health checks,

- automatic removal from pool,

- retry safe requests,

- monitoring/alerting,

- replacement server launched.

If the app is stateless, recovery is easier.

## Failure 2: Load Balancer Crashes

Architecture:

\`\`\`text
[Client]
   |
   v
[Load Balancer] ← single point of failure
   |
   +--> [App Server 1]
   +--> [App Server 2]

\`\`\`

Effect:

- entire system becomes unreachable even if app servers are healthy.

Mitigation:

- redundant load balancers,

- cloud-managed load balancer with high availability,

- DNS failover,

- multiple entry points.

Important lesson:

Adding a load balancer improves backend server resilience, but the load balancer itself can become a single point of failure.

## Failure 3: App Server Is Slow but Not Dead

A server may respond to health checks but be overloaded.

Symptoms:

- high latency,

- timeouts,

- queue buildup.

Mitigation:

- readiness checks based on load,

- least-connections routing,

- circuit breaking at dependency level,

- autoscaling,

- rate limiting,

- load shedding.

This is harder than detecting a completely dead server.

## Failure 4: Session Store Fails

Architecture:

\`App Servers → Session Store\`

If session store fails:

- users may appear logged out,

- requests may fail,

- system may become unusable.

Mitigation:

- replicate session store,

- use durable backing store where needed,

- fallback to re-authentication,

- short-lived tokens,

- monitoring and failover.

This shows why shared state introduces new dependencies.

## Failure 5: Sticky Session Server Fails

If users are stuck to Server 1 and Server 1 fails:

- all users on that server lose sessions,

- traffic shifts unevenly,

- recovery may cause login storm.

Mitigation:

- avoid sticky sessions,

- use shared session store,

- use client tokens,

- gradual rebalancing.

## Failure 6: Autoscaling Adds Servers Too Slowly

Traffic spikes suddenly.

Autoscaler takes minutes to launch new servers.

During that time:

- existing servers overload,

- latency rises,

- errors increase.

Mitigation:

- maintain headroom,

- scheduled scaling for known events,

- warm pools,

- faster startup images,

- rate limiting/queueing.

## Failure 7: Autoscaling Adds Servers Too Quickly and Overloads Database

New app servers open database connections and issue queries.

Database becomes bottleneck.

Mitigation:

- connection pool limits,

- database proxy/pooler,

- gradual traffic shifting,

- scale based on downstream health,

- cache warmup.

## Failure 8: Health Check Flapping

Servers alternate between healthy and unhealthy.

Effect:

- traffic keeps moving,

- requests fail,

- load balancer instability.

Causes:

- health check too strict,

- temporary GC pauses,

- dependency blips,

- network jitter.

Mitigation:

- tune thresholds,

- use consecutive failure counts,

- separate liveness/readiness,

- make health checks lightweight.

# Trade-Offs

Application server scaling is full of trade-offs.

## Trade-Off 1: Vertical Scaling vs Horizontal Scaling

### Vertical scaling

Advantages:

- simple,

- no distributed state problem,

- quick.

Disadvantages:

- limited,

- single point of failure,

- expensive at high end.

When to use:

- small systems,

- early growth,

- legacy stateful apps,

- quick emergency fix.

### Horizontal scaling

Advantages:

- more scalable,

- better fault tolerance,

- supports autoscaling.

Disadvantages:

- complex,

- requires load balancing,

- requires state management.

When to use:

- growing traffic,

- high availability requirements,

- modern stateless services.

## Trade-Off 2: Statelessness vs Statefulness

### Stateless

Advantages:

- easy scaling,

- easier failover,

- simpler deployment.

Disadvantages:

- may require shared stores or tokens,

- some workflows become more complex.

### Stateful

Advantages:

- can be simpler for some local workflows,

- may reduce external lookups.

Disadvantages:

- hard to scale,

- failure loses state,

- sticky sessions may be needed.

Beginner rule:

Make the application tier stateless unless you have a strong reason not to.

## Trade-Off 3: Sticky Sessions vs Shared Session Store

### Sticky sessions

Advantages:

- easy to enable,

- works with local memory sessions.

Disadvantages:

- failure-sensitive,

- scaling inflexible,

- load imbalance.

### Shared session store

Advantages:

- any server can handle request,

- better fault tolerance,

- easier autoscaling.

Disadvantages:

- extra dependency,

- network latency,

- store must be highly available.

Preferred:

Shared session store or token-based statelessness.

## Trade-Off 4: Client Tokens vs Server Sessions

### Client tokens

Advantages:

- scalable,

- no server session lookup required if self-contained.

Disadvantages:

- revocation hard,

- token size,

- security complexity.

### Server sessions

Advantages:

- easy revocation,

- smaller client identifier.

Disadvantages:

- session store dependency,

- extra lookup.

Many systems use hybrid:

\`short-lived access token + server-side refresh/session record\`

## Trade-Off 5: Load Balancer vs DNS Round Robin

### DNS round robin

DNS returns multiple server IPs.

Advantages:

- simple,

- no dedicated load balancer.

Disadvantages:

- no real health checking,

- clients cache DNS,

- hard to failover quickly,

- no request-level routing.

### Load balancer

Advantages:

- health checks,

- dynamic routing,

- TLS termination,

- better operational control.

Disadvantages:

- extra component,

- possible single point of failure if not made highly available.

For production systems, load balancers are usually preferable.

## Trade-Off 6: Layer 4 vs Layer 7 Load Balancing

### Layer 4

Advantages:

- fast,

- simple.

Disadvantages:

- less routing intelligence.

### Layer 7

Advantages:

- HTTP-aware routing,

- better health checks,

- header manipulation,

- TLS termination.

Disadvantages:

- more resource usage.

Use Layer 7 when you need application-aware routing.

Use Layer 4 when raw transport distribution is enough.

## Trade-Off 7: Autoscaling vs Fixed Capacity

### Fixed capacity

Advantages:

- predictable,

- simpler,

- no cold start surprises.

Disadvantages:

- may waste money during low traffic,

- may fail during unexpected spikes.

### Autoscaling

Advantages:

- cost efficient,

- handles variable load,

- improves resilience.

Disadvantages:

- complexity,

- cold starts,

- may amplify downstream bottlenecks.

Use autoscaling when traffic varies and the system is stateless enough to benefit.

# Common Beginner Mistakes

## Mistake 1: Adding App Servers When Database Is the Bottleneck

If the database is slow, more app servers can increase load.

Symptom:

- App servers have free CPU

- Database CPU/I/O saturated

- Latency increases when adding app servers

Fix:

- optimize queries,

- add indexes,

- cache,

- replicas,

- connection pooling.

## Mistake 2: Storing Sessions in Local Memory and Scaling Horizontally

This causes random logout behavior.

Fix:

- shared session store,

- tokens,

- database-backed sessions.

## Mistake 3: Using Sticky Sessions as the Main Scaling Strategy

Sticky sessions may hide statelessness problems.

They make failure and deployment harder.

Fix:

- externalize state.

## Mistake 4: No Health Checks

Load balancer sends traffic to dead or broken servers.

Fix:

- add liveness/readiness checks.

## Mistake 5: Health Check Is Too Heavy

Health check itself overloads servers.

Fix:

- make health checks lightweight.

## Mistake 6: Ignoring Connection Limits

Each app server may open many database connections.

Scaling app servers can exhaust database connections.

Fix:

- connection pools,

- database proxy,

- limit pool sizes,

- monitor connections.

## Mistake 7: Assuming JWT Means Completely Stateless

JWT may reduce server session storage, but the system may still have state:

- refresh tokens,

- revocation lists,

- user data,

- permissions,

- rate limits.

Be precise.

## Mistake 8: Autoscaling Based Only on CPU

A server may be blocked on I/O while CPU is low.

Fix:

- use latency, queue length, connection count, or custom metrics.

## Mistake 9: No Load Shedding or Rate Limiting

During overload, accepting all requests can cause collapse.

Fix:

- rate limit,

- return 429/503,

- prioritize critical endpoints,

- shed low-priority work.

## Mistake 10: Not Testing Failure

Teams add load balancers and autoscaling but never test server failure.

Fix:

- kill a server in staging,

- verify traffic shifts,

- verify sessions/tokens still work,

- verify database connections do not explode.

# Deep Dive

Now we go deeper into important concepts.

## Deep Dive 1: What “Stateless” Really Means

A stateless service does not store client-specific state in local memory between requests.

But it may still:

- read/write database,

- use cache,

- call other services,

- emit logs,

- maintain metrics.

Example:

- Request includes user token.

- Server validates token.

- Server loads user data from database.

- Server returns response.

- Server forgets the request.

The server did stateful work, but it did not rely on local memory from previous requests.

This distinction is important.

## Deep Dive 2: Thread-Per-Request and Concurrency

Many simple servers use a thread or process per request.

Conceptual:

\`Incoming request → assign worker thread → process → respond\`

Limits:

- too many threads consume memory,

- context switching costs CPU,

- thread pool exhaustion causes queuing.

Modern servers may use:

- worker pools,

- event loops,

- async I/O,

- green threads/coroutines.

You do not need to implement these now.

The system design lesson:

Application servers have concurrency limits. Scaling horizontally often means increasing total concurrency capacity.

## Deep Dive 3: Connection Draining

When removing a server from service, you should not kill it immediately if it is processing requests.

Connection draining means:

- stop sending new requests to the server,

- allow existing requests to finish,

- then shut down.

This is important during:

- deployments,

- autoscale-in,

- maintenance.

Without draining, users may see abrupt errors.

## Deep Dive 4: TLS Termination at Load Balancer

A load balancer may terminate TLS:

\`Client --HTTPS--> Load Balancer --HTTP--> App Server\`

Advantages:

- certificates managed in one place,

- less CPU on app servers,

- easier routing.

Disadvantages:

- internal traffic may be unencrypted unless protected separately.

More secure pattern:

\`Client --HTTPS--> Load Balancer --HTTPS/mTLS--> App Server\`

or use private network plus internal encryption.

Security details come later, but understand the architectural choice.

## Deep Dive 5: X-Forwarded Headers

When a load balancer forwards requests, the app server may see the load balancer IP as the client IP.

To preserve original client information, proxies add headers:

- X-Forwarded-For: client_ip, proxy_ip

- X-Forwarded-Proto: https

- X-Forwarded-Host: api.tasktracker.example

App servers and logs can use these headers.

But be careful:

- only trust these headers from known proxies,

- otherwise attackers may spoof them.

## Deep Dive 6: Request IDs and Observability

A good load balancer or reverse proxy can generate a request ID:

\`X-Request-ID: req_12345\`

This ID is passed to app servers, logs, traces, and responses.

It helps answer:

Which log lines belong to this user request?

In distributed systems, request IDs are extremely valuable.

## Deep Dive 7: Health Check Endpoints

Example:

- GET /health/live

- GET /health/ready

Live:

\`\`\`text
{
  "status": "ok"
}

\`\`\`

Ready:

\`\`\`text
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "cache": "ok"
  }
}

\`\`\`

Do not expose sensitive dependency details publicly.

Internal readiness may include more detail.

## Deep Dive 8: Load Balancer as a Single Point of Failure

A load balancer can become the new bottleneck or SPOF.

Mitigations:

- use cloud-managed highly available LB,

- run redundant load balancers,

- use DNS failover,

- use anycast or multiple entry points,

- monitor LB capacity.

But note:

High availability of the LB does not make the whole system highly available if backend servers or database are single points of failure.

## Deep Dive 9: Warm Pools and Pre-Warming

If new servers take time to become ready, keep a warm pool of initialized servers.

Example:

- Minimum 3 ready servers

- Burst capacity pre-initialized but not receiving full traffic

This reduces cold-start impact during spikes.

## Deep Dive 10: Scaling Based on Latency

CPU-based autoscaling may be too late.

Latency-based autoscaling can react earlier.

Example:

\`If p95 latency > 500 ms for 2 minutes, scale out.\`

But latency-based scaling must avoid oscillation.

Use:

- stabilization windows,

- cooldown periods,

- min/max bounds.

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

Why can adding more application servers sometimes make a system worse?

Answer direction:

If the bottleneck is downstream, such as the database, more app servers can create more concurrent queries and connections, increasing pressure and causing worse latency or failure.

## Predict

Question:

A system has two app servers behind a load balancer. Sessions are stored in local memory. User logs in and request lands on Server 1. Next request lands on Server 2. What happens?

Answer direction:

Server 2 does not know the session. The user may appear logged out or receive 401 Unauthorized.

## Find the Bottleneck

Question:

Metrics show:

- App server CPU: 95%

- Database CPU: 20%

- Cache hit rate: 95%

- Latency: high

Where is the bottleneck?

Answer direction:

Application server CPU is saturated. Horizontal scaling of app servers may help, assuming database and cache remain healthy.

## Find the Failure

Question:

A load balancer is the only entry point and it fails. Backend servers are healthy. What happens?

Answer direction:

Clients cannot reach the system. The load balancer is a single point of failure.

## Compare

Question:

Which is better for horizontal scaling?

Option A:

\`Sessions stored in app server memory + sticky sessions\`

Option B:

\`Sessions stored in shared cache + stateless app servers\`

Answer direction:

Option B is generally better. It allows any server to handle any request and survives individual server failure more gracefully.

## Design This

Question:

You have three app servers and a login system. How would you allow users to stay logged in regardless of which server handles the request?

Answer direction:

Use one of:

- shared session store,

- database-backed sessions,

- signed tokens,

- hybrid token system.

Avoid relying on local memory unless using sticky sessions as a temporary workaround.

# Architecture Exercise

## Weak Design

A startup deploys two app servers and uses DNS round robin:

- [Client]

- |

- v

- DNS returns Server 1 or Server 2 IP

- |

- +--> [App Server 1]

- +--> [App Server 2]

- |

- v

- [Database]

Sessions are stored in local memory.

There are no health checks.

There is no load balancer.

There is no monitoring.

## Your Task

Identify the problems.

Ask:

- What happens if Server 1 crashes?

- What happens if a user’s session is on Server 1 but DNS sends them to Server 2?

- How do clients know which server is healthy?

- What happens during deployment?

- What happens if one server is slow?

- Can you scale to five servers easily?

## Hint 1 — State Hint

Local sessions prevent free request distribution.

## Hint 2 — Health Hint

DNS round robin does not know whether a server is healthy.

Clients may keep trying failed servers.

## Hint 3 — Entry Point Hint

A load balancer or reverse proxy provides a single stable entry point and active health checking.

## Hint 4 — Observability Hint

Without monitoring, you will discover failures from users.

## Improved Design Direction

- [Client]

- |

- v

- [Load Balancer / Reverse Proxy]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

- |

- +--> [Shared Session Store / Cache]

- |

- +--> [Database]

- |

- +--> [Monitoring / Logs]

Add:

- health checks,

- stateless or shared-state sessions,

- connection pooling,

- autoscaling if traffic varies,

- request IDs,

- alerts.

This is more robust and scalable.

# Design Exercise: Scaling TaskTracker Application Tier

Let us practice a full application-tier scaling design.

## Problem

TaskTracker has:

- 10 million registered users

- 1 million daily active users

- 20 requests per active user per day

- 90% reads

- 10% writes

- Peak factor 5x

Estimate:

- Daily requests = 1,000,000 × 20 = 20,000,000

- Average RPS = 20,000,000 / 86,400 ≈ 231

- Peak RPS ≈ 231 × 5 = 1,157

Suppose each app server can comfortably handle 300 requests/sec with current code and dependencies.

How many app servers are needed for peak?

Rough estimate:

\`1,157 / 300 ≈ 3.86\`

So at least 4 servers, plus headroom.

Maybe 5 or 6 servers.

But the real design is not just counting servers.

You must design the application tier properly.

## Step 1: Clarify Requirements

Questions to ask:

- What availability target?

- Are sessions required?

- Do users upload files?

- Are there long-lived connections?

- What p95 latency target?

- Does the system experience spikes?

- Is it multi-region?

- What downstream dependencies exist?

Assume:

- 99.9% availability,

- p95 latency under 300 ms,

- browser and mobile clients,

- login sessions required,

- no real-time WebSocket in this exercise,

- single region initially,

- database and cache already scaled reasonably.

## Step 2: Functional Requirements

Application servers must handle:

- authentication,

- task CRUD,

- project CRUD,

- comments,

- user profile,

- notifications API,

- search API maybe.

## Step 3: Non-Functional Requirements

- handle peak 1,200 requests/sec,

- survive individual app server failure,

- allow zero-downtime deployments,

- maintain user sessions,

- protect database from connection overload,

- provide observability.

## Step 4: Make Application Servers Stateless

Move state out of local memory.

Options:

### Session handling

Use shared session store or token-based auth.

For browser sessions:

\`session:{session_id} → user_id, csrf_token, expires_at\`

stored in distributed cache.

For mobile/API:

\`Authorization: Bearer access_token\`

with short-lived access token and refresh token stored server-side if revocation is needed.

### File uploads

Do not store uploaded files on local app server disk.

Use object storage.

### Temporary workflow state

Store in cache/database, not local memory.

## Step 5: Add Load Balancer

Architecture:

- [Clients]

- |

- v

- [Load Balancer]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

- +--> [App Server 4]

- +--> [App Server 5]

- |

- +--> [Distributed Cache / Session Store]

- |

- +--> [Database]

Load balancer responsibilities:

- single entry point,

- TLS termination,

- health checks,

- request distribution,

- basic routing,

- request IDs.

## Step 6: Configure Health Checks

Add:

- GET /health/live

- GET /health/ready

Ready check may verify:

- app process running,

- config loaded,

- cache reachable,

- database reachable,

- connection pool initialized.

Use conservative thresholds to avoid flapping.

## Step 7: Tune Connection Pools

Each app server should have bounded database connection pool.

Example:

\`5 app servers × 20 DB connections = 100 connections\`

If autoscaling to 20 servers:

\`20 × 20 = 400 connections\`

Ensure database can handle that, or use a connection pooler/proxy.

Also limit:

- HTTP client connections to downstream services,

- thread pool sizes,

- request concurrency.

## Step 8: Add Autoscaling

Policy example:

- Minimum: 4 app servers

- Maximum: 20 app servers

- Scale out if:

- - CPU > 70% for 3 minutes, or

- - p95 latency > 500 ms for 2 minutes

- Scale in if:

- - CPU < 30% for 10 minutes

- Cooldown: 5 minutes

But also consider:

- database capacity,

- cache capacity,

- cold starts,

- scheduled events.

## Step 9: Handle Failure

If one app server fails:

- load balancer stops routing to it,

- remaining servers handle traffic,

- autoscaler may replace it.

If session store fails:

- users may need to re-login,

- critical APIs may degrade,

- alert immediately.

If database fails:

- app servers may become unhealthy,

- readiness checks may fail,

- system should degrade gracefully,

- do not let all servers crash-loop.

## Step 10: Add Observability

Monitor:

- RPS per server,

- latency p50/p95/p99,

- error rate,

- CPU/memory,

- connection pool usage,

- cache hit rate,

- database latency,

- health check failures,

- autoscaling events.

Use request IDs to trace requests across load balancer, app servers, cache, and database.

## Hint System

If you want to try before reading the solution:

### Hint 1 — Requirements Hint

Ask about sessions, latency, availability, and downstream limits.

### Hint 2 — Architecture Hint

Use load balancer + stateless app servers + shared session store.

### Hint 3 — Scaling Hint

Estimate server count from peak RPS and per-server capacity, but add headroom.

### Hint 4 — Reliability Hint

Health checks, redundant LB, connection limits, and monitoring are necessary.

## Final Solution Direction

A reasonable application-tier design:

- [Clients]

- |

- v

- [Highly Available Load Balancer / Reverse Proxy]

- |

- +--> [App Server 1]

- +--> [App Server 2]

- +--> [App Server 3]

- +--> [App Server 4]

- +--> [App Server 5]

- |

- +--> [Distributed Cache / Session Store]

- |

- +--> [Database]

- |

- +--> [Object Storage for files]

- |

- +--> [Monitoring / Logs / Traces]

Key properties:

- stateless app servers,

- shared session/cache,

- health checks,

- bounded connection pools,

- autoscaling with guardrails,

- request IDs,

- graceful degradation,

- monitoring and alerts.

This design can handle individual app server failures and traffic growth, provided the database and cache are also scaled appropriately.

# Practice Questions

Try answering without rereading.

## Conceptual Questions

- What is an application server?

- What resources can bottleneck an application server?

- What is vertical scaling?

- What is horizontal scaling?

- What is application state?

- What does stateless mean?

- Why are stateless servers easier to scale?

- What is a load balancer?

- What problems does a load balancer solve?

- What problems does a load balancer not solve?

- What is a reverse proxy?

- How is a reverse proxy different from a forward proxy?

- What is a health check?

- What is the difference between liveness and readiness?

- What are sticky sessions?

- Why are sticky sessions problematic?

- What is a session store?

- What is autoscaling?

- What is a cold start?

- Why can adding app servers overload a database?

## Scenario Questions

### Question 1

A system has high app server CPU and low database CPU.

What scaling option is likely useful?

Answer direction:

Horizontal scaling of app servers, possibly vertical scaling, after confirming code efficiency.

### Question 2

A system has low app server CPU but high database CPU.

Will adding app servers help?

Answer direction:

Usually no. It may worsen database load.

### Question 3

Users randomly appear logged out.

What is a likely cause?

Answer direction:

Session state stored in local server memory while requests go to different servers.

### Question 4

A load balancer marks a server unhealthy, then healthy, then unhealthy repeatedly.

What is this called?

Answer direction:

Health check flapping.

### Question 5

Traffic spikes at 9 AM every weekday.

What scaling strategy may help?

Answer direction:

Scheduled scaling or autoscaling with headroom.

# Interview Questions

These are common beginner-to-intermediate system design interview questions.

## Question 1

Interviewer: What is the difference between vertical and horizontal scaling?

Good answer direction:

Vertical scaling means making one server bigger. Horizontal scaling means adding more servers and distributing work across them. Vertical scaling is simpler but limited and often remains a single point of failure. Horizontal scaling is more complex but usually more flexible and resilient.

## Question 2

Interviewer: Why is statelessness important for scaling application servers?

Good answer direction:

Stateless servers do not rely on local memory between requests, so any server can handle any request. This makes load balancing, failover, autoscaling, and deployments easier. State still exists, but it is stored in shared systems like databases, caches, or tokens.

## Question 3

Interviewer: What does a load balancer do?

Good answer direction:

A load balancer provides a single entry point and distributes requests across healthy backend servers. It can perform health checks, terminate TLS, route traffic, and improve fault tolerance. It does not fix bottlenecks in backend services or databases.

## Question 4

Interviewer: What are sticky sessions and why are they usually not ideal?

Good answer direction:

Sticky sessions route the same client to the same server, often because session state is stored locally. They can work temporarily, but they make failover, scaling, and deployments harder because server failure can lose session state and load distribution becomes less flexible.

## Question 5

Interviewer: How would you handle user sessions across multiple app servers?

Good answer direction:

I would externalize session state into a shared session store such as a distributed cache or database, or use token-based authentication. For browser apps, shared sessions are common. For APIs/mobile, short-lived tokens with refresh mechanisms may be better.

## Question 6

Interviewer: What is the difference between a load balancer and a reverse proxy?

Good answer direction:

A load balancer focuses on distributing traffic across multiple servers. A reverse proxy receives requests on behalf of backend servers and forwards them, often adding routing, TLS termination, header manipulation, and caching. In practice, the same component may perform both roles.

## Question 7

Interviewer: What health checks would you configure for app servers?

Good answer direction:

I would separate liveness and readiness. Liveness checks whether the process is running. Readiness checks whether the server can safely accept traffic, including dependencies like database/cache if appropriate. Checks should be lightweight and tuned to avoid flapping.

## Question 8

Interviewer: Can autoscaling solve all performance problems?

Good answer direction:

No. Autoscaling can add capacity, but if the bottleneck is a slow database, bad queries, hot keys, or an overloaded dependency, adding app servers may make things worse. Autoscaling works best when the application tier is stateless and downstream systems have capacity.

## Question 9

Interviewer: A system becomes slower after adding more app servers. What might be happening?

Good answer direction:

The bottleneck may be downstream, such as the database. More app servers can increase concurrent connections and queries, exhausting database resources. I would check database latency, connection counts, lock contention, and cache hit rate.

## Question 10

Interviewer: What is the difference between Layer 4 and Layer 7 load balancing?

Good answer direction:

Layer 4 load balancing works at the transport level, routing TCP/UDP connections based on IP/port. Layer 7 load balancing understands application protocols like HTTP and can route by path, host, headers, or cookies. Layer 7 is more flexible but may use more resources.

# Self-Check

Ask yourself honestly:

- Can I explain why one server becomes insufficient?

- Can I compare vertical and horizontal scaling?

- Can I explain what stateless means?

- Can I explain why local sessions break horizontal scaling?

- Can I describe what a load balancer does?

- Can I explain sticky sessions and their drawbacks?

- Can I describe health checks and why they matter?

- Can I explain how sessions can be shared across servers?

- Can I describe autoscaling and its risks?

- Can I explain why adding app servers may overload a database?

- Can I design a basic load-balanced stateless application tier?

- Can I identify failure scenarios in a multi-server architecture?

If you can answer most of these, you are ready to continue.

If not, review:

- stateless vs stateful,

- load balancing algorithms,

- session storage options,

- health checks,

- and autoscaling trade-offs.

# DSA/Backend/Coding Connection

Application server scaling connects to programming and backend development in several ways.

| Programming Concept | System Design Connection |
| --- | --- |
| Function statelessness | Stateless services |
| Thread pools | Server concurrency limits |
| Queues | Request buffering, backpressure |
| Hash maps | Session stores, caches |
| TTL | Session expiration |
| Locks | Concurrency and shared state |
| Serialization | Request/response handling |
| Connection pools | Database/client resource limits |
| Load balancing | Distributing work across workers |
| Health checks | Monitoring and readiness |
| Big-O complexity | Expensive endpoints saturate servers |

For example, a backend function that stores user session data in a local dictionary is like a stateful server.

If you move that dictionary to Redis or a database, you are externalizing state.

If you make multiple workers read from the same store, you are simulating horizontal scaling.

System design often feels large, but many ideas mirror concurrency, state management, and resource limits from programming.`,
    },
    {
      slug: "chapter-9-asynchronous-systems-and-message-queues",
      title: "Chapter 9 — Asynchronous Systems and Message Queues",
      summary: "Imagine a user signs up for your application.",
      difficulty: "beginner",
      estimatedMinutes: 66,
      order: 8,
      tags: "system-design,backend,architecture,scalability",
      learningObjectives: ["By the end of this chapter, you should understand:", "what synchronous processing means,", "what asynchronous processing means,", "why waiting inside a request can be dangerous,", "what a message queue is,", "what a producer is,", "what a consumer is,", "what a message is,", "what a message broker is,", "what a background job is,", "what an event is,", "what publish/subscribe means,"],
      prerequisites: [],
      whereItFits: "Imagine a user signs up for your application.",
      keyTakeaways: ["This chapter taught you asynchronous systems and message queues.", "The central problem is:", "Some work is too slow, too unreliable, too bursty, or too decoupled to perform directly inside a user request.", "Queues help by allowing:", "producers to send messages,", "brokers to store/deliver messages,", "consumers/workers to process messages later,", "APIs to respond quickly,", "systems to retry failures,", "components to scale independently,"],
      selfAssessment: ["Deduplication table", "Business uniqueness", "State machine guard", "Upsert with version", "External idempotency key"],
      content: `# Chapter 9 — Asynchronous Systems and Message Queues

In Chapter 8, you learned how to scale the application server layer using:

- stateless servers,

- load balancers,

- health checks,

- shared session stores,

- autoscaling.

That helped you scale the part of the system that receives requests and returns responses.

But many real backend systems do more than just answer requests immediately.

They also need to perform work such as:

- sending emails,

- generating thumbnails,

- resizing images,

- transcoding videos,

- processing payments,

- updating search indexes,

- sending push notifications,

- writing analytics events,

- reconciling data,

- exporting reports,

- notifying third-party systems.

Some of this work is slow.

Some of it depends on external services.

Some of it can fail temporarily.

Some of it arrives in bursts.

If all of this work happens directly inside the user’s request, the system can become slow, fragile, and hard to scale.

This chapter teaches you how asynchronous systems and message queues solve those problems.

You will learn:

- what synchronous processing is,

- what asynchronous processing is,

- why queues exist,

- what producers and consumers are,

- what messages and events are,

- what message brokers do,

- how background jobs work,

- how retries work,

- why duplicate messages happen,

- what dead-letter queues are,

- what ordering means in queues,

- what event-driven systems are,

- and when asynchronous processing helps or hurts.

This is not a chapter about memorizing Kafka or RabbitMQ.

It is a chapter about understanding the problem that queues solve.

## Why This Matters

Imagine a user signs up for your application.

During signup, your system wants to:

- create the user account,

- send a welcome email,

- initialize preferences,

- notify analytics,

- provision storage,

- send a push notification to mobile,

- create a default project.

If all of this happens synchronously inside the signup request, the user may wait several seconds.

Worse:

- if the email provider is slow, signup becomes slow,

- if analytics fails, signup may fail,

- if storage provisioning times out, the user may not be created,

- if one dependency has a outage, the whole signup flow may break.

This is bad.

A better design may be:

- Create user account

- Return success to user

- Send welcome email later

- Provision storage later

- Notify analytics later

The user does not need to wait for every side effect.

This is where asynchronous processing and message queues become useful.

Queues allow a system to say:

“I received your request. I will do the rest of the work soon.”

That improves responsiveness and resilience.

But it also introduces new problems:

- How does the user know when the work is done?

- What if the worker crashes?

- What if the same message is processed twice?

- What if messages arrive out of order?

- What if the queue becomes huge?

- What if a bad message keeps failing?

This chapter teaches you how to reason about those problems.

## Prerequisites

Before reading this chapter, you should understand:

- what a client is,

- what a server is,

- what an API is,

- what HTTP requests and responses are,

- what status codes are,

- what a database is,

- what caching is,

- what application servers are,

- basic failure thinking,

- basic traffic estimation.

If you have read Chapters 1–8, you are ready.

# Start With a Real-World Problem

Suppose you build a photo-sharing app.

Users upload photos.

After upload, the system needs to:

- store the original image,

- create a thumbnail,

- create a medium-size version,

- scan the image for malware,

- update photo metadata,

- notify followers,

- send analytics events.

Now imagine a user uploads a 10 MB photo.

If the API server does all of this before responding:

- User uploads photo

- Server stores photo

- Server creates thumbnail

- Server creates medium image

- Server scans for malware

- Server updates metadata

- Server notifies followers

- Server sends analytics

- Server finally responds: “Upload complete”

The user may wait many seconds.

If thumbnail generation takes 8 seconds, the user stares at a spinner.

If malware scanning takes 15 seconds, the request may time out.

If follower notification fails because a third-party push service is down, should the upload fail?

Probably not.

The photo was uploaded successfully. The notification can be retried later.

So the system needs a better pattern:

- User uploads photo

- Server stores photo

- Server records upload as “processing”

- Server puts work into a queue

- Server responds: “Upload accepted”

- Background workers generate thumbnails, scan, notify, analyze

This is asynchronous processing.

The user gets a fast response.

Heavy or unreliable work happens later.

But now new questions appear:

- Where is the queue stored?

- Who reads from the queue?

- What if a worker crashes halfway?

- What if the same job is processed twice?

- What if the queue grows too large?

- How does the client know when the photo is ready?

- What if thumbnail generation fails permanently?

Message queues and workers help answer these questions.

# Intuition

A message queue is like a line at a bakery.

Imagine you walk into a bakery and want a custom cake.

The baker does not make the cake while you stand at the counter for three hours.

Instead:

- You place an order.

- The baker writes your order on a ticket.

- The ticket goes into a queue.

- Bakers behind the counter process tickets one by one.

- When the cake is ready, you are notified.

You did not block at the counter.

The bakery can accept many orders.

The bakers can work at their own pace.

If one baker is slow, the queue absorbs the delay.

If another baker joins, they can take tickets from the same queue.

This is the core idea of asynchronous processing:

Accept work quickly, put it somewhere safe, and process it later with workers.

A message queue is the “ticket line” for software systems.

# Core Concept

Let us build asynchronous systems from first principles.

## 1. What Is Synchronous Processing?

### Simple explanation

Synchronous processing means:

The system waits for the work to finish before continuing or responding.

### Example

User clicks “Upload Photo.”

The server:

- receives upload

- stores file

- creates thumbnail

- scans file

- updates database

- notifies users

- responds to client

The client waits until all steps finish.

### Request flow

- Client

- |

- | request

- v

- Server

- |

- | do all work now

- v

- Database / External Services

- |

- | result

- v

- Server

- |

- | response

- v

- Client

### Advantages

- simple mental model,

- immediate result,

- easier error handling for small tasks,

- client knows success/failure right away.

### Disadvantages

- slow operations block the user,

- server resources are tied up,

- failures in side effects can fail the main operation,

- external service latency affects request latency,

- traffic bursts can overwhelm the server.

### When synchronous is okay

Synchronous processing is good when:

- the work is fast,

- the work must complete before responding,

- the user must see the result immediately,

- the operation is small and reliable.

Examples:

- create a task,

- update a profile field,

- read a record,

- simple validation,

- quick database transaction.

## 2. What Is Asynchronous Processing?

### Simple explanation

Asynchronous processing means:

The system accepts the work now, but processes it later.

### Example

User clicks “Upload Photo.”

The server:

- receives upload

- stores file metadata as processing

- places job in queue

- responds: accepted

Later, a worker:

- reads job from queue

- creates thumbnail

- scans file

- updates metadata

- notifies user

### Request flow

- Client

- |

- | request

- v

- API Server

- |

- | enqueue job

- v

- Message Queue

- |

- | later

- v

- Worker

- |

- | process

- v

- Database / External Service

### Advantages

- faster response to client,

- decouples request handling from heavy work,

- workers can scale independently,

- retries are easier,

- traffic spikes can be buffered,

- failures in side effects do not necessarily fail the main request.

### Disadvantages

- result may not be ready immediately,

- more complex status tracking,

- duplicate processing possible,

- ordering becomes harder,

- more components to operate,

- eventual consistency.

### When asynchronous is useful

Asynchronous processing is useful when:

- work is slow,

- work involves external services,

- work can be retried,

- work is bursty,

- work does not need to complete before responding,

- work can be processed by separate workers.

Examples:

- send email,

- generate thumbnail,

- transcode video,

- build search index,

- process payment callback,

- send push notification,

- generate report,

- ingest analytics events.

## 3. Why Queues Exist

A queue exists to solve several problems at once.

### Problem 1: Slow work blocks users

If a request takes 10 seconds because of thumbnail generation, users suffer.

A queue allows the API to respond quickly.

### Problem 2: Traffic bursts overload servers

Suppose normally you receive 10 uploads per minute.

Suddenly you receive 1,000 uploads in one minute.

If workers must handle every upload immediately, the system may crash.

A queue can hold extra work until workers catch up.

### Problem 3: Dependencies fail temporarily

Email providers, payment providers, and push notification services can fail.

If you call them directly inside the user request, the user request fails.

With a queue, you can retry later.

### Problem 4: Different work needs different scaling

API servers may be good at handling HTTP requests.

Workers may be better at CPU-heavy video transcoding.

Queues allow you to scale them separately.

### Problem 5: Multiple services need to react to the same event

When a user signs up:

- notification service sends welcome email,

- analytics service records signup,

- billing service creates trial,

- search service indexes user profile.

Instead of the signup service calling all of them directly, it can publish an event:

\`UserSignedUp\`

Other services can subscribe to that event.

This is called event-driven architecture.

## 4. What Is a Message?

### Simple explanation

A message is a small unit of work or information sent through a queue.

### Formal term

Message.

### Example

A message to send a welcome email:

\`\`\`text
{
  "message_id": "msg_123",
  "type": "send_welcome_email",
  "user_id": "42",
  "email": "",
  "created_at": "2026-10-05T10:30:00Z"
}

\`\`\`

A message to generate a thumbnail:

\`\`\`text
{
  "message_id": "msg_456",
  "type": "generate_thumbnail",
  "photo_id": "ph_789",
  "storage_key": "photos/789/original.jpg",
  "size": "150x150"
}


\`\`\`
### Important beginner point

Messages should usually be small.

Do not put a huge video file directly inside a message.

Instead, put a reference:

\`storage_key, photo_id, job_id\`

The worker reads the reference and fetches the file from object storage.

## 5. What Is a Producer?

### Simple explanation

A producer is the component that creates and sends messages to a queue.

### Formal term

Producer.

### Example

The API server creates a message:

\`generate_thumbnail\`

and sends it to the queue.

The API server is the producer.

### Diagram

- [API Server]

- |

- | produce message

- v

- [Message Queue]

## 6. What Is a Consumer?

### Simple explanation

A consumer is the component that reads messages from a queue and processes them.

### Formal term

Consumer, worker.

### Example

A background worker reads:

\`generate_thumbnail\`

and creates the thumbnail.

### Diagram

- [Message Queue]

- |

- | consume message

- v

- [Worker]

## 7. What Is a Message Broker?

### Simple explanation

A message broker is the system that stores and delivers messages between producers and consumers.

### Formal term

Message broker.

### Example

Conceptually:

\`Producer → Message Broker → Consumer\`

The broker may provide:

- queues,

- topics,

- persistence,

- retries,

- acknowledgements,

- routing,

- monitoring,

- dead-letter handling.

Examples you may hear:

- RabbitMQ,

- Kafka,

- AWS SQS,

- Google Pub/Sub,

- Azure Service Bus,

- Redis Streams.

But the concept matters more than the product.

A message broker is infrastructure for passing work or events between components safely.

## 8. Queue vs Topic / Publish-Subscribe

These are two common messaging patterns.

### Queue pattern

A queue usually means:

One message is processed by one consumer.

Example:

\`Job: resize photo\`

You do not want five workers resizing the same photo five times.

One worker should do it.

Diagram:

- Producer

- |

- v

- Queue

- |

- +--> Worker A

- +--> Worker B

- +--> Worker C

If Worker A takes the message, Workers B and C do not process that same message.

This is useful for background jobs.

### Publish/subscribe pattern

A topic or pub/sub system means:

One message can be delivered to multiple subscribers.

Example:

\`Event: UserSignedUp\`

Multiple services may care:

- notification service,

- analytics service,

- billing service,

- search service.

Diagram:

- Producer

- |

- | UserSignedUp event

- v

- Event Bus / Topic

- |

- +--> Notification Service

- +--> Analytics Service

- +--> Billing Service

- +--> Search Service

Each subscriber gets its own copy or its own consumption position.

This is useful for event-driven systems.

## 9. What Is a Background Job?

### Simple explanation

A background job is a unit of work that runs outside the main user request.

### Formal term

Background job, async job, task.

### Example

When a user requests a monthly report, the system may:

- create job

- enqueue job

- return job_id

- worker generates report

- worker stores result

- client polls or receives webhook

### Job status example

\`\`\`text
{
  "job_id": "job_987",
  "status": "processing",
  "progress": 45,
  "created_at": "2026-10-05T10:30:00Z"
}

\`\`\`

When done:

\`\`\`text
{
  "job_id": "job_987",
  "status": "succeeded",
  "result_url": "/v1/reports/rpt_555/download"
}

\`\`\`

## 10. What Is an Event?

### Simple explanation

An event is a message that says something happened.

### Formal term

Event.

### Examples

- UserSignedUp

- PhotoUploaded

- PaymentSucceeded

- OrderCancelled

- TaskCompleted

- VideoTranscodeFinished

Events are usually named in past tense:

Something happened.

Commands are different.

A command says:

Do something.

Examples:

- SendWelcomeEmail

- GenerateThumbnail

- ResizeImage

- ChargePayment

### Why the distinction matters

Events are good for broadcasting facts.

Commands are good for assigning work.

Many systems use both:

\`\`\`text
PhotoUploaded event
   ↓
Thumbnail Service receives it
   ↓
Thumbnail Service enqueues GenerateThumbnail command

\`\`\`

## 11. Synchronous API vs Asynchronous API

You learned API design in Chapter 4.

Now connect it to asynchronous processing.

### Synchronous API

Client requests work and waits for final result.

Example:

\`\`\`text
POST /v1/tasks
{
  "title": "Buy milk"
}

\`\`\`

Response:

\`\`\`text
201 Created
{
  "task_id": "123"
}

\`\`\`

The task is ready immediately.

### Asynchronous API

Client requests work and receives a job identifier.

Example:

\`\`\`text
POST /v1/reports
{
  "type": "monthly_usage",
  "month": "2026-09"
}

\`\`\`

Response:

\`\`\`text
202 Accepted
{
  "job_id": "job_987",
  "status_url": "/v1/jobs/job_987"
}

\`\`\`

Client later checks:

\`GET /v1/jobs/job_987\`

Response while running:

\`\`\`text
{
  "job_id": "job_987",
  "status": "running",
  "progress": 60
}

\`\`\`

Response when finished:

\`\`\`text
{
  "job_id": "job_987",
  "status": "succeeded",
  "result_url": "/v1/reports/rpt_555/download"
}


\`\`\`
### Status codes for async APIs

Common status codes:

| Code | Meaning |
| --- | --- |
| 200 OK | Completed now |
| 201 Created | Resource created now |
| 202 Accepted | Request accepted, processing later |
| 204 No Content | Success, no body |
| 429 Too Many Requests | Queue or rate limit pressure |
| 503 Service Unavailable | System cannot accept work now |

\`202 Accepted\` is especially important for asynchronous APIs.

It tells the client:

I have accepted your request, but the final result is not ready yet.

## 12. How Clients Learn the Result

If work happens later, how does the client know when it is done?

There are three common patterns.

### Pattern 1: Polling

Client periodically asks:

\`GET /v1/jobs/job_987\`

Advantages:

- simple,

- works everywhere,

- easy to debug.

Disadvantages:

- wasted requests,

- delayed detection,

- can load the server,

- poor battery usage on mobile if too frequent.

Use when:

- jobs are short,

- client needs result soon,

- simplicity matters.

### Pattern 2: Webhooks

Server calls client when work is done.

Example:

\`\`\`text
POST
{
  "job_id": "job_987",
  "status": "succeeded"
}

\`\`\`

Advantages:

- efficient,

- immediate notification,

- good for server-to-server integrations.

Disadvantages:

- client must expose endpoint,

- retries needed,

- security signatures needed,

- ordering and duplicates matter.

Use when:

- integrating with external systems,

- long-running jobs,

- server-to-server callbacks.

### Pattern 3: Real-time push

Server pushes result over WebSocket, SSE, or mobile push.

Advantages:

- instant user experience.

Disadvantages:

- persistent connections,

- more complex infrastructure,

- state management.

Use when:

- user is watching progress,

- real-time updates are important,

- system already has real-time infrastructure.

# Important Terminology

| Term | Plain Explanation |
| --- | --- |
| Synchronous | Wait for work to finish now |
| Asynchronous | Accept work now, process later |
| Message | Unit of work or event sent through a queue |
| Producer | Component that sends messages |
| Consumer | Component that reads and processes messages |
| Worker | Service that consumes messages and does work |
| Queue | Ordered holding area for messages |
| Message broker | System that stores and delivers messages |
| Topic | Channel where multiple subscribers can receive events |
| Publish/subscribe | One message delivered to many consumers |
| Background job | Work performed outside the request path |
| Event | Message saying something happened |
| Command | Message telling a system to do something |
| Acknowledgement | Consumer tells broker it successfully processed a message |
| Retry | Attempt failed work again |
| Dead-letter queue | Queue for messages that keep failing |
| Poison message | Bad message that repeatedly fails |
| Idempotent consumer | Consumer that can safely process duplicate messages |
| Ordering | Guarantee about sequence of message processing |
| Consumer lag | How far behind consumers are from producers |
| Backpressure | Signal that system is overloaded and should slow down |
| At-most-once | Message may be lost but not duplicated |
| At-least-once | Message may be duplicated but not lost |
| Exactly-once | Message effectively processed once, difficult and system-dependent |

# Mental Model

A useful mental model is:

\`\`\`text
User request
   ↓
API accepts work
   ↓
API stores necessary state
   ↓
API publishes message/job
   ↓
API returns quickly
   ↓
Queue holds work
   ↓
Worker consumes work
   ↓
Worker processes job
   ↓
Worker updates status/result
   ↓
Client polls, receives webhook, or gets push update

\`\`\`

Another way:

\`\`\`text
Fast path:
Client → API → Queue → Response

Slow path:
Queue → Worker → Database/External Service → Status Update

\`\`\`

The key idea:

Do not make the user wait for everything.

But also:

Do not pretend work is done when it is not.

# Architecture Diagram

Let us evolve the architecture step by step.

## Stage 1: Everything Synchronous

- [Client]

- |

- v

- [API Server]

- |

- +--> [Database]

- |

- +--> [Email Provider]

- |

- +--> [Image Processor]

- |

- +--> [Analytics Service]

Problem:

- API server waits for all dependencies,

- slow dependencies make user requests slow,

- failures in side effects can fail main request.

## Stage 2: Add a Queue

- [Client]

- |

- v

- [API Server]

- |

- +--> [Database]

- |

- +--> [Message Queue]

- |

- +--> [Email Worker]

- +--> [Image Worker]

- +--> [Analytics Worker]

Now:

- API server accepts request quickly,

- workers process side effects later,

- failures can be retried,

- workers can scale independently.

## Stage 3: Job Status Tracking

- [Client]

- |

- v

- [API Server]

- |

- +--> [Database / Job Store]

- |

- +--> [Message Queue]

- |

- +--> [Worker]

- |

- v

- [Update job status]

Client can ask:

\`GET /v1/jobs/{job_id}\`

## Stage 4: Event-Driven System

- [Order Service]

- |

- | OrderCreated event

- v

- [Event Bus]

- |

- +--> [Payment Service]

- +--> [Inventory Service]

- +--> [Notification Service]

- +--> [Analytics Service]

Services react to facts instead of calling each other directly.

# Step-by-Step Request Flow

Let us trace a concrete asynchronous flow.

## Scenario: User uploads a photo

API:

\`POST /v1/photos\`

Goal:

- accept upload quickly,

- process thumbnail later,

- let client know when ready.

## Step 1: Client Requests Upload Permission

Client asks API for an upload slot.

\`\`\`text
POST /v1/upload-intents
{
  "filename": "sunset.jpg",
  "content_type": "image/jpeg",
  "size_bytes": 3145728
}

\`\`\`

## Step 2: API Validates Request

API checks:

- user authenticated,

- file type allowed,

- file size allowed,

- user quota okay.

## Step 3: API Creates Upload Record

API stores in database:

- upload_id = upl_123

- user_id = 42

- status = initialized

- expires_at = soon

## Step 4: API Returns Upload URL

Response:

\`\`\`text
{
  "upload_id": "upl_123",
  "upload_url": "",
  "expires_at": "2026-10-05T10:45:00Z"
}

\`\`\`

## Step 5: Client Uploads File Directly to Storage

Client sends bytes to object storage.

This avoids forcing the API server to stream huge files.

## Step 6: Client Tells API Upload Completed

\`\`\`text
POST /v1/photos
{
  "upload_id": "upl_123",
  "caption": "Sunset beach"
}

\`\`\`

## Step 7: API Verifies Upload

API checks with storage:

- did file arrive?

- is size correct?

- is content type acceptable?

- does checksum match?

## Step 8: API Creates Photo Metadata

Database row:

- photo_id = ph_456

- upload_id = upl_123

- user_id = 42

- caption = Sunset beach

- status = processing

- created_at = now

## Step 9: API Publishes Messages

API sends messages to queue:

\`\`\`text
{
  "message_id": "msg_001",
  "type": "generate_thumbnail",
  "photo_id": "ph_456"
}
 {
  "message_id": "msg_002",
  "type": "scan_image",
  "photo_id": "ph_456"
}
 {
  "message_id": "msg_003",
  "type": "photo_uploaded",
  "photo_id": "ph_456",
  "user_id": "42"
}

\`\`\`

## Step 10: API Responds Quickly

\`\`\`text
202 Accepted
{
  "photo_id": "ph_456",
  "status": "processing",
  "status_url": "/v1/photos/ph_456"
}

\`\`\`

The user does not wait for thumbnail generation.

## Step 11: Workers Process Messages

Thumbnail worker:

- read generate_thumbnail message

- fetch original image from storage

- create thumbnail

- store thumbnail

- update photo metadata

Malware scanner:

- read scan_image message

- scan file

- update scan status

Notification service:

- read photo_uploaded event

- notify followers

## Step 12: Client Checks Status

\`GET /v1/photos/ph_456\`

While processing:

\`\`\`text
{
  "photo_id": "ph_456",
  "status": "processing"
}

\`\`\`

When ready:

\`\`\`text
{
  "photo_id": "ph_456",
  "status": "ready",
  "image_url": "",
  "thumbnail_url": ""
}

\`\`\`

## Step 13: Failure During Processing

Suppose thumbnail generation fails because image is corrupted.

Worker may:

- retry a few times,

- if still failing, mark photo status as failed,

- send message to dead-letter queue,

- notify user or admin.

Example status:

\`\`\`text
{
  "photo_id": "ph_456",
  "status": "failed",
  "error": {
    "code": "invalid_image",
    "message": "The uploaded file could not be processed."
  }
}

\`\`\`

The important point:

The original upload request already succeeded. The processing failure is represented as job/photo status, not as a failed HTTP upload response.

# Simple Example: Welcome Email

Let us start with the simplest useful example.

## Synchronous signup

- User signs up

- API creates user

- API sends welcome email

- API responds

Problem:

- email provider may be slow,

- email failure may make signup fail.

## Asynchronous signup

- User signs up

- API creates user

- API publishes SendWelcomeEmail message

- API responds: account created

- Email worker sends email later

Architecture:

- [Browser]

- |

- v

- [Auth API]

- |

- +--> [Database]

- |

- +--> [Message Queue]

- |

- v

- [Email Worker]

- |

- v

- [Email Provider]

Message:

\`\`\`text
{
  "message_id": "msg_777",
  "type": "send_welcome_email",
  "user_id": "42",
  "email": ""
}

\`\`\`

Worker behavior:

- receive message

- look up user language/template

- call email provider

- if success, acknowledge message

- if temporary failure, retry later

- if permanent failure, move to dead-letter queue

This is a classic beginner-friendly use of queues.

# Practical Example: Video Upload and Transcoding

Video systems are strongly asynchronous.

A user uploads a video.

The system may need to:

- store raw video,

- check file integrity,

- transcode into multiple resolutions,

- generate thumbnails,

- extract metadata,

- moderate content,

- make video available on CDN,

- notify user.

This can take minutes.

You absolutely do not want the user’s HTTP request to wait for all of this.

## Architecture

- [Client]

- |

- v

- [Upload API]

- |

- +--> [Object Storage]

- |

- +--> [Metadata DB]

- |

- +--> [Message Queue]

- |

- +--> [Transcode Worker]

- +--> [Thumbnail Worker]

- +--> [Moderation Worker]

- +--> [Publish Worker]

## Flow

- 1. Client requests upload URL

- 2. Upload API returns storage upload URL

- 3. Client uploads video to storage

- 4. Client tells API upload complete

- 5. API creates video record: status = processing

- 6. API publishes TranscodeRequested event

- 7. API returns 202 Accepted

- 8. Transcode workers process video

- 9. Workers update status as segments become available

- 10. Client polls or receives webhook

## Status example

\`\`\`text
{
  "video_id": "vid_123",
  "status": "transcoding",
  "progress": 35,
  "available_qualities": []
}

\`\`\`

Later:

\`\`\`text
{
  "video_id": "vid_123",
  "status": "ready",
  "available_qualities": ["360p", "720p", "1080p"],
  "playback_url": ""
}

\`\`\`

This is asynchronous processing at real scale.

# Practical Example: Payment Processing

Payments are delicate.

Some parts must be synchronous, some can be asynchronous.

Example:

User clicks “Pay.”

The system may:

- create payment record,

- call payment provider,

- wait for provider response,

- update order status,

- send receipt email,

- update analytics,

- notify fulfillment.

Should all of this be synchronous?

Not necessarily.

A safer pattern:

- Create payment record as pending

- Call payment provider

- If provider returns immediate result:

- update payment status

- Else:

- wait for webhook/callback

- Publish PaymentSucceeded or PaymentFailed event

- Other services react asynchronously

Important:

- The user may need immediate confirmation, so payment authorization may be synchronous or near-synchronous.

- Receipt email, analytics, and fulfillment can be asynchronous.

- Payment status must be idempotent because provider webhooks may arrive multiple times.

Example webhook:

\`\`\`text
{
  "event_id": "evt_123",
  "type": "payment.succeeded",
  "payment_id": "pay_987"
}

\`\`\`

If the same webhook is delivered twice, the system must not charge or fulfill twice.

This is why idempotency matters.

# Retries

## 13. Why Retries Are Necessary

Networks fail.

External services fail.

Databases become temporarily slow.

A worker may crash.

A message may be delivered while a dependency is down.

If the failure is temporary, retrying may solve it.

Example:

- Email provider returns 503 Service Unavailable

- Wait a bit

- Try again

- Success

## 14. Retry Policy

A retry policy defines:

- how many times to retry,

- how long to wait between retries,

- which errors are retryable,

- when to give up.

Example:

- max_attempts = 5

- initial_delay = 1 second

- backoff_multiplier = 2

- max_delay = 60 seconds

- retry_on = [timeout, 5xx, temporary_rate_limit]

- do_not_retry_on = [invalid_email, malformed_message, permission_denied]

## 15. Exponential Backoff

### Simple explanation

Wait longer after each failure.

Example:

\`\`\`text
Attempt 1 fails → wait 1s
Attempt 2 fails → wait 2s
Attempt 3 fails → wait 4s
Attempt 4 fails → wait 8s
Attempt 5 fails → wait 16s


\`\`\`
### Why useful

If a service is overloaded, immediate retries can make it worse.

Backoff gives it time to recover.

## 16. Jitter

If many workers fail at the same time and all retry after exactly 8 seconds, they may hit the service together.

Jitter adds randomness:

\`delay = base_delay + random_offset\`

Example:

\`Attempt 3 delay = 4s + random(0–2s)\`

This spreads out retries.

## 17. Retry Budgets

A retry budget limits how many retries the system performs overall.

Why?

During large outages, retries can multiply traffic and cause a retry storm.

Example:

- Normal requests: 1,000/sec

- Retry budget: 10%

- Max retry requests: 100/sec

If retries exceed budget, drop or delay lower-priority retries.

# Acknowledgements and Message Completion

## 18. What Is an Acknowledgement?

### Simple explanation

An acknowledgement, often called ack, means:

The consumer tells the broker: “I finished this message successfully. You can remove it.”

### Example

Worker receives:

\`send_welcome_email\`

It sends email successfully.

Then it acks the message.

Broker removes it from queue.

## 19. What If Worker Crashes After Processing but Before Ack?

This is a classic distributed systems problem.

Suppose:

- Worker receives message

- Worker sends email

- Worker crashes before ack

- Broker did not receive ack

- Broker redelivers message

- Another worker sends email again

**Result:**

Duplicate email.

This is why consumers should be idempotent when duplicates matter.

# Duplicate Messages

## 20. Why Duplicates Happen

Duplicates are normal in many queue systems.

Common causes:

- consumer processed message but crashed before ack,

- network timeout prevented ack from reaching broker,

- broker redelivers message,

- producer sent same message twice,

- retry at API layer caused duplicate event,

- webhook provider retries callback.

Beginner mindset:

Do not assume a message will be delivered exactly once unless your system explicitly guarantees it and you understand the cost.

Many practical systems use:

\`at-least-once delivery + idempotent consumers\`

## 21. What Is an Idempotent Consumer?

### Simple explanation

An idempotent consumer can process the same message multiple times without causing incorrect side effects.

### Example of non-idempotent consumer

Message:

\`\`\`text
{
  "type": "increment_like_count",
  "post_id": "123"
}

\`\`\`

If processed twice, likes increase by 2 instead of 1.

Bad.

### Idempotent design

Use a unique event ID or business key.

Consumer keeps record:

\`processed_event_id\`

Before processing:

- If event_id already processed:

- ignore or return previous result

- Else:

- process and record event_id

Example:

\`event_id = evt_999\`

First delivery:

\`not seen → process → mark evt_999 processed\`

Second delivery:

\`already seen → skip\`

This makes duplicates safe.

## 22. Idempotency in Practice

Idempotency can be implemented with:

- unique database constraints,

- processed-message tables,

- status fields,

- version numbers,

- business keys,

- upserts,

- token buckets for counters,

- distributed locks when necessary.

Example database uniqueness:

- processed_messages

- ------------------

- message_id PK

- processed_at

Insert before or during processing:

- INSERT INTO processed_messages (message_id, processed_at)

- VALUES ('msg_123', NOW());

If insert fails because already exists, skip processing.

Careful design is needed so you do not mark processed before actually succeeding.

Common pattern:

- Start processing in transaction

- Insert processed marker

- Perform side effect if possible

- Commit

For external side effects, you may need:

\`idempotency key passed to external provider\`

Example:

\`Payment provider idempotency key = payment_attempt_123\`

# Dead-Letter Queues

## 23. What Is a Dead-Letter Queue?

### Simple explanation

A dead-letter queue, or DLQ, is a place to store messages that cannot be processed successfully after retries.

### Formal term

Dead-letter queue.

### Why needed

Without a DLQ, a bad message may keep failing and block or clutter the main queue.

A DLQ isolates problematic messages for inspection.

### Example

Message:

\`\`\`text
{
  "type": "generate_thumbnail",
  "photo_id": "ph_bad"
}

\`\`\`

Worker tries:

- attempt 1: fails

- attempt 2: fails

- attempt 3: fails

- move to DLQ

Now main queue can continue.

Engineers can inspect the DLQ later.

## 24. What Is a Poison Message?

### Simple explanation

A poison message is a message that repeatedly causes failure.

### Examples

- malformed JSON,

- missing required field,

- invalid file reference,

- unsupported image format,

- bug-triggering payload,

- message that causes worker crash.

### Handling poison messages

Possible actions:

- move to DLQ,

- alert operators,

- quarantine,

- replay after fix,

- discard if safe,

- repair payload manually.

Important:

Do not let one poison message stop all workers.

# Ordering

## 25. What Is Message Ordering?

### Simple explanation

Ordering means messages are processed in the sequence they were produced.

### Example

Events for a task:

- TaskCreated

- TaskUpdated

- TaskDeleted

If processed out of order:

- TaskDeleted

- TaskCreated

- TaskUpdated

The system may recreate a deleted task or update a nonexistent task.

Bad.

## 26. Why Global Ordering Is Expensive

If a queue must preserve order for all messages globally, it often cannot parallelize well.

Why?

Because every consumer must respect one total sequence.

That limits throughput.

Many high-throughput systems therefore offer:

- no ordering guarantee,

- or ordering only within a partition/key/group.

## 27. Partition Ordering

A common compromise:

Messages with the same key are ordered, but different keys can be processed in parallel.

Example key:

\`task_id\`

Messages:

- task_123: Created

- task_123: Updated

- task_123: Deleted

These stay ordered.

But:

\`task_456: Created\`

can be processed in parallel with task_123 messages.

Diagram:

- Producer

- |

- v

- Queue/Topic with partitions

- |

- +--> Partition for task_123: ordered

- +--> Partition for task_456: ordered

This gives both ordering and scalability.

## 28. When Ordering Matters

Ordering is important for:

- state machines,

- audit logs,

- financial events,

- task lifecycle,

- document edits,

- inventory changes,

- chat messages in a conversation,

- configuration changes.

Ordering may be less important for:

- analytics counts,

- non-critical notifications,

- idempotent upserts with timestamps/versions,

- independent jobs.

Beginner rule:

Ask whether ordering matters per entity, not whether the whole system needs global ordering.

# Consumer Lag and Backpressure

## 29. What Is Consumer Lag?

### Simple explanation

Consumer lag is the amount of unprocessed work sitting in the queue.

### Example

Producers create:

\`1,000 messages/minute\`

Consumers process:

\`600 messages/minute\`

Lag grows:

\`400 messages/minute\`

Eventually queue may become huge.

### Why it matters

Growing lag means:

- jobs take longer,

- users wait longer,

- memory/storage may fill,

- timeouts may increase,

- system may be heading toward overload.

## 30. What Is Backpressure?

### Simple explanation

Backpressure is the system saying:

I am falling behind. Slow down.

### Examples

- API returns 429 Too Many Requests,

- API returns 503 Service Unavailable,

- queue rejects new messages,

- producer throttles itself,

- low-priority jobs are delayed,

- non-critical analytics events are dropped.

### Why important

Without backpressure, an overloaded queue can grow until infrastructure fails.

With backpressure, the system protects itself.

## 31. Handling Consumer Lag

Options:

- add more workers,

- improve worker efficiency,

- prioritize important messages,

- delay low-priority work,

- increase queue capacity,

- shed load,

- alert operators,

- rate-limit producers.

Example policy:

- If lag < 1,000: normal

- If lag > 10,000: scale workers

- If lag > 100,000: reject low-priority jobs and alert

# At-Most-Once, At-Least-Once, Exactly-Once

These terms often confuse beginners.

Let us explain simply.

## 32. At-Most-Once Delivery

### Simple explanation

The message is delivered at most once.

It may be lost, but it will not be duplicated.

### Example

Worker receives message, broker removes it immediately, worker crashes before processing.

**Result:**

Message lost.

### Use when

- losing some messages is acceptable,

- duplicates are worse than loss.

Examples:

- some telemetry,

- best-effort cache updates,

- non-critical metrics.

## 33. At-Least-Once Delivery

### Simple explanation

The message will be delivered one or more times.

It may be duplicated, but it should not be lost under normal conditions.

### Example

Worker processes message but crashes before ack.

Broker redelivers.

**Result:**

Duplicate delivery.

### Use when

- losing messages is unacceptable,

- consumers can be made idempotent.

This is very common in practice.

## 34. Exactly-Once Delivery

### Simple explanation

The message is effectively processed exactly once, even if delivered multiple times.

### Reality check

True exactly-once is difficult.

Many systems achieve “effectively once” by combining:

- at-least-once delivery,

- idempotent consumers,

- transactions,

- deduplication,

- offset management.

Beginner takeaway:

Do not casually promise exactly-once. Design for duplicates and make consumers idempotent.

# Event-Driven Systems

## 35. What Is Event-Driven Architecture?

### Simple explanation

Event-driven architecture means components communicate by publishing and subscribing to events instead of calling each other directly.

### Example

Order service publishes:

\`OrderCreated\`

Other services react:

- Payment Service listens for OrderCreated

- Inventory Service listens for OrderCreated

- Notification Service listens for OrderCreated

- Analytics Service listens for OrderCreated

Diagram:

- Order Service

- |

- | OrderCreated

- v

- Event Bus

- |

- +--> Payment Service

- +--> Inventory Service

- +--> Notification Service

- +--> Analytics Service

### Advantages

- loose coupling,

- easier to add new subscribers,

- independent scaling,

- resilience through buffering,

- natural audit trail if events are stored.

### Disadvantages

- eventual consistency,

- harder debugging,

- event schema evolution,

- duplicate events,

- ordering complexity,

- more infrastructure.

Event-driven systems are powerful but not automatically better.

## 36. Commands vs Events in Event-Driven Systems

Example:

- Event: PhotoUploaded

- Command: GenerateThumbnail

A \`PhotoUploaded\` event says:

This fact happened.

A \`GenerateThumbnail\` command says:

Please do this work.

A clean design often separates them:

\`\`\`text
PhotoUploaded event
   ↓
Media Service decides what work is needed
   ↓
Publish GenerateThumbnail command
   ↓
Thumbnail Worker processes command

\`\`\`

This avoids putting too much logic into the event itself.

# Kafka and RabbitMQ as Concepts

Do not memorize these tools.

Understand what problems they represent.

## 37. RabbitMQ Conceptually

RabbitMQ is often used as a message broker for task queues and routing.

Typical ideas:

- producers send messages,

- queues hold messages,

- consumers acknowledge messages,

- exchanges route messages,

- dead-letter queues handle failures.

Good conceptual use cases:

- background jobs,

- work queues,

- RPC-like async tasks,

- routing messages to different worker pools.

Beginner view:

RabbitMQ can act like a smart postal system for messages.

## 38. Kafka Conceptually

Kafka is often used as a distributed event log.

Important ideas:

- messages are appended to topics,

- topics are split into partitions,

- each partition has an ordered sequence,

- consumers track offsets,

- messages can be retained and replayed,

- consumer groups allow parallel consumption.

Good conceptual use cases:

- high-throughput event streams,

- logs,

- metrics,

- change data capture,

- event sourcing,

- replayable event histories.

Beginner view:

Kafka can act like a durable, replayable journal of events.

## 39. Queue vs Log

A simple queue often removes messages after processing.

A log often retains messages for a period and allows consumers to replay from positions.

Example:

Queue:

- Job: send email

- After success → remove

Log:

- Event: UserSignedUp

- Retain for 7 days

- Multiple consumers can read at their own pace

This distinction is useful.

Not every message system needs replayability.

Not every job system needs an event log.

# Queues and APIs

## 40. Designing an Async API

A good asynchronous API should answer:

- What did the client request?

- What is the job ID?

- What is the current status?

- Where can the client check progress?

- What happens on failure?

- Is the request retry-safe?

- Are there rate limits?

- Are there size/quota limits?

Example:

\`\`\`text
POST /v1/exports
{
  "type": "user_tasks",
  "format": "csv"
}

\`\`\`

Response:

\`\`\`text
202 Accepted
{
  "export_id": "exp_123",
  "status": "queued",
  "status_url": "/v1/exports/exp_123"
}

\`\`\`

Status:

\`GET /v1/exports/exp_123\`

Response:

\`\`\`text
{
  "export_id": "exp_123",
  "status": "processing",
  "progress": 70
}

\`\`\`

Finished:

\`\`\`text
{
  "export_id": "exp_123",
  "status": "succeeded",
  "download_url": ""
}

\`\`\`

Failed:

\`\`\`text
{
  "export_id": "exp_123",
  "status": "failed",
  "error": {
    "code": "export_too_large",
    "message": "The requested export exceeds the maximum allowed size."
  }
}

\`\`\`

## 41. Idempotency in Async APIs

If client retries:

\`POST /v1/exports\`

should the system create two exports?

Maybe not.

Use an idempotency key:

\`Idempotency-Key: export_user_42_month_2026_09\`

Server stores:

\`idempotency_key → export_id\`

Retry returns same export.

This is especially important for:

- payments,

- orders,

- exports,

- notification sends,

- file processing,

- any expensive or side-effectful job.

# Scaling Example

Let us estimate when queues become useful.

## Scenario: Notification service

Suppose:

- 1 million daily active users

- Each user triggers 2 notifications/day

Total notifications/day:

\`2,000,000 notifications/day\`

Average:

\`2,000,000 / 86,400 ≈ 23 notifications/sec\`

Peak factor 5:

\`≈ 115 notifications/sec\`

If each notification takes 200 ms, one worker can process:

\`1 / 0.2 = 5 notifications/sec\`

Average workers needed:

\`23 / 5 ≈ 5 workers\`

Peak workers needed:

\`115 / 5 ≈ 23 workers\`

But notifications may involve external providers with rate limits and failures.

So architecture:

- API Server

- |

- v

- Notification Queue

- |

- +--> Notification Worker 1

- +--> Notification Worker 2

- ...

- +--> Notification Worker N

- |

- v

- Email/Push/SMS Providers

Queues allow:

- API to respond quickly,

- workers to scale,

- retries for provider failures,

- buffering during spikes,

- isolation from slow external providers.

## Scenario: Report generation

Suppose:

- 10,000 report requests/day

- Each report takes 30 seconds of CPU work

Total CPU seconds/day:

\`10,000 × 30 = 300,000 CPU-seconds/day\`

Average CPU cores needed:

\`300,000 / 86,400 ≈ 3.5 cores\`

Peak factor 5:

\`≈ 17.5 cores\`

If each worker has 2 cores:

\`Peak workers ≈ 9\`

But reports may be bursty.

Queue allows:

- API accepts request

- Worker pool processes reports

- Status endpoint shows progress

Without queue:

- API servers may run reports directly,

- long requests occupy connections,

- timeouts increase,

- scaling becomes messy.

# Failure Scenario

Asynchronous systems introduce many failure modes.

Let us examine them carefully.

## Failure 1: Queue Is Unavailable

If the queue broker is down, producers may not be able to enqueue work.

Effects:

- API cannot accept async jobs,

- background work stops,

- users may see errors.

Mitigations:

- highly available queue cluster,

- retries with backoff,

- fallback to synchronous processing for critical work,

- local buffer/spool if appropriate,

- circuit breaker,

- clear user error messages.

Important design question:

Should the API fail if the queue is unavailable?

For non-critical work, maybe accept and warn? Usually not safe unless you have durable local buffering.

For critical work, fail clearly rather than pretend success.

## Failure 2: Worker Crashes While Processing

Example:

- Worker receives message

- Worker starts sending email

- Worker crashes

If message was not acked, broker may redeliver.

Effect:

- duplicate delivery possible.

Mitigation:

- idempotent consumer,

- transactional processing where possible,

- status records,

- unique constraints.

## Failure 3: Worker Processes Successfully but Ack Fails

Example:

- Worker sends email

- Worker acks

- Ack message lost

- Broker redelivers

Effect:

- duplicate email.

Mitigation:

- idempotency key,

- deduplication table,

- provider-side idempotency.

## Failure 4: Poison Message Blocks Queue

A bad message repeatedly fails.

If workers keep retrying it, they waste capacity.

Mitigation:

- max retry count,

- dead-letter queue,

- exponential backoff,

- alerting,

- quarantine.

## Failure 5: Consumer Lag Grows

Producers send faster than consumers process.

Effects:

- jobs delayed,

- queue storage grows,

- timeouts,

- possible overload.

Mitigation:

- scale consumers,

- prioritize messages,

- rate-limit producers,

- shed low-priority work,

- improve worker performance,

- alert early.

## Failure 6: Messages Arrive Out of Order

Example:

- TaskUpdated

- TaskCreated

If consumer processes update before create, it may fail.

Mitigation:

- partition by entity ID,

- version numbers,

- upsert semantics,

- retry later if prerequisite missing,

- dead-letter if unrecoverable.

## Failure 7: Duplicate Event Causes Duplicate Side Effect

Example:

\`PaymentSucceeded delivered twice\`

Worker fulfills order twice.

Mitigation:

- idempotent consumer,

- unique business key,

- order status state machine,

- payment event deduplication.

## Failure 8: External Provider Rate Limits Workers

Email provider allows only 100 sends/sec.

Workers may collectively exceed that.

Mitigation:

- global rate limiter,

- provider-specific queues,

- token bucket,

- worker concurrency limits,

- retry with backoff,

- priority lanes.

## Failure 9: Message Contains Sensitive Data

A message may include email, token, PII, or payment details.

Risks:

- logs leak data,

- queue storage becomes sensitive store,

- unauthorized consumers read data.

Mitigation:

- store references, not secrets,

- encrypt messages if needed,

- restrict queue access,

- avoid logging payloads,

- set retention policies,

- mask sensitive fields.

Beginner rule:

Put IDs and references in messages, not large or sensitive payloads, unless necessary.

## Failure 10: Job Status Becomes Inconsistent

Worker completes job but fails to update status.

Client keeps seeing \`processing\`.

Mitigation:

- update status in same transaction where possible,

- reconciliation jobs,

- timeouts marking stale jobs as failed,

- idempotent status updates,

- observability alerts.

# Trade-Offs

Asynchronous systems are full of trade-offs.

## Trade-Off 1: Synchronous vs Asynchronous

### Synchronous

Advantages:

- simpler,

- immediate result,

- easier debugging for small systems,

- no job status needed.

Disadvantages:

- slow operations block users,

- dependencies affect request latency,

- failures can cascade,

- harder to absorb bursts.

### Asynchronous

Advantages:

- faster API responses,

- decoupling,

- retries,

- independent scaling,

- better spike handling.

Disadvantages:

- eventual visibility,

- duplicate handling,

- more components,

- status tracking,

- harder debugging.

When to use synchronous:

- fast operations,

- result needed immediately,

- simple workflow,

- low traffic.

When to use asynchronous:

- slow operations,

- external dependencies,

- bursty workloads,

- retryable side effects,

- multiple consumers of events.

## Trade-Off 2: Queue vs Direct Service Call

### Direct call

\`Order Service → Payment Service\`

Advantages:

- simple,

- immediate response,

- easy to understand.

Disadvantages:

- tight coupling,

- payment outage affects order request,

- scaling harder,

- retries manual.

### Queue/event

- Order Service publishes OrderCreated

- Payment Service consumes later

Advantages:

- decoupled,

- buffered,

- retryable,

- scalable.

Disadvantages:

- eventual consistency,

- more complexity,

- status tracking.

Rule:

Use direct calls when you need an immediate answer. Use queues/events when you can accept delayed processing.

## Trade-Off 3: At-Least-Once vs At-Most-Once

### At-least-once

Advantages:

- less chance of losing work.

Disadvantages:

- duplicates possible,

- consumers must be idempotent.

### At-most-once

Advantages:

- no duplicates from redelivery.

Disadvantages:

- messages may be lost.

Most critical systems prefer:

\`at-least-once + idempotent consumers\`

unless loss is acceptable.

## Trade-Off 4: Ordering vs Throughput

Global ordering:

- easier reasoning,

- lower throughput,

- less parallelism.

Partition ordering:

- higher throughput,

- more complex,

- ordering only per key.

No ordering:

- maximum flexibility,

- consumers must handle out-of-order events.

Ask:

Do I need ordering globally, per entity, or not at all?

## Trade-Off 5: Durability vs Speed

Persistent queues:

- messages survive broker restart,

- safer,

- slower,

- more storage.

Memory-only queues:

- faster,

- less durable,

- risk losing messages.

Use durable queues for important jobs.

Use faster non-durable mechanisms only when loss is acceptable.

## Trade-Off 6: Simple Worker vs Workflow Engine

Simple worker:

\`read message → do task → ack\`

Good for small jobs.

Workflow engine:

\`multi-step process with state, retries, timers, compensations\`

Good for complex sagas.

Do not build a giant workflow engine if simple queues suffice.

## Trade-Off 7: Event-Driven vs Request-Driven

Event-driven:

- components react to facts,

- loosely coupled,

- scalable,

- harder to trace.

Request-driven:

- caller expects response,

- easier immediate semantics,

- tighter coupling.

Many systems use both.

# Common Beginner Mistakes

## Mistake 1: Using a Queue for Everything

Beginners sometimes say:

Put it in Kafka.

But not every operation needs async processing.

If the user needs the result immediately and the work is fast, synchronous may be better.

## Mistake 2: Pretending Async Means No User Feedback

If you return \`202 Accepted\`, you must provide a way to check status or notify completion.

Otherwise users do not know whether work succeeded.

## Mistake 3: Ignoring Duplicate Messages

Duplicates are normal.

If your consumer charges money, sends email, or creates orders, it must handle duplicates.

## Mistake 4: Putting Huge Payloads in Messages

Do not put entire videos, images, or large JSON blobs in queue messages.

Store data in object storage/database and pass references.

## Mistake 5: No Dead-Letter Queue

Bad messages can block workers.

Use DLQs or equivalent isolation.

## Mistake 6: Infinite Retries

Retrying forever can waste resources and hide bugs.

Use max attempts, backoff, and DLQ.

## Mistake 7: Retrying Non-Retryable Errors

If email address is invalid, retrying will not help.

Distinguish temporary failures from permanent failures.

## Mistake 8: Ignoring Ordering When It Matters

If events for the same entity must be processed in order, design partition keys and consumer logic accordingly.

## Mistake 9: No Monitoring

You must monitor:

- queue depth,

- consumer lag,

- processing latency,

- failure rate,

- retry rate,

- DLQ size,

- worker health.

Otherwise queues become silent black holes.

## Mistake 10: Treating Queue as Database

Queues are for work/events, not long-term authoritative storage.

Important state should live in databases or durable stores.

## Mistake 11: Letting Low-Priority Jobs Starve Critical Jobs

If analytics messages flood the queue, password reset emails may delay.

Use priority queues or separate queues.

## Mistake 12: No Idempotency in API Layer

If client retries \`POST /jobs\`, the system may create duplicate jobs.

Use idempotency keys or business uniqueness.

# Deep Dive

Now we go deeper into important asynchronous design topics.

## Deep Dive 1: Transactional Outbox Pattern

Problem:

You want to update database and publish event atomically.

Example:

- Create order

- Publish OrderCreated

If database commit succeeds but event publish fails, other services never learn about the order.

If event publish succeeds but database fails, services react to an order that does not exist.

Solution: outbox pattern.

### Idea

Store the event in the same database transaction as the business change.

Table:

- outbox_events

- -------------

- event_id

- aggregate_id

- event_type

- payload

- created_at

- published_at

Flow:

- BEGIN transaction

- INSERT order

- INSERT outbox_event

- COMMIT

- Separate publisher reads unpublished outbox events

- Publishes to queue/broker

- Marks published

Advantages:

- better atomicity between DB state and event publication,

- reliable event publishing.

Disadvantages:

- more complexity,

- publisher must handle duplicates,

- outbox table grows and needs cleanup.

This is a very important pattern in real systems.

## Deep Dive 2: Saga Pattern

Some business processes span multiple services.

Example:

- Create order

- Reserve inventory

- Charge payment

- Assign delivery driver

If payment fails, inventory reservation should be released.

A traditional database transaction may not span all services.

A saga coordinates steps and defines compensating actions.

Example:

- Step 1: Reserve inventory

- Compensation: Release inventory

- Step 2: Charge payment

- Compensation: Refund payment

- Step 3: Assign driver

- Compensation: Unassign driver

Two styles:

### Choreography

Services react to events:

\`\`\`text
OrderCreated → Inventory reserves
InventoryReserved → Payment charges
PaymentCharged → Delivery assigns

\`\`\`

Advantages:

- decentralized.

Disadvantages:

- harder to trace,

- cycles possible,

- compensation logic scattered.

### Orchestration

A coordinator/saga orchestrator directs steps:

\`\`\`text
Saga Orchestrator
  → reserve inventory
  → charge payment
  → assign driver
  → if failure, run compensations

\`\`\`

Advantages:

- clearer workflow,

- easier monitoring.

Disadvantages:

- orchestrator becomes important component.

Beginner takeaway:

Sagas are useful for multi-step distributed workflows, but they add complexity. Do not use them for simple operations.

## Deep Dive 3: Priority Queues

Not all messages are equally urgent.

Examples:

- password reset email,

- fraud alert,

- payment confirmation,

- marketing email,

- analytics event.

You may want separate queues:

- critical_queue

- normal_queue

- bulk_queue

- analytics_queue

Workers scale differently per queue.

This prevents low-priority bulk work from blocking urgent work.

## Deep Dive 4: Rate Limiting and Throttling Workers

External providers often have limits.

Example:

- SMS provider: 50 messages/sec

- Email provider: 200 messages/sec

If workers call too fast, provider returns errors.

Solutions:

- token bucket per provider,

- worker concurrency limits,

- delayed messages,

- separate provider queues,

- global distributed rate limiter.

## Deep Dive 5: Delayed Jobs and Scheduled Work

Some work should happen later:

- Send reminder 24 hours before event

- Retry failed job after 5 minutes

- Expire coupon at midnight

- Check payment status after 10 minutes

Some brokers support delayed/scheduled messages.

If not, you can use:

- database scheduled jobs,

- timer service,

- delay queue,

- cron-like worker,

- future-dated messages polled by scheduler.

Be careful with time drift and duplicate scheduling.

## Deep Dive 6: Idempotent Consumer Design Patterns

Common patterns:

### 1. Deduplication table

\`processed_messages(message_id PK, processed_at)\`

### 2. Business uniqueness

\`UNIQUE(order_id, event_type)\`

### 3. State machine guard

\`Only transition order from PAID to SHIPPED if status == PAID\`

### 4. Upsert with version

\`Update record only if incoming version > stored version\`

### 5. External idempotency key

\`Pass idempotency_key to payment provider\`

Choose based on side effect type.

## Deep Dive 7: Observability for Async Systems

Important metrics:

| Metric | Why It Matters |
| --- | --- |
| Queue depth | How much pending work exists |
| Consumer lag | How far behind workers are |
| Message age | Oldest unprocessed message |
| Processing latency | How long workers take |
| Failure rate | How many messages fail |
| Retry rate | How often redelivery happens |
| DLQ size | Persistent failures |
| Throughput | Messages processed/sec |
| Worker count | Current capacity |
| End-to-end latency | Time from produce to completion |

Logs should include:

- message_id

- job_id

- trace_id

- attempt_count

- consumer_id

- error_code

Traces should propagate context from producer to broker to consumer.

Without observability, async systems become mysterious.

## Deep Dive 8: Security Considerations

Messages may cross service boundaries.

Consider:

- authentication: who can publish/consume?

- authorization: can this consumer read this topic/queue?

- encryption: in transit and at rest,

- payload sensitivity: avoid secrets/PII when possible,

- signing: verify event source,

- replay protection: nonces/timestamps,

- retention: delete old messages,

- access logging.

Example:

Do not put password reset tokens in plain events if many services can consume them.

Use references and secure stores.

## Deep Dive 9: Message Schema Evolution

Over time, message formats change.

Example old event:

\`\`\`text
{
  "user_id": 42
}

\`\`\`

New event:

\`\`\`text
{
  "user_id": "usr_42",
  "tenant_id": "t_9"
}

\`\`\`

If consumers expect old format, things break.

Practices:

- version events,

- additive changes when possible,

- deprecate fields gradually,

- schema registry or contract tests,

- consumers ignore unknown fields if safe,

- document breaking changes.

Event schemas are part of system design, not just coding.

## Deep Dive 10: Fan-Out

Fan-out means one event leads to many downstream actions.

Example:

\`\`\`text
User posted update
→ notify followers
→ update feed caches
→ index in search
→ send analytics
→ moderate content

\`\`\`

Fan-out can be expensive.

If a user has 1 million followers, notifying all immediately may overload the system.

Strategies:

- async fan-out,

- batch notifications,

- priority tiers,

- pull-based feeds,

- hybrid push/pull,

- rate limiting.

You will see fan-out again in feed systems, but the queue concept is important here.

# Active Learning Checks

Pause and think before reading answers.

## Think About It

Question:

Why is it dangerous to send an email synchronously inside a signup request?

Answer direction:

Because email providers can be slow or fail. If signup waits for email, user experience degrades and email outage can block account creation. The core signup can succeed while email is processed later.

## Predict

Question:

A worker processes a payment message and charges the user, but crashes before acknowledging the message. The broker redelivers the message. What may happen if the consumer is not idempotent?

Answer direction:

The user may be charged twice.

## Find the Bottleneck

Question:

Your API responds quickly, but users complain that uploaded photos take many minutes to appear. Monitoring shows:

- Queue depth: growing steadily

- Worker CPU: 100%

- Database: healthy

Where is the bottleneck?

Answer direction:

Workers are too slow or too few. Queue depth grows because consumption cannot keep up with production.

## Find the Failure

Question:

A single malformed message keeps failing and being retried. Workers spend time on it repeatedly.

What is this problem?

Answer direction:

Poison message. It should be retried with limits and moved to a dead-letter queue.

## Compare

Question:

Which is better?

Option A:

\`Global ordering for all messages\`

Option B:

\`Ordering per user_id partition\`

Answer direction:

Option B is usually better for scalability. It preserves order where it matters while allowing parallel processing across different users.

## Design This

Question:

Design an asynchronous flow for password reset emails.

Requirements:

- user requests reset,

- email sent soon,

- reset token expires in 15 minutes,

- duplicate requests should not send too many emails.

Answer direction:

Possible flow:

- API validates request

- API creates reset token in database/cache

- API publishes SendPasswordResetEmail message

- API returns success without revealing too much

- Worker consumes message

- Worker checks token still valid and rate limit

- Worker sends email

- Worker marks email sent

Idempotency:

- use reset_request_id,

- deduplicate email sends,

- rate limit per user/IP.

Security:

- do not log token,

- short TTL,

- signed token,

- avoid user enumeration.

# Architecture Exercise

## Weak Design

A beginner builds a video upload system like this:

- [Client]

- |

- v

- [API Server]

- |

- +--> [Object Storage]

- |

- +--> [Transcode directly inside request]

- |

- +--> [Notify user inside request]

- |

- v

- [Response after 5 minutes]

Problems:

- user waits minutes,

- API server resources tied up,

- transcoder failure fails upload response,

- no retry mechanism,

- no status tracking,

- traffic bursts overload API server.

## Your Task

Improve the design using asynchronous processing.

Ask:

- What should happen immediately?

- What can happen later?

- Where should jobs be stored?

- How does client know progress?

- What if transcode fails?

- What if notification fails?

## Hint 1 — Requirements Hint

Clarify:

- acceptable upload response time,

- transcode duration,

- retry policy,

- status updates,

- priority levels.

## Hint 2 — Architecture Hint

Separate API from workers:

- API accepts upload

- API stores metadata

- API enqueues transcode job

- Workers transcode

- Status endpoint reports progress

## Hint 3 — Scaling Hint

Scale workers independently from API servers.

Use queue depth and worker latency to autoscale.

## Hint 4 — Reliability Hint

Use:

- persistent queue,

- retries with backoff,

- dead-letter queue,

- idempotent workers,

- job status reconciliation.

## Improved Architecture

- [Client]

- |

- v

- [Upload API]

- |

- +--> [Metadata DB]

- |

- +--> [Object Storage]

- |

- +--> [Message Queue]

- |

- +--> [Transcode Worker Pool]

- +--> [Thumbnail Worker]

- +--> [Notification Worker]

Client flow:

\`\`\`text
1. Request upload URL
2. Upload video to storage
3. Notify API
4. API returns 202 + video_id
5. Client polls /videos/{id}/status
6. Workers update status
7. Video becomes ready

\`\`\`

Failure handling:

\`\`\`text
Transcode fails → retry → if permanent failure → status failed + DLQ/alert
Notification fails → retry independently
Duplicate messages → idempotent status updates

\`\`\`

This is much more robust.

# Design Exercise: Notification Service

Design a simple notification service.

Users can receive:

- email,

- push notification,

- SMS.

System must:

- accept notification requests,

- send messages later,

- retry temporary failures,

- avoid duplicate sends,

- support priority,

- monitor delivery status.

Do not design full global scale yet.

Focus on asynchronous architecture.

## Step 1: Clarify Requirements

Questions:

- What notification types?

- Are messages user-specific?

- What are priority levels?

- What are provider rate limits?

- Do we need delivery receipts?

- Do we need templates?

- Do we need user preferences/opt-outs?

- What is acceptable delay?

Assume:

- email and push first,

- SMS later,

- password reset is critical,

- marketing is low priority,

- duplicate sends are harmful,

- provider failures are common.

## Step 2: Functional Requirements

Service must:

- accept notification request,

- resolve user channels,

- check preferences/opt-outs,

- render template,

- enqueue delivery job,

- send via provider,

- retry failures,

- record delivery status,

- expose status.

## Step 3: Non-Functional Requirements

- critical notifications delivered quickly,

- low-priority notifications can be delayed,

- no duplicate sends for same logical notification,

- observable queue lag,

- provider rate limits respected,

- sensitive data protected.

## Step 4: API Design

Request:

\`\`\`text
POST /v1/notifications
Idempotency-Key: notif_password_reset_user_42

{
  "user_id": "42",
  "type": "password_reset",
  "channels": ["email"],
  "template": "password_reset_en",
  "priority": "critical",
  "data": {
    "reset_url": "..."
  }
}

\`\`\`

Response:

\`\`\`text
202 Accepted
{
  "notification_id": "ntf_123",
  "status": "queued",
  "status_url": "/v1/notifications/ntf_123"
}

\`\`\`

Status:

\`\`\`text
{
  "notification_id": "ntf_123",
  "status": "sent",
  "channels": {
    "email": {
      "status": "delivered",
      "provider_message_id": "msg_999"
    }
  }
}

\`\`\`

## Step 5: Data Model

### notifications

- notification_id

- user_id

- type

- priority

- status

- idempotency_key

- created_at

- updated_at

### notification_channels

- notification_id

- channel

- status

- provider_message_id

- attempt_count

- last_error

- sent_at

- delivered_at

### processed_notification_events

- message_id

- processed_at

For idempotent consumers.

## Step 6: Architecture

- [Client Service]

- |

- v

- [Notification API]

- |

- +--> [Notification DB]

- |

- +--> [Queue: critical]

- +--> [Queue: normal]

- +--> [Queue: bulk/marketing]

- |

- +--> [Email Worker Pool]

- +--> [Push Worker Pool]

- +--> [SMS Worker Pool]

- |

- v

- [Providers]

Priority queues prevent marketing from blocking password resets.

## Step 7: Request Flow

- 1. Client calls POST /notifications

- 2. API validates user/template

- 3. API checks idempotency key

- 4. API stores notification record as queued

- 5. API publishes message to appropriate queue

- 6. API returns 202

- 7. Worker consumes message

- 8. Worker checks preferences/opt-outs

- 9. Worker renders template

- 10. Worker calls provider with idempotency key if available

- 11. Worker updates channel status

- 12. Worker acks message

- 13. If failure temporary, retry with backoff

- 14. If permanent, mark failed and maybe DLQ

## Step 8: Failure Handling

| Failure | Response |
| --- | --- |
| Provider timeout | retry with backoff |
| Invalid email | permanent failure, no retry |
| Duplicate message | idempotency check skips send |
| Queue overload | reject low priority, accept critical |
| Worker crash | redelivery, idempotent consumer |
| Poison template | DLQ + alert |
| Provider rate limit | throttle worker, delay messages |

## Step 9: Security

- Do not log reset tokens.

- Encrypt provider credentials.

- Restrict queue access.

- Validate template variables.

- Respect user opt-out.

- Rate limit notification requests.

- Avoid sending secrets in push payloads.

## Step 10: Observability

Monitor:

- notifications_created_per_minute

- queue_depth_by_priority

- delivery_latency

- failure_rate_by_provider

- retry_rate

- duplicate_suppressed_count

- dlq_size

- provider_rate_limit_errors

## Hint System

If you want to try before reading solution:

### Hint 1 — Requirements Hint

Ask which notifications are critical and which can be delayed.

### Hint 2 — Architecture Hint

Use separate queues by priority and channel.

### Hint 3 — Scaling Hint

Scale workers based on queue depth and provider limits.

### Hint 4 — Reliability Hint

Use idempotency keys and dead-letter queues.

## Final Solution Direction

A reasonable design:

- Notification API

- |

- +--> Notification DB

- |

- +--> Critical Queue

- +--> Normal Queue

- +--> Bulk Queue

- |

- +--> Email Workers

- +--> Push Workers

- +--> SMS Workers

- |

- v

- Providers

Key properties:

- async acceptance,

- priority separation,

- idempotent sends,

- retries with backoff,

- DLQ for poison messages,

- provider rate limiting,

- status tracking,

- observability.

# Practice Questions

Try answering without rereading.

## Conceptual Questions

- What is synchronous processing?

- What is asynchronous processing?

- Why do queues exist?

- What is a producer?

- What is a consumer?

- What is a message?

- What is a message broker?

- What is the difference between a queue and a topic?

- What is a background job?

- What is an event?

- What is a command?

- What does 202 Accepted mean?

- What is polling?

- What is a webhook?

- What is a retry?

- What is exponential backoff?

- What is jitter?

- What is a dead-letter queue?

- What is a poison message?

- Why do duplicate messages happen?

- What is an idempotent consumer?

- What is message ordering?

- What is partition ordering?

- What is consumer lag?

- What is backpressure?

- What is at-least-once delivery?

- What is at-most-once delivery?

- What is event-driven architecture?

- What is the transactional outbox pattern?

- What is a saga?

## Scenario Questions

### Question 1

A user signup flow sends email, updates analytics, and provisions storage synchronously. Signup sometimes takes 6 seconds. What change would you consider?

Answer direction:

Make non-critical side effects asynchronous via queue/workers.

### Question 2

A worker sends an email, then crashes before ack. The message is redelivered. What must be true to avoid duplicate emails?

Answer direction:

The consumer must be idempotent, using message ID, notification ID, or provider idempotency key.

### Question 3

Queue depth grows continuously while worker CPU is 100%. What is the likely problem?

Answer direction:

Consumers cannot keep up. Add workers, improve processing, or shed/rate-limit low-priority work.

### Question 4

A message repeatedly fails due to malformed payload. What should happen?

Answer direction:

Retry with limits, then move to dead-letter queue and alert.

### Question 5

You need events for the same order to be processed in order, but different orders can be processed in parallel. How can you design the queue?

Answer direction:

Partition/order by order_id.

## Design Questions

### Question 1

Design an asynchronous flow for generating CSV exports.

Answer direction:

\`\`\`text
POST /exports → create export job → enqueue → return job_id
Worker reads query, generates CSV, stores file, updates status
Client polls status or receives webhook

\`\`\`

Include idempotency, size limits, expiration, monitoring.

### Question 2

Design a retry policy for sending push notifications.

Answer direction:

- Retry temporary failures up to N times

- Exponential backoff with jitter

- Do not retry invalid token永久 failures

- Move repeated failures to DLQ

- Respect provider rate limits

- Record delivery status

### Question 3

When would you not use a queue?

Answer direction:

When operation is fast, result needed immediately, side effects must be transactional with response, or complexity is not justified.

# Interview Questions

These are common beginner-to-intermediate system design interview questions.

## Question 1

Interviewer: What is the difference between synchronous and asynchronous processing?

Good answer direction:

Synchronous processing waits for work to finish before responding. Asynchronous processing accepts work now and completes it later. Async improves responsiveness and decoupling but introduces eventual consistency, status tracking, retries, and duplicate handling.

## Question 2

Interviewer: Why do we need message queues?

Good answer direction:

Queues decouple producers from consumers, absorb traffic spikes, enable retries, allow independent scaling, and prevent slow or unreliable work from blocking user requests.

## Question 3

Interviewer: What happens if a consumer crashes after processing a message but before acknowledging it?

Good answer direction:

The broker may redeliver the message, causing duplicate processing. Therefore consumers should be idempotent or the system should use transactions/deduplication.

## Question 4

Interviewer: How do you handle duplicate messages?

Good answer direction:

Use idempotency keys, unique constraints, processed-message tables, state machines, versioning, or provider-side idempotency. Design consumers so repeated delivery does not create incorrect side effects.

## Question 5

Interviewer: What is a dead-letter queue?

Good answer direction:

A DLQ stores messages that repeatedly fail processing. It prevents poison messages from blocking normal workers and allows operators to inspect, fix, replay, or discard them.

## Question 6

Interviewer: How do you design an asynchronous API?

Good answer direction:

Return \`202 Accepted\` with a job/resource ID and status endpoint. Support idempotency keys, define failure states, provide webhooks or polling, and monitor queue lag and end-to-end latency.

## Question 7

Interviewer: When should work be synchronous instead of asynchronous?

Good answer direction:

When the result is needed immediately, the operation is fast, the workflow is simple, or eventual consistency would harm user experience. For example, reading a record or creating a small task may be synchronous.

## Question 8

Interviewer: What is consumer lag and why does it matter?

Good answer direction:

Consumer lag is unprocessed messages waiting in the queue. Growing lag means work is delayed, users may experience slow completion times, and the system may be overloaded. It guides scaling and alerting.

## Question 9

Interviewer: How do you preserve ordering in a scalable queue system?

Good answer direction:

Avoid global ordering unless necessary. Partition messages by entity key, such as user_id or order_id, so messages for the same entity are ordered while different entities can be processed in parallel.

## Question 10

Interviewer: What is the transactional outbox pattern?

Good answer direction:

It stores events in the same database transaction as business state changes. A separate publisher reads the outbox and sends events to the broker. This improves reliability of event publishing and avoids inconsistency between database commits and message publication.

# Self-Check

Ask yourself honestly:

- Can I explain synchronous vs asynchronous processing in simple words?

- Can I explain why a queue exists?

- Can I define producer, consumer, message, and broker?

- Can I describe a basic async request flow?

- Can I explain what 202 Accepted means?

- Can I explain why duplicate messages happen?

- Can I design an idempotent consumer?

- Can I explain what a dead-letter queue is for?

- Can I explain retry backoff and jitter?

- Can I describe consumer lag and why it matters?

- Can I explain ordering trade-offs?

- Can I decide whether a given operation should be async or sync?

- Can I identify failure modes in an async system?

- Can I explain the transactional outbox pattern at a high level?

If you can answer most of these, you are ready to continue.

If not, review:

- async API flow,

- idempotent consumers,

- retries and DLQs,

- ordering,

- consumer lag,

- and event-driven architecture.

# DSA/Backend/Coding Connection

Queues connect directly to data structures and backend programming.

| Programming Concept | System Design Connection |
| --- | --- |
| Queue data structure | Message queue / task queue |
| Producer-consumer pattern | Workers consuming jobs |
| Thread pool | Worker pool processing messages |
| Retry loop | Message redelivery/backoff |
| Idempotent function | Safe duplicate processing |
| Hash set | Deduplication of processed message IDs |
| State machine | Job status transitions |
| Log structure | Event log / Kafka-like topics |
| Partitioning | Ordered parallel consumption |
| Backpressure | Bounded queues / throttling |
| Serialization | Message payloads |
| Dead letter | Failed task quarantine |

In code, a simple queue may be:

- enqueue(job)

- dequeue() → process(job)

In distributed systems, the same idea becomes:

\`producer → broker → consumer group → workers\`

The core computer-science idea remains:

Buffer work so producers and consumers can operate independently.

System design scales that idea across machines, failures, networks, and organizations.`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 - System Design", title: "Chapter 1 — What Is System Design?", subtitle: "Part of Part 1 - System Design · Beginner", order: 0, tutorialSlug: "chapter-1-what-is-system-design" },
  { part: "Part 1 - System Design", title: "Chapter 2 — How the Web and Backend Systems Work", subtitle: "Part of Part 1 - System Design · Beginner", order: 1, tutorialSlug: "chapter-2-how-the-web-and-backend-systems-work" },
  { part: "Part 1 - System Design", title: "Chapter 3 — Requirements and Capacity Thinking", subtitle: "Part of Part 1 - System Design · Beginner", order: 2, tutorialSlug: "chapter-3-requirements-and-capacity-thinking" },
  { part: "Part 1 - System Design", title: "Chapter 4 — APIs and System Interfaces", subtitle: "Part of Part 1 - System Design · Beginner", order: 3, tutorialSlug: "chapter-4-apis-and-system-interfaces" },
  { part: "Part 1 - System Design", title: "Chapter 5 — Databases and Data Modeling", subtitle: "Part of Part 1 - System Design · Beginner", order: 4, tutorialSlug: "chapter-5-databases-and-data-modeling" },
  { part: "Part 1 - System Design", title: "Chapter 6 — Database Scaling", subtitle: "Part of Part 1 - System Design · Beginner", order: 5, tutorialSlug: "chapter-6-database-scaling" },
  { part: "Part 1 - System Design", title: "Chapter 7 — Caching", subtitle: "Part of Part 1 - System Design · Beginner", order: 6, tutorialSlug: "chapter-7-caching" },
  { part: "Part 1 - System Design", title: "Chapter 8 — Scaling Application Servers and Load Balancing", subtitle: "Part of Part 1 - System Design · Beginner", order: 7, tutorialSlug: "chapter-8-scaling-application-servers-and-load-balancing" },
  { part: "Part 1 - System Design", title: "Chapter 9 — Asynchronous Systems and Message Queues", subtitle: "Part of Part 1 - System Design · Beginner", order: 8, tutorialSlug: "chapter-9-asynchronous-systems-and-message-queues" },
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
