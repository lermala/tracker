function renderMarkdown(
    element,
    value
) {
    const html =
        marked.parse(value || "");

    element.innerHTML =
        DOMPurify.sanitize(html);
}

function getTaskDescriptionPreview(
    description
) {
    return description
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/[*_~`]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
}