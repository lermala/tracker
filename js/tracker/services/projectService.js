async function createProject(title) {
    const project = createProjectModel({
        id: crypto.randomUUID(),
        title: title.trim(),
        order: getNextProjectOrder()
    });

    const savedProject = await createProjectInDb(project);

    projects.push(savedProject);

    return savedProject;
}

function getProjectById(id) {
    return projects.find(project => project.id === id);
}

async function updateProject(id, changes) {
    const project = getProjectById(id);

    if (!project) return;

    Object.assign(project, changes);

    const savedProject = await updateProjectInDb(project);

    Object.assign(project, savedProject); // нужно ли это вообще?

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

async function deleteProject(id) {
    await deleteProjectFromDb(id);

    projects = projects.filter(project => project.id !== id);
}

function getProjects() {
    return projects;
}