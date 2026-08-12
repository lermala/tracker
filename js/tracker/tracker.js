let projects = loadProjects();
let tasks = getTasks();
let categories = getCategories();


startTracker();

async function startTracker() {
    await initTaskCard();

    initUI();

    setInterval(updateRunningTimers, 1000);
}

// console.log(projects);
// console.log(tasks);
// console.log(categories);

let tasksMigrated = false;

tasks.forEach(task => {
    if (migrateTask(task)) {
        tasksMigrated = true;
    }
});

if (tasksMigrated) {
    saveTasks(tasks);
}

tasks = tasks.map(prepareTask);
console.log(tasks);


function migrateTask(task) {
    let changed = false;

    if ("isCompleted" in task) {
        delete task.isCompleted;
        changed = true;
    }

    return changed;
}