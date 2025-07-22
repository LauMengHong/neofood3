// User notifications system
document.addEventListener('DOMContentLoaded', () => {
    // Check for notifications every 5 seconds
    checkNotifications();
    setInterval(checkNotifications, 5000);
});

// Check for notifications
function checkNotifications() {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get notifications
    const notifications = JSON.parse(localStorage.getItem(`neoFoodNotifications_${currentUser.id}`) || '[]');
    
    // Filter unread notifications
    const unreadNotifications = notifications.filter(n => !n.read);
    
    // Show notifications
    unreadNotifications.forEach(notification => {
        showNotification(notification);
        
        // Mark as read
        markNotificationAsRead(currentUser.id, notification);
    });
}

// Show notification
function showNotification(notification) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerHTML = `
        <div class="notification-title">${notification.title}</div>
        <div class="notification-message">${notification.message}</div>
    `;
    
    // Add to container
    container.appendChild(notificationElement);
    
    // Show notification
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notificationElement.classList.remove('show');
        setTimeout(() => {
            notificationElement.remove();
        }, 300);
    }, 5000);
    
    // If it's an order status update, update the UI
    if (notification.orderId && notification.status) {
        updateOrderStatusUI(notification.orderId, notification.status);
    }
}

// Mark notification as read
function markNotificationAsRead(userId, notification) {
    // Get notifications
    let notifications = JSON.parse(localStorage.getItem(`neoFoodNotifications_${userId}`) || '[]');
    
    // Find notification
    const index = notifications.findIndex(n => 
        n.timestamp === notification.timestamp && 
        n.title === notification.title && 
        n.message === notification.message
    );
    
    if (index !== -1) {
        // Mark as read
        notifications[index].read = true;
        
        // Save to localStorage
        localStorage.setItem(`neoFoodNotifications_${userId}`, JSON.stringify(notifications));
    }
}

// Update order status in UI
function updateOrderStatusUI(orderId, status) {
    // Find order elements in the page
    const orderElements = document.querySelectorAll(`[data-order-id="${orderId}"]`);
    
    orderElements.forEach(element => {
        // Find status element
        const statusElement = element.querySelector('.order-status');
        if (statusElement) {
            // Remove old status classes
            statusElement.classList.remove('pending', 'processing', 'delivered');
            
            // Add new status class
            statusElement.classList.add(status);
            
            // Update text
            statusElement.textContent = status;
        }
    });
}

// Get current user
function getCurrentUser() {
    const sessionUser = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    const localUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    return sessionUser || localUser;
}