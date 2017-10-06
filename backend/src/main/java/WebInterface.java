import model.DigitalPart;
import model.Order;
import model.OrderedPart;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public interface WebInterface {
    String dummy(String text);
    //List<Order> getOrdersFromCustomer(int customerID);
    //List<OrderedPart> getOrderedPartsFromOrder(int orderID);
    DigitalPart getDigitalPart(int digitalPartID);
    List<DigitalPart> getDigitalParts();





}
