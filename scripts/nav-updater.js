// Navigation updater script
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});

function updateNavigation() {
    // Get current user
    const currentUser = getCurrentUser();
    
    // Get navigation links container
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // Check if profile link exists
    const profileLink = navLinks.querySelector('a[href="profile.html"]');
    
    if (currentUser) {
        // User is logged in
        if (profileLink) {
            // Keep profile link text as "Profile"
            profileLink.textContent = "Profile";
        } else {
            // Add profile link if it doesn't exist
            const newProfileLink = document.createElement('a');
            newProfileLink.href = 'profile.html';
            newProfileLink.className = 'nav-link';
            newProfileLink.textContent = "Profile";
            navLinks.appendChild(newProfileLink);
        }
        
        // Remove any sign in/sign up links
        const authLinks = navLinks.querySelectorAll('a[href="signin.html"], a[href="signup.html"]');
        authLinks.forEach(link => link.remove());
        
        // Add logout link if it doesn't exist
        if (!navLinks.querySelector('#logoutBtn')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.id = 'logoutBtn';
            logoutLink.className = 'nav-link';
            logoutLink.textContent = 'Logout';
            navLinks.appendChild(logoutLink);
        }
    } else {
        // User is not logged in
        // Make sure profile link redirects to sign in
        if (profileLink) {
            profileLink.href = 'signin.html';
        }
    }
}

function getCurrentUser() {
    // Check both storages without conditions
    const sessionUser = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    const localUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    
    // Return any available user data
    return sessionUser || localUser;
}