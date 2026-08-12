const sidebar = document.querySelector(".sidebar");
const sidebarToggleButton = document.getElementById("sidebarToggleButton");

const projectList = document.getElementById("projectList");
const addProjectButton = document.getElementById("addProjectButton");


sidebarToggleButton.addEventListener("click", () => {
    toggleSidebar();
});

addProjectButton.addEventListener("click", () => {
    startCreateProject();
});

function renderProjects() {
    projectList.innerHTML = "";

    const projects = getProjects();

    projects.forEach(project => {
        projectList.append(
            createProjectElement(project)
        );
    });
}

function createProjectElement(project) {
    const button = document.createElement("button");

    button.className = "projectItem";
    button.dataset.projectId = project.id;

    button.classList.toggle(
        "is-active",
        project.id === viewSettings.projectId
    );

    button.innerHTML = `
        <span class="projectColor"></span>

        <span class="projectTitle">
            ${project.title}
        </span>
    `;

    button.addEventListener("click", () => {
        selectProject(project.id);
    });

    return button;
}

function selectProject(projectId) {
    viewSettings.projectId = projectId;

    saveViewSettings(viewSettings);

    renderProjects();
    renderCurrentView();
}

function startCreateProject() {
    const input = document.createElement("input");

    input.className = "projectInput";
    input.placeholder = "Название проекта";

    addProjectButton.before(input);
    addProjectButton.classList.add("hidden");

    input.focus();

    let isFinished = false;

    function finish() {
        if (isFinished) return;

        isFinished = true;
        finishCreateProject(input);
    }

    function cancel() {
        if (isFinished) return;

        isFinished = true;
        cancelCreateProject(input);
    }

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            finish();
        }

        if (event.key === "Escape") {
            event.preventDefault();
            cancel();
        }
    });

    input.addEventListener("blur", finish);
}

function finishCreateProject(input) {
    if (!input.isConnected) return;

    const title = input.value.trim();

    if (!title) {
        cancelCreateProject(input);
        return;
    }

    const project = createProject(title);

    if (!project) {
        cancelCreateProject(input);
        return;
    }

    /*     createCategory(
            "Без раздела",
            project.id
        ); */

    input.remove();
    addProjectButton.classList.remove("hidden");

    selectProject(project.id);
}

function cancelCreateProject(input) {
    if (!input.isConnected) return;

    input.remove();
    addProjectButton.classList.remove("hidden");
}

function toggleSidebar() {
    const isCollapsed =
        sidebar.classList.toggle("is-collapsed");

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