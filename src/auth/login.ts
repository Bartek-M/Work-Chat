const $: JQueryStatic = (window as any)["$"]

import { showToast } from "../utils"

$("#login-form").on("submit", async (e) => {
    e.preventDefault()

    let login_data = $("#login-input").val()
    let password = $("#password-input").val()

    if (!login_data || !password) return

    await fetch("/api/auth/login/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: JSON.stringify({
            login_data: login_data,
            password: password
        }),
    }).then(async (resp) => {
        if (resp.status == 200) return window.location.replace("/")

        await resp.json().then((data) => {
            let errors = data.errors
            if (!errors) return showToast("API", "Coś poszło nie tak", "error")

            $("#login-error").text(errors.__all__ ? `- ${errors.__all__[0].message}` : "*")
            $("#password-error").text(errors.__all__ ? `- ${errors.__all__[0].message}` : "*")
        })
    }).catch(() => {
        showToast("API", "Coś poszło nie tak", "error")
    })
})