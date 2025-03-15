import { DOMElements } from './DomElementsManager.js';
import { NavigationManager } from './NavigationManager.js';
import { ProgressManager } from './ProgressManager.js';
import { QuizState } from './QuizStateManager.js';
import { ResultsManager } from './ResultsManager.js';

let elements;
let quizData;

function loadQuestion(index) {
    const question = quizData[index];
    if (!question) {
        console.error('Question not found at index:', index);
        return;
    }
    elements.questionTitle.textContent = question.title;
    elements.currentQuestionSpan.textContent = index + 1;

    // Handle different formats of choices data
    let choiceEntries = [];
    if (question.choices) {
        if (typeof question.choices === 'object' && !Array.isArray(question.choices)) {
            // Handle object with numeric keys like {1: "text", 2: "text"}
            choiceEntries = Object.entries(question.choices).map(([key, value]) => {
                return [key, value];
            });
        } else if (Array.isArray(question.choices)) {
            // Handle array format
            choiceEntries = question.choices.map((choice, index) => {
                return [index, choice];
            });
        }
    }

    elements.answerOptions.forEach((option, i) => {
        const answerText = option.querySelector('p');
        if (choiceEntries[i]) {
            answerText.textContent = choiceEntries[i][1];
            option.classList.remove('selected', 'correct', 'incorrect');
            
            // Check if this question has a saved answer
            if (QuizState.getAnswer(index) === i) {
                option.classList.add('selected');
            }
        }
    });
}

function handleAnswerSelection(selectedIndex) {
    if (QuizState.isAnimating) return;

    // Update the QuizState with the selected answer
    QuizState.setAnswer(QuizState.currentQuestion, selectedIndex);

    // Update the UI to reflect the selection
    elements.answerOptions.forEach((option, i) => {
        option.classList.remove('selected');
        if (i === selectedIndex) {
            option.classList.add('selected');
        }
    });

    // Calculate and update the score whenever an answer is selected
    ResultsManager.calculateScore(quizData);
    ProgressManager.updateProgressIndicators(elements, quizData.length);
}

function handleDotClick(index) {
    if (QuizState.isAnimating) return;
    if (Math.abs(index - QuizState.currentQuestion) <= 1 || QuizState.hasAnswer(index)) {
        const direction = index > QuizState.currentQuestion ? 'right' : 'left';
        NavigationManager.swipeTo(index, direction, elements, { loadQuestion }, quizData);
    }
}

function initializeQuiz(data) {
    quizData = data;
    elements = DOMElements.initializeElements();
    QuizState.initialize(quizData.length);

    elements.totalQuestionsSpan.textContent = quizData.length;
    elements.totalQuestionsProgressSpan.textContent = quizData.length;

    ProgressManager.createQuestionDots(quizData.length, elements, { dotClickHandler: handleDotClick });
    loadQuestion(0);

    elements.answerOptions.forEach((option, index) => {
        option.addEventListener('click', () => handleAnswerSelection(index));
    });

    elements.prevButton.addEventListener('click', () => {
        if (QuizState.currentQuestion > 0) {
            NavigationManager.swipeTo(QuizState.currentQuestion - 1, 'left', elements, { loadQuestion }, quizData);
        }
    });

    elements.nextButton.addEventListener('click', () => {
        if (QuizState.currentQuestion < quizData.length - 1) {
            NavigationManager.swipeTo(QuizState.currentQuestion + 1, 'right', elements, { loadQuestion }, quizData);
        } else if (QuizState.currentQuestion === quizData.length - 1) {
            if (QuizState.hasAnswer(QuizState.currentQuestion)) {
                const endTime = new Date();
                const startTime = new Date(document.getElementById('quiz-start-time')?.value || Date.now() - 1000);
                
                const answers = QuizState.userAnswers.map((answer, index) => {
                    if (answer === null) return null;
                    
                    const question = quizData[index];
                    let selectedOptionId;
                    
                    // Handle different formats of choices data
                    if (typeof question.choices === 'object' && !Array.isArray(question.choices)) {
                        // For dictionary format like {"1": "text", "2": "text"}
                        const choiceKeys = Object.keys(question.choices);
                        if (choiceKeys.length > answer) {
                            selectedOptionId = parseInt(choiceKeys[answer]);
                        }
                    } else if (Array.isArray(question.choices)) {
                        // For array format
                        selectedOptionId = parseInt(answer);
                    }
                    
                    return {
                        QuestionId: question.id,
                        selectedAnswerId: selectedOptionId
                    };
                }).filter(a => a !== null);
                
                // Calculate final score
                const score = ResultsManager.calculateScore(quizData);

                // Create the submission data object in the required format to match ExamAttemptRequest model
                const examId = quizData[0].examId || parseInt(document.location.pathname.split('/').pop() || 0);
                const submissionData = {
                    ExamId: examId,
                    Score: score,
                    StartTime: startTime.toISOString(),
                    EndTime: endTime.toISOString(),
                    Answers: answers
                };
                
                fetch('/Exams/SubmitExamResult', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('input[name="__RequestVerificationToken"]')?.value
                    },
                    body: JSON.stringify(submissionData)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`Server returned ${response.status}: ${text || 'No error message provided'}`)
                        });
                    }
                    // Only try to parse as JSON if we have content
                    return response.text().then(text => {
                        return text ? JSON.parse(text) : {};
                    });
                })
                .then(data => {
                    ResultsManager.showResults(elements, quizData);
                    setTimeout(() => {
                        window.location.href = '/Exams';
                    }, 3000); // Wait 3 seconds before redirecting
                })
                .catch(error => {
                    console.error('Error submitting exam:', error);
                    alert('Failed to submit exam. Please try again.');
                });
            }
        }
    });

    NavigationManager.updateNavButtons(elements, quizData.length);
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const quizDataElement = document.getElementById('quiz-data');
    if (quizDataElement) {
        const data = JSON.parse(quizDataElement.textContent);
        initializeQuiz(data);
    }
});