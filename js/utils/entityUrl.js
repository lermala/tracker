const ENTITY_URL = {
    PROJECT: "project",
    TASK: "task"
};

const BASE_PATH =
    window.location.hostname.endsWith(".github.io")
        ? "/tracker"
        : "";


function createEntityUrl(type, id) {
    const path =
        `${BASE_PATH}/${type}/${id}`;

    return new URL(
        path,
        window.location.origin
    ).toString();
}


function getEntityFromUrl() {
    let pathname =
        window.location.pathname;

    if (
        BASE_PATH &&
        pathname.startsWith(BASE_PATH)
    ) {
        pathname =
            pathname.slice(BASE_PATH.length);
    }

    const parts = pathname
        .split("/")
        .filter(Boolean);

    if (parts.length !== 2) {
        return null;
    }

    const [type, id] = parts;

    if (
        !Object.values(ENTITY_URL)
            .includes(type)
    ) {
        return null;
    }

    return {
        type,
        id
    };
}


function setEntityUrl(type, id) {
    const url = createEntityUrl(
        type,
        id
    );

    history.pushState(
        null,
        "",
        url
    );
}


function clearEntityUrl() {
    history.pushState(
        null,
        "",
        BASE_PATH || "/"
    );
}


async function copyEntityUrl(type, id) {
    const url = createEntityUrl(
        type,
        id
    );

    await navigator.clipboard.writeText(url);

    return url;
}

function restoreEntityUrl() {
    const redirectPath =
        sessionStorage.getItem(
            "redirectPath"
        );

    if (!redirectPath) {
        return;
    }

    sessionStorage.removeItem(
        "redirectPath"
    );

    history.replaceState(
        null,
        "",
        redirectPath
    );
}