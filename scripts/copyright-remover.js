// Remove copyright footer from all pages except home.html
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is not home.html
    if (!window.location.pathname.includes('home.html')) {
        // Find and remove copyright footer
        const copyrightFooter = document.querySelector('.copyright-footer');
        if (copyrightFooter) {
            copyrightFooter.remove();
        }
    }
});