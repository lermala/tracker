async function getProjectMembers(projectId) {
    return getProjectMembersFromDb(projectId);
}

async function addProjectMember(
    projectId,
    userId
) {
    await addProjectMemberToDb(
        projectId,
        userId
    );
}

async function deleteProjectMember(
    projectId,
    userId
) {
    await deleteProjectMemberFromDb(
        projectId,
        userId
    );
}

async function joinProject(projectId) {
    return await joinProjectInDb(projectId);
}