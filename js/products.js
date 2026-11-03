// ========================================
// STOCKSMART - PRODUCT MANAGEMENT
// ========================================

let editingProductId = null;


// Get Products
function getProductList() {
    return getProducts();
}


// Escape HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


// Show Product Form
function showForm() {

    document.getElementById("productForm").style.display = "block";

    document.getElementById("formTitle").textContent =
        editingProductId === null
            ? "Add New Product"
            : "Edit Product";

}


// Hide Product Form
function hideForm() {

    const form = document.getElementById("addProductForm");

    if (form) {
        form.reset();
    }

    document.getElementById("productForm").style.display = "none";

    editingProductId = null;

    document.getElementById("formTitle").textContent =
        "Add New Product";

}


// Display Products
function displayProducts() {

    const products = getProductList();

    const table = document.getElementById("productTableBody");

    if (!table) return;

    const searchInput =
        document.getElementById("searchInput") ||
        document.getElementById("productSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const category = categoryFilter
        ? categoryFilter.value
        : "";

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            String(product.name).toLowerCase().includes(search) ||
            String(product.supplier).toLowerCase().includes(search);

        const matchesCategory =
            category === "" ||
            category === "all" ||
            product.category === category;

        return matchesSearch && matchesCategory;

    });


    table.innerHTML = "";


    if (filteredProducts.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No products found.
                </td>
            </tr>
        `;

        return;
    }


    filteredProducts.forEach(product => {

        const quantity = Number(product.quantity);

        let status = "Available";
        let statusClass = "available";

        if (quantity === 0) {

            status = "Out of Stock";
            statusClass = "out";

        } else if (quantity <= 5) {

            status = "Low Stock";
            statusClass = "low";

        }


        const row = document.createElement("tr");


        const values = [

            product.id,
            product.name,
            product.category,
            "₹" + Number(product.price).toLocaleString("en-IN"),
            quantity,
            product.supplier

        ];


        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });


        // Status
        const statusCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className = `status ${statusClass}`;

        badge.textContent = status;

        statusCell.appendChild(badge);

        row.appendChild(statusCell);


        // Actions
        const actionCell = document.createElement("td");


        const editButton = document.createElement("button");

        editButton.className = "action-btn edit-btn";

        editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';

        editButton.addEventListener("click", () => {
            editProduct(product.id);
        });


        const deleteButton = document.createElement("button");

        deleteButton.className = "action-btn delete-btn";

        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });


        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        table.appendChild(row);

    });

}


// Add / Update Product
function handleProductSubmit(event) {

    event.preventDefault();


    const name = document.getElementById("productName").value.trim();

    const category = document.getElementById("category").value;

    const price = Number(document.getElementById("price").value);

    const quantity = Number(document.getElementById("quantity").value);

    const supplier = document.getElementById("supplier").value.trim();


    if (
        !name ||
        !category ||
        !supplier ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {

        alert("Please enter valid product details.");

        return;
    }


    const products = getProductList();


    if (editingProductId !== null) {

        const index = products.findIndex(
            p => String(p.id) === String(editingProductId)
        );

        if (index !== -1) {

            products[index] = {

                ...products[index],

                name,
                category,
                price,
                quantity,
                supplier

            };

        }

    } else {

        const newProduct = {

            id: Date.now(),

            name,
            category,
            price,
            quantity,
            supplier

        };

        products.push(newProduct);

    }


    saveProducts(products);


    displayProducts();

    updateProductStatistics();

    hideForm();


    alert(
        editingProductId === null
            ? "Product added successfully!"
            : "Product updated successfully!"
    );

}


// Edit Product
function editProduct(id) {

    const products = getProductList();

    const product = products.find(
        p => String(p.id) === String(id)
    );

    if (!product) return;


    editingProductId = product.id;


    document.getElementById("productName").value = product.name;

    document.getElementById("category").value = product.category;

    document.getElementById("price").value = product.price;

    document.getElementById("quantity").value = product.quantity;

    document.getElementById("supplier").value = product.supplier;


    document.getElementById("formTitle").textContent =
        "Edit Product";


    showForm();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete Product
function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }


    const products = getProductList();

    const updatedProducts = products.filter(
        product => String(product.id) !== String(id)
    );


    saveProducts(updatedProducts);

    displayProducts();

    updateProductStatistics();


    alert("Product deleted successfully!");

}


// Product Statistics
function updateProductStatistics() {

    const products = getProductList();


    const total = products.length;

    const totalStock = products.reduce(
        (sum, product) => sum + Number(product.quantity),
        0
    );

    const totalValue = products.reduce(
        (sum, product) =>
            sum + Number(product.price) * Number(product.quantity),
        0
    );


    const totalElement = document.getElementById("totalProducts");

    if (totalElement) {
        totalElement.textContent = total;
    }


    const stockElement = document.getElementById("totalStock");

    if (stockElement) {
        stockElement.textContent = totalStock;
    }


    const valueElement = document.getElementById("totalStockValue");

    if (valueElement) {
        valueElement.textContent =
            "₹" + totalValue.toLocaleString("en-IN");
    }

}


// Initialize Product Management
document.addEventListener("DOMContentLoaded", function () {


    // Add Product Form
    const form = document.getElementById("addProductForm");

    if (form) {

        form.addEventListener(
            "submit",
            handleProductSubmit
        );

    }


    // Search
    const searchInput =
        document.getElementById("searchInput") ||
        document.getElementById("productSearch");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            displayProducts
        );

    }


    // Category Filter
    const categoryFilter =
        document.getElementById("categoryFilter");

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            displayProducts
        );

    }


    // Initial Display
    displayProducts();

    updateProductStatistics();

});