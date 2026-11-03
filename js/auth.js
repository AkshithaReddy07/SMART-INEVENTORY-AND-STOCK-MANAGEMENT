// Get registered users
function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem("stockSmartUsers"));
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error("Error loading users:", error);
        return [];
    }
}

// Save registered users
function saveUsers(users) {
    localStorage.setItem("stockSmartUsers", JSON.stringify(users));
}

// Display authentication message
function showMessage(message, success = false) {
    const messageElement = document.getElementById("authMessage");

    messageElement.textContent = message;
    messageElement.style.color = success ? "green" : "red";
}

// Switch to Signup
function showSignup() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("signupForm").classList.remove("hidden");

    document.getElementById("authSubtitle").textContent =
        "Create your StockSmart account";

    showMessage("");
}

// Switch to Login
function showLogin() {
    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");

    document.getElementById("authSubtitle").textContent =
        "Login to your account";

    showMessage("");
}

// Signup functionality
document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 6) {
        showMessage("Password must contain at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
    }

    const users = getUsers();

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        showMessage("This email is already registered.");
        return;
    }

    users.push({
        id: Date.now(),
        name: name,
        email: email,
        password: password
    });

    saveUsers(users);

    showMessage("Account created successfully! Please login.", true);

    document.getElementById("signupForm").reset();

    setTimeout(showLogin, 1500);
});

// Login functionality
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(
        item => item.email === email && item.password === password
    );

    if (!user) {
        showMessage("Invalid email or password.");
        return;
    }

    localStorage.setItem("stockSmartLoggedIn", "true");

    localStorage.setItem("stockSmartCurrentUser", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
    }));

    showMessage("Login successful! Redirecting...", true);

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});