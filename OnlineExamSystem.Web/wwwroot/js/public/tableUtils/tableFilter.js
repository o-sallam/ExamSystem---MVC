/**
 * TableFilter - A reusable module for filtering table data
 * 
 * This module provides functionality to filter any collection of data
 * based on different criteria like recency, popularity, or custom filters.
 */

/**
 * Filter data by sorting and limiting based on a specific field
 * 
 * @param {Array} data - The collection of data to filter
 * @param {string} sortField - The field to sort by
 * @param {boolean} descending - Whether to sort in descending order (true) or ascending (false)
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} - Filtered and sorted data
 */
export function filterByField(data, sortField, descending = true, limit = null) {
    if (!data || !sortField) {
        return data;
    }
    
    // Create a copy of the data to avoid modifying the original
    let filteredData = [...data];
    
    // Sort the data based on the specified field
    filteredData.sort((a, b) => {
        // Handle date fields
        if (a[sortField] instanceof Date || (typeof a[sortField] === 'string' && !isNaN(Date.parse(a[sortField])))) {
            const dateA = a[sortField] instanceof Date ? a[sortField] : new Date(a[sortField]);
            const dateB = b[sortField] instanceof Date ? b[sortField] : new Date(b[sortField]);
            return descending ? dateB - dateA : dateA - dateB;
        }
        // Handle numeric fields
        else if (typeof a[sortField] === 'number') {
            return descending ? b[sortField] - a[sortField] : a[sortField] - b[sortField];
        }
        // Handle string fields
        else {
            const valueA = String(a[sortField]).toLowerCase();
            const valueB = String(b[sortField]).toLowerCase();
            return descending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
        }
    });
    
    // Apply limit if specified
    if (limit && typeof limit === 'number' && limit > 0) {
        filteredData = filteredData.slice(0, limit);
    }
    
    return filteredData;
}

/**
 * Setup filter button event listeners
 * 
 * @param {NodeList|Array} filterButtons - Collection of filter button elements
 * @param {Array} data - The data collection to filter
 * @param {Object} filterConfig - Configuration for different filter types
 * @param {Function} renderCallback - Function to render the filtered results
 * @param {HTMLElement} searchInput - Optional search input element to combine filtering with search
 * @param {Array} searchFields - Optional fields to search in when combining with search
 */
export function setupFilterListeners(filterButtons, data, filterConfig, renderCallback, searchInput = null, searchFields = []) {
    if (!filterButtons || !data || !filterConfig || !renderCallback) {
        console.error('Missing required parameters for setupFilterListeners');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button styling
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-primary', 'text-white');
                btn.classList.add('bg-white', 'text-gray-800');
            });
            this.classList.add('active', 'bg-primary', 'text-white');
            this.classList.remove('bg-white', 'text-gray-800');
            
            const filterType = this.getAttribute('data-filter');
            let filteredData = [...data];
            
            // Apply the selected filter if it exists in the config
            if (filterConfig[filterType]) {
                const config = filterConfig[filterType];
                filteredData = filterByField(filteredData, config.field, config.descending, config.limit);
            }
            
            // Apply any existing search filter if search input is provided
            if (searchInput && searchFields.length > 0) {
                const searchTerm = searchInput.value.toLowerCase();
                if (searchTerm) {
                    filteredData = filteredData.filter(item => 
                        searchFields.some(field => {
                            if (item[field] === undefined) return false;
                            return String(item[field]).toLowerCase().includes(searchTerm);
                        })
                    );
                }
            }
            
            renderCallback(filteredData);
        });
    });
}