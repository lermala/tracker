initAuthApp();

async function initAuthApp() {
    try {
        const session = await getCurrentSession();

        if (session) {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("AUTH INIT ERROR:", error);
    }
}