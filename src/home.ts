const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleContrastBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleContrast);
    }
});


function toggleContrast(): void {
    const mainElement = document.getElementById('main-object');
    if (mainElement) {
        const currentTheme = mainElement.getAttribute('data-theme');
        if (currentTheme === 'high-contrast') {
            mainElement.setAttribute('data-theme', '');
        } else {
            mainElement.setAttribute('data-theme', 'high-contrast');
        }
    } else {
        console.error('Main element not found');
    }
}
