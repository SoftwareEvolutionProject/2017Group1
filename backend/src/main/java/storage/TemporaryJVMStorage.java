package storage;

import model.Customer;

import java.util.LinkedList;
import java.util.List;

public class TemporaryJVMStorage implements Persistance {
    private List<Customer> customers = new LinkedList<>();

    @Override
    public List<Customer> getAllCustomers() {
        return customers;
    }

    @Override
    public Customer createNewCustomer(Customer temp) {
        int index = customers.size();
        Customer customer = new Customer(index, temp.getName(), temp.geteMail());
        customers.add(customer);
        return customer;
    }
}
