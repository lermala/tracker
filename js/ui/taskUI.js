// const template = document.getElementById("taskTemplate");
const taskList = document.getElementById("task-list");

function initTaskUI() {
    renderCurrentView();
}

function fillTaskData(item, elements, task) {
    const { circle, title, duration, deleteButton, timerButton, timerButtonIcon, assignee } = elements;

    durationElements.set(task.id, duration); //todo
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
        duration: item.querySelector(".taskDuration"),
        dueDate: item.querySelector(".taskDueDate"),
        circle: item.querySelector(".taskCheckbox"),
        deleteButton: item.querySelector(".deleteButton"),
        timerButton: item.querySelector(".timerButton"),
        timerButtonIcon: item.querySelector(".timerButton span"),
        assignee: item.querySelector(".taskAssignee")
    };
}

function cloneTaskTemplate() {
    return taskTemplate.content.firstElementChild.cloneNode(true);
}

function bindTaskEvents(item, elements, task) {
    const { circle, title, dueDate, duration, deleteButton, timerButton, timerButtonIcon, assignee } = elements;

    bindTaskCheckbox(
        circle,
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

    bindTaskTimer(
        timerButton,
        () => task,
        () => {
            renderCurrentView();
        }
    );

    duration.addEventListener("click", () => {
        startEditDuration(duration, task);
    });

    bindTaskDueDate(
        dueDate,
        () => task,
        renderCurrentView
    );

    bindTaskAssignee(
        elements.assignee,
        () => getTaskById(task.id),
        {
            compact: false,
            hideEmpty: true
        }
    );

    item.addEventListener("click", (event) => {
        if (event.target.closest(
            ".taskCheckbox, .taskTitle, button, .taskDuration, .taskDueDate"
        )) {
            return;
        }

        openTaskCard(task);
    });
}

function updateTaskUI(task, item, elements) {
    const {
        circle,
        title,
        dueDate,
        duration,
        deleteButton,
        timerButton,
        timerButtonIcon
    } = elements;

    title.textContent = task.title;

    fillTaskDueDate(elements.dueDate, task);
    fillTaskTimer(duration, timerButtonIcon, task);
    fillTaskCheckbox(circle, task);
    fillTaskAssignee(
        elements.assignee,
        task,
        {
            compact: false,
            hideEmpty: true
        }
    );

    // Состояния задачи
    item.classList.toggle("is-completed", task.isCompleted);
    item.classList.toggle("is-running", task.startedAt !== null);
}