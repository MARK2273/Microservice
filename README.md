# 🏗️ Microservices Mini SaaS Platform

A production-grade, full-stack application designed to demonstrate a robust **Microservices Architecture**. It features a modern **React** frontend communicating with a distributed **Node.js** backend via an **API Gateway**, fully containerized with **Docker**.

## 🌟 Key Features

- **Microservices Architecture**: Independent services for Auth, User Management, Tasks, and Notifications.
- **API Gateway Pattern**: Single entry point using `http-proxy-middleware` to route requests.
- **Containerization**: Full `docker-compose` setup for one-command startup.
- **Authentication**: Secure JWT-based auth flow with password hashing (bcrypt).
- **Event-Driven Communication**: Asynchronous messaging simulation between services.
- **Modern Frontend**: React, TypeScript, Tailwind CSS, and Vite.
- **Type Safety**: End-to-end TypeScript implementation.

---

## 🏛️ Architecture Overview

The system is split into logical domains. The **Frontend** never communicates directly with internal services; all traffic flows through the **API Gateway**.

```ascii
                                   +-------------------+
                                   |   React Frontend  |
                                   |  (localhost:3000) |
                                   +---------+---------+
                                             |
                                    HTTP / API Calls
                                             |
                                   +---------v---------+
                                   |    API Gateway    |
                                   |  (localhost:8080) |
                                   +----+----+----+----+
                                        |    |    |
          +-----------------------------+    |    +-----------------------------+
          |                                  |                                  |
+---------v---------+              +---------v---------+              +---------v---------+
|    Auth Service   |              |    User Service   |              |    Task Service   |
|  (localhost:3001) |              |  (localhost:3002) |              |  (localhost:3003) |
+-------------------+              +-------------------+              +---------+---------+
                                                                                |
                                                                          Async Event
                                                                         (Simulated)
                                                                                |
                                                                      +---------v---------+
                                                                      | Notification Svc  |
                                                                      |  (localhost:3004) |
                                                                      +-------------------+
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** (Required)
- **Node.js v18+** (Optional, for local dev without Docker)

### Installation & Run

1.  **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Start with Docker Compose**
    The entire system is orchestrated with Docker. Run:

    ```bash
    docker-compose up --build
    ```

    _Wait for a minute for all containers to initialize._

3.  **Access the Application**
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **API Gateway**: [http://localhost:8080](http://localhost:8080) (for API testing)

---

## 📂 Project Structure

```
root/
├── frontend/                 # React + TypeScript + Vite + Tailwind
├── services/
│   ├── api-gateway/          # Express Proxy
│   ├── auth-service/         # JWT Auth & Registration
│   ├── user-service/         # User Profile Management
│   ├── task-service/         # Task CRUD (Business Logic)
│   └── notification-service/ # Async Event Handler
├── shared/                   # Shared types and utilities (Planned)
└── docker-compose.yml        # Orchestration Config
```

---

## 🔌 API Endpoints

All requests should be sent to the **API Gateway** (`http://localhost:8080`).

### **Auth**

- `POST /api/auth/register` - Create a new user.
- `POST /api/auth/login` - Login and receive JWT.

### **Users**

- `GET /api/users/me` - Get current user profile (requires Bearer Token).

### **Tasks**

- `GET /api/tasks` - List all tasks for current user.
- `POST /api/tasks` - Create a new task.
- `PUT /api/tasks/:id` - Update a task.
- `DELETE /api/tasks/:id` - Delete a task.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Axios, React Router, Vite.
- **Backend**: Node.js, Express.js, TypeScript.
- **Infrastructure**: Docker, Docker Compose.
- **Security**: JSON Web Tokens (JWT), Bcrypt.

---

## 🐛 Troubleshooting

- **Build Failures**: If `docker-compose` fails, try running `docker system prune` to clear cache and retry.
- **Port Conflicts**: Ensure ports `3000`, `8080`, `3001`–`3004` are free on your machine.
- **Connection Refused**: On Windows/Mac, Docker needs a moment to spin up. If the frontend immediately fails to connect, wait 10 seconds and refresh.

---

**Happy Coding!** 🚀
