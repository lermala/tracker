let authMode = "signIn";

const title = document.querySelector(".authTitle");
const subtitle = document.querySelector(".authSubtitle");

const emailInput = document.querySelector(".authEmail");
const passwordInput = document.querySelector(".authPassword");

const errorElement = document.querySelector(".authError");

const submitButton = document.querySelector(".authSubmit");
const switchButton = document.querySelector(".authSwitch");

submitButton.addEventListener("click", handleAuthSubmit);
switchButton.addEventListener("click", switchAuthMode);

function switchAuthMode() {
    authMode = authMode === "signIn"
        ? "signUp"
        : "signIn";

    const isSignIn = authMode === "signIn";

    title.textContent = isSignIn
        ? "Вход"
        : "Регистрация";

    subtitle.textContent = isSignIn
        ? "Войдите, чтобы продолжить работу"
        : "Создайте аккаунт, чтобы начать работу";

    submitButton.textContent = isSignIn
        ? "Войти"
        : "Зарегистрироваться";

    switchButton.textContent = isSignIn
        ? "Нет аккаунта? Зарегистрироваться"
        : "Уже есть аккаунт? Войти";

    errorElement.textContent = "";
}

async function handleAuthSubmit() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    errorElement.textContent = "";

    if (!email || !password) {
        errorElement.textContent =
            "Введите email и пароль";
        return;
    }

    try {
        if (authMode === "signIn") {
            await signIn(email, password);
        } else {
            const data = await signUp(email, password);

            if (!data.session) {
                errorElement.textContent =
                    "Проверьте почту и подтвердите регистрацию";
                return;
            }
        }

        window.location.href = "index.html";
    } catch (error) {
        errorElement.textContent = error.message;
    }
}