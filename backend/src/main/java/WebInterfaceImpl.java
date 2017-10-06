import model.DigitalPart;
import storage.DatabaseConnector;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public class WebInterfaceImpl implements WebInterface {
    DatabaseConnector dbConnector;

    @Override
    public String dummy(String id) {
        return "Fuck yes! You gave me the ID " + id + ".";
    }

    @Override
    public DigitalPart getDigitalPart(int digitalPartID) {
        //TODO implement this properly
        return new DigitalPart(digitalPartID, "stuff/path/" + digitalPartID + ".stl", null);
    }

    @Override
    public List<DigitalPart> getDigitalParts() {
        return dbConnector.getDigitalParts();
    }
}
