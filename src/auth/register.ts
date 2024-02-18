import "jquery.cookie"
import * as $ from "jquery"

import "../utils"

$("#register-form").on("submit", async (e) => {
    e.preventDefault()

    let first_name = $("#first-name-input").val()
    let last_name = $("#last-name-input").val()
    let username = $("#username-input").val()
    let email = $("#email-input").val()
    let password = $("#password-input").val()

    if (!first_name || !last_name || !username || !email || !password) return

    await fetch("/api/auth/register/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": $.cookie("csrftoken")
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

            $("#first-name-error").text(errors.first_name ? `- ${errors.first_name[0].message}` : "*")
            $("#last-name-error").text(errors.last_name ? `- ${errors.last_name[0].message}` : "*")
            $("#email-error").text(errors.email ? `- ${errors.email[0].message}` : "*")
            $("#username-error").text(errors.username ? `- ${errors.username[0].message}` : "*")
            $("#password-error").text(errors.password ? `- ${errors.password[0].message}` : "*")
        })
    }).catch(() => {
        // TODO: Show toast message - Something went wrong
    })
})