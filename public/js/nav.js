import { updateNavAuth } from './auth.js';

// ── ОБЩИЙ НАВ ── вставляется на каждую страницу
export function renderNav(activePage) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <span class="nav-logo-dot"></span>
        Tuyona<span>.tj</span>
      </a>
      <div class="nav-links">
        <a href="index.html"      class="nav-link ${activePage==='home'?'active':''}">Главная</a>
        <a href="categories.html" class="nav-link ${activePage==='cats'?'active':''}">Категории</a>
        <a href="about.html"      class="nav-link ${activePage==='about'?'active':''}">О нас</a>
      </div>
      <div class="nav-right" id="nav-right">
        <a href="login.html" class="btn btn-secondary btn-sm">Войти</a>
        <a href="login.html#register" class="btn btn-primary btn-sm">+ Добавить услугу</a>
      </div>
      <button class="nav-burger" id="nav-burger" aria-label="Меню">
        <span></span><span></span><span></span>
      </button>
    </div>`;
  updateNavAuth();
}

// ── ОБЩИЙ ФУТЕР ──
export function renderFooter() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">Tuyona<span>.tj</span></div>
          <div class="footer-desc">Лучший маркетплейс для вашей счастливой свадьбы. Все свадебные услуги в одном месте — по всему Таджикистану.</div>
        </div>
        <div class="footer-col">
          <h4>Услуги</h4>
          <a href="categories.html?cat=rest">Рестораны</a>
          <a href="categories.html?cat=singer">Певцы</a>
          <a href="categories.html?cat=photo">Фотографы</a>
          <a href="categories.html?cat=salon">Салоны</a>
          <a href="categories.html?cat=decor">Оформление</a>
        </div>
        <div class="footer-col">
          <h4>Исполнителям</h4>
          <a href="login.html#register">Регистрация</a>
          <a href="dashboard.html">Личный кабинет</a>
          <a href="about.html">О платформе</a>
        </div>
        <div class="footer-col">
          <h4>Компания</h4>
          <a href="about.html">О нас</a>
          <a href="#">Контакты</a>
          <a href="#">Условия</a>
          <a href="#">Политика</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-copy">© 2025 Tuyona.tj — Все права защищены</div>
        <div class="footer-langs">
          <button class="footer-lang active">Русский</button>
          <button class="footer-lang">Тоҷикӣ</button>
          <button class="footer-lang">English</button>
        </div>
      </div>
    </div>`;
}
