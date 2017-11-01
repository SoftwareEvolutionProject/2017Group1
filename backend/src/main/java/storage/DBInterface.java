package storage;
import java.sql.Connection;
import java.sql.ResultSet;

public interface DBInterface {
    public ResultSet executeQuerry(String querry);
    public Connection getConnection();
}
