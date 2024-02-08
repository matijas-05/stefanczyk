package com.mycompany.samochody.controller;

import com.google.gson.Gson;
import com.mycompany.samochody.model.Photo;
import com.mycompany.samochody.response.ErrorResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.stream.Stream;
import spark.Request;
import spark.Response;

public class PhotoServiceImpl implements PhotoService {
    private final Gson gson;

    public PhotoServiceImpl(Gson gson) {
        this.gson = gson;
    }

    @Override
    public String getPhotos(Request req, Response res) {
        try {
            try (Stream<Path> paths = Files.walk(Path.of("images"))) {
                ArrayList<Photo> photos =
                    paths.filter(path -> path.toFile().isFile() && path.toString().endsWith(".jpg"))
                        .map(path -> new Photo(path.getFileName().toString(), path.toString()))
                        .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);

                return gson.toJson(photos);
            }
        } catch (IOException e) {
            return gson.toJson(new ErrorResponse(res, "Error reading photos directory."));
        }
    }
}
