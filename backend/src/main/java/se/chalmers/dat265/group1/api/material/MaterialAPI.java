package se.chalmers.dat265.group1.api.material;

import se.chalmers.dat265.group1.model.Material;

import java.util.List;

public interface MaterialAPI {
    List<Material> getAllMaterials();

    Material getMaterial(String id);

    Material createNewMaterial(Material material);

    Material decreaseLevelAmount(int materialID, int materialGrade, double amount);

    Material increaseLevelAmount(int materialID, int materialGrade, double amount);
}
