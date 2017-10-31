package api.digitalpart;

import model.DigitalPart;

import java.util.List;

/**
 * Created by Mikae on 2017-10-16.
 */
public interface DigitalPartAPI {
    List<DigitalPart> getAllDigitalParts();

    DigitalPart getDigitalPart(String digitalPartID);

    DigitalPart createNewDigitalPart(DigitalPart digitalPart);

    DigitalPart updateDigitalPart(DigitalPart digitalPart);

    int deleteDigitalPart(String digitalPartID);

    String getStlPath(String digitalPartID);

    String updateStlPath(String digitalPartID);

    String getCadPath(String digitalPartID);

    String updateCadPath(String digitalPartID);
}
