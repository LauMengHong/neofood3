// Extended Admin Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin sections
    initAdminSections();
    
    // Load restaurants
    loadRestaurants();
    
    // Load users
    loadUsers();
    
    // Setup restaurant form
    setupRestaurantForm();
    
    // Setup real-time notifications
    setupNotifications();
});

// Initialize admin sections
function initAdminSections() {
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get section ID
            const sectionId = link.getAttribute('data-section');
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            link.classList.add('active');
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });
}

// Load restaurants
function loadRestaurants() {
    const restaurantsList = document.getElementById('restaurantsList');
    if (!restaurantsList) return;
    
    // Get restaurants from localStorage
    const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Clear loading spinner
    restaurantsList.innerHTML = '';
    
    // Add restaurants
    if (restaurants.length === 0) {
        restaurantsList.innerHTML = '<div class="no-data">No restaurants added yet</div>';
    } else {
        restaurants.forEach(restaurant => {
            const restaurantCard = document.createElement('div');
            restaurantCard.className = 'restaurant-card glass';
            restaurantCard.innerHTML = `
                <div class="restaurant-info">
                    <div class="restaurant-icon">${restaurant.icon || '🍽️'}</div>
                    <div class="restaurant-details">
                        <h3>${restaurant.name}</h3>
                        <p>${restaurant.cuisine} • ${restaurant.rating}⭐ • ${restaurant.deliveryTime} min</p>
                    </div>
                </div>
                <div class="restaurant-actions">
                    <button class="edit-btn" data-id="${restaurant.id}">Edit</button>
                    <button class="delete-btn" data-id="${restaurant.id}">Delete</button>
                </div>
            `;
            restaurantsList.appendChild(restaurantCard);
            
            // Add event listeners
            const editBtn = restaurantCard.querySelector('.edit-btn');
            const deleteBtn = restaurantCard.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => {
                openRestaurantModal(restaurant);
            });
            
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete ${restaurant.name}?`)) {
                    deleteRestaurant(restaurant.id);
                }
            });
        });
    }
    
    // Add restaurant button
    const addRestaurantBtn = document.getElementById('addRestaurantBtn');
    if (addRestaurantBtn) {
        addRestaurantBtn.addEventListener('click', () => {
            openRestaurantModal();
        });
    }
}

// Open restaurant modal
function openRestaurantModal(restaurant = null) {
    const modal = document.getElementById('restaurantModal');
    const form = document.getElementById('restaurantForm');
    const title = document.getElementById('restaurantModalTitle');
    
    // Reset form
    form.reset();
    
    if (restaurant) {
        // Edit mode
        title.textContent = 'Edit Restaurant';
        document.getElementById('restaurantName').value = restaurant.name;
        document.getElementById('restaurantCuisine').value = restaurant.cuisine;
        document.getElementById('restaurantIcon').value = restaurant.icon;
        document.getElementById('restaurantRating').value = restaurant.rating;
        document.getElementById('deliveryTime').value = restaurant.deliveryTime;
        document.getElementById('deliveryFee').value = restaurant.deliveryFee;
        document.getElementById('restaurantDescription').value = restaurant.description;
        form.setAttribute('data-id', restaurant.id);
    } else {
        // Add mode
        title.textContent = 'Add Restaurant';
        form.removeAttribute('data-id');
    }
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Setup restaurant form
function setupRestaurantForm() {
    const form = document.getElementById('restaurantForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('restaurantName').value;
        const cuisine = document.getElementById('restaurantCuisine').value;
        const icon = document.getElementById('restaurantIcon').value;
        const rating = document.getElementById('restaurantRating').value;
        const deliveryTime = document.getElementById('deliveryTime').value;
        const deliveryFee = document.getElementById('deliveryFee').value;
        const description = document.getElementById('restaurantDescription').value;
        
        // Get restaurant ID if editing
        const id = form.getAttribute('data-id') || `restaurant-${Date.now()}`;
        
        // Create restaurant object
        const restaurant = {
            id,
            name,
            cuisine,
            icon,
            rating,
            deliveryTime,
            deliveryFee,
            description
        };
        
        // Save restaurant
        saveRestaurant(restaurant);
        
        // Close modal
        document.getElementById('restaurantModal').style.display = 'none';
        
        // Show notification
        showNotification('Restaurant Saved', `${name} has been successfully saved.`);
    });
}

// Save restaurant
function saveRestaurant(restaurant) {
    // Get restaurants from localStorage
    let restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Check if restaurant exists
    const index = restaurants.findIndex(r => r.id === restaurant.id);
    
    // Check if this is an update with price changes
    if (index !== -1) {
        // Get menu items
        let menuItems = JSON.parse(localStorage.getItem('neoFoodMenuItems') || '{}');
        
        // If menu items exist for this restaurant and delivery fee changed
        if (menuItems[restaurant.id] && restaurants[index].deliveryFee !== restaurant.deliveryFee) {
            // Update delivery fee in cart
            updateDeliveryFeeInCart(restaurant.id, parseFloat(restaurant.deliveryFee));
        }
        
        // Update existing restaurant
        restaurants[index] = restaurant;
    } else {
        // Add new restaurant
        restaurants.push(restaurant);
    }
    
    // Save to localStorage
    localStorage.setItem('neoFoodRestaurants', JSON.stringify(restaurants));
    
    // Reload restaurants
    loadRestaurants();
}

// Update delivery fee in cart
function updateDeliveryFeeInCart(restaurantId, newFee) {
    // Get cart
    let cart = JSON.parse(localStorage.getItem('neoFoodCart') || '[]');
    
    // Check if any items from this restaurant are in the cart
    const hasRestaurantItems = cart.some(item => item.restaurantId === restaurantId);
    
    if (hasRestaurantItems) {
        // Update delivery fee in localStorage
        localStorage.setItem('neoFoodDeliveryFee', newFee.toFixed(2));
        
        // Show notification
        showNotification('Price Updated', 'Delivery fee has been updated in your cart.');
    }
}

// Delete restaurant
function deleteRestaurant(id) {
    // Get restaurants from localStorage
    let restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Filter out deleted restaurant
    restaurants = restaurants.filter(r => r.id !== id);
    
    // Save to localStorage
    localStorage.setItem('neoFoodRestaurants', JSON.stringify(restaurants));
    
    // Reload restaurants
    loadRestaurants();
    
    // Show notification
    showNotification('Restaurant Deleted', 'The restaurant has been deleted.');
}

// Load users
function loadUsers() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Clear loading spinner
    usersList.innerHTML = '';
    
    // Add users
    if (users.length === 0) {
        usersList.innerHTML = '<div class="no-data">No users registered yet</div>';
    } else {
        users.forEach(user => {
            // Skip admin users
            if (user.isAdmin) return;
            
            const userCard = document.createElement('div');
            userCard.className = 'user-card glass';
            userCard.innerHTML = `
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
                <div class="user-actions">
                    <button class="view-btn" data-id="${user.id}">View Details</button>
                    <button class="suspend-btn" data-id="${user.id}">${user.suspended ? 'Activate' : 'Suspend'}</button>
                </div>
            `;
            usersList.appendChild(userCard);
            
            // Add event listeners
            const viewBtn = userCard.querySelector('.view-btn');
            const suspendBtn = userCard.querySelector('.suspend-btn');
            
            viewBtn.addEventListener('click', () => {
                openUserDetailModal(user);
            });
            
            suspendBtn.addEventListener('click', () => {
                toggleUserSuspension(user);
            });
        });
    }
    
    // Update user count
    document.getElementById('totalUsers').textContent = users.filter(u => !u.isAdmin).length;
}

// Open user detail modal
function openUserDetailModal(user) {
    const modal = document.getElementById('userDetailModal');
    const content = document.getElementById('userDetailContent');
    
    // Get user orders
    const orders = JSON.parse(localStorage.getItem('neoFoodOrderHistory') || '[]')
        .filter(order => order.customerId === user.id);
    
    // Format user details
    content.innerHTML = `
        <div class="user-detail-group">
            <label>Name</label>
            <p>${user.name}</p>
        </div>
        <div class="user-detail-group">
            <label>Email</label>
            <p>${user.email}</p>
        </div>
        <div class="user-detail-group">
            <label>Account Status</label>
            <p>${user.suspended ? 'Suspended' : 'Active'}</p>
        </div>
        <div class="user-detail-group">
            <label>Registration Date</label>
            <p>${new Date(user.registrationDate || Date.now()).toLocaleDateString()}</p>
        </div>
        
        <div class="user-orders">
            <h4>Order History (${orders.length})</h4>
            ${orders.length === 0 ? '<p>No orders yet</p>' : ''}
            ${orders.map(order => `
                <div class="user-order-item">
                    <p class="order-id">Order #${order.orderNumber}</p>
                    <p>Date: ${new Date(order.timestamp).toLocaleDateString()}</p>
                    <p>Total: $${parseFloat(order.total.replace('$', '')).toFixed(2)}</p>
                    <p>Status: <span class="order-status ${order.status}">${order.status}</span></p>
                </div>
            `).join('')}
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Toggle user suspension
function toggleUserSuspension(user) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('neoFoodUsers') || '[]');
    
    // Find user
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
        // Toggle suspension
        users[index].suspended = !users[index].suspended;
        
        // Save to localStorage
        localStorage.setItem('neoFoodUsers', JSON.stringify(users));
        
        // Reload users
        loadUsers();
        
        // Show notification
        const status = users[index].suspended ? 'suspended' : 'activated';
        showNotification('User Status Updated', `${user.name}'s account has been ${status}.`);
    }
}

// Setup real-time notifications for order status changes
function setupNotifications() {
    // Override the original order status update function
    window.updateOrderStatus = function(orderId, newStatus) {
        // Get orders from localStorage
        let orders = JSON.parse(localStorage.getItem('neoFoodOrderHistory') || '[]');
        
        // Find order
        const index = orders.findIndex(o => o.id === orderId);
        
        if (index !== -1) {
            // Update status
            orders[index].status = newStatus;
            
            // Save to localStorage
            localStorage.setItem('neoFoodOrderHistory', JSON.stringify(orders));
            
            // Get customer
            const customerId = orders[index].customerId;
            
            // Send notification to customer
            sendCustomerNotification(customerId, {
                title: 'Order Status Updated',
                message: `Your order #${orders[index].orderNumber} is now ${newStatus}.`,
                orderId: orderId,
                status: newStatus
            });
            
            // Show admin notification
            showNotification('Order Updated', `Order #${orders[index].orderNumber} is now ${newStatus}.`);
            
            return true;
        }
        
        return false;
    };
}

// Send notification to customer
function sendCustomerNotification(customerId, notification) {
    // In a real app, this would use WebSockets or server-sent events
    // For this demo, we'll store notifications in localStorage
    
    // Get customer notifications
    let notifications = JSON.parse(localStorage.getItem(`neoFoodNotifications_${customerId}`) || '[]');
    
    // Add new notification
    notifications.push({
        ...notification,
        timestamp: Date.now(),
        read: false
    });
    
    // Save to localStorage
    localStorage.setItem(`neoFoodNotifications_${customerId}`, JSON.stringify(notifications));
}

// Show notification
function showNotification(title, message) {
    const container = document.getElementById('notificationContainer');
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}