
// ===== Создание =====

function createTask({
    projectId,
    categoryId = null,
    dueDate = null
}) {
    return {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        duration: 0,

        projectId,
        categoryId,

        order: getNextTaskOrder(categoryId),

        isCompleted: false,
        isNew: true,

        createDate: Date.now(),
        startDate: null,
        completeDate: null,
        dueDate
    };
}


// ===== Получение =====

function getTaskById(id) {
    return tasks.find(task => task.id === id);
}

function getRunningTask() {
    return tasks.find(task => task.startDate !== null);
}

function getTasksByCategory(categoryId) {
    return tasks
        .filter(task => task.categoryId === categoryId)
        .sort((a, b) => a.order - b.order);
}

function getTasksByProject(projectId) {
    return tasks.filter(
        task => task.projectId === projectId
    );
}

function getNextTaskOrder(categoryId) {
    const categoryTasks =
        tasks.filter(task =>
            task.categoryId === categoryId
        );

    if (categoryTasks.length === 0)
        return 0;

    return Math.max(
        ...categoryTasks.map(task => task.order)
    ) + 1;
}


// ===== Изменение =====

function addTask(task) {
    tasks.push(task);
    saveTasks(tasks);
}

// выполнить задачу
function toggleTask(id) {
    const task = getTaskById(id);

    if (!task) return;

    if (!task.isCompleted && task.startDate !== null) {
        task.duration += Math.floor(
            (Date.now() - task.startDate) / 1000
        );
        task.startDate = null;
    }
    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
        task.completeDate = Date.now();
    } else {
        task.completeDate = null;
    }

    saveTasks(tasks);
}

// универсальный апдейт задачи
function updateTask(id, changes) {
    const task = getTaskById(id);

    if (!task) return;

    Object.assign(task, changes);

    saveTasks(tasks);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
}
