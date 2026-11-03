// =====================================
// STOCKSMART - SETTINGS MODULE
// =====================================


// Default Settings

const defaultSettings = {
    adminName: "Admin",
    adminEmail: "admin@stocksmart.com",
    lowStockThreshold: 5,
    recommendedStock: 20,
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    defaultStatus: "Available",
    appName: "StockSmart"
};


// Get Saved Settings

function getSettings() {

    const savedSettings = localStorage.getItem("stockSettings");

    return savedSettings
        ? { ...defaultSettings, ...JSON.parse(savedSettings) }
        : { ...defaultSettings };

}


// Load Settings into Form

function loadSettings() {

    const settings = getSettings();

    document.getElementById("adminName").value =
        settings.adminName;

    document.getElementById("adminEmail").value =
        settings.adminEmail;

    document.getElementById("lowStockThreshold").value =
        settings.lowStockThreshold;

    document.getElementById("recommendedStock").value =
        settings.recommendedStock;

    document.getElementById("currency").value =
        settings.currency;

    document.getElementById("dateFormat").value =
        settings.dateFormat;

    document.getElementById("defaultStatus").value =
        settings.defaultStatus;

    document.getElementById("appName").value =
        settings.appName;

}


// Save Settings

document.getElementById("settingsForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const settings = {

            adminName:
                document.getElementById("adminName").value.trim(),

            adminEmail:
                document.getElementById("adminEmail").value.trim(),

            lowStockThreshold:
                Number(document.getElementById("lowStockThreshold").value),

            recommendedStock:
                Number(document.getElementById("recommendedStock").value),

            currency:
                document.getElementById("currency").value,

            dateFormat:
                document.getElementById("dateFormat").value,

            defaultStatus:
                document.getElementById("defaultStatus").value,

            appName:
                document.getElementById("appName").value.trim()

        };


        // Validation

        if (
            !settings.adminName ||
            !settings.adminEmail ||
            !settings.appName ||
            !Number.isSafeInteger(settings.lowStockThreshold) ||
            !Number.isSafeInteger(settings.recommendedStock) ||
            settings.lowStockThreshold < 0 ||
            settings.recommendedStock < 1
        ) {

            alert("Please enter valid settings!");

            return;

        }


        if (
            settings.recommendedStock <= settings.lowStockThreshold
        ) {

            alert(
                "Recommended stock must be greater than the low stock threshold."
            );

            return;

        }


        // Save to LocalStorage

        localStorage.setItem(
            "stockSettings",
            JSON.stringify(settings)
        );


        alert("Settings saved successfully!");


        loadSettings();

    }

);


// Reset Settings

document.getElementById("resetSettings").addEventListener(
    "click",
    function() {

        const confirmReset = confirm(
            "Are you sure you want to reset all settings?"
        );

        if (!confirmReset) return;


        localStorage.setItem(
            "stockSettings",
            JSON.stringify(defaultSettings)
        );


        loadSettings();


        alert("Settings restored to default!");

    }

);


// Initialize Settings

document.addEventListener("DOMContentLoaded", function() {

    loadSettings();

});