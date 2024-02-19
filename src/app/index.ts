import * as $ from "jquery"
import { showToast } from "../utils"

import "./sockets"
import "./channels"

$(".channel-open").each((_, element) => {
    $(element).on("click", () => $("#chat-wrapper")?.addClass("active"))
})
$("#chat-close").on("click", () => $("#chat-wrapper")?.removeClass("active"))


showToast("Login", "Witaj w Work-Chat", "success")
