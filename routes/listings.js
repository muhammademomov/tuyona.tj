const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── GET /api/listings — все объявления (с фильтром по категории) ──
router.get('/', async (req, res) => {
  try {
    const { category, city, search, limit = 50, offset = 0 } = req.query;

    let sql    = 'SELECT * FROM listings WHERE active = 1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (city) {
      sql += ' AND city = ?';
      params.push(city);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY verified DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── GET /api/listings/:id — одно объявление ──
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM listings WHERE id = ? AND active = 1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Не найдено' });

    // Увеличиваем счётчик просмотров
    await db.query('UPDATE listings SET views = views + 1 WHERE id = ?', [req.params.id]);

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── GET /api/listings/category/:slug — по категории ──
router.get('/category/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM listings WHERE category = ? AND active = 1 ORDER BY verified DESC, created_at DESC',
      [req.params.slug]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
