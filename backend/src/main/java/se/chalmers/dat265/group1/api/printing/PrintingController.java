package se.chalmers.dat265.group1.api.printing;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.DigitalPrint;
import se.chalmers.dat265.group1.model.dbEntities.DigitalPrintData;
import se.chalmers.dat265.group1.model.dbEntities.MagicsPairing;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import java.util.*;

public class PrintingController extends ApiController implements PrintingAPI {
    private GenericRepository<DigitalPrintData> digitalPrintRepository;
    private GenericRepository<MagicsPairing> magicsPairingRepository;

    public PrintingController(boolean debug) {
        super(debug);
        digitalPrintRepository = new GenericRepository<>(DigitalPrintData.class, dbConnector);
        magicsPairingRepository = new GenericRepository<>(MagicsPairing.class, dbConnector);
    }

    @Override
    public List<DigitalPrint> getAllDigitalPrints() {
        List<DigitalPrint> resultList = new LinkedList<>();
        List<DigitalPrintData> dpeList = digitalPrintRepository.getObjects();
        for (DigitalPrintData dpe : dpeList) {
            System.out.println("Getting stuff for "+ dpe.getId());
            resultList.add(getPairings(dpe));
        }

        return resultList;
    }

    @Override
    public DigitalPrint getDigitalPrint(String id) {
        DigitalPrintData dpe = digitalPrintRepository.getObject(Integer.valueOf(id));
        return getPairings(dpe);
    }

    @Override
    public DigitalPrint createDigitalPrint(DigitalPrint digitalPrint) {
        DigitalPrintData dpe = extractDigitalPrintEntity(digitalPrint);
        List<MagicsPairing> mpeList = extractMagicsPairingEntity(digitalPrint);

        DigitalPrintData returnDpe = digitalPrintRepository.postObject(dpe);
        List<MagicsPairing> returnMpeList = new LinkedList<>();

        for (MagicsPairing mpe : mpeList) {
            mpe.setDigitalPrintID(returnDpe.getId());
            returnMpeList.add(magicsPairingRepository.postObject(mpe));
        }

        return combine(returnDpe, returnMpeList);
    }

    private DigitalPrint getPairings(DigitalPrintData dpe) {
        List<MagicsPairing> mpeList = magicsPairingRepository.getObjects("digitalPrintID = " + dpe.getId());
        System.out.println("Found "+ mpeList.size() +  " number of pairings");
        return combine(dpe, mpeList);
    }

    private DigitalPrint combine(DigitalPrintData dp, List<MagicsPairing> mpList) {
        Map<String, Integer> magicsPartPairing = new HashMap<>();

        for (MagicsPairing mpe : mpList) {
            System.out.println("Label: "+ mpe.getLabel());
            magicsPartPairing.put(mpe.getLabel(), mpe.getDigitalPartID());
        }

        return new DigitalPrint(dp.getId(), dp.getMagicsPath(), magicsPartPairing);
    }

    private List<MagicsPairing> extractMagicsPairingEntity(DigitalPrint digitalPrint) {
        List<MagicsPairing> mpeList = new LinkedList<>();
        Set<String> labels = digitalPrint.getMagicsPartPairing().keySet();
        for (String label : labels) {
            mpeList.add(new MagicsPairing(-1, digitalPrint.getId(), digitalPrint.getMagicsPartPairing().get(label), label));
        }
        return mpeList;

    }

    private DigitalPrintData extractDigitalPrintEntity(DigitalPrint digitalPrint) {
        return new DigitalPrintData(digitalPrint.getId(), digitalPrint.getMagicsPath());
    }

}
