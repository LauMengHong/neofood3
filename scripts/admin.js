// Admin Dashboard for NeoFood
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    checkAdminAccess();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Load orders
    loadOrders();
    
    // Setup filter buttons
    setupFilters();
    
    // Setup modal
    setupModal();
});

// Check if current user is admin
function checkAdminAccess() {
    const currentUser = getCurrentUser();
    
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'signin.html';
    }
}

// Get current user from storage
function getCurrentUser() {
    // Check session storage first
    let user = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    
    // If not in session storage, check local storage
    if (!user) {
        user = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    }
    
    return user;
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    // Clear user data
    sessionStorage.removeItem('neoFoodCurrentUser');
    localStorage.removeItem('neoFoodCurrentUser');
    
    // Redirect to sign in page
    window.location.href = 'signin.html';
}

// Load all orders
function loadOrders() {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('neoFoodAllOrders') || '[]');
    
    // Update stats
    updateOrderStats(orders);
    
    // Display orders
    displayOrders(orders);
}

// Update order statistics
function updateOrderStats(orders) {
    document.getElementById('totalOrders').textContent = orders.length;
    
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    document.getElementById('completedOrders').textContent = completedOrders;
}

// Display orders in the list
function displayOrders(orders, filter = 'all') {
    const ordersList = document.getElementById('ordersList');
    
    // Filter orders if needed
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(order => order.status === filter);
    }
    
    // Sort orders by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Display orders
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders">No orders found</div>';
    } else {
        ordersList.innerHTML = filteredOrders.map(order => `
            <div class="order-card" data-order-id="${order.orderNumber}">
                <div class="order-info">
                    <div class="order-number">${order.orderNumber}</div>
                    <div class="order-date">${formatDate(order.timestamp)}</div>
                    <div class="order-customer">${order.customerName || 'Guest'}</div>
                </div>
                <div class="order-total">${order.total}</div>
                <div class="order-status status-${order.status}">${capitalizeFirst(order.status)}</div>
                <div class="order-actions">
                    <button class="view-btn" onclick="viewOrderDetails('${order.orderNumber}')">View Details</button>
                </div>
            </div>
        `).join('');
    }
}

// Setup filter buttons
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter orders
            const filter = btn.dataset.filter;
            const orders = JSON.parse(localStorage.getItem('neoFoodAllOrders') || '[]');
            displayOrders(orders, filter);
        });
    });
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Setup action buttons
    const processBtn = document.getElementById('processOrderBtn');
    const deliverBtn = document.getElementById('deliverOrderBtn');
    
    if (processBtn) {
        processBtn.addEventListener('click', function() {
            updateOrderStatus(currentOrderId, 'processing');
        });
    }
    
    if (deliverBtn) {
        deliverBtn.addEventListener('click', function() {
            updateOrderStatus(currentOrderId, 'delivered');
        });
    }
}

// Store current order ID for modal actions
let currentOrderId = null;

// View order details
function viewOrderDetails(orderNumber) {
    const orders = JSON.parse(localStorage.getItem('neoFoodAllOrders') || '[]');
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (!order) return;
    
    // Store current order ID
    currentOrderId = orderNumber;
    
    // Populate modal content
    const content = document.getElementById('orderDetailContent');
    
    content.innerHTML = `
        <div class="order-detail-header">
            <div>
                <div class="order-detail-number">${order.orderNumber}</div>
                <div class="order-detail-date">${formatDate(order.timestamp)}</div>
                <div class="order-detail-status status-${order.status}">${capitalizeFirst(order.status)}</div>
            </div>
        </div>
        
        <div class="order-detail-customer">
            <strong>Customer:</strong> ${order.customerName || 'Guest'} (${order.customerEmail || 'No email'})
        </div>
        
        <div class="order-detail-items">
            <h3>Order Items</h3>
            ${order.items.map(item => `
                <div class="order-detail-item">
                    <div class="item-name-qty">
                        <div class="item-name">${item.name}</div>
                        <div class="item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="order-detail-totals">
            <div class="total-line">
                <span>Subtotal</span>
                <span>$${order.subtotal || '0.00'}</span>
            </div>
            <div class="total-line">
                <span>Delivery Fee</span>
                <span>$${order.deliveryFee || '0.00'}</span>
            </div>
            <div class="total-line">
                <span>Tax</span>
                <span>$${order.tax || '0.00'}</span>
            </div>
            ${order.discount ? `
                <div class="total-line">
                    <span>Discount</span>
                    <span>-$${order.discount}</span>
                </div>
            ` : ''}
            <div class="total-line final">
                <span>Total</span>
                <span>${order.total}</span>
            </div>
        </div>
        
        <div class="order-detail-address">
            <div class="address-title">Delivery Address</div>
            <div class="address-text">${order.address || 'No address provided'}</div>
            ${order.deliveryInstructions ? `
                <div class="address-instructions">
                    <strong>Instructions:</strong> ${order.deliveryInstructions}
                </div>
            ` : ''}
        </div>
    `;
    
    // Show/hide action buttons based on status
    const processBtn = document.getElementById('processOrderBtn');
    const deliverBtn = document.getElementById('deliverOrderBtn');
    
    if (order.status === 'pending') {
        processBtn.style.display = 'block';
        deliverBtn.style.display = 'none';
    } else if (order.status === 'processing') {
        processBtn.style.display = 'none';
        deliverBtn.style.display = 'block';
    } else {
        processBtn.style.display = 'none';
        deliverBtn.style.display = 'none';
    }
    
    // Show modal
    document.getElementById('orderModal').style.display = 'flex';
}

// Update order status
function updateOrderStatus(orderNumber, newStatus) {
    // Get orders from both storage locations
    let allOrders = JSON.parse(localStorage.getItem('neoFoodAllOrders') || '[]');
    let orderHistory = JSON.parse(localStorage.getItem('neoFoodOrderHistory') || '[]');
    
    // Update in allOrders
    const allOrderIndex = allOrders.findIndex(o => o.orderNumber === orderNumber);
    if (allOrderIndex !== -1) {
        allOrders[allOrderIndex].status = newStatus;
        localStorage.setItem('neoFoodAllOrders', JSON.stringify(allOrders));
    }
    
    // Update in orderHistory
    const historyIndex = orderHistory.findIndex(o => o.orderNumber === orderNumber);
    if (historyIndex !== -1) {
        orderHistory[historyIndex].status = newStatus;
        localStorage.setItem('neoFoodOrderHistory', JSON.stringify(orderHistory));
    }
    
    // Update UI
    document.getElementById('orderModal').style.display = 'none';
    loadOrders();
    
    // Show notification
    showNotification(`Order ${orderNumber} marked as ${capitalizeFirst(newStatus)}`);
    
    // If we have the extended admin functionality, use it for real-time notifications
    if (typeof window.updateOrderStatus === 'function' && window.updateOrderStatus !== updateOrderStatus) {
        window.updateOrderStatus(orderNumber, newStatus);
    }
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Helper function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Show notification
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
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make functions global
window.viewOrderDetails = viewOrderDetails;