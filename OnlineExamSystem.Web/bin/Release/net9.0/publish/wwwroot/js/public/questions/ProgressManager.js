import { QuizState } from './QuizStateManager.js';

// Progress Visualization
export const ProgressManager = {
    createQuestionDots(quizLength, elements, handlers) {
        elements.questionDotsContainer.innerHTML = '';
        for (let i = 0; i < quizLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'w-3 h-3 rounded-full bg-gray-300 cursor-pointer transition-all duration-300';
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => handlers.dotClickHandler(i));
            elements.questionDotsContainer.appendChild(dot);
            QuizState.questionDots.push(dot);
        }
    },

    updateProgressIndicators(elements, quizLength) {
        const answeredCount = QuizState.userAnswers.filter(answer => answer !== null).length;
        if (elements.answeredQuestionsSpan) {
            elements.answeredQuestionsSpan.textContent = answeredCount;
        }
        
        const progressPercentage = (answeredCount / quizLength) * 100;
        if (elements.progressBar) {
            elements.progressBar.style.width = `${progressPercentage}%`;
        }
        
        this.updateQuestionDots();
    },

    updateQuestionDots() {
        if (QuizState.questionDots.length > 0) {
            QuizState.questionDots.forEach((dot, index) => {
                dot.className = 'w-3 h-3 rounded-full cursor-pointer transition-all duration-300';
                
                if (index === QuizState.currentQuestion) {
                    dot.classList.add('bg-primary', 'w-4', 'h-4');
                } else if (QuizState.userAnswers[index] !== null) {
                    dot.classList.add('bg-green-500');
                } else {
                    dot.classList.add('bg-gray-300');
                }
            });
        }
    }
};