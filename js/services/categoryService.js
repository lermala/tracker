// ===== Создание =====

function createCategory(projectId, title = "") {
    if (!projectId) return null;

    return createCategoryModel({
        id: crypto.randomUUID(),

        projectId,
        title: title.trim(),

        order: getNextCategoryOrder(projectId)
    });
}

async function addCategory(category) {
    categories.push(category);

    try {
        const savedCategory =
            await createCategoryInDb(category);

        Object.assign(
            category,
            savedCategory
        );

        return category;
    } catch (error) {
        categories = categories.filter(
            item => item.id !== category.id
        );

        throw error;
    }
}


// ===== Получение =====

function getCategoryById(id) {
    return categories.find(
        category => category.id === id
    );
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
    const projectCategories =
        getCategoriesByProject(projectId);

    if (projectCategories.length === 0) {
        return 0;
    }

    return Math.max(
        ...projectCategories.map(
            category => category.order
        )
    ) + 1;
}


// ===== Изменение =====

async function updateCategory(id, changes) {
    const category = getCategoryById(id);

    if (!category) return null;

    const previous = { ...category };

    Object.assign(category, changes);

    try {
        const savedCategory =
            await updateCategoryInDb(category);

        Object.assign(
            category,
            savedCategory
        );

        return category;
    } catch (error) {
        Object.assign(
            category,
            previous
        );

        throw error;
    }
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


// ===== Удаление =====

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