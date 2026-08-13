function fillTaskDueDate(dueDate, task) {
    dueDate.textContent = task.dueDate
        ? formatDueDate(
            task.dueDate,
            task.dueTime
        )
        : "Без срока";

    // Стили баджа срока выполнения
    const status = getDueDateStatus(task.dueDate);
    dueDate.classList.toggle(
        "is-empty",
        status === "empty"
    );
    dueDate.classList.toggle(
        "is-overdue",
        !task.isCompleted && status === "overdue"
    );
    dueDate.classList.toggle(
        "is-today",
        !task.isCompleted && status === "today"
    );
    dueDate.classList.toggle(
        "is-tomorrow",
        !task.isCompleted && status === "tomorrow"
    );
    dueDate.classList.toggle(
        "is-this-week",
        !task.isCompleted && status === "this-week"
    );
    dueDate.classList.toggle(
        "is-next-week",
        !task.isCompleted && status === "next-week"
    );
}

function bindTaskDueDate(
    dueDateElement,
    getTask,
    onUpdate
) {
    dueDateElement.addEventListener("click", (event) => {
        event.stopPropagation();

        const task = getTask();

        if (!task) return;

        openDatePicker({
            anchor: dueDateElement,

            value: {
                date: task.dueDate,
                time: task.dueTime
            },

            allowTime: true,

            onChange: ({ date, time }) => {
                updateTask(task.id, {
                    dueDate: date,
                    dueTime: time
                });

                fillTaskDueDate(
                    dueDateElement,
                    task
                );

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
    timerButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        const task = getTask();

        if (!task) return;

        toggleTaskTimer(task);

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
            const promise = toggleTask(task.id);

            fillTaskCheckbox(
                status,
                task
            );

            return promise;
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
    description.addEventListener("click", (event) => {
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

                fillTaskDescription(
                    description,
                    task
                );

                onUpdate?.();
            }
        });
    });
}