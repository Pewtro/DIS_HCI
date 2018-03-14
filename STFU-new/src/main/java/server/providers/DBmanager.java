package server.providers;

import server.config.Config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DBmanager {

    //Har ikke public/private da den så er package-private

    /**
     * @return Connection
     */
    Connection getConnection() {

        Connection connection = null;

        try {
            try {
                Class.forName("com.mysql.jdbc.Driver").newInstance();
            } catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
                e.printStackTrace();
            }
            connection = DriverManager.getConnection(
                    "jdbc:mysql://"
                            + Config.getDbUrl() + ":"
                            + Config.getDbPort() + "/"
                            + Config.getDbName() + "?useSSL=false&serverTimezone=GMT",
                    Config.getDbUser(),
                    Config.getDbPassword());
        } catch (SQLException sqlException) {
            System.out.print(sqlException.getMessage());
            sqlException.printStackTrace();
        }
        return connection;
    }

    // Lukker forbindelsen til databasen
    public void close() {
        try {
            this.getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}


