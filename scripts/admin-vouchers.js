// Admin voucher management
document.addEventListener('DOMContentLoaded', () => {
    // Add voucher management tab if not exists
    addVoucherTab();
});

// Add voucher management tab
function addVoucherTab() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // Check if voucher tab already exists
    if (navLinks.querySelector('[data-section="vouchers"]')) return;
    
    // Create voucher tab
    const voucherLink = document.createElement('a');
    voucherLink.href = '#';
    voucherLink.className = 'nav-link';
    voucherLink.setAttribute('data-section', 'vouchers');
    voucherLink.textContent = 'Vouchers';
    
    // Insert before logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        navLinks.insertBefore(voucherLink, logoutBtn);
    } else {
        navLinks.appendChild(voucherLink);
    }
    
    // Create voucher section
    createVoucherSection();
}

// Create voucher section
function createVoucherSection() {
    // Check if section already exists
    if (document.getElementById('vouchers-section')) return;
    
    // Create section
    const section = document.createElement('section');
    section.className = 'admin-section';
    section.id = 'vouchers-section';
    
    section.innerHTML = `
        <div class="admin-container">
            <div class="admin-header">
                <h1>Voucher Management</h1>
                <button class="add-btn glass" id="addVoucherBtn">+ Add Voucher</button>
            </div>
            
            <div class="vouchers-list" id="vouchersList">
                <!-- Vouchers will be loaded here -->
                <div class="loading-spinner">Loading vouchers...</div>
            </div>
        </div>
    `;
    
    // Add to page
    const lastSection = document.querySelector('.admin-section:last-of-type');
    if (lastSection) {
        lastSection.parentNode.insertBefore(section, lastSection.nextSibling);
    } else {
        document.querySelector('footer').parentNode.insertBefore(section, document.querySelector('footer'));
    }
    
    // Create voucher modal
    createVoucherModal();
    
    // Load vouchers
    loadVouchers();
    
    // Add event listener to add voucher button
    document.getElementById('addVoucherBtn').addEventListener('click', openVoucherModal);
}

// Create voucher modal
function createVoucherModal() {
    // Check if modal already exists
    if (document.getElementById('voucherModal')) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'voucherModal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="modal-content glass">
            <button class="close-modal">&times;</button>
            <h2>Create Voucher</h2>
            <form class="voucher-form" id="voucherForm">
                <div class="input-group">
                    <label for="voucherCode">Voucher Code</label>
                    <input type="text" id="voucherCode" placeholder="NEOFOOD20" required>
                </div>
                <div class="input-group">
                    <label for="voucherType">Voucher Type</label>
                    <select id="voucherType" required>
                        <option value="percent">Percentage Discount</option>
                        <option value="fixed">Fixed Amount Discount</option>
                        <option value="free">Free Delivery</option>
                    </select>
                </div>
                <div class="input-group" id="percentValueGroup">
                    <label for="percentValue">Discount Percentage (%)</label>
                    <input type="number" id="percentValue" min="1" max="100" value="20" required>
                </div>
                <div class="input-group" id="fixedValueGroup" style="display: none;">
                    <label for="fixedValue">Discount Amount ($)</label>
                    <input type="number" id="fixedValue" min="1" step="0.01" value="5" required>
                </div>
                <div class="input-group">
                    <label for="voucherDescription">Description</label>
                    <input type="text" id="voucherDescription" placeholder="20% off your order" required>
                </div>
                <div class="input-group">
                    <label for="voucherExpiry">Expiry Date</label>
                    <input type="date" id="voucherExpiry" required>
                </div>
                <div class="input-group">
                    <label for="voucherLimit">Usage Limit</label>
                    <input type="number" id="voucherLimit" min="1" value="100" required>
                </div>
                <button type="submit" id="saveVoucherBtn">Create Voucher</button>
            </form>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Toggle value fields based on voucher type
    const voucherType = document.getElementById('voucherType');
    voucherType.addEventListener('change', toggleVoucherValueFields);
    
    // Form submission
    const form = document.getElementById('voucherForm');
    form.addEventListener('submit', saveVoucher);
}

// Toggle voucher value fields
function toggleVoucherValueFields() {
    const voucherType = document.getElementById('voucherType').value;
    const percentValueGroup = document.getElementById('percentValueGroup');
    const fixedValueGroup = document.getElementById('fixedValueGroup');
    
    if (voucherType === 'percent') {
        percentValueGroup.style.display = 'block';
        fixedValueGroup.style.display = 'none';
    } else if (voucherType === 'fixed') {
        percentValueGroup.style.display = 'none';
        fixedValueGroup.style.display = 'block';
    } else {
        percentValueGroup.style.display = 'none';
        fixedValueGroup.style.display = 'none';
    }
}

// Open voucher modal
function openVoucherModal() {
    const modal = document.getElementById('voucherModal');
    if (!modal) return;
    
    // Reset form
    document.getElementById('voucherForm').reset();
    
    // Set default expiry date (1 month from now)
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    document.getElementById('voucherExpiry').value = expiry.toISOString().split('T')[0];
    
    // Show modal
    modal.style.display = 'flex';
}

// Save voucher
function saveVoucher(e) {
    e.preventDefault();
    
    // Get form values
    const code = document.getElementById('voucherCode').value;
    const type = document.getElementById('voucherType').value;
    const description = document.getElementById('voucherDescription').value;
    const expiry = document.getElementById('voucherExpiry').value;
    const limit = document.getElementById('voucherLimit').value;
    
    // Get value based on type
    let value;
    if (type === 'percent') {
        value = document.getElementById('percentValue').value;
    } else if (type === 'fixed') {
        value = document.getElementById('fixedValue').value;
    } else {
        value = 0;
    }
    
    // Create voucher object
    const voucher = {
        id: 'voucher-' + Date.now(),
        code,
        type,
        value,
        description,
        expiry,
        limit,
        used: 0,
        createdAt: new Date().toISOString()
    };
    
    // Save voucher
    let vouchers = JSON.parse(localStorage.getItem('neoFoodVouchers') || '[]');
    vouchers.push(voucher);
    localStorage.setItem('neoFoodVouchers', JSON.stringify(vouchers));
    
    // Close modal
    document.getElementById('voucherModal').style.display = 'none';
    
    // Show notification
    showAdminNotification('Voucher created successfully');
    
    // Reload vouchers
    loadVouchers();
}

// Load vouchers
function loadVouchers() {
    const vouchersList = document.getElementById('vouchersList');
    if (!vouchersList) return;
    
    // Get vouchers
    const vouchers = JSON.parse(localStorage.getItem('neoFoodVouchers') || '[]');
    
    // Clear list
    vouchersList.innerHTML = '';
    
    // Check if we have vouchers
    if (vouchers.length === 0) {
        vouchersList.innerHTML = '<div class="no-data">No vouchers available</div>';
        return;
    }
    
    // Sort vouchers by creation date (newest first)
    vouchers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Display vouchers
    vouchers.forEach(voucher => {
        const voucherCard = document.createElement('div');
        voucherCard.className = 'voucher-card glass';
        
        // Format expiry date
        const expiryDate = new Date(voucher.expiry);
        const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Format value
        let valueText;
        if (voucher.type === 'percent') {
            valueText = `${voucher.value}% off`;
        } else if (voucher.type === 'fixed') {
            valueText = `$${voucher.value} off`;
        } else {
            valueText = 'Free Delivery';
        }
        
        voucherCard.innerHTML = `
            <div class="voucher-info">
                <div class="voucher-code">${voucher.code}</div>
                <div class="voucher-description">${voucher.description}</div>
                <div class="voucher-details">
                    <span>Expires: ${formattedExpiry}</span>
                    <span>Used: ${voucher.used}/${voucher.limit}</span>
                </div>
            </div>
            <div class="voucher-value">${valueText}</div>
            <div class="voucher-actions">
                <button class="delete-btn" data-id="${voucher.id}">Delete</button>
            </div>
        `;
        
        // Add to list
        vouchersList.appendChild(voucherCard);
        
        // Add event listener to delete button
        const deleteBtn = voucherCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteVoucher(voucher.id);
        });
    });
}

// Delete voucher
function deleteVoucher(id) {
    if (confirm('Are you sure you want to delete this voucher?')) {
        // Get vouchers
        let vouchers = JSON.parse(localStorage.getItem('neoFoodVouchers') || '[]');
        
        // Remove voucher
        vouchers = vouchers.filter(v => v.id !== id);
        
        // Save vouchers
        localStorage.setItem('neoFoodVouchers', JSON.stringify(vouchers));
        
        // Show notification
        showAdminNotification('Voucher deleted successfully');
        
        // Reload vouchers
        loadVouchers();
    }
}