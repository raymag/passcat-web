const root = document.querySelector("#root");
const signature = document.querySelector("#signature");
const size = document.querySelector("#size");
const generated = document.querySelector("#generated");

const status = document.querySelector("#status");
const menuBtn = document.querySelector("#menu");
const visibilityBtn = document.querySelector("#visibility");
const saveBtn = document.querySelector("#save");

menuBtn.addEventListener("click", toggleMenu);

visibilityBtn.addEventListener("click", toggleVisibility);
generated.addEventListener("click", copy);
root.addEventListener("keyup", generate);

saveBtn.addEventListener("click", saveData);

loadData();

function toggleVisibility() {
  const hidden = visibilityBtn.innerText === "SHOW";
  if (hidden) {
    visibilityBtn.innerText = "HIDE";
    generated.type = "text";
  } else {
    visibilityBtn.innerText = "SHOW";
    generated.type = "password";
  }
}

function loadData() {
  const size_to_save = document.querySelector("#size");
  const signature_to_save = document.querySelector("#signature");

  const size = localStorage.getItem("d2d166"); // size
  const signature = localStorage.getItem("d092"); // signature

  if (size) {
    size_to_save.value = size;
  }
  if (signature) {
    signature_to_save.value = signature;
  }
}
function saveData() {
  const size_to_save = document.querySelector("#size");
  const signature_to_save = document.querySelector("#signature");

  localStorage.setItem("d2d166", size_to_save.value);
  localStorage.setItem("d092", signature_to_save.value);

  toggleMenu();
}

function toggleMenu() {
  const toggled = menuBtn.className != "";

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

async function copy() {
  console.log("Copying");
  await navigator.clipboard.writeText(generated.value);

  status.className = "greenStatus";
  status.innerText = "Password copied to Clipboard!";
}

function hashstring(string) {
  return new Promise((resolve, reject) => {
    const msgBuffer = new TextEncoder().encode(string);
    crypto.subtle
      .digest("SHA-256", msgBuffer)
      .then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => ("00" + b.toString(16)).slice(-2))
          .join("");
        resolve(hashHex);
      })
      .catch((e) => reject(""));
  });
}

function generate() {
  console.log("Generating");

  if (root.value == "" || signature.value == "" || size.value == "") {
    console.log("Not enough fields");
    status.className = "status";
    status.innerText = "Please fill all the fields";
    return null;
  }

  status.classList = [];
  status.innerText = "";

  hashstring(root.value).then((r) => {
    const realSize = parseInt(size.value);
    const hint = root.value.substr(0, 3);
    const sign = signature.value;
    const coreStart = r.substr(0, realSize);
    const coreEnd = r.substr(r.length - realSize, r.length);
    const password = hint + sign + coreStart + coreEnd;
    generated.value = password;
  });
}
