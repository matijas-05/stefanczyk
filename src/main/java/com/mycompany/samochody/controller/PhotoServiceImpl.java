package com.mycompany.samochody.controller;

import com.mycompany.samochody.model.Photo;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
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

    @Override
    public void renamePhoto(int id, String newName) throws NoSuchElementException, IOException {
        Photo photo = this.getPhotoById(id);
        String oldPath = photo.getPath();
        Path newPath = Path.of(oldPath).resolveSibling(newName);

        File file = new File(oldPath);
        if (!file.renameTo(new File(newPath.toString()))) {
            throw new IOException("Error renaming file with path "
                                  + "'" + oldPath + "'"
                                  + " to "
                                  + "'" + newPath + "'.");
        }

        photo.setName(newName);
        photo.setPath(newPath.toString());
    }
}
