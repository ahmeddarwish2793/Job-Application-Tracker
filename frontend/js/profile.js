let cropper;

// AUTH CHECK

const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.token) {
    window.location.href = "login.html";
}

// ELEMENTS

const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");

const profileImage = document.getElementById("profileImage");
const avatarLetters = document.getElementById("avatarLetters");

const changeBtn = document.getElementById("changePhotoBtn");
const photoInput = document.getElementById("photoInput");
const imageToCrop = document.getElementById("imageToCrop");
const editor = document.getElementById("imageEditor");
const cropBtn = document.getElementById("cropBtn");

const updateBtn = document.getElementById("updateProfileBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

// LOAD USER DATA

fullNameInput.value = user.name;
emailInput.value = user.email;

// Show image OR initials
function renderAvatar() {

    if (user.profileImage) {

        profileImage.src =
            `http://localhost:8080/uploads/${user.profileImage}`;

        profileImage.style.display = "block";
        avatarLetters.style.display = "none";

    } else {

        const initials = user.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

        avatarLetters.textContent = initials;

        avatarLetters.style.display = "block";
        profileImage.style.display = "none";
    }
}

renderAvatar();


// PHOTO CHANGE + CROPPER

changeBtn.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        editor.style.display = "block";
        imageToCrop.src = e.target.result;

        if (cropper) cropper.destroy();

        cropper = new Cropper(imageToCrop, {
            aspectRatio: 1,
            viewMode: 1
        });
    };

    reader.readAsDataURL(file);
});


// CROP + UPLOAD TO BACKEND

cropBtn.addEventListener("click", async function () {

    const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200
    });

    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob);

    try {

        const response = await fetch(
            "http://localhost:8080/users/profile-image",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + user.token
                },
                body: formData
            }
        );

        if (!response.ok) {
            alert("Upload failed");
            return;
        }

        const updatedUser = await response.json();

        // Update localStorage with new image name
        user.profileImage = updatedUser.profileImage;
        localStorage.setItem("user", JSON.stringify(user));

        renderAvatar();

        editor.style.display = "none";

    } catch (error) {
        console.error(error);
        alert("Error uploading image");
    }
});


// UPDATE PROFILE (NAME ONLY)

updateBtn.addEventListener("click", function () {

    user.name = fullNameInput.value.trim();
    localStorage.setItem("user", JSON.stringify(user));

    renderAvatar();

    const toastElement = document.getElementById("successToast");
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
});


// Change Password

changePasswordBtn.addEventListener("click", async function () {

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const error = document.getElementById("passwordError");

    const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!regex.test(newPassword)) {
        error.innerText =
            "Password must contain at least 8 characters, one capital letter and one special character.";
        return;
    }

    if (newPassword !== confirmPassword) {
        error.innerText = "Passwords do not match.";
        return;
    }

    error.innerText = "";

    try {

        const response = await fetch(
            "http://localhost:8080/users/change-password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            error.innerText = data.message || "Error changing password";
            return;
        }

        // Close modal
        const modalElement =
            document.getElementById("resetPasswordModal");
        const modalInstance =
            bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        // Show success toast
        const toastElement =
            document.getElementById("passwordToast");
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Clear fields
        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

    } catch (err) {
        error.innerText = "Server error";
    }
});