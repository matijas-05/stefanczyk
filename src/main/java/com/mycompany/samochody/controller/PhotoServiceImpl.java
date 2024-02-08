package com.mycompany.samochody.controller;

import com.mycompany.samochody.Car;
import com.mycompany.samochody.model.Photo;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Stream;
import spark.Response;

public class PhotoServiceImpl implements PhotoService {
    private final ArrayList<Car> cars;

    public PhotoServiceImpl(ArrayList<Car> cars) {
        this.cars = cars;
    }

    @Override
    public ArrayList<Photo> getPhotos(Response res) throws IOException {
        try (Stream<Path> paths = Files.walk(Path.of("images"))) {
            ArrayList<Photo> photos =
                paths.filter(path -> path.toFile().isFile() && path.toString().endsWith(".jpg"))
                    .map(path -> new Photo(path.getFileName().toString(), path.toString()))
                    .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);

            return photos;
        }
    }

    @Override
    public Photo getPhotoByCarId(Response res, UUID carId) throws NoSuchElementException {
        Car car = cars.stream().filter(c -> c.id.equals(carId)).findFirst().get();
        Path path = Path.of("images", car.images.get(0));
        Photo photo = new Photo(path.getFileName().toString(), path.toString());

        return photo;
    }
}
