import "jquery.cookie"
import * as $ from "jquery"

import "../utils"

$("#login-form").on("submit", async (e) => {
    e.preventDefault()

    let login_data = $("#login-input").val()
    let password = $("#password-input").val()

    if (!login_data || !password) return

    await fetch("/api/auth/login/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": $.cookie("csrftoken")
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

            $("#login-error").text(errors.__all__ ? `- ${errors.__all__[0].message}` : "*")
            $("#password-error").text(errors.__all__ ? `- ${errors.__all__[0].message}` : "*")
        })
    }).catch(() => {

    })
})