package com.mycompany.samochody;
import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;
import spark.Request;
import spark.Response;

public class Main {
    static ArrayList<Car> cars = new ArrayList<Car>();

    public static void main(String[] args) {
        cars.add(new Car("Fiat", "1999", new Airbags(true, true, false, false), "#ff0000"));
        port(3000);
        staticFiles.externalLocation("src/main/resources/public");

        get("/car", (req, res) -> getCars(req, res));
        post("/car", (req, res) -> addCar(req, res));
        delete("/car/id", (req, res) -> deleteCar(req, res));
        patch("/car/id", (req, res) -> updateCar(req, res));

        post("/invoice/id", (req, res) -> generateInvoice(req, res));
    }

    static String getCars(Request req, Response res) {
        res.type("application/json");
        Gson gson = new Gson();
        return gson.toJson(cars);
    }
    static String addCar(Request req, Response res) {
        try {
            Gson gson = new Gson();
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
        UUID id = UUID.fromString(req.params("id"));
        cars.removeIf(car -> car.id.equals(id));

        res.status(200);
        return "";
    }
    static String updateCar(Request req, Response res) {
        UUID id = UUID.fromString(req.params("id"));
        Car car = cars.stream().filter(c -> c.id.equals(id)).findFirst().orElse(null);
        if (car == null) {
            res.status(404);
            return "Car not found";
        }

        try {
            Gson gson = new Gson();
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

    static String generateInvoice(Request req, Response res) {
        UUID id = UUID.fromString(req.params("id"));
        Car car = cars.stream().filter(c -> c.id.equals(id)).findFirst().orElse(null);
        if (car == null) {
            res.status(404);
            return "Car with id '" + id + "' not found";
        }

        Document document = new Document();
        try {
            PdfWriter.getInstance(document, new FileOutputStream("invoices/" + car.id + ".pdf"));
        } catch (FileNotFoundException | DocumentException e) {
            res.status(500);
            return e.getMessage();
        }

        document.open();
        {
            Font font = FontFactory.getFont(FontFactory.HELVETICA, 16, BaseColor.BLACK);
            Font bigFont = FontFactory.getFont(FontFactory.HELVETICA, 24, BaseColor.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);

            Color color = new Color(car.color);
            Font colorFont = FontFactory.getFont(FontFactory.HELVETICA, 16,
                                                 new BaseColor(color.r, color.g, color.b));

            try {
                document.add(new Paragraph("FAKTURA dla: " + car.id, boldFont));
                document.add(new Paragraph("model: " + car.model, bigFont));
                document.add(new Paragraph("kolor: " + car.color, colorFont));
                document.add(new Paragraph("rok: " + car.year, font));
                document.add(new Paragraph("poduszka: kierowca -> " + car.airbags.driver, font));
                document.add(new Paragraph("poduszka: pasażer -> " + car.airbags.passenger, font));
                document.add(new Paragraph("poduszka: kanapa -> " + car.airbags.back, font));
                document.add(new Paragraph("poduszka: boczne -> " + car.airbags.side, font));
                try {
                    document.add(Image.getInstance("car-image.png"));
                } catch (IOException e) {
                    res.status(500);
                    return e.getMessage();
                }
            } catch (DocumentException e) {
                res.status(500);
                return e.getMessage();
            }
        }
        document.close();

        car.hasInvoice = true;

        res.status(201);
        return "";
    }
}

class Car {
    public UUID id;
    public String model;
    public String year;
    public Airbags airbags;
    public String color;
    public boolean hasInvoice;

    public Car(String model, String year, Airbags airbags, String color) {
        this.id = UUID.randomUUID();
        this.model = model;
        this.year = year;
        this.airbags = airbags;
        this.color = color;
    }
}
class Airbags {
    public boolean driver;
    public boolean passenger;
    public boolean back;
    public boolean side;

    public Airbags(boolean driver, boolean passenger, boolean back, boolean side) {
        this.driver = driver;
        this.passenger = passenger;
        this.back = back;
        this.side = side;
    }
}

class Color {
    public int r;
    public int g;
    public int b;

    public Color(int r, int g, int b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    public Color(String hex) {
        this.r = Integer.parseInt(hex.substring(1, 3), 16);
        this.g = Integer.parseInt(hex.substring(3, 5), 16);
        this.b = Integer.parseInt(hex.substring(5, 7), 16);
    }
}
