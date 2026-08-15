function createAvatar(profile, options = {}) {
    const {
        className = "",
        size = null
    } = options;

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    if (className) {
        avatar.classList.add(className);
    }

    if (size !== null) {
        avatar.style.setProperty(
            "--avatar-size",
            `${size}px`
        );
    }

    renderAvatar(avatar, profile);

    return avatar;
}

function renderAvatar(avatar, profile) {
    avatar.replaceChildren();

    if (profile?.avatarPath) {
        const image = document.createElement("img");

        image.className = "avatarImage";
        image.src = getAvatarPublicUrl(profile.avatarPath);
        image.alt = "";

        avatar.append(image);
        return;
    }

    const fallback = document.createElement("span");

    fallback.className = "avatarFallback";
    fallback.textContent = getProfileInitial(profile);

    avatar.append(fallback);
}

function getProfileInitial(profile) {
    const name = profile?.name?.trim();

    if (!name) {
        return "?";
    }

    return name.charAt(0).toUpperCase();
}