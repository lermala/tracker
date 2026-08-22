

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
    return tasks.filter(task =>
        matchesSearch(
            task,
            query,
            [
                "title",
                "description"
            ]
        )
    );
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




