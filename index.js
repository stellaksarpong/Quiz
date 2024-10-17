const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const choicesContainer = document.getElementById('choices');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const progressBar = document.getElementById('progress-bar');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Fetch questions from the API
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=9');
        const data = await response.json();
        questions = data.results;
        displayQuestion();
        updateProgressBar();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Display the current question
function displayQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionText = decodeHTML(currentQuestion.question);
    questionElement.innerText = `Q${currentQuestionIndex + 1}: ${questionText}`;

    const choices = [...currentQuestion.incorrect_answers];
    const correctAnswer = currentQuestion.correct_answer;
    choices.splice(Math.floor(Math.random() * (choices.length + 1)), 0, correctAnswer);

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = decodeHTML(choice);
        button.classList.add('choice');
        button.addEventListener('click', () => selectAnswer(button, correctAnswer));
        choicesContainer.appendChild(button);
    });

    
}

// Decode HTML entities from the API
function decodeHTML(html) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
}

// Reset the state for the next question
function resetState() {
    nextButton.style.display = 'none';
    while (choicesContainer.firstChild) {
        choicesContainer.removeChild(choicesContainer.firstChild);
    }
}

// Handle answer selection
function selectAnswer(button, correctAnswer) {
    const selectedAnswer = button.innerText;
    if (selectedAnswer === decodeHTML(correctAnswer)) {
        button.style.backgroundColor = '#00b894';
        score++;
    } else {
        button.style.backgroundColor = '#d63031';
    }
    Array.from(choicesContainer.children).forEach(choice => {
        choice.disabled = true;
        if (choice.innerText === decodeHTML(correctAnswer)) {
            choice.style.backgroundColor = '#00b894';
        }
    });
    nextButton.style.display = 'block';
    updateProgressBar();
}

// Show the next question or the result if the quiz is over
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResult();
    }
});


// Display the final result
function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.classList.add('fade-in');
    resultContainer.innerHTML = `<h2>You scored ${score} out of ${questions.length}!</h2>`;
}

// Update the progress bar
function updateProgressBar() {
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Start the quiz by fetching questions
fetchQuestions();

