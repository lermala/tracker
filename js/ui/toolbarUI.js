const viewSwitcher = document.getElementById("viewSwitcher");

const pageSettingsButton = document.getElementById("pageSettingsButton");
const settingsMenu = document.getElementById("settingsMenu");

function initToolbarUI() {
    bindTaskToolbarEvents();
    bindSettingsEvents();

    renderToolbarUI();
}

function renderToolbarUI() {
    updateViewButtons();
    renderPageSettingsUI();
}

function bindTaskToolbarEvents() {
    viewSwitcher.addEventListener("click", event => {
        const button = event.target.closest("[data-view]");

        if (!button) return;

        pageSettings.view = button.dataset.view;
        saveCurrentPageSettings()

        updateViewButtons();
        renderCurrentView();
    });

    pageSettingsButton.addEventListener("click", (event) => {
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
            button.dataset.view === pageSettings.view
        );
    });
}

