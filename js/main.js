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
        
        const firstCard = carousel.querySelector('.movie-card, .person-card, .series-card');
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

// ========== ФУНКЦИОНАЛ КАРТОЧЕК ==========
function initCards() {
    initLikes();
    initTrailers();
    initLocalSearch();
}

function initLikes() {
    // Ищем кнопки лайков во всех типах карточек
    const likeButtons = document.querySelectorAll('.card-like-btn');
    
    likeButtons.forEach(btn => {
        // Безопасное получение названия фильма/сериала
        const card = btn.closest('.movie-card, .series-card');
        if (!card) return;
        
        const titleElement = card.querySelector('.card-title');
        if (!titleElement) return;
        
        const title = titleElement.textContent.trim();
        if (!title) return;
        
        // Создаем уникальный ключ для localStorage
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
            } else {
                console.error('URL трейлера не указан');
            }
        });
    });
    
    // Закрытие модальных окон
    setupModalCloseHandlers();
}

function setupModalCloseHandlers() {
    // Закрытие по кнопке закрытия
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                
                // Останавливаем видео
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    const tempSrc = iframe.src;
                    iframe.src = '';
                    iframe.src = tempSrc;
                }
            }
        });
    });
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                
                // Останавливаем видео
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    const tempSrc = iframe.src;
                    iframe.src = '';
                    iframe.src = tempSrc;
                }
            }
        });
    });
}

function showTrailerModal(trailerUrl) {
    // Пробуем найти модальное окно для сериалов
    let modal = document.getElementById('seriesTrailerModal');
    let videoElement = document.getElementById('seriesTrailerVideo');
    
    // Если не нашли для сериалов, ищем общее модальное окно
    if (!modal || !videoElement) {
        modal = document.getElementById('trailerModal');
        videoElement = document.getElementById('trailerVideo');
    }
    
    if (!modal || !videoElement) {
        console.error('Модальное окно или видео элемент не найдены');
        return;
    }
    
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

function initLocalSearch() {
    const searchInput = document.getElementById('localMovieSearch');
    const clearButton = document.getElementById('localSearchClear');
    const filters = document.querySelectorAll('.local-filter');
    
    if (searchInput && clearButton) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterCards(searchTerm);
            clearButton.style.display = searchTerm ? 'block' : 'none';
        });
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            filterCards('');
        });
    }
    
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            filterCards();
        });
    });
}

function filterCards(searchTerm = '') {
    // Ищем карточки всех типов
    const cards = document.querySelectorAll('.movie-card, .series-card');
    const yearFilter = document.getElementById('localYearFilter');
    const genreFilter = document.getElementById('localGenreFilter');
    const ratingFilter = document.getElementById('localRatingFilter');
    
    cards.forEach(card => {
        const title = card.dataset.title ? card.dataset.title.toLowerCase() : '';
        const year = card.dataset.year ? parseInt(card.dataset.year) : 0;
        const genre = card.dataset.genre ? card.dataset.genre.toLowerCase() : '';
        const rating = card.dataset.rating ? parseFloat(card.dataset.rating) : 0;
        
        let matchesSearch = !searchTerm || title.includes(searchTerm);
        let matchesYear = !yearFilter?.value || year >= parseInt(yearFilter.value);
        let matchesGenre = !genreFilter?.value || genre.includes(genreFilter.value.toLowerCase());
        let matchesRating = !ratingFilter?.value || rating >= parseFloat(ratingFilter.value);
        
        card.style.display = (matchesSearch && matchesYear && matchesGenre && matchesRating) ? 'block' : 'none';
    });
}

// ========== СТРАНИЦА "О НАС" ==========
function initAboutPage() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50; // Анимация за 50 шагов
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString();
        }, 30);
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
        initCards();
        
        // Инициализация для страницы "О нас"
        if (document.querySelector('.about-page')) {
            initAboutPage();
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log('Все функции успешно инициализированы!');
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
});