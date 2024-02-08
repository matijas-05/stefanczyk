package com.mycompany.samochody.controller;

import com.mycompany.samochody.model.Photo;
import java.util.ArrayList;
import java.util.NoSuchElementException;

public interface PhotoService {
    public ArrayList<Photo> getPhotos();
    public Photo getPhotoById(int id) throws NoSuchElementException;
    public Photo getPhotoByName(String name) throws NoSuchElementException;
}
