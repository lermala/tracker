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

async function updateProfileInDb(profileId, changes) {
    const dbChanges = {};

    if ("name" in changes) {
        dbChanges.name = changes.name;
    }

    if ("avatarPath" in changes) {
        dbChanges.avatar_path = changes.avatarPath;
    }

    dbChanges.updated_at = new Date().toISOString();

    const { data, error } = await supabaseClient
        .from("profiles")
        .update(dbChanges)
        .eq("id", profileId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return profileFromDb(data);
}

async function uploadAvatarToDb(profileId, file) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${profileId}/avatar-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabaseClient.storage
        .from("avatars")
        .upload(filePath, file, {
            upsert: true,
            contentType: file.type
        });

    if (error) {
        throw error;
    }

    return filePath;
}

async function deleteAvatarFromDb(avatarPath) {
    if (!avatarPath) return;

    const { error } = await supabaseClient.storage
        .from("avatars")
        .remove([avatarPath]);

    if (error) {
        throw error;
    }
}

function getAvatarPublicUrl(avatarPath) {
    if (!avatarPath) return null;

    const { data } = supabaseClient.storage
        .from("avatars")
        .getPublicUrl(avatarPath);

    return data.publicUrl;
}