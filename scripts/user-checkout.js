// User checkout functionality
document.addEventListener('DOMContentLoaded', () => {
    // Display user info if logged in
    displayUserInfo();
});

function displayUserInfo() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const checkoutContainer = document.querySelector('.checkout-container');
        const checkoutTitle = document.querySelector('.checkout-title');
        
        if (checkoutTitle && checkoutContainer) {
            // Check if user info already exists
            if (!document.querySelector('.user-info')) {
                const userInfo = document.createElement('div');
                userInfo.className = 'user-info';
                userInfo.innerHTML = `
                    <p>Ordering as: <strong>${currentUser.name}</strong></p>
                    <button class="change-user" onclick="handleLogout()">Change User</button>
                `;
                checkoutContainer.insertBefore(userInfo, checkoutTitle.nextSibling);
            }
        }
    }
}

// Handle logout
function handleLogout() {
    // Clear user data
    sessionStorage.removeItem('neoFoodCurrentUser');
    localStorage.removeItem('neoFoodCurrentUser');
    
    // Set return to checkout flag
    sessionStorage.setItem('returnToCheckout', 'true');
    
    // Redirect to sign in page
    window.location.href = 'signin.html';
}