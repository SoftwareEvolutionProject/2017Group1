package se.chalmers.dat265.group1.model.dto;

import se.chalmers.dat265.group1.model.DigitalPrint;

import java.util.Map;

public class DigitalPrintMagics extends DigitalPrint {
    private String path = "";

    public DigitalPrintMagics(int id, String name, Map<String, Integer> magicsPartPairing, String path) {
        super(id, name, magicsPartPairing);
        this.path = path;

    }
}
