package se.chalmers.dat265.group1.model;

public class MagicsData extends DataModel {
    private int id;
    private int digitalPrintID;
    private String path;

    public MagicsData() {
        id=-1;
        digitalPrintID = -1;
        path = "";
    }

    public MagicsData(int digitalPrintID, String path) {
        this.digitalPrintID = digitalPrintID;
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
