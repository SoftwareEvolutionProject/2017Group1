import model.Customer;
import model.DigitalPart;
import model.Order;
import model.PhysicalPart;
import storage.DBInterface;
import storage.PostgresSQLConnector;
import storage.repository.GenericRepository;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public class CustomerController implements CustomerInterface {
    DBInterface dbConnector = new PostgresSQLConnector();
    GenericRepository<Customer> customerGenericRepository = new GenericRepository<Customer>(Customer.class,dbConnector);

    @Override
    public List<Customer> getAllCustomers() {
        return customerGenericRepository.getObjects();
    }

    @Override
    public Customer getCustomer(String customerID) {
        return customerGenericRepository.getObject(Integer.parseInt(customerID));
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
    public int createNewCustomer(Customer customer) {
        return customerGenericRepository.postObject(customer).getId();
    }

    @Override
    public Customer updateCustomer(Customer customer) {
        return customerGenericRepository.updateObject(customer);
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
}
