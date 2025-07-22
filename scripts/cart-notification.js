// Make the function globally available
window.showAddedToCartNotification = function(itemName) {
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