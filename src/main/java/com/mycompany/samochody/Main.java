package com.mycompany.samochody;
import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.util.ArrayList;
import java.util.UUID;
import spark.Request;
import spark.Response;

public class Main {
    static ArrayList<Car> cars = new ArrayList<Car>();

    public static void main(String[] args) {
        port(3000);
        staticFiles.externalLocation("src/main/resources/public");

        get("/car", (req, res) -> getCars(req, res));
        post("/car", (req, res) -> addCar(req, res));
        delete("/car/:id", (req, res) -> deleteCar(req, res));
        patch("/car/:id", (req, res) -> updateCar(req, res));
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
        UUID id = UUID.fromString(req.params(":id"));
        cars.removeIf(car -> car.id.equals(id));

        res.status(200);
        return "";
    }
    static String updateCar(Request req, Response res) {
        UUID id = UUID.fromString(req.params(":id"));
        Car car =
            cars.stream().filter(c -> c.id.equals(id)).findFirst().orElse(null);
        if (car == null) {
            res.status(404);
            return "";
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
}

class Car {
    public UUID id;
    public String model;
    public String year;
    public Airbags airbags;
    public String color;
}
class Airbags {
    public boolean driver;
    public boolean passenger;
    public boolean back;
    public boolean side;
}
