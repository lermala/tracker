let activeMarkdownEditor = null;

function finishMarkdownEdit() {
    return activeMarkdownEditor?.finish() ?? Promise.resolve(true);
}

const DESCRIPTION_HTML_PREFIX = "<!--tracker-description-html-->\n";

function createMarkdownDescription(element, { value = "", maxLength, onSave }) {
    if (!window.toastui?.Editor) {
        console.error("Markdown editor could not be loaded");
        return;
    }

    element.markdownControl?.destroy();
    element.replaceChildren();
    element.classList.remove("markdownContent", "is-empty");
    const wrapper = element;
    wrapper.classList.add("descriptionEditor");
    const host = document.createElement("div");
    const status = document.createElement("div");
    status.className = "descriptionEditorStatus";
    status.setAttribute("role", "status");
    wrapper.append(host, status);

    const editor = new toastui.Editor({
        el: host,
        initialValue: value.startsWith(DESCRIPTION_HTML_PREFIX) ? "" : value,
        autofocus: false,
        initialEditType: "wysiwyg",
        hideModeSwitch: true,
        height: "auto",
        minHeight: "32px",
        language: "ru-RU",
        theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
        usageStatistics: false,
        placeholder: "Добавить описание",
        customHTMLSanitizer: html => DOMPurify.sanitize(html),
        toolbarItems: [
            ["heading", "bold", "italic", "strike"],
            ["ul", "ol", "task", "quote"],
            ["link", "code", "codeblock", "table"]
        ],
        hooks: {
            // Descriptions store text; image uploads are not configured.
            addImageBlobHook: () => false
        }
    });

    // Do not rewrite existing Markdown just by opening the editor.
    if (value.startsWith(DESCRIPTION_HTML_PREFIX)) {
        editor.setHTML(DOMPurify.sanitize(value.slice(DESCRIPTION_HTML_PREFIX.length)));
    }
    let initialHTML = editor.getHTML();
    const content = wrapper.querySelector(".toastui-editor-ww-container .ProseMirror");
    let editing = false;
    function setEditing(enabled) {
        editing = enabled;
        wrapper.classList.toggle("is-editing", enabled);
        content.contentEditable = String(enabled);
        content.setAttribute("aria-readonly", String(!enabled));
        content.tabIndex = 0;
        if (!enabled && activeMarkdownEditor === control) activeMarkdownEditor = null;
    }
    function start() {
        if (destroyed || saving || editing || (activeMarkdownEditor && activeMarkdownEditor !== control)) return;
        setEditing(true);
        activeMarkdownEditor = control;
        editor.focus();
    }
    let saving = null;
    let destroyed = false;

    function dispose() {
        destroyed = true;
        document.removeEventListener("pointerdown", onOutsidePointer, true);
        wrapper.removeEventListener("focusout", onFocusOut);
        wrapper.removeEventListener("click", onClick, true);
        wrapper.removeEventListener("keydown", onKeyDown);
        editor.destroy();
        if (activeMarkdownEditor === control) activeMarkdownEditor = null;
        delete element.markdownControl;
    }

    function finish() {
        if (saving) return saving;
        if (destroyed || !editing) return Promise.resolve(true);
        const html = editor.getHTML();
        // HTML preserves empty paragraphs and table structure that Markdown loses.
        // Existing Markdown remains supported and is converted only after an edit.
        const storedValue = DESCRIPTION_HTML_PREFIX + DOMPurify.sanitize(html);
        if (html === initialHTML) {
            setEditing(false);
            return Promise.resolve(true);
        }
        if (maxLength && storedValue.length > maxLength) {
            status.textContent = `Описание слишком длинное: ${storedValue.length} из ${maxLength} символов.`;
            return Promise.resolve(false);
        }

        wrapper.inert = true;
        status.textContent = "";
        saving = (async () => {
            try {
                await onSave(storedValue);
                initialHTML = html;
                setEditing(false);
                return true;
            } catch (error) {
                console.error("SAVE DESCRIPTION ERROR:", error);
                status.textContent = "Не удалось сохранить. Текст сохранён в редакторе — попробуйте ещё раз.";
                return false;
            } finally {
                wrapper.inert = false;
                saving = null;
            }
        })();
        return saving;
    }

    function onOutsidePointer(event) {
        if (editing && !wrapper.contains(event.target)) finish();
    }

    function onFocusOut(event) {
        // Toolbar popups can temporarily move focus to body (relatedTarget=null).
        // Only a deliberate focus transfer outside ends editing; pointer clicks
        // outside and closing the card are handled separately.
        if (editing && event.relatedTarget && !wrapper.contains(event.relatedTarget)) {
            finish();
        }
    }

    editor.on("change", () => {
        const length = DESCRIPTION_HTML_PREFIX.length + editor.getHTML().length;
        status.textContent = maxLength && length > maxLength
            ? `Описание слишком длинное: ${length} из ${maxLength} символов.`
            : "";
    });
    wrapper.addEventListener("focusout", onFocusOut);
    document.addEventListener("pointerdown", onOutsidePointer, true);
    function onClick(event) {
        if (!editing && !event.target.closest("a")) start();
    }
    function onKeyDown(event) {
        if (event.target.closest("button")) return;
        if (!editing && event.key === "Enter") {
            event.preventDefault();
            start();
        }
    }
    wrapper.addEventListener("click", onClick, true);
    wrapper.addEventListener("keydown", onKeyDown);
    const control = { finish, start, destroy: dispose };
    element.markdownControl = control;
    setEditing(false);
    return control;
}
