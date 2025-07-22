// Initialize user with favorites
document.addEventListener('DOMContentLoaded', function() {
  // Check if user exists
  const user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || '{}');
  
  // Make sure user has an ID
  if (!user.id) {
    user.id = 'user-' + Date.now();
    user.name = 'Neo User';
    user.email = 'user@neofood.com';
  }
  
  // Initialize favorites if not present
  if (!user.favorites) {
    user.favorites = ['restaurant-1', 'restaurant-2', 'restaurant-3'];
  }
  
  // Save user
  localStorage.setItem('neoFoodCurrentUser', JSON.stringify(user));
  
  // Update favorites count if on profile page
  const favCount = document.getElementById('favoriteRestaurants');
  if (favCount) {
    favCount.textContent = user.favorites.length;
  }
});