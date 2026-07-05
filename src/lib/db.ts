import 'server-only';
import { createDrizzlePostgresClient } from '@handharr-labs/forge-web-server/db/drizzle';

export const { db } = createDrizzlePostgresClient({
  connectionString: process.env.DATABASE_URL!,
  prepare: false,
});
