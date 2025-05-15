import { existsSync } from 'fs';
import { join } from 'path';

export function sqliteDbExists(): boolean {
  const dbPath = join(process.cwd(), '.data/content', 'data.sqlite');
  return existsSync(dbPath);
}