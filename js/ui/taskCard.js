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

    bindTaskCardEvents();
}

function bindTaskCardEvents() {
    const {
        overlay,
        closeButton,
        status,
        title,
        description,
        dueDate,
        priority
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
        status,
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
                        status,
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
}

function openTaskCard(task, {
    updateUrl = true
} = {}) {
    const {
        overlay,
        closeButton,
        status,
        title,
        description,
        dueDate,
        priority
    } = taskCardElements;

    currentTaskId = task.id;

    if (updateUrl) {
        setEntityUrl(
            ENTITY_URL.TASK,
            task.id
        );
    }

    overlay.classList.remove("hidden");

    fillTaskCheckbox(status, task);
    title.textContent = task.title;
    fillTaskDescription(description, task);

    fillTaskDueDate(dueDate, task);
    fillTaskPriority(priority, task);
}

function closeTaskCard({
    updateUrl = true
} = {}) {
    const overlay = document.getElementById("taskCardOverlay");

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
        status: document.getElementById("taskCardCheckbox"),
        title: document.getElementById("taskCardTitle"),
        description: document.getElementById("taskCardDescription"),
        dueDate: document.getElementById("taskCardDueDate"),
        priority: document.getElementById("taskCardPriority")
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