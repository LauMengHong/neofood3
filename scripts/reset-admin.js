// Reset admin account
document.addEventListener('DOMContentLoaded', () => {
    // Add reset button to signin page
    addResetButton();
});

// Add reset button
function addResetButton() {
    const authContainer = document.querySelector('.auth-container');
    if (!authContainer) return;
    
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'reset-admin-btn';
    resetButton.textContent = 'Reset Admin Account';
    resetButton.style.cssText = `
        background: none;
        border: none;
        color: rgba(0, 245, 255, 0.7);
        font-size: 12px;
        margin-top: 20px;
        cursor: pointer;
        text-decoration: underline;
    `;
    
    resetButton.addEventListener('click', resetAdminAccount);
    
    authContainer.appendChild(resetButton);
}

// Reset admin account
function resetAdminAccount() {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Remove existing admin account
    users = users.filter(user => user.email !== 'admin@neofood.com');
    
    // Create new admin account
    const admin = {
        id: 'admin-' + Date.now(),
        name: 'Admin',
        email: 'admin@neofood.com',
        password: btoa('i love neofood'), // Simple base64 encoding
        isAdmin: true,
        registrationDate: new Date().toISOString()
    };
    
    // Add admin to users
    users.push(admin);
    
    // Save to localStorage
    localStorage.setItem('neoFoodUsers', JSON.stringify(users));
    
    // Show success message
    alert('Admin account has been reset. You can now login with:\nEmail: admin@neofood.com\nPassword: i love neofood');
}