document.addEventListener('DOMContentLoaded', () => {

    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const sideNav = document.querySelector('.side-nav');
    const closeBtn = document.querySelector('.close-btn');
    const navLinks = document.querySelectorAll('.side-nav a');

    const toggleNav = () => {
        sideNav.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleNav);
    closeBtn.addEventListener('click', toggleNav);

    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sideNav.classList.contains('active')) {
                toggleNav();
            }
        });
    });


    // --- Personalized Greeting ---
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting;
        if (hour < 12) {
            greeting = "Initialize Sequence";
        } else if (hour < 18) {
            greeting = "System Operational";
        } else {
            greeting = "Entering Night Mode";
        }
        greetingElement.textContent = greeting;
    }

    // --- Interactive Particle Background ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = {
            x: null,
            y: null,
            radius: 150
        };

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        // Make mouse leave the screen to avoid particles getting stuck
        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particles = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                particles.push(new Particle(x, y, directionX, directionY, size, '#00ffff'));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particles.forEach(p => p.update());
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                        ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        init();
        animate();
    }
});

