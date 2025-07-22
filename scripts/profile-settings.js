// Profile settings functionality
document.addEventListener('DOMContentLoaded', () => {
    // Setup theme selector
    setupThemeSelector();
    
    // Setup address functionality
    setupAddressManager();
    
    // Setup notification toggles
    setupNotificationToggles();
    
    // Load favorites
    loadFavorites();
});

// Theme selector functionality
function setupThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Load current theme
    const currentTheme = localStorage.getItem('neoFoodTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update active class on load
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === currentTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Add click event listeners
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Get theme
            const theme = option.getAttribute('data-theme');
            
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Save theme preference
            localStorage.setItem('neoFoodTheme', theme);
            
            // Apply theme immediately
            document.documentElement.setAttribute('data-theme', theme);
        });
    });
}

// Address manager functionality
function setupAddressManager() {
    const addAddressBtn = document.getElementById('addAddressBtn');
    if (!addAddressBtn) return;
    
    // Load saved addresses
    loadSavedAddresses();
    
    // Add new address button
    addAddressBtn.addEventListener('click', () => {
        // Create modal for adding address
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content glass">
                <button class="close-btn">&times;</button>
                <h2>Add New Address</h2>
                <form id="addressForm">
                    <div class="input-group">
                        <label>Address Name</label>
                        <input type="text" id="addressName" placeholder="Home, Work, etc." required>
                    </div>
                    <div class="input-group">
                        <label>Street Address</label>
                        <input type="text" id="streetAddress" placeholder="123 Main St" required>
                    </div>
                    <div class="input-group">
                        <label>City</label>
                        <input type="text" id="city" placeholder="City" required>
                    </div>
                    <div class="input-group">
                        <label>Delivery Instructions (Optional)</label>
                        <textarea id="instructions" placeholder="Ring doorbell twice, etc."></textarea>
                    </div>
                    <div class="input-group">
                        <label>
                            <input type="checkbox" id="defaultAddress">
                            Set as default address
                        </label>
                    </div>
                    <button type="submit" class="add-address-btn">Save Address</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button functionality
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Form submission
        const form = modal.querySelector('#addressForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('addressName').value;
            const street = document.getElementById('streetAddress').value;
            const city = document.getElementById('city').value;
            const instructions = document.getElementById('instructions').value;
            const isDefault = document.getElementById('defaultAddress').checked;
            
            // Save address
            saveAddress({
                name,
                street,
                city,
                instructions,
                isDefault
            });
            
            // Close modal
            modal.remove();
        });
    });
}

// Load saved addresses
function loadSavedAddresses() {
    const addressContainer = document.getElementById('addressContainer');
    if (!addressContainer) return;
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get saved addresses
    const addresses = JSON.parse(localStorage.getItem(`neoFoodAddresses_${currentUser.id}`) || '[]');
    
    // Clear container
    addressContainer.innerHTML = '';
    
    // Add addresses
    if (addresses.length === 0) {
        // Add default address if none exist
        addressContainer.innerHTML = `
            <div class="address-card glass default">
                <div class="address-header">
                    <div class="address-name">Home</div>
                    <div class="default-badge">Default</div>
                </div>
                <div class="address-content">
                    <div class="address-text">123 Cyber Street, Neo City</div>
                    <div class="address-instructions">Ring doorbell twice</div>
                </div>
            </div>
        `;
    } else {
        // Add saved addresses
        addresses.forEach(address => {
            addressContainer.innerHTML += `
                <div class="address-card glass ${address.isDefault ? 'default' : ''}">
                    <div class="address-header">
                        <div class="address-name">${address.name}</div>
                        ${address.isDefault ? '<div class="default-badge">Default</div>' : ''}
                    </div>
                    <div class="address-content">
                        <div class="address-text">${address.street}, ${address.city}</div>
                        ${address.instructions ? `<div class="address-instructions">${address.instructions}</div>` : ''}
                    </div>
                </div>
            `;
        });
    }
}

// Save address
function saveAddress(address) {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get saved addresses
    let addresses = JSON.parse(localStorage.getItem(`neoFoodAddresses_${currentUser.id}`) || '[]');
    
    // If this is default, remove default from others
    if (address.isDefault) {
        addresses = addresses.map(addr => ({
            ...addr,
            isDefault: false
        }));
    }
    
    // Add new address
    addresses.push(address);
    
    // Save addresses
    localStorage.setItem(`neoFoodAddresses_${currentUser.id}`, JSON.stringify(addresses));
    
    // Reload addresses
    loadSavedAddresses();
}

// Setup notification toggles
function setupNotificationToggles() {
    const toggles = document.querySelectorAll('.toggle input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            // Get current user
            const currentUser = getCurrentUser();
            if (!currentUser) return;
            
            // Get notification settings
            let settings = JSON.parse(localStorage.getItem(`neoFoodNotifications_${currentUser.id}`) || '{}');
            
            // Update setting
            const settingName = toggle.closest('.setting-item').querySelector('span').textContent;
            settings[settingName] = toggle.checked;
            
            // Save settings
            localStorage.setItem(`neoFoodNotifications_${currentUser.id}`, JSON.stringify(settings));
        });
    });
}

// Load favorites
function loadFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get favorites
    const favorites = JSON.parse(localStorage.getItem(`neoFoodFavorites_${currentUser.id}`) || '[]');
    
    // Display favorites
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="no-favorites">No favorites yet</div>';
    } else {
        favoritesGrid.innerHTML = favorites.map(favorite => `
            <div class="favorite-card glass">
                <div class="favorite-icon">${favorite.icon || '🍽️'}</div>
                <div class="favorite-info">
                    <h3>${favorite.name}</h3>
                    <p>${favorite.cuisine || 'Restaurant'}</p>
                </div>
            </div>
        `).join('');
    }
}

// Get current user
function getCurrentUser() {
    const sessionUser = JSON.parse(sessionStorage.getItem('neoFoodCurrentUser') || 'null');
    const localUser = JSON.parse(localStorage.getItem('neoFoodCurrentUser') || 'null');
    return sessionUser || localUser;
}