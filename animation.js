const canvas = document.getElementById('wavyCanvas');
const ctx = canvas.getContext('2d');
let width, height;

// Configuration
const numParticles = 80;
const lineOpacity = 0.4; 
const maxDist = 150; 
const particleColor = '255, 255, 255'; // White R,G,B for easy opacity control

let particles = [];
let time = 0;

/**
 * Initializes canvas dimensions and creates particles.
 * Called on load and window resize.
 */
function init() {
    // Set canvas size to full viewport
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

/**
 * Represents an individual particle for the animation.
 */
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Base velocity
        this.vx = (Math.random() - 0.5) * 0.1;
        this.vy = (Math.random() - 0.5) * 0.1;
        this.radius = 1;
        // Unique phase shift for subtle wobbly movement
        this.phaseX = Math.random() * Math.PI * 2;
        this.phaseY = Math.random() * Math.PI * 2;
    }

    /** Updates particle position, adding gentle sine-wave movement. */
    update() {
        // Gentle sinusoidal movement added to velocity
        this.x += this.vx + Math.sin(time + this.phaseX) * 0.5;
        this.y += this.vy + Math.cos(time + this.phaseY) * 0.5;

        // Wrap particles around the screen
        if (this.x < 0 || this.x > width) this.x = (this.x < 0) ? width : 0;
        if (this.y < 0 || this.y > height) this.y = (this.y < 0) ? height : 0;
    }

    /** Draws the particle (mostly for debugging, the lines are the main effect). */
    draw() {
        ctx.fillStyle = `rgba(${particleColor}, 0.1)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

/** Draws lines between nearby particles. */
function drawLines() {
    for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < maxDist) {
                // Calculate line opacity based on distance (fades out as particles move apart)
                const alpha = lineOpacity * (1 - dist / maxDist);
                ctx.strokeStyle = `rgba(${particleColor}, ${alpha})`;
                ctx.lineWidth = 1;
                
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
}

/** Main animation loop. */
function animate() {
    time += 0.005; 
    
    // Clear the canvas on each frame
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'; 
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => p.update());
    drawLines();

    requestAnimationFrame(animate);
}

// Handle resize events to keep the canvas full screen
window.addEventListener('resize', init);

// Start the animation when the window loads
window.onload = function () {
    init();
    animate();
}