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
import java.util.UUID;
import spark.Request;
import spark.Response;

public class Main {
    static ArrayList<Car> cars = new ArrayList<Car>();
    static HashMap<String, SingleInvoice> singleInvoices = new HashMap<String, SingleInvoice>();
    static ArrayList<MultiInvoice> invoicesAll = new ArrayList<MultiInvoice>();
    static Gson gson = new Gson();

    public static void main(String[] args) {
        cars.add(new Car("Fiat", "1999", new Airbags(true, true, false, false), "#ff0000"));
        cars.add(new Car("Skoda", "2012", new Airbags(true, true, true, true), "#ffffff"));

        port(3000);
        staticFiles.externalLocation("src/main/resources/public");

        get("/car", (req, res) -> getCars(req, res));
        post("/car", (req, res) -> addCar(req, res));
        delete("/car/:id", (req, res) -> deleteCar(req, res));
        patch("/car/:id", (req, res) -> updateCar(req, res));

        post("/invoice/all", (req, res) -> generateInvoiceAll(req, res));
        get("/invoice/all", (req, res) -> getInvoicesAll(req, res));
        get("/invoice/all/:filename", (req, res) -> downloadInvoiceAll(req, res));

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
        MultiInvoice invoice = new MultiInvoice("Faktura za wszystkie auta",
                                                "Firma sprzedająca auta", "Jan Kowalski", cars);
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
    static String getInvoicesAll(Request req, Response res) {
        ArrayList<MultiInvoiceDownload> invoices = new ArrayList<MultiInvoiceDownload>();
        for (MultiInvoice i : invoicesAll) {
            invoices.add(new MultiInvoiceDownload(i.filename, i.date));
        }

        return gson.toJson(invoices);
    }
    static String downloadInvoiceAll(Request req, Response res) {
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

    public MultiInvoiceDownload(String filename, long date) {
        this.filename = filename;
        this.date = date;
    }
}
