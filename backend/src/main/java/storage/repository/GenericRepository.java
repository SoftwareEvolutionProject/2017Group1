package storage.repository;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import model.DataModel;
import storage.DBInterface;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Basic repository class that can take any model.
 *
 * Several things are presumed:
 * - The model must have a default constructor
 * - The model must set default values
 * - The model must only use int, boolean or string (currently)
 */
public class GenericRepository <T extends DataModel> {

    private final Gson gson;
    private final Class<T> type;
    private DBInterface dbInterface;

    public GenericRepository(Class<T> type, DBInterface dbInterface){
        this.gson = new Gson();
        this.dbInterface = dbInterface;
        this.type = type;
    }

    /***
     * gets all objects matching given type
     * @return
     */
    public List<T> getObjects() {
        String query = "SELECT * FROM "+ type.getSimpleName();
        System.out.println("Running query: "+query);
        ResultSet rs =  this.dbInterface.executeQuerry(query);
        try {
            return this.getMatchJSON(rs); //converts resulting set to model instance
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /***
     * Gets specific instance of model
     * @param id
     * @return
     */
    public T getObject(int id) {
        String query = "SELECT * FROM "+ type.getSimpleName() +" WHERE id="+id;
        System.out.println("Running query: "+query);
        ResultSet rs =  this.dbInterface.executeQuerry(query);
        try {
            return this.getMatchJSON(rs).iterator().next(); //converts resulting set to model instance
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /***
     * Creates an given instance om model
     * @param object
     * @return
     */
    public T postObject(T object) {
        JsonObject jsonObject = this.gson.toJsonTree(object).getAsJsonObject();
        StringBuilder query = new StringBuilder("INSERT INTO "+ type.getSimpleName() +" (");

        for (String key : jsonObject.keySet()){
            if(Objects.equals(key, "id"))continue; //skip ID
            String last = query.substring(query.length() - 1);
            if(!last.equals("(")){ //first
                query.append(", ");
            }
            query.append(key);
        }
        query.append(")");

        for(int i = 0; i < jsonObject.keySet().size(); i++){
            query.append(i==0?" VALUES (":i==1?"?":",?"); //skip ID
        }
        query.append(")");

        return execute(jsonObject, query);
    }

    /***
     * Updates a model already in the system, currently updates ALL fields no matter how many are set (probably)
     * @param object
     * @return
     */
    public T updateObject(T object) {
        JsonObject jsonObject = this.gson.toJsonTree(object).getAsJsonObject();
        StringBuilder query = new StringBuilder("UPDATE "+ type.getSimpleName()+" SET");

        for (String key : jsonObject.keySet()){
            if(Objects.equals(key, "id"))continue; //skip id
            String last = query.substring(query.length() - 1);
            query.append(
                last.equals("T")?
                    " "+key :
                    " = ?, "+key);
        }
        query.append(" = ? ");
        query.append( " WHERE id="+object.getId());

        return execute(jsonObject, query);
    }

    private T execute(JsonObject jsonObject2, StringBuilder query2) {
        try {
            PreparedStatement ps = getPreparedStatementFromJSON(jsonObject2, query2); //maps model data to the query
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            rs.next();
            int id = rs.getInt(1);
            return this.getObject(id);
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /***
     * Deletes a specific model instance
     * @param id
     * @return
     */
    public T deleteObject(int id) {
        String query = "DELETE * FROM "+ type.getSimpleName() +" WHERE id="+id;
        System.out.println("Running query: "+query);
        ResultSet rs =  this.dbInterface.executeQuerry(query);
        try {
            return this.getMatchJSON(rs).iterator().next();
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /***
     * Attempts to convert result set to a model instance
     * @param rs the result set from a querry
     * @return An Object instance of given generic type
     * @throws SQLException if error with result set
     */
    private List<T> getMatchJSON(ResultSet rs) throws SQLException {

        List<T> results = new ArrayList<T>();
        T result = null;
        while(rs.next()){
            try {
                result = type.newInstance();
            } catch (InstantiationException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }

            JsonObject jsonModel = this.gson.toJsonTree(result).getAsJsonObject();

            for (String key : jsonModel.keySet()){
                JsonElement valWrapper = jsonModel.get(key);
                JsonPrimitive val = null;

                if(valWrapper.isJsonPrimitive()){
                    val = valWrapper.getAsJsonPrimitive();
                } else {
                    throw new IllegalArgumentException("Invalid class");
                }

                if (val.isNumber()){
                    jsonModel.addProperty(key, rs.getInt(key));
                } else if (val.isString()){
                    jsonModel.addProperty(key, rs.getString(key));
                } else if (val.isBoolean()){
                    jsonModel.addProperty(key, rs.getString(key));
                }
            }
            results.add(gson.fromJson(jsonModel,this.type));
        }
        return results;
    }

    /***
     * Maps a JSON objects field values to a prepared statement
     * @param jsonObject
     * @param query
     * @return
     * @throws SQLException
     */
    private PreparedStatement getPreparedStatementFromJSON(JsonObject jsonObject, StringBuilder query) throws SQLException {
        System.out.println("Preparing query: "+query.toString());
        PreparedStatement ps = this.dbInterface.getConnection().prepareStatement(
                query.toString(),
                Statement.RETURN_GENERATED_KEYS
        );

        int i = 1;
        for (String key : jsonObject.keySet()){
            if(Objects.equals(key, "id"))continue; //skip ID
            JsonElement valWrapper = jsonObject.get(key);
            JsonPrimitive val = null;

            if(valWrapper.isJsonPrimitive()){
                val = valWrapper.getAsJsonPrimitive();
            } else {
                throw new IllegalArgumentException("Invalid Object");
            }

            if (val.isNumber()){
                ps.setInt(i, val.getAsInt());
            } else if (val.isString()){
                ps.setString(i, val.getAsString());
            } else if (val.isBoolean()){
                ps.setBoolean(i, val.getAsBoolean());
            }
            i++;
        }
        return ps;
    }

}
