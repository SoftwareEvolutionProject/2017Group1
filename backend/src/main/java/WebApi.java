import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    private static WebInterface webInterface = new WebInterfaceImpl();

    public static void main(String[] args) {
        get("/hello", (req, res) -> "Hello World");

        get("/stl/:stlID", (req, res) -> webInterface.getAllPrintsForStl(req.params("stlID")));
    }

}
