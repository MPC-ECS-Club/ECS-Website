//TODO: allow multiple callback functions to run somehow for versatility
function includeHTML(callback, root = document) {
    
    /*loop through a collection of all HTML elements:*/
    const z = root.getElementsByTagName("*");
    console.log("z: ",z.length);
    for (let i = 0; i < z.length; i++) {
        const elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        /* Credit to w3Schools */
        const file = elmnt.getAttribute("file-to-include");
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("file-to-include");
                    includeHTML(callback, root);
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
    console.log("includehtml is running");
    console.log("callback value:",callback)
    console.log("callback type:",typeof callback);
    if (typeof callback === "function") {
        callback();
    }
}