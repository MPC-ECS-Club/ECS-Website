# ECS_Website
Website for the Engineering and Computer Science (ECS) Club of MPC.

Visit the website [here](https://mpc-ecs-club.github.io/ECS-Website/)

## Running locally
The website is just a static webpage. You can run it locally easily by just running
`$ python3 -m http.server <port>` and it will be accessible on that port via your web browser.

## Reference Tags
We use `referenceTag`s to link club members to projects without having to copy-paste their info everywhere. 

- **Where to find them:** Check `data/members.json`. Each member has a unique tag like `sebastianRuedaVillamil` or `jordiNieves`.
- **How to use them:** In your project's JSON file (like `ceres.json`), you can just use the tag instead of a hardcoded name. The website will automatically grab their name and profile picture from the main members list. It keeps everything in sync!
