let activeProjectMenu = null;

function openProjectMenu(project, anchor) {
    closeProjectMenu();

    const menu = createProjectMenu(project);

    document.body.append(menu);
    activeProjectMenu = menu;

    positionProjectMenu(menu, anchor);
}

function createProjectMenu(project) {
    const menu = document.createElement("div");

    menu.className = "projectMenu";

    menu.innerHTML = `
        <button class="menuItem" data-action="rename">
            <span class="material-symbols-rounded menuItemIcon">
                edit
            </span>

            <span>Переименовать</span>
        </button>

        <div class="menuSection">
            <div class="menuSectionTitle">
                Цвет
            </div>

            <div class="projectColorPicker"></div>
        </div>

        <div class="menuSection">
            <button
                class="menuItem is-danger"
                data-action="delete"
            >
                <span class="material-symbols-rounded menuItemIcon">
                    delete
                </span>

                <span>Удалить проект</span>
            </button>
        </div>
    `;

    renderProjectColorPicker(menu, project);
    bindProjectMenuEvents(menu, project);

    return menu;
}

function bindProjectMenuEvents(menu, project) {
    menu.addEventListener("click", event => {
        const button =
            event.target.closest("[data-action]");

        if (!button) return;

        switch (button.dataset.action) {
            case "rename":
                closeProjectMenu();
                startRenameProject(project);
                break;

            case "delete":
                closeProjectMenu();
                deleteProjectWithConfirmation(project);
                break;
        }
    });

    document.addEventListener("click", event => {
        if (!activeProjectMenu) return;

        if (activeProjectMenu.contains(event.target)) {
            return;
        }

        closeProjectMenu();
    });
}

function renderProjectColorPicker(menu, project) {
    const container =
        menu.querySelector(".projectColorPicker");

    const picker = createColorPicker({
        colors: DEFAULT_COLOR_PALETTE,
        value: project.color,

        onChange: color => {
            changeProjectColor(project, color);
        }
    });

    container.replaceChildren(picker);
}

function positionProjectMenu(menu, anchor) {
    const GAP = 6;
    const VIEWPORT_PADDING = 8;

    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    let top = anchorRect.bottom + GAP;
    let left = anchorRect.right - menuRect.width;

    if (
        top + menuRect.height >
        window.innerHeight - VIEWPORT_PADDING
    ) {
        top =
            anchorRect.top -
            menuRect.height -
            GAP;
    }

    left = Math.max(
        VIEWPORT_PADDING,
        Math.min(
            left,
            window.innerWidth -
            menuRect.width -
            VIEWPORT_PADDING
        )
    );

    top = Math.max(VIEWPORT_PADDING, top);

    menu.style.position = "fixed";
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
}

function closeProjectMenu() {
    if (!activeProjectMenu) return;

    activeProjectMenu.remove();
    activeProjectMenu = null;
}