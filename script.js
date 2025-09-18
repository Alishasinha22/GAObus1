let registeredBusId = null;
let currentActiveContentSection = 'dashboard-section'; // Track which main content section is active
let isLoggedInAs = null; // To track if a user role is "logged in" for registration flow

// --- Initial Setup and Global Helpers ---

// Helper function to show a specific section and hide others in the main content area
function showContent(sectionId, clickedButton = null) {
    // Hide all main content sections
    document.querySelectorAll('.content-area .section').forEach(section => {
        if (!section.classList.contains('initial-hide')) { // Don't hide the initial login/reg forms
            section.classList.remove('active-content');
            section.classList.add('hidden-content');
        }
    });

    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden-content');
        targetSection.classList.add('active-content');
        currentActiveContentSection = sectionId;
    }

    // Update active state of bottom taskbar buttons
    document.querySelectorAll('.bottom-taskbar .nav-button').forEach(button => {
        button.classList.remove('active');
    });
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
     // Close dropdowns
    closeAllDropdowns();
}

// Helper to show forms (like login/register) without affecting main content tabs
function showSection(sectionId) {
    // Hide all content sections AND login/reg forms
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active-content', 'hidden-content', 'active');
        section.classList.add('hidden'); // Use 'hidden' for forms not part of the main tabs
    });

    // Show the requested section
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(sectionId).classList.add('active');

    closeAllDropdowns();
}

// Initial call to set up the dashboard as the default view
document.addEventListener('DOMContentLoaded', () => {
    showContent('dashboard-section', document.querySelector('.bottom-taskbar .nav-button'));
    updateProfileStatus();
});

// --- Top Taskbar Logic ---

function toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    dropdown.classList.toggle('show');
    // Close other dropdowns
    document.getElementById('profile-dropdown').classList.remove('show');
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
    // Close other dropdowns
    document.getElementById('notifications-dropdown').classList.remove('show');
}

function closeAllDropdowns() {
    document.getElementById('notifications-dropdown').classList.remove('show');
    document.getElementById('profile-dropdown').classList.remove('show');
}

// Close dropdowns if clicked outside
document.addEventListener('click', function(event) {
    const bell = document.querySelector('.notification-bell');
    const profile = document.querySelector('.profile-box');
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (!bell.contains(event.target) && !notificationsDropdown.contains(event.target)) {
        notificationsDropdown.classList.remove('show');
    }
    if (!profile.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
});


function updateProfileStatus() {
    const profileStatus = document.getElementById('profile-status');
    if (isLoggedInAs) {
        profileStatus.textContent = `Logged in as ${isLoggedInAs}`;
    } else {
        profileStatus.textContent = 'Register/Login';
    }
}

// --- Navigation Back Buttons ---

function backToSelection() {
    showSection('user-selection');
}

function backToDashboard() {
    showContent('dashboard-section', document.querySelector('.bottom-taskbar .nav-button'));
    // Ensure the user selection form is hidden
    document.getElementById('user-selection').classList.remove('active');
    document.getElementById('user-selection').classList.add('hidden');
}

function backToLogin() {
    showSection('commuter-login');
}

function backToLiveTrackerResults() {
    document.getElementById('live-bus-details').classList.remove('active-content');
    document.getElementById('live-bus-details').classList.add('hidden-content');
    document.getElementById('live-bus-results').classList.remove('hidden-content');
    document.getElementById('live-bus-results').classList.add('active-content');
}


// --- User Role Selection ---
function selectRole(role) {
    isLoggedInAs = role; // "Log in" the user to this role
    updateProfileStatus();
    switch (role) {
        case 'commuter':
            showSection('commuter-login');
            break;
        case 'conductor':
            showSection('conductor-register');
            break;
        case 'municipal':
            showSection('municipal-login');
            break;
    }
}


// --- Commuter Logic ---
function loginCommuter() {
    const phone = document.getElementById('commuter-phone').value;
    if (phone.length === 10) {
        alert('Commuter logged in! Welcome.');
        backToDashboard(); // Go back to the main app dashboard
    } else {
        alert('Please enter a valid 10-digit phone number.');
    }
}

// --- Conductor Logic ---
function registerConductorBus() {
    const busId = document.getElementById('bus-id').value;
    const fareChart = document.getElementById('fare-chart').value;
    if (busId.trim() !== '' && fareChart.trim() !== '') {
        registeredBusId = busId;
        document.getElementById('registered-bus-id').textContent = registeredBusId;
        alert(`Conductor for Bus ${busId} registered!`);
        // Instead of showing conductor dashboard as a main tab, show it as a specific 'logged in' view
        showSection('conductor-dashboard');
    } else {
        alert('Please fill in all details.');
    }
}

function updateOccupancy(level) {
    if (registeredBusId) {
        document.getElementById('occupancy-status').textContent = `Status: Occupancy updated to ${level}!`;
        // In a real app, this would send data to the server
    } else {
        alert('Please register your bus first.');
    }
}

// --- Municipal Corporation Logic ---
function loginMunicipal() {
    const employeeId = document.getElementById('employee-id').value;
    if (employeeId.trim() !== '') {
        alert('Municipal employee logged in!');
        showSection('municipal-dashboard'); // Show municipal dashboard directly
        loadMunicipalData();
    } else {
        alert('Please enter your Employee ID.');
    }
}

function loadMunicipalData() {
    // Mock data for Municipal Dashboard
    const buses = [
        { id: '101', status: 'On Time' },
        { id: '102', status: 'Delayed' },
        { id: '103', status: 'On Time' },
        { id: '104', status: 'Delayed' }
    ];

    const complaints = [
        { id: 1, text: 'Bus 102 is consistently late in the mornings.' },
        { id: 2, text: 'Lack of buses on the A to D route during peak hours.' },
        { id: 3, text: 'Overcrowding at Sector 17 bus stop.' }
    ];

    const busStatusList = document.getElementById('municipal-bus-status-list');
    busStatusList.innerHTML = '';
    buses.forEach(bus => {
        const p = document.createElement('p');
        p.textContent = `Bus ${bus.id}: ${bus.status}`;
        p.style.color = bus.status === 'On Time' ? 'var(--accent-green)' : 'var(--accent-red)';
        busStatusList.appendChild(p);
    });

    const complaintList = document.getElementById('municipal-complaint-list');
    complaintList.innerHTML = '';
    complaints.forEach(complaint => {
        const li = document.createElement('li');
        li.textContent = `Complaint #${complaint.id}: ${complaint.text}`;
        complaintList.appendChild(li);
    });
}


// --- Live Tracker Logic (Commuter-like function) ---
function findLiveBuses() {
    const from = document.getElementById('live-from-location').value;
    const to = document.getElementById('live-to-location').value;

    const liveBusResults = document.getElementById('live-bus-results');
    liveBusResults.innerHTML = '';
    liveBusResults.classList.remove('hidden-content');
    liveBusResults.classList.add('active-content');

    // Mock data for demonstration
    const buses = [
        { id: '101', fare: '₹20', occupancy: 'green', route: `${from} to ${to} via 1, 2, 3` },
        { id: '102', fare: '₹25', occupancy: 'orange', route: `${from} to ${to} via 4, 5, 6` },
        { id: '103', fare: '₹15', occupancy: 'red', route: `${from} to ${to} via 7, 8, 9` }
    ];

    const ul = document.createElement('ul');
    buses.forEach(bus => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>Bus ${bus.id} - Fare: ${bus.fare}</div>
            <div class="occupancy ${bus.occupancy}"></div>
        `;
        li.onclick = () => showLiveBusDetails(bus);
        ul.appendChild(li);
    });
    liveBusResults.appendChild(ul);
}

function showLiveBusDetails(bus) {
    document.getElementById('live-bus-results').classList.remove('active-content');
    document.getElementById('live-bus-results').classList.add('hidden-content');

    document.getElementById('live-bus-details').classList.remove('hidden-content');
    document.getElementById('live-bus-details').classList.add('active-content');

    document.getElementById('live-bus-title').textContent = `Details for Bus ${bus.id}`;
    document.getElementById('live-bus-path').textContent = bus.route;
    
    // Simulate real-time data
    const arrivalTime = Math.floor(Math.random() * 20) + 5; // 5 to 25 mins
    const status = Math.random() > 0.5 ? 'On Time' : 'Delayed';
    document.getElementById('live-arrival-time').textContent = `${arrivalTime} mins`;
    document.getElementById('live-bus-status-text').textContent = `Status: ${status}`;
    document.getElementById('live-bus-status-text').style.color = status === 'On Time' ? 'var(--accent-green)' : 'var(--accent-red)';
}


// --- Complaint Section Logic ---
function submitComplaint() {
    const issueType = document.getElementById('issue-type').value;
    const complaintDetails = document.getElementById('complaint-details').value;

    if (issueType === "") {
        alert('Please select an issue type.');
        return;
    }
    if (complaintDetails.trim() === "") {
        alert('Please provide details for your complaint.');
        return;
    }

    alert(`Complaint submitted for "${issueType}": ${complaintDetails}`);
    // In a real app, this would send data to the backend
    document.getElementById('issue-type').value = "";
    document.getElementById('complaint-details').value = "";
    showContent('dashboard-section', document.querySelector('.bottom-taskbar .nav-button')); // Go back to dashboard
}
