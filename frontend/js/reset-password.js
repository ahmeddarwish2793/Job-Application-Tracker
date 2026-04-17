const API_BASE = "http://localhost:8080/auth";

// Extract token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (!token) {
    showToast("Invalid or expired reset link.", "danger");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2500);
}

// Form elements
const form = document.getElementById("resetForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// Password strength regex (same as backend)
const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    let valid = true;

    // Validate strength
    if (!regex.test(newPassword)) {
        newPasswordError.textContent =
            "Password must contain at least 8 characters, one capital letter and one special character.";
        valid = false;
    } else {
        newPasswordError.textContent = "";
    }

    // Validate match
    if (newPassword !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        valid = false;
    } else {
        confirmPasswordError.textContent = "";
    }

    if (!valid) return;

    try {
        const response = await fetch(`${API_BASE}/reset-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                newPassword: newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Reset failed", "danger");
            return;
        }

        showToast("Password reset successful. Redirecting to login...", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2500);

    } catch (err) {
        showToast("Server error. Please try again.", "danger");
    }
});

// Toggle visibility
function toggleVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    icon.addEventListener("click", function () {
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    });
}

function showToast(message, type) {

    const toastElement = document.getElementById("resetPasswordToast");
    const toastMessage = document.getElementById("resetPasswordToastMessage");

    // Remove previous color classes
    toastElement.classList.remove("text-bg-success", "text-bg-danger");

    if (type === "danger") {
        toastElement.classList.add("text-bg-danger");
    } else {
        toastElement.classList.add("text-bg-success");
    }

    toastMessage.textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

toggleVisibility("newPassword", "toggleNewPassword");
toggleVisibility("confirmPassword", "toggleConfirmPassword");