// Profile page loader
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
});

function loadUserProfile() {
    // Get current user
    const currentUser = getCurrentUser();
    
    // If no user is logged in, redirect to sign in
    if (!currentUser) {
        window.location.href = 'signin.html';
        return;
    }
    
    // Update profile information
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    
    // Load order history
    loadOrderHistory(currentUser.id);
    
    // Load favorites
    loadFavorites(currentUser.id);
}

function getCurrentUser() {
    // Check session storage first
    let user = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    
    // If not in session storage, check local storage only if remember me was set
    if (!user && localStorage.getItem('neoFoodRememberMe') === 'true') {
        user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    }
    
    return user;
}

function loadOrderHistory(userId) {
    // Get order history from localStorage
    const orderHistory = JSON.parse(localStorage.getItem('neoFoodOrderHistory') || '[]');
    
    // Filter orders for this user
    const userOrders = orderHistory.filter(order => order.customerId === userId);
    
    // Update stats
    document.getElementById('totalOrders').textContent = userOrders.length;
    
    // Calculate total spent
    const totalSpent = userOrders.reduce((sum, order) => {
        const orderTotal = parseFloat(order.total.replace('$', ''));
        return sum + orderTotal;
    }, 0);
    
    document.getElementById('totalSpent').textContent = '$' + totalSpent.toFixed(2);
    
    // Display recent orders
    const recentOrders = document.getElementById('recentOrders');
    
    if (userOrders.length === 0) {
        recentOrders.innerHTML = '<div class="no-orders">No orders yet</div>';
        return;
    }
    
    // Sort by date (newest first)
    userOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Display up to 5 most recent orders
    const displayOrders = userOrders.slice(0, 5);
    
    recentOrders.innerHTML = displayOrders.map(order => `
        <div class="order-card glass">
            <div class="order-header">
                <div class="order-number">${order.orderNumber}</div>
                <div class="order-status ${order.status}">${order.status}</div>
            </div>
            <div class="order-details">
                <div class="order-items">
                    ${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                </div>
                <div class="order-total">${order.total}</div>
            </div>
            <div class="order-date">${formatDate(order.timestamp)}</div>
        </div>
    `).join('');
}

function loadFavorites(userId) {
    // Get favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('neoFoodFavorites') || '{}');
    
    // Get user favorites
    const userFavorites = favorites[userId] || [];
    
    // Update stats
    document.getElementById('favoriteRestaurants').textContent = userFavorites.length;
    
    // Display favorites
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    if (userFavorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="no-favorites">No favorites yet</div>';
        return;
    }
    
    // Display favorites
    favoritesGrid.innerHTML = userFavorites.map(favorite => `
        <div class="favorite-card glass">
            <div class="favorite-icon">${favorite.icon || '🍽️'}</div>
            <div class="favorite-info">
                <h3>${favorite.name}</h3>
                <p>${favorite.cuisine || 'Restaurant'}</p>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}