// ========== ПОИСК И ФИЛЬТРАЦИЯ ФИЛЬМОВ ==========

const KINOPOISK_API_KEY = '67ecd3f6-0de9-4b1d-9343-7bc6dcf79bd7';
const KINOPOISK_BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films';
const KINOPOISK_PERSON_URL = 'https://kinopoiskapiunofficial.tech/api/v1/staff';

let searchState = {
    currentQuery: '',
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    currentPageType: 'all'
};

// Основная функция инициализации поиска
function initSearch() {
    console.log('🔍 Инициализация поиска...');
    
    detectPageType();
    createSearchPanel();
    setupSearchHandlers();
}

// Определяем тип страницы
function detectPageType() {
    const path = window.location.pathname;
    if (path.includes('movies.html')) {
        searchState.currentPageType = 'movies';
    } else if (path.includes('series.html')) {
        searchState.currentPageType = 'series';
    } else if (path.includes('actors.html')) {
        searchState.currentPageType = 'actors';
    } else if (path.includes('directors.html')) {
        searchState.currentPageType = 'directors';
    } else {
        searchState.currentPageType = 'all';
    }
    console.log('📄 Тип страницы:', searchState.currentPageType);
}

// Создаем панель поиска
function createSearchPanel() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    let filtersHTML = '';
    let placeholder = '🔍 Поиск фильмов, сериалов, актеров...';
    
    // Настройки для разных типов страниц
    switch(searchState.currentPageType) {
        case 'movies':
            filtersHTML = createMovieFilters();
            placeholder = '🔍 Поиск фильмов...';
            break;
        case 'series':
            filtersHTML = createSeriesFilters();
            placeholder = '🔍 Поиск сериалов...';
            break;
        case 'actors':
        case 'directors':
            filtersHTML = createPersonFilters();
            placeholder = searchState.currentPageType === 'actors' ? '🔍 Поиск актеров...' : '🔍 Поиск режиссеров...';
            break;
        default:
            filtersHTML = createDefaultFilters();
    }
    
    searchContainer.innerHTML = `
        <div class="search-panel">
            <div class="search-input-group">
                <input 
                    type="text" 
                    id="globalSearchInput" 
                    class="global-search" 
                    placeholder="${placeholder}"
                    autocomplete="off"
                >
                <button id="searchClearBtn" class="search-clear-btn" style="display: none;">✕</button>
            </div>
            <button id="searchBtn" class="search-btn">Найти</button>
        </div>
        ${filtersHTML}
        <div class="search-results" id="searchResults" style="display: none;">
            <div class="search-results-header">
                <h3 id="searchResultsTitle">Результаты поиска</h3>
                <div class="search-stats">
                    <span id="searchResultsCount">0 результатов</span>
                    <div class="search-pagination" id="searchPagination" style="display: none;"></div>
                </div>
            </div>
            <div class="search-results-grid" id="searchResultsGrid"></div>
            <div class="search-loading" id="searchLoading" style="display: none;">
                <div class="loading-spinner"></div>
                <p>Ищем...</p>
            </div>
        </div>
    `;
    
    // Добавляем поиск после header
    const header = document.querySelector('header');
    if (header) {
        header.parentNode.insertBefore(searchContainer, header.nextSibling);
    }
}

// Функции создания фильтров
function createMovieFilters() {
    return `
        <div class="search-filters">
            <select id="yearFilter" class="search-filter">
                <option value="">Все годы</option>
                ${generateYearOptions()}
            </select>
            <select id="genreFilter" class="search-filter">
                <option value="">Все жанры</option>
                <option value="драма">Драма</option>
                <option value="комедия">Комедия</option>
                <option value="фантастика">Фантастика</option>
                <option value="боевик">Боевик</option>
                <option value="триллер">Триллер</option>
                <option value="мелодрама">Мелодрама</option>
                <option value="приключения">Приключения</option>
                <option value="фэнтези">Фэнтези</option>
                <option value="ужасы">Ужасы</option>
                <option value="детектив">Детектив</option>
            </select>
            <select id="ratingFilter" class="search-filter">
                <option value="0">Любой рейтинг</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
                <option value="9">9+</option>
            </select>
            <input type="hidden" id="typeFilter" value="FILM">
        </div>
    `;
}

function createSeriesFilters() {
    return `
        <div class="search-filters">
            <select id="yearFilter" class="search-filter">
                <option value="">Все годы</option>
                ${generateYearOptions()}
            </select>
            <select id="genreFilter" class="search-filter">
                <option value="">Все жанры</option>
                <option value="криминал">Криминал</option>
                <option value="драма">Драма</option>
                <option value="фэнтези">Фэнтези</option>
                <option value="комедия">Комедия</option>
                <option value="триллер">Триллер</option>
                <option value="детектив">Детектив</option>
                <option value="мелодрама">Мелодрама</option>
            </select>
            <select id="statusFilter" class="search-filter">
                <option value="">Все статусы</option>
                <option value="completed">Завершен</option>
                <option value="ongoing">Онгоинг</option>
            </select>
            <input type="hidden" id="typeFilter" value="TV_SERIES">
        </div>
    `;
}

function createPersonFilters() {
    return `
        <div class="search-filters">
            <select id="countryFilter" class="search-filter">
                <option value="">Все страны</option>
                <option value="США">США</option>
                <option value="Великобритания">Великобритания</option>
                <option value="Россия">Россия</option>
                <option value="Франция">Франция</option>
                <option value="Германия">Германия</option>
                <option value="Италия">Италия</option>
                <option value="Испания">Испания</option>
                <option value="Япония">Япония</option>
                <option value="Корея">Корея</option>
            </select>
            <select id="filmsCountFilter" class="search-filter">
                <option value="0">Любое кол-во фильмов</option>
                <option value="10">10+ фильмов</option>
                <option value="20">20+ фильмов</option>
                <option value="50">50+ фильмов</option>
            </select>
        </div>
    `;
}

function createDefaultFilters() {
    return `
        <div class="search-filters">
            <select id="yearFilter" class="search-filter">
                <option value="">Все годы</option>
                ${generateYearOptions()}
            </select>
            <select id="genreFilter" class="search-filter">
                <option value="">Все жанры</option>
                <option value="драма">Драма</option>
                <option value="комедия">Комедия</option>
                <option value="фантастика">Фантастика</option>
                <option value="боевик">Боевик</option>
            </select>
            <select id="typeFilter" class="search-filter">
                <option value="ALL">Все</option>
                <option value="FILM">Фильмы</option>
                <option value="TV_SERIES">Сериалы</option>
            </select>
            <select id="ratingFilter" class="search-filter">
                <option value="0">Любой рейтинг</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
            </select>
        </div>
    `;
}

// Генерация опций годов
function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    let options = '';
    for (let year = currentYear; year >= 1950; year--) {
        options += `<option value="${year}">${year}</option>`;
    }
    return options;
}

// Настройка обработчиков событий
function setupSearchHandlers() {
    const searchInput = document.getElementById('globalSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('searchClearBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            clearBtn.style.display = e.target.value ? 'block' : 'none';
        });
        
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            clearSearchResults();
        });
        
        // Обработчики для фильтров
        const filters = document.querySelectorAll('.search-filter');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                if (searchState.currentQuery) {
                    performSearch();
                }
            });
        });
    }
}

// Основная функция поиска
async function performSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        showSearchNotification('Введите поисковый запрос', 'warning');
        return;
    }
    
    if (searchState.isLoading) return;
    
    searchState.currentQuery = query;
    searchState.currentPage = 1;
    
    showSearchLoading(true);
    clearSearchResults();
    
    try {
        let results;
        if (searchState.currentPageType === 'actors' || searchState.currentPageType === 'directors') {
            results = await searchPersons(query, 1);
        } else {
            results = await searchFilms(query, 1);
        }
        displaySearchResults(results);
    } catch (error) {
        console.error('Ошибка поиска:', error);
        showSearchNotification('Ошибка при выполнении поиска', 'error');
    } finally {
        showSearchLoading(false);
    }
}

// API запрос для поиска фильмов
async function searchFilms(query, page = 1) {
    searchState.isLoading = true;
    
    let url = `${KINOPOISK_BASE_URL}?keyword=${encodeURIComponent(query)}&page=${page}`;
    
    // Добавляем фильтры в зависимости от типа страницы
    switch(searchState.currentPageType) {
        case 'movies':
            url += '&type=FILM';
            break;
        case 'series':
            url += '&type=TV_SERIES';
            break;
    }
    
    const yearFilter = document.getElementById('yearFilter');
    const genreFilter = document.getElementById('genreFilter');
    const typeFilter = document.getElementById('typeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    
    if (yearFilter && yearFilter.value) url += `&yearFrom=${yearFilter.value}&yearTo=${yearFilter.value}`;
    if (genreFilter && genreFilter.value) url += `&genres=${genreFilter.value}`;
    if (typeFilter && typeFilter.value && typeFilter.value !== 'ALL') url += `&type=${typeFilter.value}`;
    if (ratingFilter && ratingFilter.value > 0) url += `&ratingFrom=${ratingFilter.value}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': KINOPOISK_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        searchState.totalPages = data.totalPages || 1;
        return data;
        
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    } finally {
        searchState.isLoading = false;
    }
}

// API запрос для поиска персон (актеров/режиссеров)
async function searchPersons(query, page = 1) {
    searchState.isLoading = true;
    
    // Используем поиск по фильмам с фильтром по персонам
    let url = `${KINOPOISK_BASE_URL}?keyword=${encodeURIComponent(query)}&page=${page}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': KINOPOISK_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Получаем детальную информацию для каждого найденного фильма
        const detailedPersons = await getDetailedPersonInfo(query);
        
        // Объединяем результаты
        const result = {
            items: detailedPersons,
            total: detailedPersons.length,
            totalPages: 1
        };
        
        searchState.totalPages = result.totalPages;
        return result;
        
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    } finally {
        searchState.isLoading = false;
    }
}

// Получение детальной информации о персонах
async function getDetailedPersonInfo(query) {
    try {
        // Ищем персон через API staff
        const searchUrl = `https://kinopoiskapiunofficial.tech/api/v1/persons?name=${encodeURIComponent(query)}`;
        console.log('🔍 Поиск персон по URL:', searchUrl);
        
        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'X-API-KEY': KINOPOISK_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const personsData = await response.json();
        console.log('📊 Данные от API:', personsData);
        
        // Проверяем структуру ответа
        if (!personsData) {
            console.log('❌ Пустой ответ от API');
            return [];
        }
        
        let personsArray = [];
        
        // Обрабатываем разные форматы ответа
        if (Array.isArray(personsData)) {
            personsArray = personsData;
        } else if (personsData.items && Array.isArray(personsData.items)) {
            personsArray = personsData.items;
        } else if (personsData.persons && Array.isArray(personsData.persons)) {
            personsArray = personsData.persons;
        } else {
            console.log('❌ Неизвестный формат данных:', personsData);
            return [];
        }
        
        if (personsArray.length === 0) {
            console.log('❌ Персоны не найдены');
            return [];
        }
        
        console.log(`✅ Найдено персон: ${personsArray.length}`);
        
        // Для каждой персоны получаем детальную информацию
        const detailedPersons = [];
        
        for (const person of personsArray.slice(0, 10)) { // Ограничиваем 10 результатами
            try {
                console.log(`🔍 Загружаем детали для персоны ID: ${person.kinopoiskId || person.personId}`);
                const personDetail = await getPersonDetail(person.kinopoiskId || person.personId);
                if (personDetail) {
                    detailedPersons.push(personDetail);
                } else {
                    // Добавляем базовую информацию если детальная не загрузилась
                    console.log(`⚠️ Используем базовую информацию для ${person.nameRu}`);
                    detailedPersons.push({
                        kinopoiskId: person.kinopoiskId || person.personId,
                        nameRu: person.nameRu,
                        nameEn: person.nameEn,
                        posterUrl: person.posterUrl,
                        photoUrl: person.photoUrl,
                        age: person.age || null,
                        birthday: person.birthday,
                        birthplace: person.birthplace,
                        profession: person.profession,
                        professionKey: person.professionKey
                    });
                }
            } catch (error) {
                console.error(`❌ Ошибка загрузки деталей для персоны ${person.kinopoiskId}:`, error);
                // Добавляем базовую информацию если детальная не загрузилась
                detailedPersons.push({
                    kinopoiskId: person.kinopoiskId || person.personId,
                    nameRu: person.nameRu,
                    nameEn: person.nameEn,
                    posterUrl: person.posterUrl,
                    photoUrl: person.photoUrl,
                    age: person.age || null,
                    birthday: person.birthday,
                    birthplace: person.birthplace,
                    profession: person.profession,
                    professionKey: person.professionKey
                });
            }
        }
        
        console.log(`✅ Успешно загружено деталей: ${detailedPersons.length}`);
        return detailedPersons;
        
    } catch (error) {
        console.error('❌ Ошибка поиска персон:', error);
        return [];
    }
}

// Получение детальной информации о персоне
async function getPersonDetail(personId) {
    try {
        const url = `https://kinopoiskapiunofficial.tech/api/v1/staff/${personId}`;
        console.log(`🔍 Запрос деталей персоны: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': KINOPOISK_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            console.log(`❌ Ошибка HTTP ${response.status} для персоны ${personId}`);
            return null;
        }
        
        const personData = await response.json();
        console.log(`✅ Данные персоны ${personId}:`, personData);
        return personData;
        
    } catch (error) {
        console.error(`❌ Ошибка загрузки деталей персоны ${personId}:`, error);
        return null;
    }
}

// API запрос для поиска персон (актеров/режиссеров)
async function searchPersons(query, page = 1) {
    searchState.isLoading = true;
    
    try {
        console.log(`🔍 Начинаем поиск персон: "${query}", страница ${page}`);
        
        // Получаем детальную информацию о персонах
        const detailedPersons = await getDetailedPersonInfo(query);
        
        // Формируем результат
        const result = {
            items: detailedPersons,
            total: detailedPersons.length,
            totalPages: Math.ceil(detailedPersons.length / 20) || 1
        };
        
        console.log(`✅ Результат поиска: ${result.total} персон`);
        searchState.totalPages = result.totalPages;
        return result;
        
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    } finally {
        searchState.isLoading = false;
    }
}

// Отображение результатов поиска
function displaySearchResults(data) {
    const resultsContainer = document.getElementById('searchResults');
    const resultsGrid = document.getElementById('searchResultsGrid');
    const resultsTitle = document.getElementById('searchResultsTitle');
    const resultsCount = document.getElementById('searchResultsCount');
    
    const hasResults = (data.items && data.items.length > 0) || (data.films && data.films.length > 0);
    
    if (!hasResults) {
        let noResultsMessage = `😔 По запросу "${searchState.currentQuery}" ничего не найдено`;
        
        switch(searchState.currentPageType) {
            case 'movies':
                noResultsMessage = `😔 Фильмы по запросу "${searchState.currentQuery}" не найдены`;
                break;
            case 'series':
                noResultsMessage = `😔 Сериалы по запросу "${searchState.currentQuery}" не найдены`;
                break;
            case 'actors':
                noResultsMessage = `😔 Актеры по запросу "${searchState.currentQuery}" не найдены`;
                break;
            case 'directors':
                noResultsMessage = `😔 Режиссеры по запросу "${searchState.currentQuery}" не найдены`;
                break;
        }
        
        resultsGrid.innerHTML = `
            <div class="search-no-results">
                <p>${noResultsMessage}</p>
                <p>Попробуйте изменить поисковый запрос или фильтры</p>
            </div>
        `;
        resultsCount.textContent = '0 результатов';
    } else {
        if (searchState.currentPageType === 'actors' || searchState.currentPageType === 'directors') {
            resultsGrid.innerHTML = data.items ? data.items.map(person => createPersonCard(person)).join('') : '';
            resultsCount.textContent = `${data.total || data.items.length} результатов`;
        } else {
            resultsGrid.innerHTML = data.items.map(film => createFilmCard(film)).join('');
            resultsCount.textContent = `${data.total || data.items.length} результатов`;
        }
        
        let resultsTitleText = `Результаты поиска: "${searchState.currentQuery}"`;
        switch(searchState.currentPageType) {
            case 'movies':
                resultsTitleText = `Найденные фильмы: "${searchState.currentQuery}"`;
                break;
            case 'series':
                resultsTitleText = `Найденные сериалы: "${searchState.currentQuery}"`;
                break;
            case 'actors':
                resultsTitleText = `Найденные актеры: "${searchState.currentQuery}"`;
                break;
            case 'directors':
                resultsTitleText = `Найденные режиссеры: "${searchState.currentQuery}"`;
                break;
        }
        
        resultsTitle.textContent = resultsTitleText;
        
        // Добавляем пагинацию если есть больше 1 страницы
        if (searchState.totalPages > 1) {
            createPagination();
        }
    }
    
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Создание карточки фильма
function createFilmCard(film) {
    const posterUrl = film.posterUrlPreview || film.posterUrl || 'https://via.placeholder.com/300x450/1a237e/ffffff?text=No+Image';
    const rating = film.ratingKinopoisk || film.ratingImdb || '—';
    const year = film.year || '—';
    const genres = film.genres ? film.genres.map(g => g.genre).join(', ') : '—';
    
    return `
        <div class="search-film-card" data-film-id="${film.kinopoiskId || film.filmId}">
            <div class="search-film-image">
                <img src="${posterUrl}" alt="${film.nameRu || film.nameEn}" loading="lazy">
                ${rating !== '—' ? `<div class="search-film-rating">${rating}</div>` : ''}
            </div>
            <div class="search-film-content">
                <h4 class="search-film-title">${film.nameRu || film.nameEn}</h4>
                <p class="search-film-original-title">${film.nameEn || ''}</p>
                <div class="search-film-info">
                    <span class="search-film-year">${year}</span>
                    <span class="search-film-genres">${genres}</span>
                </div>
                <p class="search-film-description">${(film.description || '').substring(0, 150)}...</p>
                <button class="search-film-details" onclick="showFilmDetails(${film.kinopoiskId || film.filmId})">
                    Подробнее
                </button>
            </div>
        </div>
    `;
}

// Создание карточки персоны
function createPersonCard(person) {
    console.log('🎭 Создание карточки для:', person);
    
    const photoUrl = person.posterUrl || person.photoUrl || 'https://via.placeholder.com/300x450/1a237e/ffffff?text=No+Photo';
    const age = person.age ? `${person.age} лет` : '—';
    const birthday = person.birthday ? new Date(person.birthday).toLocaleDateString('ru-RU') : '—';
    const birthplace = person.birthplace || '—';
    
    // Подсчитываем количество фильмов
    let filmsCount = 0;
    if (person.films && Array.isArray(person.films)) {
        filmsCount = person.films.length;
    }
    
    // Определяем профессию
    let profession = getPersonProfession(person);
    
    return `
        <div class="search-person-card" data-person-id="${person.kinopoiskId || person.personId}">
            <div class="search-person-image">
                <img src="${photoUrl}" alt="${person.nameRu || person.nameEn}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450/1a237e/ffffff?text=No+Photo'">
                <div class="search-person-profession">${profession}</div>
            </div>
            <div class="search-person-content">
                <h4 class="search-person-title">${person.nameRu || person.nameEn || 'Неизвестно'}</h4>
                <p class="search-person-original-title">${person.nameEn || person.nameRu || ''}</p>
                <div class="search-person-info">
                    <span class="search-person-age">Возраст: ${age}</span>
                    <span class="search-person-films">Фильмов: ${filmsCount}</span>
                </div>
                <div class="search-person-details">
                    <span class="search-person-birthday">Дата рождения: ${birthday}</span>
                    ${birthplace !== '—' ? `<span class="search-person-birthplace">Место: ${birthplace}</span>` : ''}
                </div>
                <p class="search-person-description">${getPersonDescription(person)}</p>
                <button class="search-person-details-btn" onclick="showPersonDetails(${person.kinopoiskId || person.personId})">
                    Подробнее
                </button>
            </div>
        </div>
    `;
}

// Получение профессии персоны
function getPersonProfession(person) {
    if (person.profession) {
        return person.profession;
    }
    if (person.professionKey === 'ACTOR') return 'Актер';
    if (person.professionKey === 'DIRECTOR') return 'Режиссер';
    if (person.professionText) return person.professionText;
    return 'Актер/Режиссер';
}

// Получение описания для персоны
function getPersonDescription(person) {
    if (person.description) {
        return person.description.substring(0, 150) + '...';
    }
    
    const profession = getPersonProfession(person);
    const name = person.nameRu || person.nameEn || 'Персона';
    
    if (person.birthplace && person.birthday) {
        return `${profession} ${name}. Родился(ась) ${new Date(person.birthday).toLocaleDateString('ru-RU')} в ${person.birthplace}.`;
    }
    
    if (person.birthday) {
        return `${profession} ${name}. Дата рождения: ${new Date(person.birthday).toLocaleDateString('ru-RU')}.`;
    }
    
    return `${profession} ${name}. Информация будет дополнена.`;
}

// Текст профессии
function professionText(person) {
    if (person.professionKey === 'ACTOR') return 'Актер';
    if (person.professionKey === 'DIRECTOR') return 'Режиссер';
    return 'Актер/Режиссер';
}

// Пагинация
function createPagination() {
    const paginationContainer = document.getElementById('searchPagination');
    let paginationHTML = '';
    
    if (searchState.currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="loadPage(${searchState.currentPage - 1})">‹ Назад</button>`;
    }
    
    // Показываем до 5 страниц
    const startPage = Math.max(1, searchState.currentPage - 2);
    const endPage = Math.min(searchState.totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === searchState.currentPage ? 'active' : ''}" 
                    onclick="loadPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (searchState.currentPage < searchState.totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="loadPage(${searchState.currentPage + 1})">Вперед ›</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
    paginationContainer.style.display = 'flex';
}

// Загрузка страницы
async function loadPage(page) {
    if (searchState.isLoading) return;
    
    searchState.currentPage = page;
    showSearchLoading(true);
    
    try {
        let results;
        if (searchState.currentPageType === 'actors' || searchState.currentPageType === 'directors') {
            results = await searchPersons(searchState.currentQuery, page);
        } else {
            results = await searchFilms(searchState.currentQuery, page);
        }
        displaySearchResults(results);
        
        // Прокручиваем к результатам
        document.getElementById('searchResults').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        showSearchNotification('Ошибка при загрузке страницы', 'error');
    } finally {
        showSearchLoading(false);
    }
}

// Детали фильма
async function showFilmDetails(filmId) {
    try {
        const response = await fetch(`${KINOPOISK_BASE_URL}/${filmId}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': KINOPOISK_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) throw new Error('Film not found');
        
        const film = await response.json();
        showFilmModal(film);
        
    } catch (error) {
        console.error('Ошибка загрузки деталей фильма:', error);
        showSearchNotification('Не удалось загрузить информацию о фильме', 'error');
    }
}

// Детали персоны
async function showPersonDetails(personId) {
    try {
        const person = await getPersonDetail(personId);
        if (person) {
            showPersonModal(person);
        } else {
            throw new Error('Person not found');
        }
    } catch (error) {
        console.error('Ошибка загрузки деталей персоны:', error);
        showSearchNotification('Не удалось загрузить информацию о персоне', 'error');
    }
}

// Модальное окно фильма
function showFilmModal(film) {
    const modal = document.createElement('div');
    modal.className = 'film-modal';
    modal.innerHTML = `
        <div class="film-modal-content">
            <button class="film-modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            <div class="film-modal-header">
                <img src="${film.posterUrl || film.posterUrlPreview || 'https://via.placeholder.com/300x450/1a237e/ffffff?text=No+Image'}" 
                     alt="${film.nameRu}" class="film-modal-poster">
                <div class="film-modal-info">
                    <h2>${film.nameRu}</h2>
                    <p class="film-modal-original">${film.nameOriginal || film.nameEn || ''}</p>
                    <div class="film-modal-rating">Рейтинг: ${film.ratingKinopoisk || film.ratingImdb || '—'}</div>
                    <div class="film-modal-year">Год: ${film.year || '—'}</div>
                    <div class="film-modal-length">Длительность: ${film.filmLength || '—'} мин.</div>
                    <div class="film-modal-genres">${film.genres ? film.genres.map(g => g.genre).join(', ') : '—'}</div>
                    <div class="film-modal-countries">${film.countries ? film.countries.map(c => c.country).join(', ') : '—'}</div>
                </div>
            </div>
            <div class="film-modal-description">
                <h3>Описание</h3>
                <p>${film.description || 'Описание отсутствует'}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Модальное окно персоны
function showPersonModal(person) {
    const age = person.age ? `${person.age} лет` : '—';
    const birthday = person.birthday ? new Date(person.birthday).toLocaleDateString('ru-RU') : '—';
    const birthplace = person.birthplace || '—';
    const death = person.death ? new Date(person.death).toLocaleDateString('ru-RU') : '—';
    const deathplace = person.deathplace || '—';
    
    const modal = document.createElement('div');
    modal.className = 'film-modal';
    modal.innerHTML = `
        <div class="film-modal-content">
            <button class="film-modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            <div class="film-modal-header">
                <img src="${person.posterUrl || person.photoUrl || 'https://via.placeholder.com/300x450/1a237e/ffffff?text=No+Photo'}" 
                     alt="${person.nameRu || person.nameEn}" class="film-modal-poster">
                <div class="film-modal-info">
                    <h2>${person.nameRu || person.nameEn}</h2>
                    <p class="film-modal-original">${person.nameEn || person.nameRu || ''}</p>
                    <div class="film-modal-age">Возраст: ${age}</div>
                    <div class="film-modal-birthday">Дата рождения: ${birthday}</div>
                    <div class="film-modal-birthplace">Место рождения: ${birthplace}</div>
                    ${death !== '—' ? `<div class="film-modal-death">Дата смерти: ${death}</div>` : ''}
                    ${deathplace !== '—' ? `<div class="film-modal-deathplace">Место смерти: ${deathplace}</div>` : ''}
                    <div class="film-modal-profession">Профессия: ${professionText(person)}</div>
                </div>
            </div>
            <div class="film-modal-description">
                <h3>Биография</h3>
                <p>${person.description || 'Биография отсутствует'}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Вспомогательные функции
function clearSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    const resultsGrid = document.getElementById('searchResultsGrid');
    const pagination = document.getElementById('searchPagination');
    
    if (resultsGrid) resultsGrid.innerHTML = '';
    if (pagination) {
        pagination.innerHTML = '';
        pagination.style.display = 'none';
    }
    if (resultsContainer) resultsContainer.style.display = 'none';
}

function showSearchLoading(show) {
    const loadingElement = document.getElementById('searchLoading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

function showSearchNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `search-notification search-notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 10px;
        border-left: 4px solid ${type === 'error' ? '#F44336' : 'var(--text-accent)'};
        box-shadow: 0 5px 20px var(--shadow-color);
        z-index: 1001;
        animation: searchSlideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// ========== АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});

// Экспортируем функции для глобального использования
window.initSearch = initSearch;
window.performSearch = performSearch;
window.loadPage = loadPage;
window.showFilmDetails = showFilmDetails;
window.showPersonDetails = showPersonDetails;