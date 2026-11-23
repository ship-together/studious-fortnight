import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api', apiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`[studious-fortnight] API running on http://localhost:${PORT}`);
});
