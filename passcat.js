const root = document.querySelector("#root")
const signature = document.querySelector("#signature")
const size = document.querySelector("#size")
const generated = document.querySelector("#generated")

const status = document.querySelector("#status")
const generateBtn = document.querySelector("#generate")

generateBtn.addEventListener("click", generate)
generated.addEventListener("click", copy)

function copy() {
    console.log("Copying")
    generated.select()
    generated.setSelectionRange(0, 99999)
    document.execCommand("copy")

    status.className = "greenStatus"
    status.innerText = "Password copied to Clipboard!"
  
}

function hashstring(string) {
    return new Promise((resolve, reject) => {
        const msgBuffer = new TextEncoder().encode(string)
        crypto.subtle.digest('SHA-256', msgBuffer)
            .then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer))
                const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
                resolve(hashHex)
            })
            .catch(e => reject(""))
    })
}

function generate() {
    console.log("Generating")

    if (root.value == ''|| signature.value == ''
    || size.value == '') {
        console.log("Not enough fields")
        status.className="status"
        status.innerText = "Please fill all the fields"
        return null
    }

    if (root.value.length < 3) {
        console.log("Root is too small")
        status.className="status"
        status.innerText = "Root word must at least be 3 characters wide"
        return null
    }

    status.classList = []
    status.innerText = ""

    hashstring(root.value)
        .then(r => {
            const realSize = parseInt(size.value)
            const hint = root.value.substr(0, 3)
            const sign = signature.value
            const coreStart = r.substr(0, realSize)
            const coreEnd = r.substr(r.length - realSize, r.length)
            const password = hint + sign + coreStart + coreEnd
            generated.value = password
        })
    

}