let currentTaskId = null;
let taskCardElements = null;
let taskCardSaving = false;

function getTaskCardTask() {
    return getTaskById(currentTaskId);
}

async function saveTaskCardChanges(id, changes) {
    return updateTask(id, changes);
}

async function initTaskCard() {
    const response = await fetch(
        `${BASE_PATH}/taskCard.html`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to load taskCard.html: ${response.status}`
        );
    }

    const html = await response.text();

    document.body.insertAdjacentHTML(
        "beforeend",
        html
    );

    taskCardElements = getTaskCardElements();
    initTaskCardDuration();

    bindTaskCardEvents();
}

function bindTaskCardEvents() {
    const {
        overlay,
        closeButton,
        checkbox,
        title,
        description,
        dueDate,
        priority,
        project,
        category,
        duration
    } = taskCardElements;

    bindTaskMenu(taskCardElements.menuButton, getTaskCardTask, {
        onEdit: () => title.click(),
        onDelete: async () => {
            const task = getTaskCardTask();
            if (!task) return;
            try {
                await deleteTask(task.id);
                if (currentTaskId === task.id) closeTaskCard();
            } catch (error) {
                console.error("DELETE TASK ERROR:", error);
            }
            renderCurrentView();
        },
        onUpdate: () => {
            const task = getTaskCardTask();
            if (!task) return;
            fillTaskDueDate(dueDate, task);
            fillTaskPriority(priority, task);
            fillTaskCheckbox(checkbox, task);
            fillTaskProject(project, task);
            fillTaskCategory(category, task);
            fillTaskAssignee(taskCardElements.assignee, task);
        }
    });


    project.addEventListener("click", () => {
        const task = getTaskCardTask();
        if (!task) return;
        openTaskProjectPicker(project, task, () => {
            if (currentTaskId !== task.id) return;
            fillTaskProject(project, task);
            fillTaskCategory(category, task);
            fillTaskAssignee(taskCardElements.assignee, task);
        });
    });

    closeButton.addEventListener(
        "click",
        closeTaskCard
    );

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeTaskCard();
        }
    });

    bindTaskCheckbox(
        checkbox,
        () => getTaskCardTask(),
        async toggle => {
            try {
                await toggle();
            } catch (error) {
                console.error(
                    "TOGGLE TASK ERROR:",
                    error
                );

                const task =
                    getTaskCardTask();

                if (task) {
                    fillTaskCheckbox(
                        checkbox,
                        task
                    );
                }
            }

            renderCurrentView();
        }
    );

    title.addEventListener("click", () => {
        const task =
            getTaskCardTask();

        if (!task) return;

        startTextEdit(title, {
            value: task.title,
            multiline: true,
            maxLength: TASK_LIMITS.TITLE,
            enterToSave: true,
            className: "taskCardTitle",

            onSave: (value) => {
                saveTaskCardChanges(task.id, {
                    title: value || "Новая задача"
                }).catch(error => {
                    console.error(
                        "UPDATE TASK TITLE ERROR:",
                        error
                    );

                    title.textContent =
                        task.title || "Название задачи";

                    renderCurrentView();
                });

                title.textContent =
                    task.title || "Название задачи";

                renderCurrentView();
            }
        });
    });

    bindTaskDescription(
        description,
        () => getTaskCardTask(),
        renderCurrentView,
        saveTaskCardChanges
    );

    bindTaskDueDate(
        dueDate,
        () => getTaskCardTask(),
        renderCurrentView,
        saveTaskCardChanges
    );

    bindTaskPriority(
        priority,
        () => getTaskCardTask(),
        renderCurrentView,
        saveTaskCardChanges
    );

    bindTaskAssignee(
        taskCardElements.assignee,
        () => getTaskCardTask(),
        { saveTask: saveTaskCardChanges }
    );

    bindTaskDuration(
        taskCardElements.timerControl.button,
        () => getTaskCardTask(),
        () => {
            const task =
                getTaskCardTask();

            if (!task) return;

            fillTaskDuration(
                taskCardElements.timerControl.duration,
                taskCardElements.timerControl.icon,
                task
            );

            renderCurrentView();
        }
    );

    bindTaskCategory(
        category,
        getTaskCardTask,

        {
            saveTask: saveTaskCardChanges,
            onUpdate: () => {
                renderCurrentView();
            }
        }
    );
}

function openTaskCard(task, {
    updateUrl = true
} = {}) {
    if (taskCardSaving) return;
    document.activeElement?.blur();
    const {
        overlay,
        closeButton,
        checkbox,
        title,
        description,
        assignee,
        creator,
        dueDate,
        priority,
        project,
        category,
        duration
    } = taskCardElements;

    if (currentTaskId) {
        unregisterDurationElement(
            currentTaskId,
            taskCardElements.timerControl.duration
        );
    }

    currentTaskId = task.id;

    if (updateUrl) {
        setEntityUrl(
            ENTITY_URL.TASK,
            task.id
        );
    }

    overlay.classList.remove("hidden");
    title.textContent = task.title || "Название задачи";

    fillTaskAssignee(taskCardElements.assignee, task);
    fillTaskUser(
        taskCardElements.creator,
        task.createdById,
        {
            emptyText: "Неизвестно"
        }
    );
    fillTaskCheckbox(checkbox, task);
    fillTaskDescription(description, task, saveTaskCardChanges);
    fillTaskDueDate(dueDate, task);
    fillTaskPriority(priority, task);

    fillTaskProject(
        project,
        task
    );

    fillTaskCategory(
        category,
        task
    );

    fillTaskDuration(
        taskCardElements.timerControl.duration,
        taskCardElements.timerControl.icon,
        task
    );
    registerDurationElement(
        task.id,
        taskCardElements.timerControl.duration
    );
}

function closeTaskCard({
    updateUrl = true
} = {}) {
    if (taskCardSaving) return;
    document.activeElement?.blur();
    const overlay = document.getElementById("taskCardOverlay");

    if (currentTaskId) {
        unregisterDurationElement(
            currentTaskId,
            taskCardElements.timerControl.duration
        );
    }

    overlay.classList.add("hidden");
    currentTaskId = null;

    if (updateUrl) {
        syncUrlWithCurrentPage();
    }
}

function getTaskCardElements() {
    return {
        overlay: document.getElementById("taskCardOverlay"),
        menuButton: document.getElementById("taskCardMenuButton"),
        closeButton: document.getElementById("taskCardCloseButton"),

        checkbox: document.getElementById("taskCardCheckbox"),
        title: document.getElementById("taskCardTitle"),
        description: document.getElementById("taskCardDescription"),

        assignee: document.getElementById("taskCardAssignee"),
        creator: document.getElementById("taskCardCreator"),
        dueDate: document.getElementById("taskCardDueDate"),
        priority: document.getElementById("taskCardPriority"),

        duration: document.getElementById("taskCardDuration"),
        project: document.getElementById("taskCardProject"),
        category: document.getElementById("taskCardCategory")
    };
}

function initTaskCardDuration() {
    const duration = createTaskTimer();

    taskCardElements.duration.append(
        duration.element
    );

    taskCardElements.timerControl = duration;
}
async function openCreateTaskCard({
    projectId = getCurrentProjectId(),
    categoryId = null,
    dueDate = null,
    dueTime = null
} = {}) {
    if (taskCardSaving) return;
    taskCardSaving = true;
    const task = createTask({ projectId, categoryId, dueDate, dueTime });
    // task.title = "Новая задача";
    try {
        await addTask(task);
    } catch (error) {
        console.error("CREATE TASK ERROR:", error);
        return;
    } finally {
        taskCardSaving = false;
        renderCurrentView();
    }
    openTaskCard(task);
    taskCardElements.title.click();
}
