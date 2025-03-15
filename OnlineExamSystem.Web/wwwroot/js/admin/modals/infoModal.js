/**
 * @fileoverview Info Modal class - For displaying information and messages
 * @module modals/infoModal
 */

import BaseModal from './baseModal.js';
import { handleError } from '../../utils/utils.js';

/**
 * Info Modal class for displaying information and messages
 * @extends BaseModal
 */
class InfoModal extends BaseModal {
  /**
   * Create a new info modal instance
   * @param {Object} options - Configuration options for the modal
   * @param {string} options.id - The ID for the modal element
   * @param {string} options.title - The title of the modal
   * @param {string} options.message - The message to display
   * @param {string} options.buttonText - The text for the close button
   * @param {string} options.buttonClass - CSS class for the button
   * @param {Function} options.onButtonClick - Callback function when button is clicked
   * @param {string} options.icon - Optional icon class (FontAwesome)
   * @param {string} options.iconClass - Optional CSS class for the icon
   */
  constructor(options = {}) {
    // Set default content based on message and button text
    const iconHtml = options.icon ? 
      `<div class="text-center mb-4"><i class="${options.icon} text-4xl ${options.iconClass || ''}"></i></div>` : '';
    
    const content = `
      ${iconHtml}
      <div class="text-center mb-6">
        ${options.message || 'Information'}
      </div>
      <div class="flex justify-center">
        <button type="button" class="action-btn px-4 py-2 ${options.buttonClass || 'bg-darkprimary hover:bg-darkprimary/90'} text-white rounded-lg transition-colors">
          ${options.buttonText || 'OK'}
        </button>
      </div>
    `;

    // Call parent constructor with updated options
    super({
      ...options,
      content,
      size: options.size || 'sm'
    });
    
    // Info-specific options
    this.onButtonClick = options.onButtonClick || null;
    
    // Add event listeners for button
    this.addButtonEventListener();
  }
  
  /**
   * Add event listener for the action button
   */
  addButtonEventListener() {
    try {
      if (!this.element) return;
      
      // Button click
      const actionBtn = this.element.querySelector('.action-btn');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          if (typeof this.onButtonClick === 'function') {
            this.onButtonClick(this);
          }
          this.close();
        });
      }
    } catch (error) {
      handleError(error, 'InfoModal.addButtonEventListener');
    }
  }
  
  /**
   * Set the info message
   * @param {string} message - The new message
   */
  setMessage(message) {
    try {
      const messageElement = this.element.querySelector('.modal-content > div:nth-child(2)');
      if (messageElement) {
        messageElement.textContent = message;
      }
    } catch (error) {
      handleError(error, 'InfoModal.setMessage');
    }
  }
  
  /**
   * Create a success info modal (static helper method)
   * @param {Object} options - Modal options
   * @returns {InfoModal} A new InfoModal instance
   */
  static success(options = {}) {
    return new InfoModal({
      ...options,
      title: options.title || 'Success',
      icon: 'fas fa-check-circle',
      iconClass: 'text-green-500',
      buttonClass: 'bg-green-600 hover:bg-green-700'
    });
  }
  
  /**
   * Create an error info modal (static helper method)
   * @param {Object} options - Modal options
   * @returns {InfoModal} A new InfoModal instance
   */
  static error(options = {}) {
    return new InfoModal({
      ...options,
      title: options.title || 'Error',
      icon: 'fas fa-exclamation-circle',
      iconClass: 'text-red-500',
      buttonClass: 'bg-red-600 hover:bg-red-700'
    });
  }
  
  /**
   * Create a warning info modal (static helper method)
   * @param {Object} options - Modal options
   * @returns {InfoModal} A new InfoModal instance
   */
  static warning(options = {}) {
    return new InfoModal({
      ...options,
      title: options.title || 'Warning',
      icon: 'fas fa-exclamation-triangle',
      iconClass: 'text-yellow-500',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700'
    });
  }
}

export default InfoModal;