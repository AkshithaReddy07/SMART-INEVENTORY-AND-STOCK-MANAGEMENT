// =====================================
// STOCKSMART - LOW STOCK ALERT SYSTEM
// =====================================


// GET SETTINGS FROM LOCAL STORAGE

function getStockConfiguration() {

    const defaultSettings = {
        lowStockThreshold: 5,
        recommendedStock: 20
    };

    try {

        const savedSettings = JSON.parse(
            localStorage.getItem("stockSettings")
        );

        return {
            ...defaultSettings,
            ...(savedSettings || {})
        };

    } catch (error) {

        console.error("Unable to load stock settings:", error);

        return defaultSettings;

    }

}


// =====================================
// UPDATE ALERT STATISTICS
// =====================================

function updateAlertStatistics() {

    const products = getProducts();

    const settings = getStockConfiguration();

    const STOCK_THRESHOLD = Number(settings.lowStockThreshold);

    const lowStock = products.filter(
        p => Number(p.quantity) > 0 &&
             Number(p.quantity) <= STOCK_THRESHOLD
    );

    const outOfStock = products.filter(
        p => Number(p.quantity) === 0
    );

    const healthy = products.filter(
        p => Number(p.quantity) > STOCK_THRESHOLD
    );


    document.getElementById("lowStockCount").textContent =
        lowStock.length;

    document.getElementById("outStockCount").textContent =
        outOfStock.length;

    document.getElementById("healthyCount").textContent =
        healthy.length;

}


// =====================================
// DISPLAY ALERT PRODUCTS
// =====================================

function displayAlerts() {

    const products = getProducts();

    const settings = getStockConfiguration();

    const STOCK_THRESHOLD = Number(settings.lowStockThreshold);

    const RECOMMENDED_STOCK = Number(settings.recommendedStock);


    const search = document.getElementById("alertSearch")
        .value.toLowerCase();

    const filter = document.getElementById("alertFilter").value;


    // Identify products requiring attention

    let alerts = products.filter(
        p => Number(p.quantity) <= STOCK_THRESHOLD
    );


    // Search Filter

    alerts = alerts.filter(product =>
        product.name.toLowerCase().includes(search)
    );


    // Status Filter

    if (filter === "low") {

        alerts = alerts.filter(
            p => Number(p.quantity) > 0
        );

    }

    if (filter === "out") {

        alerts = alerts.filter(
            p => Number(p.quantity) === 0
        );

    }


    const table = document.getElementById("alertTableBody");

    table.innerHTML = "";


    // Empty State

    if (alerts.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 7;

        cell.className = "empty-message";

        cell.textContent = "No products require attention!";

        row.appendChild(cell);

        table.appendChild(row);

        return;

    }


    // Display Products

    alerts.forEach(product => {

        const isOutOfStock = Number(product.quantity) === 0;

        const status = isOutOfStock
            ? "Out of Stock"
            : "Low Stock";


        const row = document.createElement("tr");


        // Product Details

        const values = [

            product.id,

            product.name,

            product.category,

            product.quantity

        ];


        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });


        // Status Badge

        const statusCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className = isOutOfStock
            ? "badge out-badge"
            : "badge low-badge";

        badge.textContent = status;

        statusCell.appendChild(badge);

        row.appendChild(statusCell);


        // Recommended Stock

        const recommendedCell = document.createElement("td");

        recommendedCell.textContent = Math.max(
            0,
            RECOMMENDED_STOCK - Number(product.quantity)
        );

        row.appendChild(recommendedCell);


        // Restock Button

        const actionCell = document.createElement("td");

        const button = document.createElement("button");

        button.className = "restock-btn";

        button.textContent = "Restock";

        button.addEventListener("click", () => {

            window.location.href =
                `stock.html?productId=${encodeURIComponent(product.id)}`;

        });

        actionCell.appendChild(button);

        row.appendChild(actionCell);


        table.appendChild(row);

    });

}


// =====================================
// SEARCH FUNCTIONALITY
// =====================================

document.getElementById("alertSearch").addEventListener(
    "input",
    displayAlerts
);


// =====================================
// FILTER FUNCTIONALITY
// =====================================

document.getElementById("alertFilter").addEventListener(
    "change",
    displayAlerts
);


// =====================================
// INITIALIZE ALERT SYSTEM
// =====================================

document.addEventListener("DOMContentLoaded", function() {

    updateAlertStatistics();

    displayAlerts();

});