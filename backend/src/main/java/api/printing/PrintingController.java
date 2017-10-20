package api.printing;

import api.ApiController;
import model.DataModel;
import model.DigitalPrint;
import storage.repository.GenericRepository;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class PrintingController extends ApiController implements PrintingInterface {
    private GenericRepository<DigitalPrintEntity> digitalPrintRepository;
    private GenericRepository<MagicsPairingEntity> magicsPairingRepository;


    public PrintingController(boolean debug) {
        super(debug);
        digitalPrintRepository = new GenericRepository<>(DigitalPrintEntity.class, dbConnector);
        magicsPairingRepository = new GenericRepository<>(MagicsPairingEntity.class, dbConnector);
    }

    @Override
    public List<DigitalPrint> getAllDigitalPrints() {
        List<DigitalPrint> resultList = new LinkedList<>();
        List<DigitalPrintEntity> dpeList = digitalPrintRepository.getObjects();
        for (DigitalPrintEntity dpe : dpeList) {
            resultList.add(getPairings(dpe));
        }

        return resultList;
    }

    @Override
    public DigitalPrint getDigitalPrint(String id) {
        DigitalPrintEntity dpe = digitalPrintRepository.getObject(Integer.valueOf(id));
        return getPairings(dpe);
    }

    @Override
    public DigitalPrint createDigitalPrint(DigitalPrint digitalPrint) {
        throw new NotImplementedException();
        //return digitalPrintRepository.postObject(digitalPrint);
    }

    @Override
    public DigitalPrint updateDigitalPrint(String id, DigitalPrint digitalPrint) {
        throw new NotImplementedException();
        //checkIDs(id, digitalPrint);
        //return digitalPrintRepository.updateObject(digitalPrint);
    }

    private DigitalPrint getPairings(DigitalPrintEntity dpe){
        List<MagicsPairingEntity> mpeList = magicsPairingRepository.getObjects("digitalPrintID=" + dpe.id);
        return combine(dpe, mpeList);
    }

    private DigitalPrint combine(DigitalPrintEntity dp, List<MagicsPairingEntity> mpList) {
        Map<String, Integer> magicsPartPairing = new HashMap<>();

        for (MagicsPairingEntity mpe : mpList) {
            magicsPartPairing.put(mpe.label, mpe.digitalPartID);
        }

        return new DigitalPrint(dp.id, dp.magicsPath, magicsPartPairing);
    }

    private class MagicsPairingEntity implements DataModel {
        int id, digitalPrintID, digitalPartID;
        String label;

        @Override
        public int getId() {
            return id;
        }
    }

    private class DigitalPrintEntity implements DataModel {
        int id;
        String magicsPath;

        @Override
        public int getId() {
            return id;
        }
    }
}
