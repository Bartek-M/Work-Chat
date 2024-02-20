const $: JQueryStatic = (window as any)["$"]
const bootstrap = window["bootstrap"]

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

export function showToast(title: string, message: string, type: "info" | "success" | "error") {
    let icon

    if (type == "info") icon = "bg-primary"
    else if (type == "success") icon = "bg-success"
    else icon = "bg-danger"

    let toast = $(`
        <div class="toast bg-body-tertiary" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <span class="${icon} p-2 rounded-circle me-2"></span>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `)

    $("#toast-wrapper").append(toast)
    new bootstrap.Toast(toast.get(0), {
        autohide: (type != "error" ? true : false),
        delay: 4000
    }).show()

    if (type != "error") return

    setTimeout(() => {
        toast.remove()
    }, 6000)
}