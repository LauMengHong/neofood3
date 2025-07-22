document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in, redirect to sign in if not
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'signin.html';
        return;
    }
    
    // Check if returning from sign in
    const returnToCheckout = sessionStorage.getItem('returnToCheckout');
    if (returnToCheckout) {
        sessionStorage.removeItem('returnToCheckout');
        showNotification('Welcome back! Please complete your checkout', 'info');
    }
    
    loadOrderSummary();
    setupInteractions();
});

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    const summaryItems = document.getElementById('summaryItems');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    updateTotals();
}

function updateTotals() {
    const cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    
    // Check for active voucher
    const activeVoucher = JSON.parse(localStorage.getItem('activeVoucher') || 'null');
    let discount = 0;
    let discountText = '';
    
    if (activeVoucher) {
        if (activeVoucher.value.includes('%')) {
            // Percentage discount
            const percentage = parseInt(activeVoucher.value);
            discount = subtotal * (percentage / 100);
            discountText = `${activeVoucher.value} (${activeVoucher.code})`;
        } else if (activeVoucher.value.includes('$')) {
            // Fixed amount discount - ensure it doesn't exceed subtotal
            const rawDiscount = parseFloat(activeVoucher.value.replace('$', ''));
            discount = Math.min(rawDiscount, subtotal); // Cap discount at subtotal
            discountText = `${activeVoucher.value} (${activeVoucher.code})`;
        } else if (activeVoucher.type === 'Free Delivery') {
            // Free delivery
            discount = deliveryFee;
            discountText = `Free Delivery (${activeVoucher.code})`;
        }
    }
    
    // Calculate total (ensure it's not negative)
    const total = Math.max(0, subtotal + deliveryFee + tax - discount);
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    
    // Add discount line if there's an active voucher
    const summaryTotals = document.querySelector('.summary-totals');
    const totalLine = document.querySelector('.summary-line.total');
    
    // Remove any existing discount line and badge
    const existingDiscountLine = document.getElementById('discountLine');
    if (existingDiscountLine) {
        existingDiscountLine.remove();
    }
    
    const existingVoucherBadge = document.getElementById('voucherBadge');
    if (existingVoucherBadge) {
        existingVoucherBadge.remove();
    }
    
    // Add discount line if applicable
    if (discount > 0) {
        // Add discount line
        const discountLine = document.createElement('div');
        discountLine.id = 'discountLine';
        discountLine.className = 'summary-line discount';
        discountLine.innerHTML = `
            <span>Discount</span>
            <span>-$${discount.toFixed(2)} <small>${discountText}</small></span>
        `;
        summaryTotals.insertBefore(discountLine, totalLine);
        
        // Add voucher badge above summary
        const orderSummary = document.querySelector('.order-summary');
        const summaryTitle = orderSummary.querySelector('h3');
        
        const voucherBadge = document.createElement('div');
        voucherBadge.id = 'voucherBadge';
        voucherBadge.className = 'active-voucher-badge';
        voucherBadge.innerHTML = `
            <div class="voucher-info">
                <span class="voucher-icon">🎟️</span>
                <span class="voucher-text">Applied: <span class="voucher-code">${activeVoucher.code}</span></span>
            </div>
            <button class="remove-voucher" onclick="removeVoucher()">×</button>
        `;
        
        orderSummary.insertBefore(voucherBadge, summaryTitle.nextSibling);
    }
    
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function setupInteractions() {
    // Time selector
    document.querySelectorAll('.time-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.time-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            const schedulePicker = document.getElementById('schedulePicker');
            if (option.dataset.time === 'scheduled') {
                schedulePicker.style.display = 'block';
                const now = new Date();
                now.setHours(now.getHours() + 1);
                document.getElementById('deliveryTime').min = now.toISOString().slice(0, 16);
            } else {
                schedulePicker.style.display = 'none';
            }
        });
    });
    
    // Payment method selector
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            const cardDetails = document.getElementById('cardDetails');
            if (option.dataset.method === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
}

function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const placeOrderBtn = document.querySelector('.place-order-btn');
    placeOrderBtn.textContent = 'Processing Order...';
    placeOrderBtn.disabled = true;
    
    setTimeout(() => {
        const orderNumber = 'NF' + Date.now().toString().slice(-6);
        
        const orderData = {
            orderNumber: orderNumber,
            items: cart,
            total: document.getElementById('total').textContent,
            timestamp: new Date().toISOString(),
            status: 'confirmed'
        };
        
        // Save to current order
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        // Save to order history
        let orderHistory = JSON.parse(localStorage.getItem('neoFoodOrderHistory') || '[]');
        orderHistory.push(orderData);
        localStorage.setItem('neoFoodOrderHistory', JSON.stringify(orderHistory));
        
        // Clear cart
        localStorage.removeItem('neoFoodCart');
        
        window.location.href = 'confirmation.html';
    }, 1000);
}

// Make functions global
window.placeOrder = placeOrder;

// Function to remove active voucher
function removeVoucher() {
    localStorage.removeItem('activeVoucher');
    updateTotals();
    showNotification('Voucher removed', 'info');
}

// Make function global
window.removeVoucher = removeVoucher;

function placeOrder() {
    // Validate form
    const requiredFields = document.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff1493';
            isValid = false;
        } else {
            field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Save current page to return after login
        sessionStorage.setItem('returnToCheckout', 'true');
        window.location.href = 'signin.html';
        return;
    }
    
    // Show loading state
    const placeOrderBtn = document.querySelector('.place-order-btn');
    placeOrderBtn.textContent = 'Processing Order...';
    placeOrderBtn.disabled = true;
    placeOrderBtn.style.background = 'linear-gradient(45deg, #666, #999)';
    
    // Get cart and calculate totals
    const cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    
    // Check for active voucher
    const activeVoucher = JSON.parse(localStorage.getItem('activeVoucher') || 'null');
    let discount = 0;
    
    if (activeVoucher) {
        if (activeVoucher.value.includes('%')) {
            // Percentage discount
            const percentage = parseInt(activeVoucher.value);
            discount = subtotal * (percentage / 100);
        } else if (activeVoucher.value.includes('$')) {
            // Fixed amount discount
            const rawDiscount = parseFloat(activeVoucher.value.replace('$', ''));
            discount = Math.min(rawDiscount, subtotal);
        } else if (activeVoucher.type === 'Free Delivery') {
            // Free delivery
            discount = deliveryFee;
        }
    }
    
    // Calculate total
    const total = Math.max(0, subtotal + deliveryFee + tax - discount);
    
    // Get address details
    const streetAddress = document.getElementById('streetAddress').value;
    const city = document.getElementById('cityInput').value;
    const zip = document.getElementById('zipInput').value;
    const instructions = document.getElementById('instructionsInput').value;
    const fullAddress = `${streetAddress}, ${city}, ${zip}`;
    
    // Simulate order processing
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'NF' + Date.now().toString().slice(-6);
        
        // Store order details
        const orderData = {
            orderNumber: orderNumber,
            items: cart,
            customerName: currentUser.name,
            customerEmail: currentUser.email,
            customerId: currentUser.id,
            subtotal: subtotal.toFixed(2),
            deliveryFee: deliveryFee.toFixed(2),
            tax: tax.toFixed(2),
            discount: discount > 0 ? discount.toFixed(2) : null,
            total: `$${total.toFixed(2)}`,
            timestamp: new Date().toISOString(),
            status: 'pending',
            address: fullAddress,
            deliveryInstructions: instructions
        };
        
        // Save to current order
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        // Save to order history
        let orderHistory = JSON.parse(localStorage.getItem('neoFoodOrderHistory') || '[]');
        orderHistory.push(orderData);
        localStorage.setItem('neoFoodOrderHistory', JSON.stringify(orderHistory));
        
        // Save to all orders (for admin)
        let allOrders = JSON.parse(localStorage.getItem('neoFoodAllOrders') || '[]');
        allOrders.push(orderData);
        localStorage.setItem('neoFoodAllOrders', JSON.stringify(allOrders));
        
        // Clear cart and voucher
        localStorage.removeItem('neoFoodCart');
        localStorage.removeItem('activeVoucher');
        
        // Redirect to confirmation
        window.location.href = 'confirmation.html';
    }, 2000);
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

// Make function global
window.placeOrder = placeOrder;

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(15px);
        border: 1px solid ${type === 'error' ? 'var(--neon-pink)' : 'var(--neon-blue)'};
        border-radius: 15px;
        padding: 15px 20px;
        color: var(--text-light);
        z-index: 3000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}