# 🎓 The Full-Stack Developer's Guide to Microservices

_(Using this project as a practical example)_

## 👋 Introduction

If you are a Full-Stack developer used to building Monoliths (e.g., one big Express app with all routes), moving to Microservices can be confusing.

**Think of a Monolith like a general store.** One cashier handles everything: payments, complaints, returns, and inventory checking. If the line gets long, everything slows down.

**Think of Microservices like a Shopping Mall.**

- There is a security guard at the entrance (API Gateway).
- There is a dedicated store for Shoes (Task Service).
- There is a dedicated bank for Money (Auth Service).
- If the Shoe store is busy, the Bank is practically unaffected.

---

## 🏗️ How This Project is Structured

In a standard Monolith, your folder structure looks like this:

```
/src
  /controllers
    authController.js
    taskController.js
    userController.js
```

All these controllers share the same memory, same server port, and usually the same database connection.

**In this Microservices Project**, we physically separated them into different folders (which become different _servers_):

### 1. The "Front Door": API Gateway

- **Location**: `services/api-gateway`
- **Concept**: Since we have 4-5 different backend servers running on different ports (3001, 3002...), the Frontend (`localhost:3000`) shouldn't need to know all of them.
- **How it works**: The frontend sends EVERYTHING to the Gateway (`localhost:8080`). The Gateway looks at the URL:
  - `/api/auth/*` -> Forwards to **Auth Service** (Port 3001)
  - `/api/tasks/*` -> Forwards to **Task Service** (Port 3003)
- **Code**: Look at `services/api-gateway/src/index.ts`. It uses `http-proxy-middleware`.

### 2. The "Identity Card Issuer": Auth Service

- **Location**: `services/auth-service`
- **Responsibility**: Only handles Login and Registration. It issues a **JWT Token** (the ID card).
- **Microservice Rule**: In a real app, this service would have its _own_ database just for credentials. No other service is allowed to read that DB directly.

### 3. The "Worker": Task Service

- **Location**: `services/task-service`
- **Responsibility**: Handles the actual business logic (Creating tasks).
- **Isolation**: If this service crashes because of a bad bug, users can still Login and viewing their Profile, because those are on different servers!

---

## 🗣️ How Services Talk to Each Other

This is the biggest change from Monoliths. You can't just import a function like `import { getUser } from './userController'`. The code serves live on different computers (containers).

### Pattern A: Synchronous (Request/Response)

- **Analogy**: I call you on the phone and wait for you to answer.
- **In User Service**: When you call `/me`, the User Service might need to check if the token is valid. It could send an HTTP request to the Auth Service.
- **Pros**: Simple.
- **Cons**: If Auth Service is down, User Service fails too.

### Pattern B: Asynchronous (Events)

- **Analogy**: I send you an email. I don't wait for you to read it. I go back to work.
- **Example in this project**:
  1.  User creates a Task in **Task Service**.
  2.  Task Service saves it to its DB.
  3.  Task Service "shouts" (Emits an event): _"A NEW TASK WAS CREATED!"_
  4.  **Notification Service** is listening. It hears the shout and sends an email.
- **Why?**: If the Notification Service is broken, the user can still create tasks successfully. The emails will just be delayed. This makes the system robust.

---

## 🐳 Why Docker?

In a monolith, you run `npm start`.
Here, we have 6 applications (Frontend + 5 Backends). Running `npm start` in 6 different terminals is a nightmare.

**Docker Compose** (`docker-compose.yml`) is the orchestra conductor. It says:
_"I need 1 Auth Service, 1 Task Service, 1 Gateway..."_ and spins them all up for you on the correct network.

---

## 🧪 Try it yourself

1.  Go to `services/task-service/src/index.ts`.
2.  Find the `emitEvent` function.
3.  Change the console log.
4.  Run `docker-compose up --build`.
5.  Create a task in the UI and watch the logs. You'll see the message travel from one "computer" (Task Svc) to another "computer" (Notification Svc).
