package storage;



import java.sql.*;
import java.util.Properties;

public class PostgresSQLConnector implements DBInterface {

    private static final String CONNECTION_URL = "jdbc:postgresql://db:5432/svereadb";
    private static final String USERNAME = "admin";
    private static final String PWD = "1234";
    final Properties connectionProperties = new Properties();
    Connection conn = null;

    public PostgresSQLConnector() {
        try {
            this.establishConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void establishConnection() throws SQLException {

        this.connectionProperties.put("user", USERNAME);
        this.connectionProperties.put("password", PWD);


        this.conn = DriverManager.getConnection(
                this.CONNECTION_URL,
                connectionProperties);

        System.out.println("Connected to database");
    }

    @Override
    public ResultSet executeQuerry(String query) {
        PreparedStatement  stmt = null;

        try {
            stmt = this.conn.prepareStatement(query);
            return stmt.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Connection getConnection() {
        return this.conn;
    }
}
