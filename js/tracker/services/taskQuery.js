let viewSettings = getViewSettings();

// SORTING

function sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
        // Завершенные всегда вниз
        if (a.isCompleted !== b.isCompleted) {
            return Number(a.isCompleted) - Number(b.isCompleted);
        }

        // Ручной порядок
        return (a.order ?? 0) - (b.order ?? 0);
    });
}

// ====================
// FILTERING
// ====================

function filterTasks(tasks) {
    let result = [...tasks];

    // Текущий проект
    result = result.filter(
        task => task.projectId === viewSettings.projectId
    );

    // Скрыть завершённые
    if (viewSettings.hideCompleted) {
        result = result.filter(task => !task.isCompleted);
    }

    // todo
    // незавершенные задачи с дедлайном = сегодня // todo добавить просроченные
    // незавершенные задачи без дедлайна 
    // завершенные сегодня задачи
    if (viewSettings.todayOnly) {
        result = result.filter(task =>
            (task.completedAt == null || isToday(task.completedAt)) // незавершена или завершена сегодня
            // isToday(task.dueAt) // срок исполнения =сегодня
            //(task.completedAt == null && task.dueAt == null) ||
            //isToday(task.dueAt) ||
        );
    }

    return result;
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
            return groupTasksByDueAt(tasks);

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
    const projectCategories = getCategoriesByProject(
        viewSettings.projectId
    );

    const groups = projectCategories.map(category => ({
        field: "categoryId",
        value: category.id,
        title: category.title,
        tasks: tasks.filter(
            task => task.categoryId === category.id
        ),
        newTaskData: {
            categoryId: category.id
        }
    }));

    const tasksWithoutCategory = tasks.filter(
        task => !task.categoryId
    );

    if (tasksWithoutCategory.length > 0) {
        groups.unshift({
            field: "categoryId",
            value: null,
            title: "(Без категории)",
            tasks: tasksWithoutCategory,

            newTaskData: {
                categoryId: null
            }
        });
    }

    return groups;
}

function groupTasksByDueAt(tasks) {
    return [
        {
            field: "dueAt",
            value: "overdue",
            title: "Просрочено",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueAtStatus(task.dueAt) === "overdue"
            )
        },
        {
            field: "dueAt",
            value: "today",
            title: "Сегодня",

            newTaskData: {
                dueAt: getDateOffset(0)
            },

            tasks: tasks.filter(task =>
                getDueAtStatus(task.dueAt) === "today"
            )
        },
        {
            field: "dueAt",
            value: "tomorrow",
            title: "Завтра",

            newTaskData: {
                dueAt: getDateOffset(1)
            },

            tasks: tasks.filter(task =>
                getDueAtStatus(task.dueAt) === "tomorrow"
            )
        },
        {
            field: "dueAt",
            value: "this-week",
            title: "На этой неделе",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueAtStatus(task.dueAt) === "this-week"
            )
        },
        {
            field: "dueAt",
            value: "next-week",
            title: "На следующей неделе",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueAtStatus(task.dueAt) === "next-week"
            )
        },
        {
            field: "dueAt",
            value: "default",
            title: "Позже",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueAtStatus(task.dueAt) === "default"
            )
        },
        {
            field: "dueAt",
            value: "empty",
            title: "Без срока",

            newTaskData: {
                dueAt: null
            },

            tasks: tasks.filter(task =>
                getDueAtStatus(task.dueAt) === "empty"
            )
        }
    ].filter(group =>
        group.tasks.length > 0 ||
        group.newTaskData !== null
    );
}