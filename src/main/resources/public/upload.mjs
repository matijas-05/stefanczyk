const carId = new URLSearchParams(window.location.search).get("carId");
const images = document.getElementById("images");
const uploadBtn = document.getElementById("upload");

/** @type {File[]} **/
let files = [];
/** @type {HTMLInputElement} **/
const input = document.querySelector("input[type=file]");
input.addEventListener("change", (e) => {
    /** @type {HTMLInputElement} **/
    const target = e.currentTarget;
    files = [...target.files];
    drawImages();
});

uploadBtn.addEventListener("click", async () => {
    const formData = new FormData();
    for (const file of files) {
        formData.append("file", file);
    }

    const res = await fetch(`/car/${carId}/images`, {
        method: "POST",
        body: formData,
    });
    if (res.ok) {
        alert("Upload successful");
    } else {
        alert("Upload failed");
    }
});

function drawImages() {
    images.innerHTML = "";
    for (const file of files) {
        const div = document.createElement("div");
        div.classList.add("img-preview");

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.target = "_blank";
        div.appendChild(img);

        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.addEventListener("click", () => {
            files.splice(files.indexOf(file), 1);
            console.log(files);
            drawImages();
        });
        div.appendChild(removeButton);

        images.appendChild(div);
    }
}
