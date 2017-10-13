package model;

public class DigitalPart   implements DataModel {
    private int id;
    private int customerID;
    private String name;
    private String stlPath;
    private String cadPath;

    public DigitalPart(int id, String stlPath, String cadPath) {
        this.id = id;
        this.stlPath = stlPath;
        this.cadPath = cadPath;
    }

    public boolean stlPathExists(){
        return stlPath == null || stlPath.isEmpty();
    }

    public int getId() {
        return id;
    }

    public String getStlPath() {
        return stlPath;
    }

    public String getCadPath() {
        return cadPath;
    }

    public String getName() {
        return name;
    }

    public int getCustomerID() {
        return customerID;
    }
}
