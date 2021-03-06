package se.chalmers.dat265.group1.model;

public class DigitalPart extends DataModel {
    private int id;
    private int customerID;
    private String name;

    public DigitalPart() {
        this.id = -1;
        this.customerID = -1;
        this.name = "";
    }

    public DigitalPart(int id, int customerID, String name) {
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

}
