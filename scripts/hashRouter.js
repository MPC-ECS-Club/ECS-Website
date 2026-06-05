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
    const location = window.location.hash.replace("#","");
    if (location.length === 0) {
        navigate(routes.home.template);
        return;
    }
    const route = routes[location];
    if (!route) {
        document.getElementById("content").innerHTML =
            '<div class="content"><h1 class="errorMsg">Page Not Found</h1><p class="errorTip">Use the navigation bar at the top to return to a valid webpage.</p></div>';
        return;
    }
    navigate(route.template);
}

//navigates to a page by updating "content" to the page's contents
function navigate(page) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                document.getElementById("content").innerHTML = this.responseText;
                hydrateLinks(document.getElementById("content"));

                if (page === "members.html" && typeof loadMembers === "function") {
                    loadMembers();
                }
                if (page === "projects.html" && typeof loadProjects === "function") {
                    loadProjects();
                }
                if (page === "home.html" && typeof loadMeetingTimes === "function") {
                    loadMeetingTimes();
                }
            }
            if (this.status == 404) { document.getElementById("content").innerHTML = "Page not found."; }
        }
    }
    xhttp.open("GET", page, true);
    xhttp.send();

    const previousActive = document.getElementsByClassName("active");
    const currentHash = window.location.hash || "#home";
    const activeLink = document.querySelector(`.navbar-item[href="${currentHash}"]`);
    if (previousActive.length > 0) {
        previousActive[0].classList.remove('active');
    }
    if (activeLink) {
        activeLink.classList.add('active');
    }
}
