// Admin notifications helper
// Global notification function for admin pages
function showAdminNotification(message) {
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
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make function globally available
window.showAdminNotification = showAdminNotification;