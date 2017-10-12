import model.Customer;
import model.DigitalPart;
import model.Order;
import model.PhysicalPart;
import storage.Persistance;
import storage.PostgresSQLConnector;
import storage.TemporaryJVMStorage;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public class WebInterfaceImpl implements WebInterface {
    Persistance dbConnector = new PostgresSQLConnector();

    @Override
    public List<Customer> getAllCustomers() {
        return dbConnector.getAllCustomers();
    }

    @Override
    public Customer getCustomer(String customerID) {
        throw new NotImplementedException();
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
        return dbConnector.createNewCustomer(customer);
    }

    @Override
    public Customer updateCustomer(Customer customer) {
        throw new NotImplementedException();
    }

    @Override
    public List<Order> getOrdersFromCustomer(String customerID) {
        throw new NotImplementedException();
    }
}
