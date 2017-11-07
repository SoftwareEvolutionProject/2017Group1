package se.chalmers.dat265.group1.api.customer;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.*;
import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public class CustomerController extends ApiController implements CustomerAPI {


    public CustomerController(boolean debug) {
        super(debug);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.getObjects();
    }

    @Override
    public Customer getCustomer(String customerID) {
        return customerRepository.getObject(Integer.parseInt(customerID));
    }

    @Override
    public List<DigitalPart> getDigitalPartsFromCustomer(String customerID) {
        return digitalPartRepository.getObjects("customerID=" + customerID);
    }

    @Override
    public List<PhysicalPart> getPhysicalPartsFromCustomer(String customerID) {
        return physicalPartRepository.getObjects("customerID= " + customerID);
    }

    @Override
    public Customer createNewCustomer(Customer customer) {
        return customerRepository.postObject(customer);
    }

    @Override
    public Customer updateCustomer(String customerID, Customer customer) {
        checkIDs(customerID, customer);
        return customerRepository.updateObject(customer);
    }

    @Override
    public String deleteCustomer(String customerID) {
        customerRepository.deleteObject(Integer.parseInt(customerID));
        return customerID;
    }

    @Override
    public List<Order> getOrdersFromCustomer(String customerID) {
        return orderRepository.getObjects("customerID=" + customerID);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.getObjects();

    }

    @Override
    public Order getOrder(String orderID) {
        return orderRepository.getObject(Integer.parseInt(orderID));
    }

    @Override
    public Order createNewOrder(Order order) {
        return orderRepository.postObject(order);
    }

    @Override
    public List<OrderedPart> getOrderedParts(String orderID) {
        return orderedPartRepository.getObjects("orderID="+orderID);
    }

    @Override
    public Order updateOrder(String orderID, Order order) {
        checkIDs(orderID, order);
        return orderRepository.updateObject(order);
    }

    @Override
    public OrderedPart createNewOrderedPart(String orderID, OrderedPart orderedPart) {
        return orderedPartRepository.postObject(orderedPart);
    }

    @Override
    public OrderedPart updateOrderDetail(String orderID, String orderedPartID, OrderedPart orderedPart) {
        checkIDs(orderedPartID,orderedPart);
        return orderedPartRepository.updateObject(orderedPart);
    }
}
