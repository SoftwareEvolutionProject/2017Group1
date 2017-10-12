package model;

public class Customer {
    private int id;
    private String name, eMail;

    public Customer(int id, String name, String eMail) {
        this.id = id;
        this.name = name;
        this.eMail = eMail;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String geteMail() {
        return eMail;
    }
}
