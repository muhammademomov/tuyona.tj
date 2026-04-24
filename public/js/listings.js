// ── АДРЕС ВАШЕГО БЭКЕНДА ──
// При разработке: http://localhost:3000
// После деплоя: https://ваш-сервер.com
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// ── ПОЛУЧИТЬ ОБЪЯВЛЕНИЯ (с фильтром) ──
export async function getListings({ category, city, search } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  if (city)   params.set('city', city);
  if (search) params.set('search', search);

  const res  = await fetch(`${API_URL}/listings?${params}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

// ── ПОЛУЧИТЬ ОДНО ОБЪЯВЛЕНИЕ ──
export async function getListing(id) {
  const res  = await fetch(`${API_URL}/listings/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

// ── ПОЛУЧИТЬ КАТЕГОРИИ ──
export async function getCategories() {
  const res  = await fetch(`${API_URL}/categories`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

// ── НАЗВАНИЕ КАТЕГОРИИ ──
export function getCatName(cat) {
  const names = {
    rest:'Ресторан', music:'Музыкант', singer:'Певец',
    photo:'Фотограф', decor:'Оформление', salon:'Салон',
    car:'Машины', mc:'Ведущий'
  };
  return names[cat] || cat;
}

// ── ИКОНКА КАТЕГОРИИ ──
export function getCatIcon(cat) {
  const icons = {
    rest:'🍽️', music:'🎻', singer:'🎤', photo:'📸',
    decor:'🌸', salon:'👗', car:'🚗', mc:'🎙️'
  };
  return icons[cat] || '⭐';
}

// ── ОТРЕНДЕРИТЬ КАРТОЧКУ ──
export function renderCard(listing) {
  const icon = getCatIcon(listing.category);
  return `
    <div class="listing-card" onclick="window.location='listing.html?id=${listing.id}'">
      <div class="listing-card-img">
        ${listing.image_url
          ? `<img src="${listing.image_url}" alt="${listing.name}">`
          : `<span style="font-size:64px;position:relative;z-index:1">${icon}</span>`}
        ${listing.verified ? `<div class="listing-card-badge"><span class="badge badge-sage">✓ Проверено</span></div>` : ''}
        <button class="listing-card-fav" onclick="event.stopPropagation()">♡</button>
      </div>
      <div class="listing-card-body">
        <div class="listing-card-meta">
          <span class="listing-card-cat">${getCatName(listing.category)}</span>
          <span class="listing-card-rating">★ <b>4.9</b></span>
        </div>
        <div class="listing-card-name">${listing.name}</div>
        <div class="listing-card-loc">📍 ${listing.city || 'Душанбе'}</div>
        <div class="listing-card-foot">
          <div class="listing-card-price">${listing.price || 'Договорная'}</div>
          <button class="btn btn-rose btn-sm">Подробнее</button>
        </div>
      </div>
    </div>`;
}

// ── ДЕМО-ДАННЫЕ (если сервер недоступен) ──
export const DEMO_LISTINGS = [
  { id:1, category:'rest',   name:'Ресторан Магнолия', description:'Авторская кухня, живая музыка.',      price:'Договорная',    city:'Душанбе', phone:'+992901997777', address:'мкр. Испечак-2, 16/4', hours:'8:00–23:00', social:'YouTube / Instagram', verified:1 },
  { id:2, category:'rest',   name:'Чавонон',           description:'Национальная и европейская кухня.',   price:'Договорная',    city:'Душанбе', phone:'+992370123456', address:'ул. Айни, 14',        hours:'10:00–24:00', social:'Instagram',           verified:1 },
  { id:3, category:'rest',   name:'Шохсарой',          description:'Залы класса люкс, высокая кухня.',    price:'от 250 сом/чел',city:'Душанбе', phone:'+992987654321', address:'пр. Рудаки, 105',     hours:'9:00–24:00',  social:'YouTube / Instagram', verified:1 },
  { id:4, category:'decor',  name:'Mehr Decor',        description:'Цветочные арки, декор залов.',        price:'от 3000 сом',   city:'Душанбе', phone:'+992901111222', address:'ул. Борбад, 23',      hours:'9:00–22:00',  social:'Instagram',           verified:1 },
  { id:5, category:'photo',  name:'Хусейн Мадудов',   description:'Фотограф с 8-летним опытом.',         price:'от 800 сом/час',city:'Душанбе', phone:'+992904444555', address:null,                  hours:'По записи',   social:'Instagram',           verified:0 },
  { id:6, category:'singer', name:'Фирӯза Назарова',  description:'Таджикские и современные песни.',     price:'от 1200 сом',   city:'Душанбе', phone:'+992905555666', address:null,                  hours:'По записи',   social:'YouTube / Instagram', verified:1 },
  { id:7, category:'music',  name:'Ансамбль «Ширин»', description:'Живая музыка, народные мелодии.',     price:'от 2000 сом',   city:'Душанбе', phone:'+992906666777', address:null,                  hours:'По записи',   social:'YouTube',             verified:1 },
  { id:8, category:'salon',  name:'Салон «Нилуфар»',  description:'Свадебные платья. Прокат и продажа.', price:'от 1500 сом',   city:'Душанбе', phone:'+992907777888', address:'пр. Исмоили Сомонӣ, 45',hours:'10:00–20:00',social:'Instagram',           verified:1 },
  { id:9, category:'car',    name:'Wedding Cars',     description:'Лимузины, классика. Украшение в подарок.',price:'от 500 сом/час',city:'Душанбе',phone:'+992908888999',address:null,                hours:'По записи',   social:'Instagram',           verified:0 },
];
