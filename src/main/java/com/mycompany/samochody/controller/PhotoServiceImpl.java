package com.mycompany.samochody.controller;

import com.mycompany.samochody.model.Photo;
import java.io.File;
import java.io.IOException;
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

    @Override
    public Photo getPhotoByName(String name) throws NoSuchElementException {
        Photo photo = photos.stream().filter(p -> p.getName().equals(name)).findFirst().get();
        return photo;
    }

    @Override
    public void deletePhotoById(int id) throws NoSuchElementException, IOException {
        String path = this.getPhotoById(id).getPath();
        File file = new File(path);

        if (!file.delete()) {
            throw new IOException("Error deleting file with path "
                                  + "'" + path + "'.");
        }
    }
}
