
// ===== Создание =====

function createTask({
    projectId,
    categoryId = null,
    dueAt = null
}) {
    const now = Date.now();

    return createTaskModel({
        id: crypto.randomUUID(),

        projectId,
        categoryId,

        order: getNextTaskOrder(
            projectId,
            categoryId
        ),

        createdAt: now,
        updatedAt: now,

        dueAt
    });
}


// ===== Получение =====

function getTaskById(id) {
    return tasks.find(task => task.id === id);
}

function getRunningTask() {
    return tasks.find(task => task.startedAt !== null);
}

function getTasksByCategory(projectId, categoryId) {
    return tasks
        .filter(task =>
            task.projectId === projectId &&
            task.categoryId === categoryId
        )
        .sort((a, b) => a.order - b.order);
}

function getTasksByProject(projectId) {
    return tasks.filter(
        task => task.projectId === projectId
    );
}

function getNextTaskOrder(projectId, categoryId) {
    const categoryTasks = tasks.filter(task =>
        task.projectId === projectId &&
        task.categoryId === categoryId
    );

    if (categoryTasks.length === 0) {
        return 0;
    }

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

    // Если завершаем запущенную задачу — останавливаем таймер
    if (!task.isCompleted && task.startedAt !== null) {
        task.duration += Math.floor(
            (Date.now() - task.startedAt) / 1000
        );

        task.startedAt = null;
    }

    if (task.isCompleted) {
        // Возвращаем выполненную задачу в активные
        task.completedAt = null;
    } else {
        // Завершаем задачу
        task.completedAt = Date.now();
    }

    task.updatedAt = Date.now();

    saveTasks(tasks);
}

// универсальный апдейт задачи
function updateTask(id, changes) {
    const task = getTaskById(id);

    if (!task) return;

    Object.assign(task, changes);

    task.updatedAt = Date.now();

    saveTasks(tasks);
}

function updateTaskOrder(taskIds) {
    const now = Date.now();

    taskIds.forEach((id, index) => {
        const task = getTaskById(id);

        if (!task) return;

        if (task.order !== index) {
            task.order = index;
            task.updatedAt = now;
        }
    });

    saveTasks(tasks);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
}
