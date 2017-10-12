import com.google.gson.Gson;
import model.Customer;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    private static WebInterface webInterface = new WebInterfaceImpl();

    public static void main(String[] args) {
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

}
