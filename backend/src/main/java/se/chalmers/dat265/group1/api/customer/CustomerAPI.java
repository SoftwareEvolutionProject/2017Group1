package se.chalmers.dat265.group1.api.customer;

import se.chalmers.dat265.group1.model.*;
import se.chalmers.dat265.group1.model.dbEntities.OrderData;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public interface CustomerAPI {

    List<Customer> getAllCustomers();

    Customer getCustomer(String customerID);

    List<DigitalPart> getDigitalPartsFromCustomer(String customerID);

    List<OrderData> getOrdersFromCustomer(String customerID);

    Customer createNewCustomer(Customer customer);

    Customer updateCustomer(String customerID, Customer customer);

    String deleteCustomer(String customerID);
}
