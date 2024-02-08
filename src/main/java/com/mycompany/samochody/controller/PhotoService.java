package com.mycompany.samochody.controller;

import spark.Request;
import spark.Response;

public interface PhotoService {
    String getPhotos(Request req, Response res);
}
