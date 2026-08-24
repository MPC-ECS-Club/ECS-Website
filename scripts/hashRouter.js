//uses # to do navigation
const routes = {
    //update this when adding another page
    home: {
        template: "home.html",
        title: "E/CS | Home",
        description: "Welcome to the ECS Club homepage!",
        onLoad: () => loadMeetingTimes()
    },
    projects: {
        template: "projects.html",
        title: "E/CS | Projects",
        description: "Explore the projects of the ECS Club.",
        onLoad: () => loadProjects()
    },
    members: {
        template: "members.html",
        title: "E/CS | Club Members",
        description: "Meet our team!",
        onLoad: () => loadMembers()
    },
}

const NOT_FOUND_HTML =
    '<h1 class="errorMsg">Page Not Found</h1><p class="errorTip">Use the navigation bar at the top to return to a valid webpage.</p>';

//renders the page matching the current hash into "content"
const locationHandler = async () => {
    const location = window.location.hash.replace("#", "") || "home";
    const content = document.getElementById("content");
    const route = routes[location];

    updateActiveLink();

    if (!route) {
        content.innerHTML = NOT_FOUND_HTML;
        document.title = "E/CS | Page Not Found";
        return;
    }

    try {
        content.innerHTML = await fetchText(route.template);
    } catch (error) {
        console.error(`Failed to load ${route.template}:`, error);
        content.innerHTML = NOT_FOUND_HTML;
        return;
    }

    document.title = route.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && route.description) {
        metaDescription.setAttribute("content", route.description);
    }

    hydrateLinks(content);
    route.onLoad();
}

//highlights the navbar link matching the current hash
function updateActiveLink() {
    const currentHash = window.location.hash || "#home";
    document.querySelectorAll(".navbar-item.active").forEach(el => el.classList.remove("active"));
    const activeLink = document.querySelector(`.navbar-item[href="${currentHash}"]`);
    if (activeLink) {
        activeLink.classList.add("active");
    }
}
