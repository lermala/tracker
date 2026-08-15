function createUserBadge(profile, {
    compact = false
} = {}) {
    const badge = document.createElement("div");

    badge.className = "userBadge";
    badge.classList.toggle(
        "is-compact",
        compact
    );

    const avatar = createUserAvatar(profile);

    const name = document.createElement("span");
    name.className = "userBadgeName";
    name.textContent =
        profile.name || "Без имени";

    badge.append(
        avatar,
        name
    );

    return badge;
}

function createUserAvatar(profile) {
    const avatar = document.createElement("div");

    avatar.className = "userAvatar";

    if (profile.avatarPath) {
        // Подключим картинку, когда сделаем Storage.
        // Пока оставляем fallback.
    }

    const name = profile.name?.trim();

    avatar.textContent =
        name?.charAt(0).toUpperCase() || "?";

    return avatar;
}