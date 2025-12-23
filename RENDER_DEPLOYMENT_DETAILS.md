# 📄 Detailed Render Deployment Guide (Backend)

Since you have already deployed the **Auth Service**, follow this exact order for the rest. The order matters because some services need the URLs of others!

---

## 📋 Summary of What You Need

For every service below, use these standard settings unless specified:

- **Repository**: `Microservice` (Your GitHub Repo)
- **Environment**: `Node`
- **Region**: Same as your Auth Service (e.g., Singapore)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

---

## 1️⃣ Deploy "User Service"

_(Independent Service)_

1.  **Create New Web Service** on Render.
2.  **Root Directory**: `services/user-service`
3.  **Name**: `micro-user-service`
4.  **Environment Variables**:
    - `PORT`: `10000`
5.  **Click Create**.
6.  **Copy the URL** once it's live (e.g., `https://micro-user-service.onrender.com`).
    - _Save this as `USER_SERVICE_URL` for later._

---

## 2️⃣ Deploy "Notification Service"

_(Independent Service)_

1.  **Create New Web Service**.
2.  **Root Directory**: `services/notification-service`
3.  **Name**: `micro-notification-service`
4.  **Environment Variables**:
    - `PORT`: `10000`
5.  **Click Create**.
6.  **Copy the URL** (e.g., `https://micro-notification-service.onrender.com`).
    - _Save this as `NOTIFICATION_SERVICE_URL` for later._

---

## 3️⃣ Deploy "Task Service"

_(Depends on Notification Service)_

1.  **Create New Web Service**.
2.  **Root Directory**: `services/task-service`
3.  **Name**: `micro-task-service`
4.  **Environment Variables**:
    - `PORT`: `10000`
    - `JWT_SECRET`: `dev-secret-key` (Or whatever you used for Auth Service)
    - `NOTIFICATION_SERVICE_URL`: `<Paste Notification URL from Step 2>`
      - Example: `https://micro-notification-service.onrender.com`
5.  **Click Create**.
6.  **Copy the URL** (e.g., `https://micro-task-service.onrender.com`).
    - _Save this as `TASK_SERVICE_URL` for later._

---

## 4️⃣ Deploy "API Gateway"

_(The Master Service - Depends on EVERYTHING)_

1.  **Create New Web Service**.
2.  **Root Directory**: `services/api-gateway`
3.  **Name**: `micro-api-gateway`
4.  **Environment Variables** (Add all of these!):
    - `PORT`: `10000`
    - `AUTH_SERVICE_URL`: `<Paste URL of your existing Auth Service>`
    - `USER_SERVICE_URL`: `<Paste URL from Step 1>`
    - `TASK_SERVICE_URL`: `<Paste URL from Step 3>`
5.  **Click Create**.
6.  **Copy the Final Gateway URL** (e.g., `https://micro-api-gateway.onrender.com`).

---

## 🏁 Final Step: Frontend Connection

Now go to your **Vercel** Project for the frontend:

1.  Go to **Settings** -> **Environment Variables**.
2.  Add/Edit `VITE_API_URL`.
3.  Set Value: `<Paste URL of API Gateway from Step 4>`
4.  **Redeploy** the Frontend (Go to Deployments -> Redeploy) so it picks up the new Gateway URL.

**Done!** Your distributed system is live. 🚀
