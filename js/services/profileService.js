async function getCurrentProfile() {
    if (!currentUser) {
        return null;
    }

    return getProfileByIdFromDb(
        currentUser.id
    );
}