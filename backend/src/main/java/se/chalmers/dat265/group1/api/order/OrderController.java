package se.chalmers.dat265.group1.api.order;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.Order;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

import java.util.List;

public class OrderController extends ApiController implements OrderAPI {
    public OrderController(boolean debug) {
        super(debug);
    }

    @Override
    public List<Order> getOrdersFromCustomer(String customerID) {
        return orderRepository.getObjects("customerID=" + customerID);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.getObjects();

    }

    @Override
    public Order getOrder(String orderID) {
        return orderRepository.getObject(Integer.parseInt(orderID));
    }

    @Override
    public Order createNewOrder(Order order) {
        return orderRepository.postObject(order);
    }

    @Override
    public List<OrderedPart> getOrderedParts(String orderID) {
        return orderedPartRepository.getObjects("orderID="+orderID);
    }

    @Override
    public Order updateOrder(String orderID, Order order) {
        checkIDs(orderID, order);
        return orderRepository.updateObject(order);
    }

    @Override
    public OrderedPart createNewOrderedPart(String orderID, OrderedPart orderedPart) {
        return orderedPartRepository.postObject(orderedPart);
    }

    @Override
    public OrderedPart updateOrderDetail(String orderID, String orderedPartID, OrderedPart orderedPart) {
        checkIDs(orderedPartID,orderedPart);
        return orderedPartRepository.updateObject(orderedPart);
    }
}
