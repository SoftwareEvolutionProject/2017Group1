import model.*;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public interface CustomerInterface {

    List<Customer> getAllCustomers();

    Customer getCustomer(String customerID);

    List<DigitalPart> getDigitalPartsFromCustomer(String customerID);

    List<PhysicalPart> getPhysicalPartsFromCustomer(String customerID);

    Customer createNewCustomer(Customer customer);

    Customer updateCustomer(Customer customer);

    List<Order> getOrdersFromCustomer(String customerID);

}
