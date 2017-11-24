package se.chalmers.dat265.group1.api.order;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.Order;
import se.chalmers.dat265.group1.model.dbEntities.OrderData;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;

import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.List;

public class OrderController extends ApiController implements OrderAPI {
    public OrderController(boolean debug) {
        super(debug);
    }

    private static final String DATE_FORMAT = "yyyy-MM-dd";

    @Override
    public List<Order> getAllOrders() {
        List<OrderData> orderDataList = orderDataRepository.getObjects();
        return getMerged(orderDataList);

    }

    /**
     * At the moments only returns the specific orderPart and not all the ordered parts in an order
     *
     * @param digitalPartID filter
     * @return orders with specific with specific part
     */
    @Override
    public List<Order> getAllOrdersWithDigitalPart(String digitalPartID) {
        List<OrderedPart> orderedPartList = orderedPartRepository.getObjects("digitalPartID=" + digitalPartID);
        List<Order> orders = new LinkedList<>();
        for (OrderedPart orderedPart : orderedPartList) {
            OrderData tempData = orderDataRepository.getObject(orderedPart.getDigitalPartID());
            boolean alreadyFound = false;
            for (Order order : orders) {
                if (tempData.getId() == order.getId()) {
                    alreadyFound = true;
                    break;
                }
            }
            if (!alreadyFound) {
                List<OrderedPart> singleList = new LinkedList<>();
                singleList.add(orderedPart);
                Order order = new Order(tempData, singleList);
                orders.add(order);
            }
        }
        return orders;
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
    public Order createNewOrder(Order order) throws InvalidDateFormatException {
        validateDate(order.getDate());
        int id = orderDataRepository.postObject(new OrderData(order)).getId();
        for (OrderedPart orderedPart : order.getOrderedParts()) {
            orderedPart.setOrderID(id);
            orderedPartRepository.postObject(orderedPart);
        }
        return getOrder(id + "");
    }

    @Override
    public Order updateOrder(String orderID, Order order) throws InvalidDateFormatException {
        checkIDs(orderID, order);
        validateDate(order.getDate());

        OrderData orderData = orderDataRepository.updateObject(new OrderData(order));

        List<OrderedPart> orderedInDb = orderedPartRepository.getObjects("orderID=" + orderID);
        List<OrderedPart> orderedNew = order.getOrderedParts();
        List<OrderedPart> toPostToDb = new LinkedList<>();

        for (OrderedPart newOrdered : orderedNew) {
            newOrdered.setOrderID(orderData.getId());
            boolean preExisting = false;
            for (OrderedPart dbOrderdPart : orderedInDb) {
                if (dbOrderdPart.getId() == newOrdered.getId()) {
                    orderedPartRepository.updateObject(newOrdered);
                    preExisting = true;
                    orderedInDb.remove(dbOrderdPart);
                    break;
                }
            }
            if (!preExisting) {
                toPostToDb.add(newOrdered);
            }
        }
        for (OrderedPart newOrdered : toPostToDb) {
            orderedPartRepository.postObject(newOrdered);
        }

        for (OrderedPart dbOrderdPart : orderedInDb) {
            orderedPartRepository.deleteObject(dbOrderdPart.getId());
        }
        return getOrder(orderID);
    }

    /**
     * Dates should be on format yyyy-MM-dd
     *
     * @param date
     */
    private void validateDate(String date) throws InvalidDateFormatException {
        //TODO
        SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT);
        try {
            format.parse(date);
        } catch (Exception e) {
            throw new InvalidDateFormatException(e);
        }

    }

    @Override
    public List<Order> getOrdersFromCustomer(String customerID) {
        List<OrderData> orderDataList = orderDataRepository.getObjects("customerID=" + customerID);
        return getMerged(orderDataList);
    }
}
