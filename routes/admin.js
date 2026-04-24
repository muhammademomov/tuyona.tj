const express   = require('express');
const router    = express.Router();
const db        = require('../config/db');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const auth      = require('../middleware/auth');
const multer    = require('multer');
const path      = require('path');

// ── ЗАГРУЗКА ФОТО ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

// ── POST /api/admin/login ──
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Введите email и пароль' });

  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Неверный email или пароль' });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Неверный email или пароль' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ success: true, token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── POST /api/admin/register (только первый раз!) ──
router.post('/register', async (req, res) => {
  const { email, password, name, secret } = req.body;
  if (secret !== process.env.JWT_SECRET) return res.status(403).json({ error: 'Запрещено' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO admins (email, password, name) VALUES (?,?,?)', [email, hash, name]);
    res.json({ success: true, message: 'Админ создан' });
  } catch (err) {
    res.status(400).json({ error: 'Email уже существует' });
  }
});

// ── GET /api/admin/listings — все объявления (для админа) ──
router.get('/listings', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM listings ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── POST /api/admin/listings — добавить объявление ──
router.post('/listings', auth, upload.single('image'), async (req, res) => {
  const { category, name, description, price, city, phone, address, hours, social, verified } = req.body;
  if (!category || !name) return res.status(400).json({ error: 'Категория и название обязательны' });

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await db.query(
      `INSERT INTO listings (category, name, description, price, city, phone, address, hours, social, image_url, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category, name, description, price, city || 'Душанбе', phone, address, hours, social, image_url, verified ? 1 : 0]
    );
    res.json({ success: true, id: result.insertId, message: 'Объявление добавлено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── PUT /api/admin/listings/:id — обновить объявление ──
router.put('/listings/:id', auth, upload.single('image'), async (req, res) => {
  const { category, name, description, price, city, phone, address, hours, social, verified, active } = req.body;

  try {
    let sql = `UPDATE listings SET category=?, name=?, description=?, price=?, city=?,
               phone=?, address=?, hours=?, social=?, verified=?, active=?`;
    const params = [category, name, description, price, city, phone, address, hours, social,
                    verified ? 1 : 0, active ? 1 : 0];

    if (req.file) {
      sql += ', image_url=?';
      params.push(`/uploads/${req.file.filename}`);
    }

    sql += ' WHERE id=?';
    params.push(req.params.id);

    await db.query(sql, params);
    res.json({ success: true, message: 'Обновлено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── DELETE /api/admin/listings/:id — удалить объявление ──
router.delete('/listings/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM listings WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── GET /api/admin/stats — статистика ──
router.get('/stats', auth, async (req, res) => {
  try {
    const [[{ total }]]    = await db.query('SELECT COUNT(*) as total FROM listings WHERE active=1');
    const [[{ verified }]] = await db.query('SELECT COUNT(*) as verified FROM listings WHERE verified=1');
    const [[{ views }]]    = await db.query('SELECT SUM(views) as views FROM listings');
    const [byCat]          = await db.query('SELECT category, COUNT(*) as count FROM listings WHERE active=1 GROUP BY category');
    res.json({ success: true, data: { total, verified, views: views || 0, byCat } });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
