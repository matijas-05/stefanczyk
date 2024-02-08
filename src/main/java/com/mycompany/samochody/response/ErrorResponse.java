package com.mycompany.samochody.response;

import com.google.gson.annotations.Expose;
import spark.Response;

public class ErrorResponse {
    @Expose private final String message;

    public ErrorResponse(Response res, int statusCode, String message) {
        res.status(statusCode);
        this.message = message;
    }
}
