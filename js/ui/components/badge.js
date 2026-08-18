function createBadge({
    text,
    color = null,
    className = "",
    interactive = false
}) {
    const badge = document.createElement(
        interactive ? "button" : "div"
    );

    badge.className = "badge";

    if (interactive) {
        badge.type = "button";
        badge.classList.add("is-interactive");
    }

    if (className) {
        badge.classList.add(className);
    }

    badge.textContent = text;

    if (color) {
        badge.style.setProperty(
            "--badge-color",
            color
        );
    }

    return badge;
}

function createEmptyBadge(
    text
) {
    const badge =
        document.createElement("span");

    badge.className =
        "badge is-empty";

    badge.textContent = text;

    return badge;
}