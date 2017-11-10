package se.chalmers.dat265.group1.model;


import java.time.Instant;

public class Order extends DataModel {

    private int id;
    private int customerID;
    private String date;

    public Order() {
        id = -1;
        customerID = -1;
        date = "";
    }

    public int getId() {
        return id;
    }

    public int getCustomerID() {
        return customerID;
    }

    public String getDate() {
        return date;
    }
}
