const filename = new URLSearchParams(window.location.search).get("filename");
const img = document.querySelector("img");
await fetchImage();

// Actions
/** @type {HTMLButtonElement} */
const rotateBtn = document.getElementById("rotate");
rotateBtn.addEventListener("click", async () => {
    const res = await fetch(`/image/${filename}/rotate`, { method: "PUT" });
    if (res.ok) {
        const blob = await res.blob();
        img.src = URL.createObjectURL(blob);
    } else {
        alert("Failed to rotate image");
    }
});

/** @type {HTMLButtonElement} */
const flipHorizontalBtn = document.getElementById("flip-horizontal");
flipHorizontalBtn.addEventListener("click", async () => {
    const res = await fetch(`/image/${filename}/flip-horizontal`, { method: "PUT" });
    if (res.ok) {
        const blob = await res.blob();
        img.src = URL.createObjectURL(blob);
    } else {
        alert("Failed to flip image");
    }
});

/** @type {HTMLButtonElement} */
const flipVerticalBtn = document.getElementById("flip-vertical");
flipVerticalBtn.addEventListener("click", async () => {
    const res = await fetch(`/image/${filename}/flip-vertical`, { method: "PUT" });
    if (res.ok) {
        const blob = await res.blob();
        img.src = URL.createObjectURL(blob);
    } else {
        alert("Failed to flip image");
    }
});

async function fetchImage() {
    const res = await fetch(`/car/image/${filename}`);
    if (res.ok) {
        const blob = await res.blob();
        img.src = URL.createObjectURL(blob);
    } else {
        alert("Failed to fetch image");
    }
}
