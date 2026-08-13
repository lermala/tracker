const tasksHeaderTitle =
    document.getElementById("tasksHeaderTitle");
const addCategoryTemplate = document.getElementById("addCategoryTemplate");

tasksHeaderTitle.addEventListener("click", () => {
    startEditTasksHeader();
});


function initUI() {
    renderProjects();
    initToolbarUI();
    initTaskUI();
}

function initTaskUI() {
    renderCurrentView();
}

function renderCurrentView() {
    // console.log(viewSettings);
    switch (viewSettings.view) {
        case VIEW.LIST:
            setViewClass("listView");
            renderListView();
            break;
        case VIEW.BOARD:
            setViewClass("boardView");
            renderBoardView();
            break;
        case VIEW.CALENDAR:
            setViewClass("calendarView");
            renderBoardView();
            break;
        default:
            setViewClass("listView");
            renderListView();
    }

    renderTasksHeader();
}

function setViewClass(viewClass) {
    trackerView.classList.remove(
        "listView",
        "boardView",
        "calendarView"
    );

    trackerView.classList.add(viewClass);
}

function createAddCategoryButton() {
    const button = addCategoryTemplate.content.firstElementChild.cloneNode(true);

    button.addEventListener("click", async () => {
        const category = await createCategory(
            viewSettings.projectId
        );

        renderCurrentView();

        const groupElement = trackerView.querySelector(
            `[data-group-field="categoryId"][data-group-value="${category.id}"]`
        );

        startEditTaskGroup(groupElement, true);
    });

    return button;
}

function renderTasksHeader() {
    const project = getProjectById(
        viewSettings.projectId
    );

    tasksHeaderTitle.textContent =
        project?.title ?? "";
}

function startEditTasksHeader() {
    const project = getProjectById(
        viewSettings.projectId
    );

    if (!project) return;

    startTextEdit(tasksHeaderTitle, {
        value: project.title,
        className: "tasksHeaderTitle",

        onSave: async (value) => {
            if (!value) {
                renderTasksHeader();
                return;
            }

            await updateProject(project.id, {
                title: value
            });

            renderProjects();
            renderTasksHeader();
        },

        onCancel: () => {
            renderTasksHeader();
        }
    });
}