function toggleContrast() {
    let theme: "dark" | "light" | "high-contrast"
    const currentTheme = document.documentElement.getAttribute("data-bs-theme")

    if (currentTheme == "dark") theme = "high-contrast" // "light"
    // else if (currentTheme == "light") theme = "high-contrast"
    else theme = "dark"

    document.documentElement.setAttribute("data-bs-theme", theme)
}

document.getElementById("toggleTheme")?.addEventListener("click", toggleContrast)