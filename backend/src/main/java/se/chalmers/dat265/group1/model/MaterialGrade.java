package se.chalmers.dat265.group1.model;

public class MaterialGrade implements DataModel {
    private int id;
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

    public int getReusedTimes() {
        return reusedTimes;
    }

    public double getAmount() {
        return amount;
    }
}
