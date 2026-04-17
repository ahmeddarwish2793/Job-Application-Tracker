// Get user object from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));

// If no user OR no token inside user → redirect
if (!storedUser || !storedUser.token) {
    window.location.href = "login.html";
}