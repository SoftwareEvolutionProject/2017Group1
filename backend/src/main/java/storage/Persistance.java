package storage;

import model.Customer;
import model.DigitalPart;

import java.util.List;

public interface Persistance {


    List<Customer> getAllCustomers();

    Customer createNewCustomer(Customer customer);
}
