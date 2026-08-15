async function getCurrentProfile() {
    if (!currentUser) {
        return null;
    }

    return getProfileByIdFromDb(
        currentUser.id
    );
}

async function updateCurrentProfile(changes) {
    if (!currentProfile) {
        throw new Error("Current profile is not loaded");
    }

    currentProfile = await updateProfileInDb(
        currentProfile.id,
        changes
    );

    return currentProfile;
}

async function updateCurrentProfileAvatar(file) {
    if (!currentProfile) {
        throw new Error("Current profile is not loaded");
    }

    const oldAvatarPath = currentProfile.avatarPath;

    const avatarPath = await uploadAvatarToDb(
        currentProfile.id,
        file
    );

    currentProfile = await updateProfileInDb(
        currentProfile.id,
        {
            avatarPath
        }
    );

    if (
        oldAvatarPath &&
        oldAvatarPath !== avatarPath
    ) {
        await deleteAvatarFromDb(oldAvatarPath);
    }

    return currentProfile;
}

async function removeCurrentProfileAvatar() {
    if (!currentProfile?.avatarPath) return currentProfile;

    const avatarPath = currentProfile.avatarPath;

    currentProfile = await updateProfileInDb(
        currentProfile.id,
        {
            avatarPath: null
        }
    );

    await deleteAvatarFromDb(avatarPath);

    return currentProfile;
}