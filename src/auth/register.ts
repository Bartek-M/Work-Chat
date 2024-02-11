import "../utils"

document.getElementById("submit-btn")?.addEventListener("click", async (e) => {
    e.preventDefault()

    await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "X-CSRFToken": (document.getElementsByName("csrfmiddlewaretoken")[0] as HTMLInputElement).value },
        body: JSON.stringify({
            username: "world",
            email: "1234test",
            password: "zaq1@WSX"
        }),
    }).then(() => {

    }).catch(() => {

    })
})