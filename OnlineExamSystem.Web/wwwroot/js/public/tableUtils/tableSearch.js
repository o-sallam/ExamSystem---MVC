/**
 * TableSearch - A reusable module for searching through table data
 * 
 * This module provides functionality to search through any collection of data
 * based on specified search fields.
 */

/**
 * Search through a collection of data based on a search term and specified fields
 * 
 * @param {Array} data - The collection of data to search through
 * @param {string} searchTerm - The term to search for
 * @param {Array} searchFields - Array of field names to search in
 * @returns {Array} - Filtered data that matches the search term
 */
export function searchTable(data, searchTerm, searchFields) {
    // If no search term or it's empty, return all data
    if (!searchTerm || searchTerm.trim() === '') {
        return data;
    }
    
    // Convert search term to lowercase for case-insensitive comparison
    const term = searchTerm.toLowerCase();
    
    // Filter the data based on search term and fields
    return data.filter(item => {
        // Check if any of the specified fields contain the search term
        return searchFields.some(field => {
            // Make sure the field exists on the item
            if (item[field] === undefined) return false;
            
            // Convert field value to string and check if it includes the search term
            return String(item[field]).toLowerCase().includes(term);
        });
    });
}

/**
 * Attach search functionality to an input element
 * 
 * @param {HTMLElement} inputElement - The search input element
 * @param {Array} data - The data collection to search through
 * @param {Array} searchFields - Fields to search in
 * @param {Function} renderCallback - Function to render the filtered results
 */
export function setupSearchListener(inputElement, data, searchFields, renderCallback) {
    if (!inputElement || !data || !searchFields || !renderCallback) {
        console.error('Missing required parameters for setupSearchListener');
        return;
    }
    
    inputElement.addEventListener('input', function() {
        const searchTerm = this.value;
        const filteredData = searchTable(data, searchTerm, searchFields);
        renderCallback(filteredData);
    });
}