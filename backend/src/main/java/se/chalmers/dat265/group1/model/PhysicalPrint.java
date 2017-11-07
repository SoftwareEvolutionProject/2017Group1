package se.chalmers.dat265.group1.model;

public class PhysicalPrint extends DataModel {
    private int id;
    private int digitalPrintID;
    private String slmPath;

    public PhysicalPrint() {
        id = -1;
        digitalPrintID = -1;
        slmPath = "";
    }

    public int getId() {
        return id;
    }

    public int getDigitalPrintID() {
        return digitalPrintID;
    }

    public String getSlmPath() {
        return slmPath;
    }

}
