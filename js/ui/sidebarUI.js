const sidebar = document.querySelector(".sidebar");
const sidebarToggleButton = document.getElementById("sidebarToggleButton");

function initSidebarUI() {
    applySidebarState(viewSettings.sidebarCollapsed);

    sidebarToggleButton.addEventListener(
        "click",
        toggleSidebar
    );

    initSidebarSettingsUI();
    initNavigationUI();
    initProjectUI();
}

function applySidebarState(isCollapsed) {
    sidebar.classList.toggle("is-collapsed", isCollapsed);

    const icon = sidebarToggleButton.querySelector(
        ".material-symbols-rounded"
    );

    icon.textContent = isCollapsed
        ? "left_panel_open"
        : "left_panel_close";

    sidebarToggleButton.title = isCollapsed
        ? "Развернуть"
        : "Свернуть";
}

function toggleSidebar() {
    viewSettings.sidebarCollapsed = !viewSettings.sidebarCollapsed;

    saveViewSettings(viewSettings);
    applySidebarState(viewSettings.sidebarCollapsed);
}