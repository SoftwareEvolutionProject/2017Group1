package se.chalmers.dat265.group1.api.digitalpart;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.DigitalPart;
import org.apache.commons.lang3.NotImplementedException;
import se.chalmers.dat265.group1.model.StlData;
import se.chalmers.dat265.group1.storage.FileUtil;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import java.io.IOException;
import java.util.Arrays;
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
    public StlData uploadStlFile(String digitalPartID, byte[] body) throws IOException {
        String path = "/stl/" + digitalPartID + "-" + Arrays.hashCode(body) + ".stl";
        FileUtil.write(body, path);
        return stlRepo.postObject(new StlData(Integer.valueOf(digitalPartID), path));
    }
}
