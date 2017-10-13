package api.customer;

import model.*;
import storage.DBInterface;
import storage.PostgresSQLConnector;
import storage.repository.GenericRepository;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public class CustomerController implements CustomerAPI {
    DBInterface dbConnector = new PostgresSQLConnector();
    GenericRepository<Customer> customerRepository = new GenericRepository<Customer>(Customer.class,dbConnector);

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
        throw new NotImplementedException();
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
    public Customer updateCustomer(Customer customer) {
        return customerRepository.updateObject(customer);
    }

    @Override
    public int deleteCustomer(String customerID) {throw new NotImplementedException();}

    @Override
    public List<Order> getOrdersFromCustomer(String customerID) {
        throw new NotImplementedException();
    }

    @Override
    public List<Order> getAllOrders() {
        throw new NotImplementedException();
    }

    @Override
    public Order getOrder(String orderID) {
        throw new NotImplementedException();
    }

    @Override
    public Order createNewOrder(Order order) {
        throw new NotImplementedException();
    }

    @Override
    public List<OrderedPart> getOrderedParts(String orderID) {
        throw new NotImplementedException();
    }

    @Override
    public Order updateOrder(String orderID, Order order) {
        throw new NotImplementedException();
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
