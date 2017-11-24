package se.chalmers.dat265.group1.storage;
import java.sql.Connection;
import java.sql.ResultSet;

public interface DBInterface {
    public ResultSet executeQuery(String querry);
    public Connection getConnection();
}
