// SORTING

function sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
            return (
                Number(a.isCompleted) -
                Number(b.isCompleted)
            );
        }

        let result = 0;

        switch (pageSettings.sort) {
            case "created":
                result =
                    compareNullableNumbers(
                        b.createdAt,
                        a.createdAt
                    );
                break;

            case "dueDate":
                result =
                    compareNullableNumbers(
                        a.dueDate,
                        b.dueDate,
                        true
                    );
                break;

            case "priority":
                result =
                    compareTaskPriority(
                        b.priority,
                        a.priority
                    );
                break;

            default:
                result =
                    (a.order ?? 0) -
                    (b.order ?? 0);
        }

        if (result !== 0) {
            return result;
        }

        return (
            (a.order ?? 0) -
            (b.order ?? 0)
        );
    });
}

function compareNullableNumbers(
    a,
    b,
    nullLast = false
) {
    const aEmpty = a == null;
    const bEmpty = b == null;

    if (aEmpty && bEmpty) {
        return 0;
    }

    if (aEmpty) {
        return nullLast ? 1 : -1;
    }

    if (bEmpty) {
        return nullLast ? -1 : 1;
    }

    return a - b;
}

const TASK_PRIORITY_ORDER = {
    [TASK_PRIORITY.NONE]: 0,
    [TASK_PRIORITY.LOW]: 1,
    [TASK_PRIORITY.MEDIUM]: 2,
    [TASK_PRIORITY.HIGH]: 3
};

function compareTaskPriority(a, b) {
    return (
        (TASK_PRIORITY_ORDER[a] ?? 0) -
        (TASK_PRIORITY_ORDER[b] ?? 0)
    );
}

// ====================
// FILTERING
// ====================

function filterTasks(tasks) {
    let result = filterTasksByPage(tasks);

    // Скрыть завершённые
    if (pageSettings.hideCompleted) {
        result = result.filter(task => !task.isCompleted);
    }

    // todo
    // незавершенные задачи с дедлайном = сегодня // todo добавить просроченные
    // незавершенные задачи без дедлайна 
    // завершенные сегодня задачи
    if (pageSettings.todayOnly) {
        result = result.filter(task =>
            (task.completedAt == null || isToday(task.completedAt)) // незавершена или завершена сегодня
            // isToday(task.dueDate) // срок исполнения =сегодня
            //(task.completedAt == null && task.dueDate == null) ||
            //isToday(task.dueDate) ||
        );
    }

    return result;
}

function filterTasksByPage(tasks) {
    const page = currentPage;

    switch (page.type) {
        case PAGE.PROJECT:
            return tasks.filter(
                task => task.projectId === page.id
            );

        case PAGE.MY_TASKS:
            return tasks.filter(
                task =>
                    task.assigneeId === currentUser.id ||
                    task.createdById === currentUser.id
            );

        default:
            return tasks;
    }
}

function getVisibleTasks() {
    let visibleTasks = [...tasks];

    visibleTasks = filterTasks(visibleTasks);
    visibleTasks = sortTasks(visibleTasks);

    return visibleTasks;
}

// ====================
// GROUPING
// ====================
function groupTasks(tasks, group) {
    switch (group) {
        case GROUP.CATEGORY:
            return groupTasksByCategory(tasks);

        case GROUP.DUE_DATE:
            return groupTasksByDueDate(tasks);

        case GROUP.PROJECT:
            return groupTasksByProject(tasks);

        default:
            return [
                {
                    field: null,
                    value: null,
                    title: "Все задачи",
                    newTaskData: {},
                    tasks
                }
            ];
    }
}

function groupTasksByCategory(tasks) {
    const projectCategories =
        getCategoriesByProject(
            getCurrentProjectId()
        );

    const emptyGroup = {
        field: "categoryId",
        value: null,
        title: "(Без категории)",

        tasks: tasks.filter(
            task => !task.categoryId
        ),

        newTaskData: {
            categoryId: null
        }
    };

    const categoryGroups =
        projectCategories.map(
            category => ({
                field: "categoryId",
                value: category.id,
                title: category.title,

                tasks: tasks.filter(
                    task =>
                        task.categoryId ===
                        category.id
                ),

                newTaskData: {
                    categoryId:
                        category.id
                }
            })
        );

    return [
        emptyGroup,
        ...categoryGroups
    ];
}

function groupTasksByProject(tasks) {
    const emptyGroup = {
        field: "projectId",
        value: null,
        title: "(Без проекта)",

        tasks: tasks.filter(
            task => !task.projectId
        ),

        newTaskData: {
            projectId: null,
            categoryId: null
        }
    };

    const projectGroups =
        projects.map(project => ({
            field: "projectId",
            value: project.id,
            title: project.title,

            tasks: tasks.filter(
                task =>
                    task.projectId ===
                    project.id
            ),

            newTaskData: {
                projectId: project.id,
                categoryId: null
            }
        }));

    return [
        emptyGroup,
        ...projectGroups
    ];
}

function groupTasksByDueDate(tasks) {
    const groups = [
        {
            field: "dueDate",
            value: "empty",
            title: "(Без срока)",

            newTaskData: {
                dueDate: null
            },

            tasks: tasks.filter(
                task =>
                    getDueDateStatus(
                        task.dueDate
                    ) === "empty"
            )
        },

        {
            field: "dueDate",
            value: "overdue",
            title: "Просрочено",
            newTaskData: null,

            tasks: tasks.filter(
                task =>
                    getDueDateStatus(
                        task.dueDate
                    ) === "overdue"
            )
        },

        {
            field: "dueDate",
            value: "today",
            title: "Сегодня",

            newTaskData: {
                dueDate:
                    getDateOffset(0)
            },

            tasks: tasks.filter(
                task =>
                    getDueDateStatus(
                        task.dueDate
                    ) === "today"
            )
        },

        {
            field: "dueDate",
            value: "tomorrow",
            title: "Завтра",

            newTaskData: {
                dueDate:
                    getDateOffset(1)
            },

            tasks: tasks.filter(
                task =>
                    getDueDateStatus(
                        task.dueDate
                    ) === "tomorrow"
            )
        },

        {
            field: "dueDate",
            value: "this-week",
            title: "На этой неделе",
            newTaskData: null,

            tasks: tasks.filter(
                task =>
                    getDueDateStatus(
                        task.dueDate
                    ) === "this-week"
            )
        },

        {
            field: "dueDate",
            value: "next-week",
            title: "На следующей неделе",
            newTaskData: null,

            tasks: tasks.filter(
                task =>
                    getDueDateStatus(
                        task.dueDate
                    ) === "next-week"
            )
        },

        {
            field: "dueDate",
            value: "default",
            title: "Позже",
            newTaskData: null,

            tasks: tasks.filter(
                task =>
                    getDueDateStatus(
                        task.dueDate
                    ) === "default"
            )
        }
    ];

    return groups.filter(
        group =>
            group.tasks.length > 0 ||
            group.newTaskData !== null
    );
}