package com.mycompany.samochody.controller;

import com.mycompany.samochody.model.Photo;
import java.util.ArrayList;
import java.util.NoSuchElementException;

public class PhotoServiceImpl implements PhotoService {
    private final ArrayList<Photo> photos;

    public PhotoServiceImpl(ArrayList<Photo> photos) {
        this.photos = photos;
    }

    @Override
    public ArrayList<Photo> getPhotos() {
        return photos;
    }

    @Override
    public Photo getPhotoById(int id) throws NoSuchElementException {
        Photo photo = photos.stream().filter(p -> p.getId() == id).findFirst().get();
        return photo;
    }
}
