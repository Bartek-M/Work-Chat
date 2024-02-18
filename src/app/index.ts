import * as $ from "jquery"

import { io } from "socket.io-client"

$("#chat-open")?.on("click", e => $("#chat-wrapper")?.addClass("active"))
$("#chat-close")?.on("click", e => $("#chat-wrapper")?.removeClass("active"))


const socket = io()
socket.send("Hello World!")