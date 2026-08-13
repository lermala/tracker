const taskGroupTemplate = document.getElementById("taskGroupTemplate");


function createTaskGroup(group) {
    const item = cloneTaskGroupTemplate();
    const elements = getTaskGroupElements(item);

    item.dataset.groupField = group.field ?? "";
    item.dataset.groupValue = group.value ?? "";

    fillTaskGroupData(elements, group);

    const isCategory =
        group.field === "categoryId" &&
        group.value !== null;

    elements.deleteButton.hidden = !isCategory;
    elements.addButton.hidden = group.newTaskData == null;

    bindTaskGroupEvents(item, elements, group);

    group.tasks.forEach(task => {
        elements.items.append(createTaskUI(task));
    });

    elements.items.taskGroup = group;
    if (group.field === "categoryId") {
        initTaskSortable(elements.items);
    }

    return item;
}

function bindTaskGroupEvents(item, elements, group) {
    const isCategory = group.field === "categoryId";

    // Редактирование категории
    if (isCategory) {
        elements.title.addEventListener("click", () => {
            startEditTaskGroup(item);
        });

        // Удаление категории
        elements.deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(
                `Удалить категорию «${group.title}»? Все задачи в ней перейдут в (Без категории)?`
            );

            if (!confirmed) return;

            await deleteTaskGroup(
                group.field,
                group.value
            );

            renderCurrentView();
        });
    }

    // Добавление задачи
    if (group.newTaskData != null) {
        elements.addButton.addEventListener("click", () => {
            const task = createTask({
                projectId: viewSettings.projectId,
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
        deleteButton: item.querySelector(".taskGroupDeleteButton")
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

        onSave: async (value) => {
            if (!value) {
                if (isNew) {
                    await deleteTaskGroup(groupField, groupValue);
                }

                renderCurrentView();
                return;
            }

            await updateTaskGroup(
                groupField,
                groupValue,
                value
            );

            renderCurrentView();
        },

        onCancel: async () => {
            if (isNew) {
                await deleteTaskGroup(groupField, groupValue);
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