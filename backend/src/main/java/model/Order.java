package model;


import java.time.Instant;

public class Order {

    private int id;
    private int customerID;
    private Instant date;

    public int getId() {
        return id;
    }

    public int getCustomerID() {
        return customerID;
    }

    public Instant getDate() {
        return date;
    }
}
