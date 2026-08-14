const addProjectButton = document.getElementById("addProjectButton");

function initProjectUI() {
    addProjectButton.addEventListener(
        "click",
        startCreateProject
    );
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
        renderProjectsNavigation();

        // если мы уже успели выбрать этот проект
        if (getCurrentProjectId() === project.id) {
            selectFallbackPage();
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