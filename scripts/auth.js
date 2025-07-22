// Authentication System for NeoFood
document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin account if it doesn't exist
    initializeAdminAccount();
    
    // Setup sign-up form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        setupPasswordStrength();
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Setup sign-in form
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignin);
    }
    
    // Check if user is logged in
    checkAuthStatus();
});

// Initialize admin account
function initializeAdminAccount() {
    const users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Check if admin account exists
    const adminExists = users.some(user => user.email === 'admin@neofood.com');
    
    if (!adminExists) {
        // Create admin account
        const adminUser = {
            id: 'admin-' + Date.now(),
            name: 'NeoFood Admin',
            email: 'admin@neofood.com',
            password: hashPassword('i love neofood'),
            isAdmin: true
        };
        
        users.push(adminUser);
        localStorage.setItem('neoFoodUsers', JSON.stringify(users));
        console.log('Admin account created');
    }
}

// Handle sign-up form submission
function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    if (users.some(user => user.email === email)) {
        showError('Email already in use');
        return;
    }
    
    // Create new user
    const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        password: hashPassword(password),
        isAdmin: false
    };
    
    // Add user to storage
    users.push(newUser);
    localStorage.setItem('neoFoodUsers', JSON.stringify(users));
    
    // Set current user
    setCurrentUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
    });
    
    // Redirect to home page
    window.location.href = 'home.html';
}

// Handle sign-in form submission
function handleSignin(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // Validate form
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Check credentials
    const users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    const user = users.find(user => user.email === email);
    
    if (!user || user.password !== hashPassword(password)) {
        showError('Invalid email or password');
        return;
    }
    
    // Set current user
    setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    }, rememberMe);
    
    // Redirect based on user type
    if (user.isAdmin) {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'home.html';
    }
}

// Set current user in session/local storage
function setCurrentUser(user, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('neoFoodCurrentUser', JSON.stringify(user));
    
    // Store remember me preference
    if (rememberMe) {
        localStorage.setItem('neoFoodRememberMe', 'true');
    } else {
        localStorage.removeItem('neoFoodRememberMe');
    }
}

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

// Check if user is logged in and redirect if needed
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const isAuthPage = window.location.pathname.includes('signin.html') || 
                       window.location.pathname.includes('signup.html');
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (currentUser) {
        // User is logged in
        if (isAuthPage) {
            // Redirect from auth pages to appropriate page
            if (currentUser.isAdmin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'home.html';
            }
        } else if (isAdminPage && !currentUser.isAdmin) {
            // Non-admin trying to access admin page
            window.location.href = 'home.html';
        }
        
        // Update UI for logged in user
        updateUIForLoggedInUser(currentUser);
    } else {
        // User is not logged in
        if (isAdminPage) {
            // Redirect from admin page to sign in
            window.location.href = 'signin.html';
        }
    }
}

// Update UI elements for logged in user
function updateUIForLoggedInUser(user) {
    // Update navigation links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        // Remove existing auth links
        const authLinks = navLinks.querySelectorAll('a[href="signin.html"], a[href="signup.html"]');
        authLinks.forEach(link => link.remove());
        
        // Add profile and logout links if they don't exist
        if (!navLinks.querySelector('a[href="profile.html"]')) {
            const profileLink = document.createElement('a');
            profileLink.href = 'profile.html';
            profileLink.className = 'nav-link';
            profileLink.textContent = user.name;
            navLinks.appendChild(profileLink);
        }
        
        if (!navLinks.querySelector('#logoutBtn')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.id = 'logoutBtn';
            logoutLink.className = 'nav-link';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', handleLogout);
            navLinks.appendChild(logoutLink);
        }
    }
}

// Handle logout
function handleLogout(e) {
    if (e) e.preventDefault();
    
    // Clear user data
    sessionStorage.removeItem('neoFoodCurrentUser');
    localStorage.removeItem('neoFoodCurrentUser');
    
    // Clear remember me flag
    localStorage.removeItem('neoFoodRememberMe');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Show error message
function showError(message) {
    // Check if error element exists, if not create it
    let errorElement = document.querySelector('.auth-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'auth-error';
        const form = document.querySelector('.auth-form');
        form.insertBefore(errorElement, form.firstChild);
    }
    
    // Set error message and show
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 3000);
}

// Setup password strength meter
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthMeter) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 1;
            
            // Complexity check
            if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Update strength meter
            strengthMeter.className = 'password-strength';
            if (password.length === 0) {
                strengthMeter.className = 'password-strength';
            } else if (strength < 2) {
                strengthMeter.className = 'password-strength weak';
            } else if (strength < 4) {
                strengthMeter.className = 'password-strength medium';
            } else {
                strengthMeter.className = 'password-strength strong';
            }
        });
    }
}

// Simple password hashing (for demo purposes only)
function hashPassword(password) {
    // In a real app, use a proper hashing library
    // For this demo, we'll just use base64 encoding for simplicity
    return btoa(password);
}

// Make logout function global
window.handleLogout = handleLogout;