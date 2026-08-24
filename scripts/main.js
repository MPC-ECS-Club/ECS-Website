// Note: the saved theme is applied by an inline script in <head> (before first
// paint) to avoid a flash of the wrong theme.
document.addEventListener("DOMContentLoaded", function() {
    //updates url when it changes
    window.addEventListener("hashchange", locationHandler);

    //runs once on load
    locationHandler();
});

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
