package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.Material;


public class MaterialData extends DataModel {

    private int id;
    private int name;
    private int supplierName;
    private double initialAmount;

    public MaterialData(Material material) {
        id = material.getId();
        name = material.getName();
        supplierName = material.getSupplierName();
        initialAmount = material.getInitialAmount();
    }

    @Override
    public int getId() {
        return id;
    }

    public int getName() {
        return name;
    }

    public int getSupplierName() {
        return supplierName;
    }

    public double getInitialAmount() {
        return initialAmount;
    }
}
