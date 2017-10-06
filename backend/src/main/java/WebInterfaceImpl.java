import model.DigitalPart;

import java.util.List;

/**
 * Created by danie on 2017-09-28.
 */
public class WebInterfaceImpl implements WebInterface {
    @Override
    public String dummy(String id) {
        return "Fuck yes! You gave me the ID " + id + ".";
    }

    @Override
    public DigitalPart getDigitalPart(int digitalPartID) {
        //TODO implement this properly
        return new DigitalPart(1337, "Stl/path/stuff.stl", null);
    }
}
