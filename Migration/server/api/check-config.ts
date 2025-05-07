import db from '~/server/database/sqlite';

export default defineEventHandler(() => {
  const result = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='configuration';
  `).get();

  return { exists: !!result };
});
