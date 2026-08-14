let projects = [];
let tasks = [];
let categories = [];

let timerInterval = null;

applyAppearance(getAppearance());
initApp();

async function initApp() {
    try {
        const session = await getCurrentSession();

        if (!session) {
            window.location.href = "auth.html";
            return;
        }

        await loadTracker();
    } catch (error) {
        console.error("APP INIT ERROR:", error);
    }
}

async function loadTracker() {
    [projects, categories, tasks] = await Promise.all([
        getProjectsFromDb(),
        getCategoriesFromDb(),
        getTasksFromDb()
    ]);

    await startTracker();
}

async function startTracker() {
    await initTaskCard();
    await renderUser();

    initUI();

    if (timerInterval === null) {
        timerInterval = setInterval(
            updateRunningTimers,
            1000
        );
    }
}

async function logout() {
    try {
        await signOut();

        stopTracker();

        window.location.href = "auth.html";
    } catch (error) {
        console.error("SIGN OUT ERROR:", error);
    }
}

function stopTracker() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    projects = [];
    categories = [];
    tasks = [];
}