import express, { Application } from 'express';
import tasksRoutes from './routes/tasksRoutes';

const app: Application = express();
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});
app.use('/tasks', tasksRoutes);

export default app;