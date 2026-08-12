function fillTaskDueDate(dueDate, task) {
    dueDate.textContent = task.dueDate
        ? formatDueDate(task.dueDate)
        : "Без срока";

    // Стили баджа срока выполнения
    const dueDateStatus = getDueDateStatus(task.dueDate);
    dueDate.classList.toggle(
        "is-empty",
        dueDateStatus === "empty"
    );
    dueDate.classList.toggle(
        "is-overdue",
        !task.isCompleted && dueDateStatus === "overdue"
    );
    dueDate.classList.toggle(
        "is-today",
        !task.isCompleted && dueDateStatus === "today"
    );
    dueDate.classList.toggle(
        "is-tomorrow",
        !task.isCompleted && dueDateStatus === "tomorrow"
    );
    dueDate.classList.toggle(
        "is-this-week",
        !task.isCompleted && dueDateStatus === "this-week"
    );
    dueDate.classList.toggle(
        "is-next-week",
        !task.isCompleted && dueDateStatus === "next-week"
    );
}

function bindTaskDueDate(dueDate, getTask, onUpdate) {
    dueDate.addEventListener("click", (event) => {
        event.stopPropagation();

        const task = getTask();

        if (!task) return;

        openDatePicker({
            anchor: dueDate,
            value: task.dueDate,
            allowTime: true,

            onChange: (value) => {
                updateTask(task.id, {
                    dueDate: value
                });

                fillTaskDueDate(dueDate, task);

                onUpdate?.();
            }
        });
    });
}

function fillTaskTimer(duration, timerButtonIcon, task) {
    duration.textContent = getCurrentDuration(task);

    timerButtonIcon.textContent =
        task.startDate === null
            ? "play_circle"
            : "pause_circle";
}

function bindTaskTimer(
    timerButton,
    getTask,
    onUpdate
) {
    timerButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const task = getTask();

        if (!task) return;

        if (task.startDate === null) {
            stopAllRunningTasks(task.id);

            task.startDate = Date.now();

            updateTask(task.id, {
                startDate: task.startDate
            });
        } else {
            stopTask(task);
        }

        onUpdate?.();
    });
}

function fillTaskCheckbox(status, task) {
    status.classList.toggle(
        "is-completed",
        task.isCompleted
    );
}

function bindTaskCheckbox(status, getTask, onToggle) {
    status.addEventListener("click", (event) => {
        event.stopPropagation();

        const task = getTask();

        if (!task) return;

        const toggle = () => {
            toggleTask(task.id);
            fillTaskCheckbox(status, task);
        };

        onToggle(toggle);
    });
}

function fillTaskDescription(description, task) {
    if (task.description) {
        renderTextWithLinks(
            description,
            task.description
        );

        description.classList.remove("is-empty");
    } else {
        description.textContent = "Добавить описание";
        description.classList.add("is-empty");
    }
}

function bindTaskDescription(description, getTask, onUpdate) {
    description.addEventListener("click", () => {
        // Клик по ссылке — просто открываем ссылку,
        // редактирование description не запускаем
        if (event.target.closest("a")) {
            return;
        }

        const task = getTask();

        if (!task) return;

        startTextEdit(description, {
            value: task.description || "",
            multiline: true,
            enterToSave: false,
            className: "taskCardDescription",

            onSave: (value) => {
                updateTask(task.id, {
                    description: value
                });

                task.description = value;

                fillTaskDescription(description, task);

                onUpdate?.();
            }
        });
    });
}