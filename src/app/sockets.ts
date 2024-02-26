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

    if (!currentChannel || (data.channel_id != currentChannel.id)) {
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
                <img class="sidebar-icon" src="${data.icon ? `/api/files/${data.icon}/` : `/assets/icons/generic_${data.direct ? 'avatar' : 'group'}.webp`}" alt = "Avatar" >
                <span class="status-icon position-absolute translate-middle bg-danger rounded-circle"> </span>
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