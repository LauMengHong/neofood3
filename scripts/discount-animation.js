// Discount form animation enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add animation to discount modal
    enhanceDiscountModal();
});

// Enhance discount modal with animations
function enhanceDiscountModal() {
    const discountModal = document.getElementById('discountModal');
    if (!discountModal) return;
    
    // Add animation class to form fields
    const formFields = discountModal.querySelectorAll('.input-group');
    formFields.forEach((field, index) => {
        field.style.opacity = '0';
        field.style.transform = 'translateY(20px)';
        field.style.transition = `all 0.3s ease ${0.1 + index * 0.1}s`;
    });
    
    // Add animation to submit button
    const submitBtn = document.getElementById('saveDiscountBtn');
    if (submitBtn) {
        submitBtn.style.opacity = '0';
        submitBtn.style.transform = 'translateY(20px)';
        submitBtn.style.transition = 'all 0.3s ease 0.8s';
    }
    
    // Override the original openDiscountModal function
    const originalOpenModal = window.openDiscountModal;
    window.openDiscountModal = function() {
        // Call original function if it exists
        if (typeof originalOpenModal === 'function') {
            originalOpenModal();
        } else {
            // Basic functionality if original doesn't exist
            discountModal.style.display = 'flex';
        }
        
        // Animate form fields
        setTimeout(() => {
            formFields.forEach(field => {
                field.style.opacity = '1';
                field.style.transform = 'translateY(0)';
            });
            
            if (submitBtn) {
                submitBtn.style.opacity = '1';
                submitBtn.style.transform = 'translateY(0)';
            }
        }, 100);
    };
    
    // Add event listener to close button to reset animations
    const closeBtn = discountModal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Reset animations
            formFields.forEach(field => {
                field.style.opacity = '0';
                field.style.transform = 'translateY(20px)';
            });
            
            if (submitBtn) {
                submitBtn.style.opacity = '0';
                submitBtn.style.transform = 'translateY(20px)';
            }
            
            // Hide modal
            setTimeout(() => {
                discountModal.style.display = 'none';
            }, 300);
        });
    }
}