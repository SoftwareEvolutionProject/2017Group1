package se.chalmers.dat265.group1.storage;
import java.sql.Connection;
import java.sql.ResultSet;

public interface DBInterface {
    public ResultSet executeQuerry(String querry);
    public Connection getConnection();
}
