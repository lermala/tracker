function createCategoryModel({
    id,
    projectId,

    title = "",
    color = null,
    order = 0,

    createdAt,
    updatedAt
}) {
    return {
        id,
        projectId,

        title,
        color,
        order,

        createdAt,
        updatedAt
    };
}