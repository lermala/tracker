const APPEARANCE_KEY = "tracker-appearance";

const DEFAULT_APPEARANCE = {
    theme: "light",
    accent: "#cf6957"
};

function getAppearance() {
    const saved = JSON.parse(
        localStorage.getItem(APPEARANCE_KEY) || "{}"
    );

    return {
        ...DEFAULT_APPEARANCE,
        ...saved
    };
}

function saveAppearance(appearance) {
    localStorage.setItem(
        APPEARANCE_KEY,
        JSON.stringify(appearance)
    );
}

function applyAppearance(appearance) {
    document.documentElement.dataset.theme =
        appearance.theme;

    applyAccent(appearance.accent);
}

function setTheme(theme) {
    const appearance = getAppearance();

    appearance.theme = theme;

    saveAppearance(appearance);
    applyAppearance(appearance);
}

function setAccent(accent) {
    const appearance = getAppearance();

    appearance.accent = accent;

    saveAppearance(appearance);
    applyAccent(accent);
}

function applyAccent(accent) {
    const root = document.documentElement;

    root.style.setProperty(
        "--color-accent",
        accent
    );

    root.style.setProperty(
        "--color-accent-soft",
        hexToRgba(accent, .12)
    );
}

function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");

    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}