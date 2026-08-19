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

const TASK_PROPERTY = {
    ASSIGNEE: "assignee",
    DUE_DATE: "dueDate",
    DURATION: "duration",
    PRIORITY: "priority",
    PROJECT: "project",
    CATEGORY: "category",
    STATUS: "status"
};

const DEFAULT_PAGE_SETTINGS = {
    filter: "all",
    sort: "created",
    // sortDirection: "desc",
    search: "",
    hideCompleted: false,
    todayOnly: false,
    view: VIEW.LIST,
    group: GROUP.DUE_DATE,

    visibleProperties: {
        [VIEW.LIST]: [
            TASK_PROPERTY.DUE_DATE
        ],

        [VIEW.BOARD]: [
            TASK_PROPERTY.DUE_DATE,
            TASK_PROPERTY.ASSIGNEE
        ],

        [VIEW.CALENDAR]: [
            TASK_PROPERTY.PRIORITY
        ]
    }
};

const PAGE_DEFAULT_SETTINGS = {
    [PAGE.PROJECT]: {
        group: GROUP.CATEGORY
    },

    [PAGE.MY_TASKS]: {
        group: GROUP.DUE_DATE
    }
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

const DEFAULT_VISIBLE_PROPERTIES = {
    [VIEW.LIST]: [
        TASK_PROPERTY.DUE_DATE
    ],

    [VIEW.BOARD]: [
        TASK_PROPERTY.ASSIGNEE,
        TASK_PROPERTY.DURATION,
        TASK_PROPERTY.DUE_DATE
    ],

    [VIEW.CALENDAR]: []
};

function getPageSettings(page) {
    const saved = JSON.parse(
        localStorage.getItem(
            PAGE_SETTINGS_KEY
        ) || "{}"
    );

    let savedSettings = {};

    if (page.type === PAGE.PROJECT) {
        savedSettings =
            saved.projects?.[page.id] ?? {};
    }

    if (page.type === PAGE.MY_TASKS) {
        savedSettings =
            saved.myTasks ?? {};
    }

    const pageDefaults =
        PAGE_DEFAULT_SETTINGS[
            page.type
        ] ?? {};

    return {
        ...DEFAULT_PAGE_SETTINGS,
        ...pageDefaults,
        ...savedSettings,

        visibleProperties: {
            ...DEFAULT_PAGE_SETTINGS
                .visibleProperties,

            ...pageDefaults
                .visibleProperties,

            ...savedSettings
                .visibleProperties
        }
    };
}

function savePageSettings(page, settings) {
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

function getVisibleTaskProperties() {
    return (
        pageSettings.visibleProperties[
        pageSettings.view
        ] ?? []
    );
}

function setTaskPropertyVisible(
    property,
    visible
) {
    const view = pageSettings.view;
    const properties = [
        ...getVisibleTaskProperties()
    ];
    const index = properties.indexOf(property);
    
    if (visible && index === -1) {
        properties.push(property);
    }

    if (!visible && index !== -1) {
        properties.splice(index, 1);
    }

    pageSettings.visibleProperties = {
        ...pageSettings.visibleProperties,

        [view]: properties
    };

    saveCurrentPageSettings();
}

function isTaskPropertyVisible(property) {
    return getVisibleTaskProperties()
        .includes(property);
}