const durationElements = new Map();
let timerInterval = null;

function startTaskTimerUI() {
    if (timerInterval !== null) {
        return;
    }

    updateRunningTimers();

    timerInterval = setInterval(
        updateRunningTimers,
        1000
    );
}

function stopTaskTimerUI() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    durationElements.clear();
}

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
    return formatDuration(
        getTaskDuration(task.id)
    );
}

function updateRunningTimers() {
    durationElements.forEach(
        (elements, taskId) => {

            const duration =
                formatDuration(
                    getTaskDuration(taskId)
                );

            elements.forEach(element => {
                element.textContent =
                    duration;
            });
        }
    );
}

async function toggleTaskTimer(task) {
    const activeEntry =
        getActiveTimeEntry();

    if (
        activeEntry?.taskId === task.id
    ) {
        return stopTimeEntry(
            activeEntry.id
        );
    }

    return startTimeEntry(task.id);
}

function cleanupDurationElements() {
    durationElements.forEach(
        (elements, taskId) => {

            elements.forEach(element => {
                if (!element.isConnected) {
                    elements.delete(element);
                }
            });

            if (elements.size === 0) {
                durationElements.delete(
                    taskId
                );
            }
        }
    );
}