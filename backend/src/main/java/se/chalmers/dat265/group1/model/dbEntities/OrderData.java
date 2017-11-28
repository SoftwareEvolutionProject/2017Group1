package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.Order;

import java.util.LinkedList;
import java.util.List;

public class OrderData extends DataModel{
        private int id;
        private int customerID;
        private String date;

        public OrderData() {
            id = -1;
            customerID = -1;
            date = "";
        }

    public OrderData(Order order) {
            id = order.getId();
            customerID = order.getCustomerID();
            date = order.getDate();
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
