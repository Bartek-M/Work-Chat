import "../utils"

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault()

    let login_data = (document.getElementById("login-input") as HTMLInputElement).value
    let password = (document.getElementById("password-input") as HTMLInputElement).value

    if (!login_data || !password) return

    await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "X-CSRFToken": (document.getElementsByName("csrfmiddlewaretoken")[0] as HTMLInputElement).value },
        body: JSON.stringify({
            login_data: login_data,
            password: password
        }),
    }).then((resp) => {
        console.log(resp)

        if (resp.status == 200) return window.location.replace("/")
    }).catch(() => {

    })
})