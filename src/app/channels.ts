const $: JQueryStatic = (window as any)["$"]
const bootstrap = window["bootstrap"]

import { showToast } from "../utils"


$(".channel-create-form").each((_, el) => {
    const form = $(el)

    form.on("submit", async (e) => {
        e.preventDefault()

        let groupName = form.find("#group-name").val()
        let direct = groupName ? false : true

        await fetch("/api/auth/channels/create/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": (window as any)["csrf"]
            },
            body: JSON.stringify({
                name: groupName,
                direct: direct
            }),
        }).then(async (resp) => {
            if (resp.status == 200) return

            await resp.json().then((data) => {
                let errors = data.errors
                if (!errors) return showToast("API", "Coś poszło nie tak", "error")
            })
        }).catch(() => {
            showToast("API", "Coś poszło nie tak", "error")
        })
    })
})


$(".search-form").each((_, el) => {
    let form = $(el)
    let lastUsername: string

    form.on("submit", async (e) => {
        e.preventDefault()

        let username = form.find("#search-inpt").val()
        if (!username || username == lastUsername) return

        lastUsername = (username as string)

        await fetch("/api/users/search/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": (window as any)["csrf"]
            },
            body: JSON.stringify({
                username: username
            }),
        }).then(async (resp) => {
            await resp.json().then((data) => {
                if (resp.status == 200 && data.user) {
                    form.find("#searched-users").html(`
                        <button class="btn d-flex align-items-center w-100" type="button" id="searched-${data.user.id}">
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


async function openDirect(userId: string) {
    await fetch("/api/channels/create/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: JSON.stringify({
            direct: true,
            members: [userId.replace("searched-", "")]
        }),
    }).then(async (resp) => {
        if (resp.status == 200) return $("#direct-create-modal").modal("hide")

        await resp.json().then((data) => {
            let errors = data.errors
            if (!errors) return showToast("API", "Coś poszło nie tak", "error")

            showToast("API", errors.channel, "error")
        })
    }).catch((e) => {
        console.log(e)
        showToast("API", "Coś poszło nie tak", "error")
    })
}

$("#searched-users").on("click", (e) => openDirect(e.target.id))