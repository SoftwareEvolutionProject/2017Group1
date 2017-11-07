package se.chalmers.dat265.group1.api.digitalpart;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.DigitalPart;
import org.apache.commons.lang3.NotImplementedException;
import java.util.List;

/**
 * Created by Mikae on 2017-10-16.
 */
public class DigitalPartController extends ApiController implements DigitalPartAPI {

    public DigitalPartController(boolean debug) {
        super(debug);
    }

    @Override
    public List<DigitalPart> getAllDigitalParts() {
        return digitalPartRepository.getObjects();
    }

    @Override
    public DigitalPart getDigitalPart(String digitalPartID) {
        return digitalPartRepository.getObject(Integer.parseInt(digitalPartID));
    }

    @Override
    public DigitalPart createNewDigitalPart(DigitalPart digitalPart) {
        return digitalPartRepository.postObject(digitalPart);
    }

    @Override
    public DigitalPart updateDigitalPart(DigitalPart digitalPart) {
        return digitalPartRepository.updateObject(digitalPart);
    }

    @Override
    public int deleteDigitalPart(String digitalPartID) {
        throw new NotImplementedException("TODO");
    }

    @Override
    public String getStlPath(String digitalPartID) {
        throw new NotImplementedException("TODO");
    }

    @Override
    public String updateStlPath(String digitalPartID) {
        throw new NotImplementedException("TODO");
    }

    @Override
    public String getCadPath(String digitalPartID) {
        throw new NotImplementedException("TODO");
    }

    @Override
    public String updateCadPath(String digitalPartID) {
        throw new NotImplementedException("TODO");
    }
}
