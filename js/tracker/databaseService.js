
// ===================== ПРОЕКТЫ =========================

function projectFromDb(row) {
    return createProjectModel({
        id: row.id,

        title: row.title,
        color: row.color,
        order: row.position,

        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime()
    });
}

function projectToDb(project) {
    return {
        id: project.id,
        title: project.title,
        color: project.color,
        position: project.order
    };
}

async function getProjectsFromDb() {
    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("position");

    if (error) {
        throw error;
    }

    return data.map(projectFromDb);
}

async function createProjectInDb(project) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("User is not authenticated");
    }

    const { data, error } = await supabaseClient
        .from("projects")
        .insert({
            ...projectToDb(project),
            user_id: user.id
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return projectFromDb(data);
}

async function updateProjectInDb(project) {
    const { data, error } = await supabaseClient
        .from("projects")
        .update({
            title: project.title,
            color: project.color,
            position: project.order
        })
        .eq("id", project.id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return projectFromDb(data);
}

async function deleteProjectFromDb(projectId) {
    const { error } = await supabaseClient
        .from("projects")
        .delete()
        .eq("id", projectId);

    if (error) {
        throw error;
    }
}


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
    const { data, error } = await supabaseClient
        .from("categories")
        .update({
            project_id: category.projectId,
            title: category.title,
            color: category.color,
            position: category.order
        })
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



// ===================== ЗАДАЧИ =========================

function taskFromDb(row) {
    return createTaskModel({
        id: row.id,

        projectId: row.project_id,
        categoryId: row.category_id,

        createdById: row.created_by_id,
        assigneeId: row.assignee_id,

        title: row.title,
        description: row.description,

        priority: row.priority,

        duration: row.duration,
        order: row.position,

        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),

        startedAt: row.started_at
            ? new Date(row.started_at).getTime()
            : null,

        completedAt: row.completed_at
            ? new Date(row.completed_at).getTime()
            : null,

        dueDate: row.due_date,
        dueTime: row.due_time
            ? row.due_time.slice(0, 5)
            : null
    });
}

function taskToDb(task) {
    return {
        id: task.id,

        project_id: task.projectId,
        category_id: task.categoryId,

        assignee_id: task.assigneeId,

        title: task.title,
        description: task.description,

        priority: task.priority,

        duration: task.duration,
        position: task.order,

        started_at: toIsoOrNull(task.startedAt),
        completed_at: toIsoOrNull(task.completedAt),
        
        due_date: task.dueDate,
        due_time: task.dueTime
    };
}

function toIsoOrNull(timestamp) {
    return timestamp == null
        ? null
        : new Date(timestamp).toISOString();
}

async function getTasksFromDb() {
    const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .order("position");

    if (error) {
        throw error;
    }

    return data.map(taskFromDb);
}

async function createTaskInDb(task) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("User is not authenticated");
    }

    const { data, error } = await supabaseClient
        .from("tasks")
        .insert({
            ...taskToDb(task),
            created_by_id: user.id
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return taskFromDb(data);
}

async function updateTaskInDb(task) {
    const row = taskToDb(task);

    delete row.id;

    const { data, error } = await supabaseClient
        .from("tasks")
        .update(row)
        .eq("id", task.id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return taskFromDb(data);
}

async function deleteTaskFromDb(taskId) {
    const { error } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", taskId);

    if (error) {
        throw error;
    }
}