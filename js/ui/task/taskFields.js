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

function fillTaskDescription(
    description,
    task
) {
    if (!task.description) {
        description.textContent =
            "Добавить описание";

        description.classList.add(
            "is-empty"
        );

        return;
    }

    description.classList.remove(
        "is-empty"
    );

    renderMarkdown(
        description,
        task.description
    );
}

function bindTaskDescription(
    description,
    getTask,
    onUpdate
) {
    description.addEventListener(
        "click",
        event => {
            if (
                event.target.closest("a")
            ) {
                return;
            }

            const task =
                getTask();

            if (!task) return;

            startTextEdit(
                description,
                {
                    value:
                        task.description || "",

                    multiline: true,
                    enterToSave: false,

                    className:
                        "markdownEditor",

                    onSave:
                        async value => {
                            await updateTask(
                                task.id,
                                {
                                    description:
                                        value
                                }
                            );

                            fillTaskDescription(
                                description,
                                task
                            );

                            onUpdate?.();
                        }
                }
            );
        }
    );
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

    assigneeElement.classList.remove(
        "hidden"
    );

    if (!task.assigneeId) {
        assigneeElement.append(
            createEmptyUserBadge({
                compact
            })
        );

        return;
    }

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
                    await getProjectMembers(
                        task.projectId
                    );

                openSelectDropdown({
                    anchor:
                        assigneeElement,

                    items:
                        members,

                    selectedId:
                        task.assigneeId,

                    getId:
                        user => user.id,

                    renderItem:
                        user =>
                            createUserBadge(
                                user,
                                {
                                    isCurrentUser:
                                        user.id ===
                                        currentProfile?.id
                                }
                            ),

                    emptyItem: {
                        render: () =>
                            createEmptyUserBadge()
                    },

                    action: {
                        text:
                            "Пригласить в проект",

                        icon:
                            "person_add",

                        onClick: () => {
                            // позже
                        }
                    },

                    onSelect:
                        async assigneeId => {
                            await updateTask(
                                task.id,
                                {
                                    assigneeId
                                }
                            );

                            await fillTaskAssignee(
                                assigneeElement,
                                task,
                                {
                                    compact
                                }
                            );

                            onUpdate?.();
                        },

                    width: "250px"
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

function fillTaskEntity(
    element,
    entity,
    {
        emptyText,
        hideEmpty = false
    }
) {
    element.replaceChildren();

    if (!entity) {
        element.classList.toggle(
            "hidden",
            hideEmpty
        );

        if (!hideEmpty) {
            element.append(
                createEmptyBadge(
                    emptyText
                )
            );
        }

        return;
    }

    element.classList.remove("hidden");

    element.append(
        createBadge({
            text: entity.title,
            color: entity.color
        })
    );
}

function fillTaskCategory(
    element,
    task,
    options = {}
) {
    fillTaskEntity(
        element,
        getCategoryById(task.categoryId),
        {
            emptyText: "Без категории",
            ...options
        }
    );
}

function bindTaskCategory(
    categoryElement,
    getTask,
    {
        hideEmpty = false,
        onUpdate = null
    } = {}
) {
    categoryElement.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            const task = getTask();

            if (!task) return;

            const projectCategories =
                getCategoriesByProject(
                    task.projectId
                );

            async function setCategory(
                categoryId
            ) {
                await updateTask(
                    task.id,
                    {
                        categoryId
                    }
                );

                fillTaskCategory(
                    categoryElement,
                    task,
                    {
                        hideEmpty
                    }
                );

                onUpdate?.();
            }

            openSelectDropdown({
                anchor:
                    categoryElement,

                items:
                    projectCategories,

                selectedId:
                    task.categoryId,

                getId:
                    category =>
                        category.id,

                renderItem:
                    category =>
                        createBadge({
                            text:
                                category.title,
                            color:
                                category.color
                        }),

                emptyItem: {
                    render: () =>
                        createEmptyBadge(
                            "Без категории"
                        )
                },

                action: {
                    text:
                        "Создать категорию",

                    icon:
                        "add",

                    placeholder:
                        "Название категории",

                    onCreate:
                        async title => {
                            const category =
                                createCategory(
                                    task.projectId,
                                    title
                                );

                            if (!category) {
                                return;
                            }

                            await addCategory(
                                category
                            );

                            await setCategory(
                                category.id
                            );
                        }
                },

                onSelect:
                    setCategory,

                width: "220px"
            });
        }
    );
}


function fillTaskProject(
    element,
    task,
    options = {}
) {
    fillTaskEntity(
        element,
        getProjectById(task.projectId),
        {
            emptyText: "Без проекта",
            ...options
        }
    );
}