import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Mock users endpoint for development
app.get('/api/users', (_req, res) => {
  res.json([
    { id: '1', email: 'demo@example.com', firstName: 'Demo', lastName: 'User' },
    { id: '2', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
  ]);
});

// Mock odds endpoint for development
app.get('/api/odds', (_req, res) => {
  res.json([
    { id: '1', event: 'Test Event', odds: 1.5 }
  ]);
});

// Mock videos endpoint for development
app.get('/api/videos', (_req, res) => {
  res.json([
    { id: '1', title: 'Demo Video', url: 'https://example.com/video.mp4' }
  ]);
});

app.post('/api/odds/calculate', (req, res) => {
  const { probability } = req.body;
  const odds = probability ? (100 / probability).toFixed(2) : '0';
  res.json({ odds: parseFloat(odds), probability });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Development API server listening on :${port}`);
});
