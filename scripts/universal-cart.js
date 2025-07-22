// Universal cart functionality for all restaurant pages
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to all Add to Cart buttons
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
        
        // If there's a discounted price, use that instead
        const discountedPrice = menuItem.querySelector('.discounted-price');
        const finalPrice = discountedPrice ? 
            parseFloat(discountedPrice.textContent.replace('$', '')) : 
            itemPrice;
        
        // Get restaurant details
        const restaurantName = document.querySelector('.restaurant-name').textContent;
        
        // Replace existing onclick with new handler
        button.onclick = function() {
            addToCart({
                name: itemName,
                price: finalPrice,
                quantity: 1,
                restaurantName: restaurantName
            });
        };
    });
}

// Add item to cart
function addToCart(item) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    
    // Add item to cart
    cart.push(item);
    
    // Save cart
    localStorage.setItem('neoFoodCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show confirmation
    showAddedToCartNotification(item.name);
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

// Show added to cart notification
function showAddedToCartNotification(itemName) {
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
    
    // Remove after animation completes (3 seconds)
    setTimeout(() => {
        notification.remove();
    }, 3000);
}