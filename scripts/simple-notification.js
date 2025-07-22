// Simple notification system
document.addEventListener('DOMContentLoaded', function() {
    // Override the cart notification function
    window.addToCart = function(item) {
        // Get current cart
        let cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
        
        // Add unique ID to item
        item.uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Add item to cart
        cart.push(item);
        
        // Save cart
        localStorage.setItem('neoFoodCart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showSimpleNotification(item.name);
    };
    
    // Setup cart buttons
    setupCartButtons();
});

// Setup cart buttons
function setupCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        // Get menu item details
        const menuItem = button.closest('.menu-item');
        if (!menuItem) return;
        
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPriceElement = menuItem.querySelector('.item-price');
        const itemPrice = parseFloat(itemPriceElement.textContent.replace('$', ''));
        
        // Get restaurant details
        const restaurantName = document.querySelector('.restaurant-name').textContent;
        
        // Replace existing onclick with new handler
        button.onclick = function() {
            // Create item object
            const item = {
                name: itemName,
                price: itemPrice,
                quantity: 1,
                restaurantName: restaurantName
            };
            
            // Add to cart
            addToCart(item);
        };
    });
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'inline';
    } else {
        cartCount.style.display = 'none';
    }
}

// Show simple notification
function showSimpleNotification(itemName) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-icon">✓</div>
        <div class="notification-content">
            <div class="notification-title">Added to Cart</div>
            <div class="notification-message">${itemName}</div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}