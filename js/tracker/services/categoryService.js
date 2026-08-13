async function createCategory(projectId, title = "") {
    if (!projectId) return null;

    const category = createCategoryModel({
        id: crypto.randomUUID(),

        projectId,
        title: title.trim(),

        order: getNextCategoryOrder(projectId)
    });

    const savedCategory = await createCategoryInDb(category);

    categories.push(savedCategory);

    return savedCategory;
}

async function updateCategory(id, changes) {
    const category = getCategoryById(id);
    if (!category) return;

    Object.assign(category, changes);
    const savedCategory = await updateCategoryInDb(category);
    Object.assign(category, savedCategory);

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

async function deleteCategory(id) {
    await deleteCategoryFromDb(id);

    categories = categories.filter(
        category => category.id !== id
    );

    tasks.forEach(task => {
        if (task.categoryId === id) {
            task.categoryId = null;
        }
    });
}

async function updateCategoryOrder(categoryIds) {
    const changedCategories = [];

    categoryIds.forEach((id, index) => {
        const category = getCategoryById(id);

        if (!category) return;

        if (category.order !== index) {
            category.order = index;
            changedCategories.push(category);
        }
    });

    await Promise.all(
        changedCategories.map(category =>
            updateCategoryInDb(category)
        )
    );
}