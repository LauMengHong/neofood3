// Restaurant 1 data for cart system
const currentRestaurant = {
    name: "Cyber Sushi",
    cuisine: "Japanese",
    rating: 4.8
};

// Define menu items for the cart system
function findItemById(itemId) {
    const menuItems = {
        101: {
            id: 101,
            name: "Neon Dragon Roll",
            price: 18.99,
            description: "Spicy tuna, avocado, topped with eel and neon sauce"
        },
        102: {
            id: 102,
            name: "Cyber Rainbow Roll",
            price: 16.99,
            description: "California roll topped with assorted sashimi"
        }
    };
    
    return menuItems[itemId];
}

// Override the original addToCart functions
function addToCart1() {
    addToCart(101, 1);
}

function addToCart2() {
    addToCart(102, 1);
}

// Make functions global
window.addToCart1 = addToCart1;
window.addToCart2 = addToCart2;
window.findItemById = findItemById;