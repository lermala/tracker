function createProfileModel({
    id,
    name = "",
    avatarPath = null,
    createdAt,
    updatedAt
}) {
    return {
        id,
        name,
        avatarPath,
        createdAt,
        updatedAt
    };
}