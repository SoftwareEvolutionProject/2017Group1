package api.printing;

import model.DigitalPrint;

import java.util.List;

public interface PrintingInterface {
    List<DigitalPrint> getAllDigitalPrints();

    DigitalPrint getDigitalPrint(String id);

    DigitalPrint createDigitalPrint(DigitalPrint digitalPrint);

    DigitalPrint updateDigitalPrint(String id, DigitalPrint digitalPrint);
}
