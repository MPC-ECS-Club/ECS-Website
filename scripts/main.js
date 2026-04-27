document.addEventListener("DOMContentLoaded", function() {
    // Initialize theme right away to avoid flashing
    initTheme();

    //updates url when it changes 
    window.addEventListener("hashchange", locationHandler);
    
    //runs once on load
    locationHandler();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function setupThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    // Set initial icon
    const currentTheme = document.documentElement.getAttribute('data-theme');
    toggleButton.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleButton.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleButton.textContent = '☀️';
        }
    });
}

//navHighlight does not work atm
//TODO: fix this
function navHighlight() {
    //get the filename of the current page
    var currentLocation = window.location.href;
    //currentLocation = currentLocation.substring(currentLocation.lastIndexOf('/')+1);
    //
    var navlist = document.getElementsByClassName("navbar-item");
    console.log("Current page:", currentLocation);
    console.log(navlist);
    console.log(navlist.length);
    for(var i=0; i<navlist.length; i++) {
        if(navlist[i].href==currentLocation){
            navlist[i].classList.add('active');
            console.log(navlist[i].classList);
        }
        else{
            console.log("NO");
        }
    }   
}
