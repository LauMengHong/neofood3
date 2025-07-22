// Global favorites system
document.addEventListener('DOMContentLoaded', function() {
  // Initialize user if needed
  initUser();
  
  // Add favorite buttons to restaurant cards on home page
  if (window.location.pathname.includes('home.html')) {
    addFavoriteButtonsToCards();
  }
  
  // Add favorite button to restaurant page
  if (window.location.pathname.includes('restaurant-')) {
    addFavoriteButtonToRestaurant();
  }
});

// Initialize user
function initUser() {
  const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
  if (!user.id) {
    user.id = 'user-' + Date.now();
    user.name = 'Neo User';
    user.email = 'user@neofood.com';
  }
  if (!user.favorites) {
    user.favorites = [];
  }
  localStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
}

// Add favorite buttons to restaurant cards on home page
function addFavoriteButtonsToCards() {
  // Wait for cards to be loaded
  setTimeout(() => {
    const cards = document.querySelectorAll('.restaurant-card');
    if (!cards.length) return;
    
    const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
    const favorites = user.favorites || [];
    
    cards.forEach(card => {
      // Get restaurant ID
      const url = card.getAttribute('onclick');
      if (!url) return;
      
      const match = url.match(/restaurant-(\d+)\.html/);
      if (!match) return;
      
      const restaurantId = 'restaurant-' + match[1];
      const isFavorite = favorites.includes(restaurantId);
      
      // Create favorite button
      const favBtn = document.createElement('button');
      favBtn.className = 'home-fav-btn' + (isFavorite ? ' active' : '');
      favBtn.innerHTML = isFavorite ? '❤️' : '🤍';
      
      // Add styles if not already added
      if (!document.getElementById('fav-btn-styles')) {
        const style = document.createElement('style');
        style.id = 'fav-btn-styles';
        style.textContent = `
          .home-fav-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.5);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 16px;
            cursor: pointer;
            z-index: 10;
          }
          .home-fav-btn:hover {
            transform: scale(1.1);
          }
        `;
        document.head.appendChild(style);
      }
      
      // Add click handler
      favBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click
        
        const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
        let favorites = user.favorites || [];
        
        if (favorites.includes(restaurantId)) {
          // Remove from favorites
          favorites = favorites.filter(id => id !== restaurantId);
          this.innerHTML = '🤍';
          this.classList.remove('active');
        } else {
          // Add to favorites
          favorites.push(restaurantId);
          this.innerHTML = '❤️';
          this.classList.add('active');
        }
        
        // Save updated favorites
        user.favorites = favorites;
        localStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
      });
      
      // Add to card
      card.style.position = 'relative';
      card.appendChild(favBtn);
    });
  }, 500);
}

// Add favorite button to restaurant page
function addFavoriteButtonToRestaurant() {
  const banner = document.querySelector('.restaurant-banner');
  if (!banner) return;
  
  // Get restaurant ID from URL
  const path = window.location.pathname;
  const match = path.match(/restaurant-(\d+)\.html/);
  if (!match) return;
  
  const restaurantId = 'restaurant-' + match[1];
  
  // Check if user has favorites
  const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
  const favorites = user.favorites || [];
  const isFavorite = favorites.includes(restaurantId);
  
  // Create favorite button
  const favBtn = document.createElement('button');
  favBtn.className = 'rest-fav-btn' + (isFavorite ? ' active' : '');
  favBtn.innerHTML = isFavorite ? '❤️' : '🤍';
  
  // Add styles
  if (!document.getElementById('rest-fav-styles')) {
    const style = document.createElement('style');
    style.id = 'rest-fav-styles';
    style.textContent = `
      .rest-fav-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.5);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        z-index: 10;
      }
      .rest-fav-btn:hover {
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add click handler
  favBtn.addEventListener('click', function() {
    const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
    let favorites = user.favorites || [];
    
    if (favorites.includes(restaurantId)) {
      // Remove from favorites
      favorites = favorites.filter(id => id !== restaurantId);
      this.innerHTML = '🤍';
      this.classList.remove('active');
    } else {
      // Add to favorites
      favorites.push(restaurantId);
      this.innerHTML = '❤️';
      this.classList.add('active');
    }
    
    // Save updated favorites
    user.favorites = favorites;
    localStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
  });
  
  // Add to banner
  banner.style.position = 'relative';
  banner.appendChild(favBtn);
}