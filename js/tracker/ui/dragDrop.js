function initTaskSortable(container) {
    const sortable = new Sortable(container, {
        group: "tasks",
        animation: 150,

        chosenClass: "is-chosen",
        ghostClass: "is-ghost",
        dragClass: "is-dragging",

        fallbackTolerance: 5,

        onStart() {
            document.body.classList.add("is-dragging");
        },

        onEnd(event) {
            document.body.classList.remove("is-dragging");

            const taskId = event.item.dataset.taskId;
            const targetGroup = event.to.taskGroup;

            moveTask(
                taskId,
                targetGroup,
                event.from,
                event.to
            );

            renderCurrentView();
        }
    });

    const taskGroup = container.closest(".taskGroup");
    const dropZone = taskGroup?.querySelector(".taskGroupDropZone");

    if (!dropZone) return;

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();

        const draggedTask = document.querySelector(".is-chosen");

        if (!draggedTask) return;

        container.append(draggedTask);
    });
}

function moveTask(taskId, targetGroup, fromContainer, toContainer) {
    const task = getTaskById(taskId);

    if (!task) return;

    if (targetGroup.field !== null) {
        updateTask(taskId, {
            [targetGroup.field]: targetGroup.value
        });
    }

    if (viewSettings.group === GROUP.CATEGORY) {
        saveTaskOrder(fromContainer);

        if (fromContainer !== toContainer) {
            saveTaskOrder(toContainer);
        }
    }
}

function saveTaskOrder(container) {
    const taskIds = [...container.children]
        .map(element => element.dataset.taskId);

    updateTaskOrder(taskIds);
}

function initTaskGroupSortable(container) {
    if (viewSettings.group !== GROUP.CATEGORY) return;

    new Sortable(container, {
        animation: 150,

        draggable: ".taskGroup",
        handle: ".taskGroupHeader",

        chosenClass: "is-chosen",
        ghostClass: "is-ghost",
        dragClass: "is-dragging",

        scroll: container,
        scrollSensitivity: 100,
        scrollSpeed: 15,

        onStart() {
            document.body.classList.add("is-dragging");
        },

        onEnd() {
            document.body.classList.remove("is-dragging");

            saveTaskGroupOrder(container);
        }
    });
}

function saveTaskGroupOrder(container) {
    const groupIds = [
        ...container.querySelectorAll(".taskGroup")
    ].map(group => group.dataset.groupValue);

    updateCategoryOrder(groupIds);
}