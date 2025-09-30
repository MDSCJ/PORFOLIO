// Futuristic Animations
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for nav links
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Parallax 3D effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const cards = document.querySelectorAll('.card-3d, .liquid-glass');
        cards.forEach((card, index) => {
            const speed = (index % 3) + 1;
            card.style.transform += ` translateZ(${scrolled * 0.01 * speed}px)`;
        });

        // Header glitch intensity
        const glitch = document.querySelector('.glitch');
        if (glitch) {
            glitch.style.animationDuration = `${2 + scrolled * 0.0001}s`;
        }
    });

    // Hologram flicker on load
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '0';
            section.style.transform = 'translateZ(-100px)';
            setTimeout(() => {
                section.style.transition = 'all 1s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateZ(0)';
            }, 100);
        }, index * 500);
    });

    // Liquid glass hover effect
    const liquidCards = document.querySelectorAll('.liquid-glass');
    liquidCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.filter = 'brightness(1.2) drop-shadow(0 0 20px #00ffcc)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.filter = 'none';
        });
    });
});
