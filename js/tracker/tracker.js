let projects = [];
let tasks = [];
let categories = [];

initApp();

async function initApp() {
    try {
        [projects, categories, tasks] = await Promise.all([
            getProjectsFromDb(),
            getCategoriesFromDb(),
            getTasksFromDb()
        ]);

        await startTracker();
    } catch (error) {
        console.error("APP INIT ERROR:", error);
    }
}

async function startTracker() {
    await initTaskCard();

    initUI();

    setInterval(updateRunningTimers, 1000);
}