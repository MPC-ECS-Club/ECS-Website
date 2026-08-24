//replaces every element carrying a file-to-include attribute with the contents
//of that file, recursing in case included files contain further includes
async function includeHTML(callback, root = document) {
    const elements = root.querySelectorAll("[file-to-include]");

    if (elements.length === 0) {
        if (typeof callback === "function") {
            callback();
        }
        return;
    }

    await Promise.all(Array.from(elements, async elmnt => {
        const file = elmnt.getAttribute("file-to-include");
        elmnt.removeAttribute("file-to-include");
        try {
            elmnt.innerHTML = await fetchText(file);
        } catch (error) {
            console.error(`Failed to include ${file}:`, error);
            elmnt.innerHTML = "Page not found.";
        }
    }));

    includeHTML(callback, root);
}
