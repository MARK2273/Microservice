import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running' });
});

// Proxy routes
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const taskServiceUrl = process.env.TASK_SERVICE_URL || 'http://localhost:3003';

console.log(`Setting up proxies:
  Auth: ${authServiceUrl}
  User: ${userServiceUrl}
  Task: ${taskServiceUrl}
`);

// Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
  target: authServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Auth] Proxying ${req.method} ${req.path} -> ${authServiceUrl}`);
  },
  onError: (err, req, res) => {
    console.error(`[Auth] Proxy Error: ${err.message}`);
    res.status(500).json({ message: 'Proxy Error', error: err.message });
  }
}));

// User Service Proxy
app.use('/api/users', createProxyMiddleware({
  target: userServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[User] Proxying ${req.method} ${req.path} -> ${userServiceUrl}`);
  },
  onError: (err, req, res) => {
    console.error(`[User] Proxy Error: ${err.message}`);
    res.status(500).json({ message: 'Proxy Error', error: err.message });
  }
}));

// Task Service Proxy
app.use('/api/tasks', createProxyMiddleware({
  target: taskServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/tasks': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Task] Proxying ${req.method} ${req.path} -> ${taskServiceUrl}`);
  },
  onError: (err, req, res) => {
    console.error(`[Task] Proxy Error: ${err.message}`);
    res.status(500).json({ message: 'Proxy Error', error: err.message });
  }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
