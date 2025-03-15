/**
 * @fileoverview Modal Factory - Creates different types of modals
 * @module modals/modalFactory
 */

import { handleError } from '../../utils/utils.js';
import FormModal from './formModal.js';
import ConfirmModal from './confirmModal.js';
import InfoModal from './infoModal.js';

/**
 * Modal Factory - Creates different types of modals based on the specified type
 */
class ModalFactory {
  /**
   * Create a new modal instance based on the specified type
   * @param {string} type - The type of modal to create ('form', 'confirm', 'info')
   * @param {Object} options - Configuration options for the modal
   * @returns {Object} The created modal instance
   */
  static createModal(type, options = {}) {
    try {
      switch (type.toLowerCase()) {
        case 'form':
          return new FormModal(options);
        case 'confirm':
          return new ConfirmModal(options);
        case 'info':
          return new InfoModal(options);
        default:
          throw new Error(`Unknown modal type: ${type}`);
      }
    } catch (error) {
      handleError(error, 'ModalFactory.createModal');
      return null;
    }
  }
}

export default ModalFactory;