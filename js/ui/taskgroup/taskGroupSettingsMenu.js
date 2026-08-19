function openTaskGroupSettingsMenu({
    anchor,
    onEdit,
    onDelete,
    color = null,
    onColorChange = null
}) {
    const dropdown =
        document.createElement("div");

    dropdown.className =
        "dropdown taskGroupSettingsMenu";

    dropdown.append(
        createDropdownItem({
            text: "Изменить",
            icon: "edit",

            onClick: event => {
                event.stopPropagation();

                closeDropdown();
                onEdit?.();
            }
        }),

        createDropdownItem({
            text: "Удалить",
            icon: "delete",
            destructive: true,

            onClick: event => {
                event.stopPropagation();

                closeDropdown();
                onDelete?.();
            }
        }),

        createDropdownDivider()
    );

    dropdown.append(
        createTaskGroupColorSection({
            value: color,
            onChange: onColorChange
        })
    );

    openDropdown({
        anchor,
        dropdown,
        align: "end",
        removeOnClose: true
    });
}

function createTaskGroupColorSection({
    value,
    onChange
}) {
    const section =
        document.createElement("div");

    section.className =
        "dropdownSection";

    const label =
        document.createElement("div");

    label.className =
        "dropdownSectionLabel";

    label.textContent = "Цвет";

    const colorPicker =
        createColorPicker({
            colors:
                ENTITY_COLOR_PALETTE,

            value,

            onChange: color => {
                onChange?.(color);
            }
        });
    colorPicker.classList.add(
        "is-grid"
    );

    section.append(
        label,
        colorPicker
    );

    return section;
}