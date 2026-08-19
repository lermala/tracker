function openProjectMenu(
    project,
    anchor
) {
    const dropdown =
        document.createElement("div");

    dropdown.className =
        "dropdown projectMenu";

    dropdown.append(
        createDropdownItem({
            text: "Изменить",
            icon: "edit",

            onClick: event => {
                event.stopPropagation();

                closeDropdown();
                openProjectEditor(project);
            }
        }),

        createDropdownDivider(),

        createDropdownItem({
            text: "Удалить",
            icon: "delete",
            destructive: true,

            onClick: event => {
                event.stopPropagation();

                closeDropdown();

                deleteProjectWithConfirmation(
                    project
                );
            }
        })
    );

    openDropdown({
        anchor,
        dropdown,
        align: "end",
        removeOnClose: true
    });
}

function createProjectDeleteMenuItem(
    project
) {
    const item =
        createDropdownItem({
            text: "Удалить",
            icon: "delete",

            onClick: event => {
                event.stopPropagation();

                closeDropdown();

                deleteProjectWithConfirmation(
                    project
                );
            }
        });

    item.classList.add(
        "is-destructive"
    );

    return item;
}