let currentUser = null;
let currentProfile = null;

let projects = [];
let tasks = [];
let categories = [];

let timerInterval = null;

let currentPage = {
    type: PAGE.MY_TASKS
};
let currentProjectId = null;

let viewSettings = getViewSettings();
let pageSettings = getPageSettings(currentPage);

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
    currentUser = await getCurrentUser();
    currentProfile = await getCurrentProfile();

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

    currentUser = null;

    projects = [];
    categories = [];
    tasks = [];
}

function getCurrentProjectId() {
    return currentPage.type === PAGE.PROJECT
        ? currentPage.id
        : null;
}

function saveCurrentPageSettings() {
    savePageSettings(
        currentPage,
        pageSettings
    );
}

function selectPage(page) {
    if (
        currentPage.type === page.type &&
        currentPage.id === page.id
    ) {
        return;
    }

    currentPage = page;
    pageSettings = getPageSettings(currentPage);

    renderNavigation();
    renderToolbarUI();
    renderCurrentView();
}