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

// ── SEO ФАЙЛЫ — вшиты прямо в код, не зависят от файловой системы ──
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nSitemap: https://tan-tana.tj/sitemap.xml');
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://tan-tana.tj/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://tan-tana.tj/categories.html</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://tan-tana.tj/about.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=rest</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=singer</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=photo</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=decor</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=music</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=salon</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=car</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tan-tana.tj/categories.html?cat=mc</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
</urlset>`);
});

// Папка для загрузок
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

// ── API РОУТЫ ──
app.use('/api/listings',   require('./routes/listings'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/upload',     require('./routes/upload'));

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), app: 'Tan-tana.tj' });
});

// ── ФРОНТЕНД ──
app.get('*', (req, res) => {
  const file = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.send('Tan-tana.tj API работает ✅');
  }
});

// ── ЗАПУСК ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Tan-tana.tj сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/listings`);
  console.log(`🔑 Режим: ${process.env.NODE_ENV || 'development'}\n`);
});

// ── TELEGRAM БОТ ──
if (process.env.BOT_TOKEN) {
  require('./bot');
  console.log('🤖 Telegram бот запущен!');
}
