// Dom

const loginBtn = document.getElementById("loginBtn")
const emailAlert = document.getElementById("emailAlert")
const passwordAlert = document.getElementById("passwordAlert")
const nameAlert = document.getElementById("nameAlert")
const emailInput = document.getElementById("emailInput")
const passwordInput = document.getElementById("passwordInput")
const nameInput = document.getElementById("nameInput")
const container = document.getElementById("container")
const continueBtn = document.getElementById("continueBtn")
const layout = document.getElementById("layout")
let emailV = false;
let passwordV = false;
let nameV = false;
emailAlert.style.display = "none"
passwordAlert.style.display = "none"
nameAlert.style.display = "none"

window.onload = () => {
    if (localStorage.length >= 1) {
        container.classList.remove("hidden")
        const user = JSON.parse(localStorage.getItem("user"))
        continueBtn.textContent = user.name
    }
}

continueBtn.addEventListener("click", () => {
    window.location.href = "./home.html"
})

layout.addEventListener("click", () => {
    container.classList.add("hidden")
})

nameInput.addEventListener("input", () => {
    const name = nameInput.value;
    const nameRegex = /^[a-zA-Z].{4,}$/;
    nameV = nameRegex.test(name)
    if (!nameV) {
        nameAlert.style.display = "block"
    } else {
        nameAlert.style.display = "none"
    }
    checkValidation()
})

emailInput.addEventListener("input", () => {
    const email = emailInput.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/ig;
    emailV = emailRegex.test(email)
    if (!emailV) {
        emailAlert.style.display = "block"
    } else {
        emailAlert.style.display = "none"
    }
    checkValidation()
})

passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/ig;
    passwordV = passwordRegex.test(password)
    if (!passwordV) {
        passwordAlert.style.display = "block"
    } else {
        passwordAlert.style.display = "none"
    }
    checkValidation()
})

function checkValidation() {
    if (emailV && passwordV && nameV) {
        loginBtn.removeAttribute("disabled", false)
        const email = emailInput.value;
        const password = passwordInput.value;
        const name = nameInput.value;
        const user = { name: name, email: email, password: password, books: [] }
        const userS = JSON.stringify(user)
        localStorage.setItem("user", userS)
    }
}


loginBtn.addEventListener("click", () => {
    window.location.href = "./home.html"
    emailInput.value = ""
    nameInput.value = ""
})
