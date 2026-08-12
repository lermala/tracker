function createProjectModel({
    id,

    title = "",
    color = null,
    order = 0,

    createdAt,
    updatedAt
}) {
    return {
        id,

        title,
        color,
        order,

        createdAt,
        updatedAt
    };
}