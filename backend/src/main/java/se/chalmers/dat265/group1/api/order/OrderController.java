package se.chalmers.dat265.group1.api.order;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.Order;
import se.chalmers.dat265.group1.model.dbEntities.OrderData;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

import java.util.LinkedList;
import java.util.List;

public class OrderController extends ApiController implements OrderAPI {
    public OrderController(boolean debug) {
        super(debug);
    }

    @Override
    public List<Order> getAllOrders() {
        List<OrderData> orderDataList = orderDataRepository.getObjects();
        return getMerged(orderDataList);

    }

    private List<Order> getMerged(List<OrderData> orderDataList) {
        List<Order> orders = new LinkedList<>();
        for (OrderData orderData : orderDataList) {
            Order temp = new Order(orderData, orderedPartRepository.getObjects("orderID=" + orderData.getId()));
            orders.add(temp);
        }
        return orders;
    }

    @Override
    public Order getOrder(String orderID) {
        OrderData orderData = orderDataRepository.getObject(Integer.parseInt(orderID));
        return new Order(orderData, orderedPartRepository.getObjects("orderID=" + orderData.getId()));
    }

    @Override
    public Order createNewOrder(Order order) {
        int id = orderDataRepository.postObject(new OrderData(order)).getId();
        for (OrderedPart orderedPart : order.getOrderedParts()) {
            orderedPart.setID(id);
            orderedPartRepository.postObject(orderedPart);
        }
        return getOrder(id + "");
    }

    @Override
    public List<OrderedPart> getOrderedParts(String orderID) {
        return orderedPartRepository.getObjects("orderID=" + orderID);
    }

    @Override
    public Order updateOrder(String orderID, Order order) {
        checkIDs(orderID, order);

        OrderData orderData = orderDataRepository.updateObject(new OrderData(order));

        List<OrderedPart> orderedInDb = orderedPartRepository.getObjects("orderID=" + orderID);
        List<OrderedPart> orderedNew = order.getOrderedParts();

        for (OrderedPart newOrdered : orderedNew) {
            for (OrderedPart dbOrderdPart : orderedInDb) {
                if (dbOrderdPart.getId() == newOrdered.getId()) {
                    orderedPartRepository.updateObject(newOrdered);
                    orderedNew.remove(newOrdered);
                    orderedInDb.remove(dbOrderdPart);
                }
            }
        }
        for (OrderedPart newOrdered : orderedNew) {
            orderedPartRepository.postObject(newOrdered);
        }

        for (OrderedPart dbOrderdPart : orderedInDb) {
            orderedPartRepository.deleteObject(dbOrderdPart.getId());
        }
        return getOrder(orderID);
    }

    @Override
    public OrderedPart createNewOrderedPart(String orderID, OrderedPart orderedPart) {
        return orderedPartRepository.postObject(orderedPart);
    }

    @Override
    public OrderedPart updateOrderDetail(String orderID, String orderedPartID, OrderedPart orderedPart) {
        checkIDs(orderedPartID, orderedPart);
        return orderedPartRepository.updateObject(orderedPart);
    }

    @Override
    public List<Order> getOrdersFromCustomer(String customerID) {
        List<OrderData> orderDataList = orderDataRepository.getObjects("customerID=" + customerID);
        return getMerged(orderDataList);
    }
}
