const DISCORD_INVITE_URL = "https://discord.gg/N3cQzGgggA";
const GITHUB_URL = "https://github.com/MPC-ECS-Club/ECS-Website";
const JOIN_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdXsg9RcBYCK_DbuB4IGHtra4nUFefUUGC2N3HBbzWiPYpP0w/viewform";
const CONTACT_EMAIL = "jnieves6455@mpc.edu";

function hydrateLinks(root = document) {
    root.querySelectorAll("[data-discord-link]").forEach(el => {
        el.href = DISCORD_INVITE_URL;
    });
    root.querySelectorAll("[data-github-link]").forEach(el => {
        el.href = GITHUB_URL;
    });
    root.querySelectorAll("[data-join-form-link]").forEach(el => {
        el.href = JOIN_FORM_URL;
    });
    root.querySelectorAll("[data-contact-email]").forEach(el => {
        el.href = "mailto:" + CONTACT_EMAIL;
    });

}
