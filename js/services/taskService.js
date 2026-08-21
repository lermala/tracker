
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

async function updateTask(id, changes) {
    const task = getTaskById(id);

    if (!task) return null;

    const previous = { ...task };

    Object.assign(task, changes);

    try {
        const savedTask =
            await updateTaskInDb(task);

        Object.assign(
            task,
            savedTask
        );

        return task;
    } catch (error) {
        Object.assign(
            task,
            previous
        );

        throw error;
    }
}

async function toggleTask(id) {
    const task = getTaskById(id);

    if (!task) {
        return null;
    }

    const shouldComplete = !task.isCompleted;

    if (shouldComplete) {
        const activeEntry =
            getActiveTimeEntryByTask(id);

        if (activeEntry) {
            await stopTimeEntry(activeEntry.id);
        }
    }

    return updateTask(id, {
        completedAt: shouldComplete
            ? Date.now()
            : null
    });
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
    const index = tasks.findIndex(
        task => task.id === id
    );

    if (index === -1) return;

    const task = tasks[index];

    // Сразу удаляем локально
    tasks.splice(index, 1);

    try {
        await deleteTaskFromDb(id);
    } catch (error) {
        // Если БД не удалила — возвращаем задачу
        tasks.splice(index, 0, task);

        throw error;
    }
}