import { io } from "socket.io-client"
import { showToast } from "../utils"

const socket = io()
socket.send("Hello World!")

socket.on("disconnect", () => {
    showToast("Socket", "Utracono połączenie z serwerem", "error")
})