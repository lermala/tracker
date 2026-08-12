function startEditTask(taskElement, task) {
    const title = taskElement.querySelector(".taskTitle");

    startTextEdit(title, {
        value: task.title || "",
        multiline: true,
        enterToSave: true,
        className: "taskTitle",

        onSave: (value, reason) => {
            if (!value) {
                if (task.isNew) {
                    taskElement.remove();
                }

                return;
            }

            task.title = value;

            if (task.isNew) {
                delete task.isNew;
                addTask(task);
            } else {
                updateTask(task.id, {
                    title: value
                });
            }

            renderCurrentView();

            if (reason === "enter") {
                startEditNextTask(task);
            }
        },

        onCancel: () => {
            if (task.isNew) {
                taskElement.remove();
            } else {
                renderCurrentView();
            }
        }
    });
}

function finishEditTask(input, task, save) {
    const newTitle = input.textContent.trim();
    if (!save || newTitle === "") {
        if (!task.isNew) {
            renderCurrentView();
        } else {
            input.closest(".task").remove();
        }
        return;
    }
    task.title = newTitle;

    if (task.isNew) {
        delete task.isNew;
        addTask(task);
    } else {
        updateTask(task.id, {
            title: newTitle
        });
    }
    renderCurrentView();
}

function startEditDuration(duration, task) {
    if (task.startedAt !== null)
        return; // не редактируем запущенный таймер

    const input = document.createElement("input");

    input.type = "text";
    input.className = "taskInput timeInput";
    input.value = getCurrentDuration(task);

    duration.replaceWith(input);

    requestAnimationFrame(() => {
        input.focus();
        input.select();
    });

    input.addEventListener("blur", () =>
        finishEditDuration(input, task, true)
    );

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter")
            finishEditDuration(input, task, true);

        if (event.key === "Escape")
            finishEditDuration(input, task, false);
    });
}

function finishEditDuration(input, task, save) {
    if (!save) {
        renderCurrentView();
        return;
    }

    const match = input.value.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);

    if (!match) {
        alert("Формат: ЧЧ:ММ:СС");
        renderCurrentView();
        return;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = Number(match[3]);

    if (minutes > 59 || seconds > 59) {
        alert("Минуты и секунды должны быть меньше 60");
        renderCurrentView();
        return;
    }

    task.duration =
        hours * 3600 +
        minutes * 60 +
        seconds;

    updateTask(task.id, {
        duration: task.duration
    });

    renderCurrentView();
}

function startEditNextTask(task) {
    const taskElement = document.querySelector(
        `.task[data-task-id="${task.id}"]`
    );

    if (!taskElement) return;

    const groupItems = taskElement.closest(".taskGroupItems");

    if (!groupItems) return;

    const group = groupItems.taskGroup;

    if (!group?.newTaskData) return;

    const nextTask = createTask({
        projectId: viewSettings.projectId,
        ...group.newTaskData
    });

    const nextTaskElement = createTaskUI(nextTask);

    groupItems.append(nextTaskElement);

    startEditTask(nextTaskElement, nextTask);
}