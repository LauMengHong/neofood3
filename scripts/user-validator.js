// User validation script
document.addEventListener('DOMContentLoaded', () => {
    validateStoredUser();
});

// Validate stored user data
function validateStoredUser() {
    // Check session storage
    const sessionUser = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    if (sessionUser && (!sessionUser.id || !sessionUser.email)) {
        console.log('Invalid user in session storage, clearing');
        sessionStorage.removeItem('neoFoodCurrentUser');
    }
    
    // Check local storage
    const localUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    if (localUser && (!localUser.id || !localUser.email)) {
        console.log('Invalid user in local storage, clearing');
        localStorage.removeItem('neoFoodCurrentUser');
        localStorage.removeItem('neoFoodRememberMe');
    }
}