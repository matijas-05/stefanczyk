package com.mycompany.samochody;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class SingleInvoice {
    public Car car;
    public String path;

    public SingleInvoice(Car car) {
        this.car = car;
    }
    public void generate() throws DocumentException, FileNotFoundException, IOException {
        Document document = new Document();
        path = "invoices/" + car.id + ".pdf";

        try {
            PdfWriter.getInstance(document, new FileOutputStream(path));
        } catch (FileNotFoundException | DocumentException e) {
            throw e;
        }

        document.open();
        {
            Font font = FontFactory.getFont(FontFactory.HELVETICA, 16, BaseColor.BLACK);
            Font bigFont = FontFactory.getFont(FontFactory.HELVETICA, 24, BaseColor.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);

            Color color = new Color(car.color);
            Font colorFont = FontFactory.getFont(FontFactory.HELVETICA, 16,
                                                 new BaseColor(color.r, color.g, color.b));

            document.add(new Paragraph("FAKTURA dla: " + car.id, boldFont));
            document.add(new Paragraph("model: " + car.model, bigFont));
            document.add(new Paragraph("kolor: " + car.color, colorFont));
            document.add(new Paragraph("rok: " + car.year, font));
            document.add(new Paragraph("poduszka: kierowca -> " + car.airbags.driver, font));
            document.add(new Paragraph("poduszka: pasażer -> " + car.airbags.passenger, font));
            document.add(new Paragraph("poduszka: kanapa -> " + car.airbags.back, font));
            document.add(new Paragraph("poduszka: boczne -> " + car.airbags.side, font));

            Image image = Image.getInstance("images/" + car.images);
            image.scaleToFit(document.getPageSize());
            document.add(image);
        }
        document.close();
    }
}
