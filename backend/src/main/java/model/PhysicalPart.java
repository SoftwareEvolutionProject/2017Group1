package model;

import java.util.List;

public class PhysicalPart {
    private int id;
    private int physicalPrintID;
    private int orderedPartID;
    private String magicsPartPairingID;
    private List<String> photoPaths;

    public int getId() {
        return id;
    }

    public int getPhysicalPrintID() {
        return physicalPrintID;
    }

    public int getOrderedPartID() {
        return orderedPartID;
    }

    public String getMagicsPartPairingID() {
        return magicsPartPairingID;
    }

    public List<String> getPhotoPaths() {
        return photoPaths;
    }
}
