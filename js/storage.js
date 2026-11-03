// ========================================
// STOCKSMART - LOCAL STORAGE MANAGEMENT
// ========================================

// Default Inventory Data

const defaultProducts = [
    {
        id: 1,
        name: "Laptop",
        category: "Electronics",
        price: 55000,
        quantity: 25,
        supplier: "Dell"
    },
    {
        id: 2,
        name: "Wireless Mouse",
        category: "Accessories",
        price: 800,
        quantity: 8,
        supplier: "HP"
    },
    {
        id: 3,
        name: "Keyboard",
        category: "Accessories",
        price: 1200,
        quantity: 0,
        supplier: "Logitech"
    },
    {
        id: 4,
        name: "Monitor",
        category: "Electronics",
        price: 12000,
        quantity: 15,
        supplier: "Samsung"
    },
    {
        id: 5,
        name: "Printer",
        category: "Electronics",
        price: 8500,
        quantity: 4,
        supplier: "Canon"
    }
];


// ========================================
// INITIALIZE LOCAL STORAGE
// ========================================

function initializeStorage() {

    try {

        const storedProducts = localStorage.getItem("products");

        if (storedProducts === null) {

            localStorage.setItem(
                "products",
                JSON.stringify(defaultProducts)
            );

        } else {

            const parsedProducts = JSON.parse(storedProducts);

            if (!Array.isArray(parsedProducts)) {

                localStorage.setItem(
                    "products",
                    JSON.stringify(defaultProducts)
                );

            }

        }

    } catch (error) {

        console.error("Storage initialization error:", error);

        localStorage.setItem(
            "products",
            JSON.stringify(defaultProducts)
        );

    }

}


// ========================================
// GET PRODUCTS
// ========================================

function getProducts() {

    try {

        const products = JSON.parse(
            localStorage.getItem("products")
        );

        return Array.isArray(products) ? products : [];

    } catch (error) {

        console.error("Error loading products:", error);

        return [];

    }

}


// ========================================
// SAVE PRODUCTS
// ========================================

function saveProducts(products) {

    if (!Array.isArray(products)) {

        console.error("Invalid product data.");

        return false;

    }

    try {

        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );

        return true;

    } catch (error) {

        console.error("Error saving products:", error);

        alert("Unable to save inventory data.");

        return false;

    }

}


// ========================================
// INITIALIZE APPLICATION
// ========================================

initializeStorage();