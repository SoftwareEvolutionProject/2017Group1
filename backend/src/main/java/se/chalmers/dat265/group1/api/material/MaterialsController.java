package se.chalmers.dat265.group1.api.material;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.Material;
import se.chalmers.dat265.group1.model.MaterialGrade;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class MaterialsController extends ApiController implements MaterialAPI {
    private GenericRepository<MaterialProperty> propertyRepository;


    public MaterialsController(boolean debug) {
        super(debug);
        propertyRepository = new GenericRepository<>(MaterialProperty.class, dbConnector);
    }

    @Override
    public List<Material> getAllMaterials() {
        List<Material> materials = new LinkedList<>();

        List<Material> incompleteMaterials = materialRepository.getObjects();
        for (Material material : incompleteMaterials) {
            materials.add(stageMaterial(material));
        }

        return materials;
    }

    private List<MaterialGrade> getMaterialGrades(int id) {
        return materialGradeRepository.getObjects("materialID=" + id);
    }

    private List<MaterialProperty> getMaterialProperties(int id) {
        return propertyRepository.getObjects("materialID=" + id);
    }

    private Material stageMaterial(Material material) {
        List<MaterialGrade> grades = getMaterialGrades(material.getId());
        List<MaterialProperty> propertyList = getMaterialProperties(material.getId());
        Map<String, String> propertiesMap = new HashMap<>();

        for (MaterialProperty property : propertyList) {
            propertiesMap.put(property.name, property.description);
        }

        material.setMaterialGrades(grades);
        material.setMaterialProperties(propertiesMap);

        return material;


    }

    @Override
    public Material getMaterial(String id) {
        return stageMaterial(materialRepository.getObject(Integer.valueOf(id)));
    }

    @Override
    public Material createNewMaterial(Material material) {
        return null;
    }

    @Override
    public Material decreaseLevelAmount(int materialID, int materialGrade, double amount) {
        return null;
    }

    @Override
    public Material increaseLevelAmount(int materialID, int materialGrade, double amount) {
        return null;
    }

    private class MaterialProperty implements DataModel {
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

        @Override
        public int getId() {
            return 0;
        }

    }
}
