let projects = loadProjects();
let tasks = getTasks();
let categories = getCategories();

tasks = tasks.map(prepareTask);

startTracker();

function startTracker() {
    initTaskCard();

    initUI();

    setInterval(updateRunningTimers, 1000);
}