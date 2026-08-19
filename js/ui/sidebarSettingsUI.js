const sidebarUserButton =
    document.getElementById(
        "sidebarUserButton"
    );

function initSidebarSettingsUI() {
    bindSidebarSettingsEvents();
    //initAppearanceSettings();
}

function bindSidebarSettingsEvents() {
    sidebarUserButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            openSidebarUserMenu();
        }
    );
}

function openSidebarUserMenu() {
    const dropdown =
        document.createElement("div");

    dropdown.className =
        "dropdown sidebarUserMenu";

    dropdown.append(
        createSidebarUserMenuHeader(),

        createDropdownDivider(),

        createDropdownItem({
            text: "Настройки",
            icon: "settings",

            onClick: event => {
                event.stopPropagation();

                closeDropdown();
                openSettings();
            }
        }),

        createThemeMenuItem(),

        createDropdownDivider(),

        createDropdownItem({
            text: "Выйти",
            icon: "logout",
            destructive: true,

            onClick: event => {
                event.stopPropagation();

                closeDropdown();
                logout();
            }
        })
    );

    openDropdown({
        anchor: sidebarUserButton,
        dropdown,
        align: "start",
        removeOnClose: true
    });
}

function createSidebarUserMenuHeader() {
    const header =
        document.createElement("div");

    header.className =
        "sidebarUserMenuHeader";

    const avatar =
        createAvatar(
            currentProfile,
            {
                size: 32
            }
        );

    const info =
        document.createElement("div");

    info.className =
        "sidebarUserMenuInfo";

    const name =
        document.createElement("div");

    name.className =
        "sidebarUserMenuName";

    name.textContent =
        currentProfile?.name ?? "";

    const email =
        document.createElement("div");

    email.className =
        "sidebarUserMenuEmail";

    email.textContent =
        currentUser?.email ?? "";

    info.append(
        name,
        email
    );

    header.append(
        avatar,
        info
    );

    return header;
}

function renderUser() {
    if (!currentUser || !currentProfile) {
        return;
    }

    const avatarContainer =
        document.getElementById(
            "sidebarUserAvatar"
        );

    avatarContainer.replaceChildren(
        createAvatar(
            currentProfile,
            {
                size: 30
            }
        )
    );

    document.getElementById(
        "sidebarUserName"
    ).textContent =
        currentProfile.name;
}

function initAppearanceSettings() {
    const themeContainer =
        document.getElementById(
            "themeToggle"
        );

    if (!themeContainer) {
        return;
    }

    const appearance =
        getAppearance();

    const themeToggle =
        createToggle({
            value:
                appearance.theme ===
                "dark",

            onChange: isDark => {
                setTheme(
                    isDark
                        ? "dark"
                        : "light"
                );
            }
        });

    themeContainer.replaceChildren(
        themeToggle
    );
}

function createThemeMenuItem() {
    const item =
        document.createElement("div");

    item.className =
        "dropdownItem sidebarThemeItem";

    const icon =
        createDropdownIcon(
            "dark_mode"
        );

    const text =
        document.createElement("span");

    text.className =
        "dropdownItemText";

    text.textContent =
        "Тёмная тема";

    const appearance =
        getAppearance();

    const toggle =
        createToggle({
            value:
                appearance.theme ===
                "dark",

            onChange: isDark => {
                setTheme(
                    isDark
                        ? "dark"
                        : "light"
                );
            }
        });

    item.append(
        icon,
        text,
        toggle
    );

    // Чтобы клик по toggle не закрывал dropdown.
    item.addEventListener(
        "pointerdown",
        event => {
            event.stopPropagation();
        }
    );

    return item;
}