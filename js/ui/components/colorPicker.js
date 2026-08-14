const DEFAULT_COLOR_PALETTE = [
    {
        label: "Красный",
        value: "#e5484d"
    },
    {
        label: "Оранжевый",
        value: "#cf6957"
    },
    {
        label: "Жёлтый",
        value: "#d6a600"
    },
    {
        label: "Зелёный",
        value: "#3f7d57"
    },
    {
        label: "Синий",
        value: "#5074a6"
    },
    {
        label: "Розовый",
        value: "#d05a9f"
    },
    {
        label: "Фиолетовый",
        value: "#8067b7"
    }
];

function createColorPicker({
    colors,
    value = null,
    onChange
} = {}) {
    const picker = document.createElement("div");

    picker.className = "colorPicker";

    colors.forEach(color => {
        const option = document.createElement("button");

        option.type = "button";
        option.className = "colorPickerOption";

        option.dataset.color = color.value;
        option.title = color.label;

        option.style.setProperty(
            "--picker-color",
            color.value
        );

        option.classList.toggle(
            "is-selected",
            color.value === value
        );

        option.addEventListener("click", () => {
            setColorPickerValue(
                picker,
                color.value
            );

            onChange?.(color.value);
        });

        picker.append(option);
    });

    return picker;
}

function setColorPickerValue(picker, value) {
    picker
        .querySelectorAll(".colorPickerOption")
        .forEach(option => {
            option.classList.toggle(
                "is-selected",
                option.dataset.color === value
            );
        });
}