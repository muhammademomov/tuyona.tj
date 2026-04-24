const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── GET /api/categories — все категории с количеством объявлений ──
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, COUNT(l.id) as count
      FROM categories c
      LEFT JOIN listings l ON l.category = c.slug AND l.active = 1
      GROUP BY c.id
      ORDER BY c.sort ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
