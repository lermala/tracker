const PRIORITY_OPTIONS = [
    {
        value: TASK_PRIORITY.HIGH,
        label: "Высокий"
    },
    {
        value: TASK_PRIORITY.MEDIUM,
        label: "Средний"
    },
    {
        value: TASK_PRIORITY.LOW,
        label: "Низкий"
    },
    {
        value: TASK_PRIORITY.NONE,
        label: "Без приоритета"
    }
];

function openPriorityPicker({
    anchor,
    value,
    onChange
}) {
    closePriorityPicker();

    const menu = document.createElement("div");
    menu.className = "priorityPicker";
    menu.id = "priorityPicker";

    PRIORITY_OPTIONS.forEach(option => {
        const button = document.createElement("button");

        button.className = "priorityPickerOption";
        button.type = "button";
        button.dataset.priority = option.value;

        if (option.value === value) {
            button.classList.add("is-selected");
        }

        const dot = document.createElement("span");
        dot.className = "priorityDot";
        dot.dataset.priority = option.value;

        const label = document.createElement("span");
        label.textContent = option.label;

        button.append(dot, label);

        button.addEventListener("click", event => {
            event.stopPropagation();

            onChange(option.value);
            closePriorityPicker();
        });

        menu.append(button);
    });

    document.body.append(menu);

    positionPriorityPicker(menu, anchor);

    setTimeout(() => {
        document.addEventListener(
            "click",
            handlePriorityPickerOutsideClick
        );
    });
}

function positionPriorityPicker(menu, anchor) {
    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const gap = 4;
    const padding = 8;

    let left = anchorRect.left;
    let top = anchorRect.bottom + gap;

    // Если справа не помещается
    if (left + menuRect.width > window.innerWidth - padding) {
        left = window.innerWidth - menuRect.width - padding;
    }

    // Если снизу не помещается — открываем вверх
    if (top + menuRect.height > window.innerHeight - padding) {
        top = anchorRect.top - menuRect.height - gap;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
}

function handlePriorityPickerOutsideClick(event) {
    if (event.target.closest("#priorityPicker")) {
        return;
    }

    closePriorityPicker();
}

function closePriorityPicker() {
    document
        .getElementById("priorityPicker")
        ?.remove();

    document.removeEventListener(
        "click",
        handlePriorityPickerOutsideClick
    );
}