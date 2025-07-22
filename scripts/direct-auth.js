// Direct authentication handler
// This script provides direct access to user data without any conditions
// to prevent logout issues when navigating between pages

// Make getCurrentUser available globally
window.getCurrentUser = function() {
    // Check both storages without conditions
    const sessionUser = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    const localUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    
    // Return any available user data
    return sessionUser || localUser;
};

// Handle logout button clicks
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            sessionStorage.removeItem('neoFoodCurrentUser');
            localStorage.removeItem('neoFoodCurrentUser');
            localStorage.removeItem('neoFoodRememberMe');
            
            // Redirect to index
            window.location.href = 'index.html';
        });
    }
});