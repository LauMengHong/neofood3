// Setup default admin account
(function() {
    // Check if admin account exists
    const users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    const adminExists = users.some(user => user.email === 'admin@neofood.com' && user.isAdmin);
    
    if (!adminExists) {
        // Create admin account
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
        console.log('Admin account created');
    }
})();