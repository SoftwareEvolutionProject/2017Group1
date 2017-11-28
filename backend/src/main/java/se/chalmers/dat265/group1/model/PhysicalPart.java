package se.chalmers.dat265.group1.model;

import java.util.LinkedList;
import java.util.List;

public class PhysicalPart extends DataModel {
    private int id;
    private int physicalPrintID;
    private int orderedPartID;
    private int magicsPartPairingID;
    private List<String> photoPaths;

    public PhysicalPart() {
        id = -1;
        physicalPrintID = -1;
        orderedPartID = -1;
        magicsPartPairingID = -1;
    }

    public int getId() {
        return id;
    }

    public int getPhysicalPrintID() {
        return physicalPrintID;
    }

    public int getOrderedPartID() {
        return orderedPartID;
    }

    public int getMagicsPartPairingID() {
        return magicsPartPairingID;
    }

    public List<String> getPhotoPaths() {
        return photoPaths;
    }
}
