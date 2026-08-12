const template = document.getElementById("taskTemplate");
const taskList = document.getElementById("task-list");

function initTaskUI() {
    renderCurrentView();
}

function fillTaskData(item, elements, task) {
    const { circle, title, duration, deleteButton, timerButton, timerButtonIcon } = elements;

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
        dueAt: item.querySelector(".taskDueAt"),
        circle: item.querySelector(".taskCheckbox"),
        deleteButton: item.querySelector(".deleteButton"),
        timerButton: item.querySelector(".timerButton"),
        timerButtonIcon: item.querySelector(".timerButton span")
    };
}

function cloneTaskTemplate() {
    return taskTemplate.content.firstElementChild.cloneNode(true);
}

function bindTaskEvents(item, elements, task) {
    const { circle, title, dueAt, duration, deleteButton, timerButton, timerButtonIcon } = elements;

    // обработчик клика на кружок
    bindTaskCheckbox(
        circle,
        () => task,
        toggle => {
            animateTaskReorder(() => {
                toggle();
                renderCurrentView();
            });
        }
    );

    // обработчики для редактирования title
    title.addEventListener("click", () => { //mousedown
        startEditTask(item, task);
    });

    deleteButton.addEventListener("click", (event) => {
        animateTaskDelete(item, () => {
            animateTaskDelete(item, () => {
                deleteTask(task.id);
                renderCurrentView();
            });
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

    bindTaskDueAt(
        dueAt,
        () => task,
        renderCurrentView
    );

    item.addEventListener("click", (event) => {
        if (event.target.closest(
            ".taskCheckbox, .taskTitle, button, .taskDuration, .taskDueAt"
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
        dueAt,
        duration,
        deleteButton,
        timerButton,
        timerButtonIcon
    } = elements;

    title.textContent = task.title;

    fillTaskDueAt(elements.dueAt, task);
    fillTaskTimer(duration, timerButtonIcon, task);
    fillTaskCheckbox(circle, task);

    // Состояния задачи
    item.classList.toggle("is-completed", task.isCompleted);
    item.classList.toggle("is-running", task.startedAt !== null);
}