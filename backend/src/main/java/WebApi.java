import com.google.gson.Gson;
import model.Customer;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    private static WebInterface webInterface = new WebInterfaceImpl();

    public static void main(String[] args) {
        WebApi.enableCORS("*","*","*");

        Gson gson = new Gson();
        get("/hello", (req, res) -> "Hello World");

        // Customers
        get("/customers", (request, response) -> webInterface.getAllCustomers(), gson::toJson);
        get("/customers/:customerID,", ((request, response) -> webInterface.getCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/orders,", ((request, response) -> webInterface.getOrdersFromCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/digitalparts,", ((request, response) -> webInterface.getDigitalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/physicalparts,", ((request, response) -> webInterface.getPhysicalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        post("/customers", ((request, response) -> webInterface.createNewCustomer(gson.fromJson(request.body(), Customer.class))), gson::toJson);
        put("/customers", ((request, response) -> webInterface.updateCustomer(gson.fromJson(request.body(), Customer.class))), gson::toJson);

        //get("/digitalPart/:digitalPartID", (req, res) -> webInterface.getDigitalPart(req.params("digitalPartID")), gson::toJson);

        System.out.println("SERVER RUNNING!");
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
}
