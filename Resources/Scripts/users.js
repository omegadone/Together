console.log("1. users.js has started loading...");

// Global state
let userDatabase = [];

// --- 1. Load User Data ---
async function loadUserData() {
    try {
        const response = await fetch('./Resources/Scripts/user.json');
        const data = await response.json();
        userDatabase = data.users;
        console.log("2. User database loaded successfully.");
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// --- 2. View Manager (The function the console couldn't find) ---
function switchView(viewId) {
    console.log("Attempting to switch to:", viewId);
    
    // Hide all views
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    // Show selected view
    const target = document.getElementById(`${viewId}-view`);
    if (target) {
        target.classList.remove('hidden');
        console.log(`View switched to ${viewId}`);
    } else {
        console.error(`Could not find element: ${viewId}-view`);
    }

    // Update Header
    document.getElementById('view-title').innerText = viewId.toUpperCase();
}

// --- 3. Authentication logic ---
function startApp() {
    const user = JSON.parse(sessionStorage.getItem('session'));
    if (!user) return;

    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('current-user-name').innerText = user.fullName;

    // Permissions
    document.querySelectorAll('.role-restricted').forEach(el => {
        const allowedRoles = el.getAttribute('data-role').split(' ');
        el.style.display = allowedRoles.includes(user.role) ? 'block' : 'none';
    });
}

// --- 4. Event Listeners ---
function initApp() {
    console.log("3. Initializing Button Listeners...");

    // Login Button
    const loginBtn = document.getElementById('login-btn');
    if(loginBtn) {
        loginBtn.addEventListener('click', () => {
            const userVal = document.getElementById('username').value;
            const passVal = document.getElementById('password').value;
            const user = userDatabase.find(u => u.username === userVal && u.password === passVal);

            if (user) {
                sessionStorage.setItem('session', JSON.stringify(user));
                startApp();
            } else {
                document.getElementById('login-error').innerText = "Invalid Credentials";
            }
        });
    }

    // Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        sessionStorage.removeItem('session');
        location.reload();
    });
}

// --- 5. Run on Load ---
window.onload = () => {
    loadUserData().then(() => {
        initApp();
        if (sessionStorage.getItem('session')) startApp();
    });
};