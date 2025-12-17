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

// Add this to the bottom of users.js
function initAppListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Logout sequence initiated...");
            
            // 1. Clear the session
            sessionStorage.removeItem('session');
            
            // 2. Force a reload to reset the UI state
            window.location.reload();
        });
    } else {
        console.error("Logout button not found in DOM");
    }
}

// Update your window.onload to include the listeners
window.onload = () => {
    loadUserData().then(() => {
        initAppListeners(); // Initialize buttons
        if (sessionStorage.getItem('session')) {
            startApp();
        }
    });
};

// --- VIEW MANAGER LOGIC ---
function switchView(viewId) {
    console.log("Switching to view:", viewId);

    // 1. Hide all view panels
    const panels = document.querySelectorAll('.view-panel');
    panels.forEach(panel => {
        panel.classList.add('hidden');
    });

    // 2. Show the requested panel
    const targetPanel = document.getElementById(`${viewId}-view`);
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
    } else {
        console.error(`Panel #${viewId}-view not found!`);
    }

    // 3. Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const activeNav = document.querySelector(`[data-view="${viewId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // 4. Update the Header Title
    const titleMap = {
        'dashboard': 'Dashboard',
        'crm': 'Customer Relations',
        'accounting': 'Accounting'
    };
    document.getElementById('view-title').innerText = titleMap[viewId] || "Nexus ERP";
}

// --- INITIALIZE CLICK EVENTS ---
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });
}

// Update your window.onload to include initNavigation
window.onload = () => {
    loadUserData().then(() => {
        initNavigation(); // <--- THIS IS THE KEY
        initAppListeners(); // Logout button
        if (sessionStorage.getItem('session')) startApp();
    });
};