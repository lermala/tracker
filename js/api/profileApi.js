function profileFromDb(row) {
    return createProfileModel({
        id: row.id,
        name: row.name,
        avatarPath: row.avatar_path,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    });
}

function profileToDb(profile) {
    return {
        id: profile.id,
        name: profile.name,
        avatar_path: profile.avatarPath,
        created_at: profile.createdAt,
        updated_at: profile.updatedAt
    };
}

async function getProfileByIdFromDb(profileId) {
    const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

    if (error) {
        throw error;
    }

    return profileFromDb(data);
}