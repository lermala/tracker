const settingsTemplate = document.getElementById("settingsTemplate");

let activeSettingsModal = null;

function openSettings() {
    if (activeSettingsModal) return;

    const modal = settingsTemplate.content.firstElementChild.cloneNode(true);
    activeSettingsModal = modal;

    const closeButton = modal.querySelector(".settingsCloseButton");
    const cancelButton = modal.querySelector(".settingsCancelButton");
    const saveButton = modal.querySelector(".settingsSaveButton");
    const nameInput = modal.querySelector(".settingsNameInput");

    const avatarInput = modal.querySelector(".settingsAvatarInput");
    const avatarChangeButton = modal.querySelector(".settingsAvatarChangeButton");
    const avatarDeleteButton = modal.querySelector(".settingsAvatarDeleteButton");

    nameInput.value = currentProfile?.name ?? "";

    avatarChangeButton.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", async () => {
        const file = avatarInput.files[0];

        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            alert("Размер изображения не должен превышать 4 МБ");
            avatarInput.value = "";
            return;
        }

        try {
            await updateCurrentProfileAvatar(file);

            renderSettingsAvatar(modal);
            renderUser();
        } catch (error) {
            console.error(
                "UPDATE AVATAR ERROR:",
                error
            );
        }

        avatarInput.value = "";
    });

    avatarDeleteButton.addEventListener("click", async () => {
        try {
            await removeCurrentProfileAvatar();

            renderSettingsAvatar(modal);
            renderUser();
        } catch (error) {
            console.error(
                "DELETE AVATAR ERROR:",
                error
            );
        }
    });

    closeButton.addEventListener(
        "click",
        closeSettings
    );

    cancelButton.addEventListener(
        "click",
        closeSettings
    );

    saveButton.addEventListener(
        "click",
        saveSettings
    );

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeSettings();
        }
    });

    bindSettingsNavigation(modal);

    document.body.append(modal);

    renderSettingsAvatar(modal);
    initSettingsAppearance(modal);
}

function bindSettingsNavigation(modal) {
    const buttons =
        modal.querySelectorAll("[data-settings-section]");

    const sections =
        modal.querySelectorAll("[data-settings-content]");

    const title =
        modal.querySelector(".settingsTitle");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const sectionName =
                button.dataset.settingsSection;

            buttons.forEach(item => {
                item.classList.toggle(
                    "is-active",
                    item === button
                );
            });

            sections.forEach(section => {
                section.classList.toggle(
                    "hidden",
                    section.dataset.settingsContent !== sectionName
                );
            });

            title.textContent =
                button.textContent.trim();
        });
    });
}

function closeSettings() {
    if (!activeSettingsModal) return;

    activeSettingsModal.remove();
    activeSettingsModal = null;
}

function initSettingsAppearance(modal) {
    const themeContainer =
        modal.querySelector("#settingsThemeToggle");

    const accentContainer =
        modal.querySelector("#settingsAccentColorPicker");

    const appearance = getAppearance();

    const themeToggle = createToggle({
        value: appearance.theme === "dark",

        onChange: isDark => {
            setTheme(
                isDark
                    ? "dark"
                    : "light"
            );
        }
    });

    const accentPicker = createColorPicker({
        colors: DEFAULT_COLOR_PALETTE,
        value: appearance.accent,

        onChange: color => {
            setAccent(color);
        }
    });

    themeContainer.replaceChildren(themeToggle);
    accentContainer.replaceChildren(accentPicker);
}

async function saveSettings() {
    if (!activeSettingsModal) return;

    const nameInput =
        activeSettingsModal.querySelector(
            ".settingsNameInput"
        );

    const name = nameInput.value.trim();

    if (!name) {
        nameInput.focus();
        return;
    }

    try {
        await updateCurrentProfile({
            name
        });

        renderUser();
        closeSettings();
    } catch (error) {
        console.error(
            "UPDATE SETTINGS ERROR:",
            error
        );
    }
}

function renderSettingsAvatar(modal) {
    const preview = modal.querySelector(".settingsAvatarPreview");
    const deleteButton = modal.querySelector(".settingsAvatarDeleteButton");

    const avatar = createAvatar(
        currentProfile,
        {
            size: 72
        }
    );

    preview.replaceChildren(avatar);

    deleteButton.classList.toggle(
        "hidden",
        !currentProfile.avatarPath
    );
}