const $: JQueryStatic = (window as any)["$"]
const bootstrap = window["bootstrap"]

import { showToast, smoothScroll, encodeHTML, getStatus } from "../utils"

export let currentChannel: any = null
let selectedMembers: string[] = []
let selectedFiles: any = {}

export let channels: { [id: string]: any } = {}
export const setChannels = (toSet: any) => {
    toSet.sort((a: any, b: any) => b.last_message - a.last_message)
    $("#channel-wrapper").html(toSet.map((channel: any) => `
        <button class="channel-open btn d-flex align-items-center" id="channel-${channel.id}">
            <div class="position-relative">
                <img class="sidebar-icon" src="${channel.icon ? `/api/files/${channel.icon}/` : `/assets/icons/generic_${channel.direct ? 'avatar' : 'group'}.webp`}" alt="Avatar">
                ${channel.direct ? `
                    <span class="status-icon position-absolute translate-middle" name="status-user-${channel.status_id}">
                        ${getStatus(channel.status_type)}
                    </span>
                `: ''}
            </div>
            ${channel.name}
        </button>
    `))

    channels = toSet.reduce((obj: any, item: any) => { obj[item.id] = item; return obj }, {})
}

export const addChannel = (toAdd: any) => { channels[toAdd.id] = toAdd }
export const addMessage = (channel_id: number, toAdd: any) => { channels[channel_id].messages.push(toAdd) }


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
            direct: false,
            members: selectedMembers
        }),
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200 && data.channel) {
                if (channels[data.channel.id]) openChannel(data.channel.id)
                return $("#group-create-modal").modal("hide")
            }

            if (!data.errors) return showToast("API", "Coś poszło nie tak", "error")
        })
    }).catch(() => {
        showToast("API", "Coś poszło nie tak", "error")
    })
})

$(".search-form").each((_, el) => {
    let form = $(el)
    let button = form.find("button")
    let lastSearch: string

    form.find("input").on("keydown", (e) => {
        if (e.key != "Enter") return true
        button.get(0).click()
        return false
    })

    button.on("click", async (e) => {
        e.preventDefault()

        let search = form.find("[name='search-inpt']").val()
        if (!search || search == lastSearch) return

        lastSearch = (search as string)

        await fetch("/api/users/search/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": (window as any)["csrf"]
            },
            body: JSON.stringify({
                name: search
            }),
        }).then(async (resp) => {
            await resp.json().then((data) => {
                if (resp.status == 200 && data.users && data.users.length) {
                    if (form.find("[name='add-members']").length) {
                        return form.find(".searched-users").html(data.users.map((user: any) =>
                            `<label class="channel-open btn w-100">
                                <img class="sidebar-icon" src="${user.icon ? `/api/files/${user.icon}/` : "/assets/icons/generic_avatar.webp"}" alt="Avatar" />
                                <span class="flex-fill text-start">${user.first_name} ${user.last_name}</span>
                                <input id="searched-${user.id}" type="checkbox" data-name="${user.username}" ${selectedMembers.includes(String(user.id)) ? "checked" : null} />
                            </label>`
                        ))
                    }

                    return form.find(".searched-users").html(data.users.map((user: any) =>
                        `<button class="channel-open btn d-flex align-items-center w-100" type="button" id="searched-${user.id}">
                            <img class="sidebar-icon" src="${user.icon ? `/api/files/${user.icon}/` : "/assets/icons/generic_avatar.webp"}" alt="Avatar">
                            ${user.first_name} ${user.last_name}
                        </button>`
                    ))
                }

                form.find(".searched-users").html("")

                let errors = data.errors
                if (!errors) return showToast("API", "Coś poszło nie tak", "error")

                showToast("API", errors.user, "error")
            })
        }).catch((e) => {
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
        await resp.json().then((data) => {
            if (resp.status == 200 && data.channel) {
                if (channels[data.channel.id]) openChannel(data.channel.id)
                return $("#direct-create-modal").modal("hide")
            }

            if (!data.errors) return showToast("API", data.errors.channel, "error")
            showToast("API", "Coś poszło nie tak", "error")
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
            </button>
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

export async function openChannel(channelId: string) {
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

    selectedFiles = {}

    $("#chat-wrapper").html(`
        <nav class="navbar py-1 border-bottom">
            <div class="container-fluid ps-2 justify-content-between">
                <div class="navbar-brand d-flex align-items-center gap-2">
                    <button class="btn p-0 border-0" id="chat-close">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"/>
                        </svg>
                    </button>
                    <img class="title-avatar ms-1" src="${currentChannel.icon ? `/api/files/${currentChannel.icon}/` : `/assets/icons/generic_${currentChannel.direct ? 'avatar' : 'group'}.webp`}" alt="Avatar">
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
        <div class="d-flex flex-column overflow-y-scroll h-100" id="message-wrapper">${formatMessages(currentChannel.messages)}</div>
        <div class="input-group align-items-end p-2" style="max-height: 40%">
            <div class="form-control overflow-y-scroll" id="chat-inpt-send" style="min-height: 38px; max-height: 100%" data-placeholder="Wpisz wiadomość" contenteditable></div>
            <div class="d-flex flex-wrap gap-2" style="position: absolute; bottom: 100%;" id="attached-file"></div>
            <label class="input-group-text bg-body-tertiary" style="height: 38px;">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
                </svg>
                <input class="d-none" type="file" id="msg-file-inpt" multiple />
            </label>
            <button class="input-group-text bg-body-tertiary" id="chat-btn-send" style="height: 38px;">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                </svg>
            </button>
        </div>
    `)

    smoothScroll($("#message-wrapper").get(0))

    $(`#channel-${currentChannel.id}`).addClass("active")
    $("#chat-close").on("click", () => $("#chat-wrapper").removeClass("active"))

    $("#msg-file-inpt").on("change", (e) => attachFile(e.target))
    $("#attached-file").on("click", (e) => detachFile(e.target.id))

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

$("#channel-wrapper").on("click", (e) => openChannel(e.target.id.replace("channel-", "")))

// MESSAGES
async function sendMessage(channelId: string, content: string) {
    if (!channelId || !content) return

    let formData = new FormData()
    formData.append("content", content)

    for (let key in selectedFiles) formData.append(`file${key}`, selectedFiles[key])

    await fetch(`/api/channels/${channelId}/message/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: formData
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200) {
                selectedFiles = {}
                $("#attached-file").html("")
                $("#chat-inpt-send").text("")
                return
            }

            if (data.error.files) return showToast("Wiadomość", data.error.files[0].message, "error")
            showToast("API", "Nie udało się wysłać wiadomości", "error")
        })
    }).catch(() => {
        showToast("API", "Nie udało się wysłać wiadomości", "error")
    })
}

function attachFile(files: any) {
    const file = files.files[0]
    if (!file) return

    $("#msg-file-inpt").val("")
    let index = Object.keys(selectedFiles).length
    selectedFiles[index] = file

    $("#attached-file").append(`
        <button class="channel-open btn bg-body-tertiary" type="button" id="file-${index}">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
            </svg>
            ${file.name}
            <span class="btn-close" style="width: 0.5em; height: 0.5rem;"></span>
        </button>
    `)
}

function detachFile(file: any) {
    let fileId = file.replace("file-", "")
    if (!selectedFiles[fileId]) return

    delete selectedFiles[fileId]
    $("#attached-file").find(`#${file}`).remove()

}

export function formatMessages(messages: any, adding?: boolean) {
    if (!messages.length || !currentChannel) return ""
    let lastMessage = adding ? channels[currentChannel.id].messages[channels[currentChannel.id].messages.length - 2] : null

    return messages.map((msg: any) => {
        let author = currentChannel.members.find((user: any) => user.id == msg.author_id)
        if (!author) author = { first_name: "Usunięty", last_name: "Użytkownik", avatar: null }

        let files = msg.files.map((file: any) => `
            <a class="file-wrapper d-flex justify-content-between align-items-center gap-2 text-break border rounded bg-body-tertiary py-2 px-3 my-2" href="/api/files/${file.id}/">
                ${file.name}
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                </svg>
            </a>
        `)

        if (lastMessage && lastMessage.id != msg.id && lastMessage.author_id == author.id && (msg.create_time - lastMessage.create_time) < 360) {
            lastMessage = msg
            return `<div style="margin-left: 4rem;">${encodeHTML(msg.content)}</div>${files}`
        }

        lastMessage = msg
        return `<div class="d-flex mt-2">
            <img class="sidebar-icon mx-3 mt-2 col" src="${author.icon ? `/api/files/${author.icon}/` : "/assets/icons/generic_avatar.webp"}" alt="Avatar">
            <div>
                <div class="fw-bold text-secondary-emphasis" style="font-size: 0.9rem;">${author.first_name} ${author.last_name}</div>
                <div>${encodeHTML(msg.content)}</div>
            </div>
        </div>${files}`
    }).join("")
}