# 🚀 Free Deployment Guide for Microservices

Deploying a microservices architecture for **free** is challenging because most platforms charge per "container" or "service". Since this project has **1 Frontend + 5 Backend Services**, running them all separately can hit limits quickly.

The best current strategy for a 100% free demo is:

- **Frontend**: Deployed on **Vercel** (Excellent, fast, free).
- **Backends**: Deployed on **Render.com** (Allows multiple free services).

---

## ⚠️ Important Caveats for Free Tier

1.  **"Spin Down"**: On Render's free tier, your services will go to "sleep" after 15 minutes of inactivity.
2.  **Cold Starts**: When you open the app after a break, the API Gateway needs to wake up (30s), then the Auth Service needs to wake up (30s). **The first request will timeout or take ~1 minute.** This is normal for free hosting.
3.  **No Docker Support on Free**: Render's free tier works best with **Node.js Native** environments, not custom Docker images. We will deploy them as Node apps.

---

## 🟢 Part 1: Prepare Your Code

1.  **Push to GitHub**: Make sure your latest code is on GitHub (User: `MARK2273`, Repo: `Microservice`).

---

## 🔵 Part 2: Deploy Backend Services (Render.com)

You need to create 5 separate "Web Services" on Render, one for each folder in `services/`.

### Step-by-Step for ONE Service (e.g., Auth Service)

1.  Sign up/Login to [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub Repository (`Microservice`).
4.  **Configuration**:
    - **Name**: `micro-auth-service` (Example)
    - **Region**: Choose one close to you (e.g., Singapore/Oregon).
    - **Branch**: `main`
    - **Root Directory**: `services/auth-service` (⚠️ VERY IMPORTANT)
    - **Runtime**: Node
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
    - **Env Variables**:
      - `JWT_SECRET`: `your-secure-secret`
      - `PORT`: `10000` (Render acts weird if you don't use their default or let it bind dynamically, but usually it forces internal port mapping. Just ensure your code reads `process.env.PORT`).
5.  Click **Create Web Service**.
6.  **Copy the URL**: You will get something like `https://micro-auth-service.onrender.com`.

### 🔁 Repeat for All Services

You need to do this 5 times.

1.  **Auth Service** -> Get URL (e.g., `AUTH_URL`)
2.  **User Service** -> Get URL (e.g., `USER_URL`)
3.  **Task Service** -> Get URL (e.g., `TASK_URL`)
    - _Env Var needed_: `NOTIFICATION_SERVICE_URL` = `https://your-notification-service.onrender.com`
4.  **Notification Service** -> Get URL (e.g., `NOTIF_URL`)
5.  **API Gateway** -> This is the most important one.
    - _Root Directory_: `services/api-gateway`
    - _Env Vars_:
      - `AUTH_SERVICE_URL`: `https://micro-auth-service.onrender.com`
      - `USER_SERVICE_URL`: `https://micro-user-service.onrender.com`
      - `TASK_SERVICE_URL`: `https://micro-task-service.onrender.com`

**Result**: You now have one main backend URL (The API Gateway URL, e.g., `https://my-gateway.onrender.com`).

---

## 🟣 Part 3: Deploy Frontend (Vercel)

1.  Sign up/Login to [Vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub Repository.
4.  **Project Configuration**:
    - **Framework Preset**: Vite
    - **Root Directory**: Edit this -> Select `frontend`.
5.  **Environment Variables**:
    - `VITE_API_URL`: `https://my-gateway.onrender.com` (The Render URL from Step 2.5).
6.  Click **Deploy**.

---

## ✅ Final Verification

1.  Open your Vercel App URL (e.g., `https://microservice-frontend.vercel.app`).
2.  Go to Register.
3.  _Wait..._ (Remember the cold start!). The first request might fail. Refresh and try again.
4.  Once awake, it should work exactly like localhost!

## 💡 Pro Tip for "Free" Microservices

If managing 5 services is too annoying (or you hit account limits):
**Merge them into a Monolith.**
Move all the routes from `services/*/src/index.ts` into a single Express app in `services/api-gateway`. This way, you only need **1 Render Service** and **1 Vercel Frontend**. You lose the "Microservice" architecture but keep the functionality for free with better performance.
