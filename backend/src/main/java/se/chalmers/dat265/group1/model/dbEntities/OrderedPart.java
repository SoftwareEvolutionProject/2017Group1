package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;

public class OrderedPart extends DataModel {

    private int id;
    private int orderID;
    private int amountOrdererd;

    public OrderedPart() {
        id = -1;
        orderID = -1;
        amountOrdererd = -1;
    }

    public int getOrderID() {
        return orderID;
    }

    public int getAmountOrdererd() {
        return amountOrdererd;
    }

    @Override
    public int getId() {
        return id;
    }

    public void setID(int ID) {
        this.id = ID;
    }
}
