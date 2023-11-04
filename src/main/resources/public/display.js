/**
 * @typedef {Object} Car
 * @property {string} id
 * @property {string} model
 * @property {string} year
 * @property {Airbags} airbags
 * @property {string} color
 */

/**
 * @typedef {Object} Airbags
 * @property {boolean} driver
 * @property {boolean} passenger
 * @property {boolean} back
 * @property {boolean} side
 */

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

        const deleteCarBtn = document.createElement("button");
        deleteCarBtn.addEventListener("click", async () => {
            const res = await fetch(`/car/${car.id}`, { method: "DELETE" });
            if (!res.ok) {
                alert("Error deleting car");
                return;
            }
            fetchCars();
        });
        deleteCarBtn.textContent = "Delete";
        row.appendChild(deleteCarBtn);

        main.appendChild(row);
    });
}

fetchCars();
