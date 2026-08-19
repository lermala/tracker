function renderMarkdown(
    element,
    value
) {
    const html =
        marked.parse(value || "");

    element.innerHTML =
        DOMPurify.sanitize(html);
}