
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import oddsRouter from './routes/odds.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/users', usersRouter);
app.use('/api/odds', oddsRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
