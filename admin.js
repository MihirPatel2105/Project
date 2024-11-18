// Mock data for demonstration
const mockData = {
    dashboard: {
        totalUsers: 1250,
        totalShops: 20,
        pendingRequests: 4,
        activeLocations: 15
    },
    shopRequests: [
        { id: 1, shopName: 'Café Delight', status: 'pending', owner: 'Suresh Sharma' },
        { id: 2, shopName: 'Fitness Zone', status: 'rejected', owner: 'Nikesh Patel' }
    ],
    users: [
        { id: 1, username: 'Patel101', email: '23ce101@charusat.edu.in', role: 'super admin' },
        { id: 2, username: 'Patel100', email: '23ce100@charusat.edu.in', role: 'super admin' },
        { id: 3, username: 'Patel106', email: '23ce106@charusat.edu.in', role: 'admin supporter' }
    ],
    locations: [
        { id: 1, name: 'Cafe', address: 'behind depstar building', status: 'active' } 
    ]
};

// Display notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Toggle loader
function toggleLoader(show) {
    document.getElementById('loader').style.display = show ? 'block' : 'none';
}

// Populate dashboard statistics
function updateDashboardStats() {
    const { totalUsers, totalShops, pendingRequests, activeLocations } = mockData.dashboard;
    
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('total-shops').textContent = totalShops;
    document.getElementById('pending-requests').textContent = pendingRequests;
    document.getElementById('active-locations').textContent = activeLocations;
}

// Render shop requests
function renderShopRequests(filter = 'all') {
    const tableBody = document.querySelector('#shop-requests tbody');
    tableBody.innerHTML = '';

    const filteredRequests = filter === 'all' 
        ? mockData.shopRequests 
        : mockData.shopRequests.filter(req => req.status === filter);

    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.shopName}</td>
            <td>${request.status}</td>
            <td>
                ${request.status === 'pending' ? `
                    <button onclick="approveRequest(${request.id})">Approve</button>
                    <button onclick="rejectRequest(${request.id})">Reject</button>
                ` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Approve shop request
function approveRequest(requestId) {
    const request = mockData.shopRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'approved';
        renderShopRequests(document.getElementById('status-filter').value);
        showNotification('Request approved successfully');
    }
}

// Reject shop request
function rejectRequest(requestId) {
    const request = mockData.shopRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'rejected';
        renderShopRequests(document.getElementById('status-filter').value);
        showNotification('Request rejected successfully');
    }
}

// Render users
function renderUsers() {
    const tableBody = document.querySelector('#user-management tbody');
    tableBody.innerHTML = '';

    mockData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})" class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit user
function editUser(userId) {
    showNotification('Edit functionality not implemented in mock version');
}

// Delete user
function deleteUser(userId) {
    const index = mockData.users.findIndex(user => user.id === userId);
    if (index !== -1) {
        mockData.users.splice(index, 1);
        renderUsers();
        showNotification('User deleted successfully');
    }
}

// Render locations
function renderLocations() {
    const tableBody = document.querySelector('#location-management tbody');
    tableBody.innerHTML = '';

    mockData.locations.forEach(location => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${location.id}</td>
            <td>${location.name}</td>
            <td>${location.address}</td>
            <td>${location.status}</td>
            <td>
                <button onclick="editLocation(${location.id})">Edit</button>
                <button onclick="deleteLocation(${location.id})" class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit location
function editLocation(locationId) {
    showNotification('Edit functionality not implemented in mock version');
}

// Delete location
function deleteLocation(locationId) {
    const index = mockData.locations.findIndex(location => location.id === locationId);
    if (index !== -1) {
        mockData.locations.splice(index, 1);
        renderLocations();
        showNotification('Location deleted successfully');
    }
}

// Section switching
function switchSection(event) {
    event.preventDefault();
    const targetSection = event.target.getAttribute('data-section');

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the targeted section
    document.getElementById(targetSection).classList.add('active');

    // Perform specific actions based on section
    switch(targetSection) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'shop-requests':
            renderShopRequests();
            break;
        case 'user-management':
            renderUsers();
            break;
        case 'location-management':
            renderLocations();
            break;
    }
}

// Initialize settings toggles
// Initialize settings toggles
function initializeSettings() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const notificationsToggle = document.getElementById('notifications-toggle');

    darkModeToggle.addEventListener('change', (event) => {
        document.body.classList.toggle('dark-mode', event.target.checked);
        showNotification('Dark mode ' + (event.target.checked ? 'enabled' : 'disabled'));
    });

    notificationsToggle.addEventListener('change', (event) => {
        const notificationsEnabled = event.target.checked;
        showNotification('Notifications ' + (notificationsEnabled ? 'enabled' : 'disabled'));
        // You can add additional logic here to manage notifications
    });
}

// Event listeners for navigation
document.querySelectorAll('.admin-navbar a').forEach(link => {
    link.addEventListener('click', switchSection);
});

// Event listener for shop request filter
document.getElementById('status-filter').addEventListener('change', (event) => {
    renderShopRequests(event.target.value);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    renderShopRequests();
    renderUsers();
    renderLocations();
    initializeSettings();
});