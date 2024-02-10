import { toggleContrast } from "./utilities";

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