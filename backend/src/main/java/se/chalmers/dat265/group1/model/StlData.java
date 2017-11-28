package se.chalmers.dat265.group1.model;

public class StlData extends DataModel {
    private int id;
    private int digitalPartID;
    private String path;

    public StlData() {
        id = -1;
        digitalPartID = -1;
        path = "";
    }

    public StlData(int digitalPartID, String path) {
        this.digitalPartID = digitalPartID;
        this.path = path;
    }

    @Override
    public int getId() {
        return id;
    }

    public String getPath() {
        return path;
    }
}
