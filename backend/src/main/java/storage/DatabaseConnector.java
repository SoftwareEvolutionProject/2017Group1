package storage;

import model.DigitalPart;

import java.util.List;

public interface DatabaseConnector {


    List<DigitalPart> getDigitalParts();
}
