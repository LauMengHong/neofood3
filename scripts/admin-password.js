// Admin Password Management
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password change functionality
    initPasswordChange();
});

// Initialize password change functionality
function initPasswordChange() {
    // Change password button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changeUserPassword);
    }
}

// Change user password
function changeUserPassword() {
    // Get new password values
    const newPassword = document.getElementById('adminNewPassword').value;
    const confirmPassword = document.getElementById('adminConfirmPassword').value;
    
    // Validate passwords
    if (!newPassword || !confirmPassword) {
        showNotification('Error', 'Please enter and confirm the new password.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Error', 'Passwords do not match.');
        return;
    }
    
    // Get current user ID from modal
    const userId = document.getElementById('userDetailModal').getAttribute('data-user-id');
    if (!userId) {
        showNotification('Error', 'User ID not found.');
        return;
    }
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Find user with matching ID
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        showNotification('Error', 'User not found.');
        return;
    }
    
    // Update password
    users[userIndex].password = hashPassword(newPassword);
    
    // Save users to localStorage
    localStorage.setItem('neoFoodUsers', JSON.stringify(users));
    
    // Clear password fields
    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    
    // Show success notification
    showNotification('Success', `Password for ${users[userIndex].name} has been updated.`);
}

// Hash password (simple implementation for demo)
function hashPassword(password) {
    // In a real app, use a proper hashing algorithm
    // For this demo, we'll just use a simple hash
    return btoa(password);
}

// Override the openUserDetailModal function to add user ID to modal
const originalOpenUserDetailModal = window.openUserDetailModal;
window.openUserDetailModal = function(user) {
    // Call original function
    if (originalOpenUserDetailModal) {
        originalOpenUserDetailModal(user);
    }
    
    // Add user ID to modal
    const modal = document.getElementById('userDetailModal');
    if (modal && user) {
        modal.setAttribute('data-user-id', user.id);
    }
};