const ACCENT_COLOR_PALETTE = [
    {
        label: "Красный",
        value: "#d84a4a"
    },
    {
        label: "Оранжевый",
        value: "#cf6957"
    },
    {
        label: "Малиновый",
        value: "#c84f72"
    },
    {
        label: "Зелёный",
        value: "#3f805d"
    },
    {
        label: "Ярко-синий",
        value: "#3478f6"
    },
    {
        label: "Синий",
        value: "#4f6fae"
    },
    {
        label: "Индиго",
        value: "#6264a7"
    },
    {
        label: "Коричневый",
        value: "#8a6348"
    },
    {
        label: "Графитовый",
        value: "#4b5563"
    }
];

const ENTITY_COLOR_PALETTE = [
    {
        label: "Красный",
        value: "#e5484d"
    },
    {
        label: "Коралловый",
        value: "#e16f62"
    },
    {
        label: "Оранжевый",
        value: "#d97843"
    },
    {
        label: "Коричневый",
        value: "#8a6348"
    },
    {
        label: "Янтарный",
        value: "#d6a600"
    },
    {
        label: "Жёлтый",
        value: "#d8b84c"
    },
    {
        label: "Лаймовый",
        value: "#8a9a3a"
    },
    {
        label: "Зелёный",
        value: "#3f7d57"
    },
    {
        label: "Мятный",
        value: "#3f8f7d"
    },
    {
        label: "Голубой",
        value: "#4a9bc4"
    },
    {
        label: "Синий",
        value: "#5074a6"
    },
    {
        label: "Фиолетовый",
        value: "#8067b7"
    },
    {
        label: "Сливовый",
        value: "#87566f"
    },
    {
        label: "Розовый",
        value: "#d05a9f"
    },
    {
        label: "Малиновый",
        value: "#c84f72"
    },
    {
        label: "Серый",
        value: "#777777"
    },
    {
        label: "Графитовый",
        value: "#4f545c"
    }
];

function createColorPicker({
    colors,
    value = null,
    allowEmpty = true,
    onChange
} = {}) {
    const picker = document.createElement("div");
    picker.className = "colorPicker";

    if (allowEmpty) {
        picker.append(
            createColorPickerEmptyOption({
                selected: value === null,
                onClick: () => {
                    setColorPickerValue(
                        picker,
                        null
                    );

                    onChange?.(null);
                }
            })
        );
    }

    colors.forEach(color => {
        const option =
            document.createElement("button");

        option.type = "button";
        option.className =
            "colorPickerOption";

        option.dataset.color =
            color.value;

        option.title =
            color.label;

        option.style.setProperty(
            "--picker-color",
            color.value
        );

        option.classList.toggle(
            "is-selected",
            color.value === value
        );

        option.addEventListener(
            "click",
            () => {
                setColorPickerValue(
                    picker,
                    color.value
                );

                onChange?.(
                    color.value
                );
            }
        );

        picker.append(option);
    });

    return picker;
}

function setColorPickerValue(
    picker,
    value
) {
    picker
        .querySelectorAll(
            ".colorPickerOption"
        )
        .forEach(option => {
            const optionValue =
                option.classList.contains(
                    "is-empty"
                )
                    ? null
                    : option.dataset.color;

            option.classList.toggle(
                "is-selected",
                optionValue === value
            );
        });
}

function createColorPickerEmptyOption({
    selected,
    onClick
}) {
    const option =
        document.createElement("button");

    option.type = "button";
    option.className =
        "colorPickerOption is-empty";

    option.title = "Без цвета";

    option.classList.toggle(
        "is-selected",
        selected
    );

    const icon =
        document.createElement("span");

    icon.className =
        "material-symbols-rounded";

    icon.textContent =
        "format_color_reset";

    option.append(icon);

    option.addEventListener(
        "click",
        onClick
    );

    return option;
}