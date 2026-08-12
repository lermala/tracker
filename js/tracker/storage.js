const STORAGE_KEY = "tasks";
const CATEGORIES_KEY = "tracker_categories";
const VIEW_SETTINGS_KEY = "tracker-view-settings";
const PROJECTS_STORAGE_KEY = "projects";

const DEFAULT_PROJECT_ID = "pj-inbox";
const DEFAULT_CATEGORY_ID = "inbox";

const VIEW = {
    LIST: "list",
    BOARD: "board",
    CALENDAR: "calendar"
};

const GROUP = {
    CATEGORY: "category",
    IS_COMPLETED: "status",
    DUE_DATE: "dueAt"
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
    projectId: DEFAULT_PROJECT_ID
};

const DEFAULT_CATEGORIES = [
    {
        id: DEFAULT_CATEGORY_ID,
        projectId: DEFAULT_PROJECT_ID,
        title: "Входящие",
        createdAt: Date.now(),
        color: "green",
        order: 0
    }
];

const DEFAULT_PROJECTS = [
    {
        id: DEFAULT_PROJECT_ID,
        title: "Входящие",
        createdAt: Date.now(),
        color: "green",
        order: 0
    }
];

const TASK_PRIORITY = {
    NONE: "none",
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
};

// получить все задачи
function getTasks() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
        return JSON.parse(data);
    }

    return [];
}

// сохранить массив задач
function saveTasks(tasks) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

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

function getCategories() {
    const data = localStorage.getItem(CATEGORIES_KEY);

    if (data) {
        return JSON.parse(data);
    }

    return DEFAULT_CATEGORIES.map(category => ({ ...category }));
}

function saveCategories(categories) {
    localStorage.setItem(
        CATEGORIES_KEY,
        JSON.stringify(categories)
    );
}


// ПРОЕКТЫ

function saveProjects(projects) {
    localStorage.setItem(
        PROJECTS_STORAGE_KEY,
        JSON.stringify(projects)
    );
}

function loadProjects() {
    const data = localStorage.getItem(PROJECTS_STORAGE_KEY);

    if (data) {
        return JSON.parse(data);
    }

    return DEFAULT_PROJECTS.map(project => ({ ...project }));
}

function getCurrentProjectId() {
    return viewSettings.projectId;
}