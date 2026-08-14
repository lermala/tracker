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

    signOutButton.addEventListener("click", logout);

    document.addEventListener("click", event => {
        if (!event.target.closest(".sidebarUser")) {
            sidebarUserMenu.classList.add("hidden");
        }
    });
}

async function renderUser() {
    // const user = await getCurrentUser();
    if (!currentUser) return;

    const email = currentUser.email;
    const name = email.split("@")[0];

    document.getElementById("sidebarUserAvatar").textContent =
        name.charAt(0).toUpperCase();

    document.getElementById("sidebarUserName").textContent = name;
    document.getElementById("sidebarUserMenuName").textContent = name;
    document.getElementById("sidebarUserEmail").textContent = email;
}

function initAppearanceSettings() {
    const themeContainer =
        document.getElementById("themeToggle");

    const accentContainer =
        document.getElementById("accentColorPicker");

    if (!themeContainer || !accentContainer) {
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