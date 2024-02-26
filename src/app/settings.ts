import { showToast } from "../utils"

let settings: any = {}
export const setSettings = (toSet: any) => { settings = toSet }

const passwForm = $("#password-form")
passwForm.on("submit", async (e) => {
    e.preventDefault()

    let old_passw = passwForm.find("#old_password").val()
    let new_passw1 = passwForm.find("#new_password1").val()
    let new_passw2 = passwForm.find("#new_password2").val()

    if (!old_passw || !new_passw1 || !new_passw2) return
    if (new_passw1 != new_passw2) return showToast("Ustawienia", "Hasła się nie zgadzają", "error")

    await fetch("/api/users/me/password/", {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: JSON.stringify({
            old_password: old_passw,
            new_password1: new_passw1,
            new_password2: new_passw2
        })
    }).then(async (resp) => {
        if (resp.status == 200) {
            clearInputs($("#settings-modal").get(0))
            return showToast("Ustawienia", "Zmieniono hasło", "success")
        }

        await resp.json().then((data) => {
            let errors = data.errors
            if (!errors) return showToast("API", "Coś poszło nie tak", "error")

            $("#old-password-error").text(errors.old_password ? `- ${errors.old_password[0].message}` : "*")
            $("#new_password1-error").text(errors.new_password1 ? `- ${errors.new_password1[0].message}` : "*")
            $("#new_password2-error").text(errors.new_password2 ? `- ${errors.new_password2[0].message}` : "*")
        })
    }).catch(() => {
        showToast("API", "Coś poszło nie tak", "error")
    })
})

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

// FILES
$("#user-avatar-btn").on("click", () => $("#user-avatar-file").get(0).click())
$("#user-avatar-file").on("change", (e) => console.log(e))


// MODALS
function clearInputs(element: any) {
    $(element).find("input").each((_, inpt) => { inpt.value = "" })
    $(element).find("span.text-danger").each((_, errorElement) => { errorElement.innerText = "*" })
}
$(".modal").each((_, el) => { $(el).on("hide.bs.modal", () => clearInputs(el)) })