const groupButton = document.getElementById("groupButton");
const groupButtonValue = document.getElementById("groupButtonValue");
const groupMenu = document.getElementById("groupMenu");

const sortButton = document.getElementById("sortButton");
const sortButtonValue = document.getElementById("sortButtonValue");
const sortMenu = document.getElementById("sortMenu");

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

function renderPageSettingsUI() {
    initSettingsToggles();

    updateGroupButton();
    updateSortButton();

    renderGroupMenu();
    renderSortMenu();
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

        updateGroupButton();
        renderGroupMenu();

        groupMenu.classList.add("hidden");

        renderCurrentView();
    });


    sortMenu.addEventListener("click", event => {
        const button = event.target.closest("[data-sort]");

        if (!button) return;

        pageSettings.sort = button.dataset.sort;

        saveCurrentPageSettings()

        updateSortButton();
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

function updateGroupButton() {
    groupButtonValue.textContent =
        getOptionLabel(
            GROUP_OPTIONS,
            pageSettings.group
        );
}

function updateSortButton() {
    sortButtonValue.textContent =
        getOptionLabel(
            SORT_OPTIONS,
            pageSettings.sort
        );
}

function getOptionLabel(options, value) {
    return options.find(
        option => option.value === value
    )?.label ?? "";
}

function initSettingsToggles() {
    createPageSettingToggle(
        "hideCompletedToggle",
        "hideCompleted"
    );

    createPageSettingToggle(
        "todayOnlyToggle",
        "todayOnly"
    );
}

function createPageSettingToggle(containerId, settingName) {
    const container = document.getElementById(containerId);

    const toggle = createToggle({
        value: pageSettings[settingName],

        onChange: value => {
            pageSettings[settingName] = value;

            saveCurrentPageSettings();
            renderCurrentView();
        }
    });

    container.replaceChildren(toggle);
}

function getAvailableGroupOptions() {
    const availableGroups =
        getAvailableGroups(currentPage);

    return GROUP_OPTIONS.filter(option =>
        availableGroups.includes(option.value)
    );
}