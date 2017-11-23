package se.chalmers.dat265.group1.model.dto;

import se.chalmers.dat265.group1.model.PhysicalPrint;

public class PhysicalPrintSlm extends PhysicalPrint {
    private String path = "";

    public PhysicalPrintSlm(PhysicalPrint physicalPrint, String path) {
        super(physicalPrint.getId(), physicalPrint.getDigitalPrintID());
        this.path = path;
    }
}
