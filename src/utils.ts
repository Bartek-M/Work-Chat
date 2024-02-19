import * as $ from "jquery"

function preferredTheme() {
    if (localStorage.getItem("theme") != "auto") return

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.setAttribute("data-bs-theme", "dark")
    else document.documentElement.setAttribute("data-bs-theme", "light")
}

function changeTheme(theme?: string) {
    if (!theme) {
        let storedTheme = localStorage.getItem("theme")
        if (storedTheme) return changeTheme(storedTheme)

        return localStorage.setItem("theme", "auto")
    }

    if (theme == "auto") {
        localStorage.setItem("theme", theme)
        preferredTheme()

        let theme_match = window.matchMedia("(prefers-color-scheme: dark)")
        return theme_match.addEventListener("change", preferredTheme)
    } else if (theme != "dark" && theme != "light" && theme != "high-contrast") return

    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-bs-theme", theme)
}

$(".change-theme").each((_, el) => { $(el).on("click", () => changeTheme(el.id)) })
changeTheme()