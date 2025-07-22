// Session cleaner script
// This script ensures that users are properly logged out when they close the browser
// It runs on every page load to check if the session is valid

document.addEventListener('DOMContentLoaded', () => {
    // Check if we should clear the session
    const shouldClearSession = !localStorage.getItem('neoFoodRememberMe');
    
    // If remember me is not set, clear any session user data
    if (shouldClearSession) {
        sessionStorage.removeItem('neoFoodCurrentUser');
    }
    
    // Add event listener for page unload
    window.addEventListener('beforeunload', () => {
        // If remember me is not set, mark the session for clearing on next load
        if (!localStorage.getItem('neoFoodRememberMe')) {
            sessionStorage.setItem('neoFoodSessionEnded', 'true');
        }
    });
    
    // Check if session was ended
    if (sessionStorage.getItem('neoFoodSessionEnded') === 'true') {
        // Clear the session
        sessionStorage.removeItem('neoFoodCurrentUser');
        sessionStorage.removeItem('neoFoodSessionEnded');
    }
});