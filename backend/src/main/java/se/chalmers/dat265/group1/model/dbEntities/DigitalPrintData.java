package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;

public class DigitalPrintData extends DataModel {

    private int id;
    private String name;

    public DigitalPrintData() {
        id = -1;
        name = "";
    }

    public DigitalPrintData(int id, String name) {
        super();
        this.id = id;
        this.name = name;
    }

    public DigitalPrintData(String name) {
        this(-1, name);
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}