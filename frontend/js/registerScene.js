//If user already logged in, redirect to main page.
const existingUser = JSON.parse(localStorage.getItem("user"));

if (existingUser && existingUser.token) {
    window.location.href = "main.html";
}

//API BASE URL
const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:8080/auth"
    : "https://job-application-tracker-production-64d5.up.railway.app/auth";

// Register form
const registerForm = document.getElementById("registerForm");

// Inputs
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");


// Error message elements
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");


// Toggle password
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirmPassword");


nameInput.addEventListener("blur", validateName);

nameInput.addEventListener("input", function () {
    nameError.textContent = "";
    nameInput.classList.remove("input-error");
});

// Full Name validation function
function validateName() {

    const nameValue = nameInput.value.trim();

    if (nameValue === "") {
        nameError.textContent = "Please enter your name.";
        nameInput.classList.add("input-error");
        return false;
    } 
    else {
        nameError.textContent = "";
        nameInput.classList.remove("input-error");
        return true;
    }

}

// Email validation function
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Password validation function
function isValidPassword(password) {
    return password.length >= 8;
}

// Validate email
function validateEmail() {
    const emailValue = emailInput.value.trim();

    if (!isValidEmail(emailValue)) {
        emailError.textContent = "Invalid email format (example: name@example.com).";
        emailInput.classList.add("input-error");
        return false;
    } else {
        emailError.textContent = "";
        emailInput.classList.remove("input-error");
        return true;
    }
}

// Validate password
function validatePassword() {
    const passwordValue = passwordInput.value;

    if (!isValidPassword(passwordValue)) {
        passwordError.textContent = "Password must be longer than 8 characters.";
        passwordInput.classList.add("input-error");
        return false;
    } else {
        passwordError.textContent = "";
        passwordInput.classList.remove("input-error");
        return true;
    }
}

// Validate confirm password
function validateConfirmPassword() {
    const passwordValue = passwordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

      if (confirmPasswordValue === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        confirmPasswordInput.classList.add("input-error");
        return false;
      }
      else if (confirmPasswordValue !== passwordValue) {
        confirmPasswordError.textContent = "Passwords do not match.";
        confirmPasswordInput.classList.add("input-error");
        return false;
    } else {
        confirmPasswordError.textContent = "";
        confirmPasswordInput.classList.remove("input-error");
        return true;
    }
}

// Email events
emailInput.addEventListener("blur", validateEmail);
emailInput.addEventListener("input", function () {
    emailError.textContent = "";
    emailInput.classList.remove("input-error");
});

// Password events
passwordInput.addEventListener("blur", validatePassword);
passwordInput.addEventListener("input", function () {
    passwordError.textContent = "";
    passwordInput.classList.remove("input-error");
});

// Confirm password events
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);
confirmPasswordInput.addEventListener("input", function () {
    confirmPasswordError.textContent = "";
    confirmPasswordInput.classList.remove("input-error");
});

// Form submit
registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameIsValid = validateName();
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();
    const confirmPasswordIsValid = validateConfirmPassword();

    if (nameIsValid && emailIsValid && passwordIsValid && confirmPasswordIsValid) {

        try {

            //Send request to backend
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value.trim()
                })
            });

            const data = await response.json();

            //Handle backend error
            if (!response.ok) {
                // If backend sent validation errors (array)
                if (Array.isArray(data)) {
                    alert(data.join("\n"));
                }
                else if (typeof data === "string") {
                    alert(data);
                }
                else {
                    alert("Registration failed");
                }

                return;
            }

            //Success message
            alert("Registration successful! Please login.");
            window.location.href = "login.html";

        } catch (error) {

            //Show backend error
            alert(error.message);
        }
    }
});


// If password is hidden
togglePassword.addEventListener("click", function () {

    if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    } 
    else {
        passwordField.type = "password";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    }

});

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        toggleConfirmPassword.classList.remove("fa-eye-slash");
        toggleConfirmPassword.classList.add("fa-eye");
    } 
    else {
        confirmPasswordField.type = "password";
        toggleConfirmPassword.classList.remove("fa-eye");
        toggleConfirmPassword.classList.add("fa-eye-slash");
    }

});
