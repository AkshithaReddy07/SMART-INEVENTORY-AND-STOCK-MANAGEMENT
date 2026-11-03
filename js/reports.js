// ===================================
// STOCKSMART - REPORTS & ANALYTICS
// ===================================


// Get Inventory Data

function getReportProducts() {

    return getProducts().map(product => ({
        ...product,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 0
    }));

}


// ===================================
// 1. UPDATE REPORT STATISTICS
// ===================================

function updateReportStatistics() {

    const products = getReportProducts();

    const totalProducts = products.length;

    const totalStock = products.reduce(
        (sum, product) => sum + product.quantity, 0
    );

    const totalValue = products.reduce(
        (sum, product) =>
            sum + product.price * product.quantity, 0
    );

    const settings = JSON.parse(
    localStorage.getItem("stockSettings") || "{}"
);

const threshold = Number(
    settings.lowStockThreshold ?? 5
);

const lowStock = products.filter(
    product => product.quantity <= threshold
).length;


    document.getElementById("reportProducts").textContent =
        totalProducts;

    document.getElementById("reportStock").textContent =
        totalStock;

    document.getElementById("reportValue").textContent =
        "₹" + totalValue.toLocaleString("en-IN");

    document.getElementById("reportLowStock").textContent =
        lowStock;

}


// ===================================
// 2. CATEGORY-WISE STOCK CHART
// ===================================

let categoryChartInstance = null;

function createCategoryChart() {

    const products = getReportProducts();

    const categories = {};

    products.forEach(product => {

        const category = product.category || "Uncategorized";

        categories[category] =
            (categories[category] || 0) + product.quantity;

    });


    const labels = Object.keys(categories);

    const values = Object.values(categories);


    const ctx = document.getElementById("categoryChart");


    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }


    categoryChartInstance = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                label: "Stock Units",

                data: values,

                backgroundColor: [
                    "#6865ed",
                    "#22a06b",
                    "#f39c12",
                    "#e74c3c",
                    "#3498db",
                    "#9b59b6"
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


// ===================================
// 3. STOCK STATUS CHART
// ===================================

let statusChartInstance = null;

function createStatusChart() {

   const products = getReportProducts();

const settings = JSON.parse(
    localStorage.getItem("stockSettings") || "{}"
);

const threshold = Number(
    settings.lowStockThreshold ?? 5
);

const outOfStock = products.filter(
    p => p.quantity === 0
).length;

const lowStock = products.filter(
    p => p.quantity > 0 &&
         p.quantity <= threshold
).length;

const healthyStock = products.filter(
    p => p.quantity > threshold
).length;

    const ctx = document.getElementById("statusChart");


    if (statusChartInstance) {
        statusChartInstance.destroy();
    }


    statusChartInstance = new Chart(ctx, {

        type: "pie",

        data: {

            labels: [
                "Healthy Stock",
                "Low Stock",
                "Out of Stock"
            ],

            datasets: [{

                data: [
                    healthyStock,
                    lowStock,
                    outOfStock
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


// ===================================
// 4. INVENTORY VALUATION TABLE
// ===================================

function displayValuationTable() {

    const products = getReportProducts();

    const table = document.getElementById("valuationTable");

    table.innerHTML = "";


    if (products.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.textContent = "No inventory products available.";

        cell.style.textAlign = "center";

        row.appendChild(cell);

        table.appendChild(row);

        return;

    }


    products.forEach(product => {

        const row = document.createElement("tr");

        const totalValue = product.price * product.quantity;


        const values = [

            product.id,

            product.name,

            product.category,

            product.quantity,

            "₹" + product.price.toLocaleString("en-IN"),

            "₹" + totalValue.toLocaleString("en-IN")

        ];


        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });


        table.appendChild(row);

    });

}


// ===================================
// 5. DOWNLOAD INVENTORY REPORT AS CSV
// ===================================

function downloadReport() {

    const products = getReportProducts();

    if (products.length === 0) {

        alert("No inventory data available to export.");

        return;

    }


    const headers = [

        "Product ID",

        "Product Name",

        "Category",

        "Quantity",

        "Unit Price",

        "Total Value",

        "Supplier"

    ];


    const escapeCSV = value => {

        let text = String(value ?? "");

        // Prevent spreadsheet formula injection

        if (/^[\s]*[=+\-@\t\r]/.test(text)) {
            text = "'" + text;
        }

        return '"' + text.replace(/"/g, '""') + '"';

    };


    const rows = products.map(product => [

        product.id,

        product.name,

        product.category,

        product.quantity,

        product.price,

        product.price * product.quantity,

        product.supplier || ""

    ]);


    const csvContent = [

        headers,

        ...rows

    ].map(row =>

        row.map(escapeCSV).join(",")

    ).join("\r\n");


    const blob = new Blob(

        ["\uFEFF" + csvContent],

        { type: "text/csv;charset=utf-8;" }

    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "StockSmart_Inventory_Report.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


// ===================================
// 6. INITIALIZE REPORTS
// ===================================

document.addEventListener("DOMContentLoaded", function() {

    updateReportStatistics();

    createCategoryChart();

    createStatusChart();

    displayValuationTable();

});