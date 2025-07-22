// Profile tabs functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get all tabs and panels
    const tabs = document.querySelectorAll('.profile-tabs .tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    // Add click event to each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get the tab's data-tab attribute
            const tabId = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            document.getElementById(tabId + '-panel').classList.add('active');
        });
    });
    
    // Setup theme selector
    setupThemeSelector();
});

// Setup theme selector functionality
function setupThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Get theme
            const theme = option.getAttribute('data-theme');
            
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Save theme preference
            localStorage.setItem('neoFoodTheme', theme);
            
            // Apply theme
            document.documentElement.setAttribute('data-theme', theme);
        });
    });
}