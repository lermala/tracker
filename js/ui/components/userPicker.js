function openUserPicker({
    anchor,
    users,
    selectedId = null,
    allowEmpty = false,
    onSelect,
    onInvite = null
}) {
    const picker = document.createElement("div");
    picker.className = "dropdown userPicker";

    const options = document.createElement("div");
    options.className = "dropdownList";

    picker.append(options);
    document.body.append(picker);

    function selectUser(userId) {
        closeDropdown();

        onSelect?.(userId);
    }

    function renderOptions(query = "") {
        options.replaceChildren();

        const normalizedQuery =
            query
                .trim()
                .toLowerCase();

        if (allowEmpty) {
            options.append(
                createEmptyUserOption({
                    selected:
                        selectedId === null,

                    onSelect: () => {
                        selectUser(null);
                    }
                })
            );
        }

        const filteredUsers =
            users.filter(user => {
                if (!normalizedQuery) {
                    return true;
                }

                const name =
                    user.name
                        ?.trim()
                        .toLowerCase() ?? "";

                const email =
                    user.email
                        ?.trim()
                        .toLowerCase() ?? "";

                return (
                    name.includes(
                        normalizedQuery
                    ) ||
                    email.includes(
                        normalizedQuery
                    )
                );
            });

        filteredUsers.forEach(user => {
            options.append(
                createUserOption({
                    user,

                    selected:
                        user.id === selectedId,

                    onSelect: () => {
                        selectUser(user.id);
                    }
                })
            );
        });

        if (
            filteredUsers.length === 0
        ) {
            options.append(
                createUserPickerEmpty()
            );
        }

        if (onInvite) {
            options.append(
                createDropdownDivider(),

                createInviteUserOption(
                    () => {
                        closeDropdown();
                        onInvite();
                    }
                )
            );
        }
    }

    renderOptions();

    openDropdown({
        anchor,
        dropdown: picker,
        removeOnClose: true
    });
}

function createUserOption({
    user,
    selected,
    onSelect
}) {
    const option =
        document.createElement("button");

    option.type = "button";

    option.className =
        "dropdownItem userPickerItem";

    option.classList.toggle(
        "is-selected",
        selected
    );

    const badge =
        createUserBadge(user, {
            isCurrentUser:
                user.id === currentProfile?.id
        });

    const check =
        createUserPickerCheck();

    option.append(
        badge,
        check
    );

    option.addEventListener(
        "click",
        onSelect
    );

    return option;
}


function createEmptyUserOption({
    selected,
    onSelect
}) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "dropdownItem userPickerItem";
    option.classList.toggle(
        "is-selected",
        selected
    );

    const badge = createEmptyUserBadge();
    const check = createUserPickerCheck();
    
    option.append(
        badge,
        check
    );

    option.addEventListener(
        "click",
        onSelect
    );

    return option;
}


function createUserPickerCheck() {
    const check =
        document.createElement("span");

    check.className =
        "material-symbols-rounded dropdownItemCheck";

    check.textContent = "check";

    return check;
}


function createInviteUserOption(
    onInvite
) {
    const option =
        document.createElement("button");

    option.type = "button";

    option.className =
        "dropdownItem dropdownAction";

    const icon =
        document.createElement("span");

    icon.className =
        "material-symbols-rounded";

    icon.textContent =
        "person_add";

    const label =
        document.createElement("span");

    label.className =
        "dropdownItemText";

    label.textContent =
        "Пригласить в проект";

    option.append(
        icon,
        label
    );

    option.addEventListener(
        "click",
        onInvite
    );

    return option;
}


function createUserPickerEmpty() {
    const empty = document.createElement("div");
    empty.className = "dropdownEmpty";
    empty.textContent = "Пользователи не найдены";

    return empty;
}