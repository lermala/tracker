function createProject(title) {
    const now = Date.now();

    const project = createProjectModel({
        id: crypto.randomUUID(),
        title: title.trim(),

        order: getNextProjectOrder(),

        createdAt: now,
        updatedAt: now
    });

    projects.push(project);
    saveProjects(projects);

    return project;
}

function getProjectById(id) {
    return projects.find(project => project.id === id);
}

function updateProject(id, changes) {
    const project = getProjectById(id);

    if (!project) return;

    Object.assign(project, changes);
    project.updatedAt = Date.now();
    saveProjects(projects);

    return project;
}

function getNextProjectOrder() {
    if (projects.length === 0) {
        return 0;
    }

    return Math.max(
        ...projects.map(project => project.order)
    ) + 1;
}

function deleteProject(id) {
    projects = projects.filter(project => project.id !== id);

    saveProjects(projects); // todo cascade delete
}

function getProjects() {
    return projects;
}