import "jquery.cookie"
import * as $ from "jquery"

import { showToast } from "../utils"

// $("#login-form").on("submit", async (e) => {
//     e.preventDefault()

//     await fetch("/api/auth/channels/create/", {
//         method: "POST",
//         headers: {
//             "Content-type": "application/json",
//             "X-CSRFToken": $.cookie("csrftoken")
//         },
//         body: JSON.stringify({

//         }),
//     }).then(async (resp) => {
//         if (resp.status == 200) return

//         await resp.json().then((data) => {
//             let errors = data.errors
//             if (!errors) return showToast("API", "Coś poszło nie tak", "error")
//         })
//     }).catch(() => {
//         showToast("API", "Coś poszło nie tak", "error")
//     })
// })


$(".search-form").each((_, el) => {
    const form = $(el)
    let lastUsername: string

    form.on("submit", async (e) => {
        e.preventDefault()

        let username = form.find("#search-inpt").val()
        console.log(username)
        if (!username || username == lastUsername) return

        lastUsername = (username as string)

        await fetch("/api/users/search/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": $.cookie("csrftoken")
            },
            body: JSON.stringify({
                username: username
            }),
        }).then(async (resp) => {
            await resp.json().then((data) => {
                if (resp.status == 200 && data.user) {
                    form.find("#searched-users").html(`
                        <button class="channel-open btn d-flex align-items-center w-100" type="button">
                            <img class="sidebar-icon" src="api/files/${data.user.avatar}" alt="Avatar">
                            ${data.user.first_name} ${data.user.last_name}
                        </button>
                    `)
                    return
                }

                form.find("#searched-users").html("")

                let errors = data.errors
                if (!errors) return showToast("API", "Coś poszło nie tak", "error")

                showToast("API", errors.user, "error")
            })
        }).catch(() => {
            showToast("API", "Coś poszło nie tak", "error")
        })
    })
})
