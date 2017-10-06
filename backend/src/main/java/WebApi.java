import com.google.gson.Gson;

import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    private static WebInterface webInterface = new WebInterfaceImpl();

    public static void main(String[] args) {
        Gson gson = new Gson();
        get("/hello", (req, res) -> "Hello World");
        get("/dummy/:id", (req, res) -> webInterface.dummy(req.params("id")));
        get("/digitalPart/:digitalPartID", (req, res) -> webInterface.getDigitalPart(Integer.parseInt(req.params("digitalPartID"))), gson::toJson);
    }

}
