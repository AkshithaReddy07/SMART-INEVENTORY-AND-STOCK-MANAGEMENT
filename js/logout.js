function logoutUser(event) {
    event.preventDefault();

    // Remove login session
    localStorage.removeItem("stockSmartLoggedIn");
    localStorage.removeItem("stockSmartCurrentUser");

    // Redirect to login page
    window.location.href = "login.html";
}