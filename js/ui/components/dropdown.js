let activeDropdown = null;
let activeDropdownAnchor = null;
let activeDropdownRemoveOnClose = false;


// =========================
// Dropdown lifecycle
// =========================

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

    if (!dropdown.isConnected) {
        document.body.append(dropdown);
    }

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


function positionDropdown(
    anchor,
    dropdown,
    align = "start"
) {
    const anchorRect =
        anchor.getBoundingClientRect();

    const dropdownRect =
        dropdown.getBoundingClientRect();

    const gap = 4;
    const viewportPadding = 8;

    let left =
        align === "end"
            ? anchorRect.right -
            dropdownRect.width
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
        window.innerHeight -
        viewportPadding
    ) {
        top =
            anchorRect.top -
            dropdownRect.height -
            gap;
    }

    top = Math.max(
        viewportPadding,
        top
    );

    dropdown.style.left =
        `${left}px`;

    dropdown.style.top =
        `${top}px`;
}


// =========================
// Dropdown elements
// =========================

function createDropdownItem({
    text = null,
    content = null,
    selected = false,
    destructive = false,
    icon = null,
    onClick = null
}) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "dropdownItem";

    item.classList.toggle(
        "is-selected",
        selected
    );

    item.classList.toggle(
        "is-destructive",
        destructive
    );

    if (icon) {
        item.append(
            createDropdownIcon(icon)
        );
    }

    if (content) {
        item.append(content);
    } else {
        const label =
            document.createElement("span");

        label.className =
            "dropdownItemText";

        label.textContent =
            text ?? "";

        item.append(label);
    }

    const check =
        document.createElement("span");

    check.className =
        "material-symbols-rounded dropdownItemCheck";

    check.textContent = "check";

    item.append(check);

    if (onClick) {
        item.addEventListener(
            "click",
            onClick
        );
    }

    return item;
}


function createDropdownCheckboxItem({
    text,
    checked = false,
    onChange = null
}) {
    const item = document.createElement("label");
    item.className = "dropdownItem";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = checked;

    const label = document.createElement("span");
    label.className = "dropdownItemText";
    label.textContent = text;

    if (onChange) {
        checkbox.addEventListener(
            "change",
            () => {
                onChange(
                    checkbox.checked
                );
            }
        );
    }

    item.append(
        checkbox,
        label
    );

    return item;
}


function createDropdownAction({
    text,
    icon = "add",
    onClick = null
}) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "dropdownItem dropdownAction";
    item.append(
        createDropdownIcon(icon)
    );

    const label = document.createElement("span");
    label.className = "dropdownItemText";
    label.textContent = text;
    item.append(label);

    if (onClick) {
        item.addEventListener(
            "click",
            onClick
        );
    }

    return item;
}

function createDropdownCreate({
    placeholder = "",
    maxLength = null,
    onCreate,
    onCancel = null
}) {
    const wrapper = document.createElement("div");
    wrapper.className = "dropdownCreate";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "dropdownCreateInput";
    input.placeholder = placeholder;
    if (maxLength !== null) {
        input.maxLength =
            maxLength;
    }

    wrapper.append(input);

    async function submit() {
        const value =
            input.value.trim();

        if (!value) {
            return;
        }

        input.disabled = true;

        try {
            await onCreate(value);

            closeDropdown();
        } catch (error) {
            input.disabled = false;
            input.focus();

            throw error;
        }
    }

    input.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                event.preventDefault();

                submit();
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();

                onCancel?.();
            }
        }
    );

    return {
        element: wrapper,
        input
    };
}


function createDropdownIcon(icon) {
    if (icon instanceof Node) {
        return icon;
    }

    const element = document.createElement("span");
    element.className = "material-symbols-rounded dropdownItemIcon";
    element.textContent = icon;

    return element;
}


function createDropdownDivider() {
    const divider = document.createElement("div");
    divider.className = "dropdownDivider";

    return divider;
}


function createDropdownEmpty(
    text = "Нет вариантов"
) {
    const empty = document.createElement("div");
    empty.className = "dropdownEmpty";
    empty.textContent = text;

    return empty;
}


// =========================
// Single select
// =========================

function openSelectDropdown({
    anchor,
    items,

    selectedId = null,

    getId = item => item.id,
    getLabel = item => item.name,
    renderItem = null,

    emptyItem = null,
    emptyText = "Нет вариантов",
    action = null,

    onSelect = null,

    align = "start",
    width = null
}) {
    const dropdown =
        document.createElement("div");

    dropdown.className = "dropdown";

    if (width) {
        dropdown.style.width = width;
    }

    const list =
        document.createElement("div");

    list.className = "dropdownList";

    dropdown.append(list);


    // Пустое значение
    if (emptyItem) {
        const content =
            emptyItem.render
                ? emptyItem.render()
                : null;

        list.append(
            createDropdownItem({
                text:
                    content
                        ? null
                        : emptyItem.text,

                content,

                selected:
                    selectedId === null,

                onClick: () => {
                    closeDropdown();

                    onSelect?.(null);
                }
            })
        );
    }


    // Основные варианты

    items.forEach(item => {
        const id =
            getId(item);

        const content =
            renderItem
                ? renderItem(item)
                : null;

        list.append(
            createDropdownItem({
                text:
                    content
                        ? null
                        : getLabel(item),

                content,

                selected:
                    id === selectedId,

                onClick: () => {
                    closeDropdown();

                    onSelect?.(id, item);
                }
            })
        );
    });

    if (
        items.length === 0 &&
        !emptyItem
    ) {
        list.append(
            createDropdownEmpty(
                emptyText
            )
        );
    }

    // Дополнительное действие
    if (action) {
        const divider =
            createDropdownDivider();

        const actionItem =
            createDropdownAction({
                text: action.text,
                icon: action.icon,

                onClick: () => {
                    if (!action.onCreate) {
                        closeDropdown();

                        action.onClick?.();

                        return;
                    }

                    const create =
                        createDropdownCreate({
                            placeholder:
                                action.placeholder ?? "",

                            maxLength:
                                action.maxLength,

                            onCreate:
                                action.onCreate,

                            onCancel: () => {
                                create.element.replaceWith(
                                    actionItem
                                );

                                actionItem.focus();
                            }
                        });

                    actionItem.replaceWith(
                        create.element
                    );

                    create.input.focus();
                }
            });

        list.append(
            divider,
            actionItem
        );
    }

    openDropdown({
        anchor,
        dropdown,
        align,
        removeOnClose: true
    });
}


// =========================
// Global events
// =========================

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


document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            activeDropdown
        ) {
            closeDropdown();
        }
    }
);