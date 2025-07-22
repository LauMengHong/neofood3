// Menu cart functionality
function addToCart(itemId, quantity) {
    const item = findItemById(itemId);
    if (!item) return;
    
    let cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    
    // Check if item already in cart
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity,
            restaurantName: currentRestaurant.name
        });
    }
    
    localStorage.setItem('neoFoodCart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Show notification
    showNotification(`${item.name} added to cart!`);
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count in nav if it exists
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 245, 255, 0.1);
        backdrop-filter: blur(15px);
        border: 1px solid var(--neon-blue);
        border-radius: 15px;
        padding: 15px 20px;
        color: white;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Make functions global
window.addToCart = addToCart;