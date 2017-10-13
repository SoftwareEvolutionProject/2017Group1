package storage;

import model.Customer;

import java.util.List;

public interface Persistance {


    List<Customer> getAllCustomers();

    int createNewCustomer(Customer customer);

    int deleteCustomer(String customerID);
}
