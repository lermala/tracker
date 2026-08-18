function createUserBadge(profile, {
    compact = false,
    isCurrentUser = false
} = {}) {
    const badge = document.createElement("div");

    badge.className = "userBadge";

    badge.classList.toggle(
        "is-compact",
        compact
    );

    const avatar = createAvatar(profile);

    const name = document.createElement("span");
    name.className = "userBadgeName";

    name.textContent = isCurrentUser
        ? `Я (${profile.name})`
        : profile.name;

    badge.append(
        avatar,
        name
    );

    return badge;
}

function createEmptyUserBadge({
    label = "Не назначено",
    icon = "person" //todo add compact = without icon
} = {}) {
    const badge =
        document.createElement("div");

    badge.className =
        "userBadge is-empty";

    const avatar =
        document.createElement("span");

    avatar.className =
        "material-symbols-rounded userBadgeEmptyIcon";

    avatar.textContent = icon;

    const name =
        document.createElement("span");

    name.className =
        "userBadgeName";

    name.textContent = label;

    badge.append(
        avatar,
        name
    );

    return badge;
}