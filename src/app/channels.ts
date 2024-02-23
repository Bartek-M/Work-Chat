const $: JQueryStatic = (window as any)["$"]
const bootstrap = window["bootstrap"]

import { showToast } from "../utils"

let selectedMembers: string[] = []

const form = $(".channel-create-form")
form.on("submit", async (e) => {
    e.preventDefault()

    let groupName = form.find("#group-name").val()
    if (!groupName) return

    await fetch("/api/channels/create/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: JSON.stringify({
            name: groupName,
            direct: true,
            members: selectedMembers
        }),
    }).then(async (resp) => {
        if (resp.status == 200) return $("#group-create-modal").modal("hide")

        await resp.json().then((data) => {
            let errors = data.errors
            if (!errors) return showToast("API", "Coś poszło nie tak", "error")
        })
    }).catch(() => {
        showToast("API", "Coś poszło nie tak", "error")
    })
})


$(".search-form").each((_, el) => {
    let form = $(el)
    let lastUsername: string

    form.find("button").on("click", async (e) => {
        e.preventDefault()

        let username = form.find("[name='search-inpt']").val()
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
                    return form.find(".searched-users").html(
                        form.find("[name='add-members']")
                            ? `<label class="channel-open btn w-100">
                                <img class="sidebar-icon" src="api/files/${data.user.avatar}" alt="Avatar" />
                                <span class="flex-fill text-start">${data.user.first_name} ${data.user.last_name}</span>
                                <input id="searched-${data.user.id}" type="checkbox" data-name="${data.user.username}" ${selectedMembers.includes(String(data.user.id)) ? "checked" : null} />
                            </label>`
                            : `<button class="channel-open btn d-flex align-items-center w-100" type="button" id="searched-${data.user.id}">
                                <img class="sidebar-icon" src="api/files/${data.user.avatar}" alt="Avatar">
                                ${data.user.first_name} ${data.user.last_name}
                            </button>`
                    )
                }

                form.find(".searched-users").html("")

                let errors = data.errors
                if (!errors) return showToast("API", "Coś poszło nie tak", "error")

                showToast("API", errors.user, "error")
            })
        }).catch((e) => {
            console.log(e)
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
    }).catch(() => {
        showToast("API", "Coś poszło nie tak", "error")
    })
}



function addMember(userId: string, username: string | null) {
    if (!userId) return
    userId = userId.replace("searched-", "").replace("added-", "")

    if (selectedMembers.includes(userId)) {
        selectedMembers = selectedMembers.filter(val => val != userId)
        $("#added-members").find(`#added-${userId}`).remove()
        $("#to-add").find(`#searched-${userId}`).prop("checked", false)
    } else {
        selectedMembers.push(userId)
        $("#added-members").append(`
            <button class="channel-open btn bg-body-tertiary" type="button" id="added-${userId}">
                ${username}
                <span class="btn-close" style="width: 0.5em; height: 0.5rem;"></span>
            </label>
        `)
    }
}

$("#open-direct").on("click", (e) => openDirect(e.target.id))
$("[name='add-members']").on("click", (e) => addMember(e.target.id, e.target.dataset.name))