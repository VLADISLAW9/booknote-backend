import { mkdirSync } from 'fs';
import { dirname, join } from 'path';

export function getDatabasePath(): string {
  const databasePath =
    process.env.DATABASE_PATH ?? join(process.cwd(), 'data', 'booknote.sqlite');

  mkdirSync(dirname(databasePath), { recursive: true });

  return databasePath;
}
