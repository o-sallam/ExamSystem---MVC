import { QuizState } from './QuizStateManager.js';

// Results Management
export const ResultsManager = {
    calculateScore(quizData) {
        let correctAnswers = 0;
        const totalQuestions = quizData.length;

        for (let i = 0; i < totalQuestions; i++) {
            const userAnswer = QuizState.userAnswers[i];
            if (userAnswer !== null && userAnswer !== undefined) {
                const question = quizData[i];
                
                // Handle different formats of choices data
                let selectedId;
                
                if (typeof question.choices === 'object' && !Array.isArray(question.choices)) {
                    // For dictionary format like {"1": "text", "2": "text"}
                    const choiceKeys = Object.keys(question.choices);
                    if (choiceKeys.length > userAnswer) {
                        selectedId = choiceKeys[userAnswer];
                    }
                } else if (Array.isArray(question.choices)) {
                    // For array format
                    selectedId = String(userAnswer);
                }
                
                // Get the correct answer ID, ensuring it's a string for comparison
                const correctId = String(question.correctAnswerId);
                
                // Compare the IDs
                if (selectedId === correctId) {
                    correctAnswers++;
                }
            }
        }
        
        // Calculate score as a decimal between 0 and 1
        // Convert to decimal type for ExamAttemptRequest.Score property
        QuizState.score = totalQuestions > 0 ? parseFloat((correctAnswers / totalQuestions).toFixed(2)) : 0;
        return QuizState.score;
    },

    showResults(elements, quizData) {
        elements.quizContainer.classList.add('hidden');
        elements.resultsContainer.classList.remove('hidden');

        const finalScore = this.calculateScore(quizData);
        const percentage = Math.round(finalScore * 100);

        this.updateCircularProgress(percentage, elements);
        this.updateResultMessage(percentage);
        this.disableQuestionDots();
    },

    updateCircularProgress(percentage, elements) {
        if (!elements.percentageCircle || !elements.percentageElement) return;

        const circumference = 2 * Math.PI * 48;
        const offset = circumference - (percentage / 100) * circumference;

        elements.percentageCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        elements.percentageCircle.style.strokeDashoffset = circumference;

        elements.percentageCircle.setAttribute('stroke', 
            percentage >= 60 ? 'url(#success-gradient)' : 'url(#failure-gradient)');

        this.animateProgress(percentage, elements, circumference, offset);
    },

    animateProgress(percentage, elements, circumference, offset) {
        requestAnimationFrame(() => {
            elements.percentageElement.textContent = '0';
            let currentPercentage = 0;
            const duration = 1000;
            const startTime = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                currentPercentage = Math.round(progress * percentage);
                elements.percentageElement.textContent = currentPercentage;
                elements.percentageCircle.style.strokeDashoffset = 
                    circumference - (progress * (circumference - offset));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        });
    },

    updateResultMessage(percentage) {
        const resultMessage = document.getElementById('result-message');
        if (resultMessage) {
            if (percentage >= 60) {
                resultMessage.textContent = 'Congratulations! You passed the quiz!';
                resultMessage.classList.add('text-green-600');
                resultMessage.classList.remove('text-red-600', 'text-primary');
            } else {
                resultMessage.textContent = 'Sorry, you did not pass.';
                resultMessage.classList.add('text-red-600');
                resultMessage.classList.remove('text-green-600', 'text-primary');
            }
        }
    },

    disableQuestionDots() {
        const dots = document.querySelectorAll('.question-dot');
        dots.forEach(dot => dot.style.pointerEvents = 'none');
    }
};