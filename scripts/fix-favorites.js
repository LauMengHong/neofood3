// Fix favorites display in profile
document.addEventListener('DOMContentLoaded', function() {
  // Initialize default restaurant data if not present
  initDefaultRestaurants();
  
  // Check if we're on the profile page
  if (document.getElementById('favoritesGrid')) {
    // Add sample favorites if user has none
    addSampleFavorites();
    
    // Display favorites
    displayFavorites();
    
    // Make sure the favorites tab works
    setupFavoritesTab();
  }
});

// Initialize default restaurant data
function initDefaultRestaurants() {
  if (!localStorage.getItem('neoFoodRestaurants')) {
    const defaultRestaurants = [
      {
        id: 'restaurant-1',
        name: 'Cyber Sushi',
        cuisine: 'Japanese',
        icon: '🍣',
        rating: 4.8
      },
      {
        id: 'restaurant-2',
        name: 'Neon Pizza',
        cuisine: 'Italian',
        icon: '🍕',
        rating: 4.7
      },
      {
        id: 'restaurant-3',
        name: 'Digital Greens',
        cuisine: 'Healthy',
        icon: '🥗',
        rating: 4.9
      }
    ];
    localStorage.setItem('neoFoodRestaurants', JSON.stringify(defaultRestaurants));
  }
}

// Add sample favorites if user has none
function addSampleFavorites() {
  const currentUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
  if (!currentUser.favorites || currentUser.favorites.length === 0) {
    currentUser.favorites = ['restaurant-1', 'restaurant-2'];
    localStorage.setItem('neoFoodCurrentUser', JSON.stringify(currentUser));
    
    // Update favorites count
    const favCount = document.getElementById('favoriteRestaurants');
    if (favCount) favCount.textContent = '2';
  }
}

// Setup favorites tab
function setupFavoritesTab() {
  const favTab = document.querySelector('.tab[data-tab="favorites"]');
  if (favTab) {
    favTab.addEventListener('click', function() {
      // Remove active class from all tabs and panels
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
      
      // Add active class to favorites tab and panel
      this.classList.add('active');
      document.getElementById('favorites-panel').classList.add('active');
      
      // Make sure favorites are displayed
      displayFavorites();
    });
  }
}

// Display favorites
function displayFavorites() {
  const favoritesGrid = document.getElementById('favoritesGrid');
  if (!favoritesGrid) return;
  
  const currentUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
  const favorites = currentUser.favorites || [];
  const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
  
  favoritesGrid.innerHTML = '';
  
  if (favorites.length === 0) {
    favoritesGrid.innerHTML = '<div class="no-favorites">No favorite restaurants yet</div>';
    return;
  }
  
  favorites.forEach(id => {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;
    
    const restaurantNumber = restaurant.id.split('-')[1];
    
    const card = document.createElement('div');
    card.className = 'favorite-card glass';
    card.innerHTML = `
      <div class="favorite-icon">${restaurant.icon}</div>
      <div class="favorite-info">
        <h3>${restaurant.name}</h3>
        <p>${restaurant.cuisine}</p>
        <div class="favorite-rating">
          <span class="stars">★★★★★</span>
          <span>${restaurant.rating}</span>
        </div>
      </div>
      <div class="favorite-actions">
        <button class="order-btn" onclick="window.location.href='restaurant-${restaurantNumber}.html'">Order</button>
        <button class="remove-btn" data-id="${restaurant.id}">❌</button>
      </div>
    `;
    
    favoritesGrid.appendChild(card);
    
    // Add remove functionality
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
      user.favorites = (user.favorites || []).filter(fav => fav !== id);
      localStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
      
      // Update count
      const favCount = document.getElementById('favoriteRestaurants');
      if (favCount) favCount.textContent = user.favorites.length;
      
      // Remove card
      card.remove();
      
      // Show empty message if needed
      if (user.favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="no-favorites">No favorite restaurants yet</div>';
      }
    });
  });
}