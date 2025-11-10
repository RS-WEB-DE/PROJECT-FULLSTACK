// backend/import_parts_mysql.js
const db = require('./db');
const parts = require('../data/parts.json'); // dein altes JSON

(async () => {
  try {
    for (const p of parts) {
      const sql = `INSERT INTO parts (name, price, img, description) VALUES (?, ?, ?, ?)`;
      const params = [p.name || null, p.price || 0, p.img || null, p.description || null];
      await db.query(sql, params);
      console.log('Inserted', p.name);
    }
    console.log('Import fertig');
  } catch (err) {
    console.error('Import Fehler:', err);
  } finally {
    process.exit(0);
  }
})();
