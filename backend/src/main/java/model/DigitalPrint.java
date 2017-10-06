package model;

import java.util.Map;

public class DigitalPrint {
    private int id;
    private String magicsPath;

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
