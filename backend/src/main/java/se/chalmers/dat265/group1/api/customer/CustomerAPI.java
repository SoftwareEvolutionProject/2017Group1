package se.chalmers.dat265.group1.api.customer;

import se.chalmers.dat265.group1.model.*;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public interface CustomerAPI {

    List<Customer> getAllCustomers();

    Customer getCustomer(String customerID);

    List<DigitalPart> getDigitalPartsFromCustomer(String customerID);

    List<PhysicalPart> getPhysicalPartsFromCustomer(String customerID);

    Customer createNewCustomer(Customer customer);

    Customer updateCustomer(String customerID, Customer customer);

    String deleteCustomer(String customerID);

    List<Order> getOrdersFromCustomer(String customerID);

    List<Order> getAllOrders();

    Order getOrder(String orderID);

    Order createNewOrder(Order order);

    List<OrderedPart> getOrderedParts(String orderID);

    Order updateOrder(String orderID, Order order);

    OrderedPart createNewOrderedPart(String orderID, OrderedPart orderedPart);

    OrderedPart updateOrderDetail(String orderID, String orderedPartID, OrderedPart orderedPart);
}
