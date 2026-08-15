const addProjectButton = document.getElementById("addProjectButton");

function initProjectUI() {
    addProjectButton.addEventListener("click", () => {
        openProjectEditor();
    });
}

function cancelCreateProject(input) {
    if (!input.isConnected) return;

    input.remove();
    addProjectButton.classList.remove("hidden");
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