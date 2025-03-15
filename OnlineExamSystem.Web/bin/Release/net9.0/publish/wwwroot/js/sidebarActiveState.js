/**
 * Sets the active state of the sidebar button based on the current page title
 * @param {string} currentPageTitle - The title of the current page
 */
function setSidebarActiveState(currentPageTitle) {
    const sidebarButtons = document.querySelectorAll('#sidebar a');
    sidebarButtons.forEach(button => {
        // Check if the button's id is contained within the page title
        if (currentPageTitle.toLowerCase().includes(button.id.toLowerCase())) {
            button.classList.add('bg-darkprimary');
            button.classList.remove('hover:bg-darkprimary/10');
        }
    });
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the current page title from the header
    const pageTitle = document.querySelector('header h2')?.textContent;
    if (pageTitle) {
        setSidebarActiveState(pageTitle);
    }
});