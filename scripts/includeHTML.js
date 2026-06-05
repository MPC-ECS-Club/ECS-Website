function includeHTML(callback, root = document) {
    const z = root.getElementsByTagName("*");
    for (let i = 0; i < z.length; i++) {
        const elmnt = z[i];
        const file = elmnt.getAttribute("file-to-include");
        if (file) {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    elmnt.removeAttribute("file-to-include");
                    includeHTML(callback, root);
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
    if (typeof callback === "function") {
        callback();
    }
}
