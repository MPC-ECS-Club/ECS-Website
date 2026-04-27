const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let points = [];
const spacing = 40;
const mouseRadius = 120; // Reduced radius
const mouse = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, vx: 0, vy: 0 };
let mouseMoving = false;
let moveTimer;

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    points = [];

    for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
            points.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                vx: 0,
                vy: 0
            });
        }
    }
}

window.addEventListener('resize', init);
window.addEventListener('mousemove', (e) => {
    mouse.vx = e.clientX - mouse.x;
    mouse.vy = e.clientY - mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    mouseMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => {
        mouseMoving = false;
    }, 100);
});

function animate(time) {
    ctx.clearRect(0, 0, width, height);
    
    // Determine dot color based on theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? 'rgba(226, 232, 240, 0.12)' : 'rgba(155, 17, 58, 0.08)';

    // Slowly decay mouse velocity
    mouse.vx *= 0.9;
    mouse.vy *= 0.9;

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Waving animation (fabric-like)
        const waveX = Math.sin(time * 0.0012 + (p.baseY * 0.005)) * 6;
        const waveY = Math.cos(time * 0.0012 + (p.baseX * 0.005)) * 6;

        // Mouse interaction - Only if moving
        if (mouseMoving) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq < mouseRadius * mouseRadius) {
                const dist = Math.sqrt(distSq);
                const force = (mouseRadius - dist) / mouseRadius;
                
                // Displacement based on mouse velocity + slight push away
                // This prevents the static circle and makes it feel like "dragging" through water/fabric
                p.vx += mouse.vx * force * 0.2;
                p.vy += mouse.vy * force * 0.2;
            }
        }

        // Return to base position with spring physics
        p.vx += (p.baseX + waveX - p.x) * 0.025;
        p.vy += (p.baseY + waveY - p.y) * 0.025;
        
        // Friction/Damping
        p.vx *= 0.91;
        p.vy *= 0.91;
        
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(animate);
}

init();
requestAnimationFrame(animate);
