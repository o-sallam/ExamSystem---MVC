/**
 * @fileoverview Confirm Modal class - For confirmation dialogs
 * @module modals/confirmModal
 */

import BaseModal from './baseModal.js';
import { handleError } from '../../utils/utils.js';

/**
 * Confirm Modal class for confirmation dialogs (yes/no, confirm/cancel)
 * @extends BaseModal
 */
class ConfirmModal extends BaseModal {
  /**
   * Create a new confirmation modal instance
   * @param {Object} options - Configuration options for the modal
   * @param {string} options.id - The ID for the modal element
   * @param {string} options.title - The title of the modal
   * @param {string} options.message - The confirmation message to display
   * @param {string} options.confirmText - The text for the confirm button
   * @param {string} options.cancelText - The text for the cancel button
   * @param {string} options.confirmButtonClass - CSS class for the confirm button
   * @param {Function} options.onConfirm - Callback function when confirmed
   * @param {Function} options.onCancel - Callback function when canceled
   */
  constructor(options = {}) {
    // Set default content based on message and button text
    const content = `
      <div class="text-center mb-6">
        ${options.message || 'Are you sure you want to proceed?'}
      </div>
      <div class="flex justify-end gap-3">
        <button type="button" class="cancel-btn px-4 py-2 bg-darkbg border border-darkborder rounded-lg hover:bg-darkborder transition-colors">
          ${options.cancelText || 'Cancel'}
        </button>
        <button type="button" class="confirm-btn px-4 py-2 ${options.confirmButtonClass || 'bg-darkprimary hover:bg-darkprimary/90'} text-white rounded-lg transition-colors">
          ${options.confirmText || 'Confirm'}
        </button>
      </div>
    `;

    // Call parent constructor with updated options
    super({
      ...options,
      content,
      size: options.size || 'sm'
    });
    
    // Confirmation-specific options
    this.onConfirm = options.onConfirm || null;
    this.onCancel = options.onCancel || null;
    
    // Add event listeners for buttons
    this.addConfirmEventListeners();
  }
  
  /**
   * Add event listeners for confirmation buttons
   */
  addConfirmEventListeners() {
    try {
      if (!this.element) return;
      
      // Confirm button click
      const confirmBtn = this.element.querySelector('.confirm-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          if (typeof this.onConfirm === 'function') {
            this.onConfirm(this);
          }
          this.close();
        });
      }
      
      // Cancel button click
      const cancelBtn = this.element.querySelector('.cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          if (typeof this.onCancel === 'function') {
            this.onCancel(this);
          }
          this.close();
        });
      }
    } catch (error) {
      handleError(error, 'ConfirmModal.addConfirmEventListeners');
    }
  }
  
  /**
   * Set the confirmation message
   * @param {string} message - The new confirmation message
   */
  setMessage(message) {
    try {
      const messageElement = this.element.querySelector('.modal-content > div:first-child');
      if (messageElement) {
        messageElement.textContent = message;
      }
    } catch (error) {
      handleError(error, 'ConfirmModal.setMessage');
    }
  }
}

export default ConfirmModal;