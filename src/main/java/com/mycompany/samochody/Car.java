package com.mycompany.samochody;

import java.util.Random;
import java.util.UUID;

class Car {
    public UUID id;
    public String model;
    public String year;
    public Airbags airbags;
    public String color;
    public String image;
    public int price;
    public int vat;
    public boolean hasSingleInvoice;

    public Car(String model, String year, Airbags airbags, String color) {
        this.id = UUID.randomUUID();
        this.model = model;
        this.year = year;
        this.airbags = airbags;
        this.color = color;

        Random random = new Random();
        this.image = "car" + random.nextInt(1, 3 + 1) + ".jpg";
        this.price = random.nextInt(0, 100_000);
        int[] vat = {0, 7, 22};
        this.vat = vat[random.nextInt(0, vat.length)];
    }
}
class Airbags {
    public boolean driver;
    public boolean passenger;
    public boolean back;
    public boolean side;

    public Airbags(boolean driver, boolean passenger, boolean back, boolean side) {
        this.driver = driver;
        this.passenger = passenger;
        this.back = back;
        this.side = side;
    }
}
