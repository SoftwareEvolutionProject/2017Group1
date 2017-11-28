package se.chalmers.dat265.group1.model;

public class SlmData extends DataModel{

    private int id;
    private int physicalPrintID;
    private String path;

    public SlmData() {
        id = -1;
        physicalPrintID = -1;
        path = "";
    }

    public SlmData(int physicalPrintID, String path) {
        this.physicalPrintID = physicalPrintID;
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
