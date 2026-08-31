let appLoading = null;
let appLoadingText = null;

function initAppLoading() {
    if (appLoading) {
        return;
    }

    appLoading = document.createElement("div");
    appLoading.className = "appLoading";

    const spinner =
        document.createElement("div");

    spinner.className =
        "appLoadingSpinner";

    appLoadingText =
        document.createElement("div");

    appLoadingText.className =
        "appLoadingText";

    appLoading.append(
        spinner,
        appLoadingText
    );

    document.body.append(appLoading);
}

function showAppLoading(text = "Загрузка...") {
    initAppLoading();

    appLoadingText.textContent = text;
    appLoading.hidden = false;
}

function hideAppLoading() {
    if (!appLoading) {
        return;
    }

    appLoading.hidden = true;
}