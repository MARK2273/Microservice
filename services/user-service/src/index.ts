import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

app.use(cors());
app.use(express.json());

// Mock Data
const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'user' }
];

// Middleware to extract user from token
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (!err) {
        (req as any).user = user;
      }
      // We don't block here, just attach if valid.
      // Individual routes decide if they need it.
      next();
    });
  } else {
    next();
  }
};

app.use(authenticate);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

// Get Current User Profile
app.get('/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // In real app, fetch fresh data from DB using user.userId
  // Here we just accept the token data or mock lookup
  const foundUser = users.find(u => u.email === user.email); 
  
  if (foundUser) {
    res.json(foundUser);
  } else {
    // Fallback if not in mock DB but has valid token (e.g. newly registered)
    res.json({
        id: user.userId,
        name: user.name,
        email: user.email,
        note: "Data from token (Mock DB sync missing)"
    });
  }
});

// Get User by ID
app.get('/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
