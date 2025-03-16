document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const questionsContainer = document.getElementById('questionsContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const submitExamBtn = document.getElementById('submitExamBtn');
    const questionTemplate = document.getElementById('questionTemplate');
    const optionTemplate = document.getElementById('optionTemplate');
    
    // Counter for question numbering
    let questionCounter = 0;
    
    // Add initial question
    addQuestion();
    
    // Event listeners
    addQuestionBtn.addEventListener('click', addQuestion);
    submitExamBtn.addEventListener('click', submitExam);
    
    // Add a new question with 4 options
    function addQuestion() {
        questionCounter++;
        
        // Clone the question template
        const questionNode = document.importNode(questionTemplate.content, true);
        const questionElement = questionNode.querySelector('.question-item');
        
        // Set question number
        questionElement.querySelector('.question-number').textContent = questionCounter;
        
        // Set unique name for radio button group
        const radioGroupName = `question-${questionCounter}-correct`;
        
        // Add 4 options to the question
        const optionsContainer = questionElement.querySelector('.options-container');
        for (let i = 0; i < 4; i++) {
            addOption(optionsContainer, radioGroupName);
        }
        
        // Add remove question event listener
        const removeBtn = questionElement.querySelector('.remove-question');
        removeBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.question-item').length > 1) {
                questionElement.remove();
                updateQuestionNumbers();
            } else {
                showValidationError('You must have at least one question');
            }
        });
        
        // Append the new question to the container
        questionsContainer.appendChild(questionElement);
    }
    
    // Add a new option to a question
    function addOption(container, radioGroupName) {
        // Clone the option template
        const optionNode = document.importNode(optionTemplate.content, true);
        const optionElement = optionNode.querySelector('.option-item');
        
        // Set radio button name to group them
        const radioBtn = optionElement.querySelector('.option-correct');
        radioBtn.name = radioGroupName;
        
        // If this is the first option, set it as checked by default
        if (container.children.length === 1) { // Only the heading is present
            radioBtn.checked = true;
        }
        
        // Append the new option to the container
        container.appendChild(optionElement);
    }
    
    // Update question numbers after removal
    function updateQuestionNumbers() {
        const questions = document.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            question.querySelector('.question-number').textContent = index + 1;
            
            // Update radio group name
            const radioButtons = question.querySelectorAll('.option-correct');
            const newGroupName = `question-${index + 1}-correct`;
            radioButtons.forEach(radio => {
                radio.name = newGroupName;
            });
        });
        questionCounter = questions.length;
    }
    
    // Validate the form before submission
    function validateForm() {
        let isValid = true;
        const validationSummary = document.getElementById('validation-summary');
        validationSummary.innerHTML = '';
        
        // Clear previous error messages
        document.querySelectorAll('.text-red-500').forEach(el => {
            el.textContent = '';
        });
        
        // Validate title
        const title = document.getElementById('Title').value.trim();
        if (!title) {
            document.getElementById('Title-error').textContent = 'Title is required';
            isValid = false;
        } else if (title.length > 100) {
            document.getElementById('Title-error').textContent = 'Title cannot be longer than 100 characters';
            isValid = false;
        }
        
        // Validate description
        const description = document.getElementById('Description').value.trim();
        if (!description) {
            document.getElementById('Description-error').textContent = 'Description is required';
            isValid = false;
        } else if (description.length > 500) {
            document.getElementById('Description-error').textContent = 'Description cannot be longer than 500 characters';
            isValid = false;
        }
        
        // Validate questions
        const questions = document.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            const questionTitle = question.querySelector('.question-title').value.trim();
            if (!questionTitle) {
                question.querySelector('.question-title-error').textContent = 'Question title is required';
                isValid = false;
            } else if (questionTitle.length > 200) {
                question.querySelector('.question-title-error').textContent = 'Question title cannot be longer than 200 characters';
                isValid = false;
            }
            
            // Validate options
            const options = question.querySelectorAll('.option-text');
            let hasCorrectOption = false;
            
            options.forEach((option, optIndex) => {
                const optionText = option.value.trim();
                if (!optionText) {
                    isValid = false;
                    showValidationError(`Question ${index + 1}, Option ${optIndex + 1} text is required`);
                } else if (optionText.length > 200) {
                    isValid = false;
                    showValidationError(`Question ${index + 1}, Option ${optIndex + 1} text cannot be longer than 200 characters`);
                }
            });
            
            // Check if a correct option is selected
            const radioButtons = question.querySelectorAll('.option-correct');
            radioButtons.forEach(radio => {
                if (radio.checked) {
                    hasCorrectOption = true;
                }
            });
            
            if (!hasCorrectOption) {
                isValid = false;
                showValidationError(`Question ${index + 1} must have a correct option selected`);
            }
        });
        
        return isValid;
    }
    
    // Show validation error in the summary
    function showValidationError(message) {
        const validationSummary = document.getElementById('validation-summary');
        const errorElement = document.createElement('div');
        errorElement.textContent = message;
        validationSummary.appendChild(errorElement);
    }
    
    // Prepare form data for submission
    function prepareFormData() {
        const examData = {
            title: document.getElementById('Title').value.trim(),
            description: document.getElementById('Description').value.trim(),
            questions: []
        };
        
        const questions = document.querySelectorAll('.question-item');
        questions.forEach(question => {
            const questionTitle = question.querySelector('.question-title').value.trim();
            const options = [];
            
            // Get all options for this question
            const optionElements = question.querySelectorAll('.option-item');
            optionElements.forEach(optionEl => {
                const optionText = optionEl.querySelector('.option-text').value.trim();
                const isCorrect = optionEl.querySelector('.option-correct').checked;
                
                const optionId = optionEl.getAttribute('data-option-id') || 0;
                options.push({
                    id: optionId,
                    text: optionText,
                    isCorrect: isCorrect
                });
            });
            
            examData.questions.push({
                title: questionTitle,
                options: options
            });
        });
        
        return examData;
    }
    
    // Submit the exam data via AJAX
    function submitExam() {
        if (!validateForm()) {
            return;
        }
        
        const examData = prepareFormData();
        const submitBtn = document.getElementById('submitExamBtn');
        
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';
        
        // Get the anti-forgery token
        const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;
        
        fetch('/Admin/Exams/CreateWithQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token || ''
            },
            body: JSON.stringify(examData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'An error occurred while creating the exam');
                });
            }
            return response.json();
        })
        .then(data => {
            // Redirect to the exams list page
            window.location.href = '/Admin/Exams';
        })
        .catch(error => {
            // Show error message
            showValidationError(error.message || 'An error occurred while creating the exam');
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Exam';
        });
    }
});