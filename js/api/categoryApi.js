// ===================== КАТЕГОРИИ =========================

function categoryFromDb(row) {
    return createCategoryModel({
        id: row.id,
        projectId: row.project_id,

        title: row.title,
        color: row.color,
        order: row.position,

        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime()
    });
}

function categoryToDb(category) {
    return {
        id: category.id,
        project_id: category.projectId,

        title: category.title,
        color: category.color,
        position: category.order
    };
}

async function getCategoriesFromDb() {
    const { data, error } = await supabaseClient
        .from("categories")
        .select("*")
        .order("position");

    if (error) {
        throw error;
    }

    return data.map(categoryFromDb);
}

async function createCategoryInDb(category) {
    const { data, error } = await supabaseClient
        .from("categories")
        .insert(categoryToDb(category))
        .select()
        .single();

    if (error) {
        throw error;
    }

    return categoryFromDb(data);
}

async function updateCategoryInDb(category) {
    const row = categoryToDb(category);

    delete row.id;

    const { data, error } = await supabaseClient
        .from("categories")
        .update(row)
        .eq("id", category.id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return categoryFromDb(data);
}

async function deleteCategoryFromDb(categoryId) {
    const { error } = await supabaseClient
        .from("categories")
        .delete()
        .eq("id", categoryId);

    if (error) {
        throw error;
    }
}


