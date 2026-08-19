function startTextEdit(element, {
    value = "",
    multiline = false,
    maxLength = null,
    enterToSave = !multiline,
    className = "",
    onSave,
    onCancel
}) {
    const editor = document.createElement(
        multiline ? "textarea" : "input"
    );

    let finished = false;

    editor.className = `textEditor ${className}`;
    editor.value = value;

    if (maxLength !== null) {
        editor.maxLength = maxLength;
    }

    if (multiline) {
        editor.rows = 1;
    }

    element.replaceWith(editor);

    if (multiline) {
        resizeTextarea(editor);

        editor.addEventListener("input", () => {
            resizeTextarea(editor);
        });
    }

    editor.focus();

    function finish(save, reason = null) {
        if (finished) return;

        finished = true;

        if (save) {
            onSave?.(editor.value.trim(), reason);
        } else {
            onCancel?.();
        }

        if (editor.isConnected) {
            editor.replaceWith(element);
        }
    }

    editor.addEventListener("blur", () => {
        finish(true, "blur");
    });

    editor.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            event.preventDefault();
            finish(false);
            return;
        }

        if (event.key === "Enter" && enterToSave) {
            event.preventDefault();
            finish(true, "enter");
        }
    });
}

function resizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
}