const API_BASE_URL = "http://localhost:8080/applications";

// Back button & Cancel
function goBack() {
    window.location.href = "../pages/main.html";
}

document.querySelector(".back-btn").addEventListener("click", goBack);
document.querySelector(".button-secondary").addEventListener("click", goBack);

// Save application (POST to backend)
document.getElementById("createForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const company = document.getElementById("companyInput").value.trim();
    const position = document.getElementById("positionInput").value.trim();
    const status = document.getElementById("statusInput").value;
    const date = document.getElementById("dateInput").value;

    // Frontend validation
    if (!company || !position || !date) {
        alert("Please fill all required fields.");
        return;
    }

    const newApplication = {
        company,
        position,
        status,
        date
    };

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.token) {
            alert("You are not logged in.");
            window.location.href = "../pages/login.html";
            return;
        }

        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify(newApplication)
        });

        if (response.status === 401) {
            localStorage.removeItem("user");
            window.location.href = "../pages/login.html";
            return;
        }

        if (!response.ok) {
            const errors = await response.json();

            if (Array.isArray(errors)) {
                alert(errors.join("\n"));
            } else {
                alert("Failed to create application");
            }

            return;
        }

        window.location.href = "../pages/main.html";

    } catch (error) {
        console.error("Error creating application:", error);
        alert("Something went wrong. Please try again.");
    }
});