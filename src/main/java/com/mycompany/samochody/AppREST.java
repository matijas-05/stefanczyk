package com.mycompany.samochody;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mycompany.samochody.controller.PhotoService;
import com.mycompany.samochody.controller.PhotoServiceImpl;
import com.mycompany.samochody.model.Photo;
import com.mycompany.samochody.response.ErrorResponse;
import java.io.IOException;
import java.io.OutputStream;
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
        get("/api/photos/name/:photoName", AppREST::getPhotoByName);
        delete("/api/photos/id/:photoId", AppREST::deletePhotoById);
        get("/api/photos/data/id/:photoId", AppREST::getPhotoDataById);
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
    private static String getPhotoByName(Request req, Response res) {
        res.type("application/json");

        String photoName = req.params(":photoName");
        try {
            Photo photo = photoService.getPhotoByName(photoName);
            return gson.toJson(photo);
        } catch (NoSuchElementException e) {
            return gson.toJson(new ErrorResponse(res, 404,
                                                 "Photo with name "
                                                     + "'" + photoName + "'"
                                                     + " not found."));
        }
    }
    private static String deletePhotoById(Request req, Response res) {
        res.type("application/json");

        int photoId = Integer.parseInt(req.params(":photoId"));
        try {
            photoService.deletePhotoById(photoId);
            res.status(204);
            return "";
        } catch (NoSuchElementException e) {
            return gson.toJson(new ErrorResponse(res, 404,
                                                 "Photo with id "
                                                     + "'" + photoId + "'"
                                                     + " not found."));
        } catch (IOException e) {
            return gson.toJson(new ErrorResponse(res, 500,
                                                 "Error deleting photo with id "
                                                     + "'" + photoId + "'."));
        }
    }
    private static String getPhotoDataById(Request req, Response res) {
        res.type("image/jpg");

        int photoId = Integer.parseInt(req.params(":photoId"));
        try {
            Photo photo = photoService.getPhotoById(photoId);

            try (OutputStream os = res.raw().getOutputStream()) {
                os.write(Files.readAllBytes(Path.of(photo.getPath())));
                res.status(200);
                return "";
            } catch (IOException e) {
                return gson.toJson(new ErrorResponse(res, 500,
                                                     "Error reading photo with id "
                                                         + "'" + photoId + "'."));
            }
        } catch (NoSuchElementException e) {
            return gson.toJson(new ErrorResponse(res, 404,
                                                 "Photo with id "
                                                     + "'" + photoId + "'"
                                                     + " not found."));
        }
    }
}
