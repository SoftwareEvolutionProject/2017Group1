package se.chalmers.dat265.group1.api.printing;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.DigitalPrint;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import java.util.*;

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
        DigitalPrintEntity dpe = extractDigitalPrintEntity(digitalPrint);
        List<MagicsPairingEntity> mpeList = extractMagicsPairingEntity(digitalPrint);

        DigitalPrintEntity returnDpe = digitalPrintRepository.postObject(dpe);
        List<MagicsPairingEntity> returnMpeList = new LinkedList<>();

        for (MagicsPairingEntity mpe : mpeList) {
            returnMpeList.add(magicsPairingRepository.postObject(mpe));
        }

        return combine(returnDpe, returnMpeList);
    }

    private DigitalPrint getPairings(DigitalPrintEntity dpe) {
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

    private List<MagicsPairingEntity> extractMagicsPairingEntity(DigitalPrint digitalPrint) {
        List<MagicsPairingEntity> mpeList = new LinkedList<>();
        Set<String> labels = digitalPrint.getMagicsPartPairing().keySet();
        for (String label : labels) {
            mpeList.add(new MagicsPairingEntity(-1, digitalPrint.getId(), digitalPrint.getMagicsPartPairing().get(label), label));
        }
        return mpeList;

    }

    private DigitalPrintEntity extractDigitalPrintEntity(DigitalPrint digitalPrint) {
        return new DigitalPrintEntity(digitalPrint.getId(), digitalPrint.getMagicsPath());
    }

    private class MagicsPairingEntity implements DataModel {
        int id, digitalPrintID, digitalPartID;
        String label;

        public MagicsPairingEntity(int id, int digitalPrintID, int digitalPartID, String label) {
            this.id = id;
            this.digitalPrintID = digitalPrintID;
            this.digitalPartID = digitalPartID;
            this.label = label;
        }

        @Override
        public int getId() {
            return id;
        }
    }

    private class DigitalPrintEntity implements DataModel {

        public DigitalPrintEntity(int id, String magicsPath) {
            this.id = id;
            this.magicsPath = magicsPath;
        }

        public DigitalPrintEntity(String magicsPath) {
            this.magicsPath = magicsPath;
            this.id = -1;
        }

        int id;
        String magicsPath;

        @Override
        public int getId() {
            return id;
        }
    }
}
