const VIEW_SETTINGS_KEY = "tracker-view-settings";

const DEFAULT_VIEW_SETTINGS = {
    sidebarCollapsed: false
};

function getViewSettings() {
    const saved = JSON.parse(
        localStorage.getItem(VIEW_SETTINGS_KEY) || "{}"
    );

    return {
        ...DEFAULT_VIEW_SETTINGS,
        ...saved
    };
}

function saveViewSettings(settings) {    
    localStorage.setItem(
        VIEW_SETTINGS_KEY,
        JSON.stringify(settings)
    );
}