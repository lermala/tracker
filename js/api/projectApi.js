// ===================== ПРОЕКТЫ =========================

function projectFromDb(row) {
    return createProjectModel({
        id: row.id,

        title: row.title,
        description: row.description ?? "",
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
        description: project.description,
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
    if (!currentUser) {
        throw new Error(
            "User is not authenticated"
        );
    }

    const { data, error } = await supabaseClient
        .from("projects")
        .insert({
            ...projectToDb(project),
            user_id: currentUser.id
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return projectFromDb(data);
}

async function updateProjectInDb(project) {
    const row = projectToDb(project);

    delete row.id;

    const { data, error } = await supabaseClient
        .from("projects")
        .update(row)
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