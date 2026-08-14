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
    const button = document.createElement("button");

    button.className = "sidebarNavItem projectItem";
    button.dataset.projectId = project.id;

    button.classList.toggle(
        "is-active",
        project.id === getCurrentProjectId()
    );

    const color = document.createElement("span");
    color.className = "projectColor";

    const title = document.createElement("span");
    title.className = "sidebarNavTitle";
    title.textContent = project.title;

    button.append(
        color,
        title
    );

    button.addEventListener("click", () => {
        selectProject(project.id);
    });

    return button;
}

function selectProject(projectId) {
    selectPage({
        type: PAGE.PROJECT,
        id: projectId
    });
}

function selectMyTasks() {
    selectPage({
        type: PAGE.MY_TASKS
    });
}

function selectFallbackPage() {
    selectMyTasks();
}