// Direct logout handler for home page
document.addEventListener('DOMContentLoaded', () => {
    // Update navigation to include logout button if user is logged in
    const currentUser = getCurrentUserDirect();
    const navLinks = document.querySelector('.nav-links');
    
    if (currentUser && navLinks) {
        // Add logout link if user is logged in and it doesn't exist
        if (!document.getElementById('logoutBtn')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.id = 'logoutBtn';
            logoutLink.className = 'nav-link';
            logoutLink.textContent = 'Logout';
            navLinks.appendChild(logoutLink);
            
            // Add event listener
            logoutLink.addEventListener('click', handleLogout);
        }
    }
    
    // Add event listener to any existing logout button
    const existingLogoutBtn = document.getElementById('logoutBtn');
    if (existingLogoutBtn) {
        existingLogoutBtn.addEventListener('click', handleLogout);
    }
});

// Get user data directly from both storages
function getCurrentUserDirect() {
    const sessionUser = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    const localUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    return sessionUser || localUser;
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    // Clear user data
    sessionStorage.removeItem('neoFoodCurrentUser');
    localStorage.removeItem('neoFoodCurrentUser');
    localStorage.removeItem('neoFoodRememberMe');
    
    // Redirect to index page
    window.location.href = 'index.html';
}