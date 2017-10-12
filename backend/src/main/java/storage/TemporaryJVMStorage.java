package storage;

import model.Customer;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.LinkedList;
import java.util.List;

public class TemporaryJVMStorage implements Persistance {
    private List<Customer> customers = new LinkedList<>();

    @Override
    public List<Customer> getAllCustomers() {
        return customers;
    }

    @Override
    public int createNewCustomer(Customer temp) {
        int index = customers.size();
        Customer customer = new Customer(index, temp.getName(), temp.geteMail());
        customers.add(customer);
        return customer.getId();
    }

    @Override
    public int deleteCustomer(String customerID) {
        throw new NotImplementedException();
    }
}
