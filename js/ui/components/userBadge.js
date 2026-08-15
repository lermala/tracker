function createUserBadge(profile) {
    const badge = document.createElement("div");

    badge.className = "userBadge";

    const avatar = createAvatar(profile, {
        size: 24
    });

    const name = document.createElement("span");

    name.className = "userBadgeName";
    name.textContent = profile.name;

    badge.append(
        avatar,
        name
    );

    return badge;
}