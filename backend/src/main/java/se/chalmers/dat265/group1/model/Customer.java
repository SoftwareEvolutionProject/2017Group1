package se.chalmers.dat265.group1.model;

public class Customer implements DataModel{
    private int id;
    private String name, eMail;

    /* needed for Class.newInstance */
    public Customer(){
        this.id = 0;
        this.name = "";
        this.eMail = "";
    }

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
