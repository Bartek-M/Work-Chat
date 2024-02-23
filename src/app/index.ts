const $: JQueryStatic = (window as any)["$"]
import { showToast } from "../utils"

import "./sockets"
import { setChannels } from "./channels"

showToast("Login", "Witaj w Work-Chat", "success")

async function getData() {
    await fetch("/api/users/me/", {
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (window as any)["csrf"]
        }
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200 && data.user && data.settings) return console.log(data)
            showToast("API", "Nie udało się wczytać ustawień", "error")
        })
    }).catch(() => {
        showToast("API", "Nie udało się wczytać ustawień", "error")
    })

    await fetch("/api/users/me/channels/", {
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (window as any)["csrf"]
        }
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200 && data.channels) return setChannels(data.channels)
            showToast("API", "Nie udało się wczytać kanałów", "error")
        })
    }).catch(() => {
        showToast("API", "Nie udało się wczytać kanałów", "error")
    })
}

getData()