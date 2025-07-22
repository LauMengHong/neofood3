// Fix for profile page logout issue
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the profile page
    if (window.location.pathname.includes('profile.html')) {
        // Get current user directly from storage without any conditions
        const sessionUser = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
        const localUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
        
        // Use any available user data
        const currentUser = sessionUser || localUser;
        
        if (currentUser) {
            // Update profile information
            const userNameElement = document.getElementById('userName');
            const userEmailElement = document.getElementById('userEmail');
            
            if (userNameElement) userNameElement.textContent = currentUser.name;
            if (userEmailElement) userEmailElement.textContent = currentUser.email;
        } else {
            // If no user data found, redirect to sign in
            window.location.href = 'signin.html';
        }
    }
});