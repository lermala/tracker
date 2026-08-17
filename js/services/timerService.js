const durationElements = new Map();

function registerDurationElement(taskId, element) {
    if (!durationElements.has(taskId)) {
        durationElements.set(
            taskId,
            new Set()
        );
    }

    durationElements
        .get(taskId)
        .add(element);
}

function unregisterDurationElement(taskId, element) {
    const elements =
        durationElements.get(taskId);

    if (!elements) return;

    elements.delete(element);

    if (elements.size === 0) {
        durationElements.delete(taskId);
    }
}

function getCurrentDuration(task) {
    let seconds = task.duration;

    if (task.startedAt !== null) {
        seconds += Math.floor((Date.now() - task.startedAt) / 1000);
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function stopTask(task) {
    if (task.startedAt === null) {
        return Promise.resolve(task);
    }

    const duration =
        task.duration +
        Math.floor(
            (Date.now() - task.startedAt) / 1000
        );

    return updateTask(task.id, {
        duration,
        startedAt: null
    });
}

function updateRunningTimers() {
    tasks.forEach(task => {
        const elements =
            durationElements.get(task.id);

        if (!elements) return;

        const duration =
            getCurrentDuration(task);

        elements.forEach(element => {
            element.textContent = duration;
        });
    });
}

function stopAllRunningTasks(currentTaskId) { // todo запущена может быть только одна задача одновременно
    const runningTasks = tasks.filter(task =>
        task.id !== currentTaskId &&
        task.startedAt !== null
    );

    return Promise.all(
        runningTasks.map(task =>
            stopTask(task)
        )
    );
}

function toggleTaskTimer(task) {
    if (task.startedAt !== null) {
        return stopTask(task);
    }

    const stopPromise =
        stopAllRunningTasks(task.id);

    const startPromise =
        updateTask(task.id, {
            startedAt: Date.now()
        });

    return Promise.all([
        stopPromise,
        startPromise
    ]);
}

function cleanupDurationElements() {
    durationElements.forEach((elements, taskId) => {
        elements.forEach(element => {
            if (!element.isConnected) {
                elements.delete(element);
            }
        });

        if (elements.size === 0) {
            durationElements.delete(taskId);
        }
    });
}