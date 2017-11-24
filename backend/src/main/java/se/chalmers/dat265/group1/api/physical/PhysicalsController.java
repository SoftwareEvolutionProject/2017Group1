package se.chalmers.dat265.group1.api.physical;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.PhysicalPart;
import se.chalmers.dat265.group1.model.PhysicalPrint;
import se.chalmers.dat265.group1.model.SlmData;
import se.chalmers.dat265.group1.model.dto.PhysicalPrintSlm;
import se.chalmers.dat265.group1.storage.FileUtil;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class PhysicalsController extends ApiController implements PhysicalAPI {
    public PhysicalsController(boolean debug) {
        super(debug);
    }

    @Override
    public List<PhysicalPart> getAllPhysicalParts() {
        return physicalPartRepository.getObjects();
    }

    @Override
    public PhysicalPart getPhysicalPart(String physicalPartID) {
        return physicalPartRepository.getObject(Integer.valueOf(physicalPartID));
    }

    @Override
    public PhysicalPart createNewPhysicalPart(PhysicalPart physicalPart) {
        return physicalPartRepository.postObject(physicalPart);
    }

    @Override
    public PhysicalPart updatePhysicalPart(String physicalPartID, PhysicalPart physicalPart) {
        checkIDs(physicalPartID, physicalPart);
        return physicalPartRepository.updateObject(physicalPart);
    }

    @Override
    public List<PhysicalPrint> getAllPhysicalPrints() {
        List<PhysicalPrint> resultList = new LinkedList<PhysicalPrint>();
        List<PhysicalPrint> physicalPrintList = physicalPrintRepository.getObjects();
        for (PhysicalPrint pl : physicalPrintList) {
            resultList.add(populatePathIfExist(pl));
        }
        return resultList;
    }

    @Override
    public PhysicalPrint getPhysicalPrint(String physicalPrintID) {
        return populatePathIfExist(physicalPrintRepository.getObject(Integer.valueOf(physicalPrintID)));
    }

    @Override
    public PhysicalPrint createNewPhysicalPrint(PhysicalPrint physicalPrint) {
        return physicalPrintRepository.postObject(physicalPrint);
    }

    @Override
    public PhysicalPrint updatePhysicalPrint(String physicalPrintID, PhysicalPrint physicalPrint) {
        checkIDs(physicalPrintID, physicalPrint);
        return populatePathIfExist(physicalPrintRepository.updateObject(physicalPrint));
    }

    @Override
    public SlmData uploadSlmFile(String id, byte[] body, String absolutePath) throws IOException {
        boolean exist = false;
        try {
            exist = slmRepo.getObject(Integer.valueOf(id)) != null;
        } catch (Exception e) {
            exist = false;
        }
        if (exist) {
            throw new FileAlreadyExistsException("ID have file");
        }
        String path = "/slm/" + id + "-" + Arrays.hashCode(body) + ".slm";
        FileUtil.write(body, absolutePath + path);
        return slmRepo.postObject(new SlmData(Integer.valueOf(id), path));
    }

    private PhysicalPrint populatePathIfExist(PhysicalPrint physicalPrint) {
        List<SlmData> slm = slmRepo.getObjects("physicalPrintID= "+ physicalPrint.getId());
        if(slm.size()==1){
            return new PhysicalPrintSlm(physicalPrint, slm.get(0).getPath());
        }
        return physicalPrint;
    }
}
