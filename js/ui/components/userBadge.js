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