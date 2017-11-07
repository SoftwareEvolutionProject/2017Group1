package se.chalmers.dat265.group1.api.physical;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.PhysicalPart;
import se.chalmers.dat265.group1.model.PhysicalPrint;

import java.util.List;

public class PhysicalsController extends ApiController implements PhysicalInterface {
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
        return physicalPrintRepository.getObjects();
    }

    @Override
    public PhysicalPrint getPhysicalPrint(String physicalPrintID) {
        return physicalPrintRepository.getObject(Integer.valueOf(physicalPrintID));
    }

    @Override
    public PhysicalPrint createNewPhysicalPrint(PhysicalPrint physicalPrint) {
        return physicalPrintRepository.postObject(physicalPrint);
    }

    @Override
    public PhysicalPrint updatePhysicalPrint(String physicalPrintID, PhysicalPrint physicalPrint) {
        checkIDs(physicalPrintID, physicalPrint);
        return physicalPrintRepository.updateObject(physicalPrint);
    }
}
