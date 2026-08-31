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
restoreUrl();
initApp();

async function initApp() {
    showAppLoading();
    
    try {
        const session = await getCurrentSession();

        if (!session) {
            saveUrlBeforeAuth();
            window.location.replace(AUTH_PATH);
            return;
        }

        await loadTracker();
    } catch (error) {
        console.error("APP INIT ERROR:", error);
    } finally {
        hideAppLoading();
    }
}

async function loadTracker() {
    console.time("LOAD TRACKER");

    currentUser = await getCurrentUser();

    const [
        profile,
        loadedProjects,
        loadedCategories,
        loadedTasks
    ] = await Promise.all([
        getCurrentProfile(),
        getProjectsFromDb(),
        getCategoriesFromDb(),
        getTasksFromDb()
    ]);

    currentProfile = profile;
    projects = loadedProjects;
    categories = loadedCategories;
    tasks = loadedTasks;

    console.time("TIME ENTRIES");
    // await loadTimeEntries();
    console.timeEnd("TIME ENTRIES");

    console.time("INITIAL URL");
    const initialTask = await handleInitialUrl();
    console.timeEnd("INITIAL URL");

    console.time("START TRACKER");
    await startTracker();
    console.timeEnd("START TRACKER");

    if (initialTask) {
        openTaskCard(initialTask, {
            updateUrl: false
        });
    }

    console.timeEnd("LOAD TRACKER");
}

async function startTracker() {
    await initTaskCard();
    await renderUser();

    initUI();
    initRouter();

    startTaskTimerUI();
}

async function logout() {
    try {
        await signOut();

        stopTracker();

        window.location.replace(AUTH_PATH);
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

async function selectPage(page) {
    if (
        currentPage.type === page.type &&
        currentPage.id === page.id
    ) {
        return;
    }

    currentPage = page;

    if (currentPage.type === PAGE.TIMESHEET) {
        pageSettings = null;
    } else {
        pageSettings = getPageSettings(currentPage);
    }

        if (currentPage.type === PAGE.TIMESHEET) {
        await loadTimeEntries();
    }

    renderNavigation();
    renderToolbarUI();
    renderCurrentView();
}