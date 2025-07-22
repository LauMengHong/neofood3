// Additional authentication checks
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a protected page that requires login
    const isProtectedPage = window.location.pathname.includes('checkout.html') || 
                           window.location.pathname.includes('profile.html') ||
                           window.location.pathname.includes('admin.html');
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (isProtectedPage && !currentUser) {
        // Redirect to login page
        window.location.href = 'signin.html';
    }
    
    // For admin page, check if user is admin
    if (window.location.pathname.includes('admin.html') && currentUser && !currentUser.isAdmin) {
        // Redirect non-admin users
        window.location.href = 'home.html';
    }
});

// Get current user from storage
function getCurrentUser() {
    // Check session storage first
    let user = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    
    // If not in session storage, check local storage only if remember me was set
    if (!user && localStorage.getItem('neoFoodRememberMe') === 'true') {
        user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    }
    
    return user;
}