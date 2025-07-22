// Add favorite button to restaurant pages
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a restaurant page
  if (window.location.pathname.includes('restaurant-')) {
    addFavoriteButton();
  }
});

// Add favorite button to restaurant header
function addFavoriteButton() {
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
  favBtn.className = 'fav-btn' + (isFavorite ? ' active' : '');
  favBtn.innerHTML = isFavorite ? '❤️' : '🤍';
  favBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .fav-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.3);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 20px;
      cursor: pointer;
      z-index: 10;
    }
    .fav-btn:hover {
      transform: scale(1.1);
    }
    .fav-btn.active {
      animation: pulse 0.5s;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
  
  // Add click handler
  favBtn.addEventListener('click', function() {
    const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
    let favorites = user.favorites || [];
    
    if (favorites.includes(restaurantId)) {
      // Remove from favorites
      favorites = favorites.filter(id => id !== restaurantId);
      this.innerHTML = '🤍';
      this.title = 'Add to favorites';
      this.classList.remove('active');
    } else {
      // Add to favorites
      favorites.push(restaurantId);
      this.innerHTML = '❤️';
      this.title = 'Remove from favorites';
      this.classList.add('active');
    }
    
    // Save updated favorites
    user.favorites = favorites;
    localStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
  });
  
  // Add to banner
  banner.appendChild(favBtn);
}