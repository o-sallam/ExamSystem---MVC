// DOM Element Management
export const DOMElements = {
    initializeElements() {
        return {
            quizContainer: document.getElementById('quiz-container'),
            resultsContainer: document.getElementById('results-container'),
            questionTitle: document.getElementById('question-title'),
            answerOptions: document.querySelectorAll('.answer-option'),
            prevButton: document.getElementById('prev-btn'),
            nextButton: document.getElementById('next-btn'),
            currentQuestionSpan: document.getElementById('currentQuestion'),
            totalQuestionsSpan: document.getElementById('totalQuestions'),
            totalQuestionsProgressSpan: document.getElementById('totalQuestionsProgress'),
            answeredQuestionsSpan: document.getElementById('answeredQuestions'),
            progressBar: document.getElementById('progressBar'),
            questionDotsContainer: document.getElementById('question-dots'),
            percentageElement: document.getElementById('percentage'),
            percentageCircle: document.getElementById('percentage-circle')
        };
    }
};