import * as $ from "jquery"

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

function getMousePos(event: any) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

function setupMousePositionDetection() {
    $(".card").each(() => {
        $(this).on("mousemove", (event) => {
            const pos = getMousePos(event)

            if (pos.x > 200) {
                $(this).css("--card-rotationX", "1")
                $(this).css("--card-rotationY", "1")
                $(this).css("--card-rotationZ", "1")
                $(this).css("--card-rotation", "180deg")
            } else if (pos.x < 200) {
                $(this).css("--card-rotationX", "0.5")
                $(this).css("--card-rotationY", "0.5")
                $(this).css("--card-rotationZ", "0.5")
                $(this).css("--card-rotation", "0deg")
            }
        })
    })
}

$(document).on("DOMContentLoaded", setupMousePositionDetection)  