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
import se.chalmers.dat265.group1.storage.repository.GenericRepository;


import java.io.File;

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

    private static final String PARAM_URL_PREFIX = "/:";

    private static final String CUSTOMERS_URL = "/customers";
    private static final String CUSTOMER_PARAM = "customerID";
    private static final String CUSTOMER_ID_URL = PARAM_URL_PREFIX + CUSTOMER_PARAM;

    private static final String ORDERS_URL = "/orders";
    private static final String ORDER_ID_PARAM = "orderID";
    private static final String ORDER_ID_URL = PARAM_URL_PREFIX + ORDER_ID_PARAM;

    private static final String DIGITALPRINT_URL = "/digital-prints";
    private static final String DIGITALPRINT_ID_PARAM = "digitalPrintID";
    private static final String DIGITALPRINT_ID_URL = PARAM_URL_PREFIX + DIGITALPRINT_ID_PARAM;

    private static final String DIGITALPARTS_URL = "/digital-parts";
    private static final String DIGITALPART_ID_PARAM = "digitalPartID";
    private static final String DIGITALPART_ID_URL = PARAM_URL_PREFIX + DIGITALPART_ID_PARAM;

    private static final String PHYSICALPRINTS_URL = "/physical-prints";
    private static final String PHYSICALPRINT_ID_PARAM = "physicalPrintID";
    private static final String PHYSICALPRINT_ID_URL = PARAM_URL_PREFIX + PHYSICALPRINT_ID_PARAM;

    private static final String PHYSICALPARTS_URL = "/physical-parts";
    private static final String PHYSICALPART_ID_PARAM = "physicalPartID";
    private static final String PHYSICALPART_ID_URL = PARAM_URL_PREFIX + PHYSICALPART_ID_PARAM;

    private static File storageFolder;

    private static Gson gson = new Gson();
    private static boolean debug;


    public static void main(String[] args) {
        storageFolder = new File("storage");
        Log log = LogFactory.getLog(GenericRepository.class);
        boolean debug = prepareDebug(args);
        ci = new CustomerController(debug);
        dpi = new DigitalPartController(debug);
        oi = new OrderController(debug);
        pi = new PrintingController(debug);
        phi = new PhysicalsController(debug);

        long start = System.currentTimeMillis();
        log.info("STARTED ENDPIONT SETUP");

        //Dynamic API of static files.... hehehe
        log.info(storageFolder.getAbsolutePath());
        externalStaticFileLocation(storageFolder.getAbsolutePath());

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

        get(DIGITALPRINT_URL, (request, response) -> pi.getAllDigitalPrints(), gson::toJson);
        get(DIGITALPRINT_URL + DIGITALPRINT_ID_URL, (request, response) -> pi.getDigitalPrint(request.params(DIGITALPRINT_ID_PARAM)), gson::toJson);

        post(DIGITALPRINT_URL, (request, response) -> {
            DigitalPrint digitalPrint = pi.createDigitalPrint(gson.fromJson(request.body(), DigitalPrint.class));
            response.status(201);
            return digitalPrint;
        }, gson::toJson);

        post(DIGITALPRINT_URL + DIGITALPRINT_ID_URL + "/magics", ((request, response) -> {
            MagicsData magicsData = pi.uploadMagicsFile(request.params(DIGITALPRINT_ID_PARAM), request.bodyAsBytes(), storageFolder.getAbsolutePath());
            response.status(201);
            return magicsData;
        }), gson::toJson);
    }

    private static void setupCustomerInterface() {

        // Customers
        get(CUSTOMERS_URL, (request, response) -> ci.getAllCustomers(), gson::toJson);
        get(CUSTOMERS_URL + CUSTOMER_ID_URL, ((request, response) -> ci.getCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
        get(CUSTOMERS_URL + CUSTOMER_ID_URL + DIGITALPARTS_URL, ((request, response) -> ci.getDigitalPartsFromCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
        get(CUSTOMERS_URL + CUSTOMER_ID_URL + ORDERS_URL, ((request, response) -> ci.getOrdersFromCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
        put(CUSTOMERS_URL + CUSTOMER_ID_URL, ((request, response) -> ci.updateCustomer(request.params(CUSTOMER_PARAM), gson.fromJson(request.body(), Customer.class))), gson::toJson);
        delete(CUSTOMERS_URL + CUSTOMER_ID_URL, ((request, response) -> ci.deleteCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
        post(CUSTOMERS_URL, (request, response) -> {
            Customer customer = ci.createNewCustomer(gson.fromJson(request.body(), Customer.class));
            response.status(201);
            return customer;
        }, gson::toJson);
    }

    private static void setupDigitalPartsInterface() {
        //DigitalParts
        get(DIGITALPARTS_URL, (request, response) -> dpi.getAllDigitalParts(), gson::toJson);
        get(DIGITALPARTS_URL + DIGITALPART_ID_URL, (request, response) -> dpi.getDigitalPart(request.params(DIGITALPART_ID_PARAM)), gson::toJson);
        put(DIGITALPARTS_URL + DIGITALPART_ID_URL, (request, response) -> dpi.updateDigitalPart(gson.fromJson(request.body(), DigitalPart.class)), gson::toJson);
        post(DIGITALPARTS_URL, (request, response) -> {
            DigitalPart digitalPart = dpi.createNewDigitalPart(gson.fromJson(request.body(), DigitalPart.class));
            response.status(201);
            return digitalPart;
        }, gson::toJson);
        post(DIGITALPARTS_URL + DIGITALPART_ID_URL + "/stl", ((request, response) -> {
            StlData stlData = dpi.uploadStlFile(request.params(DIGITALPART_ID_PARAM), request.bodyAsBytes(), storageFolder.getAbsolutePath());
            response.status(201);
            return stlData;
        }), gson::toJson);
        get(DIGITALPARTS_URL + DIGITALPART_ID_URL + "/stl", ((request, response) -> dpi.getStlData(request.params((DIGITALPART_ID_PARAM)))),gson::toJson);
    }

    private static void setupPhysicalInterface() {
        //PhysicalParts
        get(PHYSICALPARTS_URL, (request, response) -> phi.getAllPhysicalParts(), gson::toJson);
        get(PHYSICALPARTS_URL + PHYSICALPART_ID_URL, (request, response) -> phi.getPhysicalPart(request.params(PHYSICALPART_ID_PARAM)), gson::toJson);
        put(PHYSICALPARTS_URL + PHYSICALPART_ID_URL, (request, response) -> phi.updatePhysicalPart(request.params(PHYSICALPART_ID_PARAM), gson.fromJson(request.body(), PhysicalPart.class)), gson::toJson);
        post(PHYSICALPARTS_URL, (request, response) -> {
            PhysicalPart physicalPart = phi.createNewPhysicalPart(gson.fromJson(request.body(), PhysicalPart.class));
            response.status(201);
            return physicalPart;
        }, gson::toJson);

        //PhysicalPrints
        get(PHYSICALPRINTS_URL, (request, response) -> phi.getAllPhysicalPrints(), gson::toJson);
        get(PHYSICALPRINTS_URL + PHYSICALPRINT_ID_URL, (request, response) -> phi.getPhysicalPrint(request.params(PHYSICALPRINT_ID_PARAM)), gson::toJson);
        put(PHYSICALPRINTS_URL + PHYSICALPRINT_ID_URL, (request, response) -> phi.updatePhysicalPrint(request.params(PHYSICALPRINT_ID_PARAM), gson.fromJson(request.body(), PhysicalPrint.class)), gson::toJson);
        post(PHYSICALPRINTS_URL, (request, response) -> {
            PhysicalPrint physicalPrint = phi.createNewPhysicalPrint(gson.fromJson(request.body(), PhysicalPrint.class));
            response.status(201);
            return physicalPrint;
        }, gson::toJson);

    }

    private static void setupOrderInterface() {
        //Orders
        get(ORDERS_URL, (request, response) -> oi.getAllOrders(), gson::toJson);
        get(ORDERS_URL + ORDER_ID_URL, (request, response) -> oi.getOrder(request.params(ORDER_ID_PARAM)), gson::toJson);
        put(ORDERS_URL + ORDER_ID_URL, ((request, response) -> oi.updateOrder(request.params(ORDER_ID_PARAM), gson.fromJson(request.body(), Order.class))), gson::toJson);
        post(ORDERS_URL, ((request, response) -> {
            Order order = oi.createNewOrder(gson.fromJson(request.body(), Order.class));
            response.status(201);
            return order;
        }), gson::toJson);
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
