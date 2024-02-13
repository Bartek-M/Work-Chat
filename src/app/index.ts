console.log("Hello App")

document.getElementById("chat-open")?.addEventListener("click", e => document.getElementById("chat-wrapper")?.classList.add("active"))
document.getElementById("chat-close")?.addEventListener("click", e => document.getElementById("chat-wrapper")?.classList.remove("active"))