package com.mycompany.samochody.model;

import com.google.gson.annotations.Expose;

public class Photo {
    @Expose private final String name;
    @Expose private final String path;

    public Photo(String name, String path) {
        this.name = name;
        this.path = path;
    }
}
