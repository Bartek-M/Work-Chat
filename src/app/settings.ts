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
            if (resp.status == 200) return showToast("Ustawienia", "Zmieniono motyw", "error")
            return showToast("API", "Coś poszło nie tak", "error")
        }).catch(() => {
            showToast("API", "Coś poszło nie tak", "error")
        })
    })
})
