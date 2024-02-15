import "../utils"

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault()

    let login_data = (document.getElementById("login-input") as HTMLInputElement).value
    let password = (document.getElementById("password-input") as HTMLInputElement).value

    if (!login_data || !password) return

    await fetch("/api/auth/login/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (document.getElementsByName("csrfmiddlewaretoken")[0] as HTMLInputElement).value
        },
        body: JSON.stringify({
            login_data: login_data,
            password: password
        }),
    }).then(async (resp) => {
        if (resp.status == 200) return window.location.replace("/")

        await resp.json().then((data) => {
            let errors = data.errors
            if (!errors) return // TODO: Show toast message - Something went wrong

            document.getElementById("login-error")!.innerText = errors.__all__ ? `- ${errors.__all__[0].message}` : "*"
            document.getElementById("password-error")!.innerText = errors.__all__ ? `- ${errors.__all__[0].message}` : "*"
        })
    }).catch(() => {

    })
})