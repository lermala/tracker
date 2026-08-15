let entityRouterInitialized = false;

function initEntityRouter() {
    if (entityRouterInitialized) {
        return;
    }

    window.addEventListener(
        "popstate",
        handleEntityPopState
    );

    entityRouterInitialized = true;
}

function handleEntityPopState() {
    const entity = getEntityFromUrl();

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
            const task = getTaskById(
                entity.id
            );

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

async function handleInitialEntityUrl() {
    const entity = getEntityFromUrl();

    if (!entity) {
        return;
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
            break;

        default:
            return null;
    }
}

async function prepareProjectFromUrl(projectId) {
    let project = getProjectById(projectId);

    if (!project) {
        await joinProject(projectId);

        [projects, categories, tasks] =
            await Promise.all([
                getProjectsFromDb(),
                getCategoriesFromDb(),
                getTasksFromDb()
            ]);

        project = getProjectById(projectId);
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

    pageSettings =
        getPageSettings(currentPage);
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