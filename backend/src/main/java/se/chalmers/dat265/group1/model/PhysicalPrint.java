package se.chalmers.dat265.group1.model;

public class PhysicalPrint extends DataModel {
    private int id;
    private int digitalPrintID;

    public PhysicalPrint() {
        id = -1;
        digitalPrintID = -1;
    }

    public PhysicalPrint(int id, int digitalPrintID) {
        this.id = id;
        this.digitalPrintID = digitalPrintID;
    }

    public int getId() {
        return id;
    }

    public int getDigitalPrintID() {
        return digitalPrintID;
    }

}
