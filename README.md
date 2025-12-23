# Microservices Mini SaaS Platform

A comprehensive full-stack application demonstrating microservices architecture using Node.js, TypeScript, and React.

## Architecture

This project mimics a real-world SaaS platform with the following components:

- **Frontend**: React (TypeScript, Vite, Tailwind) - The user interface.
- **API Gateway**: Single entry point that routes requests to backend services.
- **Auth Service**: Handles user registration and authentication (JWT).
- **User Service**: Manages user profiles.
- **Task Service**: Core domain service for managing tasks/projects.
- **Notification Service**: Asynchronous service listening for system events.

### Communication

- **Synchronous**: Frontend -> API Gateway -> Generic Service (HTTP/REST)
- **Asynchronous**: Services emit events (simulated or real message queue) --> Notification Service

## Prerequisites

- Docker Desktop
- Node.js (v18+) (for local development outside Docker)

## Getting Started

1. **Clone the repository** (if you haven't already)
2. **Run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   This will start all services.

3. **Access the Application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080

## Service Details

| Service | Port | Description |
|Col1|Col2|Col3|
|---|---|---|
| Frontend | 3000 | React UI |
| API Gateway | 8080 | Entry point |
| Auth Service | 3001 | Authentication |
| User Service | 3002 | User Profiles |
| Task Service | 3003 | Task Management |
| Notification Service | 3004 | Async Notifications |

## Development

Each service acts as a standalone project. You can navigate to `services/<service-name>` and run `npm install` and `npm run dev` to work on them individually (configuring ports/envs appropriately).
