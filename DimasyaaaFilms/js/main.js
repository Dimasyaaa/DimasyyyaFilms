// ========== ОСНОВНЫЕ ФУНКЦИИ САЙТА ==========

// ========== УПРАВЛЕНИЕ ТЕМОЙ ==========
const THEME_KEY = 'dimasyyya-theme';
let currentTheme = 'dark';

// DOM элементы
let themeToggle, themeIcon, themeText;

// Инициализация темы
function initTheme() {
    themeToggle = document.getElementById('themeToggle');
    themeIcon = themeToggle?.querySelector('.theme-icon');
    themeText = themeToggle?.querySelector('.theme-text');
    
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
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
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

// ========== КАРУСЕЛИ ==========
function initCarousels() {
    const carousels = document.querySelectorAll('.cards-carousel');
    
    carousels.forEach(carousel => {
        const carouselContainer = carousel.closest('.carousel-container');
        const prevBtn = carouselContainer?.querySelector('.carousel-prev');
        const nextBtn = carouselContainer?.querySelector('.carousel-next');
        
        if (!prevBtn || !nextBtn) return;
        
        const scrollAmount = 600; // Фиксированное значение прокрутки
        
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        // Обновляем состояние кнопок
        const updateButtons = () => {
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            prevBtn.style.opacity = carousel.scrollLeft <= 10 ? '0.5' : '1';
            nextBtn.style.opacity = carousel.scrollLeft >= maxScrollLeft - 10 ? '0.5' : '1';
        };
        
        carousel.addEventListener('scroll', updateButtons);
        setTimeout(updateButtons, 100);
    });
}

// ========== ФУНКЦИОНАЛ КАРТОЧЕК ==========
function initCards() {
    initLikes();
    initTrailers();
}

function initLikes() {
    const likeButtons = document.querySelectorAll('.card-like-btn');
    
    likeButtons.forEach(btn => {
        const card = btn.closest('.movie-card, .series-card');
        if (!card) return;
        
        const titleElement = card.querySelector('.card-title');
        if (!titleElement) return;
        
        const title = titleElement.textContent.trim();
        if (!title) return;
        
        const likeKey = `like-${title.replace(/\s+/g, '-')}`;
        const liked = localStorage.getItem(likeKey) === 'true';
        
        if (liked) {
            btn.textContent = '❤️';
            btn.classList.add('liked');
        } else {
            btn.textContent = '🤍';
            btn.classList.remove('liked');
        }
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLiked = btn.textContent === '❤️';
            
            if (isLiked) {
                btn.textContent = '🤍';
                btn.classList.remove('liked');
                localStorage.setItem(likeKey, 'false');
            } else {
                btn.textContent = '❤️';
                btn.classList.add('liked');
                localStorage.setItem(likeKey, 'true');
            }
        });
    });
}

function initTrailers() {
    const trailerButtons = document.querySelectorAll('.card-trailer-btn');
    
    trailerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trailerUrl = btn.dataset.trailer;
            if (trailerUrl) {
                showTrailerModal(trailerUrl);
            }
        });
    });
    
    setupModalCloseHandlers();
}

function setupModalCloseHandlers() {
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    iframe.src = '';
                }
            }
        });
    });
    
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    iframe.src = '';
                }
            }
        });
    });
}

function showTrailerModal(trailerUrl) {
    let modal = document.getElementById('seriesTrailerModal');
    let videoElement = document.getElementById('seriesTrailerVideo');
    
    if (!modal || !videoElement) {
        modal = document.getElementById('trailerModal');
        videoElement = document.getElementById('trailerVideo');
    }
    
    if (!modal || !videoElement) return;
    
    let embedUrl = trailerUrl;
    if (trailerUrl.includes('youtube.com/watch?v=')) {
        embedUrl = trailerUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    } else if (trailerUrl.includes('youtu.be/')) {
        embedUrl = trailerUrl.replace('youtu.be/', 'youtube.com/embed/');
    }
    
    if (!embedUrl.includes('?')) {
        embedUrl += '?autoplay=1';
    } else {
        embedUrl += '&autoplay=1';
    }
    
    videoElement.src = embedUrl;
    modal.style.display = 'flex';
}

// ========== ФОРМА ВХОДА ==========
function initLoginForm() {
    const loginForm = document.querySelector('.login-form form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const login = loginForm.querySelector('#login').value;
        const password = loginForm.querySelector('#password').value;
        
        if (login && password) {
            alert(`Добро пожаловать, ${login}!`);
            loginForm.reset();
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ВСЕГО ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DimasyyyaFilms фурычит! ');
    
    try {
        initTheme();
        initBackToTop();
        initCarousels();
        initCards();
        initLoginForm();
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log('Все функции успешно инициализированы!');
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
});