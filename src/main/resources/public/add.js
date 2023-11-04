/** @type {HTMLButtonElement} */
const submitBtn = document.querySelector("button[type='submit']");

submitBtn.addEventListener("click", async () => {
    /** @type {HTMLInputElement} */
    const modelEl = document.querySelector("#model");
    /** @type {HTMLInputElement} */
    const yearEl = document.querySelector("#year");

    /** @type {HTMLInputElement} */
    const airDriverEl = document.querySelector("#driver-airbag");
    /** @type {HTMLInputElement} */
    const airPassangerEl = document.querySelector("#passanger-airbag");
    /** @type {HTMLInputElement} */
    const airBackEl = document.querySelector("#back-airbag");
    /** @type {HTMLInputElement} */
    const airSideEl = document.querySelector("#back-side-airbag");

    /** @type {HTMLInputElement} */
    const colorEl = document.querySelector("#color");

    const data = {
        model: modelEl.value,
        year: yearEl.value,
        airbags: {
            driver: airDriverEl.checked,
            passenger: airPassangerEl.checked,
            back: airBackEl.checked,
            side: airSideEl.checked,
        },
        color: colorEl.value,
    };

    const res = await fetch("/add", { method: "post", body: JSON.stringify(data) });
    if (!res.ok) {
        alert("Błąd podczas dodawania samochodu");
    } else {
        alert("Dodano samochód");
    }
});
