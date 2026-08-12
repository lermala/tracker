const durationElements = new Map(); // ссылки на элементы времени

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
    if (task.startedAt === null)
        return;

    task.duration += Math.floor(
        (Date.now() - task.startedAt) / 1000
    );

    task.startedAt = null;

    updateTask(task.id, {
        duration: task.duration,
        startedAt: null
    });
}

function updateRunningTimers() {
    tasks.forEach(task => {
        const duration = durationElements.get(task.id);
        if (!duration) return;
        duration.textContent = getCurrentDuration(task);
    });
}

function stopAllRunningTasks(currentTaskId) {
    tasks.forEach(task => {
        if (task.id !== currentTaskId) {
            stopTask(task);
        }
    });
}
