function createProjectModel({
    id,

    title,
    description = "",
    color = null,
    order = 0,

    createdAt,
    updatedAt
}) {
    return {
        id,

        title,
        description,
        color,
        order,

        createdAt,
        updatedAt
    };
}