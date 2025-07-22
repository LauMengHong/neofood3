// Data synchronization between admin and user interfaces
(function() {
    // Set up storage event listener to detect changes
    window.addEventListener('storage', handleStorageChange);
    
    // Initial sync on page load
    syncAllData();
})();

// Handle storage changes
function handleStorageChange(event) {
    // Check which data was changed
    switch(event.key) {
        case 'neoFoodRestaurants':
            updateRestaurantDisplay();
            break;
        case 'neoFoodDiscounts':
            updateDiscountDisplay();
            break;
        case 'neoFoodVouchers':
            updateVoucherDisplay();
            break;
        case 'neoFoodMenuItems':
            updateMenuDisplay();
            break;
    }
}

// Sync all data
function syncAllData() {
    updateRestaurantDisplay();
    updateDiscountDisplay();
    updateVoucherDisplay();
    updateMenuDisplay();
}

// Update restaurant display
function updateRestaurantDisplay() {
    // If on home page, refresh restaurant grid
    if (document.getElementById('restaurantsGrid')) {
        if (typeof loadRestaurantsFromAdmin === 'function') {
            loadRestaurantsFromAdmin();
        }
    }
    
    // If on restaurant detail page, refresh restaurant info
    const restaurantHeader = document.querySelector('.restaurant-header');
    if (restaurantHeader) {
        const currentPath = window.location.pathname;
        const match = currentPath.match(/restaurant-(\d+)\.html/);
        
        if (match && match[1]) {
            const restaurantId = 'restaurant-' + match[1];
            const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
            const restaurant = restaurants.find(r => r.id === restaurantId);
            
            if (restaurant) {
                // Update restaurant name and details
                const nameElement = restaurantHeader.querySelector('.restaurant-name');
                if (nameElement) nameElement.textContent = restaurant.name;
                
                const detailsElement = restaurantHeader.querySelector('.restaurant-details');
                if (detailsElement) detailsElement.textContent = restaurant.cuisine + ' • Premium Quality';
                
                const ratingElement = restaurantHeader.querySelector('.rating');
                if (ratingElement) ratingElement.textContent = '⭐ ' + restaurant.rating;
                
                const timeElement = restaurantHeader.querySelector('.delivery-time');
                if (timeElement) timeElement.textContent = '🕒 ' + restaurant.deliveryTime + ' min';
                
                const feeElement = restaurantHeader.querySelector('.delivery-fee');
                if (feeElement) feeElement.textContent = '🚚 $' + restaurant.deliveryFee;
                
                const iconElement = restaurantHeader.querySelector('.restaurant-icon');
                if (iconElement) iconElement.textContent = restaurant.icon;
            }
        }
    }
}

// Update discount display
function updateDiscountDisplay() {
    // If menu-discounts.js is loaded, apply discounts
    if (typeof applyDiscountsToMenu === 'function') {
        applyDiscountsToMenu();
    }
    
    // If on home page with discount badges
    if (document.querySelector('.discount-badge')) {
        if (typeof loadRestaurantsFromAdmin === 'function') {
            loadRestaurantsFromAdmin();
        }
    }
}

// Update voucher display
function updateVoucherDisplay() {
    // If on vouchers page
    if (window.location.pathname.includes('vouchers.html')) {
        if (typeof loadVouchers === 'function') {
            loadVouchers();
        } else {
            // Fallback: reload page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }
}

// Update menu display
function updateMenuDisplay() {
    // If on restaurant detail page with menu items
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems.length > 0) {
        // Reload page to show updated menu items
        // This is a simple approach; a more complex one would update items in-place
        window.location.reload();
    }
}