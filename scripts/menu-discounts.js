// Menu Discounts System
document.addEventListener('DOMContentLoaded', () => {
    // Apply discounts to menu items
    applyDiscountsToMenu();
});

// Apply discounts to menu items
function applyDiscountsToMenu() {
    // Get active discounts
    const discounts = getActiveDiscounts();
    
    // If no discounts, return
    if (discounts.length === 0) return;
    
    // Get current restaurant ID
    const restaurantId = getCurrentRestaurantId();
    if (!restaurantId) return;
    
    // Find applicable discounts
    const globalDiscounts = discounts.filter(d => d.type === 'global');
    const restaurantDiscounts = discounts.filter(d => d.type === 'restaurant' && d.restaurantId === restaurantId);
    
    // Get highest discount
    const allApplicableDiscounts = [...globalDiscounts, ...restaurantDiscounts];
    if (allApplicableDiscounts.length === 0) return;
    
    const highestDiscount = allApplicableDiscounts.reduce((max, d) => 
        parseInt(d.percentage) > parseInt(max.percentage) ? d : max
    );
    
    // Apply discount to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        // Get price element
        const priceElement = item.querySelector('.item-price');
        if (!priceElement) return;
        
        // Get original price
        const originalPrice = parseFloat(priceElement.textContent.replace('$', ''));
        
        // Calculate discounted price
        const discountPercentage = parseInt(highestDiscount.percentage);
        const discountAmount = originalPrice * (discountPercentage / 100);
        const discountedPrice = originalPrice - discountAmount;
        
        // Update price display
        priceElement.innerHTML = `
            <span class="original-price">$${originalPrice.toFixed(2)}</span>
            <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
            <span class="discount-tag">-${discountPercentage}%</span>
        `;
        
        // Add discount class to menu item
        item.classList.add('has-discount');
    });
    
    // Add discount banner
    addDiscountBanner(highestDiscount);
}

// Get active discounts
function getActiveDiscounts() {
    // Get discounts from localStorage
    const discounts = JSON.parse(localStorage.getItem('neoFoodDiscounts') || '[]');
    
    // Filter active discounts
    const today = new Date().toISOString().split('T')[0];
    return discounts.filter(discount => 
        discount.startDate <= today && discount.endDate >= today
    );
}

// Get current restaurant ID
function getCurrentRestaurantId() {
    // This would normally get the ID from the URL or page context
    // For this demo, we'll extract it from the page title or URL
    
    const path = window.location.pathname;
    
    // Check if we're on a restaurant page
    if (path.includes('restaurant-')) {
        // Extract restaurant number from URL
        const match = path.match(/restaurant-(\d+)/);
        if (match && match[1]) {
            return `restaurant-${match[1]}`;
        }
    }
    
    return null;
}

// Add discount banner
function addDiscountBanner(discount) {
    // Create banner
    const banner = document.createElement('div');
    banner.className = 'discount-notification';
    banner.innerHTML = `
        <div class="discount-notification-content">
            <div class="discount-notification-title">${discount.name}</div>
            <div class="discount-notification-message">
                Enjoy ${discount.percentage}% off all menu items!
            </div>
        </div>
        <div class="discount-notification-percentage">-${discount.percentage}%</div>
    `;
    
    // Add to page
    const restaurantHeader = document.querySelector('.restaurant-header');
    if (restaurantHeader) {
        restaurantHeader.appendChild(banner);
    }
}