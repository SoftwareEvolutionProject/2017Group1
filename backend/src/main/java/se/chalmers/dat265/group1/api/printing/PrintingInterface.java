package se.chalmers.dat265.group1.api.printing;

import se.chalmers.dat265.group1.model.DigitalPrint;

import java.util.List;

public interface PrintingInterface {
    List<DigitalPrint> getAllDigitalPrints();

    DigitalPrint getDigitalPrint(String id);

    DigitalPrint createDigitalPrint(DigitalPrint digitalPrint);

}
