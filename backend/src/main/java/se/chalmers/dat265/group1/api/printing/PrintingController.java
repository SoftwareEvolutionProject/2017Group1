package se.chalmers.dat265.group1.api.printing;

import se.chalmers.dat265.group1.api.ApiController;
import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.DigitalPrint;
import se.chalmers.dat265.group1.model.MagicsData;
import se.chalmers.dat265.group1.model.StlData;
import se.chalmers.dat265.group1.model.dbEntities.DigitalPrintData;
import se.chalmers.dat265.group1.model.dbEntities.MagicsPairing;
import se.chalmers.dat265.group1.model.dto.DigitalPrintMagics;
import se.chalmers.dat265.group1.storage.FileUtil;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
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
            System.out.println("Getting stuff for " + dpe.getId());
            resultList.add(populatePathIfExist(getPairings(dpe)));
        }

        return resultList;
    }

    @Override
    public DigitalPrint getDigitalPrint(String id) {
        DigitalPrintData dpe = digitalPrintRepository.getObject(Integer.valueOf(id));
        return populatePathIfExist(getPairings(dpe));
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

    @Override
    public MagicsData uploadMagicsFile(String id, byte[] body, String basePath) throws IOException {
        boolean exist = false;
        try {
            exist = magicsRepo.getObject(Integer.valueOf(id)) != null;
        } catch (Exception e) {
            exist = false;
        }
        if (exist) {
            throw new FileAlreadyExistsException("ID have file");
        }
        String path = "/magics/" + id + "-" + Arrays.hashCode(body) + ".magics";
        FileUtil.write(body, basePath + path);
        return magicsRepo.postObject(new MagicsData(Integer.valueOf(id), path));
    }

    private DigitalPrint getPairings(DigitalPrintData dpe) {
        List<MagicsPairing> mpeList = magicsPairingRepository.getObjects("digitalPrintID = " + dpe.getId());
        System.out.println("Found " + mpeList.size() + " number of pairings");
        return combine(dpe, mpeList);
    }

    private DigitalPrint combine(DigitalPrintData dp, List<MagicsPairing> mpList) {
        Map<String, Integer> magicsPartPairing = new HashMap<>();

        for (MagicsPairing mpe : mpList) {
            System.out.println("Label: " + mpe.getLabel());
            magicsPartPairing.put(mpe.getLabel(), mpe.getDigitalPartID());
        }

        return new DigitalPrint(dp.getId(), dp.getName(), magicsPartPairing);
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
        return new DigitalPrintData(digitalPrint.getId(), digitalPrint.getName());
    }

    private DigitalPrint populatePathIfExist(DigitalPrint digitalPrint) {
        List<MagicsData> magicsData = magicsRepo.getObjects("digitalPrintID= "+ digitalPrint.getId());
        if(magicsData.size()==1){
            return new DigitalPrintMagics(digitalPrint, magicsData.get(0).getPath());
        }
        return digitalPrint;
    }

}
