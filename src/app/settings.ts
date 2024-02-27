import { showToast } from "../utils"
import { currentChannel, channels } from "./channels"

export let user: any = {}
export let settings: any = {}

export const setUser = (toSet: any) => { user = toSet }
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

$("[name='options-status'").each((_, el) => {
    $(el).on("click", async (e) => {
        await fetch("/api/users/me/status/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": (window as any)["csrf"]
            },
            body: JSON.stringify({
                status: e.target.id,
            })
        }).then(async (resp) => {
            if (resp.status == 200) return showToast("Ustawienia", "Zmieniono ustawienia statusów", "success")
            return showToast("API", "Coś poszło nie tak", "error")
        }).catch(() => {
            showToast("API", "Coś poszło nie tak", "error")
        })
    })
})

// FILES
async function changeAvatar(file: any) {
    const icon = file.files[0]
    if (!icon) return

    const formData = new FormData()
    formData.append("icon", icon, "untitled.webp")

    await fetch("/api/users/me/avatar/", {
        method: "POST",
        headers: {
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: formData
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200) {
                $("[name='user-avatar']").each((_, el) => { (el as HTMLImageElement).src = `/api/files/${data.id}` })

                return showToast("Ustawienia", "Zmieniono zdjęcie profilowe", "success")
            }

            if (data.errors) return showToast("Ustawienia", data.errors.image, "error")
            showToast("API", "Coś poszło nie tak", "error")
        })
    }).catch(() => {
        showToast("API", "Coś poszło nie tak", "error")
    })
}

async function changeIcon(file: any, channelId: number) {
    const icon = file.files[0]
    if (!icon) return

    const formData = new FormData()
    formData.append("icon", icon, "untitled.webp")

    await fetch(`/api/channels/${channelId}/icon/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": (window as any)["csrf"]
        },
        body: formData
    }).then(async (resp) => {
        await resp.json().then((data) => {
            if (resp.status == 200 && data.channel_id && data.id) {
                $(`[name='group-icon-${data.channel_id}']`).each((_, el) => { (el as HTMLImageElement).src = `/api/files/${data.id}` })
                channels[data.channel_id].icon = data.id
                return showToast("Ustawienia", "Zmieniono ikonkę grupy", "success")
            }

            if (data.errors) return showToast("Ustawienia", data.errors.image, "error")
            showToast("API", "Coś poszło nie tak", "error")
        })
    }).catch(() => {
        showToast("API", "Coś poszło nie tak", "error")
    })
}

$("#user-avatar-btn").on("click", () => $("#user-avatar-file").get(0).click())
$("#user-avatar-file").on("change", (e) => changeAvatar(e.target))

$("#update-icon-btn").on("click", () => $("#update-icon-file").get(0).click())
$("#update-icon-file").on("change", (e) => changeIcon(e.target, currentChannel.id))


// MODALS
function clearInputs(element: any) {
    $(element).find("input").each((_, inpt) => { inpt.value = "" })
    $(element).find("span.text-danger").each((_, errorElement) => { errorElement.innerText = "*" })
}
$(".modal").each((_, el) => { $(el).on("hide.bs.modal", () => clearInputs(el)) })

function setChannelSettings(element: any, channel: any) {
    $(element).find("#settings-group-name").val(channel.name);
    $(element).find("#settings-group-icon").attr("src", channel.icon ? `/api/files/${channel.icon}` : `/assets/icons/generic_group.webp`)
    $(element).find("#settings-group-icon").attr("name", `group-icon-${channel.id}`)
}

$("#channel-settings-modal").on("show.bs.modal", (e) => setChannelSettings(e.target, currentChannel))