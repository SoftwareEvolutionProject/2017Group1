package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;

public class DigitalPrintData extends DataModel {

    private int id;
    private String magicsPath;

    public DigitalPrintData() {
        id = -1;
        magicsPath = "";
    }

    public DigitalPrintData(int id, String magicsPath) {
        super();
        this.id = id;
        this.magicsPath = magicsPath;
    }

    public DigitalPrintData(String magicsPath) {
        this(-1, magicsPath);
    }

    public int getId() {
        return id;
    }

    public String getMagicsPath() {
        return magicsPath;
    }
}