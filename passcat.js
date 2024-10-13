const root = document.querySelector("#root")
const signature = document.querySelector("#signature")
const size = document.querySelector("#size")
const generated = document.querySelector("#generated")

const status = document.querySelector("#status")
const menuBtn = document.querySelector("#menu")
const generateBtn = document.querySelector("#generate")
const saveBtn = document.querySelector("#save")

menuBtn.addEventListener("click", toggleMenu)

generateBtn.addEventListener("click", generate)
generated.addEventListener("click", copy)

saveBtn.addEventListener("click", saveData)

loadData();

function loadData() {
    const size_to_save = document.querySelector("#size")
    const signature_to_save = document.querySelector("#signature")
    
    const size = localStorage.getItem('d2d166') // size
    const signature = localStorage.getItem('d092') // signature
    
    if (size) {
        size_to_save.value = size
    } 
    if (signature) {
        signature_to_save.value = signature
    }
    console.log("loaded", size_to_save, size)
}
function saveData(){
    const size_to_save = document.querySelector("#size")
    const signature_to_save = document.querySelector("#signature")
    
    localStorage.setItem('d2d166', size_to_save.value)
    localStorage.setItem('d092', signature_to_save.value)
    console.log("crey")
  
    toggleMenu()
}
  

function caesarCipher(str, shift) {
    // Normalize the shift for letters and digits
    const letterShift = shift % 26;
    const digitShift = shift % 10;
    let result = '';

    for (let char of str) {
        if (/[A-Z]/.test(char)) { // Uppercase letters
            const newChar = String.fromCharCode((char.charCodeAt(0) - 65 + letterShift) % 26 + 65);
            result += newChar;
        } else if (/[a-z]/.test(char)) { // Lowercase letters
            const newChar = String.fromCharCode((char.charCodeAt(0) - 97 + letterShift) % 26 + 97);
            result += newChar;
        } else if (/[0-9]/.test(char)) { // Digits
            const newChar = String.fromCharCode((char.charCodeAt(0) - 48 + digitShift) % 10 + 48);
            result += newChar;
        } else {
            // If it's a special character, leave it unchanged
            result += char;
        }
    }

    return result;
}


function toggleMenu(){
    const toggled = menuBtn.className != '';

    if (toggled) {
        menuBtn.className = "";
        document.querySelector("#settings").className = "hide";
        document.querySelector("#home").className = "";
    } else {
        menuBtn.className = "opened";
        document.querySelector("#home").className = "hide";
        document.querySelector("#settings").className = "";
    }
}

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
// the function erases the form's field's contents each 40 seconds
function Cleanfield(){
    document.getElementById('signature').value = '';
    document.getElementById('size').value = '';
}

setInterval(function(){
    Cleanfield();
}, 40 * 1000);