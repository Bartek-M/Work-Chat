import * as $ from "jquery"

import { io } from "socket.io-client"
import { showToast } from "../utils"

$(".channel-open").each((_, element) => {
    $(element).on("click", () => $("#chat-wrapper")?.addClass("active"))
})
$("#chat-close").on("click", () => $("#chat-wrapper")?.removeClass("active"))


const socket = io()
socket.send("Hello World!")

showToast("Login", "Witaj w Work-Chat", "success")
