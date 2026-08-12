const groupButton = document.getElementById("groupButton");
const groupButtonValue = document.getElementById("groupButtonValue");
const groupMenu = document.getElementById("groupMenu");

// const filterButton = document.getElementById("filterButton");
const sortButton = document.getElementById("sortButton");
const sortMenu = document.getElementById("sortMenu");
const sortOptions = document.querySelectorAll(".sortOption");

const hideCompletedCheckbox = document.getElementById("hideCompletedCheckbox");
const todayOnlyCheckbox = document.getElementById("todayOnlyCheckbox");

const GROUP_OPTIONS = [
    { value: null, label: "Нет" },
    { value: GROUP.CATEGORY, label: "Категория" },
    { value: GROUP.IS_COMPLETED, label: "Выполненные" },
    { value: GROUP.DUE_DATE, label: "Контрольный срок" }
];

function initSettingsUI() {
    bindSettingsEvents();

    hideCompletedCheckbox.checked = viewSettings.hideCompleted;
    todayOnlyCheckbox.checked = viewSettings.todayOnly;

    updateGroupButton();
    renderGroupMenu();
}

function bindSettingsEvents() {
    groupButton.addEventListener("click", () => {
        groupMenu.classList.toggle("hidden");
        sortMenu.classList.add("hidden");
    });

    groupMenu.addEventListener("click", event => {
        const button = event.target.closest("[data-group]");

        if (!button) return;

        const group = button.dataset.group;
        viewSettings.group = group === "null" ? null : group;

        saveViewSettings(viewSettings);

        updateGroupButton();
        renderGroupMenu();

        groupMenu.classList.add("hidden");

        renderCurrentView();
    });

    sortButton.addEventListener("click", () => {
        sortMenu.classList.toggle("hidden");
        groupMenu.classList.add("hidden");
    });

    sortOptions.forEach(option => {
        option.addEventListener("click", () => {
            viewSettings.sort = option.dataset.sort;
            saveViewSettings(viewSettings);

            sortOptions.forEach(btn =>
                btn.classList.remove("active")
            );
            option.classList.add("active");
            sortMenu.classList.add("hidden");

            renderCurrentView();
        });
    });

    hideCompletedCheckbox.addEventListener("change", () => {
        viewSettings.hideCompleted = hideCompletedCheckbox.checked;

        saveViewSettings(viewSettings);
        renderCurrentView();
    });

    todayOnlyCheckbox.addEventListener("change", () => {
        viewSettings.todayOnly = todayOnlyCheckbox.checked;

        saveViewSettings(viewSettings);
        renderCurrentView();
    });
}

function renderGroupMenu() {
    groupMenu.innerHTML = "";

    GROUP_OPTIONS.forEach(group => {
        const button = document.createElement("button");

        button.className = "toolbarMenuOption";
        button.dataset.group = group.value;
        button.textContent = group.label;

        if (group.value === viewSettings.group) {
            button.classList.add("active");
        }

        groupMenu.appendChild(button);
    });
}

function updateGroupButton() {
    const currentGroup = GROUP_OPTIONS.find(
        group => group.value === viewSettings.group
    );

    groupButtonValue.textContent = currentGroup?.label ?? "Нет";
}