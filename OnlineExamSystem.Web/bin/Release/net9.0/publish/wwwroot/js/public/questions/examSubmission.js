import { QuizState } from './QuizStateManager.js';

let startTime;

document.addEventListener('DOMContentLoaded', function() {
    // Record the start time when the quiz loads
    startTime = new Date();
    
    // Get the finish button
    const finishButton = document.querySelector('#finishExam');
    
    if (finishButton) {
        finishButton.addEventListener('click', handleExamSubmission);
    }
});

function handleExamSubmission(event) {
    event.preventDefault();
    
    // Collect all answers
    const answers = collectAnswers();
    
    // Submit answers via AJAX
    submitExam(answers);
}

// Helper function to get the exam ID from the URL or a hidden field
function getExamId() {
    // Try to get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examIdFromUrl = urlParams.get('id');
    if (examIdFromUrl) return parseInt(examIdFromUrl);
    
    // Try to get exam ID from a hidden field
    const examIdElement = document.getElementById('exam-id');
    if (examIdElement) return parseInt(examIdElement.value);
    
    // Try to get from data attribute
    const quizContainer = document.querySelector('[data-exam-id]');
    if (quizContainer) return parseInt(quizContainer.dataset.examId);
    
    // If we can't find it, check if it's in the quiz data
    const quizDataElement = document.getElementById('quiz-data');
    if (quizDataElement) {
        try {
            const quizData = JSON.parse(quizDataElement.textContent);
            if (quizData.length > 0 && quizData[0].examId) {
                return quizData[0].examId;
            }
        } catch (e) {
            console.error('Error parsing quiz data:', e);
        }
    }
    
    // Fallback
    return document.location.pathname.split('/').pop() || 0;
}

function collectAnswers() {
    const answers = [];
    
    // Get all selected radio inputs
    const selectedOptions = document.querySelectorAll('input[type="radio"]:checked');
    
    selectedOptions.forEach(option => {
        const questionId = option.getAttribute('name').replace('question_', '');
        answers.push({
            questionId: parseInt(questionId),
            selectedAnswerId: parseInt(option.value)
        });
    });
    
    return answers;
}

function submitExam(answers) {
    // Show loading state
    const finishButton = document.querySelector('#finishExam');
    if (finishButton) {
        finishButton.disabled = true;
        finishButton.textContent = 'Submitting...';
    }
    
    // Get the exam ID from the URL or a hidden field
    const examId = getExamId();
    const endTime = new Date();
    
    // Create the submission data object in the required format to match ExamAttemptRequest model
    const submissionData = {
        ExamId: examId,
        Score: QuizState.score || 0,
        StartTime: startTime.toISOString(),
        EndTime: endTime.toISOString(),
        Answers: answers.map(answer => ({
            QuestionId: answer.questionId,
            SelectedAnswerId: answer.selectedAnswerId
        }))
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
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle successful submission
        window.location.href = `/Exams/Results?examId=${examId}`;
    })
    .catch(error => {
        console.error('Error:', error);
        // Re-enable the button and show error
        if (finishButton) {
            finishButton.disabled = false;
            finishButton.textContent = 'Finish Exam';
        }
        alert('Failed to submit exam. Please try again.');
    });
}
