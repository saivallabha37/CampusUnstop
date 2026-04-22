const state = {
    activeUser: null, // Holds user object when logged in
    userBookings: [], 
    events: [
        {
            id: 'ev_101',
            title: 'DSAC Algorithms Showdown',
            category: 'Technical',
            description: 'Join the Data Structures & Algorithms Club for an intensive competitive coding challenge. Test your logic, optimize your code.',
            slots: [
                { id: 's_1', time: '10:00 AM - 01:00 PM', capacity: 50, booked: 48 },
                { id: 's_2', time: '02:00 PM - 05:00 PM', capacity: 50, booked: 12 }
            ]
        },
        {
            id: 'ev_102',
            title: 'Full-Stack React Masterclass',
            category: 'Workshop',
            description: 'Learn how to build production-level Full-Stack applications using modern frameworks.',
            slots: [
                { id: 's_3', time: '09:00 AM - 11:30 AM', capacity: 30, booked: 30 }, 
                { id: 's_4', time: '12:00 PM - 02:30 PM', capacity: 30, booked: 5 }
            ]
        }
    ]
};

let bookingModal;

// --- 2. INITIALIZATION & AUTHENTICATION ---
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('bookingModal');
    if(modalElement) bookingModal = new bootstrap.Modal(modalElement);
    
    // Check if user is "logged in" based on our state
    updateNavbarState();
    
    // Auth Form Listeners
    setupAuthListeners();
    setupEventListeners();
});

function toggleAuth(mode) {
    const loginWrapper = document.getElementById('login-form-wrapper');
    const regWrapper = document.getElementById('register-form-wrapper');
    
    if (mode === 'register') {
        loginWrapper.classList.add('d-none');
        regWrapper.classList.remove('d-none');
        regWrapper.classList.add('animate-fade-in');
    } else {
        regWrapper.classList.add('d-none');
        loginWrapper.classList.remove('d-none');
        loginWrapper.classList.add('animate-fade-in');
    }
}

function setupAuthListeners() {
    // Simulated Login Request
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginBtn');
        const spinner = document.getElementById('loginSpinner');
        const email = document.getElementById('loginEmail').value;
        
        // UI Loading State
        btn.querySelector('span').textContent = 'Authenticating...';
        spinner.classList.remove('d-none');
        btn.disabled = true;

        // Simulate Network Delay for presentation polish
        setTimeout(() => {
            state.activeUser = {
                name: email === 'saiganeshkokkula25@gmail.com' ? 'Sai Ganesh' : email.split('@')[0],
                email: email,
                role: 'student' // default for demo
            };
            
            showToast(`<i class="bi bi-person-check-fill text-success fs-5"></i> Welcome back, ${state.activeUser.name}!`);
            completeLoginProcess();
        }, 1500);
    });

    // Simulated Registration Request
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('regBtn');
        const spinner = document.getElementById('regSpinner');
        
        btn.querySelector('span').textContent = 'Creating Account...';
        spinner.classList.remove('d-none');
        btn.disabled = true;

        setTimeout(() => {
            state.activeUser = {
                name: document.getElementById('regFName').value,
                email: document.getElementById('regEmail').value,
                role: document.getElementById('regRole').value
            };
            
            showToast(`<i class="bi bi-check-circle-fill text-success fs-5"></i> Account created successfully!`);
            completeLoginProcess();
        }, 1500);
    });
}

function completeLoginProcess() {
    // Reset buttons
    document.getElementById('loginBtn').disabled = false;
    document.getElementById('loginBtn').querySelector('span').textContent = 'Sign In';
    document.getElementById('loginSpinner').classList.add('d-none');
    
    updateNavbarState();
    
    // Initialize Dashboard data
    renderEvents(state.events);
    navigate('home');
}

function handleLogout() {
    state.activeUser = null;
    state.userBookings = []; // clear session data
    updateTicketBadge();
    updateNavbarState();
    navigate('auth');
    showToast(`<i class="bi bi-box-arrow-right fs-5"></i> Logged out successfully.`);
}

function updateNavbarState() {
    const authLinks = document.getElementById('auth-links');
    const userControls = document.getElementById('user-controls');
    
    if (state.activeUser) {
        // User is logged in
        authLinks.classList.remove('d-none');
        
        // Generate initials for avatar
        const initials = state.activeUser.name.substring(0,2).toUpperCase();
        
        userControls.innerHTML = `
            <div class="dropdown">
                <div class="d-flex align-items-center gap-2 cursor-pointer" data-bs-toggle="dropdown" style="cursor: pointer;">
                    <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow-sm" style="width: 38px; height: 38px; font-size: 0.9rem;">
                        ${initials}
                    </div>
                    <span class="fw-semibold text-dark d-none d-md-block">${state.activeUser.name} <i class="bi bi-chevron-down small text-muted"></i></span>
                </div>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3">
                    <li><h6 class="dropdown-header border-bottom mb-2 pb-2">${state.activeUser.email}</h6></li>
                    <li><a class="dropdown-item py-2" href="#" onclick="navigate('dashboard')"><i class="bi bi-ticket-perforated me-2 text-muted"></i> My Bookings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger py-2" href="#" onclick="handleLogout()"><i class="bi bi-box-arrow-right me-2"></i> Sign out</a></li>
                </ul>
            </div>
        `;
    } else {
        // User is logged out
        authLinks.classList.add('d-none');
        userControls.innerHTML = `<button class="btn btn-primary rounded-pill px-4 fw-medium shadow-sm" onclick="navigate('auth')">Sign In</button>`;
    }
}

// --- 3. ROUTING ---
function navigate(viewId, event = null) {
    if(event) event.preventDefault();

    // Hide all views safely
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.add('d-none');
        sec.classList.remove('active-view');
    });
    
    // Show selected view
    const view = document.getElementById(`view-${viewId}`);
    if(view) {
        view.classList.remove('d-none');
        view.classList.add('active-view');
    }

    // Nav Link Highlighting (skip if auth view)
    if(viewId !== 'auth') {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const targetLink = document.querySelector(`a[onclick*="navigate('${viewId}')"]`);
        if(targetLink) targetLink.classList.add('active');
    }

    if (viewId === 'dashboard') renderTickets();
    window.scrollTo(0, 0);
}

// --- 4. CORE LOGIC (Events, Booking, Dash, Utilities) ---
// (Paste your renderEvents, openBookingModal, selectSlot, confirmBooking, renderTickets, updateTicketBadge, addSlotField, form submissions, setupEventListeners, and showToast functions directly below this comment from the previous step. They require zero modifications!)

// [COPY/PASTE REST OF FUNCTIONS HERE]

function renderEvents(eventsArray) {
    const grid = document.getElementById('eventsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    if(eventsArray.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5 text-muted">No events match your criteria.</div>`;
        return;
    }
    eventsArray.forEach(event => {
        const totalCapacity = event.slots.reduce((sum, slot) => sum + slot.capacity, 0);
        const totalBooked = event.slots.reduce((sum, slot) => sum + slot.booked, 0);
        const percentFilled = (totalBooked / totalCapacity) * 100;
        const isSoldOut = totalBooked >= totalCapacity;
        let barColor = 'bg-primary';
        if (percentFilled > 80) barColor = 'bg-warning';
        if (percentFilled === 100) barColor = 'bg-danger';
        const cardHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="card event-card border-0 shadow-sm rounded-4 p-4 bg-white h-100 flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge bg-primary-subtle text-primary border-0 px-2 py-1">${event.category}</span>
                        <div class="text-end">
                            <small class="text-muted fw-bold d-block"><i class="bi bi-people-fill"></i> ${totalBooked}/${totalCapacity}</small>
                        </div>
                    </div>
                    <h5 class="fw-bold mb-2 text-dark">${event.title}</h5>
                    <p class="text-muted small mb-4 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${event.description}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between text-muted small mb-1 fw-medium">
                            <span>Availability</span>
                            <span class="${isSoldOut ? 'text-danger' : ''}">${isSoldOut ? 'Sold Out' : (100 - percentFilled).toFixed(0) + '% Left'}</span>
                        </div>
                        <div class="progress progress-slim mb-3">
                            <div class="progress-bar ${barColor}" style="width: ${percentFilled}%"></div>
                        </div>
                        <button class="btn ${isSoldOut ? 'btn-secondary disabled' : 'btn-dark'} w-100 rounded-pill fw-medium shadow-sm" 
                            onclick="openBookingModal('${event.id}')">
                            ${isSoldOut ? 'Event Full' : 'View Slots & Book'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function openBookingModal(eventId) {
    const event = state.events.find(e => e.id === eventId);
    if(!event || !bookingModal) return;
    document.getElementById('modalTitle').textContent = event.title;
    document.getElementById('modalCategory').textContent = event.category;
    document.getElementById('modalDesc').textContent = event.description;
    document.getElementById('selectedEventId').value = eventId;
    const slotsWrapper = document.getElementById('modalSlotsWrapper');
    slotsWrapper.innerHTML = '';
    document.getElementById('confirmBookBtn').disabled = true;
    event.slots.forEach(slot => {
        const available = slot.capacity - slot.booked;
        const isFull = available <= 0;
        const alreadyBooked = state.userBookings.some(b => b.eventId === eventId && b.slotId === slot.id);
        let statusText = `${available} seats left`;
        if (isFull) statusText = 'Fully Booked';
        if (alreadyBooked) statusText = 'Already Booked by You';
        const slotHTML = `
            <div class="slot-option ${(isFull || alreadyBooked) ? 'disabled' : ''}" 
                 id="ui-slot-${slot.id}" 
                 onclick="${(isFull || alreadyBooked) ? '' : `selectSlot('${slot.id}')`}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-dark"><i class="bi bi-clock text-primary me-2"></i>${slot.time}</span>
                    <span class="badge ${alreadyBooked ? 'bg-success' : (isFull ? 'bg-danger' : 'bg-light text-dark border')}">${statusText}</span>
                </div>
                <div class="progress progress-slim">
                    <div class="progress-bar ${isFull ? 'bg-danger' : 'bg-primary'}" style="width: ${(slot.booked/slot.capacity)*100}%"></div>
                </div>
            </div>
        `;
        slotsWrapper.insertAdjacentHTML('beforeend', slotHTML);
    });
    bookingModal.show();
}

function selectSlot(slotId) {
    document.querySelectorAll('.slot-option').forEach(el => el.classList.remove('selected', 'border-primary'));
    const selectedEl = document.getElementById(`ui-slot-${slotId}`);
    if(selectedEl) selectedEl.classList.add('selected', 'border-primary');
    document.getElementById('selectedSlotId').value = slotId;
    document.getElementById('confirmBookBtn').disabled = false;
}

function confirmBooking() {
    const eventId = document.getElementById('selectedEventId').value;
    const slotId = document.getElementById('selectedSlotId').value;
    const eventIndex = state.events.findIndex(e => e.id === eventId);
    const slotIndex = state.events[eventIndex].slots.findIndex(s => s.id === slotId);
    const targetSlot = state.events[eventIndex].slots[slotIndex];
    if (targetSlot.booked < targetSlot.capacity) {
        targetSlot.booked += 1;
        const ticket = {
            ticketId: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
            eventId: eventId,
            eventTitle: state.events[eventIndex].title,
            slotId: slotId,
            time: targetSlot.time,
            bookedAt: new Date().toLocaleDateString()
        };
        state.userBookings.push(ticket);
        updateTicketBadge();
        bookingModal.hide();
        renderEvents(state.events); 
        showToast(`<i class="bi bi-check-circle-fill text-success fs-5"></i> Successfully secured slot! Ticket ID: ${ticket.ticketId}`);
    } else {
        showToast(`<i class="bi bi-x-circle-fill text-danger fs-5"></i> Sorry, this slot just filled up!`);
    }
}

function renderTickets() {
    const grid = document.getElementById('ticketsGrid');
    const noMsg = document.getElementById('no-tickets-msg');
    grid.innerHTML = '';
    if (state.userBookings.length === 0) {
        noMsg.classList.remove('d-none');
        return;
    }
    noMsg.classList.add('d-none');
    state.userBookings.forEach(ticket => {
        const ticketHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden" style="border-left: 6px solid var(--primary) !important;">
                    <div class="card-body p-4 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                            <span class="text-muted small fw-medium">TICKET ID: ${ticket.ticketId}</span>
                            <i class="bi bi-qr-code text-dark fs-4"></i>
                        </div>
                        <h5 class="fw-bold mb-3">${ticket.eventTitle}</h5>
                        <div class="bg-light p-3 rounded-3 d-flex align-items-center gap-3">
                            <div class="bg-white p-2 rounded shadow-sm text-primary"><i class="bi bi-clock-history fs-5"></i></div>
                            <div>
                                <small class="text-muted d-block">Reserved Slot</small>
                                <span class="fw-bold text-dark">${ticket.time}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', ticketHTML);
    });
}

function updateTicketBadge() {
    const badge = document.getElementById('ticket-badge');
    badge.textContent = state.userBookings.length;
    if(state.userBookings.length > 0) badge.classList.remove('d-none');
    else badge.classList.add('d-none');
}

function addSlotField() {
    const container = document.getElementById('slotContainer');
    const newField = document.createElement('div');
    newField.className = 'row g-3 mb-3 slot-entry align-items-end animate-fade-in';
    newField.innerHTML = `
        <div class="col-md-5">
            <input type="text" class="form-control bg-light border-0 slot-time" placeholder="e.g., 02:00 PM - 04:00 PM" required>
        </div>
        <div class="col-md-4">
            <input type="number" class="form-control bg-light border-0 slot-cap" placeholder="Capacity" min="1" required>
        </div>
        <div class="col-md-3">
            <button type="button" class="btn btn-outline-danger w-100 fw-medium" onclick="this.closest('.slot-entry').remove()"><i class="bi bi-trash"></i> Remove</button>
        </div>
    `;
    container.appendChild(newField);
}

const form = document.getElementById('createEventForm');
if(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const slotElements = document.querySelectorAll('.slot-entry');
        const newSlots = [];
        let isValid = true;
        slotElements.forEach((el, index) => {
            const time = el.querySelector('.slot-time').value;
            const cap = el.querySelector('.slot-cap').value;
            if(time && cap) {
                newSlots.push({ id: `s_new_${Date.now()}_${index}`, time: time, capacity: parseInt(cap), booked: 0 });
            } else { isValid = false; }
        });
        if(!isValid || newSlots.length === 0) {
            showToast(`<i class="bi bi-exclamation-triangle-fill text-warning fs-5"></i> Please provide valid slot timings.`);
            return;
        }
        const newEvent = {
            id: `ev_${Date.now()}`,
            title: document.getElementById('evTitle').value,
            category: document.getElementById('evCategory').value,
            description: document.getElementById('evDesc').value,
            slots: newSlots
        };
        state.events.unshift(newEvent); 
        this.reset();
        document.getElementById('slotContainer').innerHTML = `
            <div class="row g-3 mb-3 slot-entry align-items-end">
                <div class="col-md-5"><label class="form-label text-muted small">Time Frame</label><input type="text" class="form-control bg-light border-0 slot-time" required></div>
                <div class="col-md-4"><label class="form-label text-muted small">Max Capacity</label><input type="number" class="form-control bg-light border-0 slot-cap" min="1" required></div>
                <div class="col-md-3"><button type="button" class="btn btn-outline-primary w-100 fw-medium" onclick="addSlotField()">+ Add Slot</button></div>
            </div>
        `;
        showToast(`<i class="bi bi-cloud-arrow-up-fill text-success fs-5"></i> Event successfully deployed!`);
        setTimeout(() => { navigate('home'); renderEvents(state.events); }, 1500);
    });
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = state.events.filter(ev => 
                ev.title.toLowerCase().includes(term) || ev.category.toLowerCase().includes(term)
            );
            renderEvents(filtered);
        });
    }
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'btn-secondary'));
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.add('btn-outline-secondary'));
            e.target.classList.remove('btn-outline-secondary');
            e.target.classList.add('active', 'btn-secondary');
            const filter = e.target.getAttribute('data-filter');
            if (filter === 'all') renderEvents(state.events);
            else renderEvents(state.events.filter(ev => ev.category === filter));
        });
    });
}

function showToast(messageHtml) {
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastMessage');
    if(toastEl && toastBody) {
        toastBody.innerHTML = messageHtml;
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
    }
}