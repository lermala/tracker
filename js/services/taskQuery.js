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
    const projectCategories = getCategoriesByProject(
        getCurrentProjectId()
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

function groupTasksByProject(tasks) {
    return projects
        .map(project => ({
            id: project.id,
            title: project.title,
            tasks: tasks.filter(
                task => task.projectId === project.id
            )
        }))
        .filter(group => group.tasks.length > 0);
}

function groupTasksByDueDate(tasks) {
    return [
        {
            field: "dueDate",
            value: "overdue",
            title: "Просрочено",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueDateStatus(task.dueDate) === "overdue"
            )
        },
        {
            field: "dueDate",
            value: "today",
            title: "Сегодня",

            newTaskData: {
                dueDate: getDateOffset(0)
            },

            tasks: tasks.filter(task =>
                getDueDateStatus(task.dueDate) === "today"
            )
        },
        {
            field: "dueDate",
            value: "tomorrow",
            title: "Завтра",

            newTaskData: {
                dueDate: getDateOffset(1)
            },

            tasks: tasks.filter(task =>
                getDueDateStatus(task.dueDate) === "tomorrow"
            )
        },
        {
            field: "dueDate",
            value: "this-week",
            title: "На этой неделе",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueDateStatus(task.dueDate) === "this-week"
            )
        },
        {
            field: "dueDate",
            value: "next-week",
            title: "На следующей неделе",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueDateStatus(task.dueDate) === "next-week"
            )
        },
        {
            field: "dueDate",
            value: "default",
            title: "Позже",
            newTaskData: null,

            tasks: tasks.filter(task =>
                getDueDateStatus(task.dueDate) === "default"
            )
        },
        {
            field: "dueDate",
            value: "empty",
            title: "Без срока",

            newTaskData: {
                dueDate: null
            },

            tasks: tasks.filter(task =>
                getDueDateStatus(task.dueDate) === "empty"
            )
        }
    ].filter(group =>
        group.tasks.length > 0 ||
        group.newTaskData !== null
    );
}