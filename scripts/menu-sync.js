// Menu Price Synchronization System
document.addEventListener('DOMContentLoaded', () => {
    // Initialize menu items if not already done
    initializeMenuItems();
});

// Initialize menu items from restaurants
function initializeMenuItems() {
    // Get restaurants
    const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Check if menu items exist
    let menuItems = JSON.parse(localStorage.getItem('neoFoodMenuItems') || 'null');
    
    // If menu items don't exist, create them
    if (!menuItems) {
        menuItems = {};
        
        // Create menu items for each restaurant
        restaurants.forEach(restaurant => {
            // Generate sample menu items for each restaurant
            menuItems[restaurant.id] = generateSampleMenuItems(restaurant);
        });
        
        // Save to localStorage
        localStorage.setItem('neoFoodMenuItems', JSON.stringify(menuItems));
    }
}

// Update menu item price
function updateMenuItemPrice(restaurantId, itemId, newPrice) {
    // Get menu items
    let menuItems = JSON.parse(localStorage.getItem('neoFoodMenuItems') || '{}');
    
    // Find restaurant menu
    if (menuItems[restaurantId]) {
        // Find item
        const itemIndex = menuItems[restaurantId].findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            // Update price
            menuItems[restaurantId][itemIndex].price = parseFloat(newPrice);
            
            // Save to localStorage
            localStorage.setItem('neoFoodMenuItems', JSON.stringify(menuItems));
            
            // Update any items in cart
            updateCartItemPrices(itemId, parseFloat(newPrice));
            
            return true;
        }
    }
    
    return false;
}

// Update prices of items in cart
function updateCartItemPrices(itemId, newPrice) {
    // Get cart
    let cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    
    // Find items with matching ID
    const updated = cart.map(item => {
        if (item.id === itemId) {
            return { ...item, price: newPrice };
        }
        return item;
    });
    
    // Save updated cart
    localStorage.setItem('neoFoodCart', JSON.stringify(updated));
}

// Make functions available globally
window.updateMenuItemPrice = updateMenuItemPrice;