package com.mycompany.samochody;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;

public class MultiInvoice {
    public String title;
    public String seller;
    public String buyer;
    public ArrayList<Car> cars;
    public long date;
    public String metadata;

    public String filename;

    public MultiInvoice(String title, String seller, String buyer, ArrayList<Car> cars,
                        String metadata) {
        this.title = title;
        this.seller = seller;
        this.buyer = buyer;
        this.cars = cars;
        this.date = System.currentTimeMillis();
        this.metadata = metadata;
    }

    public void generate() throws DocumentException, FileNotFoundException, IOException {
        Document document = new Document();
        filename = "invoice_" + System.currentTimeMillis() + ".pdf";
        try {
            PdfWriter.getInstance(document, new FileOutputStream("invoices/" + filename));
        } catch (FileNotFoundException | DocumentException e) {
            throw e;
        }

        document.open();
        {
            // Font font = FontFactory.getFont(FontFactory.HELVETICA, 16, BaseColor.BLACK);
            // Font bigFont = FontFactory.getFont(FontFactory.HELVETICA, 24, BaseColor.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
            Font redBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.RED);
            Font bigBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BaseColor.BLACK);

            LocalDateTime date = LocalDateTime.now();
            document.add(new Paragraph("FAKTURA: VAT/" + date.getYear() + "/" +
                                           date.getMonthValue() + "/" + date.getDayOfMonth() + "/" +
                                           date.getHour() + "/" + date.getMinute() + "/" +
                                           date.getSecond(),
                                       bigBoldFont));

            document.add(new Paragraph("Nabywca: " + buyer, boldFont));
            document.add(new Paragraph("Sprzedawca: " + seller, boldFont));
            document.add(new Paragraph(title, redBoldFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.addCell("lp");
            table.addCell("rok");
            table.addCell("cena");
            table.addCell("vat");
            table.addCell("wartość");

            DecimalFormat df = new DecimalFormat("#.00");
            double total = 0;

            for (int i = 0; i < cars.size(); i++) {
                Car car = cars.get(i);

                table.addCell(String.valueOf(i + 1));
                table.addCell(car.year);
                table.addCell(String.valueOf(df.format(car.price)));
                table.addCell(String.valueOf(car.vat) + "%");

                double value = car.price * ((100 + car.vat) / 100.0);
                table.addCell(String.valueOf(df.format(value)));
                total += value;
            }

            document.add(table);
            document.add(new Paragraph("DO ZAPŁATY: " + df.format(total) + " PLN", bigBoldFont));
        }
        document.close();
    }
}
