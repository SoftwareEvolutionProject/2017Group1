package storage;



import model.Customer;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class PostgresSQLConnector implements storage.Persistance {

    private static final String CONNECTION_URL = "jdbc:postgresql://db:5432/svereadb";
    private static final String USERNAME = "admin";
    private static final String PWD = "1234";
    final Properties connectionProperties = new Properties();
    Connection conn = null;

    public PostgresSQLConnector() {
        try {
            this.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    @Override
    public List<Customer> getAllCustomers() {
        Statement stmt = null;
        String query = "select * from CUSTOMERS";
        List<Customer> customers = new ArrayList<>();

        try {
            stmt = this.conn.createStatement();
            ResultSet rs = stmt.executeQuery(query);

            while (rs.next()) {
                customers.add(new Customer(
                        rs.getInt("ID"),
                        rs.getString("NAME"),
                        rs.getString("EMAIL")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return customers;
    }

    @Override
    public int createNewCustomer(Customer temp) {

        PreparedStatement  stmt = null;
        String query = "INSERT INTO CUSTOMERS(NAME, EMAIL) Values(?,?)";

        try {
            stmt = this.conn.prepareStatement(query);
            stmt.setString(1, temp.getName());
            stmt.setString(2, temp.geteMail());

            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            rs.next();
            int id = rs.getInt(1);

            return id;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    @Override
    public int deleteCustomer(String customerID) {
        PreparedStatement  stmt = null;
        String query = "DELETE FROM CUSTOMERS where ID = ?";

        try {
            System.out.println(customerID);
            int id = Integer.parseInt(customerID);
            System.out.println("Deleting "+id);

            stmt = this.conn.prepareStatement(query);
            stmt.setInt(1, id);
            stmt.executeUpdate();

            return id;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    private void getConnection() throws SQLException {

        this.connectionProperties.put("user", USERNAME);
        this.connectionProperties.put("password", PWD);


        this.conn = DriverManager.getConnection(
                this.CONNECTION_URL,
                connectionProperties);

        System.out.println("Connected to database");
    }
}
