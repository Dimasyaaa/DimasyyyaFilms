// ========== КИНОВИКТОРИНА ==========

let currentQuiz = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    isInitialized: false
};

function initMovieQuiz() {
    // Инициализируем вопросы викторины
    initQuizQuestions();
    
    // Добавляем обработчик клика на существующую кнопку
    const quizButton = document.getElementById('headerQuizBtn');
    if (quizButton) {
        quizButton.addEventListener('click', startQuiz);
    } else {
        console.error('❌ Кнопка викторины не найдена!');
    }
}

function initQuizQuestions() {
    currentQuiz.questions = [
        {
            question: "Кто режиссер фильма 'Побег из Шоушенка'?",
            options: ["Кристофер Нолан", "Фрэнк Дарабонт", "Стивен Спилберг", "Квентин Тарантино"],
            answer: 1,
            fact: "Фрэнк Дарабонт также снял 'Зеленую милю' по роману Стивена Кинга."
        },
        {
            question: "Какой фильм получил наибольшее количество Оскаров?",
            options: ["Титаник", "Властелин колец: Возвращение короля", "Бен-Гур", "Ла-Ла Ленд"],
            answer: 2,
            fact: "'Бен-Гур', 'Титаник' и 'Властелин колец: Возвращение короля' получили по 11 Оскаров."
        },
        {
            question: "Кто сыграл Джокера в фильме 'Темный рыцарь'?",
            options: ["Джаред Лето", "Хоакин Феникс", "Хит Леджер", "Джек Николсон"],
            answer: 2,
            fact: "Хит Леджер посмертно получил Оскар за эту роль."
        },
        {
            question: "Какой фильм является самым кассовым в истории?",
            options: ["Аватар", "Мстители: Финал", "Титаник", "Звездные войны: Пробуждение силы"],
            answer: 0,
            fact: "'Аватар' Джеймса Кэмерона собрал в прокате более 2.8 миллиардов долларов."
        },
        {
            question: "Кто режиссер трилогии 'Властелин колец'?",
            options: ["Стивен Спилберг", "Питер Джексон", "Джордж Лукас", "Ридли Скотт"],
            answer: 1,
            fact: "Питер Джексон снял все три фильма в Новой Зеландии."
        },
        {
            question: "Какой актер сыграл Тони Старка в кинематографической вселенной Marvel?",
            options: ["Крис Эванс", "Роберт Дауни-мл.", "Крис Хемсворт", "Марк Руффало"],
            answer: 1,
            fact: "Роберт Дауни-мл. сыграл Железного человека в 10 фильмах MCU."
        },
        {
            question: "Какой фильм считается первым полнометражным анимационным фильмом?",
            options: ["Белоснежка и семь гномов", "Пиноккио", "Фантазия", "Бэмби"],
            answer: 0,
            fact: "'Белоснежка и семь гномов' была выпущена студией Disney в 1937 году."
        },
        {
            question: "Кто снял фильм 'Криминальное чтиво'?",
            options: ["Мартин Скорсезе", "Квентин Тарантино", "Братья Коэн", "Гай Ричи"],
            answer: 1,
            fact: "Фильм получил Золотую пальмовую ветвь в Каннах в 1994 году."
        },
        {
            question: "Какой фильм выиграл Оскар за лучший фильм в 2020 году?",
            options: ["1917", "Джокер", "Паразиты", "Однажды в Голливуде"],
            answer: 2,
            fact: "'Паразиты' - первый неанглоязычный фильм, получивший Оскар за лучший фильм."
        },
        {
            question: "Кто режиссер фильма 'Начало'?",
            options: ["Дени Вильнёв", "Кристофер Нолан", "Альфонсо Куарон", "Дэмьен Шазелл"],
            answer: 1,
            fact: "Кристофер Нолан также снял 'Темный рыцарь', 'Интерстеллар' и 'Помни'."
        }
    ];
    
    currentQuiz.totalQuestions = currentQuiz.questions.length;
    currentQuiz.isInitialized = true;
}

function startQuiz() {
    // Проверяем инициализацию вопросов
    if (!currentQuiz.isInitialized || currentQuiz.questions.length === 0) {
        console.error('❌ Вопросы викторины не инициализированы!');
        initQuizQuestions();
    }
    
    // Сбрасываем викторину
    currentQuiz.currentQuestionIndex = 0;
    currentQuiz.score = 0;
    
    // Создаем или показываем контейнер викторины
    let quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) {
        createQuizContainer();
        quizContainer = document.getElementById('quizContainer');
    }
    
    quizContainer.style.display = 'block';
    
    // Обновляем статистику
    updateQuizStats();
    
    // Показываем первый вопрос
    showQuestion();
    
    // Прокручиваем к викторине
    quizContainer.scrollIntoView({ behavior: 'smooth' });
    
    showQuizNotification('Киновикторина началась! Удачи! 🎬', 'success');
}

function createQuizContainer() {
    const quizHTML = `
        <div class="quiz-container" id="quizContainer">
            <div class="quiz-header">
                <h2>🎮 Киновикторина</h2>
                <div class="quiz-stats">
                    <span class="quiz-score">Счёт: <span id="score">0</span></span>
                    <span class="quiz-progress">Вопрос <span id="currentQuestion">1</span>/<span id="totalQuestions">10</span></span>
                </div>
            </div>
            
            <div class="quiz-content">
                <div class="question-container">
                    <h3 id="questionText"></h3>
                    <div class="options-container" id="optionsContainer"></div>
                </div>
                
                <div class="quiz-result" id="quizResult" style="display: none;">
                    <h3 id="resultTitle"></h3>
                    <p id="resultMessage"></p>
                    <div class="result-stats">
                        <p>Правильных ответов: <span id="correctAnswers">0</span>/10</p>
                        <p>Ваш результат: <span id="finalScore">0</span> баллов</p>
                    </div>
                    <button class="quiz-restart" onclick="restartQuiz()">🎯 Пройти ещё раз</button>
                </div>
            </div>
            
            <div class="quiz-controls">
                <button class="quiz-close" onclick="closeQuiz()">✕ Закрыть</button>
            </div>
        </div>
    `;
    
    const quizSection = document.createElement('section');
    quizSection.className = 'quiz-section';
    quizSection.innerHTML = quizHTML;
    
    document.getElementById('content').appendChild(quizSection);
}

function showQuestion() {
    // Проверяем, есть ли вопросы
    if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
        console.error('❌ Нет вопросов для показа!');
        return;
    }
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    
    if (!questionText || !optionsContainer) {
        console.error('❌ Элементы викторины не найдены!');
        return;
    }
    
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'quiz-option';
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(optionButton);
    });
    
    updateQuizStats();
}

function checkAnswer(selectedIndex) {
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(option => {
        option.disabled = true;
    });
    
    options[question.answer].classList.add('correct');
    if (selectedIndex !== question.answer) {
        options[selectedIndex].classList.add('incorrect');
    }
    
    if (selectedIndex === question.answer) {
        currentQuiz.score += 10;
        showQuizNotification('Правильно! ✅', 'success');
    } else {
        showQuizNotification(`Неправильно! ${question.fact}`, 'error');
    }
    
    setTimeout(() => {
        currentQuiz.currentQuestionIndex++;
        
        if (currentQuiz.currentQuestionIndex < currentQuiz.totalQuestions) {
            showQuestion();
        } else {
            showQuizResult();
        }
    }, 2000);
}

function updateQuizStats() {
    const scoreElement = document.getElementById('score');
    const currentQuestionElement = document.getElementById('currentQuestion');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    
    if (scoreElement) scoreElement.textContent = currentQuiz.score;
    if (currentQuestionElement) currentQuestionElement.textContent = currentQuiz.currentQuestionIndex + 1;
    if (totalQuestionsElement) totalQuestionsElement.textContent = currentQuiz.totalQuestions;
}

function showQuizResult() {
    const questionContainer = document.querySelector('.question-container');
    const quizResult = document.getElementById('quizResult');
    const correctAnswers = document.getElementById('correctAnswers');
    const finalScore = document.getElementById('finalScore');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    if (!questionContainer || !quizResult) {
        console.error('❌ Элементы результатов не найдены!');
        return;
    }
    
    questionContainer.style.display = 'none';
    quizResult.style.display = 'block';
    
    const correctCount = Math.floor(currentQuiz.score / 10);
    if (correctAnswers) correctAnswers.textContent = correctCount;
    if (finalScore) finalScore.textContent = currentQuiz.score;
    
    if (resultTitle && resultMessage) {
        if (currentQuiz.score >= 80) {
            resultTitle.textContent = '🎉 Браво! Вы киноман!';
            resultMessage.textContent = 'Вы настоящий знаток кино! Ваши знания впечатляют.';
        } else if (currentQuiz.score >= 60) {
            resultTitle.textContent = '👍 Отличный результат!';
            resultMessage.textContent = 'Вы хорошо разбираетесь в кино! Продолжайте в том же духе.';
        } else if (currentQuiz.score >= 40) {
            resultTitle.textContent = '😊 Неплохо!';
            resultMessage.textContent = 'Хорошие знания, но есть куда расти! Смотрите больше фильмов.';
        } else {
            resultTitle.textContent = '🎬 Начинающий кинолюбитель';
            resultMessage.textContent = 'Время пересмотреть классику кино!';
        }
    }
}

function restartQuiz() {
    currentQuiz.currentQuestionIndex = 0;
    currentQuiz.score = 0;
    
    const questionContainer = document.querySelector('.question-container');
    const quizResult = document.getElementById('quizResult');
    
    if (questionContainer) questionContainer.style.display = 'block';
    if (quizResult) quizResult.style.display = 'none';
    
    showQuestion();
    
    showQuizNotification('Новая попытка! Удачи! 🍀', 'info');
}

function closeQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (quizContainer) {
        quizContainer.style.display = 'none';
    }
    showQuizNotification('Викторина завершена! Возвращайтесь ещё! 🎯', 'info');
}

// Функция для показа уведомлений
function showQuizNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
        border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : 'var(--text-accent)'};
        box-shadow: 0 5px 20px var(--shadow-color);
        z-index: 1000;
        animation: quizSlideInRight 0.3s ease;
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
    initMovieQuiz();
});

// Экспортируем функции для глобального использования
window.initMovieQuiz = initMovieQuiz;
window.startQuiz = startQuiz;
window.restartQuiz = restartQuiz;
window.closeQuiz = closeQuiz;