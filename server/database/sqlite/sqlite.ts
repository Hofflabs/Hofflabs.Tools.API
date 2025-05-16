import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync } from 'fs';

const dbPath = join(process.cwd(), '.data/content', 'contents.sqlite');
const sqlite = new Database(dbPath);

export default sqlite;