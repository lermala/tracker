function initGlobalSearch() {
    const button = document.getElementById("searchButton");

    if (!button) {
        console.error("SEARCH BUTTON NOT FOUND");
        return;
    }

    button.addEventListener("click", openGlobalSearch);
}

function openGlobalSearch() {
    closeGlobalSearch();

    const overlay = globalSearchTemplate
        .content
        .firstElementChild
        .cloneNode(true);

    const input = overlay.querySelector(".globalSearchInput");
    const results = overlay.querySelector(".globalSearchResults");
    const closeButton = overlay.querySelector(".globalSearchCloseButton");

    input.addEventListener("input", () => {
        renderGlobalSearchResults(
            results,
            input.value
        );
    });

    closeButton.addEventListener(
        "click",
        closeGlobalSearch
    );

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeGlobalSearch();
        }
    });

    document.body.append(overlay);

    renderGlobalSearchEmpty(
        results,
        "Начните вводить запрос"
    );

    input.focus();
}

function renderGlobalSearchResults(
    container,
    query
) {
    container.replaceChildren();

    if (!query.trim()) {
        renderGlobalSearchEmpty(
            container,
            "Начните вводить запрос"
        );
        return;
    }

    const results = searchEntities(query);

    const hasResults =
        results.tasks.length > 0 ||
        results.projects.length > 0 ||
        results.categories.length > 0;

    if (!hasResults) {
        renderGlobalSearchEmpty(
            container,
            "Ничего не найдено"
        );
        return;
    }

    renderSearchSection(
        container,
        "Задачи",
        results.tasks,
        createTaskSearchResult
    );

    renderSearchSection(
        container,
        "Проекты",
        results.projects,
        createProjectSearchResult
    );

    renderSearchSection(
        container,
        "Разделы",
        results.categories,
        createCategorySearchResult
    );
}

function renderSearchSection(
    container,
    title,
    entities,
    createResult
) {
    if (!entities.length) return;

    const section = document.createElement("div");
    section.className = "globalSearchSection";

    const heading = document.createElement("div");
    heading.className = "globalSearchSectionTitle";
    heading.textContent = title;

    section.append(heading);

    entities.forEach(entity => {
        section.append(
            createResult(entity)
        );
    });

    container.append(section);
}

function createTaskSearchResult(task) {
    const element = createSearchResult({
        icon: createTaskSearchCheckbox(task),
        title: task.title,
        description: task.description
    });

    element.classList.toggle(
        "is-completed",
        task.isCompleted
    );

    element.addEventListener("click", () => {
        const currentTask = getTaskById(task.id);

        if (!currentTask) return;

        closeGlobalSearch();
        openTaskCard(currentTask);
    });

    return element;
}

function createTaskSearchCheckbox(task) {
    const checkbox = document.createElement("div");
    checkbox.className = "taskCheckbox globalSearchTaskCheckbox";

    const check = document.createElement("span");
    check.className = "material-symbols-rounded";
    check.textContent = "check";

    checkbox.append(check);

    fillTaskCheckbox(
        checkbox,
        task
    );

    return checkbox;
}

function createProjectSearchResult(project) {
    const element = createSearchResult({
        icon: "folder",
        title: project.title,
        description: project.description
    });

    if (project.color) {
        element.style.setProperty(
            "--search-result-color",
            project.color
        );
    }

    element.addEventListener("click", () => {
        closeGlobalSearch();
        selectProject(project.id);
    });

    return element;
}

function createCategorySearchResult(category) {
    const element = createSearchResult({
        icon: "label",
        title: category.title,
        description: category.description
    });

    if (category.color) {
        element.style.setProperty(
            "--search-result-color",
            category.color
        );
    }

    element.addEventListener("click", () => {
        const project = getProjectById(category.projectId);
        closeGlobalSearch();
        selectProject(project.id);
    });

    return element;
}

function createSearchResult({
    icon,
    title,
    description
}) {
    const element = document.createElement("button");

    element.type = "button";
    element.className = "globalSearchResult";

    const iconElement = icon instanceof Node
        ? icon
        : createSearchResultIcon(icon);

    const content = document.createElement("div");
    content.className = "globalSearchResultContent";

    const titleElement = document.createElement("div");
    titleElement.className = "globalSearchResultTitle";
    titleElement.textContent = title;

    content.append(titleElement);

    if (description?.trim()) {
        const descriptionElement = document.createElement("div");

        descriptionElement.className = "globalSearchResultDescription";
        descriptionElement.textContent = getDescriptionPreview(description);

        content.append(descriptionElement);
    }

    element.append(
        iconElement,
        content
    );

    return element;
}

function createSearchResultIcon(icon) {
    const element = document.createElement("span");

    element.className =
        "material-symbols-rounded globalSearchResultIcon";

    element.textContent = icon;

    return element;
}

function renderGlobalSearchEmpty(
    container,
    text
) {
    const element = document.createElement("div");
    element.className = "globalSearchEmpty";
    element.textContent = text;

    container.append(element);
}

function closeGlobalSearch() {
    document
        .querySelector(".globalSearchOverlay")
        ?.remove();
}