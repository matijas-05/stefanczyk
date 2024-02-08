package com.mycompany.samochody.controller;

import com.mycompany.samochody.model.Photo;
import java.io.IOException;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.UUID;
import spark.Response;

public interface PhotoService {
    ArrayList<Photo> getPhotos(Response res) throws IOException;
    Photo getPhotoByCarId(Response res, UUID carId) throws NoSuchElementException;
}
