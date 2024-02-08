package com.mycompany.samochody.model;

import com.google.gson.annotations.Expose;

public class Photo {
    @Expose private int id;
    @Expose private final String name;
    @Expose private final String path;

    public Photo(int id, String name, String path) {
        this.id = id;
        this.name = name;
        this.path = path;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }
}
