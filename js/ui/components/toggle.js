function createToggle({
    value = false,
    onChange
} = {}) {
    const toggle = document.createElement("button");

    toggle.type = "button";
    toggle.className = "toggleButton";
    toggle.setAttribute("role", "switch");

    const thumb = document.createElement("span");

    thumb.className = "toggleButtonThumb";

    toggle.append(thumb);

    setToggleValue(toggle, value);

    toggle.addEventListener("click", () => {
        const newValue = !getToggleValue(toggle);

        setToggleValue(toggle, newValue);

        onChange?.(newValue);
    });

    return toggle;
}

function setToggleValue(toggle, value) {
    toggle.classList.toggle(
        "is-active",
        value
    );

    toggle.setAttribute(
        "aria-checked",
        String(value)
    );
}

function getToggleValue(toggle) {
    return toggle.getAttribute("aria-checked") === "true";
}