/* const TASK_PRIORITY = {
    NONE: "none",
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
}; */

function createTaskModel({
    id,
    projectId,
    categoryId = null,

    createdById = null,
    assigneeId = null,

    title = "",
    description = "",

    priority = TASK_PRIORITY.NONE,

    duration = 0,
    order = 0,

    createdAt,
    updatedAt,

    startedAt = null,
    completedAt = null,
    dueAt = null
}) {
    return prepareTask({
        id,

        projectId,
        categoryId,

        createdById,
        assigneeId,

        title,
        description,

        priority,

        duration,
        order,

        createdAt,
        updatedAt,

        startedAt,
        completedAt,
        dueAt
    });
}

function prepareTask(task) {
    Object.defineProperty(task, "isCompleted", {
        get() {
            return this.completedAt !== null;
        },

        enumerable: false,
        configurable: true
    });

    return task;
}