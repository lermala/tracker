function renderMarkdown(
    element,
    value,
    {
        onChange = null
    } = {}
) {
    const html = marked.parse(value || "");
    element.innerHTML = DOMPurify.sanitize(html);

    bindMarkdownChecklist(
        element,
        value,
        onChange
    );
}

function getDescriptionPreview(description) {
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