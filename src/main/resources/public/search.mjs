/**
 * @typedef {Object} Car
 * @property {string} id
 * @property {string} model
 * @property {string} year
 * @property {Airbags} airbags
 * @property {string} color
 * @property {number} price
 * @property {number} vat
 */

/**
 * @typedef {Object} Airbags
 * @property {boolean} driver
 * @property {boolean} passenger
 * @property {boolean} back
 * @property {boolean} side
 */

/**
 * @typedef {Object} Invoice
 * @property {string} filename
 * @property {number} date
 */

fetchCars();
fetchInvoicesAll();

/** @type {HTMLButtonElement} */
const invoiceAllCarsBtn = document.getElementById("invoice-all-cars");
invoiceAllCarsBtn.addEventListener("click", async () => {
    const res = await fetch("/invoice/all", { method: "POST" });
    if (res.ok) {
        alert("faktura za wszytkie auta wygenerowana");
        fetchInvoicesAll();
    } else {
        alert("błąd generowania faktury");
    }
});

async function fetchCars() {
    const res = await fetch("/car");
    if (!res.ok) {
        alert("Error fetching cars");
        return;
    }

    /** @type {Car[]} */
    const cars = await res.json();
    const main = document.querySelector("#cars");
    main.innerHTML = "";

    cars.forEach((car, i) => {
        const row = document.createElement("div");
        row.classList.add("row");

        const nr = document.createElement("div");
        nr.textContent = i;
        row.appendChild(nr);

        const model = document.createElement("div");
        model.textContent = car.model;
        row.appendChild(model);

        const year = document.createElement("div");
        year.textContent = car.year;
        row.appendChild(year);

        const airbags = document.createElement("div");
        airbags.innerText = `driver: ${car.airbags.driver}\n passenger: ${car.airbags.passenger}\n back: ${car.airbags.back}\n side: ${car.airbags.side}`;
        row.appendChild(airbags);

        const color = document.createElement("div");
        color.style.width = "2rem";
        color.style.height = "2rem";
        color.style.backgroundColor = car.color;
        row.appendChild(color);

        // TODO:
        // const picture = document.createElement("img");

        const price = document.createElement("div");
        price.textContent = car.price;
        row.appendChild(price);

        const vat = document.createElement("div");
        vat.textContent = car.vat;
        row.appendChild(vat);

        main.appendChild(row);
    });
}

async function fetchInvoicesAll() {
    /** @type {HTMLDivElement} */
    const invoiceAllCarsDownload = document.getElementById("invoice-all-cars-download");

    const res = await fetch("/invoice/all");
    /** @type {Invoice[]} */
    const invoices = await res.json();

    invoiceAllCarsDownload.innerHTML = "";
    for (const invoice of invoices) {
        const link = document.createElement("a");
        link.innerText = "pobierz";
        link.href = `/invoice/all/${invoice.filename}`;
        link.title = `faktura za wszytkie auta -> ${new Date(invoice.date).toLocaleString()}`;
        invoiceAllCarsDownload.appendChild(link);
    }
}
