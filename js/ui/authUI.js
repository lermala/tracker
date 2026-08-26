let authMode = "signIn";

const authContent = document.querySelector(".authContent");
const successElement = document.querySelector(".authSuccess");
const successEmail = document.querySelector(".authSuccessEmail");
const successButton = document.querySelector(".authSuccessButton");
const successTitle = document.querySelector(".authSuccessTitle");
const successText = document.querySelector(".authSuccessText");
const form = document.querySelector(".authFormFields");

const title = document.querySelector(".authTitle");
const subtitle = document.querySelector(".authSubtitle");

const emailInput = document.querySelector(".authEmail");
const passwordInput = document.querySelector(".authPassword");
const passwordToggle = document.querySelector(".authPasswordToggle");

const nameField = document.querySelector(".authNameField");
const nameInput = document.querySelector(".authName");

const errorElement = document.querySelector(".authError");

const submitButton = document.querySelector(".authSubmit");
const switchButton = document.querySelector(".authSwitch");


const forgotPasswordButton = document.querySelector(".authForgotPassword");

const recoveryElement = document.querySelector(".authRecovery");
const recoveryEmailInput = document.querySelector(".authRecoveryEmail");
const recoveryError = document.querySelector(".authRecoveryError");
const recoverySubmit = document.querySelector(".authRecoverySubmit");
const recoveryBack = document.querySelector(".authRecoveryBack");


form.addEventListener("submit", event => {
    event.preventDefault();
    handleAuthSubmit();
});

switchButton.addEventListener("click", switchAuthMode);
passwordToggle.addEventListener("click", togglePasswordVisibility);
successButton.addEventListener("click", hideAuthSuccess);

forgotPasswordButton.addEventListener("click", openPasswordRecovery);
recoveryBack.addEventListener("click", closePasswordRecovery);
recoverySubmit.addEventListener("click", handlePasswordRecovery);

function switchAuthMode() {
    authMode =
        authMode === "signIn"
            ? "signUp"
            : "signIn";

    const isSignUp =
        authMode === "signUp";

    nameField.hidden = !isSignUp;
    forgotPasswordButton.hidden = isSignUp;

    title.textContent =
        isSignUp
            ? "Регистрация"
            : "Вход";

    subtitle.textContent =
        isSignUp
            ? "Создайте аккаунт, чтобы начать работу"
            : "Войдите, чтобы продолжить работу";

    submitButton.textContent =
        isSignUp
            ? "Зарегистрироваться"
            : "Войти";

    switchButton.textContent =
        isSignUp
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться";

    passwordInput.autocomplete =
        isSignUp
            ? "new-password"
            : "current-password";

    errorElement.textContent = "";
}

async function handleAuthSubmit() {
    errorElement.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    if (!emailInput.validity.valid) {
        errorElement.textContent = "Введите корректный email";

        emailInput.focus();
        return;
    }

    const validationError =
        validateAuthForm(
            email,
            password
        );

    if (validationError) {
        errorElement.textContent =
            validationError;

        return;
    }

    if (
        authMode === "signUp" &&
        !name
    ) {
        errorElement.textContent =
            "Введите имя";

        nameInput.focus();
        return;
    }

    try {
        setAuthLoading(true);

        if (authMode === "signIn") {
            await signIn(email, password);
        } else {
            const data = await signUp(email, password, name);

            if (!data.session) {
                showRegistrationSuccess(email);
                return;
            }
        }

        redirectAfterAuth();
    } catch (error) {
        console.error("AUTH ERROR:", error);
        errorElement.textContent = getAuthErrorMessage(error);
    } finally {
        setAuthLoading(false);
    }
}

function togglePasswordVisibility() {
    const isVisible =
        passwordInput.type === "text";

    passwordInput.type =
        isVisible
            ? "password"
            : "text";

    const icon =
        passwordToggle.querySelector(
            ".material-symbols-rounded"
        );

    icon.textContent =
        isVisible
            ? "visibility"
            : "visibility_off";

    const label =
        isVisible
            ? "Показать пароль"
            : "Скрыть пароль";

    passwordToggle.title = label;
    passwordToggle.setAttribute(
        "aria-label",
        label
    );
}

function validateAuthForm(
    email,
    password
) {
    if (!email) {
        return "Введите email";
    }

    if (!email.includes("@")) {
        return "Введите корректный email";
    }

    if (!password) {
        return "Введите пароль";
    }

    return null;
}

function getAuthErrorMessage(error) {
    const message =
        error?.message?.toLowerCase() ?? "";

    if (
        message.includes("invalid login credentials")
    ) {
        return "Неверный email или пароль";
    }

    if (
        message.includes("invalid format") ||
        message.includes("email address") &&
        message.includes("invalid")
    ) {
        return "Введите корректный email";
    }

    if (
        message.includes("email not confirmed")
    ) {
        return "Подтвердите email перед входом";
    }

    if (
        message.includes("user already registered")
    ) {
        return "Пользователь с таким email уже зарегистрирован";
    }

    if (
        message.includes("password") &&
        message.includes("characters")
    ) {
        return "Пароль слишком короткий";
    }

    if (
        message.includes("signup is disabled")
    ) {
        return "Регистрация временно недоступна";
    }

    if (
        message.includes("rate limit") ||
        message.includes("security purposes")
    ) {
        return "Слишком много попыток. Попробуйте немного позже";
    }

    return "Не удалось выполнить операцию. Попробуйте ещё раз";
}

function showRegistrationSuccess(email) {
    authContent.hidden = true;
    successElement.hidden = false;

    successTitle.textContent = "Проверьте почту";
    successText.textContent = `Мы отправили ссылку для подтверждения регистрации на ${email}`;
}

function hideRegistrationSuccess() {
    successElement.hidden = true;
    authContent.hidden = false;

    if (authMode !== "signIn") {
        switchAuthMode();
    }

    passwordInput.value = "";
    errorElement.textContent = "";
    emailInput.focus();
}

function setAuthLoading(isLoading) {
    submitButton.disabled = isLoading;
    switchButton.disabled = isLoading;
    emailInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
    nameInput.disabled = isLoading;

    submitButton.classList.toggle("is-loading", isLoading);

    if (isLoading) {
        submitButton.textContent =
            authMode === "signUp"
                ? "Регистрация..."
                : "Вход...";

        return;
    }

    submitButton.textContent =
        authMode === "signUp"
            ? "Зарегистрироваться"
            : "Войти";
}

function openPasswordRecovery() {
    authContent.hidden = true;
    recoveryElement.hidden = false;

    recoveryEmailInput.value = emailInput.value;
    recoveryError.textContent = "";

    recoveryEmailInput.focus();
}

function closePasswordRecovery() {
    recoveryElement.hidden = true;
    authContent.hidden = false;

    recoveryError.textContent = "";
    emailInput.focus();
}

async function handlePasswordRecovery() {
    const email = recoveryEmailInput.value.trim();

    recoveryError.textContent = "";

    if (!email) {
        recoveryError.textContent = "Введите email";
        recoveryEmailInput.focus();
        return;
    }

    if (!recoveryEmailInput.validity.valid) {
        recoveryError.textContent = "Введите корректный email";
        recoveryEmailInput.focus();
        return;
    }

    try {
        recoverySubmit.disabled = true;
        recoverySubmit.textContent = "Отправка...";

        await requestPasswordReset(email);

        showPasswordRecoverySuccess(email);
    } catch (error) {
        console.error("PASSWORD RESET ERROR:", error);
        recoveryError.textContent = getAuthErrorMessage(error);
    } finally {
        recoverySubmit.disabled = false;
        recoverySubmit.textContent = "Отправить ссылку";
    }
}

function showPasswordRecoverySuccess(email) {
    recoveryElement.hidden = true;
    successElement.hidden = false;

    successTitle.textContent = "Проверьте почту";
    successText.textContent = `Мы отправили ссылку для восстановления пароля на ${email}`;
}

function hideAuthSuccess() {
    successElement.hidden = true;
    recoveryElement.hidden = true;
    authContent.hidden = false;

    if (authMode !== "signIn") {
        switchAuthMode();
    }

    passwordInput.value = "";
    errorElement.textContent = "";

    emailInput.focus();
}