package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.Material;


public class MaterialData extends DataModel {

    private int id;
    private String name;
    private String supplierName;
    private double initialAmount;

    public MaterialData(Material material) {
        id = material.getId();
        name = material.getName();
        supplierName = material.getSupplierName();
        initialAmount = material.getInitialAmount();
    }

    public MaterialData() {
        id = -1;
        name = "";
        supplierName = "";
        initialAmount = -1;
    }

    @Override
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public double getInitialAmount() {
        return initialAmount;
    }
}
