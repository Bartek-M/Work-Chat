import { io } from "socket.io-client"

import { currentChannel, channels, addChannel, formatMessages } from "./channels"
import { showToast, smoothScroll, encodeHTML } from "../utils"

const socket = io()

socket.on("disconnect", () => {
    showToast("Socket", "Utracono połączenie z serwerem", "error")
})

socket.on("message", async (data) => {
    if (!currentChannel || (data.channel_id != currentChannel.id)) {
        ($("#notification-sound").get(0) as HTMLAudioElement).play()
        return showToast(channels[data.channel_id].name, `${data.content}`, "info")
    }

    $("#message-wrapper").append(formatMessages([data]))
    smoothScroll($("#message-wrapper").get(0))

})

socket.on("channel_create", (data) => {
    addChannel(data)
    $("#channel-wrapper").prepend(`
            < button class= "channel-open btn d-flex align-items-center" id = "channel-${data.id}" >
            <div class="position-relative" >
        <img class="sidebar-icon" src = "api/files/${data.icon}" alt = "Avatar" >
        <span class="status-icon position-absolute translate-middle bg-danger rounded-circle" > </span>
        < /div>
            ${data.name}
        < /button>
    `)
})