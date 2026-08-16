let activeUserPicker = null;

function openUserPicker({
    anchor,
    users,
    selectedId = null,
    allowEmpty = false,
    onSelect,
    onInvite = null
}) {
    closeUserPicker();

    const picker = document.createElement("div");
    picker.className = "userPicker";

    const search = document.createElement("input");
    search.className = "userPickerSearch";
    search.type = "text";
    search.placeholder = "Введите имя";

    const options = document.createElement("div");
    options.className = "userPickerOptions";

    picker.append(search, options);

    function renderOptions(query = "") {
        options.replaceChildren();

        const normalizedQuery =
            query.trim().toLowerCase();

        if (allowEmpty) {
            options.append(
                createEmptyUserOption({
                    selected: selectedId === null,
                    onSelect
                })
            );
        }

        const filteredUsers = users.filter(user => {
            const name =
                user.name?.trim().toLowerCase() ?? "";

            return name.includes(normalizedQuery);
        });

        filteredUsers.forEach(user => {
            options.append(
                createUserOption({
                    user,
                    selected: user.id === selectedId,
                    onSelect
                })
            );
        });

        if (onInvite) {
            options.append(
                createInviteUserOption(onInvite)
            );
        }
    }

    search.addEventListener("input", () => {
        renderOptions(search.value);
    });

    document.body.append(picker);

    activeUserPicker = picker;

    positionUserPicker(picker, anchor);

    renderOptions();

    search.focus();

    setTimeout(() => {
        document.addEventListener(
            "click",
            handleUserPickerOutsideClick
        );
    });
}

function createUserOption({
    user,
    selected,
    onSelect
}) {
    const option = document.createElement("button");

    option.type = "button";
    option.className = "userPickerOption";

    const badge = createUserBadge(user, {
        isCurrentUser: user.id === currentProfile?.id
    });

    option.append(badge);

    if (selected) {
        option.append(
            createUserPickerCheck()
        );
    }

    option.addEventListener("click", event => {
        event.stopPropagation();

        closeUserPicker();
        onSelect(user.id);
    });

    return option;
}

function createEmptyUserOption({
    selected,
    onSelect
}) {
    const option = document.createElement("button");

    option.type = "button";
    option.className = "userPickerOption";

    const icon = document.createElement("span");

    icon.className =
        "material-symbols-rounded userPickerOptionIcon";

    icon.textContent = "person";

    const label = document.createElement("span");

    label.className = "userPickerOptionLabel";
    label.textContent = "Не назначено";

    option.append(icon, label);

    if (selected) {
        option.append(
            createUserPickerCheck()
        );
    }

    option.addEventListener("click", event => {
        event.stopPropagation();

        closeUserPicker();
        onSelect(null);
    });

    return option;
}

function createUserPickerCheck() {
    const check = document.createElement("span");
    check.className = "material-symbols-rounded userPickerCheck";
    check.textContent = "check";

    return check;
}

function createInviteUserOption(onInvite) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "userPickerOption userPickerInvite";

    const icon = document.createElement("span");
    icon.className = "material-symbols-rounded userPickerOptionIcon";
    icon.textContent = "person_add";

    const label = document.createElement("span");
    label.className = "userPickerOptionLabel";
    label.textContent = "Пригласить в проект";

    option.append(icon, label);
    option.addEventListener("click", event => {
        event.stopPropagation();

        closeUserPicker();
        onInvite();
    });

    return option;
}

function positionUserPicker(picker, anchor) {
    const rect = anchor.getBoundingClientRect();

    picker.style.left = `${rect.left}px`;
    picker.style.top = `${rect.bottom + 4}px`;

    const pickerRect =
        picker.getBoundingClientRect();

    if (pickerRect.right > window.innerWidth - 8) {
        picker.style.left =
            `${window.innerWidth - pickerRect.width - 8}px`;
    }

    if (pickerRect.bottom > window.innerHeight - 8) {
        picker.style.top =
            `${rect.top - pickerRect.height - 4}px`;
    }
}

function handleUserPickerOutsideClick(event) {
    if (
        event.target.closest(".userPicker")
    ) {
        return;
    }

    closeUserPicker();
}

function closeUserPicker() {
    if (!activeUserPicker) return;

    activeUserPicker.remove();
    activeUserPicker = null;

    document.removeEventListener(
        "click",
        handleUserPickerOutsideClick
    );
}