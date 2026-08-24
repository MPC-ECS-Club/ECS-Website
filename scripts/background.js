const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
const spacing = 50;
let cols, rows;

// Define autonomous spotlights
const spotlights = [
    { x: 100, y: 100, vx: 0.5, vy: 0.7, radius: 500 },
    { x: 300, y: 500, vx: -0.6, vy: 0.4, radius: 600 },
    { x: 800, y: 200, vx: 0.4, vy: -0.5, radius: 550 }
];
let lastTime = 0;

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cols = Math.ceil(width / spacing) + 1;
    rows = Math.ceil(height / spacing) + 1;
}

window.addEventListener('resize', init);

function animate(currentTime) {
    if (!lastTime) {
        lastTime = currentTime;
        requestAnimationFrame(animate);
        return;
    }
    const dt = (currentTime - lastTime) / (1000 / 60); // Delta time normalized to 60fps
    lastTime = currentTime;

    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Update spotlight positions
    spotlights.forEach(s => {
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        if (s.x < -s.radius / 2 || s.x > width + s.radius / 2) s.vx *= -1;
        if (s.y < -s.radius / 2 || s.y > height + s.radius / 2) s.vy *= -1;
    });

    // Draw the static grid with spotlight illumination
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * spacing;
            const y = r * spacing;

            const drawConnection = (x1, y1, x2, y2) => {
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                let maxIllumination = 0;
                spotlights.forEach(s => {
                    const dx = midX - s.x;
                    const dy = midY - s.y;
                    const distSq = dx * dx + dy * dy;
                    const radSq = s.radius * s.radius;
                    if (distSq < radSq) {
                        const illumination = 1 - (distSq / radSq);
                        if (illumination > maxIllumination) maxIllumination = illumination;
                    }
                });

                const baseAlpha = isDark ? 0.03 : 0.04;
                const alpha = baseAlpha + (maxIllumination * 0.05);

                ctx.beginPath();
                ctx.strokeStyle = isDark ? `rgba(226, 232, 240, ${alpha})` : `rgba(155, 17, 58, ${alpha})`;
                ctx.lineWidth = 1;

                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            };

            if (c < cols - 1) drawConnection(x, y, x + spacing, y);
            if (r < rows - 1) drawConnection(x, y, x, y + spacing);
        }
    }

    requestAnimationFrame(animate);
}

init();
requestAnimationFrame(animate);
