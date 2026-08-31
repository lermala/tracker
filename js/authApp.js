initAuthApp();

async function initAuthApp() {
    showAppLoading();
    
    try {
        const session = await getCurrentSession();

        if (session) {
            redirectAfterAuth();
        }
    } catch (error) {
        console.error(
            "AUTH INIT ERROR:",
            error
        );
    } finally {
        hideAppLoading();
    }
}

function redirectAfterAuth() {
    const redirectUrl = sessionStorage.getItem(
        REDIRECT_URL_KEY
    );

    if (redirectUrl) {
        sessionStorage.removeItem(
            REDIRECT_URL_KEY
        );

        window.location.replace(
            redirectUrl
        );

        return;
    }

    window.location.replace(
        `${BASE_PATH}/`
    );
}