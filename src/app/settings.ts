import { showToast } from "../utils"

let settings: any = {}
export const setSettings = (toSet: any) => { settings = toSet }

$("[name='options-theme'").each((_, el) => {
    $(el).on("click", async (e) => {
        if (e.target.id == settings.theme) return

        await fetch("/api/users/me/theme/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": (window as any)["csrf"]
            },
            body: JSON.stringify({
                theme: e.target.id
            })
        }).then(async (resp) => {
            if (resp.status == 200) return showToast("Ustawienia", "Zmieniono motyw", "success")
            return showToast("API", "Coś poszło nie tak", "error")
        }).catch(() => {
            showToast("API", "Coś poszło nie tak", "error")
        })
    })
})

$("[name='options-notifications'").each((_, el) => {
    $(el).on("click", async () => {
        await fetch("/api/users/me/notifications/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": (window as any)["csrf"]
            },
            body: JSON.stringify({
                notifications: $("#notifications-all").is(":checked"),
                sound: $("#notifications-sound").is(":checked")
            })
        }).then(async (resp) => {
            if (resp.status == 200) return showToast("Ustawienia", "Zmieniono ustawienia powiadomień", "success")
            return showToast("API", "Coś poszło nie tak", "error")
        }).catch(() => {
            showToast("API", "Coś poszło nie tak", "error")
        })
    })
})