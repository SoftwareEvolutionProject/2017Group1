package se.chalmers.dat265.group1.model;


import se.chalmers.dat265.group1.model.dbEntities.OrderData;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

import java.time.Instant;
import java.util.LinkedList;
import java.util.List;

public class Order extends DataModel {

    private int id;
    private int customerID;
    private String date;
    private List<OrderedPart> orderedParts;


    public Order() {
        id = -1;
        customerID = -1;
        date = "";
        orderedParts = new LinkedList<>();
    }

    public Order(OrderData orderData, List<OrderedPart> orderedParts) {
        id = orderData.getId();
        customerID = orderData.getCustomerID();
        date = orderData.getDate();
        this.orderedParts = orderedParts;
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
