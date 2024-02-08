package com.mycompany.samochody;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mycompany.samochody.controller.PhotoService;
import com.mycompany.samochody.controller.PhotoServiceImpl;
import com.mycompany.samochody.model.Photo;
import com.mycompany.samochody.response.ErrorResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.UUID;
import spark.Request;
import spark.Response;

public class AppREST {
    private static final Gson gson =
        new GsonBuilder().excludeFieldsWithoutExposeAnnotation().setPrettyPrinting().create();

    private static final ArrayList<Car> cars = new ArrayList<>();

    private static final PhotoService photoService = new PhotoServiceImpl(cars);

    private static void seedData() {
        String[] models = {"Fiat", "Skoda", "Ford", "Opel", "Audi", "BMW", "Mercedes"};
        String[] hex = {"0", "1", "2", "3", "4", "5", "6", "7",
                        "8", "9", "a", "b", "c", "d", "e", "f"};
        Random rand = new Random();

        for (int i = 0; i < 10; i++) {
            String model = models[rand.nextInt(0, models.length)];
            String year = String.valueOf(rand.nextInt(1990, 2023));
            Airbags airbags = new Airbags(rand.nextBoolean(), rand.nextBoolean(),
                                          rand.nextBoolean(), rand.nextBoolean());
            String color = "#";
            for (int j = 0; j < 6; j++) {
                color += hex[rand.nextInt(0, hex.length)];
            }

            Car car = new Car(model, year, airbags, color);
            if (i == 0) {
                car.id = UUID.fromString("01d8366b-6aef-441a-a9c5-3c2b022cf34d");
            }

            car.images.add("car" + rand.nextInt(1, 3 + 1) + ".jpg");
            cars.add(car);
        }
    }
    public static void main(String[] args) {
        seedData();
        port(7777);

        get("/api/photos", AppREST::getPhotos);
        get("/api/photos/:carId", AppREST::getPhotoByCarId);
    }

    private static String getPhotos(Request req, Response res) {
        res.type("application/json");

        try {
            ArrayList<Photo> photos = photoService.getPhotos(res);
            return gson.toJson(photos);
        } catch (IOException e) {
            return gson.toJson(new ErrorResponse(res, 500, "Error reading photos directory."));
        }
    }
    private static String getPhotoByCarId(Request req, Response res) {
        res.type("application/json");

        UUID carId = UUID.fromString(req.params(":carId"));
        try {
            Photo photo = photoService.getPhotoByCarId(res, carId);
            return gson.toJson(photo);
        } catch (NoSuchElementException e) {
            return gson.toJson(new ErrorResponse(res, 404,
                                                 "Car with id "
                                                     + "'" + carId.toString() + "'"
                                                     + " not found."));
        }
    }
}
