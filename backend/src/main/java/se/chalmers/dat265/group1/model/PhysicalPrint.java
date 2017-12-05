package se.chalmers.dat265.group1.model;

public class PhysicalPrint extends DataModel {
    private int id;
    private int digitalPrintID;
    private int materialID;
    private int materialGrade;

    public PhysicalPrint() {
        id = -1;
        digitalPrintID = -1;
        materialGrade = -1;
        materialID = -1;
    }

    public PhysicalPrint(int id, int digitalPrintID, int materialID, int materialGrade) {
        this.id = id;
        this.digitalPrintID = digitalPrintID;
        this.materialID = materialID;
        this.materialGrade = materialGrade;
    }

    public int getId() {
        return id;
    }

    public int getDigitalPrintID() {
        return digitalPrintID;
    }

    public int getMaterialID() {
        return materialID;
    }

    public int getMaterialGrade() {
        return materialGrade;
    }
}
