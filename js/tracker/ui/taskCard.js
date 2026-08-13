let currentTaskId = null;
let taskCardElements = null;

async function initTaskCard() {
    const response = await fetch("taskCard.html");
    const html = await response.text();

    document.body.insertAdjacentHTML("beforeend", html);

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
        dueDate
    } = taskCardElements;

    closeButton.addEventListener("click", closeTaskCard);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeTaskCard();
        }
    });

    bindTaskCheckbox(
        status,
        () => getTaskById(currentTaskId),
        async toggle => {
            await toggle();
            renderCurrentView();
        }
    );

    title.addEventListener("click", () => {
        const task = getTaskById(currentTaskId);

        if (!task) return;

        startTextEdit(title, {
            value: task.title,
            multiline: true,
            enterToSave: true,
            className: "taskCardTitle",

            onSave: async (value) => {
                if (!value) return;

                await updateTask(task.id, {
                    title: value
                });

                title.textContent = value;

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
}

function openTaskCard(task) {
    const {
        overlay,
        closeButton,
        status,
        title,
        description,
        dueDate
    } = taskCardElements;

    currentTaskId = task.id;

    overlay.classList.remove("hidden");

    fillTaskCheckbox(status, task);
    title.textContent = task.title;
    fillTaskDescription(description, task);

    fillTaskDueDate(dueDate, task);
}

function closeTaskCard() {
    const overlay = document.getElementById("taskCardOverlay");

    overlay.classList.add("hidden");
    currentTaskId = null;
}

function getTaskCardElements() {
    return {
        overlay: document.getElementById("taskCardOverlay"),
        closeButton: document.getElementById("taskCardCloseButton"),
        status: document.getElementById("taskCardCheckbox"),
        title: document.getElementById("taskCardTitle"),
        description: document.getElementById("taskCardDescription"),
        dueDate: document.getElementById("taskCardDueDate")
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