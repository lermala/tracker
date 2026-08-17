let currentTaskId = null;
let taskCardElements = null;

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
        () => getTaskById(currentTaskId),
        toggle => {
            toggle().catch(error => {
                console.error(
                    "TOGGLE TASK ERROR:",
                    error
                );

                const task =
                    getTaskById(currentTaskId);

                if (task) {
                    fillTaskCheckbox(
                        checkbox,
                        task
                    );
                }

                renderCurrentView();
            });

            renderCurrentView();
        }
    );

    title.addEventListener("click", () => {
        const task =
            getTaskById(currentTaskId);

        if (!task) return;

        startTextEdit(title, {
            value: task.title,
            multiline: true,
            enterToSave: true,
            className: "taskCardTitle",

            onSave: (value) => {
                if (!value) return;

                updateTask(task.id, {
                    title: value
                }).catch(error => {
                    console.error(
                        "UPDATE TASK TITLE ERROR:",
                        error
                    );

                    title.textContent =
                        task.title;

                    renderCurrentView();
                });

                title.textContent =
                    task.title;

                renderCurrentView();
            }
        });
    });

    bindTaskDescription(
        description,
        () => getTaskById(currentTaskId),
        renderCurrentView
    );

    bindTaskDueDate(
        dueDate,
        () => getTaskById(currentTaskId),
        renderCurrentView
    );

    bindTaskPriority(
        priority,
        () => getTaskById(currentTaskId),
        renderCurrentView
    );

    bindTaskAssignee(
        taskCardElements.assignee,
        () => getTaskById(currentTaskId)
    );

    bindTaskDuration(
        taskCardElements.timerControl.button,
        () => getTaskById(currentTaskId),
        () => {
            const task =
                getTaskById(currentTaskId);

            if (!task) return;

            fillTaskDuration(
                taskCardElements.timerControl.duration,
                taskCardElements.timerControl.icon,
                task
            );

            renderCurrentView();
        }
    );
}

function openTaskCard(task, {
    updateUrl = true
} = {}) {
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
    title.textContent = task.title;

    fillTaskAssignee(taskCardElements.assignee, task);
    fillTaskUser(
        taskCardElements.creator,
        task.createdById,
        {
            emptyText: "Неизвестно"
        }
    );
    fillTaskCheckbox(checkbox, task);
    fillTaskDescription(description, task);
    fillTaskDueDate(dueDate, task);
    fillTaskPriority(priority, task);

    fillTaskCardBadge(
        project,
        getProjectById(task.projectId),
        "Без проекта"
    );

    fillTaskCardBadge(
        category,
        getCategoryById(task.categoryId),
        "Без категории"
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

function renderTextWithLinks(element, text) {
    element.innerHTML = "";

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    parts.forEach(part => {
        if (part.match(/^https?:\/\//)) {
            const link = document.createElement("a");

            link.href = part;
            link.textContent = part;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            element.append(link);
        } else {
            element.append(
                document.createTextNode(part)
            );
        }
    });
}

function initTaskCardDuration() {
    const duration = createTaskTimer();

    taskCardElements.duration.append(
        duration.element
    );

    taskCardElements.timerControl = duration;
}