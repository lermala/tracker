const TASK_PRIORITY = {
    NONE: "none",
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
};

function createTaskModel({
    id,
    projectId,
    categoryId = null,

    createdById = null,
    assigneeId = null,

    title = "",
    description = "",

    priority = TASK_PRIORITY.NONE,

    order = 0,

    createdAt,
    updatedAt,

    completedAt = null,
    dueDate = null,
    dueTime = null
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

        order,

        createdAt,
        updatedAt,

        completedAt,
        
        dueDate,
        dueTime
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