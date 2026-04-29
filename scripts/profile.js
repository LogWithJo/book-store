const username = document.getElementById("username")
const email = document.getElementById("email")
const booksAdded = document.getElementById("booksAdded")
const logout = document.getElementById("logout")
const LS = JSON.parse(localStorage.getItem("user"))
username.textContent = LS.name
email.textContent = LS.email
booksAdded.textContent = LS.books.length

logout.addEventListener("click", () => {
    localStorage.clear()
    location.href = "./login.html"
})