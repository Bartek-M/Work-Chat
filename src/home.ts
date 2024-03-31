const $: JQueryStatic = (window as any)["$"]

import "./utils"

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        $(entry.target).addClass("show")
    })
})

$(".hidden , .hidden-line").each((_, el) => observer.observe(el))


$(".card").each((_, card) => {
    $(card).on("mousemove", (event) => {
        const target = event.target.closest(".card")
        if (!target) return

        const rect = target.getBoundingClientRect()

        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const mouseXPercentage = (mouseX / rect.width) * 100
        const mouseYPercentage = (mouseY / rect.height) * 100

        const positionX = Number(mouseXPercentage.toFixed(2))
        const positionY = Number(mouseYPercentage.toFixed(2))


        if (positionX < 30 && positionY < 30) {
            // lewy górny
            card.style.transform = "rotate3d(-0.2, 1, 0.2, 10deg)"
        } else if (positionX > 70 && positionY < 30) {
            // prawy górny
            card.style.transform = "rotate3d(0.2, 1, -0.2, 10deg)"
        } else if (positionX < 30 && positionY > 70) {
            // lewy dolny
            card.style.transform = "rotate3d(0.2, 1, 0.2, 10deg)"
        } else if (positionX > 70 && positionY > 70) {
            // prawy dolny
            card.style.transform = "rotate3d(-1, 1, -0.2, 10deg)"
            // boku
        } else if (positionX < 30 && (positionY > 30 && positionY < 70)) {
            // lewo
            card.style.transform = "rotate3d(0, 1, 0, 10deg)"
        } else if ((positionX > 30 && positionX < 70) && positionY < 30) {
            // góra
            card.style.transform = "rotate3d(-1, 0, 0, 10deg)"
        } else if (positionX > 70 && (positionY > 30 && positionY < 70)) {
            // prawy
            card.style.transform = "rotate3d(0, 1, 0, 10deg)"
        } else if ((positionX > 30 && positionX < 70) && positionY > 70) {
            // dół
            card.style.transform = "rotate3d(1, 0, 0, 10deg)"
            // inne
        } else {
            card.style.transform = "rotate3d(0, 0, 0, 0)"
        }
    })
    $(card).on("mouseleave", (event) => {
        card.style.transform = "rotate3d(0, 0, 0, 0)"
    })
})
