
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import oddsRouter from './routes/odds.js';
import videosRouter from './routes/videos.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/users', usersRouter);
app.use('/api/odds', oddsRouter);
app.use('/api/videos', videosRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
