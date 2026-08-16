// const template = document.getElementById("taskTemplate");
const taskList = document.getElementById("task-list");

function initTaskUI() {
    renderCurrentView();
}

function fillTaskData(item, elements, task) {
    // durationElements.set(task.id, duration); //todo
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
        deleteButton: item.querySelector(".deleteButton"),
        properties: item.querySelector(".taskProperties"),
    };
}

function cloneTaskTemplate() {
    return taskTemplate.content.firstElementChild.cloneNode(true);
}

function bindTaskEvents(item, elements, task) {
    const { taskCheckbox, title, deleteButton } = elements;

    bindTaskCheckbox(
        taskCheckbox,
        () => task,
        toggle => {
            animateTaskReorder(() => {
                toggle().catch(error => {
                    console.error(
                        "TOGGLE TASK ERROR:",
                        error
                    );

                    renderCurrentView();
                });

                renderCurrentView();
            });
        }
    );

    // обработчики для редактирования title
    title.addEventListener("click", () => { //mousedown
        startEditTask(item, task);
    });

    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        animateTaskDelete(item, () => {
            deleteTask(task.id).catch(error => {
                console.error(
                    "DELETE TASK ERROR:",
                    error
                );

                // deleteTask сделал rollback
                renderCurrentView();
            });

            // задача уже удалена из локального tasks
            renderCurrentView();
        });
    });

    item.addEventListener("click", event => {
        if (event.target.closest(
            ".taskCheckbox, .taskTitle, button, .taskProperty, .taskDuration"
        )) {
            return;
        }

        openTaskCard(task);
    });
}

function updateTaskUI(task, item, elements) {
    const {
        taskCheckbox,
        title,
        deleteButton
    } = elements;

    title.textContent = task.title;
    fillTaskCheckbox(taskCheckbox, task);

    renderTaskProperties(
        elements.properties,
        task
    );

    // Состояния задачи
    item.classList.toggle("is-completed", task.isCompleted);
    item.classList.toggle("is-running", task.startedAt !== null);
}