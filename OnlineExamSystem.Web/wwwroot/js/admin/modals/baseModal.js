/**
 * @fileoverview Base Modal class - Foundation for all modal types
 * @module modals/baseModal
 */

import { handleError } from '../../utils/utils.js';

/**
 * Base Modal class that provides common functionality for all modal types
 */
class BaseModal {
  /**
   * Create a new modal instance
   * @param {Object} options - Configuration options for the modal
   * @param {string} options.id - The ID for the modal element (required)
   * @param {string} options.title - The title of the modal
   * @param {string} options.content - The content of the modal (HTML string)
   * @param {string} options.size - The size of the modal ('sm', 'md', 'lg', 'xl')
   * @param {boolean} options.closeOnOutsideClick - Whether to close the modal when clicking outside
   * @param {Function} options.onOpen - Callback function when modal opens
   * @param {Function} options.onClose - Callback function when modal closes
   */
  constructor(options = {}) {
    this.options = {
      id: options.id || `modal-${Date.now()}`,
      title: options.title || 'Modal',
      content: options.content || '',
      size: options.size || 'md',
      closeOnOutsideClick: options.closeOnOutsideClick !== false,
      onOpen: options.onOpen || null,
      onClose: options.onClose || null
    };
    
    this.element = null;
    this.isOpen = false;
    this.init();
  }

  /**
   * Initialize the modal
   */
  init() {
    try {
      // Check if modal already exists
      const existingModal = document.getElementById(this.options.id);
      if (existingModal) {
        this.element = existingModal;
        return;
      }
      
      // Create modal element
      this.element = document.createElement('div');
      this.element.id = this.options.id;
      this.element.className = 'fixed inset-0 bg-darkbg/80 flex items-center justify-center z-50 hidden';
      
      // Set modal size class
      const sizeClass = this.getSizeClass();
      
      // Create modal content
      this.element.innerHTML = `
        <div class="bg-darksurface border border-darkborder rounded-lg shadow-lg ${sizeClass} animate-fade-in">
          <div class="p-6 border-b border-darkborder flex justify-between items-center">
            <h3 class="text-xl font-semibold">${this.options.title}</h3>
            <button class="close-modal-btn text-gray-400 hover:text-white transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-content p-6">
            ${this.options.content}
          </div>
        </div>
      `;
      
      // Append to body
      document.body.appendChild(this.element);
      
      // Add event listeners
      this.addEventListeners();
    } catch (error) {
      handleError(error, 'BaseModal.init');
    }
  }

  /**
   * Add event listeners to the modal
   */
  addEventListeners() {
    try {
      // Close button click
      const closeBtn = this.element.querySelector('.close-modal-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }
      
      // Outside click
      if (this.options.closeOnOutsideClick) {
        this.element.addEventListener('click', (e) => {
          if (e.target === this.element) {
            this.close();
          }
        });
      }
    } catch (error) {
      handleError(error, 'BaseModal.addEventListeners');
    }
  }

  /**
   * Get the CSS class for the modal size
   * @returns {string} The CSS class for the modal size
   */
  getSizeClass() {
    const sizes = {
      'sm': 'w-full max-w-sm',
      'md': 'w-full max-w-md',
      'lg': 'w-full max-w-lg',
      'xl': 'w-full max-w-xl',
      '2xl': 'w-full max-w-2xl',
      'full': 'w-full max-w-full mx-4'
    };
    
    return sizes[this.options.size] || sizes.md;
  }

  /**
   * Open the modal
   */
  open() {
    try {
      if (!this.element) return;
      
      this.element.classList.remove('hidden');
      this.isOpen = true;
      
      // Call onOpen callback if provided
      if (typeof this.options.onOpen === 'function') {
        this.options.onOpen(this);
      }
    } catch (error) {
      handleError(error, 'BaseModal.open');
    }
  }

  /**
   * Close the modal
   */
  close() {
    try {
      if (!this.element) return;
      
      this.element.classList.add('hidden');
      this.isOpen = false;
      
      // Call onClose callback if provided
      if (typeof this.options.onClose === 'function') {
        this.options.onClose(this);
      }
    } catch (error) {
      handleError(error, 'BaseModal.close');
    }
  }

  /**
   * Update the modal content
   * @param {string} content - The new content (HTML string)
   */
  setContent(content) {
    try {
      const contentContainer = this.element.querySelector('.modal-content');
      if (contentContainer) {
        contentContainer.innerHTML = content;
      }
    } catch (error) {
      handleError(error, 'BaseModal.setContent');
    }
  }

  /**
   * Update the modal title
   * @param {string} title - The new title
   */
  setTitle(title) {
    try {
      const titleElement = this.element.querySelector('h3');
      if (titleElement) {
        titleElement.textContent = title;
      }
    } catch (error) {
      handleError(error, 'BaseModal.setTitle');
    }
  }

  /**
   * Remove the modal from the DOM
   */
  destroy() {
    try {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    } catch (error) {
      handleError(error, 'BaseModal.destroy');
    }
  }
}

export default BaseModal;