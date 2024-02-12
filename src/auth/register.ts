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
        headers: { "X-CSRFToken": (document.getElementsByName("csrfmiddlewaretoken")[0] as HTMLInputElement).value },
        body: JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            password: password
        }),
    }).then((resp) => {
        console.log(resp)

        if (resp.status == 200) return window.location.replace("/")
    }).catch(() => {

    })
})