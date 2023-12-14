const carId = new URLSearchParams(window.location.search).get("carId");
const main = document.querySelector("main");

const res = await fetch(`/car/${carId}/images`);
/** @type {string[]} */
const images = await res.json();

for (const image of images) {
    const img = document.createElement("img");
    img.src = `/car/image/${image}`;
    main.appendChild(img);
}
