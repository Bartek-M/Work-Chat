import * as $ from "jquery"

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
        // Start from the event target, then find the closest ".card" element
        const target = event.target.closest(".card")
        if (!target) return

        const rect = target.getBoundingClientRect()

        // Calculate mouse position inside the card in pixels
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        // Calculate mouse position as a percentage of the card"s dimensions
        const mouseXPercentage = (mouseX / rect.width) * 100
        const mouseYPercentage = (mouseY / rect.height) * 100

        const positionX = Number(mouseXPercentage.toFixed(2))
        const positionY = Number(mouseYPercentage.toFixed(2))

        console.log(`Mouse Position: ${positionX}% X, ${positionY}% Y`)

        if (positionX > 50 && positionY > 50) {
            // nie tak to działa ale działa do tego momentu :)
            target.setAttribute(" --card-rotationX", "180deg")
        }
    })
})
