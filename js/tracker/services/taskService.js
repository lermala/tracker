
// ===== Создание =====

function createTask({
    projectId,
    categoryId = null,
    dueDate = null,
    dueTime = null
}) {
    return createTaskModel({
        id: crypto.randomUUID(),

        projectId,
        categoryId,

        order: getNextTaskOrder(
            projectId,
            categoryId
        ),

        dueDate,
        dueTime
    });
}

async function addTask(task) {
    tasks.push(task);

    try {
        const savedTask = await createTaskInDb(task);

        Object.assign(task, savedTask);

        return task;
    } catch (error) {
        tasks = tasks.filter(
            item => item.id !== task.id
        );

        throw error;
    }
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

// выполнить задачу
async function toggleTask(id) {
    const task = getTaskById(id);

    if (!task) return;

    if (!task.isCompleted && task.startedAt !== null) {
        task.duration += Math.floor(
            (Date.now() - task.startedAt) / 1000
        );

        task.startedAt = null;
    }

    if (task.isCompleted) {
        task.completedAt = null;
    } else {
        task.completedAt = Date.now();
    }

    const savedTask = await updateTaskInDb(task);

    Object.assign(task, savedTask);

    return task;
}

// универсальный апдейт задачи
async function updateTask(id, changes) {
    const task = getTaskById(id);

    if (!task) return;

    Object.assign(task, changes);
    const savedTask = await updateTaskInDb(task);
    Object.assign(task, savedTask);

    return task;
}

async function updateTaskOrder(taskIds) {
    const changedTasks = [];

    taskIds.forEach((id, index) => {
        const task = getTaskById(id);

        if (!task) return;

        if (task.order !== index) {
            task.order = index;
            changedTasks.push(task);
        }
    });

    await Promise.all(
        changedTasks.map(task =>
            updateTaskInDb(task)
        )
    );
}

async function deleteTask(id) {
    await deleteTaskFromDb(id);

    tasks = tasks.filter(task => task.id !== id);
}