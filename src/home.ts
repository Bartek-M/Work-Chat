import "./utils"

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("show")
        entry.target.classList.add("card-rotation")
    })
})

const hiddenElements = document.querySelectorAll(".hidden, .hidden-line")
hiddenElements.forEach((el) => observer.observe(el))

interface MousePosition {
    x: number;
    y: number;
}
  
function getMousePos(event: MouseEvent): MousePosition {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const xPos = event.clientX - rect.left;
    const yPos = event.clientY - rect.top;
    return { x: xPos, y: yPos };
}
  
function setupMousePositionDetection(): void {
    const cards = document.querySelectorAll('.card');
  
    cards.forEach(card => {
        card.addEventListener('mousemove', (event) => {
            const pos = getMousePos(event as MouseEvent);
            const htmlCard = card as HTMLElement;

            console.log(`Mouse position: X=${pos.x}, Y=${pos.y}`);
            
            if (pos.x > 200) {
                htmlCard.style.setProperty('--card-rotationX', '1');
                htmlCard.style.setProperty('--card-rotationY', '1');
                htmlCard.style.setProperty('--card-rotationZ', '1');
                htmlCard.style.setProperty('--card-rotation', '180deg');
            } else if (pos.x < 200) {
                htmlCard.style.setProperty('--card-rotationX', '0.5');
                htmlCard.style.setProperty('--card-rotationY', '0.5');
                htmlCard.style.setProperty('--card-rotationZ', '0.5');
                htmlCard.style.setProperty('--card-rotation', '0deg');
            }
        });
    });
}
  
document.addEventListener('DOMContentLoaded', setupMousePositionDetection);  