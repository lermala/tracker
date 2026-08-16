const viewSwitcher =
    document.getElementById("viewSwitcher");

function initToolbarUI() {
    bindTaskToolbarEvents();
    bindPageSettingsEvents();

    renderToolbarUI();
}

function renderToolbarUI() {
    updateViewButtons();
    renderPageSettingsUI();
}

function bindTaskToolbarEvents() {
    viewSwitcher.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest("[data-view]");

            if (!button) return;

            pageSettings.view =
                button.dataset.view;

            saveCurrentPageSettings();

            updateViewButtons();
            renderPageSettingsUI();
            renderCurrentView();
        }
    );
}

function updateViewButtons() {
    viewSwitcher
        .querySelectorAll("[data-view]")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.view ===
                pageSettings.view
            );
        });
}