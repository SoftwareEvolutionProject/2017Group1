package api.customer;

import api.ApiController;
import model.*;
import storage.DBInterface;
import storage.PostgresSQLConnector;
import storage.repository.GenericRepository;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import javax.xml.crypto.Data;
import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public class CustomerController extends ApiController implements CustomerAPI {
    DBInterface dbConnector;
    GenericRepository<Customer> customerRepository;
    GenericRepository<Order> orderRepository;
    GenericRepository<OrderedPart> orderedPartRepository;
    GenericRepository<DigitalPart> digitalPartRepository;

    public CustomerController(boolean debug) {
        this.dbConnector = new PostgresSQLConnector(debug);
        customerRepository = new GenericRepository<>(Customer.class, dbConnector);
        orderRepository = new GenericRepository<>(Order.class, dbConnector);
        orderedPartRepository = new GenericRepository<>(OrderedPart.class, dbConnector);
        digitalPartRepository = new GenericRepository<>(DigitalPart.class, dbConnector);
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

        //TODO needs testing
        return digitalPartRepository.getObjects("customerID=" + customerID);
    }

    @Override
    public List<PhysicalPart> getPhysicalPartsFromCustomer(String customerID) {
        throw new NotImplementedException();
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
    public int deleteCustomer(String customerID) {
        throw new NotImplementedException();
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
        throw new NotImplementedException();
    }

    @Override
    public Order updateOrder(String orderID, Order order) {
        checkIDs(orderID, order);
        return orderRepository.updateObject(order);
    }

    @Override
    public OrderedPart createNewOrderDetail(String orderID, OrderedPart orderedPart) {
        throw new NotImplementedException();
    }

    @Override
    public OrderedPart updateOrderDetail(String orderID, String orderedPartID, OrderedPart orderedPart) {
        throw new NotImplementedException();
    }
}
