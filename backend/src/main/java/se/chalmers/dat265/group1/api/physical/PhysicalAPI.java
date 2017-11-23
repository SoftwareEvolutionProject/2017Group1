package se.chalmers.dat265.group1.api.physical;

import se.chalmers.dat265.group1.model.PhysicalPart;
import se.chalmers.dat265.group1.model.PhysicalPrint;
import se.chalmers.dat265.group1.model.SlmData;
import se.chalmers.dat265.group1.model.StlData;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.util.List;

public interface PhysicalAPI {
    List<PhysicalPart> getAllPhysicalParts();

    PhysicalPart getPhysicalPart(String physicalPartID);

    PhysicalPart createNewPhysicalPart(PhysicalPart physicalPart);

    PhysicalPart updatePhysicalPart(String physicalPartID, PhysicalPart physicalPart);

    List<PhysicalPrint> getAllPhysicalPrints();

    PhysicalPrint getPhysicalPrint(String physicalPrintID);

    PhysicalPrint createNewPhysicalPrint(PhysicalPrint physicalPrint);

    PhysicalPrint updatePhysicalPrint(String physicalPrintID, PhysicalPrint physicalPrint);

    SlmData uploadSlmFile(String path, byte[] body, String absolutePath) throws IOException;
}
