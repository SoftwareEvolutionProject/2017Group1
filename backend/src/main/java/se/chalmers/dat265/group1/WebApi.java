package se.chalmers.dat265.group1;

import se.chalmers.dat265.group1.api.material.MaterialApi;
import se.chalmers.dat265.group1.api.printing.PrintingController;
import se.chalmers.dat265.group1.api.printing.PrintingInterface;
import se.chalmers.dat265.group1.api.customer.CustomerAPI;
import se.chalmers.dat265.group1.api.digitalpart.DigitalPartAPI;
import se.chalmers.dat265.group1.api.digitalpart.DigitalPartController;
import se.chalmers.dat265.group1.api.customer.CustomerController;
import com.google.gson.Gson;
import se.chalmers.dat265.group1.model.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {


    private static CustomerAPI ci;
    private static DigitalPartAPI dpi;
    private static MaterialApi mi;
    private static PrintingInterface pi;
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
    private static final String DIGITALPARTS_URL = "/digital-part";
    private static final String DIGITALPART_ID_URL = "/:digitalPart";
    private static final String DIGITALPART_ID_PARAM = "digitalPartID";
    private static final String PHYSICALPARTS_URL = "/physical-parts";
    private static final String MATERIALS_URL = "/materials";
    private static final String MATERIAL_ID_URL = "/:materialID";
    private static final String MATERIAL_ID = "materialID";
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
        setupMaterialInterface();

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
        get(CUSTOMERS_URL + CUSTOMER_ID_URL + ORDERS_URL, ((request, response) -> ci.getOrdersFromCustomer(request.params(CUSTOMER_PARAM))), gson::toJson);
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

    private static void setupOrderInterface() {
        //Orders
        get(ORDERS_URL, (request, response) -> ci.getAllOrders(), gson::toJson);
        get(ORDERS_URL + ORDER_ID_URL, (request, response) -> ci.getOrder(request.params(ORDER_ID_PARAM)), gson::toJson);
        get(ORDERS_URL + ORDER_ID_URL + PARTS_URL, (request, response) -> ci.getOrderedParts(request.params(ORDER_ID_PARAM)), gson::toJson);
        post(ORDERS_URL, ((request, response) -> ci.createNewOrder(gson.fromJson(request.body(), Order.class))), gson::toJson);
        put(ORDERS_URL + ORDER_ID_URL, ((request, response) -> ci.updateOrder(request.params(ORDER_ID_PARAM), gson.fromJson(request.body(), Order.class))), gson::toJson);
        post(ORDERS_URL + ORDER_ID_URL + PARTS_URL, ((request, response) -> ci.createNewOrderedPart(request.params(ORDER_ID_PARAM), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
        put(ORDERS_URL + ORDER_ID_URL + PARTS_URL + ORDEREDPART_ID_URL, ((request, response) -> ci.updateOrderDetail(request.params(ORDER_ID_PARAM), request.params("orderedPartID"), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
    }

    private static void setupMaterialInterface() {

        get(MATERIALS_URL, (request, response) -> mi.getAllMaterials(), gson::toJson);
        get(MATERIALS_URL + MATERIAL_ID_URL, ((request, response) -> mi.getMaterial(request.params(MATERIAL_ID))), gson::toJson);
        post(MATERIALS_URL, ((request, response) -> mi.createNewMaterial(gson.fromJson(request.body(), Material.class))), gson::toJson);
        put(MATERIALS_URL + MATERIAL_ID_URL + "/:gradeLevel/decrease/:amount", (request, response) -> mi.decreaseLevelAmount(
                Integer.valueOf(request.params(MATERIAL_ID)),
                Integer.valueOf(request.params("gradeLevel")),
                Double.valueOf(request.params("amount"))), gson::toJson);

        put(MATERIALS_URL + MATERIAL_ID_URL + "/:gradeLevel/increase/:amount", (request, response) -> mi.increaseLevelAmount(
                Integer.valueOf(request.params(MATERIAL_ID)),
                Integer.valueOf(request.params("gradeLevel")),
                Double.valueOf(request.params("amount"))), gson::toJson);
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
