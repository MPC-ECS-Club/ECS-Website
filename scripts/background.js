const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
const spacing = 50;
let cols, rows;

// Mouse tracking
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let isMouseActive = false;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
});
window.addEventListener('mouseout', () => {
    isMouseActive = false;
});

// Define autonomous spotlights
const spotlights = [
    { x: 100, y: 100, vx: 0.5, vy: 0.7, radius: 500 },
    { x: 300, y: 500, vx: -0.6, vy: 0.4, radius: 600 },
    { x: 800, y: 200, vx: 0.4, vy: -0.5, radius: 550 }
];

// --- DRONE BOIDS CLASS ---
class Drone {
    constructor(type = 'follower') {
        this.type = type;
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.ax = 0;
        this.ay = 0;
        this.maxSpeed = 2.5;
        this.maxForce = 0.05;
        this.size = 12; // Radius of drone
        this.propAngle = Math.random() * Math.PI * 2;
    }

    applyForce(fx, fy) {
        this.ax += fx;
        this.ay += fy;
    }

    flock(drones) {
        let sepDist = 50;
        let aliDist = 100;
        let cohDist = 100;

        let sepX = 0, sepY = 0, sepCount = 0;
        let aliX = 0, aliY = 0, aliCount = 0;
        let cohX = 0, cohY = 0, cohCount = 0;

        for (let other of drones) {
            if (other === this) continue;
            let dx = this.x - other.x;
            let dy = this.y - other.y;
            let d = Math.sqrt(dx * dx + dy * dy);

            if (d < sepDist) {
                // Separation
                let diffX = dx / d;
                let diffY = dy / d;
                sepX += diffX;
                sepY += diffY;
                sepCount++;
            }
            if (d < aliDist) {
                // Alignment
                aliX += other.vx;
                aliY += other.vy;
                aliCount++;
            }
            if (d < cohDist) {
                // Cohesion
                cohX += other.x;
                cohY += other.y;
                cohCount++;
            }
        }

        const steer = (tx, ty, isVelocity = false) => {
            let mag = Math.sqrt(tx * tx + ty * ty);
            if (mag === 0) return { x: 0, y: 0 };
            if (isVelocity) {
                tx = (tx / mag) * this.maxSpeed;
                ty = (ty / mag) * this.maxSpeed;
            } else {
                let dx = tx - this.x;
                let dy = ty - this.y;
                let dMag = Math.sqrt(dx * dx + dy * dy);
                if (dMag > 0) {
                    tx = (dx / dMag) * this.maxSpeed;
                    ty = (dy / dMag) * this.maxSpeed;
                } else {
                    tx = 0; ty = 0;
                }
            }
            let steerX = tx - this.vx;
            let steerY = ty - this.vy;
            let sMag = Math.sqrt(steerX * steerX + steerY * steerY);
            if (sMag > this.maxForce) {
                steerX = (steerX / sMag) * this.maxForce;
                steerY = (steerY / sMag) * this.maxForce;
            }
            return { x: steerX, y: steerY };
        };

        if (sepCount > 0) {
            sepX /= sepCount;
            sepY /= sepCount;
            let smag = Math.sqrt(sepX * sepX + sepY * sepY);
            if (smag > 0) {
                sepX = (sepX / smag) * this.maxSpeed;
                sepY = (sepY / smag) * this.maxSpeed;
            }
            let sForceX = sepX - this.vx;
            let sForceY = sepY - this.vy;
            let smagf = Math.sqrt(sForceX * sForceX + sForceY * sForceY);
            if (smagf > this.maxForce) {
                sForceX = (sForceX / smagf) * this.maxForce;
                sForceY = (sForceY / smagf) * this.maxForce;
            }
            this.applyForce(sForceX * 1.8, sForceY * 1.8);
        }

        if (aliCount > 0) {
            aliX /= aliCount;
            aliY /= aliCount;
            let aForce = steer(aliX, aliY, true);
            this.applyForce(aForce.x * 1.0, aForce.y * 1.0);
        }

        if (cohCount > 0) {
            cohX /= cohCount;
            cohY /= cohCount;
            let cForce = steer(cohX, cohY, false);
            this.applyForce(cForce.x * 1.0, cForce.y * 1.0);
        }

        // Mouse attraction
        if (isMouseActive) {
            let mForce = steer(mouseX, mouseY, false);
            if (this.type === 'follower') {
                this.applyForce(mForce.x * 0.8, mForce.y * 0.8);
            } else if (this.type === 'avoider') {
                let dx = this.x - mouseX;
                let dy = this.y - mouseY;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 250) {
                    // Flee from mouse if too close
                    this.applyForce(-mForce.x * 1.5, -mForce.y * 1.5);
                }
            }
        } else {
            if (this.type === 'follower') {
                let mForce = steer(width / 2, height / 2, false);
                this.applyForce(mForce.x * 0.05, mForce.y * 0.05); // Gentler pull to center when idle
            }
        }
    }

    update() {
        this.vx += this.ax;
        this.vy += this.ay;

        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.ax = 0;
        this.ay = 0;

        this.propAngle += speed * 0.15 + 0.1;

        if (this.x < -this.size * 2) this.x = width + this.size * 2;
        if (this.x > width + this.size * 2) this.x = -this.size * 2;
        if (this.y < -this.size * 2) this.y = height + this.size * 2;
        if (this.y > height + this.size * 2) this.y = -this.size * 2;
    }

    draw(ctx, isDark) {
        ctx.save();
        ctx.translate(this.x, this.y);
        let angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);

        // Make avoiders slightly more transparent so they look like background drones
        let alphaMod = this.type === 'avoider' ? 0.5 : 1.0;

        let mainColor = isDark ? `rgba(226, 232, 240, ${0.6 * alphaMod})` : `rgba(155, 17, 58, ${0.6 * alphaMod})`;
        // MPC Red for propellers instead of blue
        let propColor = isDark ? `rgba(155, 17, 58, ${0.8 * alphaMod})` : `rgba(155, 17, 58, ${0.7 * alphaMod})`;

        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.5;

        // X chassis
        ctx.beginPath();
        ctx.moveTo(-this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.moveTo(this.size / 2, -this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.stroke();

        // Center hub
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
        ctx.fill();

        // Propellers
        let drawProp = (px, py) => {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(this.propAngle);
            ctx.strokeStyle = propColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2.5, 0, Math.PI * 2);
            ctx.stroke();
            // Lines inside prop for spin effect
            ctx.beginPath();
            ctx.moveTo(-this.size / 2.5, 0);
            ctx.lineTo(this.size / 2.5, 0);
            ctx.moveTo(0, -this.size / 2.5);
            ctx.lineTo(0, this.size / 2.5);
            ctx.stroke();
            ctx.restore();
        };

        drawProp(-this.size / 2, -this.size / 2);
        drawProp(this.size / 2, -this.size / 2);
        drawProp(-this.size / 2, this.size / 2);
        drawProp(this.size / 2, this.size / 2);

        ctx.restore();
    }
}

const numDrones = 15; // increased to accommodate both
const drones = [];

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cols = Math.ceil(width / spacing) + 1;
    rows = Math.ceil(height / spacing) + 1;

    if (drones.length === 0) {
        for (let i = 0; i < numDrones; i++) {
            // Mix of followers (60%) and avoiders (40%)
            let type = Math.random() < 0.6 ? 'follower' : 'avoider';
            drones.push(new Drone(type));
        }
    }
}

window.addEventListener('resize', init);

function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Update spotlight positions
    spotlights.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;

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

    // Update and draw drones
    if (window.dronesEnabled !== false) {
        drones.forEach(drone => {
            drone.flock(drones);
            drone.update();
            drone.draw(ctx, isDark);
        });
    }

    requestAnimationFrame(animate);
}

init();
requestAnimationFrame(animate);
