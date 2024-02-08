package com.mycompany.samochody;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mycompany.samochody.controller.PhotoService;
import com.mycompany.samochody.controller.PhotoServiceImpl;
import spark.Request;
import spark.Response;

public class AppREST {
    private static final Gson gson =
        new GsonBuilder().excludeFieldsWithoutExposeAnnotation().setPrettyPrinting().create();

    private static final PhotoService photoService = new PhotoServiceImpl(gson);

    public static void main(String[] args) {
        port(7777);

        get("/api/photos", AppREST::getPhotos);
    }

    static String getPhotos(Request req, Response res) {
        res.type("application/json");
        return photoService.getPhotos(req, res);
    }
}
