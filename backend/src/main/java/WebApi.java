import com.google.gson.Gson;
import model.Customer;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    private static CustomerInterface ci = new CustomerController();
    private static MaterialInterface mi;
    private static PrintingInterface pi;

    private static Gson gson = new Gson();

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        System.out.println("STARTED ENDPIONT SETUP");


        get("/hello", (req, res) -> "Hello World");

        setupCustomerInterface();

        System.out.println("ENDPOINT SETUP COMPLETE: " + (System.currentTimeMillis()-start) + " ms");
        System.out.println("SERVER RUNNING!");
    }

    private static void setupCustomerInterface() {
        // Customers
        get("/customers", (request, response) -> ci.getAllCustomers(), gson::toJson);
        get("/customers/:customerID,", ((request, response) -> ci.getCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/orders,", ((request, response) -> ci.getOrdersFromCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/digitalparts,", ((request, response) -> ci.getDigitalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        get("/customers/:customerID/physicalparts,", ((request, response) -> ci.getPhysicalPartsFromCustomer(request.params("customerID"))), gson::toJson);
        post("/customers", ((request, response) -> ci.createNewCustomer(gson.fromJson(request.body(), Customer.class))), gson::toJson);
        put("/customers", ((request, response) -> ci.updateCustomer(gson.fromJson(request.body(), Customer.class))), gson::toJson);


    }

}
