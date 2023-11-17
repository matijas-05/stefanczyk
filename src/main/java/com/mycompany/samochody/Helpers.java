package com.mycompany.samochody;

class Color {
    public int r;
    public int g;
    public int b;

    public Color(int r, int g, int b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    public Color(String hex) {
        this.r = Integer.parseInt(hex.substring(1, 3), 16);
        this.g = Integer.parseInt(hex.substring(3, 5), 16);
        this.b = Integer.parseInt(hex.substring(5, 7), 16);
    }
}
