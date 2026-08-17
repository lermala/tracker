let activeDropdown = null;
let activeDropdownAnchor = null;
let activeDropdownRemoveOnClose = false;

function openDropdown({
    anchor,
    dropdown,
    align = "start",
    removeOnClose = false
}) {
    const isOpen =
        activeDropdown === dropdown;

    closeDropdown();

    if (isOpen) {
        return;
    }

    activeDropdown = dropdown;
    activeDropdownAnchor = anchor;
    activeDropdownRemoveOnClose =
        removeOnClose;

    dropdown.classList.remove("hidden");

    positionDropdown(
        anchor,
        dropdown,
        align
    );
}

function closeDropdown() {
    if (!activeDropdown) return;

    const dropdown =
        activeDropdown;

    const removeOnClose =
        activeDropdownRemoveOnClose;

    activeDropdown = null;
    activeDropdownAnchor = null;
    activeDropdownRemoveOnClose = false;

    if (removeOnClose) {
        dropdown.remove();
        return;
    }

    dropdown.classList.add("hidden");
}

function createDropdownItem({
    text,
    selected = false,
    icon = null,
    onClick
}) {
    const item =
        document.createElement("button");

    item.type = "button";
    item.className = "dropdownItem";

    item.classList.toggle(
        "is-selected",
        selected
    );

    if (icon) {
        item.append(icon);
    }

    const label =
        document.createElement("span");

    label.className =
        "dropdownItemText";

    label.textContent = text;

    const check =
        document.createElement("span");

    check.className =
        "material-symbols-rounded dropdownItemCheck";

    check.textContent = "check";

    item.append(label, check);

    item.addEventListener(
        "click",
        onClick
    );

    return item;
}


function createDropdownCheckboxItem({
    text,
    checked,
    onChange
}) {
    const item =
        document.createElement("label");

    item.className = "dropdownItem";

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = checked;

    const label =
        document.createElement("span");

    label.className =
        "dropdownItemText";

    label.textContent = text;

    checkbox.addEventListener(
        "change",
        () => {
            onChange?.(
                checkbox.checked
            );
        }
    );

    item.append(
        checkbox,
        label
    );

    return item;
}

function positionDropdown(
    anchor,
    dropdown,
    align
) {
    const anchorRect =
        anchor.getBoundingClientRect();

    const dropdownRect =
        dropdown.getBoundingClientRect();

    const gap = 4;
    const viewportPadding = 8;

    let left =
        align === "end"
            ? anchorRect.right - dropdownRect.width
            : anchorRect.left;

    let top =
        anchorRect.bottom + gap;

    left = Math.max(
        viewportPadding,
        Math.min(
            left,
            window.innerWidth -
            dropdownRect.width -
            viewportPadding
        )
    );

    if (
        top + dropdownRect.height >
        window.innerHeight - viewportPadding
    ) {
        top =
            anchorRect.top -
            dropdownRect.height -
            gap;
    }

    dropdown.style.left = `${left}px`;
    dropdown.style.top = `${top}px`;
}

document.addEventListener(
    "pointerdown",
    event => {
        if (!activeDropdown) return;

        if (
            activeDropdown.contains(
                event.target
            )
        ) {
            return;
        }

        if (
            activeDropdownAnchor?.contains(
                event.target
            )
        ) {
            return;
        }

        closeDropdown();
    }
);

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        activeDropdown
    ) {
        closeDropdown();
    }
});

function createDropdownDivider() {
    const divider =
        document.createElement("div");

    divider.className =
        "dropdownDivider";

    return divider;
}