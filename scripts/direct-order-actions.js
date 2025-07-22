// Direct order action handlers
document.addEventListener('DOMContentLoaded', function() {
    console.log("Direct order actions script loaded");
    
    // Add direct click handlers to order action buttons
    const processBtn = document.getElementById('processOrderBtn');
    const deliverBtn = document.getElementById('deliverOrderBtn');
    
    if (processBtn) {
        console.log("Process button found");
        processBtn.onclick = function() {
            console.log("Process button clicked");
            const orderNumber = window.currentOrderId;
            if (orderNumber) {
                console.log("Processing order: " + orderNumber);
                updateOrderStatusDirect(orderNumber, 'processing');
            }
        };
    }
    
    if (deliverBtn) {
        console.log("Deliver button found");
        deliverBtn.onclick = function() {
            console.log("Deliver button clicked");
            const orderNumber = window.currentOrderId;
            if (orderNumber) {
                console.log("Delivering order: " + orderNumber);
                updateOrderStatusDirect(orderNumber, 'delivered');
            }
        };
    }
});

// Direct order status update function
function updateOrderStatusDirect(orderNumber, newStatus) {
    console.log(`Updating order ${orderNumber} to ${newStatus}`);
    
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
    
    // Close modal
    document.getElementById('orderModal').style.display = 'none';
    
    // Reload orders
    if (typeof loadOrders === 'function') {
        loadOrders();
    }
    
    // Show notification
    alert(`Order ${orderNumber} has been marked as ${newStatus}`);
}