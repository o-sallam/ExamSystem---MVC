import { QuizState } from './QuizStateManager.js';
import { ProgressManager } from './ProgressManager.js';

let quizData;

// Question Navigation
export const NavigationManager = {
    updateNavButtons(elements, quizLength) {
        if (elements.prevButton) {
            elements.prevButton.disabled = QuizState.currentQuestion === 0;
        }
        
        if (elements.nextButton) {
            if (QuizState.currentQuestion === quizLength - 1) {
                elements.nextButton.textContent = 'Finish Quiz';
                elements.nextButton.classList.add('bg-green-600');
            } else {
                elements.nextButton.textContent = 'Next';
                elements.nextButton.innerHTML = 'Next <i class="fas fa-arrow-right ml-2"></i>';
                elements.nextButton.classList.remove('bg-green-600');
            }
        }
    },

    swipeTo(targetIndex, direction, elements, handlers, data) {
        if (QuizState.isAnimating) return;
        QuizState.isAnimating = true;
        
        elements.quizContainer.style.transition = 'transform 250ms ease-out';
        elements.quizContainer.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
        
        QuizState.currentQuestion = targetIndex;
        handlers.loadQuestion(targetIndex);
        this.updateNavButtons(elements, data.length);
        ProgressManager.updateProgressIndicators(elements, data.length);
        
        void elements.quizContainer.offsetWidth;
        elements.quizContainer.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            QuizState.isAnimating = false;
        }, 250);
    }
};