package com.mycompany.samochody;
import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(3000);
        get("/hello", (req, res) -> "Hello World");
    }
}
