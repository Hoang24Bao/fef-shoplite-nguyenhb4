const registerForm = document.querySelector("#register-form");
const successBanner = document.querySelector("#form-success-banner");

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullNameInput = document.querySelector("#fullName");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const phoneInput = document.querySelector("#phone");
    const agreeTermsCheckbox = document.querySelector("#agreeTerms");

    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    successBanner.classList.add("d-none");

    let isFormValid = true;

    if (fullNameInput.value.trim() === "") {
        document.querySelector("#err-fullName").textContent = "Full name cannot be empty!";
        isFormValid = false;
    }

    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        document.querySelector("#err-email").textContent = "Email address is required!";
        isFormValid = false;
    } else if (!emailRegex.test(emailValue)) {
        document.querySelector("#err-email").textContent =
            "Invalid email format (missing @ symbol or domain extension)!";
        isFormValid = false;
    }

    if (passwordInput.value.length < 6) {
        document.querySelector("#err-password").textContent =
            "Password must be at least 6 characters long!";
        isFormValid = false;
    }

    if (phoneInput.value.trim() === "") {
        document.querySelector("#err-phone").textContent =
            "Phone number cannot be empty!";
        isFormValid = false;
    }

    if (!agreeTermsCheckbox.checked) {
        document.querySelector("#err-agreeTerms").textContent =
            "You must agree to all terms and conditions to continue!";
        isFormValid = false;
    }

    if (!isFormValid) {
        return;
    }

    const successModalElement = document.querySelector("#successModal");
    const bootstrapModalInstance = new bootstrap.Modal(successModalElement);
    
    bootstrapModalInstance.show();

    registerForm.reset();
});