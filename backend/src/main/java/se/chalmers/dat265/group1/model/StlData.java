package se.chalmers.dat265.group1.model;

public class StlData extends DataModel {
    private int digitalPartID;
    private String path;

    public StlData() {
        digitalPartID = -1;
        path = "";
    }

    public StlData(int digitalPartID, String path) {
        this.digitalPartID = digitalPartID;
        this.path = path;
    }

    @Override
    public int getId() {
        return digitalPartID;
    }
}
