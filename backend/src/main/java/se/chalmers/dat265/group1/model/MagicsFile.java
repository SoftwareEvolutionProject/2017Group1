package se.chalmers.dat265.group1.model;

public class MagicsFile extends DataModel {
    int id;
    String name;
    int digitalPrintID;
    byte[] magicsFile;

    public MagicsFile() {
        id = -1;
        name = "";
        digitalPrintID = -1;
        magicsFile = new byte[0];
    }

    @Override
    public int getId() {
        return id;
    }
}
