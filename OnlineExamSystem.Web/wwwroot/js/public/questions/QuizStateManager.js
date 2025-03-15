// Quiz State Management
export const QuizState = {
    currentQuestion: 0,
    score: 0,
    userAnswers: [],
    selectedOption: null,
    questionDots: [],
    isAnimating: false,

    initialize(totalQuestions) {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(totalQuestions).fill(null);
        this.selectedOption = null;
        this.questionDots = [];
        this.isAnimating = false;
    },

    setAnswer(questionIndex, answerIndex) {
        this.userAnswers[questionIndex] = answerIndex;
        this.selectedOption = answerIndex;
    },

    getAnswer(questionIndex) {
        return this.userAnswers[questionIndex];
    },

    clearAnswer(questionIndex) {
        this.userAnswers[questionIndex] = null;
        this.selectedOption = null;
    },

    hasAnswer(questionIndex) {
        return this.userAnswers[questionIndex] !== null;
    },

    getAllAnswers() {
        return this.userAnswers;
    },

    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(this.userAnswers.length).fill(null);
        this.selectedOption = null;
        this.isAnimating = false;
    }
};