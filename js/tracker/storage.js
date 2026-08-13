const VIEW_SETTINGS_KEY = "tracker-view-settings";

const VIEW = {
    LIST: "list",
    BOARD: "board",
    CALENDAR: "calendar"
};

const GROUP = {
    CATEGORY: "category",
    DUE_DATE: "dueDate"
};

const DEFAULT_VIEW_SETTINGS = {
    filter: "all",
    sort: "created",
    sortDirection: "desc",
    search: "",
    hideCompleted: false,
    todayOnly: false,
    view: VIEW.LIST,
    group: GROUP.CATEGORY,
    projectId: null
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