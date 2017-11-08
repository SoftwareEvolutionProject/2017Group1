package se.chalmers.dat265.group1.model;

import java.util.Map;

public class DigitalPrint extends DataModel {
    private int id;
    private String magicsPath;

    public DigitalPrint(int id, String magicsPath, Map<String, Integer> magicsPartPairing) {
        this.id = id;
        this.magicsPath = magicsPath;
        this.magicsPartPairing = magicsPartPairing;
    }

    /** Map from <Name tag within Magics file, DigitalPartID>*/
    private Map<String, Integer> magicsPartPairing;

    public int getId() {
        return id;
    }

    public String getMagicsPath() {
        return magicsPath;
    }

    /**
     *
     * @return Map from <Name tag within Magics file, DigitalPartID>
     */
    public Map<String, Integer> getMagicsPartPairing() {
        return magicsPartPairing;
    }
}
