import "../utils"

document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault()

    let first_name = (document.getElementById("first-name-input") as HTMLInputElement).value
    let last_name = (document.getElementById("last-name-input") as HTMLInputElement).value
    let username = (document.getElementById("username-input") as HTMLInputElement).value
    let email = (document.getElementById("email-input") as HTMLInputElement).value
    let password = (document.getElementById("password-input") as HTMLInputElement).value

    if (!first_name || !last_name || !username || !email || !password) return

    await fetch("/api/auth/register/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (document.getElementsByName("csrfmiddlewaretoken")[0] as HTMLInputElement).value
        },
        body: JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            password: password
        }),
    }).then(async (resp) => {
        if (resp.status == 200) return window.location.replace("/")

        await resp.json().then((data) => {
            let errors = data.errors
            if (!errors) return // TODO: Show toast message - Something went wrong

            document.getElementById("first-name-error")!.innerText = errors.first_name ? `- ${errors.first_name[0].message}` : "*"
            document.getElementById("last-name-error")!.innerText = errors.last_name ? `- ${errors.last_name[0].message}` : "*"
            document.getElementById("email-error")!.innerText = errors.email ? `- ${errors.email[0].message}` : "*"
            document.getElementById("username-error")!.innerText = errors.username ? `- ${errors.username[0].message}` : "*"
            document.getElementById("password-error")!.innerText = errors.password ? `- ${errors.password[0].message}` : "*"
        })
    }).catch(() => {
        // TODO: Show toast message - Something went wrong
    })
})