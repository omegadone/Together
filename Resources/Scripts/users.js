// Global state
let userDatabase = [];


// 1. Fetch the user data on load
async function loadUserData() {
    try {
        const response = await fetch('./Resources/Scripts/user.json');
        const data = await response.json();
        userDatabase = data.users;
        console.log("User database loaded.");
    } catch (error) {
        console.error("Error loading user data:", error);
        document.getElementById('login-error').innerText = "System Error: Could not load user data.";
    }
}

// 2. Modified Authentication Logic
const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', () => {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    // Search through the fetched database
    const user = userDatabase.find(u => u.username === userVal && u.password === passVal);

    if (user) {
        sessionStorage.setItem('session', JSON.stringify(user));
        startApp();
    } else {
        errorMsg.innerText = "Access Denied: Invalid Credentials";
    }
});

// 3. UI and Permissions Logic
function startApp() {
    const user = JSON.parse(sessionStorage.getItem('session'));
    if (!user) return;

    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('current-user-name').innerText = user.fullName;

    // Apply Permissions based on data-role attribute
    document.querySelectorAll('.role-restricted').forEach(el => {
        const allowedRoles = el.getAttribute('data-role').split(' ');
        if (!allowedRoles.includes(user.role)) {
            el.style.display = 'none'; // Ensure they are physically removed from layout
        } else {
            el.style.display = 'block'; 
        }
    });
}

// 4. Initializers
window.onload = () => {
    loadUserData().then(() => {
        if (sessionStorage.getItem('session')) startApp();
    });
};

// ... keep logout and navigation logic from previous version