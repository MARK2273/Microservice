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
    '^/api/auth': '', // remove /api/auth prefix when forwarding
  },
}));

// User Service Proxy
app.use('/api/users', createProxyMiddleware({
  target: userServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '',
  },
}));

// Task Service Proxy
app.use('/api/tasks', createProxyMiddleware({
  target: taskServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/tasks': '',
  },
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
