

function createCategory(projectId, title = "") {
    if (!projectId) return null;

    const projectCategories = getCategoriesByProject(projectId);

    const category = {
        id: crypto.randomUUID(),
        projectId,
        title: title.trim(),
        createDate: Date.now(),
        color: "black",
        order: projectCategories.length
    };

    categories.push(category);
    saveCategories(categories);

    return category;
}

function addCategory(category) {
    categories.push(category);
    saveCategories(categories);
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

function updateCategory(id, changes) {
    const category = getCategoryById(id);

    if (!category) return;

    Object.assign(category, changes);

    saveCategories(categories);

    return category;
}

function deleteCategory(id) {
    categories = categories.filter(category => category.id !== id);

    tasks = tasks.filter(task => task.categoryId !== id);

    saveCategories(categories);
    saveTasks(tasks);
}

function updateCategoryOrder(categoryIds) {
    categoryIds.forEach((id, index) => {
        const category = getCategoryById(id);

        if (!category) return;

        category.order = index;
    });

    saveCategories(categories);
}