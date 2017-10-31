package api.digitalpart;

import model.DigitalPart;
import storage.DBInterface;
import storage.PostgresSQLConnector;
import storage.repository.GenericRepository;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.List;

/**
 * Created by Mikae on 2017-10-16.
 */
public class DigitalPartController implements DigitalPartAPI {
    DBInterface dbConnector = new PostgresSQLConnector();
    GenericRepository<DigitalPart> digitalPartRepository = new GenericRepository<>(DigitalPart.class, dbConnector);

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
        throw new NotImplementedException();
    }

    @Override
    public String getStlPath(String digitalPartID) {
        throw new NotImplementedException();
    }

    @Override
    public String updateStlPath(String digitalPartID) {
        throw new NotImplementedException();
    }

    @Override
    public String getCadPath(String digitalPartID) {
        throw new NotImplementedException();
    }

    @Override
    public String updateCadPath(String digitalPartID) {
        throw new NotImplementedException();
    }
}
