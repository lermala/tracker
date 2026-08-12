function createCategory(projectId, title = "") {
    if (!projectId) return null;

    const now = Date.now();

    const category = createCategoryModel({
        id: crypto.randomUUID(),

        projectId,
        title: title.trim(),

        order: getNextCategoryOrder(projectId),

        createdAt: now,
        updatedAt: now
    });

    categories.push(category);
    saveCategories(categories);

    return category;
}

function updateCategory(id, changes) {
    const category = getCategoryById(id);

    if (!category) return;

    Object.assign(category, changes);
    category.updatedAt = Date.now();
    saveCategories(categories);

    return category;
}

function getCategoryById(id) {
    return categories.find(category => category.id === id);
}

function getCategoriesByProject(projectId) {
    return categories
        .filter(category =>
            category.projectId === projectId
        )
        .sort((a, b) =>
            a.order - b.order
        );
}

function getNextCategoryOrder(projectId) {
    const projectCategories = getCategoriesByProject(projectId);

    if (projectCategories.length === 0) {
        return 0;
    }

    return Math.max(
        ...projectCategories.map(category => category.order)
    ) + 1;
}

function deleteCategory(id) {
    categories = categories.filter(
        category => category.id !== id
    );

    const now = Date.now();

    tasks.forEach(task => {
        if (task.categoryId !== id) return;

        task.categoryId = null;
        task.updatedAt = now;
    });

    saveCategories(categories);
    saveTasks(tasks);
}

function updateCategoryOrder(categoryIds) {
    const now = Date.now();

    categoryIds.forEach((id, index) => {
        const category = getCategoryById(id);

        if (!category) return;

        if (category.order !== index) {
            category.order = index;
            category.updatedAt = now;
        }
    });

    saveCategories(categories);
}