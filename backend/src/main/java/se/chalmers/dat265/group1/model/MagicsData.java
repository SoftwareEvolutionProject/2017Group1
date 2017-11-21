package se.chalmers.dat265.group1.model;

public class MagicsData extends DataModel {
    private int digitalPrintID;
    private String path;

    public MagicsData() {
        digitalPrintID = -1;
        path = "";
    }

    public MagicsData(int digitalPrintID, String path) {
        this.digitalPrintID = digitalPrintID;
        this.path = path;
    }

    @Override
    public int getId() {
        return digitalPrintID;
    }
}
