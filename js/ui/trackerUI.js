const tasksHeaderTitle =
    document.getElementById("tasksHeaderTitle");
const addCategoryTemplate = document.getElementById("addCategoryTemplate");

tasksHeaderTitle.addEventListener("click", () => {
    startEditTasksHeader();
});


function initUI() {
    initSidebarUI();
    initToolbarUI();
    initTaskUI();
}

function initTaskUI() {
    renderCurrentView();
}

function renderCurrentView() {
    switch (pageSettings.view) {
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
    const button =
        addCategoryTemplate.content.firstElementChild.cloneNode(true);

    button.addEventListener("click", () => {
        const category = createCategory(
            getCurrentProjectId()
        );

        if (!category) return;

        addCategory(category).catch(error => {
            console.error(
                "CREATE CATEGORY ERROR:",
                error
            );

            renderCurrentView();
        });

        renderCurrentView();

        const groupElement = trackerView.querySelector(
            `[data-group-field="categoryId"][data-group-value="${category.id}"]`
        );

        if (!groupElement) return;

        startEditTaskGroup(
            groupElement,
            true
        );
    });

    return button;
}

function renderTasksHeader() {
    const project = getProjectById(
        getCurrentProjectId()
    );

    tasksHeaderTitle.textContent =
        project?.title ?? "";
}

function startEditTasksHeader() {
    const project = getProjectById(
        getCurrentProjectId()
    );

    if (!project) return;

    startTextEdit(tasksHeaderTitle, {
        value: project.title,
        className: "tasksHeaderTitle",

        onSave: (value) => {
            if (!value) {
                renderTasksHeader();
                return;
            }

            updateProject(project.id, {
                title: value
            }).catch(error => {
                console.error(
                    "UPDATE PROJECT ERROR:",
                    error
                );

                // updateProject уже сделал rollback
                renderProjects();
                renderTasksHeader();
            });

            // локальная модель уже обновлена
            renderProjects();
            renderTasksHeader();
        },

        onCancel: () => {
            renderTasksHeader();
        }
    });
}