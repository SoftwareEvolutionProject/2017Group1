package se.chalmers.dat265.group1.model;

public class PhysicalPartImage extends DataModel {
    int id;
    String name;
    int physicalPrintID;
    byte[] image;

    public PhysicalPartImage() {
        id = -1;
        name = "";
        physicalPrintID = -1;
        image = new byte[0];
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    @Override
    public int getId() {
        return 0;
    }
}
