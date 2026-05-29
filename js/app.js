// Конфигурация – замените на ваш URL после настройки Google Sheets
const API_URL = 'https://script.google.com/macros/s/AKfycbwX5KFiJaRm1YcxvhXkYThgIKuqioPX2sP0S3kS1Q1z75DdCCDQFXhZOE0gny2k9HyA/exec';
const POZIVNOY = localStorage.getItem('pozivnoy') || 'Сталкер';
const FRACTION = localStorage.getItem('fraction') || 'Вольные';

// Переключение вкладок
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// Обновление времени
function updateTime() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 1000); updateTime();

// Загрузка данных из Google Sheets
async function fetchData(sheetName) {
  try {
    const resp = await fetch(`${API_URL}?sheet=${sheetName}&pozivnoy=${POZIVNOY}&fraction=${FRACTION}`);
    const data = await resp.json();
    return data;
  } catch (err) {
    console.warn('Офлайн-режим, используются кэшированные данные');
    return JSON.parse(localStorage.getItem(`cache_${sheetName}`) || '[]');
  }
}

// Отображение задач
async function loadTasks() {
  const tasks = await fetchData('Квесты');
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${task[1] || 'Без названия'}</strong><br>${task[5] || ''}`;
    list.appendChild(li);
  });
  localStorage.setItem('cache_Квесты', JSON.stringify(tasks));
}

// Отображение слухов
async function loadRumors() {
  const rumors = await fetchData('Слухи и события');
  const list = document.getElementById('rumor-list');
  list.innerHTML = '';
  rumors.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r[2] || '';
    list.appendChild(li);
  });
  localStorage.setItem('cache_Слухи и события', JSON.stringify(rumors));
}

// Стартовая загрузка
window.addEventListener('load', () => {
  loadTasks();
  loadRumors();
  document.querySelector('.welcome').innerHTML = `Добро пожаловать, ${POZIVNOY}. Фракция: ${FRACTION}`;
});

// Регистрация сервис-воркера
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}