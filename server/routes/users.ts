
import { Router } from 'express';
import { db } from '../db/index';
import { users } from '@shared/schema';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await db.select().from(users).limit(50);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
