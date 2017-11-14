package se.chalmers.dat265.group1.model;


import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

import java.time.Instant;
import java.util.LinkedList;
import java.util.List;

public class Order extends DataModel {

    private int id;
    private int customerID;
    private String date;
    private List<OrderedPart> orderedParts = new LinkedList<>();



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

    public List<OrderedPart> getOrderedParts() {
        return orderedParts;
    }
}
