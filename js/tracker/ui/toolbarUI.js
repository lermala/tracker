const viewSwitcher = document.getElementById("viewSwitcher");

const settingsButton = document.getElementById("settingsButton");
const settingsMenu = document.getElementById("settingsMenu");

function initToolbarUI() {
    bindTaskToolbarEvents();
    updateViewButtons();
    initSettingsUI();
}

function bindTaskToolbarEvents() {
    viewSwitcher.addEventListener("click", event => {
        const button = event.target.closest("[data-view]");

        if (!button) return;

        viewSettings.view = button.dataset.view;
        saveViewSettings(viewSettings);

        updateViewButtons();
        renderCurrentView();
    });

    settingsButton.addEventListener("click", (event) => {
        event.stopPropagation();
        settingsMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".settingsGroup")) {
            settingsMenu.classList.add("hidden");
        }
    });
}

function updateViewButtons() {
    viewSwitcher.querySelectorAll("[data-view]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.view === viewSettings.view
        );
    });
}