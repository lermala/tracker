const myTasksButton = document.getElementById("myTasksButton");
const projectList = document.getElementById("projectList");

function initNavigationUI() {
    myTasksButton.addEventListener(
        "click",
        selectMyTasks
    );

    renderNavigation();
}

function renderNavigation() {
    const page = currentPage;

    myTasksButton.classList.toggle(
        "is-active",
        page.type === PAGE.MY_TASKS
    );

    renderProjectsNavigation();
}

function renderMyTasksNavigation() {
    myTasksButton.classList.toggle(
        "is-active",
        currentPage.type === PAGE.MY_TASKS
    );
}

function renderProjectsNavigation() {
    projectList.innerHTML = "";

    const projects = getProjects();

    projects.forEach(project => {
        projectList.append(
            createProjectElementNavigation(project)
        );
    });
}

function createProjectElementNavigation(project) {
    const item = document.createElement("div");

    item.className = "sidebarNavItem projectItem";
    item.dataset.projectId = project.id;

    item.classList.toggle(
        "is-active",
        project.id === getCurrentProjectId()
    );

    const color = document.createElement("span");
    color.className = "projectColor";

    color.style.setProperty(
        "--project-color",
        project.color || "var(--color-text-muted)"
    );

    const title = document.createElement("span");
    title.className = "sidebarNavTitle";
    title.textContent = project.title;

    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "projectMenuButton";
    menuButton.title = "Действия с проектом";

    menuButton.innerHTML = `
        <span class="material-symbols-rounded">
            more_horiz
        </span>
    `;

    item.append(
        color,
        title,
        menuButton
    );

    item.addEventListener("click", () => {
        selectProject(project.id);
    });

    menuButton.addEventListener("click", event => {
        event.stopPropagation();

        openProjectMenu(
            project,
            menuButton
        );
    });

    return item;
}

function selectProject(
    projectId,
    {
        updateUrl = true
    } = {}
) {
    selectPage({
        type: PAGE.PROJECT,
        id: projectId
    });

    if (updateUrl) {
        setEntityUrl(
            ENTITY_URL.PROJECT,
            projectId
        );
    }
}

function selectMyTasks({
    updateUrl = true
} = {}) {
    selectPage({
        type: PAGE.MY_TASKS
    });

    if (updateUrl) {
        clearEntityUrl();
    }
}

function selectFallbackPage() {
    selectMyTasks();
}

window.addEventListener("popstate", () => {
    handleCurrentUrl();
});

function handleCurrentUrl() {
    const entity = getEntityFromUrl();

    if (!entity) {
        selectMyTasks({
            updateUrl: false
        });

        return;
    }

    switch (entity.type) {
        case ENTITY_URL.PROJECT:
            selectProject(
                entity.id,
                {
                    updateUrl: false
                }
            );
            break;
    }
}