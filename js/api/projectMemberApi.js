function projectMemberFromDb(row) {
    return profileFromDb(row.profile);
}

async function getProjectMembersFromDb(projectId) {
    const { data, error } = await supabaseClient
        .from("project_members")
        .select(`
            profile:profiles (
                id,
                name,
                avatar_path,
                created_at,
                updated_at
            )
        `)
        .eq("project_id", projectId);

    if (error) {
        throw error;
    }

    return data.map(projectMemberFromDb);
}

async function addProjectMemberToDb(
    projectId,
    userId
) {
    const { error } = await supabaseClient
        .from("project_members")
        .insert({
            project_id: projectId,
            user_id: userId
        });

    if (error) {
        throw error;
    }
}

async function deleteProjectMemberFromDb(
    projectId,
    userId
) {
    const { error } = await supabaseClient
        .from("project_members")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }
}

async function joinProjectInDb(projectId) {
    const { data, error } = await supabaseClient
        .rpc("join_project", {
            target_project_id: projectId
        });

    if (error) {
        throw error;
    }

    return data;
}