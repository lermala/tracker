const tasksHeaderTitle =
    document.getElementById("tasksHeaderTitle");
const addCategoryTemplate = document.getElementById("addCategoryTemplate");

tasksHeaderTitle.addEventListener("click", () => {
    startEditProjectTitle();
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
    renderTasksHeader();

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
            renderCalendarView();
            break;

        default:
            setViewClass("listView");
            renderListView();
    }
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
    const projectId = getCurrentProjectId();
    if (!projectId) return null;

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
    switch (currentPage.type) {
        case PAGE.MY_TASKS:
            tasksHeaderTitle.textContent = "Мои задачи";
            break;

        case PAGE.PROJECT:
            const project = getProjectById(currentPage.id);

            tasksHeaderTitle.textContent = project?.title ?? "";

            break;
    }
}

function startEditProjectTitle() {
    if (currentPage.type !== PAGE.PROJECT) {
        return;
    }

    const project = getProjectById(currentPage.id);

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
                renderProjectsNavigation();
                renderTasksHeader();
            });

            // локальная модель уже обновлена
            renderProjectsNavigation();
            renderTasksHeader();
        },

        onCancel: () => {
            renderTasksHeader();
        }
    });
}