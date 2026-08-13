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

async function stopTask(task) {
    if (task.startedAt === null) return;

    const duration =
        task.duration +
        Math.floor(
            (Date.now() - task.startedAt) / 1000
        );

    await updateTask(task.id, {
        duration,
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

async function stopAllRunningTasks(currentTaskId) { // todo запущена может быть только одна задача одновременно
    const runningTasks = tasks.filter(task =>
        task.id !== currentTaskId &&
        task.startedAt !== null
    );

    await Promise.all(
        runningTasks.map(task =>
            stopTask(task)
        )
    );
}


async function toggleTaskTimer(task) {
    if (task.startedAt !== null) {
        await stopTask(task);
        return;
    }

    await stopAllRunningTasks(task.id);

    await updateTask(task.id, {
        startedAt: Date.now()
    });
}