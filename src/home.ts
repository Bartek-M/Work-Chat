const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('hidden')) {
                entry.target.classList.add('show');
            } else if (entry.target.classList.contains('hidden-line')) {
                entry.target.classList.add('show-line');
            }
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden, .hidden-line');
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

            document.querySelectorAll('[data-original-class]').forEach((el: Element) => {
                const originalClass = el.getAttribute('data-original-class');
                if (originalClass) {
                    el.classList.remove('text-contrast');
                    el.classList.add(originalClass);
                    el.removeAttribute('data-original-class');
                }
            });
        } else {
            mainElement.setAttribute('data-theme', 'high-contrast');

            //list of all overwriten classes
            const classList = ['text-danger', 'text-success', 'text-success-emphasis', 'text-body-secondary'];
            classList.forEach(cls => {
                document.querySelectorAll('.' + cls).forEach((el: Element) => {
                    el.setAttribute('data-original-class', cls);
                    el.classList.remove(cls);
                    el.classList.add('text-contrast');
                });
            });
        }
    } else {
        console.error('Main element not found');
    }
}