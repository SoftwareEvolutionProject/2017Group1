package se.chalmers.dat265.group1.model;

public class PhysicalPrint implements DataModel {
    private int id;
    private int digitalPrintID;
    private int detailedMaterialId;
    private String slmPath;

    public int getId() {
        return id;
    }

    public int getDigitalPrintID() {
        return digitalPrintID;
    }

    public String getSlmPath() {
        return slmPath;
    }

    public int getDetailedMaterialId() {
        return detailedMaterialId;
    }
}
