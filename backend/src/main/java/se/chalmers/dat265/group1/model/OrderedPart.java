package se.chalmers.dat265.group1.model;

public class OrderedPart  implements DataModel{

    private int id;
    private int orderID;
    private int amountOrdererd;


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
}
