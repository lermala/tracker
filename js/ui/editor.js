function startEditTask(
    taskElement,
    task,
    isNew = false
) {
    const title = taskElement.querySelector(".taskTitle");

    startTextEdit(title, {
        value: task.title || "",
        multiline: true,
        enterToSave: true,
        className: "taskTitle",

        onSave: (value, reason) => {
            if (!value) {
                if (isNew) {
                    taskElement.remove();
                }

                return;
            }

            let savePromise;

            if (isNew) {
                task.title = value;
                savePromise = addTask(task);
            } else {
                savePromise = updateTask(task.id, {
                    title: value
                });
            }

            savePromise.catch(error => {
                console.error(
                    "SAVE TASK ERROR:",
                    error
                );

                renderCurrentView();
            });

            // UI обновляем сразу
            renderCurrentView();

            if (reason === "enter") {
                startEditNextTask(task);
            }
        },

        onCancel: () => {
            if (isNew) {
                taskElement.remove();
            } else {
                renderCurrentView();
            }
        }
    });
}

function finishEditDuration(input, task, save) {
    if (!save) {
        renderCurrentView();
        return;
    }

    const match = input.value.match(
        /^(\d{1,2}):(\d{2}):(\d{2})$/
    );

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

    const duration =
        hours * 3600 +
        minutes * 60 +
        seconds;

    updateTask(task.id, {
        duration
    }).catch(error => {
        console.error(
            "UPDATE TASK DURATION ERROR:",
            error
        );

        renderCurrentView();
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
        projectId: getCurrentProjectId(),
        ...group.newTaskData
    });

    const nextTaskElement = createTaskUI(nextTask);

    groupItems.append(nextTaskElement);

    startEditTask(nextTaskElement, nextTask, true);
}