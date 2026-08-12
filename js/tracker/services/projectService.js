function createProject(title) {
    const project = {
        id: crypto.randomUUID(),
        title: title.trim(),
        createDate: Date.now(),
        color: "",
        order: 0
    };

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

    saveProjects(projects);

    return project;
}

function deleteProject(id) {
    projects = projects.filter(project => project.id !== id);

    saveProjects(projects);
}

function getProjects() {
    return projects;
}