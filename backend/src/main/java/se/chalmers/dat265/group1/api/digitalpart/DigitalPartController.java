package se.chalmers.dat265.group1.api.digitalpart;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.DigitalPart;
import se.chalmers.dat265.group1.model.DigitalPrint;
import se.chalmers.dat265.group1.model.StlData;
import se.chalmers.dat265.group1.model.dto.DigitalPartStl;
import se.chalmers.dat265.group1.storage.FileUtil;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.util.Arrays;
import java.util.LinkedList;
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
        List<DigitalPart> resultLit = new LinkedList<DigitalPart>();
        List<DigitalPart> dpList = digitalPartRepository.getObjects();
        for (DigitalPart dp : dpList) {
            resultLit.add(populatePathIfExist(dp));
        }
        return resultLit;
    }

    @Override
    public DigitalPart getDigitalPart(String digitalPartID) {
        DigitalPart temp =  digitalPartRepository.getObject(Integer.parseInt(digitalPartID));
        return populatePathIfExist(temp);
    }

    private DigitalPart populatePathIfExist(DigitalPart digitalPart) {
        List<StlData> stl = stlRepo.getObjects("digitalPartID= "+ digitalPart.getId());
        if(stl.size()==1){
            return new DigitalPartStl(digitalPart, stl.get(0).getPath());
        }
        return digitalPart;
    }

    @Override
    public DigitalPart createNewDigitalPart(DigitalPart digitalPart) {
        return digitalPartRepository.postObject(digitalPart);
    }

    @Override
    public DigitalPart updateDigitalPart(DigitalPart digitalPart) {
        DigitalPart temp =  digitalPartRepository.updateObject(digitalPart);
        return populatePathIfExist(temp);
    }

    @Override
    public StlData uploadStlFile(String digitalPartID, byte[] body, String basePath) throws IOException {
        boolean exist=false;
        try{
            exist = stlRepo.getObject(Integer.valueOf(digitalPartID))!= null;
        }catch (Exception e){
            exist = false;
        }
        if (exist){
            throw new FileAlreadyExistsException("ID have file");
        }
        String path = "stl/" + digitalPartID + "-" + Arrays.hashCode(body) + ".stl";
        FileUtil.write(body, basePath+path);
        
        return stlRepo.postObject(new StlData(Integer.valueOf(digitalPartID), path));
    }
}
