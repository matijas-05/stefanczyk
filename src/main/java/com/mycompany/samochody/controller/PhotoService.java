package com.mycompany.samochody.controller;

import com.mycompany.samochody.model.Photo;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import spark.Response;

public interface PhotoService {
    ArrayList<Photo> getPhotos();
    Photo getPhotoById(int id) throws NoSuchElementException;
}
