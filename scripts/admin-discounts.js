// Admin Discount Management
document.addEventListener('DOMContentLoaded', () => {
    // Initialize discount functionality
    initDiscounts();
    
    // Set today's date as minimum for date inputs
    setMinDates();
});

// Initialize discount functionality
function initDiscounts() {
    // Add discount button
    const addDiscountBtn = document.getElementById('addDiscountBtn');
    if (addDiscountBtn) {
        addDiscountBtn.addEventListener('click', openDiscountModal);
    }
    
    // Discount form
    const discountForm = document.getElementById('discountForm');
    if (discountForm) {
        discountForm.addEventListener('submit', saveDiscount);
        
        // Discount type change
        const discountType = document.getElementById('discountType');
        if (discountType) {
            discountType.addEventListener('change', toggleRestaurantSelect);
        }
    }
    
    // Load active discounts
    loadActiveDiscounts();
    
    // Load restaurants for discount modal
    loadRestaurantsForDiscount();
}

// Open discount modal
function openDiscountModal() {
    const modal = document.getElementById('discountModal');
    if (!modal) return;
    
    // Reset form
    const form = document.getElementById('discountForm');
    if (form) form.reset();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const startDateInput = document.getElementById('discountStartDate');
    const endDateInput = document.getElementById('discountEndDate');
    
    if (startDateInput) startDateInput.value = today;
    if (endDateInput) endDateInput.value = nextMonth.toISOString().split('T')[0];
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Initialize restaurant select visibility
    toggleRestaurantSelect();
}

// Toggle restaurant select based on discount type
function toggleRestaurantSelect() {
    const discountType = document.getElementById('discountType');
    const restaurantSelectGroup = document.getElementById('restaurantSelectGroup');
    
    if (!discountType || !restaurantSelectGroup) return;
    
    if (discountType.value === 'restaurant') {
        restaurantSelectGroup.style.display = 'block';
    } else {
        restaurantSelectGroup.style.display = 'none';
    }
}

// Save discount
function saveDiscount(e) {
    e.preventDefault();
    
    // Get form values
    const type = document.getElementById('discountType').value;
    const name = document.getElementById('discountName').value;
    const percentage = document.getElementById('discountPercentage').value;
    const startDate = document.getElementById('discountStartDate').value;
    const endDate = document.getElementById('discountEndDate').value;
    const description = document.getElementById('discountDescription').value;
    
    // Get restaurant if applicable
    let restaurantId = null;
    let restaurantName = null;
    
    if (type === 'restaurant') {
        const restaurantSelect = document.getElementById('discountRestaurant');
        if (restaurantSelect) {
            restaurantId = restaurantSelect.value;
            restaurantName = restaurantSelect.options[restaurantSelect.selectedIndex].text;
        }
    }
    
    // Create discount object
    const discount = {
        id: `discount-${Date.now()}`,
        type,
        name,
        percentage,
        startDate,
        endDate,
        description,
        restaurantId,
        restaurantName,
        createdAt: new Date().toISOString()
    };
    
    // Save discount
    let discounts = JSON.parse(localStorage.getItem('neoFoodDiscounts') || '[]');
    discounts.push(discount);
    localStorage.setItem('neoFoodDiscounts', JSON.stringify(discounts));
    
    // Close modal
    const modal = document.getElementById('discountModal');
    if (modal) modal.style.display = 'none';
    
    // Show notification
    showNotification('Discount Created', `${name} discount has been created successfully.`);
    
    // Reload discounts
    loadActiveDiscounts();
}

// Load active discounts
function loadActiveDiscounts() {
    const discountsContainer = document.getElementById('activeDiscounts');
    if (!discountsContainer) return;
    
    // Get discounts
    const discounts = JSON.parse(localStorage.getItem('neoFoodDiscounts') || '[]');
    
    // Filter active discounts
    const today = new Date().toISOString().split('T')[0];
    const activeDiscounts = discounts.filter(discount => 
        discount.startDate <= today && discount.endDate >= today
    );
    
    // Clear container
    discountsContainer.innerHTML = '';
    
    // Add discounts
    if (activeDiscounts.length === 0) {
        discountsContainer.style.display = 'none';
    } else {
        discountsContainer.style.display = 'block';
        
        activeDiscounts.forEach(discount => {
            const discountElement = document.createElement('div');
            discountElement.className = 'discount-banner glass';
            discountElement.innerHTML = `
                <div class="discount-info">
                    <div class="discount-title">${discount.name}</div>
                    <div class="discount-details">
                        ${discount.type === 'global' ? 'All restaurants' : `Restaurant: ${discount.restaurantName}`} • 
                        Valid until ${formatDate(discount.endDate)}
                    </div>
                </div>
                <div class="discount-percentage">-${discount.percentage}%</div>
                <div class="discount-actions">
                    <button class="remove-discount-btn" data-id="${discount.id}">Remove</button>
                </div>
            `;
            discountsContainer.appendChild(discountElement);
            
            // Add event listener to remove button
            const removeBtn = discountElement.querySelector('.remove-discount-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    removeDiscount(discount.id);
                });
            }
        });
    }
    
    // Update restaurant cards to show discounts
    updateRestaurantDiscounts(activeDiscounts);
}

// Update restaurant cards to show discounts
function updateRestaurantDiscounts(activeDiscounts) {
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
    restaurantCards.forEach(card => {
        // Remove existing discount badges
        const existingBadge = card.querySelector('.restaurant-discount-badge');
        if (existingBadge) existingBadge.remove();
        
        // Get restaurant ID
        const restaurantId = card.querySelector('.edit-btn').getAttribute('data-id');
        
        // Find applicable discounts
        const globalDiscounts = activeDiscounts.filter(d => d.type === 'global');
        const restaurantDiscounts = activeDiscounts.filter(d => d.type === 'restaurant' && d.restaurantId === restaurantId);
        
        // Get highest discount
        const allApplicableDiscounts = [...globalDiscounts, ...restaurantDiscounts];
        if (allApplicableDiscounts.length > 0) {
            const highestDiscount = allApplicableDiscounts.reduce((max, d) => 
                parseInt(d.percentage) > parseInt(max.percentage) ? d : max
            );
            
            // Add discount badge
            const restaurantInfo = card.querySelector('.restaurant-details h3');
            if (restaurantInfo) {
                const badge = document.createElement('span');
                badge.className = 'restaurant-discount-badge';
                badge.textContent = `-${highestDiscount.percentage}%`;
                restaurantInfo.appendChild(badge);
            }
        }
    });
}

// Remove discount
function removeDiscount(id) {
    if (confirm('Are you sure you want to remove this discount?')) {
        // Get discounts
        let discounts = JSON.parse(localStorage.getItem('neoFoodDiscounts') || '[]');
        
        // Filter out removed discount
        discounts = discounts.filter(d => d.id !== id);
        
        // Save to localStorage
        localStorage.setItem('neoFoodDiscounts', JSON.stringify(discounts));
        
        // Show notification
        showNotification('Discount Removed', 'The discount has been removed successfully.');
        
        // Reload discounts
        loadActiveDiscounts();
    }
}

// Load restaurants for discount modal
function loadRestaurantsForDiscount() {
    const restaurantSelect = document.getElementById('discountRestaurant');
    if (!restaurantSelect) return;
    
    // Get restaurants
    const restaurants = JSON.parse(localStorage.getItem('neoFoodRestaurants') || '[]');
    
    // Clear select
    restaurantSelect.innerHTML = '';
    
    // Add restaurants
    restaurants.forEach(restaurant => {
        const option = document.createElement('option');
        option.value = restaurant.id;
        option.textContent = restaurant.name;
        restaurantSelect.appendChild(option);
    });
}

// Set minimum dates for date inputs
function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    
    const startDateInput = document.getElementById('discountStartDate');
    const endDateInput = document.getElementById('discountEndDate');
    
    if (startDateInput) startDateInput.min = today;
    if (endDateInput) endDateInput.min = today;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}