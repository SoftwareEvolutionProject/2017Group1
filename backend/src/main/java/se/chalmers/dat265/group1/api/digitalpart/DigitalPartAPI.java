package se.chalmers.dat265.group1.api.digitalpart;

import se.chalmers.dat265.group1.model.DigitalPart;
import se.chalmers.dat265.group1.model.StlData;

import java.io.IOException;
import java.util.List;

/**
 * Created by Mikae on 2017-10-16.
 */
public interface DigitalPartAPI {
    List<DigitalPart> getAllDigitalParts();

    DigitalPart getDigitalPart(String digitalPartID);

    DigitalPart createNewDigitalPart(DigitalPart digitalPart);

    DigitalPart updateDigitalPart(DigitalPart digitalPart);

    StlData uploadStlFile(String digitalPartID, byte[] body, String basePath) throws IOException;
}
