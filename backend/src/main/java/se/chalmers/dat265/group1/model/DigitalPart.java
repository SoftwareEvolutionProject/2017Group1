package se.chalmers.dat265.group1.model;

public class DigitalPart extends DataModel {
    private int id;
    private int customerID;
    private String name;
    private String path;

    public DigitalPart() {
        this.id = -1;
        this.customerID = -1;
        this.name = "";
        this.path = "";
    }

    public DigitalPart(int id, int customerID, String name, String stlPath, String cadPath) {
        this.id = id;
        this.customerID = customerID;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getCustomerID() {
        return customerID;
    }

    public void setStlPath(String stlPath) {
        this.path = stlPath;
    }
}
