const TASK_PROPERTY_CONFIG = {
    [TASK_PROPERTY.DURATION]: {
        label: "Затраченное время",
        create: createTaskDurationProperty
    },

    [TASK_PROPERTY.ASSIGNEE]: {
        label: "Исполнитель",
        create: createTaskAssigneeProperty
    },

    [TASK_PROPERTY.DUE_DATE]: {
        label: "Срок",
        create: createTaskDueDateProperty
    },

    [TASK_PROPERTY.PRIORITY]: {
        label: "Приоритет",
        create: createTaskPriorityProperty
    },

    [TASK_PROPERTY.PROJECT]: {
        label: "Проект",
        create: createTaskProjectProperty
    },

    [TASK_PROPERTY.CATEGORY]: {
        label: "Категория",
        create: createTaskCategoryProperty
    }
};

function renderTaskProperties(
    container,
    task
) {
    container.replaceChildren();

    const properties =
        getVisibleTaskProperties();

    properties.forEach(property => {
        const config =
            TASK_PROPERTY_CONFIG[property];

        if (!config) return;

        const element =
            config.create(task);

        if (!element) return;

        container.append(element);
    });
}



function createTaskDueDateProperty(task) {
    if (!task.dueDate) {
        return null;
    }

    const element =
        document.createElement("div");

    element.className =
        "taskProperty taskDueDate";

    fillTaskDueDate(
        element,
        task
    );

    bindTaskDueDate(
        element,
        () => getTaskById(task.id),
        renderCurrentView
    );

    return element;
}

function createTaskAssigneeProperty(task) {
    if (!task.assigneeId) {
        return null;
    }

    const element =
        document.createElement("div");

    element.className =
        "taskProperty taskAssignee";

    fillTaskAssignee(
        element,
        task,
        {
            compact: false
        }
    );

    bindTaskAssignee(
        element,
        () => getTaskById(task.id),
        {
            compact: false,
            onUpdate: renderCurrentView
        }
    );

    return element;
}


function createTaskPriorityProperty(task) {
    if (task.priority === TASK_PRIORITY.NONE) {
        return null;
    }

    const element =
        document.createElement("div");

    element.className =
        "taskProperty taskPriority";

    const dot =
        document.createElement("span");

    dot.className = "priorityDot";

    const text =
        document.createElement("span");

    text.className =
        "taskPriorityText";

    element.append(
        dot,
        text
    );

    fillTaskPriority(
        element,
        task
    );

    bindTaskPriority(
        element,
        () => getTaskById(task.id),
        renderCurrentView
    );

    return element;
}

function createTaskDurationProperty(task) {
    const timer = createTaskTimer();

    timer.element.classList.add(
        "taskProperty",
        "taskDurationProperty"
    );

    fillTaskDuration(
        timer.duration,
        timer.icon,
        task
    );

    registerDurationElement(
        task.id,
        timer.duration
    );

    bindTaskDuration(
        timer.button,
        () => getTaskById(task.id),
        renderCurrentView
    );

    return timer.element;
}

function createTaskTimer() {
    const control = document.createElement("div");

    control.className = "timerControl";

    const button = document.createElement("button");

    button.type = "button";
    button.className = "timerButton";

    const icon = document.createElement("span");

    icon.className = "material-symbols-rounded";

    const duration = document.createElement("span");

    duration.className = "taskDuration";

    button.append(icon);

    control.append(
        button,
        duration
    );

    return {
        element: control,
        button,
        icon,
        duration
    };
}


function createTaskProjectProperty(task) {
    const project = getProjectById(task.projectId);
    if (!project) {
        return null;
    }

    const element = document.createElement("div");
    element.className = "taskProperty taskProject";

    const badge = createBadge({
            text: project.title,
            color: project.color
        });

    element.append(badge);

    return element;
}

function createTaskCategoryProperty(task) {
    if (!task.categoryId) {
        return null;
    }

    const element =
        document.createElement("div");

    element.className =
        "taskProperty taskCategory";

    fillTaskCategory(
        element,
        task
    );

    bindTaskCategory(
        element,
        () => getTaskById(task.id),
        {
            onUpdate: renderCurrentView
        }
    );

    return element;
}