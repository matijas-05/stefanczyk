package com.mycompany.samochody.model;

import com.google.gson.annotations.Expose;

public class RenamePhotoRequestBody {
    @Expose private final String newName;

    public RenamePhotoRequestBody(String newName) {
        this.newName = newName;
    }

    public String getNewName() {
        return newName;
    }
}
