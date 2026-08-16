// Здесь находится логика отображения 
// и редактирования отдельных полей Task

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
        task.dueDate == null
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

function fillTaskDuration(duration, timerButtonIcon, task) {
    duration.textContent = getCurrentDuration(task);

    timerButtonIcon.textContent =
        task.startedAt === null
            ? "play_circle"
            : "pause_circle";
}

function bindTaskDuration(
    timerButton,
    getTask,
    onUpdate
) {
    timerButton.addEventListener("click", async event => {
        event.stopPropagation();

        const task = getTask();

        if (!task) return;

        await toggleTaskTimer(task);

        onUpdate?.();
    });
}

function fillTaskCheckbox(status, task) {
    status.classList.toggle(
        "is-completed",
        task.isCompleted
    );

    status.dataset.priority = task.priority;
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

const TASK_PRIORITY_LABELS = {
    [TASK_PRIORITY.NONE]: "Без приоритета",
    [TASK_PRIORITY.LOW]: "Низкий",
    [TASK_PRIORITY.MEDIUM]: "Средний",
    [TASK_PRIORITY.HIGH]: "Высокий"
};

function fillTaskPriority(priorityElement, task) {
    const dot = priorityElement.querySelector(
        ".priorityDot"
    );

    const text = priorityElement.querySelector(
        ".taskPriorityText"
    );

    dot.dataset.priority = task.priority;

    if (text) {
        text.textContent =
            TASK_PRIORITY_LABELS[task.priority];
    }
}

function bindTaskPriority(
    priorityElement,
    getTask,
    onUpdate
) {
    priorityElement.addEventListener("click", event => {
        event.stopPropagation();

        const task = getTask();
        if (!task) return;

        openPriorityPicker({
            anchor: priorityElement,
            value: task.priority,

            onChange: priority => {
                updateTask(task.id, {
                    priority
                });

                fillTaskPriority(
                    priorityElement,
                    task
                );

                onUpdate?.();
            }
        });
    });
}

async function fillTaskUser(
    element,
    profileId,
    {
        compact = false,
        emptyText = ""
    } = {}
) {
    element.replaceChildren();

    if (!profileId) {
        element.textContent = emptyText;
        return;
    }

    try {
        const profile =
            await getProfileById(profileId);

        if (!profile) {
            element.textContent = emptyText;
            return;
        }

        element.replaceChildren(
            createUserBadge(profile, {
                compact,
                isCurrentUser:
                    profile.id === currentProfile?.id
            })
        );
    } catch (error) {
        console.error(
            "LOAD TASK USER ERROR:",
            error
        );

        element.textContent = emptyText;
    }
}

async function fillTaskAssignee(
    assigneeElement,
    task,
    {
        compact = false
    } = {}
) {
    assigneeElement.replaceChildren();

    if (!task.assigneeId) {
        assigneeElement.classList.remove("hidden");
        assigneeElement.textContent = "Не назначено";

        return;
    }
    assigneeElement.classList.remove("hidden");

    await fillTaskUser(
        assigneeElement,
        task.assigneeId,
        {
            compact
        }
    );
}

function bindTaskAssignee(
    assigneeElement,
    getTask,
    {
        compact = false,
        onUpdate = null
    } = {}
) {
    assigneeElement.addEventListener(
        "click",
        async event => {
            event.stopPropagation();

            const task = getTask();

            if (!task) return;

            try {
                const members =
                    await getProjectMembers(task.projectId);

                openUserPicker({
                    anchor: assigneeElement,
                    users: members,
                    selectedId: task.assigneeId,
                    allowEmpty: true,

                    onSelect: async assigneeId => {
                        await updateTask(task.id, {
                            assigneeId
                        });

                        fillTaskAssignee(
                            assigneeElement,
                            task,
                            {
                                compact
                            }
                        );

                        onUpdate?.();
                    },

                    onInvite: () => {
                        // позже
                    }
                });
            } catch (error) {
                console.error(
                    "LOAD PROJECT MEMBERS ERROR:",
                    error
                );
            }
        }
    );
}