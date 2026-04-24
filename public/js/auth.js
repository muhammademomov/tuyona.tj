import { supabase } from './supabase.js';

// ── РЕГИСТРАЦИЯ ──
export async function register(email, password, name, phone, role) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Создаём профиль
  await supabase.from('profiles').insert({
    id: data.user.id,
    name, phone, role
  });
  return data;
}

// ── ВХОД ──
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ── ВЫХОД ──
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/index.html';
}

// ── ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ ──
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return { ...user, profile };
}

// ── ОБНОВИТЬ НАВ в зависимости от авторизации ──
export async function updateNavAuth() {
  const user = await getCurrentUser();
  const navRight = document.getElementById('nav-right');
  if (!navRight) return;

  if (user) {
    const initials = (user.profile?.name || user.email).slice(0, 2).toUpperCase();
    navRight.innerHTML = `
      <a href="dashboard.html" class="nav-avatar" title="${user.profile?.name || user.email}">${initials}</a>
      <button onclick="import('./js/auth.js').then(m=>m.logout())" class="btn btn-secondary btn-sm">Выйти</button>
    `;
  } else {
    navRight.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Войти</a>
      <a href="login.html#register" class="btn btn-primary btn-sm">+ Добавить услугу</a>
    `;
  }
}
