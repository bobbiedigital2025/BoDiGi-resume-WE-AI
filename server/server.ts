
import express from 'express';
import cors from 'cors';
import oddsRouter from './routes/odds.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/odds', oddsRouter);

// Conditionally load database-dependent routes
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL;
if (databaseUrl) {
  Promise.all([
    import('./routes/users.js'),
    import('./routes/videos.js')
  ]).then(([usersModule, videosModule]) => {
    app.use('/api/users', usersModule.default);
    app.use('/api/videos', videosModule.default);
    console.log('Database routes loaded successfully');
  }).catch(err => {
    console.error('Failed to load database routes:', err);
  });
} else {
  console.warn('Database not configured. Using mock data for /api/users and /api/videos');
  
  // Mock users endpoint
  app.get('/api/users', (_req, res) => {
    res.json([
      { id: '1', email: 'demo@example.com', firstName: 'Demo', lastName: 'User', role: 'user' }
    ]);
  });
  
  // Mock videos endpoint
  app.get('/api/videos', (_req, res) => {
    res.json([]);
  });
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
  console.log(`Database configured: ${!!databaseUrl}`);
});
