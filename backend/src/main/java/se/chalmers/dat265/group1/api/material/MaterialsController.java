package se.chalmers.dat265.group1.api.material;

import org.apache.commons.lang3.NotImplementedException;
import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.Material;
import se.chalmers.dat265.group1.model.MaterialGrade;
import se.chalmers.dat265.group1.model.dbEntities.MaterialData;
import se.chalmers.dat265.group1.model.dbEntities.MaterialProperty;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import java.util.*;

public class MaterialsController extends ApiController implements MaterialAPI {
    private GenericRepository<MaterialProperty> propertyRepository;


    public MaterialsController(boolean debug) {
        super(debug);
        propertyRepository = new GenericRepository<>(MaterialProperty.class, dbConnector);
    }

    @Override
    public List<Material> getAllMaterials() {
        List<Material> materials = new LinkedList<>();

        List<MaterialData> incompleteMaterials = materialRepository.getObjects();
        for (MaterialData materialData : incompleteMaterials) {
            materials.add(stageMaterial(materialData));
        }

        return materials;
    }

    private List<MaterialGrade> getMaterialGrades(int id) {
        return materialGradeRepository.getObjects("materialID=" + id);
    }

    private List<MaterialProperty> getMaterialProperties(int id) {
        return propertyRepository.getObjects("materialID=" + id);
    }

    private Material stageMaterial(MaterialData materialData) {
        List<MaterialGrade> grades = getMaterialGrades(materialData.getId());
        List<MaterialProperty> propertyList = getMaterialProperties(materialData.getId());
        Map<String, String> propertiesMap = new HashMap<>();

        for (MaterialProperty property : propertyList) {
            propertiesMap.put(property.getName(), property.getDescription());
        }

        return new Material(materialData.getId(),materialData.getName(), materialData.getSupplierName(), materialData.getInitialAmount(),grades, propertiesMap);
    }

    @Override
    public Material getMaterial(String id) {
        return stageMaterial(materialRepository.getObject(Integer.valueOf(id)));
    }

    @Override
    public Material createNewMaterial(Material material) {
        MaterialData md = new MaterialData(material);
        int id = materialRepository.postObject(md).getId();

        for (MaterialGrade grade : material.getMaterialGrades()) {
            grade.setMaterialID(id);
            materialGradeRepository.postObject(grade);
        }

        for (String key : material.getMaterialProperties().keySet()) {
            propertyRepository.postObject(new MaterialProperty(-1, key, material.getMaterialProperties().get(key), id));
        }

        return getMaterial(id + "");
    }

    @Override
    public Material decreaseLevelAmount(int materialID, int materialGrade, double amount) {
        checkNotNegative(amount);
        changeMaterialAmount(materialID, materialGrade, -amount);
        return getMaterial(materialID+"");
    }

    private void changeMaterialAmount(int materialID, int materialGrade, double v) {
        


        throw new NotImplementedException("TODO");
    }

    private void checkNotNegative(double amount) {
        if(amount<0){
            throw new IllegalArgumentException("Amount needs to be bigger than 0");
        }
    }

    @Override
    public Material increaseLevelAmount(int materialID, int materialGrade, double amount) {
        checkNotNegative(amount);
        changeMaterialAmount(materialID, materialGrade, amount);
        return getMaterial(materialID+"");
    }

}
