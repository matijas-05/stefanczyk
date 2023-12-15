const filename = new URLSearchParams(window.location.search).get("filename");
const res = await fetch(`/car/image/${filename}`);
const blob = await res.blob();

const img = document.querySelector("img");
img.src = URL.createObjectURL(blob);
