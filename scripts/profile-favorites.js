// Profile favorites functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load user favorites
    loadUserFavorites();
    
    // Update favorites count
    updateFavoritesCount();
});

// Load user favorites
function loadUserFavorites() {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get favorites grid
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    // Get user favorites
    const favorites = currentUser.favorites || [];
    
    // Get all restaurants
    const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Clear grid
    favoritesGrid.innerHTML = '';
    
    // Check if we have favorites
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="no-favorites">No favorite restaurants yet</div>';
        return;
    }
    
    // Display favorites
    favorites.forEach(favoriteId => {
        // Find restaurant
        const restaurant = restaurants.find(r => r.id === favoriteId);
        if (!restaurant) return;
        
        // Create favorite card
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'favorite-card glass';
        
        // Extract restaurant number from ID
        const restaurantNumber = restaurant.id.split('-')[1];
        const url = `restaurant-${restaurantNumber}.html`;
        
        favoriteCard.innerHTML = `
            <div class="favorite-icon">${restaurant.icon || '🍽️'}</div>
            <div class="favorite-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.cuisine}</p>
                <div class="favorite-rating">
                    <span class="stars">${'★'.repeat(Math.floor(restaurant.rating))}${restaurant.rating % 1 ? '☆' : ''}</span>
                    <span>${restaurant.rating}</span>
                </div>
            </div>
            <div class="favorite-actions">
                <button class="order-btn" onclick="window.location.href='${url}'">Order</button>
                <button class="remove-favorite-btn" data-id="${restaurant.id}">
                    <span class="heart-icon">❤️</span>
                </button>
            </div>
        `;
        
        favoritesGrid.appendChild(favoriteCard);
        
        // Add event listener to remove button
        const removeBtn = favoriteCard.querySelector('.remove-favorite-btn');
        removeBtn.addEventListener('click', () => {
            removeFromFavorites(restaurant.id);
        });
    });
}

// Remove restaurant from favorites
function removeFromFavorites(restaurantId) {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get user favorites
    let favorites = currentUser.favorites || [];
    
    // Remove restaurant from favorites
    favorites = favorites.filter(id => id !== restaurantId);
    
    // Update user favorites
    currentUser.favorites = favorites;
    
    // Save user
    saveCurrentUser(currentUser);
    
    // Reload favorites
    loadUserFavorites();
    
    // Update favorites count
    updateFavoritesCount();
}

// Update favorites count
function updateFavoritesCount() {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get favorites count
    const favoritesCount = (currentUser.favorites || []).length;
    
    // Update count
    const favoritesCountElement = document.getElementById('favoriteRestaurants');
    if (favoritesCountElement) {
        favoritesCountElement.textContent = favoritesCount;
    }
}

// Get current user
function getCurrentUser() {
    // Check session storage first
    let user = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    
    // If not in session storage, check local storage
    if (!user) {
        user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    }
    
    return user;
}

// Save current user
function saveCurrentUser(user) {
    // Save to session storage
    sessionStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
    
    // Save to local storage
    localStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
    
    // Update users list
    updateUserInList(user);
}

// Update user in users list
function updateUserInList(user) {
    // Get users
    const users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Find user
    const index = users.findIndex(u => u.id === user.id);
    
    // Update user
    if (index !== -1) {
        users[index] = user;
        
        // Save users
        localStorage.setItem('neoFoodUsers', JSON.stringify(users));
    }
}