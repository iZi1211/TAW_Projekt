package connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Connect {

    private String driver = "org.postgresql.Driver";

    private String host = "195.150.230.208";

    private String port = "5432";//wymagane kiedy nie jest domyślny dla bazy

    private String dbname = "2023_warmuz_wiktor";
    private String user = "2023_warmuz_wiktor";

    private String url = "jdbc:postgresql://" + host+":"+port + "/" + dbname; private String pass = "35243";
    private Connection connection;

    public Connect() {
        connection = makeConnection(); }

    public Connection getConnection(){
        return(connection);
    }
    public void close() {
        try {

            connection.close(); }

        catch (SQLException sqle){
            System.err.println("Blad przy zamykaniu polaczenia: " + sqle);

        } }

    public Connection makeConnection(){
        try {
            Class.forName(driver);
            Connection connection = DriverManager.getConnection(url, user, pass); return(connection);

        }
        catch(ClassNotFoundException cnfe) {
            System.err.println("Blad ladowania sterownika: " + cnfe);

            return(null);
        }
        catch(SQLException sqle) {
            System.err.println("Blad przy nawiązywaniu polaczenia: " + sqle);

            return(null);
        }
    } }
