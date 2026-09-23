// TODO: кнопки все ранво смещаются. видимо из-за рамки вокруг? давай рамку вокруг не добавлять,а  при наведении просто сереньким подсвечивать фон (как у нас например для кнопок закрытия и меню в taskcard. в таблице заголовок вообще черный почему-то? сделай с учетом стилей темы, пстусть просто чуть сереньким будет.

function renderMarkdown(
    element,
    value,
    {
        onChange = null
    } = {}
) {
    const html = marked.parse(value || "", { breaks: true });
    element.innerHTML = DOMPurify.sanitize(html);

    // The visual editor writes empty paragraphs as standalone <br> blocks.
    // Keep those blocks and following text in the same paragraph layout.
    let paragraph = null;
    for (const node of [...element.childNodes]) {
        if (node.nodeName === "BR") {
            paragraph = document.createElement("p");
            node.before(paragraph);
            paragraph.append(node);
            paragraph = null;
        } else if (node.nodeType === Node.TEXT_NODE) {
            if (!node.textContent.trim()) continue;
            if (!paragraph) {
                paragraph = document.createElement("p");
                node.before(paragraph);
            }
            node.textContent = node.textContent.replace(/^\n|\n$/g, "");
            paragraph.append(node);
        } else {
            paragraph = null;
        }
    }

    bindMarkdownChecklist(
        element,
        value,
        onChange
    );
}

function getDescriptionPreview(description) {
    if (description.startsWith(DESCRIPTION_HTML_PREFIX)) {
        const container = document.createElement("div");
        container.innerHTML = DOMPurify.sanitize(description.slice(DESCRIPTION_HTML_PREFIX.length));
        container.querySelectorAll("p, li, tr, h1, h2, h3, h4, h5, h6, br").forEach(node => {
            node.after(document.createTextNode(" "));
        });
        return container.textContent.replace(/\s+/g, " ").trim();
    }
    return description
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-*+]\s+\[[ xX]\]\s*/gm, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/[*_~`]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
}

function updateMarkdownChecklistItem(
    value,
    checklistIndex,
    checked
) {
    let index = 0;

    return value.replace(
        /^(\s*[-*+]\s+)\[[ xX]\]/gm,
        (match, prefix) => {
            if (index++ !== checklistIndex) {
                return match;
            }

            return `${prefix}[${checked ? "x" : " "}]`;
        }
    );
}

function bindMarkdownChecklist(
    element,
    value,
    onChange
) {
    let currentValue = value;

    const checkboxes = element.querySelectorAll(
        'input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox, index) => {
        checkbox.disabled = false;
        checkbox.classList.add("markdownCheckbox");
        checkbox.closest("li")?.classList.add("task-list-item");

        checkbox.addEventListener("click", event => {
            event.stopPropagation();
        });

        checkbox.addEventListener("change", () => {
            currentValue = updateMarkdownChecklistItem(
                currentValue,
                index,
                checkbox.checked
            );

            onChange?.(currentValue);
        });
    });
}
