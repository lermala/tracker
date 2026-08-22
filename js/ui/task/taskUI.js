// const template = document.getElementById("taskTemplate");
const taskList = document.getElementById("task-list");

function initTaskUI() {
    renderCurrentView();
}

function fillTaskData(item, elements, task) {
    updateTaskUI(task, item, elements);
}

function createTaskUI(task) {
    const item = cloneTaskTemplate();
    item.dataset.taskId = task.id;
    const elements = getTaskElements(item);

    bindTaskEvents(item, elements, task); // Обработчики
    fillTaskData(item, elements, task); // Отрисовка элементов

    return item;
}

function getTaskElements(item) {
    return {
        title: item.querySelector(".taskTitle"),
        taskCheckbox: item.querySelector(".taskCheckbox"),
        menuButton: item.querySelector(".menuButton"),
        properties: item.querySelector(".taskProperties"),
    };
}

function cloneTaskTemplate() {
    return taskTemplate.content.firstElementChild.cloneNode(true);
}

function bindTaskEvents(item, elements, task) {
    const { taskCheckbox, title, menuButton } = elements;

    bindTaskCheckbox(
        taskCheckbox,
        () => task,
        toggle => {
            animateTaskReorder(async () => {
                try {
                    await toggle();
                } catch (error) {
                    console.error(
                        "TOGGLE TASK ERROR:",
                        error
                    );
                }

                renderCurrentView();
            });
        }
    );

    bindTaskMenu(
        menuButton,
        () => getTaskById(task.id),
        {
            onEdit: () => {
                startEditTask(
                    item,
                    task
                );
            },

            onDelete: () => {
                animateTaskDelete(
                    item,
                    () => {
                        deleteTask(task.id)
                            .catch(error => {
                                console.error(
                                    "DELETE TASK ERROR:",
                                    error
                                );

                                renderCurrentView();
                            });

                        renderCurrentView();
                    }
                );
            }
        }
    );

    item.addEventListener("click", event => {
        if (event.target.closest(
            ".taskCheckbox, button, .taskProperty, .taskDuration"
        )) {
            return;
        }

        openTaskCard(task);
    });
}

function updateTaskUI(task, item, elements) {
    const {
        taskCheckbox,
        menuButton,
        title
    } = elements;

    fillTaskCheckbox(taskCheckbox, task);

    title.textContent = task.title;

    renderTaskDescription(
        title,
        task
    );

    renderTaskProperties(
        elements.properties,
        task
    );

    const isRunning = getActiveTimeEntry()?.taskId === task.id;
    // Состояния задачи
    item.classList.toggle("is-completed", task.isCompleted);
    item.classList.toggle("is-running", isRunning);
}

function renderTaskDescription(
    title,
    task
) {
    const current = title.nextElementSibling;
    if (current?.classList.contains("taskDescription")) {
        current.remove();
    }

    const description = createTaskDescription(task);
    if (!description) {
        return;
    }

    title.after(description);
}

function createTaskDescription(task) {
    const description = task.description?.trim();
    if (!description) {
        return null;
    }

    const element = document.createElement("div");
    element.className = "taskDescription";
    element.textContent = getDescriptionPreview(description);

    return element;
}