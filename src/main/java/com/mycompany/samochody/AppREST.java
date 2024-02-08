package com.mycompany.samochody;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mycompany.samochody.controller.PhotoService;
import com.mycompany.samochody.controller.PhotoServiceImpl;
import com.mycompany.samochody.model.Photo;
import com.mycompany.samochody.response.ErrorResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;
import spark.Request;
import spark.Response;

public class AppREST {
    private static final Gson gson =
        new GsonBuilder().excludeFieldsWithoutExposeAnnotation().setPrettyPrinting().create();

    private static ArrayList<Photo> photos = new ArrayList<>();
    private static PhotoService photoService;

    private static void seedData() throws IOException {
        try (Stream<Path> paths = Files.walk(Path.of("images"))) {
            AtomicInteger i = new AtomicInteger(0); // Java XD

            AppREST.photos =
                paths.filter(path -> path.toFile().isFile() && path.toString().endsWith(".jpg"))
                    .map(path
                         -> new Photo(i.getAndIncrement(), path.getFileName().toString(),
                                      path.toString()))
                    .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
        }
    }
    public static void main(String[] args) throws IOException {
        try {
            seedData();
        } catch (IOException e) {
            throw new IOException("Error reading photos directory.");
        }

        photoService = new PhotoServiceImpl(photos);

        port(7777);

        get("/api/photos", AppREST::getPhotos);
        get("/api/photos/id/:photoId", AppREST::getPhotoById);
        get("/api/photos/name/:carName", AppREST::getPhotoById);
    }

    private static String getPhotos(Request req, Response res) {
        res.type("application/json");

        ArrayList<Photo> photos = photoService.getPhotos();
        return gson.toJson(photos);
    }
    private static String getPhotoById(Request req, Response res) {
        res.type("application/json");

        int photoId = Integer.parseInt(req.params(":photoId"));
        try {
            Photo photo = photoService.getPhotoById(photoId);
            return gson.toJson(photo);
        } catch (NoSuchElementException e) {
            return gson.toJson(new ErrorResponse(res, 404,
                                                 "Photo with id "
                                                     + "'" + photoId + "'"
                                                     + " not found."));
        }
    }
}
