let entityRouterInitialized = false;
const REDIRECT_URL_KEY = "redirectAfterAuth";

function initEntityRouter() {
    if (entityRouterInitialized) {
        return;
    }

    window.addEventListener(
        "popstate",
        handlePopState
    );

    entityRouterInitialized = true;
}

function handlePopState() {
    const page =
        getPageFromUrl();

    if (page) {
        closeTaskCard({
            updateUrl: false
        });

        selectPage(page);

        return;
    }

    const entity =
        getEntityFromUrl();

    if (!entity) {
        closeTaskCard({
            updateUrl: false
        });

        selectPage({
            type: PAGE.MY_TASKS
        });

        return;
    }

    switch (entity.type) {
        case ENTITY_URL.PROJECT:
            closeTaskCard({
                updateUrl: false
            });

            selectPage({
                type: PAGE.PROJECT,
                id: entity.id
            });
            break;

        case ENTITY_URL.TASK:
            const task =
                getTaskById(entity.id);

            if (!task) {
                return;
            }

            selectPage({
                type: PAGE.PROJECT,
                id: task.projectId
            });

            openTaskCard(
                task,
                {
                    updateUrl: false
                }
            );
            break;
    }
}

async function handleInitialUrl() {
    const page =
        getPageFromUrl();

    if (page) {
        currentPage = page;
        pageSettings = null;

        return null;
    }

    const entity =
        getEntityFromUrl();

    if (!entity) {
        return null;
    }

    switch (entity.type) {
        case ENTITY_URL.PROJECT:
            await prepareProjectFromUrl(
                entity.id
            );
            break;

        case ENTITY_URL.TASK:
            return prepareTaskFromUrl(
                entity.id
            );

        default:
            return null;
    }

    return null;
}

async function prepareProjectFromUrl(projectId) {
    let project = getProjectById(projectId);

    if (!project) {
        const joinResult = await joinProject(projectId);

        console.log(
            "JOIN RESULT:",
            joinResult
        );

        [projects, categories, tasks] =
            await Promise.all([
                getProjectsFromDb(),
                getCategoriesFromDb(),
                getTasksFromDb()
            ]);

        project = getProjectById(projectId);

        console.log(
            "PROJECTS AFTER JOIN:",
            projects
        );
    }

    if (!project) {
        throw new Error(
            "Project not found"
        );
    }

    currentPage = {
        type: PAGE.PROJECT,
        id: projectId
    };

    pageSettings = getPageSettings(currentPage);
}

function prepareTaskFromUrl(taskId) {
    const task = getTaskById(taskId);

    if (!task) {
        throw new Error(
            "Task not found or access denied"
        );
    }

    currentPage = {
        type: PAGE.PROJECT,
        id: task.projectId
    };

    pageSettings = getPageSettings(currentPage);
    return task;
}

function setCurrentPageUrl() { // routerService
    switch (currentPage.type) {
        case PAGE.PROJECT:
            setEntityUrl(
                ENTITY_URL.PROJECT,
                currentPage.id
            );
            break;

        default:
            clearEntityUrl();
    }
}

function syncUrlWithCurrentPage() {
    switch (currentPage.type) {
        case PAGE.PROJECT:
            setEntityUrl(
                ENTITY_URL.PROJECT,
                currentPage.id
            );
            break;

        default:
            clearEntityUrl();
    }
}

function saveUrlBeforeAuth() {
    sessionStorage.setItem(
        REDIRECT_URL_KEY,
        window.location.pathname
    );
}

function setTimesheetUrl() {
    history.pushState(
        null,
        "",
        `${BASE_PATH}/timesheet`
    );
}

function getPageFromUrl() {
    let pathname =
        window.location.pathname;

    if (
        BASE_PATH &&
        pathname.startsWith(BASE_PATH)
    ) {
        pathname =
            pathname.slice(BASE_PATH.length);
    }

    const parts = pathname
        .split("/")
        .filter(Boolean);

    if (
        parts.length === 1 &&
        parts[0] === PAGE_URL.TIMESHEET
    ) {
        return {
            type: PAGE.TIMESHEET
        };
    }

    return null;
}