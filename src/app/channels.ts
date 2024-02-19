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

let lastUsername: string

$(".search-form").each((_, form) => {
    $(form).on("submit", async (e) => {
        e.preventDefault()
        let formType = form.id == "direct" ? "direct" : "group"

        let username = $(`#search-inpt-${formType}`).val()
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
                    $(`#searched-users-${formType}`).html(`
                    <button class="channel-open btn d-flex align-items-center w-100">
                        <img class="sidebar-icon" src="api/files/${data.user.avatar}" alt="Avatar">
                        ${data.user.first_name} ${data.user.last_name}
                    </button>
                `)
                    return
                }

                $(`#searched-users-${formType}`).html("")

                let errors = data.errors
                if (!errors) return showToast("API", "Coś poszło nie tak", "error")

                showToast("API", errors.user, "error")
            })
        }).catch(() => {
            showToast("API", "Coś poszło nie tak", "error")
        })
    })
})
