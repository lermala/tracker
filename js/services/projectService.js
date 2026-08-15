// ===== Создание =====

function createProject({
    title,
    description = "",
    color = null
}) {
    return createProjectModel({
        id: crypto.randomUUID(),

        title: title.trim(),
        description: description.trim(),
        color,

        order: getNextProjectOrder()
    });
}

async function addProject(project) {
    projects.push(project);

    try {
        const savedProject = await createProjectInDb(project);
        Object.assign(project, savedProject);

        await addProjectMember(
            project.id,
            currentUser.id
        );

        return project;
    } catch (error) {
        projects = projects.filter(
            item => item.id !== project.id
        );

        throw error;
    }
}

// ===== Получение =====

function getProjectById(id) {
    return projects.find(project => project.id === id);
}

function getNextProjectOrder() {
    if (projects.length === 0) {
        return 0;
    }

    return Math.max(
        ...projects.map(project => project.order)
    ) + 1;
}

function getProjects() {
    return projects;
}


// ===== Изменение =====

async function updateProject(id, changes) {
    const project = getProjectById(id);

    if (!project) return null;

    const previous = { ...project };

    Object.assign(project, changes);

    try {
        const savedProject =
            await updateProjectInDb(project);

        Object.assign(
            project,
            savedProject
        );

        return project;
    } catch (error) {
        Object.assign(
            project,
            previous
        );

        throw error;
    }
}

async function deleteProject(id) {
    const project = getProjectById(id);

    if (!project) return;

    const index = projects.findIndex(
        project => project.id === id
    );

    projects.splice(index, 1);

    try {
        await deleteProjectFromDb(id);
    } catch (error) {
        projects.splice(index, 0, project);

        throw error;
    }
    // todo delete local categories and tasks
}