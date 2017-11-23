package se.chalmers.dat265.group1.model.dto;

import se.chalmers.dat265.group1.model.DigitalPrint;

import java.util.Map;

public class DigitalPrintMagics extends DigitalPrint {
    private String path = "";

    public DigitalPrintMagics(DigitalPrint parent, String path) {
        super(parent.getId(),parent.getName(), parent.getMagicsPartPairing());
        this.path = path;
    }
}
