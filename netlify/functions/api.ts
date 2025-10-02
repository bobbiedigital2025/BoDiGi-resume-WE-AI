import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import oddsRouter from '../../server/routes/odds';

// Create Express app for Netlify Functions
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/odds', oddsRouter);

// Conditionally import routes that require database
if (process.env.DATABASE_URL) {
  Promise.all([
    import('../../server/routes/users'),
    import('../../server/routes/videos')
  ]).then(([usersModule, videosModule]) => {
    app.use('/api/users', usersModule.default);
    app.use('/api/videos', videosModule.default);
  }).catch(err => {
    console.error('Failed to load database routes:', err);
  });
} else {
  // Mock endpoints for development without database
  app.get('/api/users', (_req, res) => {
    res.json([
      { id: '1', email: 'demo@example.com', firstName: 'Demo', lastName: 'User' }
    ]);
  });
  
  app.get('/api/videos', (_req, res) => {
    res.json([]);
  });
}

export const handler = serverless(app);
