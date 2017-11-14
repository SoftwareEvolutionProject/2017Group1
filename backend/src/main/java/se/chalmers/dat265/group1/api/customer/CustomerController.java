package se.chalmers.dat265.group1.api.customer;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.*;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

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
}
