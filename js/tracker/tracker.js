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

 // migrateTasks();
// migrateCategories();


function migrateTasks() {
    let changed = false;

    tasks.forEach(task => {
        if (task.description === undefined) {
            task.description = "";
            changed = true;
        }
    });

    if (changed) {
        saveTasks(tasks);
    }
}