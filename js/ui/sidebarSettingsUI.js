const sidebarUserButton = document.getElementById("sidebarUserButton");
const sidebarUserMenu = document.getElementById("sidebarUserMenu");
const signOutButton = document.getElementById("signOutButton");

function initSidebarSettingsUI() {
    bindSidebarSettingsEvents();
    initAppearanceSettings();
}

function bindSidebarSettingsEvents() {
    sidebarUserButton.addEventListener("click", event => {
        event.stopPropagation();

        sidebarUserMenu.classList.toggle("hidden");
    });

    settingsButton.addEventListener("click", () => {
        sidebarUserMenu.classList.add("hidden");

        openSettings();
    });

    signOutButton.addEventListener("click", logout);

    document.addEventListener("click", event => {
        if (!event.target.closest(".sidebarUser")) {
            sidebarUserMenu.classList.add("hidden");
        }
    });
}

function renderUser() {
    if (!currentUser || !currentProfile) return;

    const name = currentProfile.name;

    const avatarContainer =
        document.getElementById(
            "sidebarUserAvatar"
        );

    avatarContainer.replaceChildren(
        createAvatar(currentProfile, {
            size: 30
        })
    );

    document.getElementById("sidebarUserName").textContent = name;
    document.getElementById("sidebarUserMenuName").textContent = name;
    document.getElementById("sidebarUserEmail").textContent = currentUser.email;
}

function initAppearanceSettings() {
    const themeContainer = document.getElementById("themeToggle");

    if (!themeContainer) {
        return;
    }

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

    themeContainer.replaceChildren(themeToggle);
}