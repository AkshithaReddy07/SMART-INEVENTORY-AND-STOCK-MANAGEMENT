let editingSupplierId = null;

// Initialize supplier storage
function initializeSupplierStorage() {
    if (localStorage.getItem("suppliers") === null) {
        localStorage.setItem("suppliers", JSON.stringify([]));
    }
}

// Get suppliers
function getSuppliers() {
    try {
        const suppliers = JSON.parse(localStorage.getItem("suppliers"));
        return Array.isArray(suppliers) ? suppliers : [];
    } catch (error) {
        console.error("Error loading suppliers:", error);
        return [];
    }
}

// Save suppliers
function saveSuppliers(suppliers) {
    try {
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        return true;
    } catch (error) {
        console.error("Error saving suppliers:", error);
        alert("Unable to save supplier details.");
        return false;
    }
}

// Show supplier form
function showSupplierForm() {
    document.getElementById("supplierForm").style.display = "block";
    document.getElementById("addSupplierForm").reset();
    editingSupplierId = null;

    document.querySelector("#supplierForm h3").textContent =
        "Add New Supplier";
}

// Hide supplier form
function hideSupplierForm() {
    document.getElementById("supplierForm").style.display = "none";
    document.getElementById("addSupplierForm").reset();
    editingSupplierId = null;
}

// Display suppliers
function displaySuppliers() {
    const suppliers = getSuppliers();

    const searchValue = document
        .getElementById("supplierSearch")
        .value.toLowerCase();

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchValue) ||
        supplier.company.toLowerCase().includes(searchValue)
    );

    const tableBody = document.getElementById("supplierTableBody");
    tableBody.innerHTML = "";

    if (filteredSuppliers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No suppliers found
                </td>
            </tr>
        `;
    } else {
        filteredSuppliers.forEach((supplier, index) => {
            const row = document.createElement("tr");

            const values = [
                index + 1,
                supplier.name,
                supplier.company,
                supplier.phone,
                supplier.email
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "btn btn-primary";
            editButton.addEventListener("click", () => {
                editSupplier(supplier.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "btn btn-danger";
            deleteButton.style.marginLeft = "5px";
            deleteButton.addEventListener("click", () => {
                deleteSupplier(supplier.id);
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    updateSupplierStatistics();
}

// Add or update supplier
function handleSupplierSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("supplierName").value.trim();
    const company = document.getElementById("companyName").value.trim();
    const phone = document.getElementById("supplierPhone").value.trim();
    const email = document.getElementById("supplierEmail").value.trim();
    const address = document.getElementById("supplierAddress").value.trim();

    if (!name || !company || !phone || !email || !address) {
        alert("Please fill in all supplier details.");
        return;
    }

    const suppliers = getSuppliers();

    const duplicatePhone = suppliers.some(supplier =>
        supplier.phone === phone &&
        supplier.id !== editingSupplierId
    );

    if (duplicatePhone) {
        alert("A supplier with this phone number already exists.");
        return;
    }

    if (editingSupplierId !== null) {
        const index = suppliers.findIndex(
            supplier => supplier.id === editingSupplierId
        );

        if (index !== -1) {
            suppliers[index] = {
                ...suppliers[index],
                name,
                company,
                phone,
                email,
                address
            };
        }
    } else {
        suppliers.push({
            id: Date.now(),
            name,
            company,
            phone,
            email,
            address
        });
    }

    if (saveSuppliers(suppliers)) {
        const wasEditing = editingSupplierId !== null;

        hideSupplierForm();
        displaySuppliers();

        alert(
            wasEditing
                ? "Supplier updated successfully!"
                : "Supplier added successfully!"
        );
    }
}

// Edit supplier
function editSupplier(id) {
    const suppliers = getSuppliers();

    const supplier = suppliers.find(item => item.id === id);

    if (!supplier) return;

    editingSupplierId = id;

    document.getElementById("supplierName").value = supplier.name;
    document.getElementById("companyName").value = supplier.company;
    document.getElementById("supplierPhone").value = supplier.phone;
    document.getElementById("supplierEmail").value = supplier.email;
    document.getElementById("supplierAddress").value = supplier.address;

    document.getElementById("supplierForm").style.display = "block";

    document.querySelector("#supplierForm h3").textContent =
        "Edit Supplier";
}

// Delete supplier
function deleteSupplier(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) return;

    const suppliers = getSuppliers().filter(
        supplier => supplier.id !== id
    );

    if (saveSuppliers(suppliers)) {
        displaySuppliers();
        alert("Supplier deleted successfully!");
    }
}

// Update supplier statistics
function updateSupplierStatistics() {
    const suppliers = getSuppliers();

    document.getElementById("totalSuppliers").textContent =
        suppliers.length;

    document.getElementById("emailSuppliers").textContent =
        suppliers.filter(supplier => supplier.email).length;

    let suppliedProducts = 0;

    if (typeof getProducts === "function") {
        const products = getProducts();

        suppliedProducts = products.filter(product =>
            suppliers.some(supplier =>
                product.supplier &&
                (
                    product.supplier.toLowerCase() === supplier.name.toLowerCase() ||
                    product.supplier.toLowerCase() === supplier.company.toLowerCase()
                )
            )
        ).length;
    }

    document.getElementById("suppliedProducts").textContent =
        suppliedProducts;
}

// Page initialization
document.addEventListener("DOMContentLoaded", function () {
    initializeSupplierStorage();

    document
        .getElementById("addSupplierForm")
        .addEventListener("submit", handleSupplierSubmit);

    document
        .getElementById("supplierSearch")
        .addEventListener("input", displaySuppliers);

    displaySuppliers();
});