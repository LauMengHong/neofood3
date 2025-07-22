// Password Reset Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password reset
    initPasswordReset();
});

// Initialize password reset
function initPasswordReset() {
    // Forgot password button
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', openPasswordResetModal);
    }
    
    // Close modal button
    const closeModalBtn = document.querySelector('.password-reset-modal .close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePasswordResetModal);
    }
    
    // Send reset link button
    const sendResetBtn = document.getElementById('sendResetBtn');
    if (sendResetBtn) {
        sendResetBtn.addEventListener('click', sendResetLink);
    }
    
    // Reset password button
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', resetPassword);
    }
    
    // Back to login button
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', closePasswordResetModal);
    }
}

// Open password reset modal
function openPasswordResetModal() {
    const modal = document.getElementById('passwordResetModal');
    if (modal) {
        modal.classList.add('active');
        
        // Reset to step 1
        showResetStep(1);
        
        // Clear inputs
        document.getElementById('resetEmail').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    }
}

// Close password reset modal
function closePasswordResetModal() {
    const modal = document.getElementById('passwordResetModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Show reset step
function showResetStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.reset-step');
    steps.forEach(s => s.classList.remove('active'));
    
    // Show requested step
    const currentStep = document.getElementById(`resetStep${step}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
}

// Send reset link
function sendResetLink() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Find user with matching email
    const user = users.find(u => u.email === email);
    
    if (!user) {
        alert('No account found with this email address.');
        return;
    }
    
    // In a real app, this would send an email with a reset link
    // For this demo, we'll just proceed to step 2
    
    // Store email in session for step 2
    sessionStorage.setItem('resetEmail', email);
    
    // Show step 2
    showResetStep(2);
}

// Reset password
function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('Please enter and confirm your new password.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    // Get email from session
    const email = sessionStorage.getItem('resetEmail');
    
    if (!email) {
        alert('Session expired. Please try again.');
        closePasswordResetModal();
        return;
    }
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Find user with matching email
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
        alert('User not found. Please try again.');
        closePasswordResetModal();
        return;
    }
    
    // Update password
    users[userIndex].password = hashPassword(newPassword);
    
    // Save users to localStorage
    localStorage.setItem('neoFoodUsers', JSON.stringify(users));
    
    // Clear reset email from session
    sessionStorage.removeItem('resetEmail');
    
    // Show success step
    showResetStep(3);
}

// Hash password (simple implementation for demo)
function hashPassword(password) {
    // In a real app, use a proper hashing algorithm
    // For this demo, we'll just use a simple hash
    return btoa(password);
}