package se.chalmers.dat265.group1.api;

import se.chalmers.dat265.group1.model.DataModel;
import se.chalmers.dat265.group1.model.*;
import se.chalmers.dat265.group1.model.dbEntities.MaterialData;
import se.chalmers.dat265.group1.model.dbEntities.OrderData;
import se.chalmers.dat265.group1.model.dbEntities.OrderedPart;
import se.chalmers.dat265.group1.storage.DBInterface;
import se.chalmers.dat265.group1.storage.PostgresSQLConnector;
import se.chalmers.dat265.group1.storage.repository.GenericRepository;

public class ApiController {

    protected DBInterface dbConnector;
    protected GenericRepository<Customer> customerRepository;
    protected GenericRepository<OrderData> orderDataRepository;
    protected GenericRepository<OrderedPart> orderedPartRepository;
    protected GenericRepository<DigitalPart> digitalPartRepository;
    protected GenericRepository<PhysicalPart> physicalPartRepository;
    protected GenericRepository<PhysicalPrint> physicalPrintRepository;
    protected GenericRepository<MaterialData> materialRepository;
    protected GenericRepository<MaterialGrade> materialGradeRepository;
    protected GenericRepository<StlData> stlRepo;
    protected GenericRepository<MagicsData> magicsRepo;
    protected GenericRepository<SlmData> slmRepo;

    public ApiController(boolean debug) {
        this.dbConnector = new PostgresSQLConnector(debug);
        customerRepository = new GenericRepository<>(Customer.class, dbConnector);
        orderDataRepository = new GenericRepository<>(OrderData.class, dbConnector);
        orderedPartRepository = new GenericRepository<>(OrderedPart.class, dbConnector);
        digitalPartRepository = new GenericRepository<>(DigitalPart.class, dbConnector);
        physicalPartRepository = new GenericRepository<>(PhysicalPart.class, dbConnector);
        physicalPrintRepository = new GenericRepository<>(PhysicalPrint.class, dbConnector);
        materialRepository = new GenericRepository<>(MaterialData.class, dbConnector);
        materialGradeRepository = new GenericRepository<>(MaterialGrade.class, dbConnector);
        stlRepo = new GenericRepository<>(StlData.class,dbConnector);
        magicsRepo = new GenericRepository<>(MagicsData.class,dbConnector);
        slmRepo = new GenericRepository<>(SlmData.class,dbConnector);
    }

    protected void checkIDs(String id, DataModel object) {
        if (!id.equalsIgnoreCase(object.getId() + "")) {
            throw new IllegalArgumentException("IDs are not the same");
        }
    }
}
