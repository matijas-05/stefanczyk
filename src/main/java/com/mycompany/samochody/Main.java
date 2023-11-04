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
        post("/add", (req, res) -> add(req, res));
    }

    static String add(Request req, Response res) {
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
