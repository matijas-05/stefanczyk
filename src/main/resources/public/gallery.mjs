const carId = new URLSearchParams(window.location.search).get("carId");
const main = document.querySelector("main");

const res = await fetch(`/car/${carId}/images`);
/** @type {string[]} */
const images = await res.json();

for (const image of images) {
    const div = document.createElement("div");
    main.appendChild(div);

    const img = document.createElement("img");
    img.src = `/car/image/${image}`;
    div.appendChild(img);

    const editLink = document.createElement("a");
    editLink.classList.add("edit");
    editLink.textContent = "edit";
    editLink.href = `/imager.html?filename=${encodeURIComponent(image)}`;
    div.appendChild(editLink);
}
