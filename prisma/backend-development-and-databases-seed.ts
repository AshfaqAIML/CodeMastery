import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

// ============================================================
// Backend Development and Databases - imported by scripts/import-course/pipeline.py
// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.
// ============================================================

const subject = {
  slug: "backend-development-and-databases",
  name: "Backend Development and Databases",
  tagline: "Backend development with databases — SQL, design, and data modeling.",
  description: "Go deeper into backend development, database design, SQL, APIs and persistent data systems.",
  icon: "Code2",
  color: "oklch(0.66 0.16 160)",
  category: "Programming",
  order: 66,
  modules: [
    {
      slug: "part-1",
      title: "Part 1 — Chapters 1–12",
      summary: "Chapters 1 to 12 of Backend Development and Databases.",
      order: 1,
      difficulty: "beginner",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-1-fastapi-basics",
      title: "FastAPI Basics",
      summary: "Backend development is fundamentally about handling requests and returning responses. Every modern application—whether it’s a web app, mobile app, or microservice—relies on APIs.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 0,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# FastAPI Basics

### (Routing, Request/Response Models, Validation)

## Introduction (Why This Matters in Backend)

Backend development is fundamentally about handling requests and returning responses. Every modern application—whether it’s a web app, mobile app, or microservice—relies on APIs.

### 🔹 What Actually Happens in Backend?

### When a user performs an action (e.g., login):

- Frontend sends a request → /login

- Backend receives request

- Backend validates data

- Backend processes logic (DB, auth, etc.)

- Backend returns response

### 🔹 Why FastAPI?

### FastAPI is designed for modern backend systems:

- Built on ASGI (Asynchronous Server Gateway Interface)

- Supports async programming (high performance)

- Uses type hints + Pydantic for validation

- Automatically generates interactive API docs

### 🔹 Performance Insight

### FastAPI is one of the fastest Python frameworks because:

- Uses async I/O

- Built on Starlette + Uvicorn

- Minimizes overhead

### 👉 Comparable to Node.js and Go for I/O-heavy tasks

### 🔹 Real Industry Use

### FastAPI is used for:

- Microservices

- Machine learning APIs

- Real-time systems

- High-performance APIs

### 👉 Mastering FastAPI means:

- You can build production-grade backend systems

- You understand modern backend architecture

- You are job-ready

## Core Concepts

## What is an API? (Deep Understanding)

### API = Application Programming Interface

### It acts as a contract between:

- Client (frontend, mobile app)

- Server (backend)

### 🔹 Request-Response Cycle

### Client → HTTP Request → Backend → HTTP Response → Client

### 🔹 HTTP Methods (Very Important)

### 🔹 Example:

### GET /users → Fetch users POST /users → Create user

### 🔹 Backend Insight:

- APIs must be predictable

- APIs must be consistent

- APIs must follow standards (REST)

## Installing FastAPI (Proper Setup)

### Install Required Packages:

### pip install fastapi uvicorn

### Why Uvicorn?

- ASGI server

- Runs FastAPI app

- Handles requests

### Run Server:

### uvicorn main:app --reload

### Flags Explained:

- main → file name

- app → FastAPI instance

- --reload → auto-restart on changes

### Production Note:

### 👉 In production, use:

- Gunicorn + Uvicorn workers

## Creating First FastAPI App (Deep Breakdown)

\`\`\`sql
from fastapi import FastAPIapp = FastAPI()@app.get("/")def home(): return {"message": "Hello World"}
\`\`\`

### 🔹 Breakdown:

- FastAPI() → creates application instance

- @app.get("/") → defines route

- home() → request handler

### 🔹 Response Behavior:

- Python dict → automatically converted to JSON

### 🔹 Async Version:

\`\`\`sql
@app.get("/")async def home(): return {"message": "Hello World"}
\`\`\`

### 👉 Use async when:

- Calling DB

- Calling APIs

- Performing I/O

## Routing (Deep Understanding)

Routing maps URL → function.

### 🔹 GET Route

### @app.get("/users")def get_users(): return ["Ali", "Sara"]

### 🔹 POST Route

\`\`\`sql
@app.post("/users")def create_user(): return {"status": "created"}
\`\`\`

### 🔹 Path Parameters

\`\`\`sql
@app.get("/users/{user_id}")def get_user(user_id: int): return {"id": user_id}
\`\`\`

### Important:

- user_id: int → automatic validation

- If wrong type → FastAPI returns error

### 🔹 Query Parameters

\`\`\`sql
@app.get("/search")def search(q: str, limit: int = 10): return {"query": q, "limit": limit}
\`\`\`

### 🔹 Multiple Parameters

\`\`\`sql
@app.get("/items/{id}")def get_item(id: int, sort: str = "asc"): return {"id": id, "sort": sort}
\`\`\`

### 🔹 Backend Insight:

- Path params → identify resource

- Query params → filter/search

## Request Body (Deep Understanding)

Request body contains data sent by client.

### 🔹 Using Pydantic Model

### from pydantic import BaseModelclass User(BaseModel): name: str age: int

### 🔹 Endpoint

### @app.post("/users")def create_user(user: User): return user

### 🔹 What Happens Internally?

- JSON → parsed

- Validated by Pydantic

- Converted to Python object

### 🔹 Invalid Input Example:

\`\`\`sql
{ "name": "Ali", "age": "twenty"}
\`\`\`

### 👉 FastAPI automatically returns:

- 422 error

- Validation message

### 🔹 Backend Insight:

- Always validate input

- Never trust client data

## Response Models (Deep Understanding)

Response models define output schema.

### Example:

\`\`\`sql
@app.get("/user", response_model=User)def get_user(): return {"name": "Ali", "age": 25}
\`\`\`

### 🔹 Why Important?

- Ensures correct output

- Filters unwanted fields

- Improves API consistency

### 🔹 Example (Filtering):

\`\`\`sql
@app.get("/user", response_model=User)def get_user(): return {"name": "Ali", "age": 25, "password": "123"}
\`\`\`

### 👉 Output:

\`\`\`sql
{ "name": "Ali", "age": 25}
\`\`\`

### 🔹 Backend Insight:

- Never expose sensitive data

- Always use response models

## Validation (Advanced)

### Using Field Constraints:

### from pydantic import Fieldclass User(BaseModel): age: int = Field(gt=0, lt=120)

### Other Validations:

### name: str = Field(min_length=3, max_length=50)

### Custom Validation:

from pydantic import validatorclass User(BaseModel): name: str @validator("name") def validate_name(cls, v): if not v.isalpha(): raise ValueError("Invalid name") return v

### Backend Insight:

- Prevent invalid data early

- Reduce bugs

## Automatic Documentation (Deep Use)

### URLs:

- /docs → Swagger UI

- /redoc → Alternative docs

### Features:

- Test API directly

- View schema

- Try requests

### Backend Benefit:

- Saves development time

- No need to manually document APIs

## Status Codes (Best Practices)

### Example:

\`\`\`sql
from fastapi import status@app.post("/users", status_code=status.HTTP_201_CREATED)def create_user(): return {"status": "created"}
\`\`\`

### Common Codes:

### Backend Insight:

- Always return correct status code

- Helps frontend understand response

## Real-World Examples

### Example 1: User API

\`\`\`sql
@app.get("/users")def get_users(): return [{"id": 1, "name": "Ali"}]
\`\`\`

### Example 2: Create User

\`\`\`sql
@app.post("/users")def create_user(user: User): return {"message": "User created", "data": user}
\`\`\`

### Example 3: Search API

\`\`\`sql
@app.get("/search")def search(q: str, page: int = 1): return {"query": q, "page": page}
\`\`\`

### Example 4: Product Validation

\`\`\`py
class Product(BaseModel): price: float = Field(gt=0)
\`\`\`

## Code Examples (Important Patterns)

### Pattern 1: Clean Route

### @app.get("/items")def get_items(): return []

### Pattern 2: Validation Layer

\`\`\`py
class Item(BaseModel): name: str
\`\`\`

### Pattern 3: Standard Response Format

\`\`\`sql
return { "status": "success", "data": item}
\`\`\`

### Pattern 4: Error Handling

\`\`\`sql
from fastapi import HTTPException@app.get("/items/{id}")def get_item(id: int): if id < 0: raise HTTPException(status_code=400, detail="Invalid ID")
\`\`\`

## Common Mistakes

### ❌ Not using Pydantic models

### ❌ Trusting client input

### ❌ Mixing business logic in routes

### ❌ Ignoring validation

### ❌ Not using async where needed

### ❌ Returning inconsistent responses

## Interview Questions with Answers

### Q1: What is FastAPI?

### Modern Python framework for building APIs

### Q2: Why FastAPI is fast?

### Uses async + ASGI

### Q3: What is routing?

### Mapping URL → function

### Q4: What is Pydantic?

### Data validation library

### Q5: What is request model?

### Defines input schema

### Q6: What is response model?

### Defines output schema

### Q7: Path vs Query parameters?

- Path → part of URL

- Query → filters

### Q8: Why validation is important?

### Prevents invalid data

## Summary (Quick Revision)

- FastAPI → high-performance API framework

- API = request → response

- Routing:

- GET

- POST

- Parameters:

- Path

- Query

- Body

- Pydantic → validation

- Response model → safe output

- Status codes → correct communication

### 👉 Master this chapter =

### ✔ Build real APIs

### ✔ Understand backend deeply

### ✔ Become job-ready 🚀`,
    },
    {
      slug: "chapter-2-dependency-injection",
      title: "Dependency Injection",
      summary: "👉 This is where Dependency Injection (DI) comes in.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 1,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Dependency Injection

### (Depends(), Database Sessions, Clean Architecture in FastAPI)

## Introduction (Why This Matters in Backend)

### As backend applications grow, complexity increases:

- Multiple routes

- Database connections

- Authentication logic

- Shared services

### If everything is written inside route functions:

### ❌ Code becomes messy

### ❌ Hard to test

### ❌ Hard to scale

👉 This is where Dependency Injection (DI) comes in.

### 🔹 What is Dependency Injection?

### Dependency Injection means:

### 👉 Instead of creating objects inside a function,

### 👉 You provide (inject) them from outside

### 🔹 Real Backend Example:

### Without DI:

\`\`\`py
def get_user(): db = Database() # tightly coupled ❌
\`\`\`

### With DI:

\`\`\`py
def get_user(db): return db.get_user()
\`\`\`

### 👉 Benefits:

- Loose coupling

- Reusability

- Easier testing

- Cleaner architecture

### 👉 In FastAPI, DI is implemented using:

### 👉 Depends()

## Core Concepts

## What is Depends() in FastAPI?

### Depends() is used to:

### 👉 Inject dependencies into route functions

### Basic Example:

\`\`\`sql
from fastapi import Depends, FastAPIapp = FastAPI()def get_message(): return "Hello"@app.get("/")def home(msg: str = Depends(get_message)): return {"message": msg}
\`\`\`

### 🔹 What Happens Internally?

- FastAPI calls get_message()

- Injects result into home()

### 🔹 Key Idea:

### 👉 Function result becomes dependency

## Why Dependency Injection is Important

### Without DI:

\`\`\`py
def route(): db = Database() user = db.get_user()
\`\`\`

### Problems:

- Hardcoded dependency

- Hard to test

- Not reusable

### With DI:

\`\`\`py
def route(db): return db.get_user()
\`\`\`

### 👉 Benefits:

- Clean code

- Easy testing

- Flexible design

## Database Session Dependency (Very Important)

Database connection is one of the most common dependencies.

### Example (Basic DB Session):

\`\`\`py
def get_db(): db = "DB Connection" try: yield db finally: print("Closing DB")
\`\`\`

### Using in Route:

\`\`\`sql
@app.get("/users")def get_users(db = Depends(get_db)): return {"db": db}
\`\`\`

### 🔹 Important Concept: yield

- yield → returns value

- After request → cleanup runs

### 👉 Used for:

- Opening DB connection

- Closing DB connection

## Dependency Lifecycle (Advanced)

### Steps:

- Dependency function runs

- Value injected

- Route executes

- Cleanup runs (after yield)

### Flow:

### get_db() → yield db → route → cleanup

### Backend Insight:

- Prevents resource leaks

- Ensures proper cleanup

## Nested Dependencies

Dependencies can depend on other dependencies.

### Example:

\`\`\`py
def get_db(): return "DB"def get_user(db = Depends(get_db)): return f"user from {db}"@app.get("/")def home(user = Depends(get_user)): return {"user": user}
\`\`\`

### 👉 Dependency chain:

- home() → get_user() → get_db()

## Dependency for Authentication

### Example:

\`\`\`sql
from fastapi import HTTPExceptiondef get_current_user(token: str): if token != "valid": raise HTTPException(status_code=401) return {"user": "Ali"}
\`\`\`

### Usage:

### @app.get("/profile")def profile(user = Depends(get_current_user)): return user

### 👉 Used for:

- Authentication

- Authorization

## Class-Based Dependencies

### Example:

\`\`\`py
class Service: def get_data(self): return "data"def get_service(): return Service()@app.get("/")def home(service: Service = Depends(get_service)): return service.get_data()
\`\`\`

### 👉 Useful for:

- Service layer

- Business logic

## Dependency Injection vs Global Variables

### ❌ Bad (Global Variable):

### db = Database()

### ✅ Good (DI):

\`\`\`py
def get_db(): return Database()
\`\`\`

### 👉 DI is:

- Safer

- Scalable

- Testable

## Dependency Injection for Testing

### Example:

\`\`\`py
def get_db(): return "real_db"
\`\`\`

### In Test:

\`\`\`py
def override_db(): return "mock_db"app.dependency_overrides[get_db] = override_db
\`\`\`

### 👉 Now tests use mock DB

### Backend Benefit:

- No real DB calls

- Faster testing

- Controlled environment

## Real-World Examples

### Example 1: DB Dependency

\`\`\`py
def get_db(): return "DB"
\`\`\`

### Example 2: Service Layer

\`\`\`py
class UserService: def get_user(self): return {"name": "Ali"}
\`\`\`

### Example 3: Auth Dependency

\`\`\`py
def auth(): return {"user": "Ali"}
\`\`\`

### Example 4: Combined Dependency

\`\`\`py
def get_data(db = Depends(get_db)): return f"data from {db}"
\`\`\`

## Code Examples (Important Patterns)

### Pattern 1: Clean Route

### @app.get("/users")def get_users(db = Depends(get_db)): return db

### Pattern 2: Service Injection

\`\`\`py
def get_service(): return Service()
\`\`\`

### Pattern 3: Auth Injection

\`\`\`py
def get_user(): return {"name": "Ali"}
\`\`\`

### Pattern 4: Nested Dependencies

\`\`\`py
def get_data(db = Depends(get_db)): return db
\`\`\`

## Common Mistakes

### ❌ Creating DB inside route

### ❌ Not using yield for cleanup

### ❌ Overusing global variables

### ❌ Not understanding dependency chain

### ❌ Tight coupling

## Interview Questions with Answers

### Q1: What is dependency injection?

### Providing dependencies from outside instead of creating inside

### Q2: What is Depends()?

### FastAPI tool for injecting dependencies

### Q3: Why use DI?

- Clean code

- Reusability

- Testability

### Q4: What is yield in dependency?

### Used for setup + cleanup

### Q5: What is DB session dependency?

### Function that provides DB connection

### Q6: What are nested dependencies?

### Dependencies depending on other dependencies

### Q7: Why DI is better than global variables?

### More flexible and testable

### Q8: How to override dependency in testing?

### Using dependency_overrides

## Summary (Quick Revision)

- Dependency Injection = provide dependencies externally

- Depends() → inject dependency

- Use yield for cleanup

- Common dependencies:

- DB

- Auth

- Services

- Benefits:

- Clean code

- Reusable

- Testable

- Avoid:

- global variables

- tight coupling

### 👉 Master dependency injection =

### ✔ Clean backend architecture

### ✔ Scalable systems

### ✔ Strong interview performance 🚀`,
    },
    {
      slug: "chapter-3-authentication-security",
      title: "Authentication & Security",
      summary: "from passlib.context import CryptContextpwd_context = CryptContext(schemes=[\"bcrypt\"])def hash_password(password: str): return pwd_context.hash(password)def verify_password(password: str, hashed: str): return pwd_context.verify(password, hashed)",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 2,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Authentication & Security

### (JWT, Password Hashing, OAuth Basics)

## Introduction (Why This Matters in Backend)

### Every real backend system must answer one critical question:

### 👉 Who is the user and are they allowed to access this resource?

### This is handled by:

- Authentication → Who are you?

- Authorization → What can you do?

### 🔹 Real-World Examples:

- Login to Instagram → authentication

- Access admin panel → authorization

- Online banking → strict security

### 🔹 What Happens Without Security?

### ❌ Anyone can access private data

### ❌ Passwords can be stolen

### ❌ System can be hacked

### 👉 Backend developer responsibility:

- Secure user data

- Prevent unauthorized access

- Protect APIs

### 👉 If you master this:

- You can build secure backend systems

- You pass backend interviews easily

- You understand real-world architecture

## Core Concepts

## Authentication vs Authorization

### 🔹 Authentication

### Verifies identity:

### 👉 "Are you really this user?"

### Example:

- Username + password

### 🔹 Authorization

### Checks permissions:

### 👉 "What are you allowed to do?"

### Example:

- Admin vs normal user

### 🔹 Flow:

### Login → Authentication → Authorization → Access granted

## Password Hashing (Very Important)

### 🔹 Why Not Store Passwords Directly?

### ❌ Storing plain passwords is dangerous

### 👉 If database is hacked → all passwords exposed

### 🔹 Solution: Hashing

### Hashing converts password into:

### 👉 Irreversible string

### Example:

### password = "123456"hashed = "abc$xyz..."

### 👉 Cannot convert back to original password

## Hashing with bcrypt

### Install:

### pip install passlib[bcrypt]

### Example:

from passlib.context import CryptContextpwd_context = CryptContext(schemes=["bcrypt"])def hash_password(password: str): return pwd_context.hash(password)def verify_password(password: str, hashed: str): return pwd_context.verify(password, hashed)

### 🔹 Flow:

- User registers → password hashed

- User logs in → password verified

### 👉 Backend Rule:

### ✔ Never store plain password

## JWT (JSON Web Token)

### 🔹 What is JWT?

JWT is a token used for authentication.

### 👉 Instead of sending username/password every time:

### 👉 Server gives a token

### 🔹 Structure of JWT:

### HEADER.PAYLOAD.SIGNATURE

### Example:

### eyJhbGci...eyJ1c2Vy...signature

### 🔹 How JWT Works:

- User logs in

- Server verifies credentials

- Server returns JWT token

- Client stores token

- Client sends token in every request

### 🔹 Example Header:

### Authorization: Bearer <token>

## JWT Implementation in FastAPI

### Install:

### pip install python-jose

### Create Token:

from jose import jwtSECRET_KEY = "secret"ALGORITHM = "HS256"def create_token(data: dict): return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

### Verify Token:

\`\`\`py
def verify_token(token: str): return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
\`\`\`

## Protecting Routes (Authentication Dependency)

### Example:

from fastapi import Depends, HTTPExceptiondef get_current_user(token: str): try: payload = verify_token(token) return payload except: raise HTTPException(status_code=401)

### Use in Route:

### @app.get("/profile")def profile(user = Depends(get_current_user)): return user

### 👉 Only authenticated users can access

## OAuth Basics (High-Level)

### 🔹 What is OAuth?

### OAuth allows:

### 👉 Login using third-party services

### Examples:

- Login with Google

- Login with Facebook

### 🔹 Flow:

- User clicks "Login with Google"

- Redirect to Google

- User logs in

- Google returns token

- Backend verifies token

### 🔹 Why Use OAuth?

- No need to store passwords

- More secure

- Better user experience

## Authentication Flow (Complete)

### Step-by-Step:

- User registers → password hashed

- User logs in → password verified

- Server creates JWT

- Client stores token

- Client sends token in requests

- Backend verifies token

## Security Best Practices

### 🔹 Always Hash Passwords

### 🔹 Use HTTPS

### 🔹 Use JWT expiration

### 🔹 Validate all inputs

### 🔹 Avoid exposing sensitive data

### 🔹 Example (Token Expiry):

### jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

### (Add expiry in real systems)

## Real-World Examples

### Example 1: Registration

\`\`\`py
def register(password: str): return hash_password(password)
\`\`\`

### Example 2: Login

\`\`\`py
def login(password, hashed): return verify_password(password, hashed)
\`\`\`

### Example 3: Token Creation

\`\`\`sql
token = create_token({"user_id": 1})
\`\`\`

### Example 4: Protected Route

\`\`\`sql
@app.get("/dashboard")def dashboard(user = Depends(get_current_user)): return {"message": "Welcome"}
\`\`\`

## Code Examples (Important Patterns)

### Pattern 1: Hash Password

### hashed = hash_password("123")

### Pattern 2: Verify Password

### verify_password("123", hashed)

### Pattern 3: Token-Based Auth

\`\`\`sql
token = create_token({"user": "Ali"})
\`\`\`

### Pattern 4: Secure Endpoint

### @app.get("/secure")def secure(user = Depends(get_current_user)): return user

## Common Mistakes

### ❌ Storing plain passwords

### ❌ Not verifying tokens

### ❌ Not using HTTPS

### ❌ Long-lived tokens without expiry

### ❌ Exposing sensitive data

## Interview Questions with Answers

### Q1: What is authentication?

### Verifying user identity

### Q2: What is authorization?

### Checking permissions

### Q3: What is JWT?

### Token used for authentication

### Q4: Why hash passwords?

### To protect user data

### Q5: What is bcrypt?

### Password hashing algorithm

### Q6: What is OAuth?

### Third-party authentication system

### Q7: How JWT works?

### Login → token → verify

### Q8: Where token is sent?

### Authorization header

## Summary (Quick Revision)

- Authentication → identity

- Authorization → permissions

- Always hash passwords

- JWT → token-based authentication

- OAuth → third-party login

- Secure APIs using:

- tokens

- validation

- HTTPS

### 👉 Master authentication =

### ✔ Secure backend systems

### ✔ Production-ready APIs

### ✔ Strong interview performance 🚀`,
    },
    {
      slug: "chapter-4-middleware-cors",
      title: "Middleware & CORS",
      summary: "In real backend systems, every request does not go directly to your route.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 3,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Middleware & CORS

### (Logging Middleware, Request/Response Flow, Rate Limiting, CORS Handling)

## Introduction (Why This Matters in Backend)

In real backend systems, every request does not go directly to your route.

### 👉 Instead, it passes through multiple layers:

- Logging

- Authentication

- Validation

- Rate limiting

These layers are handled by middleware.

### 🔹 What is Middleware?

### Middleware is a function that:

### 👉 Runs before and after every request

### 🔹 Real Backend Flow:

### Client → Middleware → Route → Middleware → Response

### 🔹 Why Middleware is Important?

- Logging requests

- Handling authentication globally

- Managing errors

- Adding headers

- Rate limiting

### 🔹 What is CORS?

### CORS = Cross-Origin Resource Sharing

👉 It controls which frontend can access your backend.

### Example:

### Frontend (localhost:3000) → Backend (localhost:8000)

### 👉 Different origins → CORS required

### 👉 If you don’t understand middleware & CORS:

- APIs may fail in frontend

- Security issues may arise

### 👉 If you master this:

- You can build production-ready APIs

- You understand real backend flow

## Core Concepts

## Middleware in FastAPI

### Basic Middleware Example:

from fastapi import FastAPI, Requestapp = FastAPI()@app.middleware("http")async def log_requests(request: Request, call_next): print("Before request") response = await call_next(request) print("After request") return response

### 🔹 Explanation:

- request → incoming request

- call_next() → passes request to next layer

- Code before → runs before route

- Code after → runs after route

### 🔹 Flow:

### Request → Middleware → Route → Middleware → Response

## Request & Response Object

### Access Request Data:

@app.middleware("http")async def middleware(request: Request, call_next): print(request.url) response = await call_next(request) return response

### Modify Response:

### response.headers["X-Custom"] = "Value"

### Backend Use:

- Add headers

- Track requests

- Modify responses

## Logging Middleware (Very Important)

### Example:

\`\`\`sql
import time@app.middleware("http")async def logger(request: Request, call_next): start = time.time() response = await call_next(request) duration = time.time() - start print(f"{request.method} {request.url} - {duration}") return response
\`\`\`

### 🔹 What It Does:

- Logs request method

- Logs URL

- Logs execution time

### Backend Benefit:

- Monitor performance

- Debug issues

- Track usage

## Error Handling Middleware

### Example:

\`\`\`sql
from fastapi.responses import JSONResponse@app.middleware("http")async def error_handler(request: Request, call_next): try: return await call_next(request) except Exception as e: return JSONResponse( status_code=500, content={"error": str(e)} )
\`\`\`

### Backend Benefit:

- Prevent crashes

- Return proper error response

## Rate Limiting (Basic Concept)

### What is Rate Limiting?

### 👉 Restrict number of requests per user

### Example:

- Max 100 requests per minute

### Simple Implementation:

\`\`\`sql
calls = 0@app.middleware("http")async def limit(request: Request, call_next): global calls if calls > 5: return JSONResponse( status_code=429, content={"error": "Too many requests"} ) calls += 1 return await call_next(request)
\`\`\`

### Backend Insight:

- Prevent abuse

- Protect server

## CORS (Cross-Origin Resource Sharing)

### Problem:

### Frontend cannot access backend due to:

### 👉 Different origin

### Solution: Enable CORS

### Example:

from fastapi.middleware.cors import CORSMiddlewareapp.add_middleware( CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],)

### 🔹 Parameters:

## Secure CORS Configuration (Important)

### ❌ Bad:

### allow_origins=["*"]

### ✅ Good:

\`\`\`sql
allow_origins=["http://localhost:3000"]
\`\`\`

### Backend Insight:

- Restrict origins in production

- Avoid security risks

## Middleware Execution Order

### Important Rule:

- Middleware runs in order of declaration

### Example:

### Middleware A → Middleware B → Route → B → A

### 👉 Like a stack

## Real-World Examples

### Example 1: Logging System

@app.middleware("http")async def logger(request: Request, call_next): print(request.url) return await call_next(request)

### Example 2: API Security

### if "Authorization" not in request.headers: return JSONResponse(status_code=401)

### Example 3: Performance Monitoring

### start = time.time()

### Example 4: CORS Setup

\`\`\`sql
allow_origins=["http://frontend.com"]
\`\`\`

## Code Examples (Important Patterns)

### Pattern 1: Logging Middleware

\`\`\`sql
print(request.method, request.url)
\`\`\`

### Pattern 2: Add Header

### response.headers["X-App"] = "FastAPI"

### Pattern 3: Block Request

### return JSONResponse(status_code=403)

### Pattern 4: Timing Middleware

### duration = time.time() - start

## Common Mistakes

### ❌ Not using middleware for common logic

### ❌ Logging inside every route

### ❌ Using open CORS in production

### ❌ Not handling errors globally

### ❌ Poor rate limiting implementation

## Interview Questions with Answers

### Q1: What is middleware?

### Function that runs before and after request

### Q2: Why middleware is used?

- Logging

- Auth

- Validation

### Q3: What is CORS?

### Cross-origin resource sharing

### Q4: Why CORS is needed?

### Allow frontend to access backend

### Q5: What is rate limiting?

### Restrict number of requests

### Q6: What is call_next?

### Pass request to next layer

### Q7: Can middleware modify response?

### Yes

### Q8: Middleware execution order?

### Top → bottom → reverse

## Summary (Quick Revision)

- Middleware runs before & after request

- Used for:

- Logging

- Auth

- Error handling

- CORS controls access

- Rate limiting protects server

- Always:

- restrict CORS

- log requests

- handle errors

### 👉 Master middleware =

### ✔ Production-ready backend

### ✔ Secure APIs

### ✔ Better system control 🚀`,
    },
    {
      slug: "chapter-5-api-design-best-practices",
      title: "API Design Best Practices",
      summary: "Building an API is easy.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 4,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# API Design Best Practices

### (REST Principles, Status Codes, Pagination, Clean API Design)

## Introduction (Why This Matters in Backend)

Building an API is easy.

Designing a good API is hard.

### 🔹 What is a Good API?

### A good API is:

- Easy to understand

- Consistent

- Scalable

- Predictable

### 🔹 Real Backend Problem

### Bad API design leads to:

### ❌ Confusion for frontend developers

### ❌ Difficult maintenance

### ❌ Bugs and inconsistencies

### 🔹 Example:

### Bad API:

### /getUserData/createNewUserNow

### Good API:

\`\`\`sql
GET /users/{id}POST /users
\`\`\`

### 👉 Interviewers expect you to know:

- REST principles

- Proper status codes

- API structure

### 👉 If you master this:

- You build professional APIs

- You stand out in interviews

- You write production-ready systems

## Core Concepts

## REST Principles (Very Important)

### REST = Representational State Transfer

It is the standard way to design APIs.

### 🔹 Key Principles:

### Resource-Based Design

APIs should represent resources (nouns), not actions.

### ❌ Bad:

### /getUser

### ✅ Good:

### /users

### Use HTTP Methods Properly

### Statelessness

Each request should contain all required data.

### 👉 Server should not remember previous requests

### Uniform Interface

Use consistent structure across APIs.

### Example:

\`\`\`sql
GET /usersGET /users/{id}POST /usersDELETE /users/{id}
\`\`\`

### Backend Insight:

- Consistency is more important than creativity

## Naming Conventions (Clean API Design)

### 🔹 Use Nouns (Not Verbs)

### ❌ /getUsers

### ✅ /users

### 🔹 Use Plural Names

### ❌ /user

### ✅ /users

### 🔹 Nested Resources

### /users/1/orders

### 🔹 Use Hyphens (Readable URLs)

### /user-profile

### 🔹 Backend Insight:

- API should be readable like English

## Status Codes (Deep Understanding)

### 🔹 Why Status Codes Matter?

- Communicate result of request

- Help frontend handle responses

### 🔹 Common Status Codes:

### 🔹 Example:

\`\`\`sql
from fastapi import HTTPException@app.get("/users/{id}")def get_user(id: int): if id < 0: raise HTTPException(status_code=400, detail="Invalid ID")
\`\`\`

### 🔹 Backend Insight:

- Always return correct status codes

- Never return 200 for errors

## Request & Response Structure

### 🔹 Standard Response Format

\`\`\`sql
{ "status": "success", "data": {...}, "message": "User fetched"}
\`\`\`

### 🔹 Error Response Format

\`\`\`sql
{ "status": "error", "message": "User not found"}
\`\`\`

### 🔹 Why Standard Format?

- Consistency

- Easy frontend integration

- Easier debugging

## Pagination (Very Important)

### 🔹 Problem:

### Large datasets:

- 10,000 users

- Cannot return all at once

### 🔹 Solution: Pagination

### Example:

\`\`\`sql
@app.get("/users")def get_users(limit: int = 10, offset: int = 0): return {"limit": limit, "offset": offset}
\`\`\`

### 🔹 Query Example:

### /users?limit=10&offset=20

### 🔹 Types of Pagination:

- Offset-based

- Cursor-based (advanced)

### 🔹 Backend Insight:

- Always paginate large data

- Improves performance

## Filtering & Sorting

### 🔹 Filtering:

### /users?age=25

### 🔹 Sorting:

### /users?sort=asc

### Example:

\`\`\`sql
@app.get("/users")def get_users(age: int = None, sort: str = "asc"): return {"age": age, "sort": sort}
\`\`\`

### Backend Insight:

- Improves API usability

## Versioning APIs

### 🔹 Why Versioning?

APIs change over time.

### Example:

### /v1/users/v2/users

### Backend Insight:

- Prevents breaking existing clients

## Idempotency (Interview Favorite)

### 🔹 What is Idempotent?

### Same request → same result

### Examples:

### Backend Insight:

- Important for system reliability

## Real-World Examples

### Example 1: RESTful User API

### @app.get("/users")def get_users(): return []

### Example 2: Create Resource

\`\`\`sql
@app.post("/users")def create_user(): return {"status": "created"}
\`\`\`

### Example 3: Pagination

\`\`\`sql
@app.get("/users")def get_users(limit: int = 10): return {"limit": limit}
\`\`\`

### Example 4: Error Handling

### raise HTTPException(status_code=404, detail="Not found")

## Code Examples (Important Patterns)

### Pattern 1: Clean URL

\`\`\`sql
/users/{id}
\`\`\`

### Pattern 2: Query Parameters

### /users?limit=10

### Pattern 3: Standard Response

\`\`\`sql
return {"status": "success", "data": data}
\`\`\`

### Pattern 4: Error Response

### raise HTTPException(status_code=400)

## Common Mistakes

### ❌ Using verbs in URLs

### ❌ Not using status codes properly

### ❌ Returning too much data

### ❌ No pagination

### ❌ Inconsistent response format

### ❌ Not versioning APIs

## Interview Questions with Answers

### Q1: What is REST?

### Standard for designing APIs

### Q2: Why use HTTP methods?

### Define action on resource

### Q3: What is pagination?

### Limit data returned

### Q4: What is idempotency?

### Same request → same result

### Q5: Why version APIs?

### Avoid breaking clients

### Q6: What is good API design?

- Consistent

- Simple

- Predictable

### Q7: Why use status codes?

### Communicate response result

### Q8: What is resource-based design?

### Using nouns instead of verbs

## Summary (Quick Revision)

- REST → standard API design

- Use:

- nouns

- HTTP methods

- Always:

- use status codes

- paginate data

- keep consistent format

- Avoid:

- bad naming

- large responses

- inconsistent APIs

### 👉 Master API design =

### ✔ Professional backend systems

### ✔ Better frontend integration

### ✔ Strong interview performance 🚀`,
    },
    {
      slug: "chapter-6-flask-essentials",
      title: "Flask Essentials",
      summary: "So far, you learned FastAPI — modern and async.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 5,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Flask Essentials

### (App Factory, Blueprints, Project Structure, When to Use Flask)

## Introduction (Why This Matters in Backend)

So far, you learned FastAPI — modern and async.

But in real industry, you will also encounter Flask.

### 👉 Flask is:

- Lightweight

- Flexible

- Widely used in legacy + production systems

### 🔹 Why Learn Flask?

- Many companies still use Flask

- Great for understanding backend fundamentals

- Gives you control over architecture

### 🔹 FastAPI vs Flask

### 👉 Interview Insight:

- Knowing both gives you an advantage

### 👉 If you master Flask:

- You understand backend fundamentals deeply

- You can work on existing production systems

## Core Concepts

## What is Flask?

Flask is a micro web framework.

### 👉 Micro means:

- Minimal features

- You add what you need

### Basic Example:

from flask import Flaskapp = Flask(__name__)@app.route("/")def home(): return "Hello Flask"

### Running Flask App:

### flask run

## Routing in Flask

### Example:

### @app.route("/users")def get_users(): return "Users"

### Methods:

### @app.route("/users", methods=["POST"])def create_user(): return "Created"

## Request & Response Handling

### Access Request Data:

from flask import request@app.route("/data", methods=["POST"])def data(): return request.json

### Return JSON Response:

\`\`\`sql
from flask import jsonify@app.route("/")def home(): return jsonify({"message": "Hello"})
\`\`\`

## Application Structure (Problem)

### ❌ Bad (Single File)

### # everything in one file

### Problems:

- Hard to scale

- Hard to maintain

### 👉 Solution:

### App Factory Pattern

## App Factory Pattern (Very Important)

### 🔹 What is App Factory?

### Instead of creating app globally:

### 👉 Create app inside a function

### Example:

from flask import Flaskdef create_app(): app = Flask(__name__) @app.route("/") def home(): return "Hello" return app

### 🔹 Why Use It?

- Better structure

- Easier testing

- Supports multiple configurations

### Backend Insight:

- Used in production-level Flask apps

## Blueprints (Very Important)

### 🔹 What is Blueprint?

### Blueprint = modular component of app

### 👉 Splits large app into smaller parts

### Example:

from flask import Blueprintuser_bp = Blueprint("user", __name__)@user_bp.route("/users")def get_users(): return "Users"

### Register Blueprint:

### app.register_blueprint(user_bp)

### 🔹 Why Blueprints?

- Organize code

- Separate modules

- Scalable architecture

### Example Structure:

### app/├── user/│ ├── routes.py│ └── models.py

## Flask Project Structure (Best Practice)

### Recommended Structure:

project/│├── app/│ ├── __init__.py│ ├── routes.py│ ├── models.py│ ├── services.py│├── config.py├── run.py

### 🔹 Explanation:

- routes.py → endpoints

- models.py → database models

- services.py → business logic

### 👉 Separation of concerns

## Flask Extensions

### Flask is minimal, so we use extensions:

### Common Extensions:

- Flask-SQLAlchemy → database

- Flask-JWT → authentication

- Flask-Migrate → migrations

### Example:

### from flask_sqlalchemy import SQLAlchemydb = SQLAlchemy()

## Flask vs FastAPI (When to Use)

### Use Flask When:

- Small projects

- Full control needed

- Legacy systems

### Use FastAPI When:

- High-performance APIs

- Async required

- Modern systems

## Real-World Examples

### Example 1: Simple API

### @app.route("/users")def users(): return "Users"

### Example 2: JSON API

\`\`\`sql
@app.route("/data")def data(): return jsonify({"key": "value"})
\`\`\`

### Example 3: Blueprint Usage

### user_bp = Blueprint("user", __name__)

### Example 4: App Factory

### app = create_app()

## Code Examples (Important Patterns)

### Pattern 1: Modular Structure

### app.register_blueprint(user_bp)

### Pattern 2: Clean Route

### @app.route("/")def home(): return "Home"

### Pattern 3: JSON Response

\`\`\`sql
return jsonify({"status": "ok"})
\`\`\`

### Pattern 4: App Factory

\`\`\`py
def create_app(): return Flask(__name__)
\`\`\`

## Common Mistakes

### ❌ Writing everything in one file

### ❌ Not using blueprints

### ❌ Hardcoding configurations

### ❌ Mixing business logic in routes

### ❌ Not using app factory

## Interview Questions with Answers

### Q1: What is Flask?

### Lightweight Python web framework

### Q2: What is app factory?

### Function that creates app instance

### Q3: What is blueprint?

### Modular part of Flask app

### Q4: Why Flask is called micro?

### Minimal features

### Q5: Flask vs FastAPI?

- Flask → flexible

- FastAPI → fast + modern

### Q6: Why use blueprints?

### Organize large apps

### Q7: What are Flask extensions?

### Libraries to add features

### Q8: When to use Flask?

### Small or legacy systems

## Summary (Quick Revision)

- Flask = lightweight backend framework

- Routing using @app.route()

- Use:

- App factory

- Blueprints

- Follow:

- clean structure

- separation of concerns

- Use extensions for features

### 👉 Master Flask =

### ✔ Strong backend fundamentals

### ✔ Ability to work on real systems

### ✔ Better interview performance 🚀

## 🔹 PART 2: Databases`,
    },
    {
      slug: "chapter-7-sql-fundamentals",
      title: "SQL Fundamentals",
      summary: "Backend applications are nothing without data.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 6,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# SQL Fundamentals

### (SELECT, JOIN, GROUP BY, Subqueries)

## Introduction (Why This Matters in Backend)

Backend applications are nothing without data.

### Where is data stored?

### 👉 In databases

### 🔹 Real Backend Examples:

- User login → fetch user from DB

- E-commerce → store products

- Banking → store transactions

### 👉 As a backend developer, you must:

- Retrieve data

- Insert data

- Update data

- Delete data

### 👉 This is done using SQL (Structured Query Language)

### 🔹 Why SQL is Important?

- Used in almost every backend system

- Required in interviews

- Critical for performance

### 👉 If you master SQL:

- You can build real applications

- You can optimize queries

- You will clear backend interviews

## Core Concepts

## What is a Database?

A database is a system to store and manage data.

### 🔹 Types of Databases:

- Relational (SQL) → MySQL, PostgreSQL

- NoSQL → MongoDB

### 🔹 Table Structure:

Users Table+----+--------+-----+| id | name | age |+----+--------+-----+| 1 | Ali | 25 || 2 | Sara | 30 |

### 👉 Data stored in rows and columns

## SELECT (Most Important)

SELECT is used to retrieve data.

### Basic Syntax:

\`\`\`sql
SELECT * FROM users;
\`\`\`

### Specific Columns:

\`\`\`sql
SELECT name, age FROM users;
\`\`\`

### With Condition:

\`\`\`sql
SELECT * FROM users WHERE age > 25;
\`\`\`

### Sorting:

\`\`\`sql
SELECT * FROM users ORDER BY age DESC;
\`\`\`

### Limit:

\`\`\`sql
SELECT * FROM users LIMIT 5;
\`\`\`

### Backend Insight:

- Most used query in backend

## WHERE Clause (Filtering Data)

### Example:

\`\`\`sql
SELECT * FROM users WHERE name = 'Ali';
\`\`\`

### Operators:

### Example:

\`\`\`sql
SELECT * FROM users WHERE age > 20 AND age < 30;
\`\`\`

## JOIN (Very Important)

JOIN is used to combine data from multiple tables.

### Example Tables:

### Usersid | name1 | AliOrdersid | user_id | product1 | 1 | Phone

### INNER JOIN:

\`\`\`sql
SELECT users.name, orders.productFROM usersJOIN orders ON users.id = orders.user_id;
\`\`\`

### Types of JOIN:

### Backend Insight:

- Used in real applications frequently

## GROUP BY (Aggregation)

Used to group data.

### Example:

\`\`\`sql
SELECT age, COUNT(*)FROM usersGROUP BY age;
\`\`\`

### Common Functions:

### Example:

\`\`\`sql
SELECT AVG(age) FROM users;
\`\`\`

## HAVING Clause

Used with GROUP BY.

### Example:

\`\`\`sql
SELECT age, COUNT(*)FROM usersGROUP BY ageHAVING COUNT(*) > 1;
\`\`\`

## Subqueries (Advanced Concept)

A query inside another query.

### Example:

\`\`\`sql
SELECT * FROM usersWHERE age > (SELECT AVG(age) FROM users);
\`\`\`

### Backend Use:

- Complex filtering

- Nested logic

## INSERT, UPDATE, DELETE

### INSERT:

\`\`\`sql
INSERT INTO users (name, age)VALUES ('Ali', 25);
\`\`\`

### UPDATE:

\`\`\`sql
UPDATE usersSET age = 26WHERE name = 'Ali';
\`\`\`

### DELETE:

\`\`\`sql
DELETE FROM usersWHERE name = 'Ali';
\`\`\`

## Indexes (Performance Concept)

### What is Index?

- Improves query speed

- Works like book index

### Example:

\`\`\`sql
CREATE INDEX idx_name ON users(name);
\`\`\`

### Backend Insight:

- Important for large data

## Real-World Examples

### Example 1: Fetch Users

\`\`\`sql
SELECT * FROM users;
\`\`\`

### Example 2: User Orders

\`\`\`sql
SELECT users.name, orders.productFROM usersJOIN orders ON users.id = orders.user_id;
\`\`\`

### Example 3: Count Users

\`\`\`sql
SELECT COUNT(*) FROM users;
\`\`\`

### Example 4: Filter Data

\`\`\`sql
SELECT * FROM users WHERE age > 25;
\`\`\`

## Code Examples (Backend Pattern)

### Pattern 1: Fetch Data

\`\`\`sql
SELECT * FROM table;
\`\`\`

### Pattern 2: Filter Data

\`\`\`sql
SELECT * FROM table WHERE condition;
\`\`\`

### Pattern 3: Join Tables

\`\`\`sql
SELECT * FROM a JOIN b;
\`\`\`

### Pattern 4: Aggregate

\`\`\`sql
SELECT COUNT(*) FROM table;
\`\`\`

## Common Mistakes

### ❌ Using SELECT * in production

### ❌ Missing indexes

### ❌ Incorrect JOIN conditions

### ❌ Not using WHERE clause

### ❌ Ignoring performance

## Interview Questions with Answers

### Q1: What is SQL?

### Language to interact with database

### Q2: What is SELECT?

### Retrieve data

### Q3: What is JOIN?

### Combine tables

### Q4: What is GROUP BY?

### Group data

### Q5: Difference between WHERE and HAVING?

- WHERE → filter rows

- HAVING → filter groups

### Q6: What is subquery?

### Query inside query

### Q7: What is index?

### Improves query speed

### Q8: What is primary key?

### Unique identifier

## Summary (Quick Revision)

- SQL = database query language

- Key operations:

- SELECT

- INSERT

- UPDATE

- DELETE

- JOIN → combine tables

- GROUP BY → aggregation

- Subquery → nested query

- Index → performance boost

### 👉 Master SQL fundamentals =

### ✔ Strong backend skills

### ✔ Efficient data handling

### ✔ High interview success 🚀`,
    },
    {
      slug: "chapter-8-advanced-sql",
      title: "Advanced SQL",
      summary: "👉 This is where Advanced SQL comes in.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 7,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Advanced SQL

### (Window Functions, CTEs, Indexing, Query Optimization)

## Introduction (Why This Matters in Backend)

### Basic SQL is enough to build small applications, but not enough for:

- Large-scale systems

- High-performance APIs

- Complex analytics

### 🔹 Real Backend Problems:

- Slow queries

- Duplicate data processing

- Complex joins

- Large datasets (millions of rows)

👉 This is where Advanced SQL comes in.

### 🔹 What You Will Learn:

- Window functions → advanced calculations

- CTEs → clean query structure

- Indexing → faster queries

- Query optimization → performance improvement

### 👉 If you master this:

- You write efficient database queries

- You handle large-scale systems

- You crack backend interviews easily

## Core Concepts

## Window Functions (Very Important)

### 🔹 What are Window Functions?

### Window functions perform calculations:

### 👉 Across a set of rows

### 👉 Without grouping them

### 🔹 Difference from GROUP BY:

### 🔹 Example Table:

### Usersid | name | age1 | Ali | 252 | Sara | 303 | John | 25

### 🔹 ROW_NUMBER()

Assigns row numbers.

\`\`\`sql
SELECT name,ROW_NUMBER() OVER() AS row_numFROM users;
\`\`\`

### 🔹 PARTITION BY

Group rows without collapsing.

\`\`\`sql
SELECT name, age,COUNT(*) OVER(PARTITION BY age) AS count_ageFROM users;
\`\`\`

### 🔹 RANK()

\`\`\`sql
SELECT name, age,RANK() OVER(ORDER BY age DESC) AS rankFROM users;
\`\`\`

### 🔹 Backend Use:

- Ranking users

- Analytics

- Reports

## Common Window Functions

### Example: LAG()

\`\`\`sql
SELECT name, age,LAG(age) OVER() AS prev_ageFROM users;
\`\`\`

## CTE (Common Table Expression)

### 🔹 What is CTE?

### CTE = temporary result set used in query

### Syntax:

\`\`\`sql
WITH temp AS ( SELECT * FROM users)SELECT * FROM temp;
\`\`\`

### 🔹 Why Use CTE?

- Improves readability

- Breaks complex queries

- Reusable logic

### Example:

\`\`\`sql
WITH avg_age AS ( SELECT AVG(age) AS avg_val FROM users)SELECT * FROM usersWHERE age > (SELECT avg_val FROM avg_age);
\`\`\`

### Backend Insight:

- Used in complex reports

- Improves maintainability

## Indexing (Performance Optimization)

### 🔹 What is Index?

### Index is a data structure that:

### 👉 Improves query speed

### 🔹 Without Index:

- Full table scan

- Slow

### 🔹 With Index:

- Fast lookup

### Example:

\`\`\`sql
CREATE INDEX idx_name ON users(name);
\`\`\`

### 🔹 Types of Indexes:

### 🔹 Backend Insight:

- Index improves read speed

- Too many indexes slow write operations

## Query Optimization (Very Important)

### 🔹 Problem:

\`\`\`sql
SELECT * FROM users;
\`\`\`

### 👉 Fetches all data → slow

### 🔹 Optimized:

\`\`\`sql
SELECT name FROM users;
\`\`\`

### 🔹 Best Practices:

### Avoid SELECT *

### Use WHERE clause

\`\`\`sql
SELECT * FROM users WHERE age > 25;
\`\`\`

### Use Indexes

### Limit Data

\`\`\`sql
SELECT * FROM users LIMIT 10;
\`\`\`

### Avoid Nested Queries (Sometimes)

### Use JOIN instead

## Execution Plan (Advanced)

### 🔹 What is Execution Plan?

### Shows how query runs internally

### Example:

\`\`\`sql
EXPLAIN SELECT * FROM users;
\`\`\`

### Backend Insight:

- Helps identify slow queries

- Used in optimization

## Joins Optimization

### 🔹 Bad Join:

\`\`\`sql
SELECT * FROM a, b;
\`\`\`

### 🔹 Good Join:

\`\`\`sql
SELECT * FROM aJOIN b ON a.id = b.id;
\`\`\`

### Backend Insight:

- Always use proper join conditions

## Real-World Examples

### Example 1: Ranking Users

\`\`\`sql
SELECT name,RANK() OVER(ORDER BY age DESC)FROM users;
\`\`\`

### Example 2: Average Filter

\`\`\`sql
WITH avg_age AS ( SELECT AVG(age) AS avg_val FROM users)SELECT * FROM users WHERE age > avg_val;
\`\`\`

### Example 3: Performance Query

\`\`\`sql
SELECT name FROM users WHERE age > 25;
\`\`\`

### Example 4: Index Usage

\`\`\`sql
CREATE INDEX idx_age ON users(age);
\`\`\`

## Code Examples (Backend Patterns)

### Pattern 1: Window Function

### ROW_NUMBER() OVER()

### Pattern 2: CTE

### WITH temp AS (...)

### Pattern 3: Index

\`\`\`sql
CREATE INDEX idx ON table(column);
\`\`\`

### Pattern 4: Optimization

\`\`\`sql
SELECT column FROM table;
\`\`\`

## Common Mistakes

### ❌ Using SELECT *

### ❌ Not using indexes

### ❌ Overusing subqueries

### ❌ Poor JOIN conditions

### ❌ Ignoring execution plan

## Interview Questions with Answers

### Q1: What is window function?

### Performs calculation across rows

### Q2: What is CTE?

### Temporary query result

### Q3: What is index?

### Improves query performance

### Q4: Difference between RANK and DENSE_RANK?

- RANK → gaps

- DENSE_RANK → no gaps

### Q5: Why avoid SELECT *?

### Slow and unnecessary data

### Q6: What is execution plan?

### Shows query execution

### Q7: What is query optimization?

### Improving query performance

### Q8: When to use index?

### For frequently searched columns

## Summary (Quick Revision)

- Window functions → advanced calculations

- CTE → clean queries

- Index → faster queries

- Optimize queries:

- avoid SELECT *

- use WHERE

- use indexes

- Execution plan → analyze performance

### 👉 Master advanced SQL =

### ✔ High-performance backend

### ✔ Efficient database queries

### ✔ Strong interview advantage 🚀`,
    },
    {
      slug: "chapter-9-database-design",
      title: "Database Design",
      summary: "Writing queries is one part of backend development.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 8,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Database Design

### (Normalization, Relationships, Schema Design, Real-World Modeling)

## Introduction (Why This Matters in Backend)

Writing queries is one part of backend development.

Designing the database correctly is even more important.

### 🔹 Why Database Design Matters?

### A poorly designed database leads to:

### ❌ Duplicate data

### ❌ Inconsistent data

### ❌ Difficult queries

### ❌ Poor performance

### 🔹 Real Example:

### Bad design:

### Users Tablename | order1 | order2 | order3

### Good design:

### Users Table + Orders Table

### 👉 Backend developers must:

- Design tables

- Define relationships

- Ensure data consistency

### 👉 If you master this:

- You build scalable systems

- You write efficient queries

- You perform well in interviews

## Core Concepts

## What is Database Design?

### Database design is:

### 👉 Organizing data into tables

### 👉 Defining relationships between tables

### 🔹 Goals:

- Reduce redundancy

- Improve performance

- Maintain consistency

## Normalization (Very Important)

### Normalization means:

### 👉 Organizing data to remove duplication

### 🔹 Why Normalize?

- Avoid repeated data

- Reduce storage

- Improve consistency

## Normal Forms (Interview Important)

### 🔹 1st Normal Form (1NF)

### Rule:

- No repeating groups

- Atomic values

### ❌ Bad:

### Username | phonesAli | 123,456

### ✅ Good:

### UserPhonesname | phoneAli | 123Ali | 456

### 🔹 2nd Normal Form (2NF)

### Rule:

- Remove partial dependency

### 👉 Data should depend on whole primary key

### 🔹 3rd Normal Form (3NF)

### Rule:

- Remove transitive dependency

### ❌ Bad:

### Userid | city_id | city_name

### ✅ Good:

### Users Tableid | city_idCity Tableid | city_name

### Backend Insight:

- Most systems use up to 3NF

## Relationships (Very Important)

### 🔹 Types of Relationships:

### One-to-One

### User → Profile

### One-to-Many (Most Common)

### User → Orders

### Example:

### Usersid | nameOrdersid | user_id

### Many-to-Many

### Students ↔ Courses

### Example:

### Student_Coursestudent_id | course_id

### Backend Insight:

- Most real systems use:

- One-to-many

- Many-to-many

## Primary Key & Foreign Key

### 🔹 Primary Key

- Unique identifier

- Cannot be null

### id INT PRIMARY KEY

### 🔹 Foreign Key

- Links tables

### user_id INT REFERENCES users(id)

### Backend Insight:

- Ensures data integrity

## Schema Design (Practical)

### Example: E-commerce System

### Users Table:

### id | name | email

### Products Table:

### id | name | price

### Orders Table:

### id | user_id | product_id

### Relationships:

- User → Orders

- Product → Orders

## Denormalization (Advanced Concept)

### 🔹 What is Denormalization?

### 👉 Adding redundancy for performance

### Example:

### Orders Tableuser_name stored directly

### Why Use?

- Faster queries

- Less joins

### Trade-off:

## Constraints (Data Integrity)

### Types:

- NOT NULL

- UNIQUE

- PRIMARY KEY

- FOREIGN KEY

### Example:

### email VARCHAR UNIQUE NOT NULL

### Backend Insight:

- Prevent invalid data

## ER Diagram (Conceptual Understanding)

### 🔹 What is ER Diagram?

### Shows:

- Entities (tables)

- Relationships

### Example:

### User → Order → Product

### Backend Insight:

- Used before building DB

## Real-World Examples

### Example 1: User-Order Relationship

### User → Orders (One-to-Many)

### Example 2: Many-to-Many

### Students ↔ Courses

### Example 3: Normalized Data

### Separate tables for:

- User

- Address

### Example 4: Denormalized Data

### Store extra fields for speed

## Code Examples (SQL Design)

### Create Table:

\`\`\`sql
CREATE TABLE users ( id INT PRIMARY KEY, name VARCHAR);
\`\`\`

### Foreign Key:

\`\`\`sql
CREATE TABLE orders ( id INT, user_id INT REFERENCES users(id));
\`\`\`

### Many-to-Many Table:

\`\`\`sql
CREATE TABLE student_course ( student_id INT, course_id INT);
\`\`\`

### Constraints:

### email VARCHAR UNIQUE NOT NULL

## Common Mistakes

### ❌ Not normalizing data

### ❌ Too many tables (over-normalization)

### ❌ Missing foreign keys

### ❌ Poor relationships

### ❌ No constraints

## Interview Questions with Answers

### Q1: What is normalization?

### Removing duplicate data

### Q2: What is 1NF?

### Atomic values

### Q3: What is 2NF?

### No partial dependency

### Q4: What is 3NF?

### No transitive dependency

### Q5: What is primary key?

### Unique identifier

### Q6: What is foreign key?

### Links tables

### Q7: One-to-many example?

### User → Orders

### Q8: What is denormalization?

### Adding redundancy for performance

## Summary (Quick Revision)

- Database design = organizing data

- Normalize data:

- 1NF

- 2NF

- 3NF

- Relationships:

- One-to-one

- One-to-many

- Many-to-many

- Keys:

- Primary

- Foreign

- Use constraints for integrity

### 👉 Master database design =

### ✔ Scalable systems

### ✔ Clean data structure

### ✔ Strong interview performance 🚀`,
    },
    {
      slug: "chapter-10-transactions-acid",
      title: "Transactions & ACID",
      summary: "In backend systems, data operations are not always simple.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 9,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Transactions & ACID

### (Transactions, ACID Properties, Isolation Levels, Deadlocks)

## Introduction (Why This Matters in Backend)

In backend systems, data operations are not always simple.

### 🔹 Real-World Scenario:

### User transfers money:

- Deduct from Account A

- Add to Account B

### Problem:

### If system crashes after step 1:

### ❌ Money lost

### ❌ Data inconsistency

### 👉 Solution:

### 👉 Transactions

### 🔹 What is a Transaction?

A transaction is a group of operations executed as a single unit.

### 👉 Either:

- All succeed ✅

- Or all fail ❌

### 👉 Transactions are critical for:

- Banking systems

- E-commerce orders

- Inventory updates

### 👉 If you master this:

- You build reliable backend systems

- You avoid data corruption

- You answer advanced interview questions

## Core Concepts

## What is a Transaction?

### Example:

\`\`\`sql
BEGIN;UPDATE accounts SET balance = balance - 100 WHERE id = 1;UPDATE accounts SET balance = balance + 100 WHERE id = 2;COMMIT;
\`\`\`

### 🔹 Key Commands:

### Example with Error:

\`\`\`sql
BEGIN;UPDATE accounts SET balance = balance - 100 WHERE id = 1;-- error happens hereROLLBACK;
\`\`\`

### 👉 No data is changed

## ACID Properties (Very Important)

ACID ensures reliable transactions.

### 🔹 A = Atomicity

### 👉 All operations succeed or none

### Example:

- Transfer money → both debit & credit must succeed

### 🔹 C = Consistency

### 👉 Database remains valid

### Example:

- Balance cannot be negative

### 🔹 I = Isolation

### 👉 Transactions don’t interfere

### Example:

- Two users updating same data

### 🔹 D = Durability

### 👉 Once committed → data is permanent

### Example:

- Data saved even after crash

### Backend Insight:

- ACID = foundation of reliable systems

## Isolation Levels (Interview Favorite)

Isolation defines how transactions interact.

### 🔹 Types:

### 🔹 Common Problems:

### Dirty Read

### Reading uncommitted data

### Non-repeatable Read

### Same query → different result

### Phantom Read

### New rows appear during query

### 🔹 Example:

\`\`\`sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
\`\`\`

### Backend Insight:

- Most systems use:

- Read Committed

- Repeatable Read

## Deadlocks (Very Important)

### 🔹 What is Deadlock?

### Two transactions waiting for each other:

### Example:

Transaction A → locks row 1 Transaction B → locks row 2 A waits for row 2 B waits for row 1

### 👉 Deadlock occurs

### 🔹 Result:

- System stuck

- DB kills one transaction

## Deadlock Prevention

### 🔹 Techniques:

### Access resources in same order

### Keep transactions short

### Avoid unnecessary locks

### Backend Insight:

- Deadlocks are common in high concurrency systems

## Transaction in Backend Code

### Example (Pseudo Code):

### try: begin_transaction() debit() credit() commit()except: rollback()

### Backend Framework Example:

### session.begin()try: session.commit()except: session.rollback()

## Locking Mechanism

### 🔹 What is Lock?

Lock prevents multiple transactions from modifying same data.

### Types:

### Backend Insight:

- Locks ensure consistency

- Too many locks reduce performance

## Real-World Transaction Example

### E-commerce Order:

- Check stock

- Deduct stock

- Create order

### 👉 All steps must succeed

### Example:

\`\`\`sql
BEGIN;UPDATE products SET stock = stock - 1 WHERE id = 1;INSERT INTO orders VALUES (...);COMMIT;
\`\`\`

## Real-World Examples

### Example 1: Bank Transfer

\`\`\`sql
UPDATE accounts SET balance = balance - 100;UPDATE accounts SET balance = balance + 100;
\`\`\`

### Example 2: Rollback Scenario

\`\`\`sql
ROLLBACK;
\`\`\`

### Example 3: Isolation Level

\`\`\`sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
\`\`\`

### Example 4: Deadlock Scenario

### Two transactions waiting for each other

## Code Examples (Backend Patterns)

### Pattern 1: Transaction Block

\`\`\`sql
BEGIN;...COMMIT;
\`\`\`

### Pattern 2: Rollback

\`\`\`sql
ROLLBACK;
\`\`\`

### Pattern 3: Isolation Level

\`\`\`sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
\`\`\`

### Pattern 4: Safe Operation

### try: commit()except: rollback()

## Common Mistakes

### ❌ Not using transactions

### ❌ Long-running transactions

### ❌ Ignoring isolation levels

### ❌ Not handling rollback

### ❌ Causing deadlocks

## Interview Questions with Answers

### Q1: What is a transaction?

### Group of operations executed together

### Q2: What is ACID?

- Atomicity

- Consistency

- Isolation

- Durability

### Q3: What is atomicity?

### All or nothing execution

### Q4: What is isolation?

### Transactions don’t interfere

### Q5: What is deadlock?

### Two transactions waiting for each other

### Q6: How to prevent deadlock?

- Same order

- Short transactions

### Q7: What is rollback?

### Undo changes

### Q8: What is isolation level?

### Defines transaction behavior

## Summary (Quick Revision)

- Transaction = group of operations

- ACID ensures reliability

- Use:

- BEGIN

- COMMIT

- ROLLBACK

- Isolation levels control concurrency

- Deadlocks occur in conflicts

### 👉 Master transactions =

### ✔ Reliable backend systems

### ✔ Safe data handling

### ✔ Strong interview performance 🚀`,
    },
    {
      slug: "chapter-11-sqlalchemy-orm",
      title: "SQLAlchemy ORM",
      summary: "So far, you learned SQL queries.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 10,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# SQLAlchemy ORM

### (Models, Relationships, Sessions, Query Optimization)

## Introduction (Why This Matters in Backend)

So far, you learned SQL queries.

But in real backend applications, we rarely write raw SQL everywhere.

### 👉 Instead, we use ORM (Object Relational Mapping)

### 🔹 What is ORM?

### ORM allows you to:

### 👉 Interact with database using Python code instead of SQL

### Example:

### SQL:

\`\`\`sql
SELECT * FROM users;
\`\`\`

### ORM:

### session.query(User).all()

### 👉 Benefits:

- Cleaner code

- Less SQL writing

- Easier maintenance

### 🔹 What is SQLAlchemy?

SQLAlchemy is the most popular ORM in Python.

### Used in:

- FastAPI

- Flask

- Production systems

### 👉 If you master SQLAlchemy:

- You can build real backend systems

- You understand database abstraction

- You perform well in interviews

## Core Concepts

## ORM vs Raw SQL

### Raw SQL:

- More control

- More complex

### ORM:

- Easier to use

- Pythonic

### 👉 Best practice:

- Use ORM for most cases

- Use raw SQL for complex queries

## Creating Models (Very Important)

### 🔹 What is a Model?

### Model = Python class representing a database table

### Example:

from sqlalchemy import Column, Integer, Stringfrom sqlalchemy.orm import declarative_baseBase = declarative_base()class User(Base): __tablename__ = "users" id = Column(Integer, primary_key=True) name = Column(String)

### 🔹 Explanation:

- __tablename__ → table name

- Column → table column

- primary_key=True → unique id

## Creating Database & Tables

\`\`\`sql
from sqlalchemy import create_engineengine = create_engine("sqlite:///test.db")Base.metadata.create_all(engine)
\`\`\`

### 👉 Creates database tables

## Sessions (Very Important)

### 🔹 What is Session?

### Session = connection between app and database

### Example:

from sqlalchemy.orm import sessionmakerSessionLocal = sessionmaker(bind=engine)session = SessionLocal()

### 🔹 Why Session?

- Execute queries

- Manage transactions

## CRUD Operations (Core Backend Work)

### 🔹 Create (Insert)

### user = User(name="Ali")session.add(user)session.commit()

### 🔹 Read (Select)

### users = session.query(User).all()

### 🔹 Filter

### user = session.query(User).filter(User.name == "Ali").first()

### 🔹 Update

### user.name = "Sara"session.commit()

### 🔹 Delete

### session.delete(user)session.commit()

## Relationships (Very Important)

### 🔹 One-to-Many Example

from sqlalchemy import ForeignKeyfrom sqlalchemy.orm import relationshipclass User(Base): __tablename__ = "users" id = Column(Integer, primary_key=True) orders = relationship("Order", back_populates="user")class Order(Base): __tablename__ = "orders" id = Column(Integer, primary_key=True) user_id = Column(Integer, ForeignKey("users.id")) user = relationship("User", back_populates="orders")

### 🔹 Key Concepts:

- ForeignKey → links tables

- relationship() → defines relation

### Backend Insight:

- Used in almost every real app

## Lazy vs Eager Loading

### 🔹 Lazy Loading

- Loads data when accessed

### 🔹 Eager Loading

- Loads data immediately

### Example:

from sqlalchemy.orm import joinedloadsession.query(User).options(joinedload(User.orders))

### Backend Insight:

- Avoid N+1 query problem

## Query Optimization (Important)

### 🔹 Bad Query:

### session.query(User).all()

### 🔹 Better:

### session.query(User.name).all()

### 🔹 Use Filters:

### session.query(User).filter(User.age > 25)

### Backend Insight:

- Fetch only required data

## Transactions in SQLAlchemy

### try: session.add(user) session.commit()except: session.rollback()

### Backend Insight:

- Always handle transactions

## Dependency Injection with DB (FastAPI)

\`\`\`py
def get_db(): db = SessionLocal() try: yield db finally: db.close()
\`\`\`

### Usage:

@app.get("/users")def get_users(db = Depends(get_db)): return db.query(User).all()

## Real-World Examples

### Example 1: Create User

### user = User(name="Ali")session.add(user)session.commit()

### Example 2: Fetch Users

### session.query(User).all()

### Example 3: Relationship Query

### user.orders

### Example 4: Filter Data

### session.query(User).filter(User.name == "Ali")

## Code Examples (Important Patterns)

### Pattern 1: Model

\`\`\`py
class User(Base):
\`\`\`

### Pattern 2: Query

### session.query(User)

### Pattern 3: Relationship

### relationship("Order")

### Pattern 4: Transaction

### commit()

## Common Mistakes

### ❌ Not closing sessions

### ❌ Fetching unnecessary data

### ❌ Ignoring relationships

### ❌ Not handling transactions

### ❌ N+1 query problem

## Interview Questions with Answers

### Q1: What is ORM?

### Mapping between objects and database

### Q2: What is SQLAlchemy?

### Python ORM

### Q3: What is a model?

### Class representing table

### Q4: What is session?

### Database connection

### Q5: What is relationship?

### Link between tables

### Q6: What is lazy loading?

### Load data when needed

### Q7: What is eager loading?

### Load data immediately

### Q8: Why use ORM?

### Cleaner code

## Summary (Quick Revision)

- ORM = database abstraction

- SQLAlchemy = popular ORM

- Use:

- models

- sessions

- relationships

- CRUD operations:

- Create

- Read

- Update

- Delete

- Optimize queries

### 👉 Master SQLAlchemy =

### ✔ Real backend development

### ✔ Clean database code

### ✔ Strong interview performance 🚀

## 🔹 PART 3: NoSQL & Caching`,
    },
    {
      slug: "chapter-12-mongodb",
      title: "MongoDB",
      summary: "So far, you learned SQL (relational databases).",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 11,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# MongoDB

### (Documents, Collections, CRUD Operations, Aggregation, When to Use NoSQL)

## Introduction (Why This Matters in Backend)

So far, you learned SQL (relational databases).

But modern backend systems often use NoSQL databases.

### 🔹 Why NoSQL?

### Relational databases have limitations:

- Fixed schema

- Difficult scaling

- Complex joins

### 👉 NoSQL solves these problems:

- Flexible schema

- Easy horizontal scaling

- Faster for some use cases

### 🔹 What is MongoDB?

MongoDB is a NoSQL document database.

### 👉 Data is stored as:

- JSON-like documents

### 🔹 Real Backend Use:

- Social media apps

- Real-time systems

- Logs & analytics

- Product catalogs

### 👉 If you master MongoDB:

- You can build modern backend systems

- You understand NoSQL vs SQL

- You perform well in interviews

## Core Concepts

## SQL vs NoSQL (Important Comparison)

### 🔹 Backend Insight:

- SQL → structured data

- NoSQL → flexible/unstructured data

## MongoDB Data Model

### 🔹 Database → Collection → Document

### Example:

\`\`\`sql
Database: shopCollection: usersDocument:{ "name": "Ali", "age": 25}
\`\`\`

### 🔹 Key Difference:

### SQL:

- Tables + rows

### MongoDB:

- Collections + documents

## Installing MongoDB (Quick Setup)

### Install:

### pip install pymongo

### Connect to MongoDB:

\`\`\`sql
from pymongo import MongoClientclient = MongoClient("mongodb://localhost:27017/")db = client["test_db"]
\`\`\`

## CRUD Operations (Very Important)

### 🔹 Create (Insert)

\`\`\`sql
collection = db["users"]collection.insert_one({"name": "Ali", "age": 25})
\`\`\`

### 🔹 Read (Find)

### users = collection.find()for user in users: print(user)

### 🔹 Filter Data

\`\`\`sql
collection.find({"age": 25})
\`\`\`

### 🔹 Update

\`\`\`sql
collection.update_one( {"name": "Ali"}, {"$set": {"age": 26}})
\`\`\`

### 🔹 Delete

\`\`\`sql
collection.delete_one({"name": "Ali"})
\`\`\`

## Query Operators

### Common Operators:

### Example:

\`\`\`sql
collection.find({"age": {"$gt": 20}})
\`\`\`

## Indexing in MongoDB

### 🔹 What is Index?

### Improves query speed

### Example:

### collection.create_index("name")

### Backend Insight:

- Important for large data

- Improves performance

## Aggregation (Advanced)

### 🔹 What is Aggregation?

### Used for:

- Data processing

- Analytics

### Example:

\`\`\`sql
pipeline = [ {"$match": {"age": {"$gt": 20}}}, {"$group": {"_id": "$age", "count": {"$sum": 1}}}]collection.aggregate(pipeline)
\`\`\`

### 🔹 Stages:

## Embedded vs Referenced Data

### 🔹 Embedded (Nested)

\`\`\`sql
{ "name": "Ali", "orders": [ {"product": "Phone"} ]}
\`\`\`

### 🔹 Referenced

\`\`\`sql
{ "user_id": 1}
\`\`\`

### Backend Insight:

## Schema Design in MongoDB

### 🔹 Flexible Schema:

\`\`\`sql
{ "name": "Ali"}{ "name": "Sara", "age": 30}
\`\`\`

### 👉 Documents can have different fields

### Backend Insight:

- Flexibility = power

- But requires careful design

## When to Use MongoDB

### Use MongoDB When:

- Data is unstructured

- Rapid development needed

- High scalability required

### Avoid MongoDB When:

- Complex joins needed

- Strict schema required

## Real-World Examples

### Example 1: User Collection

\`\`\`sql
collection.insert_one({"name": "Ali"})
\`\`\`

### Example 2: Query Data

\`\`\`sql
collection.find({"age": {"$gt": 25}})
\`\`\`

### Example 3: Update Data

### collection.update_one(...)

### Example 4: Aggregation

### collection.aggregate(pipeline)

## Code Examples (Backend Patterns)

### Pattern 1: Insert

### insert_one()

### Pattern 2: Query

### find()

### Pattern 3: Update

### update_one()

### Pattern 4: Aggregate

### aggregate()

## Common Mistakes

### ❌ No indexing

### ❌ Poor schema design

### ❌ Overusing embedded documents

### ❌ Ignoring data size

### ❌ Treating MongoDB like SQL

## Interview Questions with Answers

### Q1: What is MongoDB?

### NoSQL document database

### Q2: SQL vs MongoDB?

### Tables vs documents

### Q3: What is collection?

### Group of documents

### Q4: What is document?

### JSON-like data

### Q5: What is aggregation?

### Data processing pipeline

### Q6: Embedded vs referenced?

### Nested vs linked

### Q7: When to use MongoDB?

### Flexible data

### Q8: What is indexing?

### Improves query speed

## Summary (Quick Revision)

- MongoDB = NoSQL database

- Structure:

- Database

- Collection

- Document

- CRUD:

- insert

- find

- update

- delete

- Aggregation → advanced queries

- Index → performance

### 👉 Master MongoDB =

### ✔ Modern backend systems

### ✔ Flexible data handling

### ✔ Strong interview performance 🚀`,
    },
      ],
    },
    {
      slug: "part-2",
      title: "Part 2 — Chapters 13–15",
      summary: "Chapters 13 to 15 of Backend Development and Databases.",
      order: 2,
      difficulty: "beginner",
      estimatedMinutes: 90,
      tutorials: [
    {
      slug: "chapter-13-redis",
      title: "Redis",
      summary: "In real backend systems, speed is everything.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 12,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Redis

### (Caching, Data Structures, Performance Optimization, Real-World Use Cases)

## Introduction (Why This Matters in Backend)

In real backend systems, speed is everything.

### 🔹 Problem:

### Database queries can be:

- Slow

- Expensive

- Repeated

### 🔹 Example:

### User opens homepage:

- Backend fetches same data again and again

- Database gets overloaded

### 👉 Solution:

### 👉 Caching using Redis

### 🔹 What is Redis?

### Redis is an in-memory data store:

- Extremely fast

- Key-value based

- Used for caching, sessions, queues

### 🔹 Why Redis is Fast?

- Stores data in RAM (not disk)

- No complex joins

- Optimized for speed

### 👉 If you master Redis:

- You can build high-performance systems

- You reduce database load

- You pass system design interviews

## Core Concepts

## What is Caching?

### Caching means:

### 👉 Storing frequently used data for quick access

### 🔹 Without Cache:

### Client → Backend → Database → Response

### 🔹 With Cache:

### Client → Backend → Redis → Response ↓ (if miss) Database

### 👉 First request → DB

### 👉 Next requests → Redis

## Redis Basics

### 🔹 Key-Value Store

### key → value

### Example:

\`\`\`sql
"user:1" → {"name": "Ali"}
\`\`\`

### 🔹 Install Redis Client:

### pip install redis

### 🔹 Connect to Redis:

\`\`\`sql
import redisr = redis.Redis(host="localhost", port=6379, db=0)
\`\`\`

## Basic Operations

### 🔹 Set Value:

### r.set("name", "Ali")

### 🔹 Get Value:

### r.get("name")

### 🔹 Delete Key:

### r.delete("name")

### 🔹 Check Exists:

### r.exists("name")

## Expiration (TTL) — Very Important

### 🔹 What is TTL?

### Time-To-Live:

### 👉 Key expires automatically

### Example:

### r.setex("user:1", 60, "Ali")

### 👉 Expires in 60 seconds

### Backend Insight:

- Prevent stale data

- Automatically clears cache

## Redis Data Structures

Redis supports multiple data types.

### 🔹 1. String

### r.set("key", "value")

### 🔹 2. List

### r.lpush("tasks", "task1")

### 🔹 3. Set

### r.sadd("users", "Ali")

### 🔹 4. Hash (Very Important)

### r.hset("user:1", "name", "Ali")

### Backend Insight:

- Hash used for objects

- Lists used for queues

## Caching Pattern (Very Important)

### Example:

\`\`\`py
def get_user(user_id): cached = r.get(f"user:{user_id}") if cached: return cached data = get_from_db(user_id) r.setex(f"user:{user_id}", 60, data) return data
\`\`\`

### 🔹 Flow:

- Check Redis

- If exists → return

- Else → fetch DB

- Store in Redis

## Cache Invalidation (Important)

### 🔹 Problem:

### Data changes in DB but cache still old

### 🔹 Solution:

\`\`\`sql
r.delete(f"user:{user_id}")
\`\`\`

### Backend Insight:

- Always update or delete cache

## Redis for Sessions

### Example:

### r.setex("session:123", 3600, "user_id")

### Backend Use:

- Store login sessions

- Token storage

## Redis for Rate Limiting

### Example:

### count = r.incr("user:1")if count > 5: return "Too many requests"

### Backend Insight:

- Prevent abuse

- Used in APIs

## Redis as Message Queue

### Example:

### r.lpush("queue", "task")

### Backend Use:

- Background jobs

- Task processing

## When to Use Redis

### Use Redis For:

- Caching

- Sessions

- Rate limiting

- Queues

### Avoid Redis For:

- Permanent storage

- Large complex queries

## Real-World Examples

### Example 1: Cache User Data

### r.setex("user:1", 60, "Ali")

### Example 2: Session Storage

### r.set("session:1", "user_id")

### Example 3: Rate Limiting

### r.incr("user:1")

### Example 4: Queue

### r.lpush("tasks", "email")

## Code Examples (Important Patterns)

### Pattern 1: Cache

### r.setex(key, 60, value)

### Pattern 2: Get Cache

### r.get(key)

### Pattern 3: Delete Cache

### r.delete(key)

### Pattern 4: Increment

### r.incr(key)

## Common Mistakes

### ❌ Not setting TTL

### ❌ Storing large data

### ❌ Not invalidating cache

### ❌ Using Redis as primary DB

### ❌ Ignoring memory limits

## Interview Questions with Answers

### Q1: What is Redis?

### In-memory key-value store

### Q2: Why Redis is fast?

### Stored in RAM

### Q3: What is caching?

### Store frequent data

### Q4: What is TTL?

### Expiration time

### Q5: What is cache invalidation?

### Removing outdated data

### Q6: Redis use cases?

- Cache

- Sessions

- Rate limiting

### Q7: What is Redis data structure?

### String, list, set, hash

### Q8: Redis vs DB?

### Redis → fast, temporary

### DB → permanent

## Summary (Quick Revision)

- Redis = in-memory datastore

- Used for:

- caching

- sessions

- rate limiting

- Key features:

- fast

- TTL

- data structures

- Always:

- set expiration

- invalidate cache

### 👉 Master Redis =

### ✔ High-performance backend

### ✔ Scalable systems

### ✔ Strong interview advantage 🚀

## 🔹 PART 4: Backend Projects`,
    },
    {
      slug: "chapter-14-build-production-backend",
      title: "Build Production Backend",
      summary: "project/│├── app/│ ├── main.py│ ├── api/│ │ ├── routes.py│ ├── models/│ │ ├── user.py│ ├── schemas/│ │ ├── user.py│ ├── services/│ │ ├── user_service.py│ ├── db/│ │ ├── database.py│ ├── core/│ │ ├── security.py",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 13,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Build Production Backend

### (FastAPI Project, Auth System, Database Integration, Clean Architecture)

## Introduction (Why This Matters in Backend)

### So far, you have learned:

- FastAPI

- Databases (SQL + MongoDB)

- Redis

- Authentication

### 👉 Now comes the most important part:

### 👉 Building a Real Backend Project

### 🔹 Why Projects Matter?

### In interviews:

- Theory is not enough ❌

- Projects prove your skills ✅

### 🔹 What You Will Build:

### A Production-Ready Backend System with:

- User authentication

- Database integration

- Clean architecture

- Scalable structure

### 👉 If you master this:

- You become job-ready

- You can explain projects confidently

- You stand out in interviews

## Core Concepts

## Project Overview

### 🔹 Example Project:

### 👉 User Management System

### Features:

- Register user

- Login user

- Get user profile

- Secure endpoints

### 🔹 Tech Stack:

- FastAPI → API

- SQLAlchemy → Database

- Redis → Cache (optional)

- JWT → Authentication

## Project Structure (Very Important)

### Recommended Structure:

project/│├── app/│ ├── main.py│ ├── api/│ │ ├── routes.py│ ├── models/│ │ ├── user.py│ ├── schemas/│ │ ├── user.py│ ├── services/│ │ ├── user_service.py│ ├── db/│ │ ├── database.py│ ├── core/│ │ ├── security.py

### 🔹 Why Structure Matters?

- Easy to maintain

- Scalable

- Clean separation

## Database Setup

### database.py

\`\`\`sql
from sqlalchemy import create_enginefrom sqlalchemy.orm import sessionmakerengine = create_engine("sqlite:///test.db")SessionLocal = sessionmaker(bind=engine)
\`\`\`

### Dependency:

\`\`\`py
def get_db(): db = SessionLocal() try: yield db finally: db.close()
\`\`\`

## User Model

from sqlalchemy import Column, Integer, Stringfrom app.db.database import Baseclass User(Base): __tablename__ = "users" id = Column(Integer, primary_key=True) email = Column(String, unique=True) password = Column(String)

## Pydantic Schemas

from pydantic import BaseModelclass UserCreate(BaseModel): email: str password: str

## Authentication System

### Hash Password:

\`\`\`py
def hash_password(password): return pwd_context.hash(password)
\`\`\`

### Create Token:

\`\`\`py
def create_token(data): return jwt.encode(data, SECRET_KEY)
\`\`\`

## User Service (Business Logic)

\`\`\`py
def create_user(db, user): hashed = hash_password(user.password) new_user = User( email=user.email, password=hashed ) db.add(new_user) db.commit() return new_user
\`\`\`

### 🔹 Why Service Layer?

- Keeps routes clean

- Separates logic

## API Routes

### Register:

@app.post("/register")def register(user: UserCreate, db=Depends(get_db)): return create_user(db, user)

### Login:

\`\`\`sql
@app.post("/login")def login(): return {"token": "abc"}
\`\`\`

### Protected Route:

### @app.get("/profile")def profile(user=Depends(get_current_user)): return user

## Clean Architecture (Important)

### Layers:

- Routes → API layer

- Services → business logic

- Models → database

- Schemas → validation

### Backend Insight:

- Never mix all logic in one place

## Error Handling

from fastapi import HTTPExceptionif not user: raise HTTPException(status_code=404)

## Adding Redis (Optional)

### r.setex("user:1", 60, "Ali")

### Use:

- Cache user data

- Improve performance

## Production Best Practices

### 🔹 Use Environment Variables

### 🔹 Use Logging

### 🔹 Validate Inputs

### 🔹 Use HTTPS

### 🔹 Proper Error Handling

## Real-World Example (Flow)

### User Registration Flow:

- User sends data

- Backend validates

- Password hashed

- Stored in DB

### Login Flow:

- Verify password

- Generate JWT

- Return token

### Protected Route Flow:

- Receive token

- Validate token

- Return data

## Code Examples (Important Patterns)

### Pattern 1: Dependency Injection

### db = Depends(get_db)

### Pattern 2: Service Layer

### create_user(db, user)

### Pattern 3: Authentication

### get_current_user()

### Pattern 4: Response Format

\`\`\`sql
return {"status": "success"}
\`\`\`

## Common Mistakes

### ❌ Mixing business logic in routes

### ❌ Not hashing passwords

### ❌ Poor project structure

### ❌ No validation

### ❌ No authentication

## Interview Questions with Answers

### Q1: How to structure backend project?

### Use layered architecture

### Q2: What is service layer?

### Business logic layer

### Q3: How to secure API?

### JWT authentication

### Q4: How to connect DB?

### Using SQLAlchemy

### Q5: What is dependency injection?

### Inject DB/session

### Q6: Why use Pydantic?

### Validation

### Q7: What is clean architecture?

### Separation of concerns

### Q8: What makes backend production-ready?

- Security

- Structure

- Performance

## Summary (Quick Revision)

- Build real backend project

- Use:

- FastAPI

- SQLAlchemy

- JWT

- Follow structure:

- routes

- services

- models

- Always:

- validate input

- hash passwords

- use clean architecture

### 👉 Master this chapter =

### ✔ Real backend development

### ✔ Strong portfolio project

### ✔ Interview-ready 🚀`,
    },
    {
      slug: "chapter-15-optimization",
      title: "Optimization",
      summary: "Building a backend is not enough.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 14,
      tags: "backend-development-and-databases",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Optimization

### (Caching, Query Optimization, Performance Tuning, Scaling Basics)

## Introduction (Why This Matters in Backend)

Building a backend is not enough.

👉 It must be fast, efficient, and scalable.

### 🔹 Real Problems in Backend Systems:

- Slow APIs

- High database load

- Server crashes under traffic

- Poor user experience

### 👉 Example:

### Without optimization:

- API takes 3 seconds ❌

### With optimization:

- API takes 100ms ✅

### 👉 This is the difference between:

- Beginner backend ❌

- Production backend ✅

### 👉 If you master optimization:

- Your systems handle real users

- You impress interviewers

- You build scalable applications

## Core Concepts

## What is Optimization?

### Optimization means:

### 👉 Improving performance and efficiency

### 🔹 Areas of Optimization:

- Database queries

- API response time

- Memory usage

- Network calls

## Caching (Very Important)

### 🔹 Why Caching?

### Repeated queries slow down system

### 🔹 Solution:

### Store result in Redis

### Example:

\`\`\`py
def get_user(user_id): cached = r.get(f"user:{user_id}") if cached: return cached user = db.query(User).get(user_id) r.setex(f"user:{user_id}", 60, user) return user
\`\`\`

### 🔹 Benefits:

- Faster response

- Reduced DB load

## Database Query Optimization

### 🔹 Problem:

\`\`\`sql
SELECT * FROM users;
\`\`\`

### 🔹 Solution:

\`\`\`sql
SELECT name FROM users WHERE age > 25;
\`\`\`

### 🔹 Best Practices:

- Avoid SELECT *

- Use WHERE clause

- Use indexes

### 🔹 Index Example:

\`\`\`sql
CREATE INDEX idx_age ON users(age);
\`\`\`

## N+1 Query Problem

### 🔹 What is N+1?

### users = db.query(User).all()for user in users: print(user.orders)

### 👉 Many queries executed

### 🔹 Solution:

from sqlalchemy.orm import joinedloaddb.query(User).options(joinedload(User.orders))

### Backend Insight:

- Common performance issue

## API Optimization

### 🔹 Reduce Response Size

\`\`\`sql
return {"name": user.name}
\`\`\`

### 🔹 Use Pagination

### @app.get("/users")def get_users(limit: int = 10): return users[:limit]

### 🔹 Use Compression (Concept)

- Reduce payload size

## Async Programming (Performance Boost)

### Example:

\`\`\`sql
@app.get("/")async def home(): return {"message": "fast"}
\`\`\`

### 🔹 Why Async?

- Handles multiple requests

- Improves throughput

### Backend Insight:

- Best for I/O operations

## Connection Pooling

### 🔹 What is Connection Pool?

### Reuse database connections

### Benefits:

- Faster DB access

- Reduced overhead

### Backend Insight:

- Used in production systems

## Load Balancing (Basic Concept)

### 🔹 What is Load Balancing?

### Distribute traffic across servers

### Example:

### User → Load Balancer → Server 1 / Server 2

### Backend Benefit:

- Prevent overload

- Improve reliability

## Horizontal vs Vertical Scaling

### 🔹 Vertical Scaling:

- Increase server power

### 🔹 Horizontal Scaling:

- Add more servers

### Backend Insight:

- Modern systems use horizontal scaling

## Monitoring & Logging

### 🔹 Why Monitor?

- Detect slow queries

- Identify issues

### Example:

\`\`\`sql
print("Request took X ms")
\`\`\`

### Backend Insight:

- Essential for production

## Real-World Examples

### Example 1: Cache Data

### r.setex("user:1", 60, user)

### Example 2: Optimize Query

\`\`\`sql
SELECT name FROM users;
\`\`\`

### Example 3: Async API

\`\`\`sql
async def route():
\`\`\`

### Example 4: Pagination

### limit=10

## Code Examples (Important Patterns)

### Pattern 1: Cache First

### if cached: return cached

### Pattern 2: Efficient Query

\`\`\`sql
SELECT column FROM table;
\`\`\`

### Pattern 3: Async Function

\`\`\`sql
async def function():
\`\`\`

### Pattern 4: Pagination

### limit, offset

## Common Mistakes

### ❌ Not using caching

### ❌ Using SELECT *

### ❌ No pagination

### ❌ Ignoring N+1 problem

### ❌ No monitoring

## Interview Questions with Answers

### Q1: What is caching?

### Store data for faster access

### Q2: What is N+1 problem?

### Multiple unnecessary queries

### Q3: How to optimize queries?

### Indexes + filtering

### Q4: What is connection pooling?

### Reusing DB connections

### Q5: Async vs sync?

### Async handles multiple requests

### Q6: What is load balancing?

### Distribute traffic

### Q7: Horizontal vs vertical scaling?

### More servers vs bigger server

### Q8: Why pagination?

### Limit data

## Summary (Quick Revision)

- Optimization = performance improvement

- Use:

- caching

- indexing

- async

- Avoid:

- SELECT *

- N+1 queries

- Scale using:

- load balancing

- horizontal scaling

### 👉 Master optimization =

### ✔ High-performance backend

### ✔ Scalable systems

### ✔ Strong interview advantage 🚀`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 — Chapters 1–12", title: "FastAPI Basics", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 0, tutorialSlug: "chapter-1-fastapi-basics" },
  { part: "Part 1 — Chapters 1–12", title: "Dependency Injection", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 1, tutorialSlug: "chapter-2-dependency-injection" },
  { part: "Part 1 — Chapters 1–12", title: "Authentication & Security", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 2, tutorialSlug: "chapter-3-authentication-security" },
  { part: "Part 1 — Chapters 1–12", title: "Middleware & CORS", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 3, tutorialSlug: "chapter-4-middleware-cors" },
  { part: "Part 1 — Chapters 1–12", title: "API Design Best Practices", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 4, tutorialSlug: "chapter-5-api-design-best-practices" },
  { part: "Part 1 — Chapters 1–12", title: "Flask Essentials", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 5, tutorialSlug: "chapter-6-flask-essentials" },
  { part: "Part 1 — Chapters 1–12", title: "SQL Fundamentals", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 6, tutorialSlug: "chapter-7-sql-fundamentals" },
  { part: "Part 1 — Chapters 1–12", title: "Advanced SQL", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 7, tutorialSlug: "chapter-8-advanced-sql" },
  { part: "Part 1 — Chapters 1–12", title: "Database Design", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 8, tutorialSlug: "chapter-9-database-design" },
  { part: "Part 1 — Chapters 1–12", title: "Transactions & ACID", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 9, tutorialSlug: "chapter-10-transactions-acid" },
  { part: "Part 1 — Chapters 1–12", title: "SQLAlchemy ORM", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 10, tutorialSlug: "chapter-11-sqlalchemy-orm" },
  { part: "Part 1 — Chapters 1–12", title: "MongoDB", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 11, tutorialSlug: "chapter-12-mongodb" },
  { part: "Part 2 — Chapters 13–15", title: "Redis", subtitle: "Part of Part 2 — Chapters 13–15 · Beginner", order: 12, tutorialSlug: "chapter-13-redis" },
  { part: "Part 2 — Chapters 13–15", title: "Build Production Backend", subtitle: "Part of Part 2 — Chapters 13–15 · Beginner", order: 13, tutorialSlug: "chapter-14-build-production-backend" },
  { part: "Part 2 — Chapters 13–15", title: "Optimization", subtitle: "Part of Part 2 — Chapters 13–15 · Beginner", order: 14, tutorialSlug: "chapter-15-optimization" },
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
    where: { slug: "backend-development-and-databases-path" },
    create: { slug: "backend-development-and-databases-path", title: "Backend Development and Databases Roadmap", tagline: "The complete roadmap for Backend Development and Databases - all parts in order.", description: "The complete roadmap for Backend Development and Databases - all parts in order.", icon: "Code2", color: "oklch(0.66 0.16 160)", difficulty: 'intermediate', estimatedHours: 2, published: true },
    update: { title: "Backend Development and Databases Roadmap", tagline: "The complete roadmap for Backend Development and Databases - all parts in order.", description: "The complete roadmap for Backend Development and Databases - all parts in order.", icon: "Code2", color: "oklch(0.66 0.16 160)", difficulty: 'intermediate', estimatedHours: 2 },
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
