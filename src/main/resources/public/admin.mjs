/**
 * @typedef {Object} Car
 * @property {string} id
 * @property {string} model
 * @property {string} year
 * @property {Airbags} airbags
 * @property {string} color
 * @property {boolean} hasSingleInvoice
 */

/**
 * @typedef {Object} Airbags
 * @property {boolean} driver
 * @property {boolean} passenger
 * @property {boolean} back
 * @property {boolean} side
 */

document.getElementById("random-cars").addEventListener("click", async () => {
    const res = await fetch("/random", {
        method: "POST",
    });
    if (!res.ok) {
        alert("Error generating random cars");
        return;
    }

    fetchCars();
});

fetchCars();

async function fetchCars() {
    const res = await fetch("/car");
    if (!res.ok) {
        alert("Error fetching cars");
        return;
    }

    /** @type {Car[]} */
    const cars = await res.json();
    const main = document.querySelector("main");
    main.innerHTML = "";

    cars.forEach((car, i) => {
        const row = document.createElement("div");
        row.classList.add("row");

        const nr = document.createElement("div");
        nr.textContent = i;
        row.appendChild(nr);

        const id = document.createElement("div");
        id.textContent = car.id;
        row.appendChild(id);

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

        const generateInvoiceBtn = document.createElement("button");
        generateInvoiceBtn.textContent = "generuj fakturę VAT";
        generateInvoiceBtn.addEventListener("click", async () => {
            const res = await fetch(`/invoice/${car.id}`, {
                method: "POST",
            });
            if (!res.ok) {
                alert("Error generating invoice");
                return;
            }
            fetchCars();
        });
        row.appendChild(generateInvoiceBtn);

        if (car.hasSingleInvoice) {
            const downloadInvoiceA = document.createElement("a");
            downloadInvoiceA.innerText = "pobierz fakturę VAT";
            downloadInvoiceA.href = `/invoice/${car.id}`;
            row.appendChild(downloadInvoiceA);
        }

        main.appendChild(row);
    });
}
