require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app = express();

// ── MIDDLEWARE ──
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Папка для загрузок
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Статические файлы (фронтенд + загруженные фото)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

// ── API РОУТЫ ──
app.use('/api/listings',   require('./routes/listings'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin',      require('./routes/admin'));

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), app: 'Tuyona.tj' });
});

// ── ФРОНТЕНД — отдаём HTML для всех остальных роутов ──
app.get('*', (req, res) => {
  const file = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.send('Tuyona.tj API работает ✅');
  }
});

// ── ЗАПУСК ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Tuyona.tj сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/listings`);
  console.log(`🔑 Режим: ${process.env.NODE_ENV || 'development'}\n`);
});
