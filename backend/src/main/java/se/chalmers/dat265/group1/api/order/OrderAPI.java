package se.chalmers.dat265.group1.api.order;

import se.chalmers.dat265.group1.model.Order;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

import java.util.List;

public interface OrderAPI {

    List<Order> getOrdersFromCustomer(String customerID);

    List<Order> getAllOrders();

    Order getOrder(String orderID);

    Order createNewOrder(Order order);

    Order updateOrder(String orderID, Order order);
}
