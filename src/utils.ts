const $: JQueryStatic = (window as any)["$"]
const bootstrap = window["bootstrap"]

function preferredTheme() {
    if (localStorage.getItem("theme") != "auto") return

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.setAttribute("data-bs-theme", "dark")
    else document.documentElement.setAttribute("data-bs-theme", "light")
}

export function changeTheme(theme?: string) {
    if (!theme) {
        let storedTheme = localStorage.getItem("theme")
        if (storedTheme) return changeTheme(storedTheme)

        localStorage.setItem("theme", "auto")
        return preferredTheme()
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
                ${encodeHTML(message)}
            </div>
        </div>
    `)

    $("#toast-wrapper").append(toast)
    new bootstrap.Toast(toast.get(0), {
        autohide: type != "error",
        delay: (type == "success" ? 1000 : 4000)
    }).show()

    if (type != "error") return
    setTimeout(() => toast.remove(), 6000)
}

export function smoothScroll(element: HTMLElement) {
    if (!element) return
    element.scrollBy({ top: element.scrollHeight - element.clientHeight })
}

export function encodeHTML(html: string) {
    return html.replace(/[\u00A0-\u9999<>&]/gim, (i) => "&#" + i.charCodeAt(0) + ";").replace(/\n/g, '<br>')
}

export function getStatus(type: "online" | "busy" | "away" | "offline", size: 12 | 20 = 12): string {
    if (type == "online") {
        return `
            <svg width="${size}" height="${size}" fill="#21bf4b" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8"/>
            </svg>
        `
    } else if (type == "busy") {
        return `
            <svg width="${size}" height="${size}" fill="#bf2121" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
            </svg>
        `
    } else if (type == "away") {
        return `
            <svg width="${size}" height="${size}" fill="#b5bf21" viewBox="0 0 16 16">
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
            </svg>
        `
    } else {
        return `
            <svg width="${size}" height="${size}" fill="#404040" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8"/>
            </svg>
        `
    }
}