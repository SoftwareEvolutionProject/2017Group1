package api;

import model.DataModel;

public class ApiController {
    protected void checkIDs(String id, DataModel object){
        if(!id.equalsIgnoreCase(object.getId()+"")){
            throw new IllegalArgumentException("IDs are not the same");
        }
    }
}
