# Tuyona.tj — Backend

Node.js + Express + MySQL бэкенд для свадебного маркетплейса.

---

## 🚀 Быстрый старт

### 1. Установите Node.js
Скачайте с https://nodejs.org (версия 18+)

### 2. Установите MySQL
Скачайте с https://dev.mysql.com/downloads/

### 3. Создайте базу данных
```bash
mysql -u root -p < config/schema.sql
```

### 4. Настройте .env
```bash
cp .env.example .env
# Откройте .env и заполните DB_PASSWORD и другие параметры
```

### 5. Установите зависимости
```bash
npm install
```

### 6. Запустите сервер
```bash
npm start
# или для разработки:
npm run dev
```

Сервер запустится на http://localhost:3000

---

## 📡 API Endpoints

### Публичные (для всех)
| Метод | URL | Описание |
|-------|-----|---------|
| GET | /api/listings | Все объявления |
| GET | /api/listings?category=rest | По категории |
| GET | /api/listings?search=магнолия | Поиск |
| GET | /api/listings/:id | Одно объявление |
| GET | /api/categories | Все категории |
| GET | /api/health | Статус сервера |

### Административные (требуют JWT токен)
| Метод | URL | Описание |
|-------|-----|---------|
| POST | /api/admin/login | Вход администратора |
| GET | /api/admin/listings | Все объявления |
| POST | /api/admin/listings | Добавить объявление |
| PUT | /api/admin/listings/:id | Редактировать |
| DELETE | /api/admin/listings/:id | Удалить |
| GET | /api/admin/stats | Статистика |

---

## 👤 Создать администратора

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tuyona.tj",
    "password": "ваш_пароль",
    "name": "Администратор",
    "secret": "значение_JWT_SECRET_из_.env"
  }'
```

---

## 📁 Структура проекта

```
tuyona-backend/
├── server.js              ← Точка входа
├── package.json
├── .env.example           ← Скопируйте в .env
├── config/
│   ├── db.js              ← Подключение к MySQL
│   └── schema.sql         ← Структура БД
├── middleware/
│   └── auth.js            ← JWT проверка
├── routes/
│   ├── listings.js        ← Публичный API объявлений
│   ├── categories.js      ← API категорий
│   └── admin.js           ← Админ API
└── public/                ← Фронтенд сайта
    ├── index.html
    ├── categories.html
    ├── listing.html
    ├── about.html
    ├── css/
    ├── js/
    └── uploads/           ← Загруженные фото
```

---

## 🌐 Деплой на сервер (VPS)

```bash
# Установить PM2 для автозапуска
npm install -g pm2
pm2 start server.js --name tuyona
pm2 startup
pm2 save
```
