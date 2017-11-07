package se.chalmers.dat265.group1.storage;

import java.sql.*;
import java.util.Properties;
import org.apache.commons.logging.*;

public class PostgresSQLConnector implements DBInterface {
    private Log log = LogFactory.getLog(PostgresSQLConnector.class);
    private static final String CONNECTION_URL_DOCKER = "jdbc:postgresql://db:5432/svereadb";
    private static final String CONNECTION_URL_DEBUG = "jdbc:postgresql://localhost:5433/svereadb";
    private static final String USERNAME = "admin";
    private static final String PWD = "1234";

    private static String CONNECTION_URL;
    final Properties connectionProperties = new Properties();
    Connection conn = null;

    public PostgresSQLConnector(boolean debug) {
        CONNECTION_URL = debug ? CONNECTION_URL_DEBUG : CONNECTION_URL_DOCKER;
        try {
            this.establishConnection();
        } catch (SQLException e) {
            log.error("Constructor", e);
            e.printStackTrace();
        }
    }

    private void establishConnection() throws SQLException {

        this.connectionProperties.put("user", USERNAME);
        this.connectionProperties.put("password", PWD);

        this.conn = DriverManager.getConnection(this.CONNECTION_URL, connectionProperties);

        System.out.println("Connected to database");
    }

    @Override
    public ResultSet executeQuerry(String query) {
        PreparedStatement stmt = null;

        try {
            stmt = this.conn.prepareStatement(query);
            return stmt.executeQuery();
        } catch (SQLException e) {
            log.error("executeQuerry", e);
        } finally {
            System.out.println("Execute Querry failed");
        }
        return null;
    }

    @Override
    public Connection getConnection() {
        return this.conn;
    }
}
