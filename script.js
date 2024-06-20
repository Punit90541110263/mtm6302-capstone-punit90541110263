document.addEventListener("DOMContentLoaded", function () {
    const difficultyForm = document.getElementById("difficulty-form");
    const quizContainer = document.getElementById("quiz-container");
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const submitAnswerButton = document.getElementById("submit-answer");
    const resultElement = document.getElementById("result");
    const currentQuestionElement = document.getElementById("current-question");
    const totalQuestionsElement = document.getElementById("total-questions");
    const correctCountElement = document.getElementById("correct-count");
    const incorrectCountElement = document.getElementById("incorrect-count");
    const resetScoreButton = document.getElementById("reset-score");
    const finalScoreContainer = document.getElementById("final-score-container");
    const finalCorrectCountElement = document.getElementById("final-correct-count");
    const finalIncorrectCountElement = document.getElementById("final-incorrect-count");
    const restartQuizButton = document.getElementById("restart-quiz");

    let questions = [];
    let currentQuestionIndex = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    difficultyForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const difficulty = document.getElementById("difficulty").value;
        fetchQuestions(difficulty);
    });

    function fetchQuestions(difficulty) {
        fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`)
            .then(response => response.json())
            .then(data => {
                questions = data.results;
                currentQuestionIndex = 0;
                correctCount = 0;
                incorrectCount = 0;
                displayQuestion();
                updateScore();
                quizContainer.classList.remove("hidden");
                finalScoreContainer.classList.add("hidden");
                resultElement.textContent = "";
            });
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = decodeHTML(currentQuestion.question);
            answersElement.innerHTML = "";

            const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
            allAnswers.sort(() => Math.random() - 0.5);

            allAnswers.forEach(answer => {
                const answerButton = document.createElement("button");
                answerButton.textContent = decodeHTML(answer);
                answerButton.classList.add("answer-button");
                answerButton.addEventListener("click", () => selectAnswer(answer, currentQuestion.correct_answer));
                answersElement.appendChild(answerButton);
            });

            currentQuestionElement.textContent = currentQuestionIndex + 1;
            totalQuestionsElement.textContent = questions.length;
            submitAnswerButton.classList.add("hidden");
        } else {
            endQuiz();
        }
    }

    function selectAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            correctCount++;
        } else {
            incorrectCount++;
        }
        currentQuestionIndex++;
        displayQuestion();
        updateScore();
    }

    function updateScore() {
        correctCountElement.textContent = correctCount;
        incorrectCountElement.textContent = incorrectCount;
    }

    function endQuiz() {
        finalCorrectCountElement.textContent = correctCount;
        finalIncorrectCountElement.textContent = incorrectCount;
        finalScoreContainer.classList.remove("hidden");
        quizContainer.classList.add("hidden");
    }

    resetScoreButton.addEventListener("click", function () {
        correctCount = 0;
        incorrectCount = 0;
        updateScore();
    });

    restartQuizButton.addEventListener("click", function () {
        difficultyForm.reset();
        finalScoreContainer.classList.add("hidden");
        quizContainer.classList.add("hidden");
        resultElement.textContent = "";
    });

    function decodeHTML(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
});
