/** @typedef {{left: number, top: number, width: number, height: number}} Body */

const filename = new URLSearchParams(window.location.search).get("filename");
/** @type {HTMLImageElement} */
const img = document.querySelector("img");
await fetchImage();

// Actions
let isCropping = false;
let isDragging = false;
/** @type {Body} */
let body = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
};

/** @type {HTMLDivElement} */
const selection = document.getElementById("selection-box");
img.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (!isCropping) {
        return;
    }
    isDragging = true;
    body = { left: 0, top: 0, width: 0, height: 0 };

    selection.hidden = false;
    selection.style.left = img.x + e.offsetX + "px";
    selection.style.top = img.y + e.offsetY + "px";
    selection.style.width = 0;
    selection.style.height = 0;
});
img.addEventListener("mousemove", (e) => {
    if (!isCropping || !isDragging) {
        return;
    }

    const left = parseInt(selection.style.left);
    const top = parseInt(selection.style.top);
    const width = img.x + e.offsetX - left;
    const height = img.y + e.offsetY - top;
    selection.style.width = width + "px";
    selection.style.height = height + "px";
    body = {
        left: left - img.x,
        top: top - img.y,
        width,
        height,
    };
});
img.addEventListener("mouseup", async () => {
    if (!isCropping) {
        return;
    }
    isDragging = false;
});

/** @type {HTMLButtonElement} */
const cropBtn = document.getElementById("crop");
cropBtn.addEventListener("click", async () => {
    isCropping = !isCropping;
    selection.hidden = !isCropping;
    img.style.cursor = isCropping ? "crosshair" : "auto";

    if (isCropping) {
        alert("Click and drag to select, then click the crop button again to crop");
    } else {
        const ratio = img.naturalWidth / img.width;
        body = {
            left: Math.round(body.left * ratio),
            top: Math.round(body.top * ratio),
            width: Math.round(body.width * ratio),
            height: Math.round(body.height * ratio),
        };
        const res = await fetch(`/image/${filename}/crop`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (res.ok) {
            const blob = await res.blob();
            img.src = URL.createObjectURL(blob);
        } else {
            alert("Failed to crop image");
        }

        selection.style.width = 0;
        selection.style.height = 0;
    }
    rotateBtn.disabled = isCropping;
    flipHorizontalBtn.disabled = isCropping;
    flipVerticalBtn.disabled = isCropping;
});

/** @type {HTMLButtonElement} */
const rotateBtn = document.getElementById("rotate");
rotateBtn.addEventListener("click", async () => {
    const res = await fetch(`/image/${filename}/rotate`, { method: "POST" });
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
    const res = await fetch(`/image/${filename}/flip-horizontal`, { method: "POST" });
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
    const res = await fetch(`/image/${filename}/flip-vertical`, { method: "POST" });
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
