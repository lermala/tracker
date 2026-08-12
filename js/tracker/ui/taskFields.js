function fillTaskDueAt(dueAt, task) {
    dueAt.textContent = task.dueAt
        ? formatDueAt(task.dueAt)
        : "Без срока";

    // Стили баджа срока выполнения
    const dueAtStatus = getDueAtStatus(task.dueAt);
    dueAt.classList.toggle(
        "is-empty",
        dueAtStatus === "empty"
    );
    dueAt.classList.toggle(
        "is-overdue",
        !task.isCompleted && dueAtStatus === "overdue"
    );
    dueAt.classList.toggle(
        "is-today",
        !task.isCompleted && dueAtStatus === "today"
    );
    dueAt.classList.toggle(
        "is-tomorrow",
        !task.isCompleted && dueAtStatus === "tomorrow"
    );
    dueAt.classList.toggle(
        "is-this-week",
        !task.isCompleted && dueAtStatus === "this-week"
    );
    dueAt.classList.toggle(
        "is-next-week",
        !task.isCompleted && dueAtStatus === "next-week"
    );
}

function bindTaskDueAt(dueAt, getTask, onUpdate) {
    dueAt.addEventListener("click", (event) => {
        event.stopPropagation();

        const task = getTask();

        if (!task) return;

        openDatePicker({
            anchor: dueAt,
            value: task.dueAt,
            allowTime: true,

            onChange: (value) => {
                updateTask(task.id, {
                    dueAt: value
                });

                fillTaskDueAt(dueAt, task);

                onUpdate?.();
            }
        });
    });
}

function fillTaskTimer(duration, timerButtonIcon, task) {
    duration.textContent = getCurrentDuration(task);

    timerButtonIcon.textContent =
        task.startedAt === null
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

        if (task.startedAt === null) {
            stopAllRunningTasks(task.id);

            updateTask(task.id, {
                startedAt: Date.now()
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