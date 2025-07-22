// Logout handler for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Find all logout buttons
    const logoutButtons = document.querySelectorAll('#logoutBtn, [onclick="logout()"]');
    
    // Add event listener to each logout button
    logoutButtons.forEach(button => {
        // Remove existing onclick attribute
        button.removeAttribute('onclick');
        
        // Add new event listener
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear all user data
            sessionStorage.removeItem('neoFoodCurrentUser');
            localStorage.removeItem('neoFoodCurrentUser');
            localStorage.removeItem('neoFoodRememberMe');
            
            // Redirect to landing page
            window.location.href = 'index.html';
        });
    });
});