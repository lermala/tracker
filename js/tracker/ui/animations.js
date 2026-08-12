function animateTaskReorder(update) {
    const oldPositions = new Map();

    document.querySelectorAll(".task").forEach(element => {
        oldPositions.set(
            element.dataset.taskId,
            element.getBoundingClientRect()
        );
    });

    // Меняем данные и перестраиваем DOM
    update();

    document.querySelectorAll(".task").forEach(element => {
        const oldPosition = oldPositions.get(element.dataset.taskId);

        if (!oldPosition) return;

        const newPosition = element.getBoundingClientRect();

        const deltaX = oldPosition.left - newPosition.left;
        const deltaY = oldPosition.top - newPosition.top;

        if (deltaX === 0 && deltaY === 0) return;

        element.animate(
            [
                {
                    transform: `translate(${deltaX}px, ${deltaY}px)`
                },
                {
                    transform: "translate(0, 0)"
                }
            ],
            {
                duration: 250,
                easing: "ease-out"
            }
        );
    });
}


function animateTaskDelete(item, onDelete) {
    const animation = item.animate(
        [
            {
                opacity: 1,
                transform: "scale(1)"
            },
            {
                opacity: 0,
                transform: "scale(.95)"
            }
        ],
        {
            duration: 150,
            easing: "ease-out"
        }
    );

    animation.onfinish = () => {
        animateTaskReorder(onDelete);
    };
}