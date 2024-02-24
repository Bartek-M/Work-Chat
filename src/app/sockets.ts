import { io } from "socket.io-client"

import { formatMessages } from "./channels"
import { showToast, smoothScroll } from "../utils"

const socket = io()
socket.send("Hello World!")

socket.on("disconnect", () => {
    showToast("Socket", "Utracono połączenie z serwerem", "error")
})

socket.on("message", (data) => {
    $("#message-wrapper").append(formatMessages([data]))
    smoothScroll($("#message-wrapper").get(0))
})