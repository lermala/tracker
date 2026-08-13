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