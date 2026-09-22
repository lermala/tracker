function bindTaskMenu(
    menuButton,
    getTask,
    {
        onEdit = null,
        onDelete = null,
        onUpdate = null
    } = {}
) {
    menuButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            const task = getTask();

            if (!task) return;

            openTaskMenu({
                anchor: menuButton,
                task,
                onEdit,
                onDelete,
                onUpdate
            });
        }
    );
}

function openTaskMenu({
    anchor,
    task,
    onEdit,
    onDelete,
    onUpdate
}) {
    const dropdown =
        document.createElement("div");

    dropdown.className =
        "dropdown taskMenu";

    dropdown.append(
        createTaskMenuAction({
            text: "Открыть",
            icon: "open_in_new",

            onClick: () => {
                openTaskCard(task);
            }
        }),

        createDropdownDivider(),

        createTaskMenuAction({
            text: "Изменить",
            icon: "edit",

            onClick: () => {
                onEdit?.();
            }
        }),

        createTaskMenuDueDate(
            task,
            anchor,
            onUpdate
        ),

        createTaskMenuPriority(
            task,
            anchor,
            onUpdate
        ),

        createDropdownDivider(),

        createTaskMenuAction({
            text: "Перенести в...",
            icon: "drive_file_move",

            onClick: () => {
                openTaskProjectPicker(anchor, task, onUpdate);
            }
        }),

        createTaskMenuAction({
            text: "Скопировать ссылку",
            icon: "link",

            onClick: async () => {
                await copyEntityUrl(
                    ENTITY_URL.TASK,
                    task.id
                );

                closeDropdown();
            }
        }),

        createDropdownDivider(),

        createTaskMenuAction({
            text: "Удалить",
            icon: "delete",
            destructive: true,

            onClick: () => {
                onDelete?.();
            }
        })
    );

    openDropdown({
        anchor,
        dropdown,
        align: "end",
        removeOnClose: true
    });
}

function openTaskProjectPicker(anchor, task, onUpdate) {
    openSelectDropdown({
        anchor,
        items: getProjects(),
        selectedId: task.projectId,
        getId: project => project.id,
        renderItem: project => createBadge({
            text: project.title,
            color: project.color
        }),
        onSelect: async projectId => {
            if (task.projectId === projectId) return;
            try {
                await moveTaskToProject(task.id, projectId);
            } catch (error) {
                console.error("MOVE TASK ERROR:", error);
            }
            renderCurrentView();
            onUpdate?.();
        },
        width: "220px"
    });
}

function createTaskMenuAction({
    text,
    icon,
    onClick,
    destructive = false
}) {
    const item =
        createDropdownItem({
            text,
            icon,
            destructive,

            onClick: event => {
                event.stopPropagation();

                closeDropdown();

                onClick?.(event);
            }
        });

    /*     item.classList.toggle(
            "is-destructive",
            destructive
        ); */

    return item;
}

function createTaskMenuDueDate(
    task,
    menuAnchor,
    onUpdate
) {
    return createDropdownItem({
        text: "Срок",
        icon: "calendar_today",

        onClick: event => {
            event.stopPropagation();

            closeDropdown();

            openDatePicker({
                anchor: menuAnchor,

                value: {
                    date: task.dueDate,
                    time: task.dueTime
                },

                allowTime: true,

                onChange:
                    async ({ date, time }) => {
                        await updateTask(
                            task.id,
                            {
                                dueDate: date,
                                dueTime: time
                            }
                        );

                        renderCurrentView();
                        onUpdate?.();
                    }
            });
        }
    });
}

function createTaskMenuPriority(
    task,
    menuAnchor,
    onUpdate
) {
    return createDropdownItem({
        text: "Приоритет",
        icon: "flag",

        onClick: event => {
            event.stopPropagation();

            closeDropdown();

            openPriorityPicker({
                anchor: menuAnchor,
                value: task.priority,

                onChange:
                    async priority => {
                        await updateTask(
                            task.id,
                            {
                                priority
                            }
                        );

                        renderCurrentView();
                        onUpdate?.();
                    }
            });
        }
    });
}
