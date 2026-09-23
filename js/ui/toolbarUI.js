const viewSwitcher = document.getElementById("viewSwitcher");

function initToolbarUI() {
    bindTaskToolbarEvents();
    bindPageSettingsEvents();

    renderToolbarUI();
}

function renderToolbarUI() {
    if (currentPage.type === PAGE.TIMESHEET) {
        trackerToolbar.hidden = true;
        return;
    }
    trackerToolbar.hidden = false;

    updateViewButtons();
    renderPageSettingsUI();
}

function bindTaskToolbarEvents() {
    viewSwitcher.addEventListener(
        "click",
        event => {
            const button = event.target.closest("[data-view]");
            if (!button) return;

            pageSettings.view = button.dataset.view;

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
            button.setAttribute("aria-pressed", String(button.dataset.view === pageSettings.view));
            button.classList.toggle(
                "active",
                button.dataset.view ===
                pageSettings.view
            );
        });
}
