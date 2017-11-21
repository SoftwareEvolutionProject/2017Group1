package se.chalmers.dat265.group1.model;

import java.util.Map;

public class DigitalPrint extends DataModel {
    private int id;
    private String name;

    public DigitalPrint(int id, String name, Map<String, Integer> magicsPartPairing) {
        this.id = id;
        this.name = name;
        this.magicsPartPairing = magicsPartPairing;
    }

    /** Map from <Name tag within Magics file, DigitalPartID>*/
    private Map<String, Integer> magicsPartPairing;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    /**
     *
     * @return Map from <Name tag within Magics file, DigitalPartID>
     */
    public Map<String, Integer> getMagicsPartPairing() {
        return magicsPartPairing;
    }
}
