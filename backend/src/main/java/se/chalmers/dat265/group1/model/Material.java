package se.chalmers.dat265.group1.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Material implements DataModel {
    private int id;
    private int name;
    private int supplierName;
    private double initialAmount;
    private List<MaterialGrade> materialGrades;
    private Map<String, String> materialProperties;

    public Material(int id, int name, int supplierName, double initialAmount, List<MaterialGrade> materialGrades, Map<String, String> materialProperties) {
        this.id = id;
        this.name = name;
        this.supplierName = supplierName;
        this.initialAmount = initialAmount;
        this.materialGrades = materialGrades;
        this.materialProperties = materialProperties;
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

    public List<MaterialGrade> getMaterialGrades() {
        return materialGrades;
    }

    public Map<String, String> getMaterialProperties() {
        return materialProperties;
    }
}
