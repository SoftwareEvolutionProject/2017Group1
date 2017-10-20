import api.MaterialInterface;
import api.printing.PrintingController;
import api.printing.PrintingInterface;
import api.customer.CustomerAPI;
import api.customer.CustomerController;
import com.google.gson.Gson;
import model.Customer;
import model.DigitalPrint;
import model.Order;
import model.OrderedPart;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    private static CustomerAPI ci;
    private static MaterialInterface mi;
    private static PrintingInterface pi;

    private static Gson gson = new Gson();
    private static boolean debug;

    public static void main(String[] args) {
        debug = prepareDebug(args);
        long start = System.currentTimeMillis();
        System.out.println("STARTED ENDPIONT SETUP");
        WebApi.enableCORS("*", "*", "*");


        get("/hello", (req, res) -> "Hello World");

        setupCustomerInterface();
        setupPrintingInterface();

        System.out.println("ENDPOINT SETUP COMPLETE: " + (System.currentTimeMillis() - start) + " ms");
        System.out.println("SERVER RUNNING!");
    }

    private static void setupPrintingInterface() {
        pi = new PrintingController(debug);
        get("/digitalPrint", (request, response) -> pi.getAllDigitalPrints(), gson::toJson);
        get("/digitalPrint/:id", (request, response) -> pi.getDigitalPrint(request.params("id")), gson::toJson);
        get("/digitalPrint/:id", (request, response) -> pi.getDigitalPrint(request.params("id")), gson::toJson);
        post("/digitalPrint", ((request, response) -> pi.createDigitalPrint(gson.fromJson(request.body(), DigitalPrint.class))), gson::toJson);
        put("/digitalPrint/:id", ((request, response) -> pi.updateDigitalPrint(request.params("id"), gson.fromJson(request.body(), DigitalPrint.class))), gson::toJson);
    }

    private static void setupCustomerInterface() {
        ci = new CustomerController(debug);

        // Customers
        get("/customers", (request, response) -> ci.getAllCustomers(), gson::toJson);
        get("/customers/:customerID", ((request, response) -> ci.getCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/orders", ((request, response) -> ci.getOrdersFromCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/digitalparts", ((request, response) -> ci.getDigitalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/physicalparts", ((request, response) -> ci.getPhysicalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        post("/customers", ((request, response) -> ci.createNewCustomer(gson.fromJson(request.body(), Customer.class))), gson::toJson);
        put("/customers/:customerID", ((request, response) -> ci.updateCustomer(request.params("customerID"), gson.fromJson(request.body(), Customer.class))), gson::toJson);
        delete("/customers/:customerID", ((request, response) -> ci.deleteCustomer(request.params("customerID"))), gson::toJson);

        //Orders
        get("/orders", (request, response) -> ci.getAllOrders(), gson::toJson);
        get("/orders/:orderID", (request, response) -> ci.getOrder(request.params("orderID")), gson::toJson);
        get("/orders/:orderID/parts", (request, response) -> ci.getOrderedParts(request.params("orderID")), gson::toJson);
        post("/orders", ((request, response) -> ci.createNewOrder(gson.fromJson(request.body(), Order.class))), gson::toJson);
        put("/orders/:orderID", ((request, response) -> ci.updateOrder(request.params("orderID"), gson.fromJson(request.body(), Order.class))), gson::toJson);
        post("/orders/:orderID/parts", ((request, response) -> ci.createNewOrderedPart(request.params("orderID"), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
        put("/orders/:orderID/parts/:orderedPartID", ((request, response) -> ci.updateOrderDetail(request.params("orderID"), request.params("orderedPartID"), gson.fromJson(request.body(), OrderedPart.class))), gson::toJson);
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
