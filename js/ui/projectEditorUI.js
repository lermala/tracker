const projectEditorTemplate = document.getElementById("projectEditorTemplate");

let activeProjectEditor = null;

function openProjectEditor(project = null) {
    closeProjectEditor();

    const editor = projectEditorTemplate.content.firstElementChild.cloneNode(true);

    const title = editor.querySelector(".projectEditorTitle");
    const nameInput = editor.querySelector(".projectEditorName");
    const descriptionInput = editor.querySelector(".projectEditorDescription");
    const colorContainer = editor.querySelector(".projectEditorColor");
    const saveButton = editor.querySelector(".projectEditorSaveButton");
    const cancelButton = editor.querySelector(".projectEditorCancelButton");
    const closeButton = editor.querySelector(".projectEditorCloseButton");

    title.textContent =
        project
            ? "Изменить проект"
            : "Добавить проект";

    nameInput.value = project?.title ?? "";
    descriptionInput.value = project?.description ?? "";

    let selectedColor = project?.color ?? null;

    const colorPicker = createColorPicker({
        colors: DEFAULT_COLOR_PALETTE,
        value: selectedColor,

        onChange: color => {
            selectedColor = color;
        }
    });

    colorContainer.replaceChildren(colorPicker);

    renderProjectEditorMembers(
        editor,
        project
    );

    async function handleSave() {
        const title = nameInput.value.trim();

        if (!title) {
            nameInput.focus();
            return;
        }

        await saveProjectEditor({
            project,
            title,
            description: descriptionInput.value,
            color: selectedColor
        });
    }

    saveButton.addEventListener("click", handleSave);

    cancelButton.addEventListener(
        "click",
        closeProjectEditor
    );

    closeButton.addEventListener(
        "click",
        closeProjectEditor
    );

    nameInput.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;

        event.preventDefault();
        handleSave();
    });

    editor.addEventListener("click", event => {
        if (event.target === editor) {
            closeProjectEditor();
        }
    });

    document.body.append(editor);
    activeProjectEditor = editor;

    nameInput.focus();
}

async function saveProjectEditor({
    project,
    title,
    description,
    color
}) {
    try {
        if (project) {
            await updateProject(project.id, {
                title: title.trim(),
                description: description.trim(),
                color
            });
        } else {
            const newProject = createProject({
                title,
                description,
                color
            });

            await addProject(newProject);

            selectProject(newProject.id);
        }

        closeProjectEditor();

        renderProjectsNavigation();
        renderTasksHeader();
    } catch (error) {
        console.error(
            "SAVE PROJECT ERROR:",
            error
        );
    }
}

async function renderProjectEditorMembers(
    editor,
    project
) {
    const container = editor.querySelector(
        "[data-project-members]"
    );

    if (!container) return;

    container.innerHTML = "";

    // У нового проекта ещё нет membership в БД
    if (!project) {
        if (currentProfile) {
            container.append(
                createUserBadge(currentProfile)
            );
        }

        return;
    }

    try {
        const members =
            await getProjectMembers(project.id);

        members.forEach(profile => {
            container.append(
                createUserBadge(profile)
            );
        });
    } catch (error) {
        console.error(
            "LOAD PROJECT MEMBERS ERROR:",
            error
        );
    }
}

async function handleSave() {
    const title = nameInput.value.trim();

    if (!title) {
        nameInput.focus();
        return;
    }

    await saveProjectEditor({
        project,
        title,
        description: descriptionInput.value,
        color: selectedColor
    });
}

function closeProjectEditor() {
    if (!activeProjectEditor) return;

    activeProjectEditor.remove();
    activeProjectEditor = null;
}