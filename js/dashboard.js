// ==========================================
// STOCKSMART - DASHBOARD MODULE
// ==========================================


// Get Dynamic Inventory Settings

function getDashboardSettings() {

    const defaultSettings = {
        lowStockThreshold: 5,
        recommendedStock: 20
    };

    try {

        const savedSettings = JSON.parse(
            localStorage.getItem("stockSettings") || "{}"
        );

        return {
            ...defaultSettings,
            ...savedSettings
        };

    } catch (error) {

        console.error("Settings loading error:", error);

        return defaultSettings;

    }

}


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function updateDashboard() {

    const products = getProducts();

    const settings = getDashboardSettings();

    const threshold = Number(settings.lowStockThreshold);


    const totalProducts = products.length;


    const totalStock = products.reduce(
        (total, product) =>
            total + Math.max(0, Number(product.quantity) || 0),
        0
    );


    const lowStock = products.filter(
        product =>
            Number(product.quantity) > 0 &&
            Number(product.quantity) <= threshold
    ).length;


    const outOfStock = products.filter(
        product => Number(product.quantity) === 0
    ).length;


    // Update Dashboard Cards

    const totalProductsElement =
        document.getElementById("totalProducts");

    const totalStockElement =
        document.getElementById("totalStock");

    const lowStockElement =
        document.getElementById("lowStock");

    const outOfStockElement =
        document.getElementById("outOfStock");


    if (totalProductsElement) {
        totalProductsElement.textContent = totalProducts;
    }

    if (totalStockElement) {
        totalStockElement.textContent = totalStock;
    }

    if (lowStockElement) {
        lowStockElement.textContent = lowStock;
    }

    if (outOfStockElement) {
        outOfStockElement.textContent = outOfStock;
    }

}


// ==========================================
// INVENTORY BAR CHART
// ==========================================

let inventoryChartInstance = null;


function createInventoryChart() {

    const ctx = document.getElementById("inventoryChart");

    if (!ctx) return;


    const products = getProducts();

    const categories = {};


    products.forEach(product => {

        const category = product.category || "Other";

        categories[category] =
            (categories[category] || 0) +
            (Number(product.quantity) || 0);

    });


    // Prevent Duplicate Charts

    if (inventoryChartInstance) {

        inventoryChartInstance.destroy();

    }


    inventoryChartInstance = new Chart(ctx, {

        type: "bar",

        data: {

            labels: Object.keys(categories),

            datasets: [{

                label: "Available Stock",

                data: Object.values(categories),

                backgroundColor: "#6566e9",

                borderRadius: 7,

                barThickness: 45

            }]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    enabled: true

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}


// ==========================================
// STOCK DISTRIBUTION DOUGHNUT CHART
// ==========================================

let stockChartInstance = null;


function createStockChart() {

    const ctx = document.getElementById("stockChart");

    if (!ctx) return;


    const products = getProducts();

    const settings = getDashboardSettings();

    const threshold = Number(settings.lowStockThreshold);


    const available = products.filter(

        product => Number(product.quantity) > threshold

    ).length;


    const low = products.filter(

        product =>
            Number(product.quantity) > 0 &&
            Number(product.quantity) <= threshold

    ).length;


    const unavailable = products.filter(

        product => Number(product.quantity) === 0

    ).length;


    // Prevent Duplicate Charts

    if (stockChartInstance) {

        stockChartInstance.destroy();

    }


    stockChartInstance = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Available",

                "Low Stock",

                "Out of Stock"

            ],

            datasets: [{

                data: [

                    available,

                    low,

                    unavailable

                ],

                backgroundColor: [

                    "#22a06b",

                    "#f39c12",

                    "#e74c3c"

                ],

                borderWidth: 2,

                borderColor: "#ffffff"

            }]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    updateDashboard();

    createInventoryChart();

    createStockChart();

});