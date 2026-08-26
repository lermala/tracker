const profileCache = new Map();

async function getCurrentProfile() {
    if (!currentUser) {
        return null;
    }

    return getProfileByIdFromDb(
        currentUser.id
    );
}

async function getProfileById(profileId) {
    if (!profileId) return null;

    if (!profileCache.has(profileId)) {
        const promise = getProfileByIdFromDb(profileId)
            .catch(error => {
                profileCache.delete(profileId);
                throw error;
            });

        profileCache.set(profileId, promise);
    }

    return profileCache.get(profileId);
}

async function updateCurrentProfile(changes) {
    if (!currentProfile) {
        throw new Error("Current profile is not loaded");
    }

    currentProfile = await updateProfileInDb(
        currentProfile.id,
        changes
    );

    profileCache.set(
        currentProfile.id,
        Promise.resolve(currentProfile)
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

    profileCache.set(
        currentProfile.id,
        Promise.resolve(currentProfile)
    );

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

    profileCache.set(
        currentProfile.id,
        Promise.resolve(currentProfile)
    );

    return currentProfile;
}