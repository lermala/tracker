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
    const dropdown =
        document.createElement("div");

    dropdown.className =
        "dropdown priorityPicker";

    PRIORITY_OPTIONS.forEach(option => {
        const dot =
            document.createElement("span");

        dot.className =
            "priorityDot";

        dot.dataset.priority =
            option.value;

        dropdown.append(
            createDropdownItem({
                text: option.label,
                icon: dot,

                selected:
                    option.value === value,

                onClick: event => {
                    event.stopPropagation();

                    closeDropdown();

                    onChange?.(
                        option.value
                    );
                }
            })
        );
    });

    openDropdown({
        anchor,
        dropdown,
        removeOnClose: true
    });
}