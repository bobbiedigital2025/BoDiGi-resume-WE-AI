
import { Router } from 'express';

const router = Router();

// POST /api/odds/combined { probabilities: number[] in [0,1] }
router.post('/combined', (req, res) => {
  const arr = Array.isArray(req.body?.probabilities) ? req.body.probabilities : [];
  const valid = arr.every((n: any) => typeof n === 'number' && n >= 0 && n <= 1);
  if (!valid) return res.status(400).json({ error: 'probabilities must be numbers in [0,1]' });
  const combined = arr.reduce((acc: number, n: number) => acc * n, 1);
  res.json({ combined });
});

export default router;
