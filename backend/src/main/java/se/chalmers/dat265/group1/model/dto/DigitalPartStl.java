package se.chalmers.dat265.group1.model.dto;

import se.chalmers.dat265.group1.model.DigitalPart;

public class DigitalPartStl extends DigitalPart {
    private String path;

    public DigitalPartStl(DigitalPart parent, String path) {
        super(parent.getId(), parent.getCustomerID(), parent.getName());
        this.path = path;
    }
}
