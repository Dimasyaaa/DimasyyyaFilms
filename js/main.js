// Основные константы и переменные
const THEME_KEY = 'dimasyyya-theme';
let currentTheme = 'dark';

// DOM элементы
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeText = themeToggle?.querySelector('.theme-text');

// ========== ФУНКЦИЯ СМЕНЫ ТЕМЫ ==========
function initTheme() {
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // Проверяем системные настройки
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            currentTheme = 'light';
        }
    }
    
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    
    // Обновляем кнопку
    updateThemeButton();
}

function updateThemeButton() {
    if (themeIcon && themeText) {
        if (currentTheme === 'dark') {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Тёмная';
        } else {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Светлая';
        }
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// ========== КНОПКА "НАВЕРХ" ==========
function initBackToTop() {
    // Создаем кнопку "Наверх"
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.style.display = 'none';
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
}

// ========== ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРЕЙ ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


// ========== КАРУСЕЛИ ==========
function initCarousels() {
    const carousels = document.querySelectorAll('.cards-carousel');
    
    carousels.forEach(carousel => {
        const prevBtn = carousel.parentElement.querySelector('.carousel-prev');
        const nextBtn = carousel.parentElement.querySelector('.carousel-next');
        
        // Проверяем существование элементов
        if (!prevBtn || !nextBtn) return;
        
        const firstCard = carousel.querySelector('.movie-card, .person-card');
        if (!firstCard) return;
        
        const cardWidth = firstCard.offsetWidth + 25; // width + gap
        const scrollAmount = cardWidth * 3; // Прокручиваем по 3 карточки
        
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        // Скрываем кнопки в начале/конце
        const updateButtons = () => {
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            prevBtn.style.opacity = carousel.scrollLeft <= 0 ? '0.5' : '1';
            nextBtn.style.opacity = carousel.scrollLeft >= maxScrollLeft - 10 ? '0.5' : '1'; // Добавляем небольшой запас
        };
        
        carousel.addEventListener('scroll', updateButtons);
        
        // Инициализируем состояние кнопок
        setTimeout(updateButtons, 100);
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ВСЕГО ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DimasyyyaFilms фурычит!!! 🚀');
    
    try {
        initTheme();
        initBackToTop();
        initSmoothScroll();
        initCarousels(); 
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log('функции успешно инициализированы!');
    } catch (error) {
        console.error('Ошибка:', error);
    }
});

// ========== ОБРАБОТЧИК ОШИБОК ==========
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});

// Обработчик ошибок для Promise
window.addEventListener('unhandledrejection', function(e) {
    console.error('Необработанная ошибка Promise:', e.reason);
});