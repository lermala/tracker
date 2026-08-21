let currentUser = null;
let currentProfile = null;

let projects = [];
let tasks = [];
let categories = [];

let currentPage = {
    type: PAGE.MY_TASKS
};
let currentProjectId = null;

let viewSettings = getViewSettings();
let pageSettings = getPageSettings(currentPage);

applyAppearance(getAppearance());
restoreEntityUrl();
initApp();

async function initApp() {
    try {
        const session = await getCurrentSession();

        if (!session) {
            saveUrlBeforeAuth();

            window.location.replace(
                `${BASE_PATH}/auth.html`
            );

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

    await loadTimeEntries();

    const initialTask = await handleInitialEntityUrl();

    await startTracker();

    if (initialTask) {
        openTaskCard(
            initialTask,
            {
                updateUrl: false
            }
        );
    }
}

async function startTracker() {
    await initTaskCard();
    await renderUser();

    initUI();
    initEntityRouter();

    startTaskTimerUI();
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
    stopTaskTimerUI();
    clearTimeEntries();

    currentUser = null;
    currentProfile = null;

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