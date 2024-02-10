import { toggleContrast } from "../utilities";

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleContrastBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleContrast);
    }
});