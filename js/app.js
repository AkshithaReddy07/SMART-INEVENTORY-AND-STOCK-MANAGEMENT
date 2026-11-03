// =====================================
// STOCKSMART - MAIN APPLICATION
// =====================================


// Load Application Settings

function getAppSettings() {

    const defaults = {
        adminName: "Admin",
        adminEmail: "admin@stocksmart.com",
        appName: "StockSmart",
        currency: "INR"
    };

    try {

        const saved = JSON.parse(
            localStorage.getItem("stockSettings") || "{}"
        );

        return {
            ...defaults,
            ...saved
        };

    } catch (error) {

        return defaults;

    }

}


// Update Application Branding

function updateBranding() {

    const settings = getAppSettings();

    document.title = settings.appName;

    document.querySelectorAll(".logo h2").forEach(logo => {

        logo.innerHTML = settings.appName.replace(
            /Smart/i,
            "<span>$&</span>"
        );

    });

}


// Update Admin Profile

function updateAdminProfile() {

    const settings = getAppSettings();

    document.querySelectorAll(".profile-info h4").forEach(element => {

        element.textContent = settings.adminName;

    });

}


// Initialize Application

document.addEventListener("DOMContentLoaded", function() {

    updateBranding();

    updateAdminProfile();

});