// Stock Management Module


// Load Products into Dropdown

function loadStockProducts() {

    const products = getProducts();

    const dropdown = document.getElementById("stockProduct");

    dropdown.innerHTML = '<option value="">Choose Product</option>';

    products.forEach(product => {

        const option = document.createElement("option");

        option.value = product.id;

        option.textContent = product.name;

        dropdown.appendChild(option);

    });

}


// Update Stock Statistics

function updateStockStatistics() {

    const products = getProducts();

    const totalProducts = products.length;

    const totalStock = products.reduce(
        (sum, product) => sum + Number(product.quantity), 0
    );

    const stockValue = products.reduce(
        (sum, product) =>
            sum + (Number(product.price) * Number(product.quantity)), 0
    );

    document.getElementById("totalProducts").textContent = totalProducts;

    document.getElementById("totalStock").textContent = totalStock;

    document.getElementById("stockValue").textContent =
        "₹" + stockValue.toLocaleString("en-IN");

}


// Get Stock History

function getStockHistory() {

    return JSON.parse(
        localStorage.getItem("stockHistory")
    ) || [];

}


// Save Stock History

function saveStockHistory(history) {

    localStorage.setItem(
        "stockHistory",
        JSON.stringify(history)
    );

}


// Update Stock

document.getElementById("stockForm").addEventListener(
    "submit", function(event) {

        event.preventDefault();

        const productId = Number(
            document.getElementById("stockProduct").value
        );

        const quantity = Number(
            document.getElementById("stockQuantity").value
        );

        const type = document.getElementById("stockType").value;

        const notes = document.getElementById("stockNotes").value.trim();

        if (!Number.isSafeInteger(productId) ||
            !Number.isSafeInteger(quantity) || quantity <= 0) {

            alert("Please select a product and enter a valid quantity.");

            return;

        }

        const products = getProducts();

        const product = products.find(p => p.id === productId);

        if (!product) {

            alert("Product not found!");

            return;

        }


        const previousBalance = Number(product.quantity);


        // Stock In

        if (type === "IN") {

            if (previousBalance + quantity > Number.MAX_SAFE_INTEGER) {

                alert("Quantity exceeds the allowed limit.");

                return;

            }

            product.quantity = previousBalance + quantity;

        }


        // Stock Out

        else {

            if (quantity > previousBalance) {

                alert("Insufficient stock! Available quantity: " +
                    previousBalance);

                return;

            }

            product.quantity = previousBalance - quantity;

        }


        // Save Updated Products

        saveProducts(products);


        // Save Transaction History

        const history = getStockHistory();

        history.unshift({

            id: Date.now(),

            date: new Date().toLocaleString(),

            productName: product.name,

            type: type,

            quantity: quantity,

            notes: notes || "-",

            balance: product.quantity

        });

        saveStockHistory(history);


        alert("Stock updated successfully!");


        document.getElementById("stockForm").reset();


        loadStockProducts();

        updateStockStatistics();

        displayStockHistory();

    }

);


// Display Stock History

function displayStockHistory() {

    const history = getStockHistory();

    const table = document.getElementById("stockHistory");

    table.innerHTML = "";


    if (history.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No stock transactions available.
                </td>
            </tr>
        `;

        return;

    }


    history.forEach(item => {

        const row = document.createElement("tr");

        const values = [
            item.date,
            item.productName,
            item.type,
            item.quantity,
            item.notes,
            item.balance
        ];

        values.forEach((value, index) => {

            const cell = document.createElement("td");

            cell.textContent = value;

            if (index === 2) {

                cell.className =
                    item.type === "IN" ? "in-label" : "out-label";

            }

            row.appendChild(cell);

        });

        table.appendChild(row);

    });

}


// Initialize Stock Management

document.addEventListener("DOMContentLoaded", function() {

    loadStockProducts();

    updateStockStatistics();

    displayStockHistory();

});