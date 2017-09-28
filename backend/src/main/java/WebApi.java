import static spark.Spark.*;

/**
 * Starts a restapi att localhost:4567
 */
public class WebApi {
    public static void main(String[] args) {
        get("/hello", (req, res) -> "Hello World");
    }

}
