// https://api.unsplash.com/search/photos?client_id=RNV119nfjjumNS1TaF8EMR860Gq_4aDNjurAdBKB8n0&query=holy_bible

// Dom

const layout = document.getElementById("layout")
const addBookCont = document.getElementById("addBookCont")
const addBookBtn = document.getElementById("addBookBtn")
const bookTitleInput = document.getElementById("bookTitleInput")
const authorNameInput = document.getElementById("authorNameInput")
const priceInput = document.getElementById("priceInput")
const addBookPop = document.getElementById("addBookPop")
const bookTitleAlert = document.getElementById("bookTitleAlert")
const authorNameAlert = document.getElementById("authorNameAlert")
const priceAlert = document.getElementById("priceAlert")
const booksCont = document.getElementById("booksCont")
const TitleSInput = document.getElementById("TitleSInput")
const PriceSInput = document.getElementById("PriceSInput")
const noBooks = document.getElementById("noBooks")
const results = document.getElementById("results")
const gridCont = document.getElementById("gridCont")
const searchGrid = document.getElementById("searchGrid")
const bookAdded = document.getElementById("bookAdded")
const reload = document.getElementById("reload")
// clicks

addBookPop.addEventListener("click", () => {
    addBookCont.classList.remove("hidden")
})

layout.addEventListener("click", () => {
    addBookCont.classList.add("hidden")
})

reload.addEventListener("click", () => {
    searchGrid.innerHTML = ""
})


// add book button action and inputs validate

addBookBtn.addEventListener("click", () => {
    const LS = JSON.parse(localStorage.getItem("user"))
    const validates = validate(LS.books, searchGrid.childNodes)
    if (validates) {
        a(searchGrid.childNodes, LS)
    } else {
        showMs()
    }
})

function showMs() {
    bookAdded.classList.remove("hidden")
    setTimeout(() => {
        bookAdded.classList.add("hidden")
    }, 1000);
}

function validate(arr1, arr2) {
    const ids = new Set(arr1.map(id => id[1]))
    for (let item of arr2) {
        if (ids.has(item.id)) {
            return false
        }
    }
    return true
}

function a(newBooks, LS) {
    newBooks.forEach(book => {
        LS.books.push([book.getAttribute("data-title"), book.id])
    })
    const L = JSON.stringify(LS)
    localStorage.setItem("user", L)
    addBookCont.classList.add("hidden")
    removeCards()
    renderBooksLS()
    searchGrid.innerHTML = ""
}
// let timeout;
// bookTitleInput.addEventListener("input", () => {
//     let lastQuery = "";
//     clearTimeout(timeout)
//     timeout = setTimeout(() => {
//         const bookTitle = bookTitleInput.value.toLowerCase()
//         if (bookTitle.trim() === "") {
//             removeResults()
//             return
//         }
//         if (bookTitle.length < 3 || lastQuery === bookTitle) return;
//         lastQuery = bookTitle
//         getInfoGoogle(bookTitle)
//     }, 1000);
// })
let lastQuery = "";
bookTitleInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const bookTitle = bookTitleInput.value.toLowerCase()
        if (bookTitle.trim() === "") {
            removeResults()
            return
        }
        if (bookTitle.length < 3 || lastQuery === bookTitle) return;
        lastQuery = bookTitle
        const books = await getInfoGoogle(bookTitle, 2)
        removeResults()
        books.forEach(book => {
            createbookmini(book)
        });
        getResults()
    }
})



function removeResults() {
    results.innerHTML = ""
}

function createbookmini(googleInfo) {
    const bookName = googleInfo.volumeInfo.title
    const authorName = googleInfo.volumeInfo.authors
        ? googleInfo.volumeInfo.authors[0]
        : "unknown author"
    const image = googleInfo.volumeInfo.imageLinks
        ? googleInfo.volumeInfo.imageLinks.thumbnail
        : "https://via.placeholder.com/100"
    const parentDiv = document.createElement("div")
    const imgDiv = document.createElement("div")
    const img = document.createElement("img")
    const box = document.createElement("div")
    const book = document.createElement("div")
    const author = document.createElement("div")
    box.append(book, author)
    imgDiv.append(img)
    parentDiv.append(imgDiv, box)
    box.className = "flex flex-col justify-center items-center"
    imgDiv.className = "w-1/4"
    parentDiv.className = "p-2 flex justify-start gap-4 items-center cursor-pointer"
    parentDiv.id = googleInfo.id
    img.setAttribute("src", image)
    book.textContent = bookName
    author.textContent = authorName
    results.append(parentDiv)
}

// results.children.forEach(child => {
//     child.addEventListener("click", () => {
//         console.log(child)
//     })
// })

function getResults() {
    let check = false;
    results.childNodes.forEach(e => {
        e.addEventListener("click", async () => {
            const data = await getInfoGoogle(e.id, 1)
            // validate
            if (searchGrid.childNodes.length === 0) { check = true }
            searchGrid.childNodes.forEach(book => {
                console.log(data)
                if (book.id === data[0].id) {
                    check = false;
                } else {
                    check = true;
                }
            })
            if (check === false) {
                removeResults()
                bookAdded.classList.remove("hidden")
                setTimeout(() => {
                    bookAdded.classList.add("hidden")
                }, 1000);
                return
            };
            createBookGrid(data)
            removeResults()
            bookTitleInput.value = ""
        })
    })
}

function createBookGrid(books) {
    const book = books[0]
    const bookName = book.volumeInfo.title
    const authorName = book.volumeInfo.authors
        ? book.volumeInfo.authors[0]
        : "unknown author"
    const image = book.volumeInfo.imageLinks
        ? book.volumeInfo.imageLinks.thumbnail
        : "https://via.placeholder.com/100"
    const parent = document.createElement("div")
    const imgDiv = document.createElement("div")
    const img = document.createElement("img")
    const h2 = document.createElement("h2")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    fetch(`https://api.unsplash.com/search/photos?client_id=RNV119nfjjumNS1TaF8EMR860Gq_4aDNjurAdBKB8n0&query=${bookName}`)
        .then(res => res.json())
        .then(data => { img.setAttribute("src", data.results[0].urls.raw) })
    imgDiv.appendChild(img)
    parent.append(imgDiv, h2, p1, p2,)
    imgDiv.className = "p-2"
    img.className = "w-full h-48 object-cover rounded"
    parent.className = "bg-white p-4 rounded-xl shadow hover:shadow-lg"
    parent.id = book.id
    parent.setAttribute("data-title", bookName)
    h2.className = "font-bold"
    h2.textContent = bookName
    p1.className = "text-sm text-gray-500"
    p1.textContent = authorName
    p2.className = "font-semibold text-blue-600"
    searchGrid.append(parent)
}

// render books on page

async function renderBooksLS() {
    const books = JSON.parse(localStorage.getItem("user")).books
    console.log(books)
    if (books.length <= 0) {
        console.log("less than 1")
        addNoBooks(true)
    }
    books.forEach(async (bookId) => {
        addNoBooks(false)
        const book = await fetchBooks(bookId[1])
        createBookUI(book[0])
        const aw = await ok()
    });
}

renderBooksLS()

// bookTitle, authorName, pageCount, buyLink, price, image
function createBookUI(book) {
    const bookName = book.volumeInfo.title
    const authorName = book.volumeInfo.authors
        ? book.volumeInfo.authors[0]
        : "unknown author"
    const parent = document.createElement("div")
    const imgDiv = document.createElement("div")
    const img = document.createElement("img")
    const h2 = document.createElement("h2")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    const div = document.createElement('div')
    const button1 = document.createElement("button")
    fetch(`https://api.unsplash.com/search/photos?client_id=RNV119nfjjumNS1TaF8EMR860Gq_4aDNjurAdBKB8n0&query=${bookName}`)
        .then(res => res.json())
        .then(data => { img.setAttribute("src", data.results[0].urls.raw) })
    imgDiv.appendChild(img)
    div.append(button1)
    parent.append(imgDiv, h2, p1, p2, div)
    imgDiv.className = "p-2"
    img.className = "w-full h-48 object-cover rounded"
    parent.className = "bg-white p-4 rounded-xl shadow hover:shadow-lg"
    h2.className = "font-bold line-clamp-1"
    h2.textContent = bookName
    p1.className = "text-sm text-gray-500"
    p1.textContent = authorName
    p2.className = "font-semibold text-blue-600"
    div.className = "flex gap-2 mt-3"
    button1.className = "flex-1 bg-blue-600 text-white p-2 rounded-lg"
    button1.textContent = "buy"
    button1.id = "amazons"
    button1.setAttribute("data-src", bookName)
    booksCont.append(parent)
}
// filtering

let timeout;

TitleSInput.addEventListener("input", (e) => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
        filterName(e.target.value)
    }, 300)
})

// function filterName(name) {
//     if (name.length === 0) { removeCards(); renderBooksLS() }
//     const LS = JSON.parse(localStorage.getItem("user"))
//     const books = LS.books
//     books.forEach(book => {
//         if (book[0].startsWith(name)) {
//             getIdAddUI(book[1])
//         }
//     })
// }

function filterName(name) {
    const query = name.trim().toLowerCase()

    const LS = JSON.parse(localStorage.getItem("user"))
    const books = LS.books

    const filtered = books.filter(book =>
        book[0].toLowerCase().includes(query)
    )

    removeCards() // 🔥 مهم جدًا هنا

    if (filtered.length === 0) {
        addNoBooks(true)
        return
    }

    addNoBooks(false)

    filtered.forEach(book => {
        getIdAddUI(book[1])
    })
}
async function getIdAddUI(id) {
    const book = await fetchBooks(id)

    const alreadyExists = [...booksCont.children].some(el => el.id === book[0].id)

    if (alreadyExists) return

    createBookUI(book[0])
}

// function filterName(name) {
//     const books = JSON.parse(localStorage.getItem("user")).books
//     const filter = books.filter(book => book[0].startsWith(name))
//     removeCards()
//     if (filter.length === 0) {
//         addNoBooks(true)
//     } else {
//         addNoBooks(false)
//     }
//     filter.forEach(async (bookName) => {
//         addNoBooks(false) 
//         const book = await fetchBooks(bookName)
//         createBookUI(book[0])
//         const aw = await ok()
//     });
// }
// async function filterName(name) {
//     const books = JSON.parse(localStorage.getItem("user")).books;

//     const filtered = books.filter(book =>
//         book[0].toLowerCase().startsWith(name.toLowerCase())
//     );

//     removeCards();

//     if (filtered.length === 0) {
//         addNoBooks(true);
//         return;
//     }

//     addNoBooks(false);

//     for (let bookName of filtered) {
//         const book = await fetchBooks(bookName);
//         createBookUI(book[0]);
//         await ok();
//     }
// }


// remove cards

function removeCards() {
    booksCont.innerHTML = ""
}


document.addEventListener("keydown", (event) => {
    if (event.key === "9") {
        addBookPop.click()
    }
    if (event.key === "Escape") {
        if (!addBookCont.classList.contains("hidden")) {
            layout.click()
        }
    }
})

function addNoBooks(state) {
    if (state) {
        booksCont.classList.add("hidden")
        noBooks.classList.remove("hidden")
    } else {
        booksCont.classList.remove("hidden")
        noBooks.classList.add("hidden")
    }
}


// fetch("https://www.googleapis.com/books/v1/volumes?q=lFhbDwAAQBAJ")
//     .then(res => res.json())
//     .then(data => console.log(data.items[0]));


async function fetchBooks(query, retries = 3, delay = 1000) {
    try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)

        if (res.status === 503) {
            throw new Error("Service Unavailable")
        }

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`)
        }

        const data = await res.json()
        return data.items.slice(0, 1) || []

    } catch (err) {
        if (retries > 0) {
            console.log(`Retrying in ${delay}ms...`)

            await new Promise(r => setTimeout(r, delay))

            // exponential backoff 🔥
            return fetchBooks(query, retries - 1, delay * 2)
        } else {
            console.log("Failed after retries ❌")
            return []
        }
    }
}

async function getInfoGoogle(bookTitle, num) {
    const req = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}`)
    const res = await req.json()
    if (!res.items) { console.log("no data in googleInfo function"); return }
    return res.items.slice(0, num)
}


// https://www.amazon.eg/s?k=atomichabits&crid=1G6M9GUV9467U&sprefix=pen%2Caps%2C181&ref=nb_sb_noss_1


function ok() {
    const amazon = document.querySelectorAll("#amazons")
    amazon.forEach(btn => {
        btn.addEventListener("click", () => {
            location.href = `https://www.amazon.eg/s?k=${btn.getAttribute("data-src")}&crid=1G6M9GUV9467U&sprefix=pen%2Caps%2C181&ref=nb_sb_noss_1`
        })
    })
}

