// Enhanced order management for admin
document.addEventListener('DOMContentLoaded', () => {
    // Add direct event listeners to order action buttons
    addOrderActionListeners();
});

// Add direct event listeners to order action buttons
function addOrderActionListeners() {
    // Process order button - add direct click handler
    document.getElementById('processOrderBtn').addEventListener('click', function() {
        processCurrentOrder('processing');
    });
    
    // Deliver order button - add direct click handler
    document.getElementById('deliverOrderBtn').addEventListener('click', function() {
        processCurrentOrder('delivered');
    });
}

// Process current order
function processCurrentOrder(newStatus) {
    // Get current order number from global variable
    if (window.currentOrderId) {
        // Get orders from both storage locations
        let allOrders = JSON.parse(localStorage.getItem('neoFoodAllOrders') || '[]');
        let orderHistory = JSON.parse(localStorage.getItem('neoFoodOrderHistory') || '[]');
        
        // Update in allOrders
        const allOrderIndex = allOrders.findIndex(o => o.orderNumber === window.currentOrderId);
        if (allOrderIndex !== -1) {
            allOrders[allOrderIndex].status = newStatus;
            localStorage.setItem('neoFoodAllOrders', JSON.stringify(allOrders));
        }
        
        // Update in orderHistory
        const historyIndex = orderHistory.findIndex(o => o.orderNumber === window.currentOrderId);
        if (historyIndex !== -1) {
            orderHistory[historyIndex].status = newStatus;
            localStorage.setItem('neoFoodOrderHistory', JSON.stringify(orderHistory));
        }
        
        // Close modal
        document.getElementById('orderModal').style.display = 'none';
        
        // Reload orders
        if (typeof loadOrders === 'function') {
            loadOrders();
        }
        
        // Show notification
        if (typeof showAdminNotification === 'function') {
            showAdminNotification(`Order ${window.currentOrderId} marked as ${newStatus}`);
        }
    }
}

// Override the viewOrderDetails function to ensure currentOrderId is set
const originalViewOrderDetails = window.viewOrderDetails;
window.viewOrderDetails = function(orderNumber) {
    // Set current order ID globally
    window.currentOrderId = orderNumber;
    
    // Call original function
    if (originalViewOrderDetails) {
        originalViewOrderDetails(orderNumber);
    }
};