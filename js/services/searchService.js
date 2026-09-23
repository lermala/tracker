

const pageTaskSearch = { pageKey: null, query: "", open: false };

function getTaskSearchPageKey() {
    return `${currentPage.type}:${currentPage.id ?? ""}`;
}

function getPageTaskSearchQuery() {
    return pageTaskSearch.pageKey === getTaskSearchPageKey()
        ? normalizeSearchText(pageTaskSearch.query)
        : "";
}

function matchesTaskSearch(task, query) {
    return normalizeSearchText(task.title).includes(query) ||
        normalizeSearchText(getDescriptionPreview(task.description || "")).includes(query);
}

function searchEntities(query) {
    const normalizedQuery =
        normalizeSearchText(query);

    if (!normalizedQuery) {
        return {
            tasks: [],
            projects: [],
            categories: []
        };
    }

    return {
        tasks:
            searchTasks(normalizedQuery),

        projects:
            searchProjects(normalizedQuery),

        categories:
            searchCategories(normalizedQuery)
    };
}

function searchTasks(query) {
    return tasks.filter(task => matchesTaskSearch(task, query));
}

function searchProjects(query) {
    return projects.filter(project =>
        matchesSearch(
            project,
            query,
            [
                "title",
                "description"
            ]
        )
    );
}

function searchCategories(query) {
    return categories.filter(category =>
        matchesSearch(
            category,
            query,
            [
                "title",
                "description"
            ]
        )
    );
}

function matchesSearch(
    entity,
    query,
    fields
) {
    return fields.some(field =>
        normalizeSearchText(
            entity[field]
        ).includes(query)
    );
}

function normalizeSearchText(value) {
    return String(value ?? "")
        .trim()
        .toLocaleLowerCase();
}




