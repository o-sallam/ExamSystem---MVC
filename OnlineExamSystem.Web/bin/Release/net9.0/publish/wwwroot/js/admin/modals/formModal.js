/**
 * @fileoverview Form Modal class - For forms and data entry
 * @module modals/formModal
 */

import BaseModal from './baseModal.js';
import { handleError } from '../../utils/utils.js';

/**
 * Form Modal class for forms and data entry
 * @extends BaseModal
 */
class FormModal extends BaseModal {
  /**
   * Create a new form modal instance
   * @param {Object} options - Configuration options for the modal
   * @param {string} options.id - The ID for the modal element
   * @param {string} options.title - The title of the modal
   * @param {string} options.content - The content of the modal (HTML string)
   * @param {string} options.size - The size of the modal ('sm', 'md', 'lg', 'xl')
   * @param {boolean} options.closeOnOutsideClick - Whether to close the modal when clicking outside
   * @param {Function} options.onOpen - Callback function when modal opens
   * @param {Function} options.onClose - Callback function when modal closes
   * @param {Function} options.onSubmit - Callback function when form is submitted
   * @param {Object} options.formData - Initial form data
   */
  constructor(options = {}) {
    // Call parent constructor with base options
    super(options);
    
    // Form-specific options
    this.onSubmit = options.onSubmit || null;
    this.formData = options.formData || {};
    
    // Reference to the form element
    this.form = null;
    
    // Initialize form functionality
    this.initForm();
  }
  
  /**
   * Initialize form functionality
   */
  initForm() {
    try {
      if (!this.element) return;
      
      // Find the form element
      this.form = this.element.querySelector('form');
      
      if (this.form) {
        // Add submit event listener
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit();
        });
        
        // Add cancel button event listener if it exists
        const cancelBtn = this.form.querySelector('[data-action="cancel"]');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
          });
        }
        
        // Populate form with initial data if provided
        this.populateForm();
      }
    } catch (error) {
      handleError(error, 'FormModal.initForm');
    }
  }
  
  /**
   * Populate the form with initial data
   */
  populateForm() {
    try {
      if (!this.form || !this.formData) return;
      
      // Loop through form elements and set values from formData
      Array.from(this.form.elements).forEach(element => {
        if (element.name && this.formData[element.name] !== undefined) {
          if (element.type === 'checkbox') {
            element.checked = Boolean(this.formData[element.name]);
          } else if (element.type === 'radio') {
            element.checked = (element.value === this.formData[element.name]);
          } else {
            element.value = this.formData[element.name];
          }
        }
      });
    } catch (error) {
      handleError(error, 'FormModal.populateForm');
    }
  }
  
  /**
   * Handle form submission
   */
  handleSubmit() {
    try {
      if (!this.form) return;
      
      // Collect form data
      const formData = {};
      const formElements = this.form.elements;
      
      Array.from(formElements).forEach(element => {
        if (element.name && element.type !== 'submit' && element.type !== 'button') {
          if (element.type === 'checkbox') {
            formData[element.name] = element.checked;
          } else if (element.type === 'radio') {
            if (element.checked) {
              formData[element.name] = element.value;
            }
          } else {
            formData[element.name] = element.value;
          }
        }
      });
      
      // Call onSubmit callback if provided
      if (typeof this.onSubmit === 'function') {
        this.onSubmit(formData, this);
      }
      
      // Close the modal after submission (unless prevented by the callback)
      this.close();
    } catch (error) {
      handleError(error, 'FormModal.handleSubmit');
    }
  }
  
  /**
   * Set form data and update form fields
   * @param {Object} data - The data to set in the form
   */
  setFormData(data) {
    try {
      this.formData = data || {};
      this.populateForm();
    } catch (error) {
      handleError(error, 'FormModal.setFormData');
    }
  }
  
  /**
   * Reset the form to its initial state
   */
  resetForm() {
    try {
      if (this.form) {
        this.form.reset();
        this.formData = {};
      }
    } catch (error) {
      handleError(error, 'FormModal.resetForm');
    }
  }
}

export default FormModal;