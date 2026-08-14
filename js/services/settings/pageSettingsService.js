const PAGE_SETTINGS_KEY = "tracker-page-settings";

const PAGE = {
    PROJECT: "project",
    MY_TASKS: "myTasks"
};

const VIEW = {
    LIST: "list",
    BOARD: "board",
    CALENDAR: "calendar"
};

const GROUP = {
    CATEGORY: "category",
    DUE_DATE: "dueDate",
    PROJECT: "project"
};

const DEFAULT_PAGE_SETTINGS = {
    filter: "all",
    sort: "created",
    sortDirection: "desc",
    search: "",
    hideCompleted: false,
    todayOnly: false,
    view: VIEW.LIST,
    group: GROUP.DUE_DATE
};

const AVAILABLE_GROUPS = {
    [PAGE.PROJECT]: [
        null,
        GROUP.CATEGORY,
        GROUP.DUE_DATE
    ],

    [PAGE.MY_TASKS]: [
        null,
        GROUP.PROJECT,
        GROUP.DUE_DATE
    ]
};

function getPageSettings(page) {
    const saved = JSON.parse(
        localStorage.getItem(PAGE_SETTINGS_KEY) || "{}"
    );

    let savedSettings = {};

    if (page.type === PAGE.PROJECT) {
        savedSettings = saved.projects?.[page.id] ?? {};
    }

    if (page.type === PAGE.MY_TASKS) {
        savedSettings = saved.myTasks ?? {};
    }

    return {
        ...DEFAULT_PAGE_SETTINGS,
        ...savedSettings
    };
}

function savePageSettings(page, settings) {
    console.log("SAVE PAGE SETTINGS", page, settings);

    const saved = JSON.parse(
        localStorage.getItem(PAGE_SETTINGS_KEY) || "{}"
    );

    if (page.type === PAGE.PROJECT) {
        saved.projects ??= {};
        saved.projects[page.id] = settings;
    }

    if (page.type === PAGE.MY_TASKS) {
        saved.myTasks = settings;
    }

    localStorage.setItem(
        PAGE_SETTINGS_KEY,
        JSON.stringify(saved)
    );
}

function getAvailableGroups(page) {
    return AVAILABLE_GROUPS[page.type] ?? [];
}