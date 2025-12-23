import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004';

app.use(cors());
app.use(express.json());

interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

const tasks: Task[] = [];

// Middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Helper to emit event
const emitEvent = async (eventType: string, payload: any) => {
  try {
    // In a real system, this would publish to a message queue (RabbitMQ/Kafka)
    // Here we simulate async by not awaiting the HTTP call or just firing it off.
    console.log(`Emitting event: ${eventType}`);
    axios.post(`${NOTIFICATION_SERVICE_URL}/events`, {
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    }).catch(err => console.error('Failed to emit event:', err.message));
  } catch (error) {
    console.error('Error emitting event:', error);
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'Task Service is running' });
});

app.use(authenticate);

// List Tasks
app.get('/', (req: Request, res: Response) => {
  const user = (req as any).user;
  const userTasks = tasks.filter(t => t.userId === user.userId);
  res.json(userTasks);
});

// Create Task
app.post('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask: Task = {
    id: Math.random().toString(36).substring(7),
    title,
    description: description || '',
    userId: user.userId,
    status: 'PENDING'
  };

  tasks.push(newTask);
  
  // Emit event
  await emitEvent('TASK_CREATED', {
    taskId: newTask.id,
    title: newTask.title,
    userId: user.userId,
    email: user.email // Assuming user object has email from token
  });

  res.status(201).json(newTask);
});

// Update Task
app.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const taskIndex = tasks.findIndex(t => t.id === id && t.userId === user.userId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const { title, description, status } = req.body;
  
  if (title) tasks[taskIndex].title = title;
  if (description) tasks[taskIndex].description = description;
  if (status) tasks[taskIndex].status = status;

  res.json(tasks[taskIndex]);
});

// Delete Task
app.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const taskIndex = tasks.findIndex(t => t.id === id && t.userId === user.userId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});
