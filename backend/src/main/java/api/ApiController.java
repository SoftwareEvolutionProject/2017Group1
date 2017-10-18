package api;

import model.*;
import storage.DBInterface;
import storage.PostgresSQLConnector;
import storage.repository.GenericRepository;

public class ApiController {

    DBInterface dbConnector;
    protected GenericRepository<Customer> customerRepository;
    protected GenericRepository<Order> orderRepository;
    protected GenericRepository<OrderedPart> orderedPartRepository;
    protected GenericRepository<DigitalPart> digitalPartRepository;
    protected GenericRepository<PhysicalPart> physicalPartRepository;

    public ApiController(boolean debug) {
        this.dbConnector = new PostgresSQLConnector(debug);
        customerRepository = new GenericRepository<>(Customer.class, dbConnector);
        orderRepository = new GenericRepository<>(Order.class, dbConnector);
        orderedPartRepository = new GenericRepository<>(OrderedPart.class, dbConnector);
        digitalPartRepository = new GenericRepository<>(DigitalPart.class, dbConnector);
        physicalPartRepository = new GenericRepository<>(PhysicalPart.class, dbConnector);
    }

    protected void checkIDs(String id, DataModel object) {
        if (!id.equalsIgnoreCase(object.getId() + "")) {
            throw new IllegalArgumentException("IDs are not the same");
        }
    }
}
