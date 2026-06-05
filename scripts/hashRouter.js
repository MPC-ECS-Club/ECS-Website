//uses # to do navigation
const routes = {
    //update this when adding another page
    home: {
        template: "home.html",
        title: "E/CS | Home",
        description: "Welcome to the ECS Club homepage!"
    },
    projects: {
        template: "projects.html",
        title: "E/CS | Projects",
        description: ""
    },
    members: {
        template: "members.html",
        title: "E/CS | Club Members",
        description: "Meet our team!"
    },
}

const locationHandler = async () => {
    var location = window.location.hash.replace("#","");
    if (location.length === 0) {
        location = "home";
    }
    const route = routes[location];
    if (!route) {
        document.getElementById("content").innerHTML =
            '<div class="content"><h1 class="errorMsg">Page Not Found</h1><p class="errorTip">Use the navigation bar at the top to return to a valid webpage.</p></div>';
        return;
    }
    navigate(route.template);
}

//navigates to a page by changing updating "content" to the page's contents
function navigate(page, caller) {
    page = page;// || page.template;
    
    //*for debugging
    const checkPage = page || page.template; 
    console.log("Current page: ",checkPage);
    //*/
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //4 idicates a success
        if (this.readyState == 4) {
            if (this.status == 200) { 
                document.getElementById("content").innerHTML = this.responseText;
                hydrateLinks(document.getElementById("content"));

                // If we navigated to members.html, load the members data
                if (page === "members.html" && typeof loadMembers === "function") {
                    loadMembers();
                }

                // If we navigated to projects.html, load the projects data
                if (page === "projects.html" && typeof loadProjects === "function") {
                    loadProjects();
                }

                // If we navigated to home.html, load meeting times
                if (page === "home.html" && typeof loadMeetingTimes === "function") {
                    loadMeetingTimes();
                }

                //includeHTML(null, document.getElementById("content"));
            }
            if (this.status == 404) { document.getElementById("content").innerHTML = "Page not found."; }
        }
    }
    xhttp.open("GET", page, true);
    xhttp.send();
    const previousLink = document.getElementsByClassName("active");
    console.log(previousLink);
    const currentHash = window.location.hash || "#home";
    const activeLink = document.querySelector(`.navbar-item[href="${currentHash}"]`);
    if (previousLink.length > 0) {
        previousLink[0].classList.remove('active');
    }
    if (activeLink) {
        activeLink.classList.add('active');
    }
    console.log("Current hash: ",activeLink);
}
