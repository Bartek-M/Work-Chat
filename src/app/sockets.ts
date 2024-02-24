import { io } from "socket.io-client"

import { addChannel, formatMessages, openChannel } from "./channels"
import { showToast, smoothScroll } from "../utils"

const socket = io()

socket.on("disconnect", () => {
    showToast("Socket", "Utracono połączenie z serwerem", "error")
})

socket.on("message", (data) => {
    $("#message-wrapper").append(formatMessages([data]))
    smoothScroll($("#message-wrapper").get(0))
})

socket.on("channel_create", (data) => {
    addChannel(data)
    $("#channel-wrapper").prepend(`
        <button class="channel-open btn d-flex align-items-center" id="channel-${data.id}">
            <div class="position-relative">
                <img class="sidebar-icon" src="api/files/${data.icon}" alt="Avatar">
                <span class="status-icon position-absolute translate-middle bg-danger rounded-circle"></span>
            </div>
            ${data.name}
        </button>
    `)
})