const propertiesButton = document.getElementById("propertiesButton");
const propertiesMenu = document.getElementById("propertiesMenu");
const groupButton = document.getElementById("groupButton");
const groupMenu = document.getElementById("groupMenu");
const filterButton = document.getElementById("filterButton");
const filterMenu = document.getElementById("filterMenu");
const sortButton = document.getElementById("sortButton");
const sortMenu = document.getElementById("sortMenu");

const hideCompletedCheckbox =
    document.getElementById(
        "hideCompletedCheckbox"
    );

const GROUP_OPTIONS = [
    { value: null, label: "Нет" },
    { value: GROUP.CATEGORY, label: "Категория" },
    { value: GROUP.DUE_DATE, label: "Контрольный срок" },
    { value: GROUP.PROJECT, label: "Проект" }
];

const SORT_OPTIONS = [
    { value: "created", label: "Дата создания" },
    { value: "dueDate", label: "Контрольный срок" },
    { value: "priority", label: "Приоритет" }
];


const toolbarMenus = [
    propertiesMenu,
    groupMenu,
    filterMenu,
    sortMenu
];

function closeToolbarMenus() {
    toolbarMenus.forEach(menu => {
        menu.classList.add("hidden");
    });
}


function bindPageSettingsEvents() {
    propertiesButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openToolbarMenu(
                propertiesButton,
                propertiesMenu
            );
        }
    );

    groupButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openToolbarMenu(
                groupButton,
                groupMenu
            );
        }
    );

    filterButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openToolbarMenu(
                filterButton,
                filterMenu
            );
        }
    );

    sortButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openToolbarMenu(
                sortButton,
                sortMenu
            );
        }
    );

    bindGroupMenu();
    bindSortMenu();


    hideCompletedCheckbox.addEventListener(
        "change",
        () => {
            pageSettings.hideCompleted =
                hideCompletedCheckbox.checked;

            saveCurrentPageSettings();
            renderCurrentView();
        }
    );

    document.addEventListener(
        "click",
        event => {
            if (
                event.target.closest(
                    ".toolbarMenu, .toolbarAction"
                )
            ) {
                return;
            }

            closeToolbarMenus();
        }
    );
}

function bindGroupMenu() {
    groupMenu.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest("[data-group]");

            if (!button) return;

            const value =
                button.dataset.group;

            pageSettings.group =
                value === "null"
                    ? null
                    : value;

            saveCurrentPageSettings();

            renderGroupMenu();
            closeToolbarMenus();

            renderCurrentView();
        }
    );
}

function bindSortMenu() {
    sortMenu.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest("[data-sort]");

            if (!button) return;

            pageSettings.sort =
                button.dataset.sort;

            saveCurrentPageSettings();

            renderSortMenu();
            closeToolbarMenus();

            renderCurrentView();
        }
    );
}



function renderPageSettingsUI() {
    renderPropertiesMenu();
    renderGroupMenu();
    renderSortMenu();
    renderFilterSettings();
}

function renderPropertiesMenu() {
    propertiesMenu.replaceChildren();

    Object.entries(
        TASK_PROPERTY_CONFIG
    ).forEach(([property, config]) => {
        const label =
            document.createElement("label");

        label.className =
            "propertyMenuItem";

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "checkbox";

        checkbox.checked =
            isTaskPropertyVisible(property);

        const text =
            document.createElement("span");

        text.textContent = config.label;

        checkbox.addEventListener(
            "change",
            () => {
                setTaskPropertyVisible(
                    property,
                    checkbox.checked
                );

                renderCurrentView();
            }
        );

        label.append(
            checkbox,
            text
        );

        propertiesMenu.append(label);
    });
}

function bindSettingsEvents() {
    groupButton.addEventListener("click", () => {
        toggleSelectMenu(groupMenu);
    });

    sortButton.addEventListener("click", () => {
        toggleSelectMenu(sortMenu);
    });


    groupMenu.addEventListener("click", event => {
        const button = event.target.closest("[data-group]");

        if (!button) return;

        const value = button.dataset.group;

        pageSettings.group =
            value === "null"
                ? null
                : value;

        saveCurrentPageSettings()

        renderGroupMenu();

        groupMenu.classList.add("hidden");

        renderCurrentView();
    });


    sortMenu.addEventListener("click", event => {
        const button = event.target.closest("[data-sort]");

        if (!button) return;

        pageSettings.sort = button.dataset.sort;

        saveCurrentPageSettings()

        renderSortMenu();

        sortMenu.classList.add("hidden");

        renderCurrentView();
    });
}


function toggleSelectMenu(menu) {
    const isHidden =
        menu.classList.contains("hidden");

    closeSelectMenus();

    if (isHidden) {
        menu.classList.remove("hidden");
    }
}


function closeSelectMenus() {
    groupMenu.classList.add("hidden");
    sortMenu.classList.add("hidden");
}


function renderGroupMenu() {
    renderSelectOptions({
        container: groupMenu,
        options: getAvailableGroupOptions(),
        selectedValue: pageSettings.group,
        dataName: "group"
    });
}


function renderSortMenu() {
    renderSelectOptions({
        container: sortMenu,
        options: SORT_OPTIONS,
        selectedValue: pageSettings.sort,
        dataName: "sort"
    });
}


function renderSelectOptions({
    container,
    options,
    selectedValue,
    dataName
}) {
    container.innerHTML = "";

    options.forEach(option => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "menuItem";

        button.dataset[dataName] = option.value;
        button.textContent = option.label;

        button.classList.toggle(
            "is-selected",
            option.value === selectedValue
        );

        container.append(button);
    });
}

function getOptionLabel(options, value) {
    return options.find(
        option => option.value === value
    )?.label ?? "";
}

function getAvailableGroupOptions() {
    const availableGroups =
        getAvailableGroups(currentPage);

    return GROUP_OPTIONS.filter(option =>
        availableGroups.includes(option.value)
    );
}


function openToolbarMenu(button, menu) {
    const isOpen =
        !menu.classList.contains("hidden");

    closeToolbarMenus();

    if (isOpen) return;

    const rect =
        button.getBoundingClientRect();

    menu.classList.remove("hidden");

    const menuRect =
        menu.getBoundingClientRect();

    let left =
        rect.right - menuRect.width;

    let top =
        rect.bottom + 6;

    const padding = 8;

    if (left < padding) {
        left = padding;
    }

    if (
        left + menuRect.width >
        window.innerWidth - padding
    ) {
        left =
            window.innerWidth -
            menuRect.width -
            padding;
    }

    if (
        top + menuRect.height >
        window.innerHeight - padding
    ) {
        top =
            rect.top -
            menuRect.height -
            6;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
}

function closeToolbarMenus() {
    toolbarMenus.forEach(menu => {
        menu.classList.add("hidden");
    });
}

function renderFilterSettings() {
    hideCompletedCheckbox.checked =
        pageSettings.hideCompleted;
}