import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Notification Service is running' });
});

// Event Listener Endpoint
app.post('/events', (req: Request, res: Response) => {
  const event = req.body;
  
  console.log('Received Event:', JSON.stringify(event, null, 2));
  
  // Simulate processing
  if (event.type === 'TASK_CREATED') {
    console.log(`Sending email to ${event.payload.email} for Task ${event.payload.taskId}`);
  }

  res.status(200).json({ status: 'received' });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
