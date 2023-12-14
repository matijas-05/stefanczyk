package com.mycompany.samochody;
import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.itextpdf.text.DocumentException;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;
import java.util.UUID;
import spark.Request;
import spark.Response;

public class Main {
    static ArrayList<Car> cars = new ArrayList<Car>();
    static HashMap<String, SingleInvoice> singleInvoices = new HashMap<String, SingleInvoice>();
    static ArrayList<MultiInvoice> invoicesAll = new ArrayList<MultiInvoice>();
    static ArrayList<MultiInvoice> invoicesPriceRange = new ArrayList<MultiInvoice>();
    static Gson gson = new Gson();

    public static void main(String[] args) {
        port(3000);
        staticFiles.externalLocation("src/main/resources/public");

        get("/car", (req, res) -> getCars(req, res));
        post("/car", (req, res) -> addCar(req, res));
        delete("/car/:id", (req, res) -> deleteCar(req, res));
        patch("/car/:id", (req, res) -> updateCar(req, res));

        get("/car/image/:filename", (req, res) -> getCarImage(req, res));
        post("/car/random", (req, res) -> randomCars(req, res));

        post("/invoice/all", (req, res) -> generateInvoiceAll(req, res));
        get("/invoice/all", (req, res) -> getInvoices(req, res, invoicesAll));
        get("/invoice/all/:filename", (req, res) -> downloadInvoice(req, res));

        post("/invoice/price-range", (req, res) -> generateInvoicePriceRange(req, res));
        get("/invoice/price-range", (req, res) -> getInvoices(req, res, invoicesPriceRange));
        get("/invoice/price-range/:filename", (req, res) -> downloadInvoice(req, res));

        post("/invoice/:id", (req, res) -> generateSingleInvoice(req, res));
        get("/invoice/:id", (req, res) -> downloadSingleInvoice(req, res));
    }

    static String getCars(Request req, Response res) {
        res.type("application/json");
        return gson.toJson(cars);
    }
    static String addCar(Request req, Response res) {
        try {
            Car car = gson.fromJson(req.body(), Car.class);
            car.id = UUID.randomUUID();
            cars.add(car);
        } catch (JsonSyntaxException e) {
            res.status(400);
            return "";
        }

        res.status(201);
        return "";
    }
    static String deleteCar(Request req, Response res) {
        UUID id = UUID.fromString(req.params(":id"));
        cars.removeIf(car -> car.id.equals(id));

        res.status(200);
        return "";
    }
    static String updateCar(Request req, Response res) {
        UUID id = UUID.fromString(req.params(":id"));
        Car car = cars.stream().filter(c -> c.id.equals(id)).findFirst().orElse(null);
        if (car == null) {
            res.status(404);
            return "Car not found";
        }

        try {
            Car newCar = gson.fromJson(req.body(), Car.class);
            car.model = newCar.model;
            car.year = newCar.year;
        } catch (JsonSyntaxException e) {
            res.status(400);
            return "";
        }

        res.status(200);
        return "";
    }

    static String getCarImage(Request req, Response res) {
        res.type("image/jpg");

        try (OutputStream os = res.raw().getOutputStream()) {
            os.write(Files.readAllBytes(Path.of("images/" + req.params(":filename"))));
        } catch (IOException e) {
            res.status(500);
            return e.getMessage();
        }

        return "";
    }
    static String randomCars(Request req, Response res) {
        String[] models = {"Fiat", "Skoda", "Ford", "Opel", "Audi", "BMW", "Mercedes"};
        String[] hex = {"0", "1", "2", "3", "4", "5", "6", "7",
                        "8", "9", "a", "b", "c", "d", "e", "f"};
        Random rand = new Random();

        cars.clear();
        for (int i = 0; i < 10; i++) {
            String model = models[rand.nextInt(0, models.length)];
            String year = String.valueOf(rand.nextInt(1990, 2023));
            Airbags airbags = new Airbags(rand.nextBoolean(), rand.nextBoolean(),
                                          rand.nextBoolean(), rand.nextBoolean());
            String color = "#";
            for (int j = 0; j < 6; j++) {
                color += hex[rand.nextInt(0, hex.length)];
            }

            cars.add(new Car(model, year, airbags, color));
        }

        res.status(200);
        return "";
    }

    static String generateSingleInvoice(Request req, Response res) {
        UUID id = UUID.fromString(req.params(":id"));
        Car car = cars.stream().filter(c -> c.id.equals(id)).findFirst().orElse(null);
        if (car == null) {
            res.status(404);
            return "Car with id '" + id + "' not found";
        }

        SingleInvoice invoice = new SingleInvoice(car);
        try {
            invoice.generate();
            singleInvoices.put(car.id.toString(), invoice);
        } catch (DocumentException | IOException e) {
            res.status(500);
            return e.getMessage();
        }

        car.hasSingleInvoice = true;
        res.status(201);
        return "";
    }
    static String downloadSingleInvoice(Request req, Response res) {
        UUID id = UUID.fromString(req.params(":id"));
        Car car = cars.stream().filter(c -> c.id.equals(id)).findFirst().orElse(null);
        if (car == null) {
            res.status(404);
            return "Car with id '" + id + "' not found";
        }
        if (!singleInvoices.containsKey(car.id.toString())) {
            res.status(404);
            return "Car with id '" + id + "' has no invoice";
        }

        String fileName = singleInvoices.get(car.id.toString()).path;
        res.type("application/octet-stream");
        res.header("Content-Disposition", "attachment; filename=" + fileName);

        try (OutputStream os = res.raw().getOutputStream()) {
            os.write(Files.readAllBytes(Path.of(fileName)));
        } catch (IOException e) {
            res.status(500);
            return e.getMessage();
        }

        return "";
    }

    static String generateInvoiceAll(Request req, Response res) {
        MultiInvoice invoice =
            new MultiInvoice("Faktura za wszystkie auta", "Firma sprzedająca auta", "Jan Kowalski",
                             cars, "faktura za wszytkie auta");
        try {
            invoice.generate();
            invoicesAll.add(invoice);
        } catch (DocumentException | IOException e) {
            res.status(500);
            return e.getMessage();
        }

        res.status(201);
        return "";
    }

    static String generateInvoicePriceRange(Request req, Response res) {
        InvoicePriceRange range = gson.fromJson(req.body(), InvoicePriceRange.class);
        if (range.from > range.to) {
            res.status(400);
            return "Min price cannot be greater than max price";
        }

        ArrayList<Car> carsInRange = new ArrayList<Car>();
        for (Car car : cars) {
            if (car.price >= range.from && car.price <= range.to) {
                carsInRange.add(car);
            }
        }

        MultiInvoice invoice = new MultiInvoice(
            "Faktura za auta w przedziale cenowym od " + range.from + "zł do " + range.to + "zł",
            "Firma sprzedająca auta", "Jan Kowalski", carsInRange,
            "faktura za ceny " + range.from + "-" + range.to);

        try {
            invoice.generate();
            invoicesPriceRange.add(invoice);
        } catch (DocumentException | IOException e) {
            res.status(500);
            return e.getMessage();
        }

        res.status(201);
        return "";
    }

    static String getInvoices(Request req, Response res, ArrayList<MultiInvoice> invoices) {
        ArrayList<MultiInvoiceDownload> invoicesDownload = new ArrayList<MultiInvoiceDownload>();
        for (MultiInvoice i : invoices) {
            invoicesDownload.add(new MultiInvoiceDownload(i.filename, i.date, i.metadata));
        }

        return gson.toJson(invoicesDownload);
    }
    static String downloadInvoice(Request req, Response res) {
        String fileName = req.params(":filename");

        res.type("application/octet-stream");
        res.header("Content-Disposition", "attachment; filename=" + fileName);

        try (OutputStream os = res.raw().getOutputStream()) {
            os.write(Files.readAllBytes(Path.of("invoices/" + fileName)));
        } catch (IOException e) {
            res.status(500);
            return e.getMessage();
        }

        return "";
    }
}

class MultiInvoiceDownload {
    public String filename;
    public long date;
    public String metadata;

    public MultiInvoiceDownload(String filename, long date, String metadata) {
        this.filename = filename;
        this.date = date;
        this.metadata = metadata;
    }
}

class InvoicePriceRange {
    public int from;
    public int to;

    public InvoicePriceRange(int to, int from) {
        this.to = to;
        this.from = from;
    }
}
