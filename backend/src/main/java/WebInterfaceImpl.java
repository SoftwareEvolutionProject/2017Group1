/**
 * Created by danie on 2017-09-28.
 */
public class WebInterfaceImpl implements WebInterface {
    @Override
    public String getAllPrintsForStl(String stlID) {
        return "Fuck yes! You gave me the ID " + stlID + ".";
    }
}
