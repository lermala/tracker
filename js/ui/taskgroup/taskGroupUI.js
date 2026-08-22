const taskGroupTemplate = document.getElementById("taskGroupTemplate");


function createTaskGroup(group) {
    const item = cloneTaskGroupTemplate();
    const elements = getTaskGroupElements(item);

    item.dataset.groupField = group.field ?? "";
    item.dataset.groupValue = group.value ?? "";

    fillTaskGroupData(
        elements,
        group
    );

    const isCategory =
        group.field === "categoryId" &&
        group.value !== null;

    const color = getTaskGroupColor(group);
    if (color) {
        item.style.setProperty(
            "--badge-color",
            color
        );
    }

    elements.menuButton.hidden = !isCategory;
    elements.addButton.hidden = group.newTaskData == null;
    bindTaskGroupEvents(
        item,
        elements,
        group
    );

    group.tasks.forEach(task => {
        elements.items.append(
            createTaskUI(task)
        );
    });

    elements.items.taskGroup = group;

    if (
        group.field === "categoryId"
    ) {
        initTaskSortable(
            elements.items
        );
    }

    return item;
}

function bindTaskGroupEvents(item, elements, group) {
    const isCategory =
        group.field === "categoryId" &&
        group.value !== null;

    // Редактирование раздела
    if (isCategory) {
        elements.title.addEventListener("click", () => {
            startEditTaskGroup(item);
        });

        elements.menuButton.addEventListener(
            "click",
            event => {
                event.stopPropagation();

                openTaskGroupSettingsMenu({
                    anchor:
                        elements.menuButton,

                    color:
                        getCategoryById(
                            group.value
                        )?.color ?? null,

                    onEdit: () => {
                        startEditTaskGroup(
                            item
                        );
                    },

                    onDelete: async () => {
                        const confirmed =
                            confirm(
                                `Удалить раздел «${group.title}»? Все задачи в нем перейдут в «Без раздела».`
                            );

                        if (!confirmed) {
                            return;
                        }

                        try {
                            await deleteTaskGroup(
                                group.field,
                                group.value
                            );

                            renderCurrentView();
                        } catch (error) {
                            console.error(
                                "DELETE TASK GROUP ERROR:",
                                error
                            );

                            renderCurrentView();
                        }
                    },

                    onColorChange:
                        async color => {
                            try {
                                await updateTaskGroupColor(
                                    group.field,
                                    group.value,
                                    color
                                );

                                renderCurrentView();
                            } catch (error) {
                                console.error(
                                    "UPDATE TASK GROUP COLOR ERROR:",
                                    error
                                );

                                renderCurrentView();
                            }
                        }
                });
            }
        );
    }

    // Добавление задачи
    if (group.newTaskData != null) {
        elements.addButton.addEventListener("click", () => {
            const task = createTask({
                projectId: getCurrentProjectId(),
                ...group.newTaskData
            });

            const taskElement = createTaskUI(task);

            elements.items.append(taskElement);
            startEditTask(taskElement, task, true);
        });
    }
}

function getTaskGroupElements(item) {
    return {
        title: item.querySelector(".taskGroupTitle"),
        counter: item.querySelector(".taskGroupCounter"),
        items: item.querySelector(".taskGroupItems"),
        addButton: item.querySelector(".addButton"),
        menuButton: item.querySelector(".taskGroupMenuButton")
    };
}

function fillTaskGroupData(elements, group) {
    elements.title.textContent = group.title;
    elements.counter.textContent = group.tasks.length;
}

function cloneTaskGroupTemplate() {
    return taskGroupTemplate.content.firstElementChild.cloneNode(true);
}

function startEditTaskGroup(groupElement, isNew = false) {
    const title = groupElement.querySelector(".taskGroupTitle");

    const groupField = groupElement.dataset.groupField;
    const groupValue = groupElement.dataset.groupValue;

    startTextEdit(title, {
        value: title.textContent.trim(),
        className: "taskGroupTitle",
        maxLength: CATEGORY_LIMITS.TITLE,

        onSave: (value) => {
            if (!value) {
                if (isNew) {
                    deleteTaskGroup(
                        groupField,
                        groupValue
                    ).catch(error => {
                        console.error(
                            "DELETE TASK GROUP ERROR:",
                            error
                        );

                        renderCurrentView();
                    });
                }

                renderCurrentView();
                return;
            }

            updateTaskGroup(
                groupField,
                groupValue,
                value
            ).catch(error => {
                console.error(
                    "UPDATE TASK GROUP ERROR:",
                    error
                );

                renderCurrentView();
            });

            // Рисуем сразу, не ждём Supabase
            renderCurrentView();
        },

        onCancel: () => {
            if (isNew) {
                deleteTaskGroup(
                    groupField,
                    groupValue
                ).catch(error => {
                    console.error(
                        "DELETE TASK GROUP ERROR:",
                        error
                    );

                    renderCurrentView();
                });
            }

            renderCurrentView();
        }
    });
}

async function updateTaskGroup(field, value, title) {
    switch (field) {
        case "categoryId":
            await updateCategory(value, {
                title: title
            });
            break;
    }
}

async function deleteTaskGroup(field, value) {
    switch (field) {
        case "categoryId":
            await deleteCategory(value);
            break;
    }
}

async function updateTaskGroupColor(
    field,
    value,
    color
) {
    switch (field) {
        case "categoryId":
            await updateCategory(
                value,
                {
                    color
                }
            );
            break;
    }
}

function getTaskGroupColor(group) {
    if (
        group.field === "categoryId" &&
        group.value !== null
    ) {
        return getCategoryById(
            group.value
        )?.color ?? null;
    }

    if (group.field === "dueDate") {
        return getDueDateGroupColor(group.value);
    }

    return null;
}

function getDueDateGroupColor(value) {
    switch (value) {
        case "overdue":
            return "var(--color-overdue)";

        case "today":
            return "var(--color-today)";

        case "tomorrow":
            return "var(--color-tomorrow)";

        case "this-week":
            return "var(--color-this-week)";

        case "next-week":
        case "default":
            return "var(--color-later)";

        default:
            return null;
    }
}