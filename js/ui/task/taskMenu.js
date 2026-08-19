function bindTaskMenu(
    menuButton,
    getTask,
    {
        onEdit = null,
        onDelete = null
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
                onDelete
            });
        }
    );
}

function openTaskMenu({
    anchor,
    task,
    onEdit,
    onDelete
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
            anchor
        ),

        createTaskMenuPriority(
            task,
            anchor
        ),

        createDropdownDivider(),

        createTaskMenuAction({
            text: "Перенести в...",
            icon: "drive_file_move",

            onClick: () => {
                // следующий шаг
            }
        }),

        createTaskMenuAction({
            text: "Скопировать ссылку",
            icon: "link",

            onClick: () => {
                // позже
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
    menuAnchor
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
                    }
            });
        }
    });
}

function createTaskMenuPriority(
    task,
    menuAnchor
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
                    }
            });
        }
    });
}