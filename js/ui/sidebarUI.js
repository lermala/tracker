const sidebar = document.querySelector(".sidebar");
const sidebarToggleButton = document.getElementById("sidebarToggleButton");

const sidebarUserButton = document.getElementById("sidebarUserButton");
const sidebarUserMenu = document.getElementById("sidebarUserMenu");
const signOutButton = document.getElementById("signOutButton");

const myTasksButton = document.getElementById("myTasksButton");

const projectList = document.getElementById("projectList");
const addProjectButton = document.getElementById("addProjectButton");


function initSidebarUI() {
    applySidebarState(viewSettings.sidebarCollapsed);

    bindEventsSidebar()
    initAppearanceSettings();

    renderSidebarNavigation();
}

function applySidebarState(isCollapsed) {
    sidebar.classList.toggle("is-collapsed", isCollapsed);

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

function toggleSidebar() {
    viewSettings.sidebarCollapsed = !viewSettings.sidebarCollapsed;

    saveViewSettings(viewSettings);
    applySidebarState(viewSettings.sidebarCollapsed);
}

function bindEventsSidebar() {
    sidebarToggleButton.addEventListener("click", toggleSidebar);

    myTasksButton.addEventListener("click", selectMyTasks);

    addProjectButton.addEventListener("click", () => {
        startCreateProject();
    });

    sidebarUserButton.addEventListener("click", event => {
        event.stopPropagation();
        sidebarUserMenu.classList.toggle("hidden");
    });

    signOutButton.addEventListener("click", () => {
        logout();
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(".sidebarUser")) {
            sidebarUserMenu.classList.add("hidden");
        }
    });
}

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

    addProject(project).catch(error => {
        console.error(
            "CREATE PROJECT ERROR:",
            error
        );

        // addProject сам откатит projects
        renderProjects();

        // если мы уже успели выбрать этот проект
        if (getCurrentProjectId() === project.id) {
            selectFallbackProject();
        }
    });

    input.remove();
    addProjectButton.classList.remove("hidden");

    selectProject(project.id);
}

function cancelCreateProject(input) {
    if (!input.isConnected) return;

    input.remove();
    addProjectButton.classList.remove("hidden");
}

async function renderUser() {
    // const user = await getCurrentUser();
    if (!currentUser) return;

    const email = currentUser.email;
    const name = email.split("@")[0];

    document.getElementById("sidebarUserAvatar").textContent =
        name.charAt(0).toUpperCase();

    document.getElementById("sidebarUserName").textContent =
        name;

    document.getElementById("sidebarUserMenuName").textContent =
        name;

    document.getElementById("sidebarUserEmail").textContent =
        email;
}

function initAppearanceSettings() {
    const themeContainer =
        document.getElementById("themeToggle");

    const accentContainer =
        document.getElementById("accentColorPicker");

    if (!themeContainer || !accentContainer) {
        return;
    }

    const appearance = getAppearance();

    const themeToggle = createToggle({
        value: appearance.theme === "dark",

        onChange: isDark => {
            setTheme(
                isDark
                    ? "dark"
                    : "light"
            );
        }
    });

    const accentPicker = createColorPicker({
        colors: DEFAULT_COLOR_PALETTE,
        value: appearance.accent,

        onChange: color => {
            setAccent(color);
        }
    });

    themeContainer.replaceChildren(themeToggle);
    accentContainer.replaceChildren(accentPicker);
}

async function showMyTasks() {
    const user = await getCurrentUser();

    const myTasks = tasks.filter(task =>
        task.assigneeId === user.id ||
        task.createdById === user.id
    );

    console.log("CURRENT USER:", user.id);
    console.log("MY TASKS:", myTasks);
}

function selectPage(page) {
    if (
        currentPage.type === page.type &&
        currentPage.id === page.id
    ) {
        return;
    }

    currentPage = page;
    pageSettings = getPageSettings(currentPage);

    renderSidebarNavigation();
    renderCurrentView();
}

function selectFallbackProject() {
    const projectId = projects[0]?.id ?? null;

    selectPage({
        type: PAGE.PROJECT,
        id: projectId
    });
}

function renderSidebarNavigation() {
    const page = currentPage;

    myTasksButton.classList.toggle(
        "is-active",
        page.type === PAGE.MY_TASKS
    );

    renderProjects();
}