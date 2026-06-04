// JavaScript para página de inicio
document.addEventListener('DOMContentLoaded', () => {
    console.log('TaskFlow - Página de Inicio cargada');
    
    // Animación suave para los botones
    const btnPrimary = document.querySelector('.btn-primary');
    if (btnPrimary) {
        btnPrimary.addEventListener('click', function(e) {
            // Efecto visual al hacer click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    }
    
    // Efecto de parallax sederhana pada hero (opcional)
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrollPosition = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });
});