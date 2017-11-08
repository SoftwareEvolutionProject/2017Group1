package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;

public class MagicsPairing extends DataModel {
    int id, digitalPrintID, digitalPartID;
    String label;

    public MagicsPairing() {
        id = -1;
        digitalPartID = -1;
        digitalPrintID = -1;
        label = "";
    }

    public MagicsPairing(int id, int digitalPrintID, int digitalPartID, String label) {
        super();
        this.id = id;
        this.digitalPrintID = digitalPrintID;
        this.digitalPartID = digitalPartID;
        this.label = label;
    }

    public int getId() {
        return id;
    }

    public int getDigitalPrintID() {
        return digitalPrintID;
    }

    public int getDigitalPartID() {
        return digitalPartID;
    }

    public String getLabel() {
        return label;
    }
}
