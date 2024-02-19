import * as $ from "jquery"

import { io } from "socket.io-client"

$(".channel-open").each((_, element) => {
    $(element).on("click", () => $("#chat-wrapper")?.addClass("active"))
})
$("#chat-close").on("click", e => $("#chat-wrapper")?.removeClass("active"))


const socket = io()
socket.send("Hello World!")