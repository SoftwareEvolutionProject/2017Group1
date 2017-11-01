import api.MaterialInterface;
import api.printing.PrintingController;
import api.printing.PrintingInterface;
import api.customer.CustomerAPI;
import api.digitalpart.DigitalPartAPI;
import api.digitalpart.DigitalPartController;
import api.customer.CustomerController;
import com.google.gson.Gson;
import model.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import storage.repository.GenericRepository;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    private static CustomerAPI ci;
    private static DigitalPartAPI dpi;
    private static MaterialInterface mi;
    private static PrintingInterface pi;
    private static final String CUSTOMERS = "/customers";
    private static final String CUSOMTER_ID = "/:customerID";
    private static final String ORDERS = "/orders";
    private static final String ORDER_ID = "/:orderID";
    private static final String DIGITALPRINT = "/digital-print";
    private static final String DIGITALPRINT_ID = "/:digitalPrint";
    private static final String DIGITALPART = "/digital-part";
    private static final String DIGITALPART_ID = "/:digitalPart";
    private static Gson gson = new Gson();
    private static boolean debug;


    public static void main(String[] args) {
        Log log = LogFactory.getLog(GenericRepository.class);
        boolean debug = prepareDebug(args);
        ci = new CustomerController(debug);
        dpi = new DigitalPartController(debug);
        long start = System.currentTimeMillis();
        log.info("STARTED ENDPIONT SETUP");
        log.info("STARTED ENDPIONT SETUP");
        WebApi.enableCORS("*", "*", "*");

        get("/hello", (req, res) -> "Hello World");

        setupCustomerInterface();
        setupPrintingInterface();
        setupOrderInterface();
        setupDigitalPartsInterface();

        log.info("ENDPOINT SETUP COMPLETE: " + (System.currentTimeMillis() - start) + " ms");
        log.info("SERVER RUNNING!");
    }

    private static void setupPrintingInterface() {
        pi = new PrintingController(debug);
        get(DIGITALPRINT, (request, response) -> pi.getAllDigitalPrints(), gson::toJson);
        get(DIGITALPRINT + DIGITALPRINT_ID, (request, response) -> pi.getDigitalPrint(request.params("id")), gson::toJson);
        get(DIGITALPRINT + DIGITALPRINT_ID, (request, response) -> pi.getDigitalPrint(request.params("id")), gson::toJson);
        post(DIGITALPRINT, ((request, response) -> pi.createDigitalPrint(gson.fromJson(request.body(), DigitalPrint.class))), gson::toJson);
    }

    private static void setupCustomerInterface() {
        ci = new CustomerController(debug);

        // Customers
        get(CUSTOMERS, (request, response) -> ci.getAllCustomers(), gson::toJson);
        get(CUSTOMERS + CUSOMTER_ID, ((request, response) -> ci.getCustomer(request.params("customerID"))), gson::toJson);
        get(CUSTOMERS + CUSOMTER_ID + "/orders", ((request, response) -> ci.getOrdersFromCustomer(request.params("customerID"))), gson::toJson);
        get(CUSTOMERS + CUSOMTER_ID + "/digitalparts", ((request, response) -> ci.getDigitalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        get(CUSTOMERS + CUSOMTER_ID + "/physicalparts", ((request, response) -> ci.getPhysicalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        post(CUSTOMERS, ((request, response) -> ci.createNewCustomer(gson.fromJson(request.body(), Customer.class))), gson::toJson);
        put(CUSTOMERS + CUSOMTER_ID, ((request, response) -> ci.updateCustomer(request.params("customerID"), gson.fromJson(request.body(), Customer.class))), gson::toJson);
        delete(CUSTOMERS + CUSOMTER_ID, ((request, response) -> ci.deleteCustomer(request.params("customerID"))), gson::toJson);
    }

    private static void setupDigitalPartsInterface() {
        //DigitalParts
        get(DIGITALPART, (request, response) -> dpi.getAllDigitalParts(), gson::toJson);
        get(DIGITALPART + DIGITALPART_ID, (request, response) -> dpi.getDigitalPart(request.params("digitalPartID")), gson::toJson);
        post(DIGITALPART, (request, response) -> dpi.createNewDigitalPart(gson.fromJson(request.body(), DigitalPart.class)), gson::toJson);
        put(DIGITALPART + DIGITALPART_ID, (request, response) -> dpi.updateDigitalPart(gson.fromJson(request.body(), DigitalPart.class)), gson::toJson);
    }

    private static void setupOrderInterface() {
        //Orders
        get(ORDERS, (request, response) -> ci.getAllOrders(), gson::toJson);
        get(ORDERS + ORDER_ID, (request, response) -> ci.getOrder(request.params("orderID")), gson::toJson);
        get(ORDERS + ORDER_ID + "/parts", (request, response) -> ci.getOrderedParts(request.params("orderID")), gson::toJson);
        post(ORDERS, ((request, response) -> ci.createNewOrder(gson.fromJson(request.body(), Order.class))), gson::toJson);
        put(ORDERS + ORDER_ID, ((request, response) -> ci.updateOrder(request.params("orderID"), gson.fromJson(request.body(), Order.class))), gson::toJson);
        post(ORDERS + ORDER_ID + "/parts", ((request, response) -> ci.createNewOrderedPart(request.params("orderID"), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
        put(ORDERS + ORDER_ID + "/parts/:orderedPartID", ((request, response) -> ci.updateOrderDetail(request.params("orderID"), request.params("orderedPartID"), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
    }

    // Enables CORS on requests. This method is an initialization method and should be called once.
    private static void enableCORS(final String origin, final String methods, final String headers) {

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            // Note: this may or may not be necessary in your particular application
            response.type("application/json");
        });
    }

    private static boolean prepareDebug(String[] arguments) {
        if (arguments.length > 0 && arguments[0].equalsIgnoreCase("debug")) {
            port(1337);
            return true;
        }
        return false;
    }
}
