document.addEventListener("DOMContentLoaded", function() {
    //loads in header and footer on load
    includeHTML();
    
    //updates url when it changes 
    window.addEventListener("hashchange", locationHandler);
    
    //runs once on load
    locationHandler();
});

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
