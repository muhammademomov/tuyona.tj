-- ══════════════════════════════════════════
--  TUYONA.TJ — MySQL схема базы данных
--  Запустите один раз: mysql -u root -p < config/schema.sql
-- ══════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS tuyona_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tuyona_db;

-- ── АДМИНИСТРАТОРЫ ──
CREATE TABLE IF NOT EXISTS admins (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  name       VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── ОБЪЯВЛЕНИЯ (listings) ──
CREATE TABLE IF NOT EXISTS listings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category    VARCHAR(50)  NOT NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  price       VARCHAR(100),
  city        VARCHAR(100) DEFAULT 'Душанбе',
  phone       VARCHAR(50),
  address     VARCHAR(255),
  hours       VARCHAR(100),
  social      VARCHAR(255),
  image_url   VARCHAR(500),
  verified    TINYINT(1)   DEFAULT 0,
  active      TINYINT(1)   DEFAULT 1,
  views       INT          DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── КАТЕГОРИИ ──
CREATE TABLE IF NOT EXISTS categories (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  slug  VARCHAR(50)  NOT NULL UNIQUE,
  name  VARCHAR(100) NOT NULL,
  icon  VARCHAR(10),
  sort  INT DEFAULT 0
);

INSERT IGNORE INTO categories (slug, name, icon, sort) VALUES
  ('rest',   'Рестораны',        '🍽️', 1),
  ('singer', 'Певцы',            '🎤', 2),
  ('music',  'Музыканты',        '🎻', 3),
  ('photo',  'Фотографы',        '📸', 4),
  ('decor',  'Оформление',       '🌸', 5),
  ('salon',  'Свадебные салоны', '👗', 6),
  ('car',    'Машины',           '🚗', 7),
  ('mc',     'Ведущие',          '🎙️', 8);

-- ── ТЕСТОВЫЕ ДАННЫЕ ──
INSERT IGNORE INTO listings (category, name, description, price, city, phone, address, hours, social, verified) VALUES
('rest',   'Ресторан Магнолия', 'Авторская кухня, свежие локальные продукты, живая музыка. Забронируйте стол и почувствуйте праздник!', 'Договорная',    'Душанбе', '+992901997777', 'мкр. Испечак-2, 16/4', '8:00–23:00', 'YouTube / Instagram', 1),
('rest',   'Чавонон',          'Национальная и европейская кухня. Уютная атмосфера. Идеальное место для свадеб и торжеств.',            'Договорная',    'Душанбе', '+992370123456', 'ул. Айни, 14',        '10:00–24:00','Instagram',           1),
('rest',   'Шохсарой',         'Залы класса люкс, высокая кухня и тёплая атмосфера.',                                                  'от 250 сом/чел','Душанбе', '+992987654321', 'пр. Рудаки, 105',     '9:00–24:00', 'YouTube / Instagram', 1),
('decor',  'Mehr Decor',       'Оформление свадеб и мероприятий. Цветочные арки, декор залов, флористика.',                            'от 3000 сом',   'Душанбе', '+992901111222', 'ул. Борбад, 23',      '9:00–22:00', 'Instagram',           1),
('photo',  'Хусейн Мадудов',   'Свадебный фотограф с 8-летним опытом. Художественная съёмка, обработка за 7 дней.',                   'от 800 сом/час','Душанбе', '+992904444555', NULL,                  'По записи',  'Instagram',           0),
('singer', 'Фирӯза Назарова',  'Певица с богатым репертуаром таджикских и современных свадебных песен.',                               'от 1200 сом',   'Душанбе', '+992905555666', NULL,                  'По записи',  'YouTube / Instagram', 1),
('music',  'Ансамбль «Ширин»', 'Живая музыка. Таджикские народные мелодии, современная эстрада.',                                      'от 2000 сом',   'Душанбе', '+992906666777', NULL,                  'По записи',  'YouTube',             1),
('salon',  'Салон «Нилуфар»',  'Свадебные платья и аксессуары. Прокат и продажа. Индивидуальный пошив.',                               'от 1500 сом',   'Душанбе', '+992907777888', 'пр. Исмоили Сомонӣ, 45','10:00–20:00','Instagram',          1),
('car',    'Wedding Cars',     'Прокат свадебных автомобилей. Лимузины, классика. Украшение в подарок.',                               'от 500 сом/час','Душанбе', '+992908888999', NULL,                  'По записи',  'Instagram',           0);
