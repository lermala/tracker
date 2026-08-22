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
    {
        value: null,
        label: "Нет"
    },
    {
        value: GROUP.CATEGORY,
        label: "Раздел"
    },
    {
        value: GROUP.DUE_DATE,
        label: "Контрольный срок"
    },
    {
        value: GROUP.PROJECT,
        label: "Проект"
    }
];

const SORT_OPTIONS = [
    {
        value: "manual",
        label: "Нет"
    },
    {
        value: "created",
        label: "Дата создания"
    },
    {
        value: "dueDate",
        label: "Контрольный срок"
    },
    {
        value: "priority",
        label: "Приоритет"
    }
];


function bindPageSettingsEvents() {
    propertiesButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openDropdown({
                anchor: propertiesButton,
                dropdown: propertiesMenu,
                align: "end"
            });
        }
    );

    groupButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openDropdown({
                anchor: groupButton,
                dropdown: groupMenu,
                align: "end"
            });
        }
    );

    filterButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openDropdown({
                anchor: filterButton,
                dropdown: filterMenu,
                align: "end"
            });
        }
    );

    sortButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openDropdown({
                anchor: sortButton,
                dropdown: sortMenu,
                align: "end"
            });
        }
    );

    hideCompletedCheckbox.addEventListener(
        "change",
        () => {
            pageSettings.hideCompleted =
                hideCompletedCheckbox.checked;

            saveCurrentPageSettings();
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
        const item = document.createElement("label");
        item.className = "dropdownItem";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.checked = isTaskPropertyVisible(property);

        const text = document.createElement("span");
        text.className = "dropdownItemText";
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

        item.append(
            checkbox,
            text
        );

        propertiesMenu.append(item);
    });
}


function renderGroupMenu() {
    groupMenu.replaceChildren();

    getAvailableGroupOptions()
        .forEach(option => {
            const item =
                createDropdownItem({
                    text: option.label,

                    selected:
                        option.value ===
                        pageSettings.group,

                    onClick: () => {
                        pageSettings.group =
                            option.value;

                        saveCurrentPageSettings();

                        renderGroupMenu();
                        renderCurrentView();

                        closeDropdown();
                    }
                });

            groupMenu.append(item);
        });
}


function renderSortMenu() {
    sortMenu.replaceChildren();

    SORT_OPTIONS.forEach(option => {
        const item =
            createDropdownItem({
                text: option.label,

                selected:
                    option.value ===
                    pageSettings.sort,

                onClick: () => {
                    pageSettings.sort =
                        option.value;

                    saveCurrentPageSettings();

                    renderSortMenu();
                    renderCurrentView();

                    closeDropdown();
                }
            });

        sortMenu.append(item);
    });
}


function renderFilterSettings() {
    hideCompletedCheckbox.checked =
        pageSettings.hideCompleted;
}


function getAvailableGroupOptions() {
    const availableGroups =
        getAvailableGroups(currentPage);

    return GROUP_OPTIONS.filter(option =>
        availableGroups.includes(
            option.value
        )
    );
}