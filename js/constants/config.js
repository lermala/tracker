const BASE_PATH =
    window.location.hostname.endsWith(".github.io")
        ? "/tracker"
        : "";

const AUTH_PATH = `${BASE_PATH}/auth.html`;

const REDIRECT_URL_KEY = "redirectAfterAuth";

function getAuthUrl() {
    return `${window.location.origin}${AUTH_PATH}`;
}