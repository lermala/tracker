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


// migrateCategories();


function migrateTask(task) {
    let changed = false;

    if ("createDate" in task) {
        task.createdAt = task.createDate;
        delete task.createDate;
        changed = true;
    }

    if ("startDate" in task) {
        task.startedAt = task.startDate;
        delete task.startDate;
        changed = true;
    }

    if ("completeDate" in task) {
        task.completedAt = task.completeDate;
        delete task.completeDate;
        changed = true;
    }

    if ("dueDate" in task) {
        task.dueAt = task.dueDate;
        delete task.dueDate;
        changed = true;
    }

    if (!("updatedAt" in task)) {
        task.updatedAt = task.createdAt ?? Date.now();
        changed = true;
    }

    return changed;
}