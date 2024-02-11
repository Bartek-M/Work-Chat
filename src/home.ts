import "./utils"

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("show")
    })
})

const hiddenElements = document.querySelectorAll(".hidden, .hidden-line")
hiddenElements.forEach((el) => observer.observe(el))