// Admin Menu Management
document.addEventListener('DOMContentLoaded', () => {
    // Add menu management tab if not already present
    addMenuManagementTab();
    
    // Setup menu item form
    setupMenuItemForm();
});

// Add menu management tab
function addMenuManagementTab() {
    const navLinks = document.querySelector('.nav-links');
    
    // Check if menu tab already exists
    if (!document.querySelector('[data-section="menu"]')) {
        // Create menu tab
        const menuTab = document.createElement('a');
        menuTab.href = '#';
        menuTab.className = 'nav-link';
        menuTab.setAttribute('data-section', 'menu');
        menuTab.textContent = 'Menu Items';
        
        // Insert before logout button
        const logoutBtn = document.getElementById('logoutBtn');
        navLinks.insertBefore(menuTab, logoutBtn);
        
        // Create menu section
        const menuSection = document.createElement('section');
        menuSection.className = 'admin-section';
        menuSection.id = 'menu-section';
        menuSection.innerHTML = `
            <div class="admin-container">
                <div class="admin-header">
                    <h1>Menu Management</h1>
                    <div class="admin-actions">
                        <button class="add-btn glass" id="addMenuItemBtn">+ Add Menu Item</button>
                    </div>
                </div>
                
                <div class="restaurant-selector">
                    <label for="menuRestaurantSelect">Select Restaurant:</label>
                    <select id="menuRestaurantSelect">
                        <option value="">All Restaurants</option>
                    </select>
                </div>
                
                <div class="menu-items-list" id="menuItemsList">
                    <div class="loading-spinner">Loading menu items...</div>
                </div>
            </div>
        `;
        
        // Add to document
        document.querySelector('.admin-section').parentNode.appendChild(menuSection);
        
        // Add event listener
        menuTab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get all tabs and sections
            const tabs = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('.admin-section');
            
            // Remove active class
            tabs.forEach(tab => tab.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class
            menuTab.classList.add('active');
            menuSection.classList.add('active');
            
            // Load menu items
            loadMenuItems();
        });
    }
}

// Load menu items
function loadMenuItems(restaurantId = '') {
    const menuItemsList = document.getElementById('menuItemsList');
    if (!menuItemsList) return;
    
    // Get menu items
    const menuItems = JSON.parse(localStorage.getItem('neoFoodMenuItems') || '{}');
    
    // Get restaurants
    const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Populate restaurant selector
    const restaurantSelect = document.getElementById('menuRestaurantSelect');
    if (restaurantSelect) {
        // Clear existing options except the first one
        while (restaurantSelect.options.length > 1) {
            restaurantSelect.remove(1);
        }
        
        // Add restaurant options
        restaurants.forEach(restaurant => {
            const option = document.createElement('option');
            option.value = restaurant.id;
            option.textContent = restaurant.name;
            restaurantSelect.appendChild(option);
        });
        
        // Set selected restaurant
        if (restaurantId) {
            restaurantSelect.value = restaurantId;
        }
        
        // Add event listener
        restaurantSelect.addEventListener('change', () => {
            loadMenuItems(restaurantSelect.value);
        });
    }
    
    // Clear menu items list
    menuItemsList.innerHTML = '';
    
    // Filter menu items by restaurant
    let filteredItems = [];
    if (restaurantId) {
        // Show items for selected restaurant
        filteredItems = menuItems[restaurantId] || [];
    } else {
        // Show all items
        Object.keys(menuItems).forEach(restId => {
            const restaurant = restaurants.find(r => r.id === restId);
            if (restaurant) {
                menuItems[restId].forEach(item => {
                    filteredItems.push({
                        ...item,
                        restaurantName: restaurant.name
                    });
                });
            }
        });
    }
    
    // Display menu items
    if (filteredItems.length === 0) {
        menuItemsList.innerHTML = '<div class="no-data">No menu items found</div>';
    } else {
        filteredItems.forEach(item => {
            const menuItemCard = document.createElement('div');
            menuItemCard.className = 'menu-item-card glass';
            menuItemCard.innerHTML = `
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    ${item.restaurantName ? `<p class="restaurant-name">${item.restaurantName}</p>` : ''}
                    <p class="item-description">${item.description}</p>
                </div>
                <div class="menu-item-price">
                    <div class="price-display">$${item.price.toFixed(2)}</div>
                    <div class="price-edit">
                        <input type="number" class="price-input" value="${item.price.toFixed(2)}" min="0" step="0.01">
                        <button class="save-price-btn" data-item-id="${item.id}" data-restaurant-id="${item.restaurantId || restaurantId}">Update</button>
                    </div>
                </div>
            `;
            menuItemsList.appendChild(menuItemCard);
            
            // Add event listener to save price button
            const saveBtn = menuItemCard.querySelector('.save-price-btn');
            saveBtn.addEventListener('click', () => {
                const priceInput = menuItemCard.querySelector('.price-input');
                const newPrice = parseFloat(priceInput.value);
                
                if (newPrice >= 0) {
                    // Update price
                    updateMenuItemPrice(saveBtn.dataset.restaurantId, saveBtn.dataset.itemId, newPrice);
                    
                    // Update display
                    menuItemCard.querySelector('.price-display').textContent = `$${newPrice.toFixed(2)}`;
                    
                    // Show notification
                    showNotification('Price Updated', `${item.name} price has been updated to $${newPrice.toFixed(2)}.`);
                }
            });
        });
    }
    
    // Add menu item button
    const addMenuItemBtn = document.getElementById('addMenuItemBtn');
    if (addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', () => {
            openMenuItemModal();
        });
    }
}

// Open menu item modal
function openMenuItemModal(menuItem = null) {
    // Check if modal exists
    let modal = document.getElementById('menuItemModal');
    
    // Create modal if it doesn't exist
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'menuItemModal';
        modal.innerHTML = `
            <div class="modal-content glass">
                <button class="close-modal">&times;</button>
                <h2 id="menuItemModalTitle">Add Menu Item</h2>
                <form class="menu-item-form" id="menuItemForm">
                    <div class="input-group">
                        <label for="menuItemRestaurant">Restaurant</label>
                        <select id="menuItemRestaurant" required>
                            <!-- Restaurants will be loaded here -->
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="menuItemName">Item Name</label>
                        <input type="text" id="menuItemName" required>
                    </div>
                    <div class="input-group">
                        <label for="menuItemDescription">Description</label>
                        <textarea id="menuItemDescription" required></textarea>
                    </div>
                    <div class="input-group">
                        <label for="menuItemPrice">Price ($)</label>
                        <input type="number" id="menuItemPrice" min="0" step="0.01" required>
                    </div>
                    <div class="input-group">
                        <label for="menuItemCategory">Category</label>
                        <select id="menuItemCategory">
                            <option value="main">Main Course</option>
                            <option value="appetizer">Appetizer</option>
                            <option value="dessert">Dessert</option>
                            <option value="drink">Drink</option>
                        </select>
                    </div>
                    <button type="submit" id="saveMenuItemBtn">Save Menu Item</button>
                </form>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Get form
    const form = document.getElementById('menuItemForm');
    const title = document.getElementById('menuItemModalTitle');
    
    // Reset form
    form.reset();
    
    // Get restaurants
    const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Populate restaurant selector
    const restaurantSelect = document.getElementById('menuItemRestaurant');
    restaurantSelect.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const option = document.createElement('option');
        option.value = restaurant.id;
        option.textContent = restaurant.name;
        restaurantSelect.appendChild(option);
    });
    
    // Set current restaurant if available
    const currentRestaurantId = document.getElementById('menuRestaurantSelect')?.value;
    if (currentRestaurantId) {
        restaurantSelect.value = currentRestaurantId;
    }
    
    if (menuItem) {
        // Edit mode
        title.textContent = 'Edit Menu Item';
        document.getElementById('menuItemName').value = menuItem.name;
        document.getElementById('menuItemDescription').value = menuItem.description;
        document.getElementById('menuItemPrice').value = menuItem.price.toFixed(2);
        document.getElementById('menuItemCategory').value = menuItem.category || 'main';
        document.getElementById('menuItemRestaurant').value = menuItem.restaurantId;
        form.setAttribute('data-id', menuItem.id);
    } else {
        // Add mode
        title.textContent = 'Add Menu Item';
        form.removeAttribute('data-id');
    }
    
    // Show modal
    modal.style.display = 'flex';
}

// Setup menu item form
function setupMenuItemForm() {
    // Wait for form to be created
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'menuItemForm') {
            e.preventDefault();
            
            // Get form values
            const restaurantId = document.getElementById('menuItemRestaurant').value;
            const name = document.getElementById('menuItemName').value;
            const description = document.getElementById('menuItemDescription').value;
            const price = parseFloat(document.getElementById('menuItemPrice').value);
            const category = document.getElementById('menuItemCategory').value;
            
            // Get item ID if editing
            const id = e.target.getAttribute('data-id') || `item-${Date.now()}`;
            
            // Create menu item object
            const menuItem = {
                id,
                restaurantId,
                name,
                description,
                price,
                category
            };
            
            // Save menu item
            saveMenuItem(menuItem);
            
            // Close modal
            document.getElementById('menuItemModal').style.display = 'none';
        }
    });
}

// Save menu item
function saveMenuItem(menuItem) {
    // Get menu items
    let menuItems = JSON.parse(localStorage.getItem('neoFoodMenuItems') || '{}');
    
    // Initialize restaurant menu if it doesn't exist
    if (!menuItems[menuItem.restaurantId]) {
        menuItems[menuItem.restaurantId] = [];
    }
    
    // Check if menu item exists
    const index = menuItems[menuItem.restaurantId].findIndex(item => item.id === menuItem.id);
    
    if (index !== -1) {
        // Update existing menu item
        menuItems[menuItem.restaurantId][index] = menuItem;
    } else {
        // Add new menu item
        menuItems[menuItem.restaurantId].push(menuItem);
    }
    
    // Save to localStorage
    localStorage.setItem('neoFoodMenuItems', JSON.stringify(menuItems));
    
    // Reload menu items
    loadMenuItems(menuItem.restaurantId);
    
    // Show notification
    showNotification('Menu Item Saved', `${menuItem.name} has been successfully saved.`);
}