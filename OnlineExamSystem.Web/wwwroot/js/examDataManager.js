/**
 * Exam Data Manager - Handles fetching, filtering, and rendering exam data
 * 
 * This module provides functionality to fetch exam data from a JSON file,
 * render exam cards, and set up search and filter functionality.
 */

// Import the table utility modules
import { searchTable, setupSearchListener } from './public/tableUtils/tableSearch.js';
import { filterByField, setupFilterListeners } from './public/tableUtils/tableFilter.js';

/**
 * Renders exam cards based on the provided exam data
 * 
 * @param {Array} examsToRender - The exams to render as cards
 * @param {HTMLElement} container - The container element to render the cards in
 */
function renderExams(examsToRender, container) {
  container.innerHTML = '';
  
  examsToRender.forEach(exam => {
    const examCard = document.createElement('div');
    examCard.className = 'exam-card animate-fade-in h-full flex flex-col justify-between';
    
    // Determine which gradient to use based on exam ID (for variety)
    const gradientClass = `gradient-bg-${(exam.Id % 3) + 1}`;
    
    examCard.innerHTML = `
      <div class="card-header ${gradientClass}">
        <h2 class="text-2xl font-bold">${exam.title}</h2>
${exam.currentUserScore > 0 ? `
        <div class="absolute top-4 right-4">
          <i class="fa-solid fa-circle-check text-white text-xl"></i>
        </div>
        `:''}
        </div>
      <div class="p-5 flex flex-col h-full justify-between gap-6">
        <p class="text-gray-600">
          ${exam.description}
        </p>

        <div class="flex flex-col h-full justify-between gap-4">
          <div>
              <div class="info-item">
                <i class="fas fa-user"></i>
                <span>Created By:</span>
                <span class="font-medium">${exam.createdBy}</span>
              </div>

              <div class="info-item">
                <i class="fas fa-question-circle"></i>
                <span>Questions:</span>
                <span class="font-medium">${exam.questions}</span>
              </div>

              <div class="info-item">
                <i class="fas fa-calendar"></i>
                <span>Created At:</span>
                <span class="font-medium">${new Date(exam.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

          ${exam.currentUserScore === 0 ? `
            <a href="Exams/Questions/${exam.id}" class="mt-auto">
              <button class="action-btn w-full">
                Start Exam
              </button>
            </a>
          ` : `
            <div class="space-y-4">
              <div class="flex justify-between text-sm font-medium text-gray-700">
                <span>Score</span>
                <span>${exam.currentUserScore*100}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                  style="width: ${exam.currentUserScore*100}%"></div>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
    
    container.appendChild(examCard);
  });
}

/**
 * Initializes the exam data management functionality
 * 
 * This function sets up search and filter functionality and renders exam cards
 * using data provided from the controller ViewModel.
 * 
 * @param {Array} examData - Optional exam data from controller ViewModel
 */
export function initExamDataManager(examData = null) {
  document.addEventListener('DOMContentLoaded', function() {
    const examsContainer = document.getElementById('examsContainer');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Define the filter configuration
    const filterConfig = {
      'all': null,
      'recent': {
        field: 'createdAt',
        descending: true,
        limit: null
      },
      'popular': {
        field: 'attempts',
        descending: true,
        limit: null
      }
    };

    // Define search fields
    const searchFields = ['title', 'description', 'createdBy'];

    // Process exam data - either use provided data from ViewModel or fetch from JSON
    if (examData) {
      // Use the data provided from the controller ViewModel
      // Initial render of all exams
      renderExams(examData, examsContainer);

      // Setup search functionality only if searchInput exists
      if (searchInput) {
        setupSearchListener(searchInput, examData, searchFields, (filteredExams) => {
          renderExams(filteredExams, examsContainer);
        });
      }

      // Setup filter functionality
      setupFilterListeners(filterButtons, examData, filterConfig, (filteredExams) => {
        renderExams(filteredExams, examsContainer);
      }, searchInput, searchFields);
    } else {
      // Fallback to fetching from JSON file if no data is provided
      fetch('dummy-exams.json')
        .then(response => response.json())
        .then(data => {
          const exams = data['dummy-exams'];
          
          // Initial render of all exams
          renderExams(exams, examsContainer);

          // Setup search functionality only if searchInput exists
          if (searchInput) {
            setupSearchListener(searchInput, exams, searchFields, (filteredExams) => {
              renderExams(filteredExams, examsContainer);
            });
          }

          // Setup filter functionality
          setupFilterListeners(filterButtons, exams, filterConfig, (filteredExams) => {
            renderExams(filteredExams, examsContainer);
          }, searchInput, searchFields);
        })
        .catch(error => {
          console.error('Error fetching exam data:', error);
          examsContainer.innerHTML = '<div class="col-span-3 text-center py-8"><p>Error loading exams. Please try again later.</p></div>';
        });
    }
  });
}