const $: JQueryStatic = (window as any)["$"]
const bootstrap = window["bootstrap"]

import { showToast } from "../utils"

let currentChannel: any = null
let selectedMembers: string[] = []

let channels: { [id: string]: any } = {}
export const setChannels = (toSet: any) => {
    channels = toSet.reduce((obj: any, item: any) => { obj[`${item.id}`] = item; return obj }, {})
}


// CHANNEL CREATE
let form = $(".channel-create-form")
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
    let button = form.find("button")
    let lastUsername: string

    form.find("input").on("keydown", (e) => {
        if (e.key != "Enter") return true
        button.get(0).click()
        return false
    })

    button.on("click", async (e) => {
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
                        form.find("[name='add-members']").length
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


// CHANNEL OPERATIONS
async function getChannelData(channelId: string) {
    await fetch(`/api/channels/${channelId}/messages/`, {
        headers: { "X-CSRFToken": (window as any)["csrf"] }
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200 && data.messages) return channels[channelId].messages = data.messages
            if (resp.status == 403) return showToast("Channel", "Nie należysz do tego kanału", "error")
            showToast("API", "Nie udało się wczytać wiadomości", "error")
        })
    }).catch(() => {
        showToast("API", "Nie udało się wczytać wiadomości", "error")
    })

    await fetch(`/api/channels/${channelId}/members/`, {
        headers: { "X-CSRFToken": (window as any)["csrf"] }
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200 && data.members) return channels[channelId].members = data.members
            if (resp.status == 403) return showToast("Channel", "Nie należysz do tego kanału", "error")
            showToast("API", "Nie udało się wczytać użytkowników", "error")
        })
    }).catch(() => {
        showToast("API", "Nie udało się wczytać użytkowników", "error")
    })
}

async function sendMessage(channelId: string, content: string) {
    if (!channelId || !content) return

    await fetch(`/api/channels/${channelId}/message/`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: JSON.stringify({
            content: content
        })
    }).then(async (resp) => {
        if (resp.status == 200) return $("#chat-inpt-send").text("")
        showToast("API", "Nie udało się wysłać wiadomości", "error")
    }).catch(() => {
        showToast("API", "Nie udało się wysłać wiadomości", "error")
    })
}

function formatMessages(currentChannel: any, messages: any) {
    if (!messages.length) return ""

    return messages.map((msg: any) => {
        let author = currentChannel.members.find((user: any) => user.id == msg.author_id)

        return `<div class="d-flex align-items-center my-2">
                <img class="sidebar-icon mx-3 col" src="/api/files/${author.avatar}" alt="Avatar">
                <div>
                    <div class="fw-bold text-secondary-emphasis" style="font-size: 0.9rem;">${author.first_name} ${author.last_name}</div>
                    <div>${msg.content}</div>
                </div>
            </div>`
    }).join("")
}

async function openChannel(channelId: string) {
    if (currentChannel) {
        if (currentChannel.id == channelId) return $("#chat-wrapper").addClass("active")
        $(`#channel-${currentChannel.id}`).removeClass("active")
    }

    currentChannel = channels[channelId]
    if (!currentChannel) return
    $("#chat-wrapper").addClass("active")

    if (!currentChannel.messages || !currentChannel.members) {
        await getChannelData(channelId)
        currentChannel = channels[channelId]
    }

    $("#chat-wrapper").html(`
        <nav class="navbar py-1 border-bottom">
            <div class="container-fluid ps-2 justify-content-between">
                <div class="navbar-brand d-flex align-items-center gap-2">
                    <button class="btn p-0 border-0" id="chat-close">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"/>
                        </svg>
                    </button>
                    <img class="title-avatar ms-1" src="api/files/${currentChannel.icon}" alt="Avatar">
                    ${currentChannel.name}
                </div>
                <div class="dropstart" data-bs-toggle="dropdown" aria-expanded="false">
                    <button class="btn border-0">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end p-2">
                        <li><button class="dropdown-item d-flex justify-content-between align-items-center px-2 rounded" data-bs-toggle="modal" data-bs-target="#channel-settings-modal">
                            Ustawienia
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                            </svg>
                        </button></li>
                        <li><button class="dropdown-item d-flex justify-content-between align-items-center px-2 rounded danger-dropdown-btn">
                            Wyjdź
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                            </svg>
                        </button></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="d-flex flex-column overflow-y-scroll h-100">${formatMessages(currentChannel, currentChannel.messages)}</div>
        <div class="input-group align-items-end p-2">
            <div class="form-control" id="chat-inpt-send" style="height: 38px;" data-placeholder="Wpisz wiadomość" contenteditable></div>
            <button class="input-group-text bg-body-tertiary" style="height: 38px;">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
                </svg>
                <input class="d-none" type="file"/>
            </button>
            <button class="input-group-text bg-body-tertiary" id="chat-btn-send" style="height: 38px;">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                </svg>
            </button>
        </div>
    `)

    $(`#channel-${currentChannel.id}`).addClass("active")
    $("#chat-close").on("click", () => $("#chat-wrapper").removeClass("active"))

    $("#chat-btn-send").on("click", () => sendMessage(String(currentChannel.id), $("#chat-inpt-send").get(0).innerText))
    $("#chat-inpt-send").on("keydown", (e) => {
        if (window.matchMedia("(pointer: coarse)").matches) return
        if (!e.shiftKey && e.code == "Enter") e.preventDefault()
    })
    $("#chat-inpt-send").on("keyup", (e) => {
        if (e.shiftKey || e.code !== "Enter") return
        if (window.matchMedia("(pointer: coarse)").matches) return

        sendMessage(currentChannel.id, $("#chat-inpt-send").get(0).innerText)
    })
}

$(".channel-open").each((_, el) => { $(el).on("click", (e) => openChannel(e.target.id.replace("channel-", ""))) })