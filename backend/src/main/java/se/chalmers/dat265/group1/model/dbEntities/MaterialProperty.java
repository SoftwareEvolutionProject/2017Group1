package se.chalmers.dat265.group1.model.dbEntities;

import se.chalmers.dat265.group1.model.DataModel;

public class MaterialProperty extends DataModel {
    int id;
    String name;
    String description;
    int materialID;


    public MaterialProperty(int id, String name, String description, int materialID) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.materialID = materialID;
    }

    public MaterialProperty() {
        id = -1;
        name = "";
        description = "";
        materialID = -1;
    }

    @Override
    public int getId() {
        return 0;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getMaterialID() {
        return materialID;
    }
}
