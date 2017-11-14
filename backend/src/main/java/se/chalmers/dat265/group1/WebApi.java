package se.chalmers.dat265.group1;

import se.chalmers.dat265.group1.api.MaterialInterface;
import se.chalmers.dat265.group1.api.order.OrderAPI;
import se.chalmers.dat265.group1.api.order.OrderController;
import se.chalmers.dat265.group1.api.physical.PhysicalAPI;
import se.chalmers.dat265.group1.api.physical.PhysicalsController;
import se.chalmers.dat265.group1.api.printing.PrintingController;
import se.chalmers.dat265.group1.api.printing.PrintingAPI;
import se.chalmers.dat265.group1.api.customer.CustomerAPI;
import se.chalmers.dat265.group1.api.digitalpart.DigitalPartAPI;
import se.chalmers.dat265.group1.api.digitalpart.DigitalPartController;
import se.chalmers.dat265.group1.api.customer.CustomerController;
import com.google.gson.Gson;
import se.chalmers.dat265.group1.model.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {

    private static CustomerAPI ci;
    private static OrderAPI oi;
    private static DigitalPartAPI dpi;
    private static MaterialInterface mi;
    private static PrintingAPI pi;
    private static PhysicalAPI phi;

    private static final String PARTS_URL = "/parts";
    private static final String ORDEREDPART_ID_URL = "/:orderedPartID";

    private static final String CUSTOMERS_URL = "/customers";
    private static final String CUSTOMER_ID_URL = "/:customerID";
    private static final String CUSTOMER_PARAM = "customerID";

    private static final String ORDERS_URL = "/orders";
    private static final String ORDER_ID_URL = "/:orderID";
    private static final String ORDER_ID_PARAM = "orderID";

    private static final String DIGITALPRINT_URL = "/digital-print";
    private static final String DIGITALPRINT_ID_URL = "/:digitalPrint";

    private static final String DIGITALPARTS_URL = "/digital-parts";
    private static final String DIGITALPART_ID_URL = "/:digitalPartID";
    private static final String DIGITALPART_ID_PARAM = "digitalPartID";

    private static final String PHYSICALPRINTS_URL = "/physical-prints";
    private static final String PHYSICALPRINT_ID_URL = "/:physicalPrint";
    private static final String PHYSICALPRINT_ID_PARAM = "physicalPrint";

    private static final String PHYSICALPARTS_URL = "/physical-parts";
    private static final String PHYSICALPART_ID_URL = "/:physicalPart";
    private static final String PHYSICALPART_ID_PARAM = "physicalPart";

    private static Gson gson = new Gson();
    private static boolean debug;


    public static void main(String[] args) {
        Log log = LogFactory.getLog(GenericRepository.class);
        boolean debug = prepareDebug(args);
        ci = new CustomerController(debug);
        dpi = new DigitalPartController(debug);
        oi = new OrderController(debug);

        long start = System.currentTimeMillis();
        log.info("STARTED ENDPIONT SETUP");
        log.info("STARTED ENDPIONT SETUP");
        WebApi.enableCORS("*", "*", "*");

        get("/hello", (req, res) -> "Hello World");

        setupCustomerInterface();
        setupPrintingInterface();
        setupOrderInterface();
        setupDigitalPartsInterface();
        setupPhysicalInterface();

        log.info("ENDPOINT SETUP COMPLETE: " + (System.currentTimeMillis() - start) + " ms");
        log.info("SERVER RUNNING!");
    }

    private static void setupPrintingInterface() {
        pi = new PrintingController(debug);
        get(DIGITALPRINT_URL, (request, response) -> pi.getAllDigitalPrints(), gson::toJson);
        get(DIGITALPRINT_URL + DIGITALPRINT_ID_URL, (request, response) -> pi.getDigitalPrint(request.params("id")), gson::toJson);
        get(DIGITALPRINT_URL + DIGITALPRINT_ID_URL, (request, response) -> pi.getDigitalPrint(request.params("id")), gson::toJson);
        post(DIGITALPRINT_URL, ((request, response) -> pi.createDigitalPrint(gson.fromJson(request.body(), DigitalPrint.class))), gson::toJson);
    }

    private static void setupCustomerInterface() {
        ci = new CustomerController(debug);

        // Customers
        get(CUSTOMERS_URL, (request, response) -> ci.getAllCustomers(), gson::toJson);
        get(CUSTOMERS_URL + CUSTOMER_ID_URL, ((request, response) -> ci.getCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
        get(CUSTOMERS_URL + CUSTOMER_ID_URL + DIGITALPARTS_URL, ((request, response) -> ci.getDigitalPartsFromCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
        get(CUSTOMERS_URL + CUSTOMER_ID_URL + PHYSICALPARTS_URL, ((request, response) -> ci.getPhysicalPartsFromCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
        post(CUSTOMERS_URL, ((request, response) -> ci.createNewCustomer(gson.fromJson(request.body(), Customer.class))), gson::toJson);
        put(CUSTOMERS_URL + CUSTOMER_ID_URL, ((request, response) -> ci.updateCustomer(request.params(CUSTOMER_PARAM), gson.fromJson(request.body(), Customer.class))), gson::toJson);
        delete(CUSTOMERS_URL + CUSTOMER_ID_URL, ((request, response) -> ci.deleteCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
    }

    private static void setupDigitalPartsInterface() {
        //DigitalParts
        get(DIGITALPARTS_URL, (request, response) -> dpi.getAllDigitalParts(), gson::toJson);
        get(DIGITALPARTS_URL + DIGITALPART_ID_URL, (request, response) -> dpi.getDigitalPart(request.params(DIGITALPART_ID_PARAM)), gson::toJson);
        post(DIGITALPARTS_URL, (request, response) -> dpi.createNewDigitalPart(gson.fromJson(request.body(), DigitalPart.class)), gson::toJson);
        put(DIGITALPARTS_URL + DIGITALPART_ID_URL, (request, response) -> dpi.updateDigitalPart(gson.fromJson(request.body(), DigitalPart.class)), gson::toJson);
    }

    private static void setupPhysicalInterface() {
        phi = new PhysicalsController(debug);
        //PhysicalParts
        get(PHYSICALPARTS_URL, (request, response) -> phi.getAllPhysicalParts(), gson::toJson);
        get(PHYSICALPARTS_URL + PHYSICALPART_ID_URL, (request, response) -> phi.getPhysicalPart(request.params(PHYSICALPART_ID_PARAM)), gson::toJson);
        post(PHYSICALPARTS_URL, (request, response) -> phi.createNewPhysicalPart(gson.fromJson(request.body(), PhysicalPart.class)), gson::toJson);
        put(PHYSICALPARTS_URL + PHYSICALPART_ID_URL, (request, response) -> phi.updatePhysicalPart(request.params(PHYSICALPART_ID_PARAM), gson.fromJson(request.body(), PhysicalPart.class)), gson::toJson);

        //PhysicalPrints
        get(PHYSICALPRINTS_URL, (request, response) -> phi.getAllPhysicalPrints(), gson::toJson);
        get(PHYSICALPRINTS_URL + PHYSICALPRINT_ID_URL, (request, response) -> phi.getPhysicalPrint(request.params(PHYSICALPRINT_ID_PARAM)), gson::toJson);
        post(PHYSICALPRINTS_URL, (request, response) -> phi.createNewPhysicalPrint(gson.fromJson(request.body(), PhysicalPrint.class)), gson::toJson);
        put(PHYSICALPRINTS_URL + PHYSICALPRINT_ID_URL, (request, response) -> phi.updatePhysicalPrint(request.params(PHYSICALPRINT_ID_PARAM), gson.fromJson(request.body(), PhysicalPrint.class)), gson::toJson);
    }

    private static void setupOrderInterface() {
        //Orders
        get(ORDERS_URL, (request, response) -> oi.getAllOrders(), gson::toJson);
        get(ORDERS_URL + ORDER_ID_URL, (request, response) -> oi.getOrder(request.params(ORDER_ID_PARAM)), gson::toJson);
        get(ORDERS_URL + ORDER_ID_URL + PARTS_URL, (request, response) -> oi.getOrderedParts(request.params(ORDER_ID_PARAM)), gson::toJson);
        post(ORDERS_URL, ((request, response) -> oi.createNewOrder(gson.fromJson(request.body(), Order.class))), gson::toJson);
        put(ORDERS_URL + ORDER_ID_URL, ((request, response) -> oi.updateOrder(request.params(ORDER_ID_PARAM), gson.fromJson(request.body(), Order.class))), gson::toJson);
        //post(ORDERS_URL + ORDER_ID_URL + PARTS_URL, ((request, response) -> oi.createNewOrderedPart(request.params(ORDER_ID_PARAM), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
        //put(ORDERS_URL + ORDER_ID_URL + PARTS_URL + ORDEREDPART_ID_URL, ((request, response) -> oi.updateOrderDetail(request.params(ORDER_ID_PARAM), request.params("orderedPartID"), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
        //get(CUSTOMERS_URL + CUSTOMER_ID_URL + ORDERS_URL, ((request, response) -> oi.getOrdersFromCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
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
