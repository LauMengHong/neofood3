// Load theme immediately before page renders
(function() {
    // Get saved theme or use dark as default
    const savedTheme = localStorage.getItem('neoFoodTheme') || 'dark';
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
})();