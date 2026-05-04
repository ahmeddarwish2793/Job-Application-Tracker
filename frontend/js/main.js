const BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://job-application-tracker-production-64d5.up.railway.app";

const API_BASE_URL = `${BASE_URL}/applications`;

let selectedApplication = null;

// ==============================
// SESSION & USER
// ==============================

const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.token) {
    window.location.href = "login.html";
}

// Welcome message (dynamic)
document.getElementById("welcomeMessage").textContent =
    `Welcome back, ${user.name}!`;

// ==============================
// DOM REFERENCES
// ==============================

const grid = document.getElementById("applicationsGrid");
const overlay = document.getElementById("detailsOverlay");
const closeBtn = document.getElementById("closeDetails");

const confirmOverlay = document.getElementById("confirmOverlay");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

const logoutBtn = document.getElementById("logoutBtn");
const logoutOverlay = document.getElementById("logoutOverlay");
const logoutYes = document.getElementById("logoutYes");
const logoutNo = document.getElementById("logoutNo");

// ==============================
// UTILITIES
// ==============================

function formatDateForDisplay(isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}

function getAuthHeaders(includeJson = false) {
    const headers = {
        "Authorization": "Bearer " + user.token
    };

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

// ==============================
// LOAD APPLICATIONS
// ==============================

async function loadApplications() {
    try {

        const response = await fetch(API_BASE_URL, {
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            localStorage.removeItem("user");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load applications");
        }

        const applications = await response.json();

        document.getElementById("applicationsCount").textContent =
            `You have ${applications.length} job applications`;

        renderCards(applications);

    } catch (error) {
        console.error("Error:", error);
    }
}

// ==============================
// RENDER CARDS
// ==============================

function renderCards(applications) {
    grid.innerHTML = "";

    if (applications.length === 0) {
        return;
    }

    applications.forEach(app => {

        const card = document.createElement("div");
        card.classList.add("application-card");

        card.innerHTML = `
            <div class="card-logo">
                <i class="fa-regular fa-file-lines"></i>
            </div>

            <span class="status-badge status-${app.status}">
                ${app.status}
            </span>

            <div class="company-name">${app.company}</div>
            <div class="position">${app.position}</div>

            <div class="date-row">
                <i class="fa-regular fa-calendar"></i>
                ${formatDateForDisplay(app.date)}
            </div>
        `;

        card.addEventListener("click", () => openDetails(app));
        grid.appendChild(card);
    });
}

// ==============================
// DETAILS MODAL
// ==============================

function openDetails(app) {
    selectedApplication = app;

    document.getElementById("detailCompany").value = app.company;
    document.getElementById("detailPosition").value = app.position;
    document.getElementById("detailStatus").value = app.status;
    document.getElementById("detailDate").value = app.date;

    overlay.style.display = "flex";
}

closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});

// ==============================
// UPDATE APPLICATION
// ==============================

document.getElementById("updateBtn").addEventListener("click", async () => {

    if (!selectedApplication) return;

    const updatedApplication = {
        company: document.getElementById("detailCompany").value,
        position: document.getElementById("detailPosition").value,
        status: document.getElementById("detailStatus").value,
        date: document.getElementById("detailDate").value
    };

    try {

        const response = await fetch(`${API_BASE_URL}/${selectedApplication.id}`, {
            method: "PUT",
            headers: getAuthHeaders(true),
            body: JSON.stringify(updatedApplication)
        });

        if (!response.ok) {
            alert("Failed to update application");
            return;
        }

        overlay.style.display = "none";
        loadApplications();

    } catch (error) {
        console.error("Update error:", error);
    }
});

// ==============================
// DELETE APPLICATION
// ==============================

document.getElementById("deleteBtn").addEventListener("click", () => {
    if (!selectedApplication) return;
    confirmOverlay.style.display = "flex";
});

confirmNo.addEventListener("click", () => {
    confirmOverlay.style.display = "none";
});

confirmYes.addEventListener("click", async () => {

    if (!selectedApplication) return;

    try {

        await fetch(`${API_BASE_URL}/${selectedApplication.id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        confirmOverlay.style.display = "none";
        overlay.style.display = "none";

        loadApplications();

    } catch (error) {
        console.error("Delete error:", error);
    }
});

// ==============================
// LOGOUT
// ==============================

logoutBtn.addEventListener("click", () => {
    logoutOverlay.style.display = "flex";
});

logoutNo.addEventListener("click", () => {
    logoutOverlay.style.display = "none";
});

logoutYes.addEventListener("click", () => {

    localStorage.removeItem("user");

    window.location.href = "login.html";
});

// ==============================
// NEW APPLICATION
// ==============================

const newAppBtn = document.getElementById("newApplicationBtn");

if (newAppBtn) {
    newAppBtn.addEventListener("click", () => {
        window.location.href = "../pages/newApp.html";
    });
}

// ==============================
// INITIAL LOAD
// ==============================

loadApplications();