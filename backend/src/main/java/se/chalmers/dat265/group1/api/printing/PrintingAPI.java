package se.chalmers.dat265.group1.api.printing;

import se.chalmers.dat265.group1.model.DigitalPrint;
import se.chalmers.dat265.group1.model.MagicsData;

import java.io.IOException;
import java.util.List;

public interface PrintingAPI {
    List<DigitalPrint> getAllDigitalPrints();

    DigitalPrint getDigitalPrint(String id);

    DigitalPrint createDigitalPrint(DigitalPrint digitalPrint);

    MagicsData uploadMagicsFile(String id, byte[] body, String staticFolder) throws IOException;
}
