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

function setupDroneToggle() {
    const toggleButton = document.getElementById('drone-toggle');
    if (!toggleButton) return;

    // Check saved state (default true if not set)
    const savedState = localStorage.getItem('dronesEnabled');
    window.dronesEnabled = savedState !== 'false';
    
    // Set initial styling/icon opacity
    toggleButton.style.opacity = window.dronesEnabled ? '1' : '0.4';

    toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.dronesEnabled = !window.dronesEnabled;
        localStorage.setItem('dronesEnabled', window.dronesEnabled);
        toggleButton.style.opacity = window.dronesEnabled ? '1' : '0.4';
    });
}
