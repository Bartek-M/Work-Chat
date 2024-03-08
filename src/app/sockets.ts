import { io } from "socket.io-client"

import { user } from "./settings"
import { addMessage, currentChannel, channels, addChannel, formatMessages } from "./channels"
import { showToast, smoothScroll, getStatus } from "../utils"

const socket = io()

socket.on("disconnect", () => {
    showToast("Socket", "Utracono połączenie z serwerem", "error")
})

socket.on("message", async (data) => {
    addMessage(data.channel_id, data)

    if ((!currentChannel || data.channel_id != currentChannel.id) && data.author_id != user.id) {
        ($("#notification-sound").get(0) as HTMLAudioElement).play()
        return showToast(channels[data.channel_id].name, `${data.content}`, "info")
    }

    $("#message-wrapper").append(formatMessages([data], true))
    smoothScroll($("#message-wrapper").get(0))

})

socket.on("channel_create", (data) => {
    addChannel(data)
    $("#channel-wrapper").prepend(`
        <button class= "channel-open btn d-flex align-items-center" id = "channel-${data.id}">
            <div class="position-relative" >
                <img class="sidebar-icon" name="${!data.direct ? `group-icon-${data.id}` : ""}" src="${data.icon ? `/api/files/${data.icon}/` : `/assets/icons/generic_${data.direct ? 'avatar' : 'group'}.webp`}" alt = "Avatar" >
                ${data.direct ? `
                    <span class="status-icon position-absolute translate-middle" name="status-user-${data.status_id}">
                        ${getStatus(data.status_type)}
                    </span>
                `: ''}
            </div>
            ${data.name}
        </button>
    `)
})

socket.on("status", (data) => {
    $(`[name='status-user-${data.id}']`).each((_, el) => {
        $(el).html(getStatus(data.status, 12))
    })

    if (data.id == user.id) $(`#profile-status-${user.id}`).html(getStatus(data.status, 20))
})

socket.on("leave_channel", (data) => {
    if (currentChannel && currentChannel.id == data.channel_id) { 
        $("chat-wrapper").html(`
            <div class="position-absolute top-50 start-50 translate-middle">
                <svg width="96" height="96" fill="rgb(var(--bs-tertiary-bg-rgb))" viewBox="0 0 16 16">
                    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15"/>
                </svg>
            </div>
        `)
    }

    delete channels[data.channel_id]
    $(`#channel-${data.channel_id}`).remove()

})