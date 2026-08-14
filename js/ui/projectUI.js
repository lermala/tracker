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
    input.placeholder = "Название проекта"; // 

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

function startRenameProject(project) {
    const item = document.querySelector(
        `[data-project-id="${project.id}"]`
    );

    const title = item?.querySelector(
        ".sidebarNavTitle"
    );

    if (!title) return;

    startTextEdit(title, {
        value: project.title,
        className: "projectInput",

        onSave: value => {
            if (!value || value === project.title) {
                renderProjectsNavigation();
                return;
            }

            updateProject(project.id, {
                title: value
            }).catch(error => {
                console.error(
                    "UPDATE PROJECT ERROR:",
                    error
                );

                renderProjectsNavigation();
                renderTasksHeader();
            });

            renderProjectsNavigation();
            renderTasksHeader();
        },

        onCancel: () => {
            renderProjectsNavigation();
        }
    });
}

function changeProjectColor(project, color) {
    console.log(project.color);
    updateProject(project.id, {
        color
    }).catch(error => {
        console.error(
            "UPDATE PROJECT COLOR ERROR:",
            error
        );
        renderProjectsNavigation();
    });

    renderProjectsNavigation();

    console.log(project.color);
}

async function deleteProjectWithConfirmation(project) {
    const confirmed = confirm(
        `Удалить проект «${project.title}»?`
    );

    if (!confirmed) return;

    try {
        await deleteProject(project.id);

        if (getCurrentProjectId() === project.id) {
            selectMyTasks();
        }

        renderProjectsNavigation();
    } catch (error) {
        console.error(
            "DELETE PROJECT ERROR:",
            error
        );

        renderProjectsNavigation();
    }
}