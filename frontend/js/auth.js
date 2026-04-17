//API BASE URL
const API_BASE = "http://localhost:8080/auth";

// If already logged in, redirect to main page
const existingUser = JSON.parse(localStorage.getItem("user"));

if (existingUser && existingUser.token) {
    window.location.href = "main.html";
}

//Get Form + Inputs
const loginForm = document.querySelector("form");
const emailField = document.querySelector("input[type='email']");
const passwordInput = document.getElementById("passwordInput");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

//Form Submit
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailField.value.trim();
    const password = passwordInput.value.trim();

    let valid = true;

    if (!email) {
        emailError.textContent = "Email is required.";
        valid = false;
    } else {
        emailError.textContent = "";
    }

    if (!password) {
        passwordError.textContent = "Password is required.";
        valid = false;
    } else {
        passwordError.textContent = "";
    }

    if (!valid) return;

    try {

        //Send login request to backend
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        //Handle backend error
        if (!response.ok) {
            // Handle backend error properly
            if (Array.isArray(data)) {
                alert(data.join("\n"));
            } else if (typeof data === "string") {
                alert(data);
            } else {
                alert("Invalid email or password");
            }

            return;
        }

        // STORE JWT TOKEN
        localStorage.setItem("user", JSON.stringify({
            name: data.name,
            email: data.email,
            token: data.token,
            profileImage: data.profileImage
        }));

        //Redirect to dashboard
        window.location.href = "main.html";

    } catch (error) {
        alert(error.message);
    }
});


//toggle password visibility
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    // If password is hidden
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    } 
    else {
        passwordInput.type = "password";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    }

});

//forgot password modal
const forgotLink = document.querySelector(".forgot-link");
const modal = document.getElementById("resetModal");
const closeModal = document.getElementById("closeModal");

// Open modal
forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    modal.classList.add("active");
});

// Close when clicking X
closeModal.addEventListener("click", function () {
    modal.classList.remove("active");
    resetModalForm();
});

// Close when clicking outside
modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.classList.remove("active");
        resetModalForm();
    }
});


//email validation in forgot password modal
const emailModalInput = document.getElementById("emailModal");
const emailModalError = document.getElementById("email-error");

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

emailModalInput.addEventListener("blur", function () {
    const emailValue = emailModalInput.value.trim();

    if (!isValidEmail(emailValue)) {
        emailModalError.textContent = "Invalid email format (example: name@example.com)";
        emailModalInput.classList.add("input-error");
    } else {
        emailModalError.textContent = "";
        emailModalInput.classList.remove("input-error");
    }
});

// Clear error on input
emailModalInput.addEventListener("input", function () {
    emailModalInput.textContent = "";
    emailModalInput.classList.remove("input-error");
});

// Reset form when modal is closed
function resetModalForm() {
    emailModalInput.value = "";
    emailError.textContent = "";
    emailModalInput.classList.remove("input-error");
}

const sendResetBtn = document.getElementById("sendResetBtn");

sendResetBtn.addEventListener("click", async function () {

    const emailValue = emailModalInput.value.trim();

    // Validate email again before sending
    if (!isValidEmail(emailValue)) {
        emailModalError.textContent =
            "Invalid email format (example: name@example.com)";
        emailModalInput.classList.add("input-error");
        return;
    }

    try {

        const response = await fetch(`${API_BASE}/request-reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailValue
            })
        });

        const data = await response.json();

        if (!response.ok) {
            emailModalError.textContent =
                data.message || "Error sending reset link.";
            return;
        }

        const toastElement = document.getElementById("resetToast");
        const toastMessage = document.getElementById("resetToastMessage");

        toastMessage.textContent = data.message;

        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Close modal
        modal.classList.remove("active");
        resetModalForm();

    } catch (error) {
        alert("Server error.");
    }
});

