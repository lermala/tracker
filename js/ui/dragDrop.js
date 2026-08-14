function initTaskSortable(container) {
    const sortable = new Sortable(container, {
        group: "tasks",
        animation: 150,

        chosenClass: "is-chosen",
        ghostClass: "is-ghost",
        dragClass: "is-dragging",

        fallbackTolerance: 5,
        delay: 300,
        delayOnTouchOnly: true,
        touchStartThreshold: 5,

        onStart() {
            document.body.classList.add("is-dragging");
        },

        async onEnd(event) {
            document.body.classList.remove("is-dragging");

            const taskId = event.item.dataset.taskId;
            const targetGroup = event.to.taskGroup;

            if (!targetGroup) return;

            await moveTask(
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

async function moveTask(
    taskId,
    targetGroup,
    fromContainer,
    toContainer
) {
    const task = getTaskById(taskId);

    if (!task) return;

    if (targetGroup.field !== null) {
        await updateTask(taskId, {
            [targetGroup.field]: targetGroup.value
        });
    }

    if (pageSettings.group === GROUP.CATEGORY) {
        await saveTaskOrder(fromContainer);

        if (fromContainer !== toContainer) {
            await saveTaskOrder(toContainer);
        }
    }
}

async function saveTaskOrder(container) {
    const taskIds = [...container.children]
        .map(element => element.dataset.taskId);

    await updateTaskOrder(taskIds);
}

function initTaskGroupSortable(container) {
    if (pageSettings.group !== GROUP.CATEGORY) return;

    new Sortable(container, {
        animation: 150,

        draggable: ".taskGroup",
        handle: ".taskGroupHeader",

        chosenClass: "is-chosen",
        ghostClass: "is-ghost",
        dragClass: "is-dragging",

        delay: 300,
        delayOnTouchOnly: true,
        touchStartThreshold: 5,

        scroll: container,
        scrollSensitivity: 100,
        scrollSpeed: 15,

        onStart() {
            document.body.classList.add("is-dragging");
        },

        async onEnd() {
            document.body.classList.remove("is-dragging");

            await saveTaskGroupOrder(container);
        }
    });
}

async function saveTaskGroupOrder(container) {
    const groupIds = [
        ...container.querySelectorAll(".taskGroup")
    ].map(group => group.dataset.groupValue);

    await updateCategoryOrder(groupIds);
}