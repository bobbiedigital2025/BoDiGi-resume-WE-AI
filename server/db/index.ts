
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL;

let pool: any = null;
let db: any = null;

if (!databaseUrl) {
  console.warn('WARNING: DATABASE_URL or SUPABASE_URL not set. Database features will be limited.');
} else {
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
}

export { pool, db };
