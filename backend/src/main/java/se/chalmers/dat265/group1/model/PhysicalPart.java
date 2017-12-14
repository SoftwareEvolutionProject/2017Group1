package se.chalmers.dat265.group1.model;

import java.util.LinkedList;
import java.util.List;

public class PhysicalPart extends DataModel {
    private int id;
    private int physicalPrintID;
    private int orderedPartID;
    private String magicsPartPairingLabel;

    public PhysicalPart() {
        id = -1;
        physicalPrintID = -1;
        orderedPartID = -1;
        magicsPartPairingLabel = "";
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

    public String getMagicsPartPairingLabel() {
        return magicsPartPairingLabel;
    }

}
