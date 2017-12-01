package se.chalmers.dat265.group1.model;

public class MaterialGrade extends DataModel {
    private int id;
    private int materialID;
    private int reusedTimes;
    private double amount;

    @Override
    public int getId() {
        return id;
    }

    public MaterialGrade(int id, int reusedTimes, double amount) {
        this.id = id;
        this.reusedTimes = reusedTimes;
        this.amount = amount;
    }

    public MaterialGrade() {
        id = -1;
        materialID = -1;
        reusedTimes = -1;
        amount = -1;
    }

    public int getReusedTimes() {
        return reusedTimes;
    }

    public double getAmount() {
        return amount;
    }

    public void setMaterialID(int materialID) {
        this.materialID = materialID;
    }

    public int getMaterialID() {
        return materialID;
    }
}
