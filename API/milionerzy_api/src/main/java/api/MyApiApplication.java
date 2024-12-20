package api;

import connection.Connect;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sun.mail.smtp.SMTPTransport;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;


import java.sql.*;
import java.util.Random;

@SpringBootApplication
@RestController
public class MyApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApiApplication.class, args);
    }

    @Configuration
    public class CorsConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**") // Zezwolenie na dostęp do wszystkich endpointów
                    .allowedOrigins("http://localhost:4200") // Określenie dozwolonej domeny
                    .allowedMethods("GET", "POST", "PUT", "DELETE") // Zezwolenie na metody HTTP
                    .allowedHeaders("*") // Zezwolenie na wszystkie nagłówki
                    .allowCredentials(true); // Możliwość wysyłania ciasteczek
        }
    }


    @GetMapping("/question")
    public String getQuestion(@RequestParam(name = "roundNumber") String roundNumber) {
        Connect connect = new Connect();
        Connection connection = connect.getConnection();
        String pytanie = "blad";
        if (connection != null) {
            try {
                // Tworzenie zapytania SQL
                String query = "SELECT * FROM milionerzy.pytania WHERE numer_rundy = "+roundNumber;
                Random random = new Random();
                int randomNumber = random.nextInt(10)+1;
                pytanie += randomNumber;
                // Wykonanie zapytania
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(query);

                // Przetwarzanie wyników zapytania
                for(int i = 0; i < randomNumber; i++) {
                    resultSet.next();
                }
                // Pobieranie wartości z kolumn w wyniku zapytania

                pytanie = resultSet.getString("tresc");
                pytanie += "/"+resultSet.getString("odpowiedz_a");
                pytanie += "/"+resultSet.getString("odpowiedz_b");
                pytanie += "/"+resultSet.getString("odpowiedz_c");
                pytanie += "/"+resultSet.getString("odpowiedz_d");
                pytanie += "/"+resultSet.getString("prawidlowa");

                // Zamknięcie obiektów ResultSet i Statement
                resultSet.close();
                statement.close();

            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close(); // Zamknięcie połączenia
            }

        }
        return pytanie;
    }

    @GetMapping("/ranking")
    public String getRanking(){
        String ranking = "404";
        Connect connect = new Connect();
        Connection connection = connect.getConnection();
        if (connection != null) {
            try {
                // Tworzenie zapytania SQL
                String query = "SELECT tabilca_wynikow.wynik, uzytkownicy.login FROM milionerzy.tabilca_wynikow INNER JOIN milionerzy.uzytkownicy ON tabilca_wynikow.uzytkownik=uzytkownicy.id_uzytkownika ORDER BY wynik DESC LIMIT 10";


                // Wykonanie zapytania
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(query);

                // Przetwarzanie wyników zapytania
                ranking = "";
                while(resultSet.next()){
                    // Pobieranie wartości z kolumn w wyniku zapytania
                    ranking += resultSet.getString("login");
                    ranking += "/"+resultSet.getString("wynik")+";";
                }
                // Zamknięcie obiektów ResultSet i Statement
                resultSet.close();
                statement.close();

            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close(); // Zamknięcie połączenia
            }

        }
        return ranking;
    }

    @GetMapping("/login")
    public String checkLogin(@RequestParam(name = "login") String login, @RequestParam(name = "password") String password){
        String logSucces = "false";
        int count = 0;
        Connect connect = new Connect();
        Connection connection = connect.getConnection();
        if (connection != null) {
            try {
                // Tworzenie zapytania SQL
                String query = "SELECT id_uzytkownika FROM milionerzy.uzytkownicy WHERE login = ? AND haslo = ?";

                PreparedStatement statement = connection.prepareStatement(query);

                // Ustawienie wartości parametrów
                statement.setString(1, login);
                statement.setString(2, password);

                // Wykonanie zapytania
                ResultSet resultSet = statement.executeQuery();


                // Przetwarzanie wyników zapytania
                while(resultSet.next()){
                    count++;
                }
                if(count>0){
                    logSucces="true";
                }
                // Zamknięcie obiektów ResultSet i Statement
                resultSet.close();
                statement.close();

            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close(); // Zamknięcie połączenia
            }

        }
        return logSucces;
    }

    @PostMapping("/register")
    public String addUser(@RequestParam(name = "login") String login, @RequestParam(name = "password") String password, @RequestParam(name = "mail") String mail) {
        String success = "0";
        int count = 0;

        Connect connect = new Connect();
        Connection connection = connect.getConnection();
        if (connection != null) {
            try {
                connection.setAutoCommit(false); // włączenie ręcznego zarządzania transakcjami

                // Tworzenie zapytania SQL
                String query = "SELECT id_uzytkownika FROM milionerzy.uzytkownicy WHERE login = ?";

                PreparedStatement statement = connection.prepareStatement(query);

                // Ustawienie wartości parametrów
                statement.setString(1, login);

                // Wykonanie zapytania
                ResultSet resultSet = statement.executeQuery();


                // Przetwarzanie wyników zapytania
                while(resultSet.next()){
                    count++;
                }
                if(count!=0){
                    success="69";
                }else {

                    // Utworzenie zapytania SQL
                    query = "INSERT INTO milionerzy.uzytkownicy (login, haslo, mail, aktywowane) VALUES (?, ?, ?, false)";

                    PreparedStatement statement2 = connection.prepareStatement(query);
                    statement2.setString(1, login);
                    statement2.setString(2, password);
                    statement2.setString(3, mail);


                    // Wykonanie instrukcji SQL
                    int rowsAffected = statement2.executeUpdate();

                    if (rowsAffected == 1) { // Jeżeli wstawiono dokładnie jeden wiersz
                        success = "420";
                        connection.commit(); // zatwierdzenie tranzakcji
                    } else {
                        connection.rollback(); // wycofanie tranzakcji
                    }

                    // Zamknięcie obiektów Statement i Connection
                    statement.close();
                    statement2.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
                try {
                    connection.rollback(); // wycofanie tranzakcji w przypadku błędu SQL
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            } finally {
                connect.close(); // zamknięcie połączenia z bazą danych
            }
        }
        return success;
    }
    @PostMapping("/saveScore")
    public String saveScore(@RequestParam(name = "login") String login, @RequestParam(name = "score") String score){
        String success = "0";
        int count = 0;
        Connect connect = new Connect();
        Connection connection = connect.getConnection();
        if (connection != null) {
            try {
                connection.setAutoCommit(false); // włączenie ręcznego zarządzania transakcjami




                // Utworzenie zapytania SQL
                String query = "INSERT INTO milionerzy.tabilca_wynikow (uzytkownik,wynik) VALUES((SELECT id_uzytkownika FROM milionerzy.uzytkownicy WHERE login = ?),?)";

                // Przygotowanie instrukcji SQL z parametrami
                PreparedStatement statement2 = connection.prepareStatement(query);
                statement2.setString(1, login);
                statement2.setInt(2, Integer.parseInt(score));

                // Wykonanie instrukcji SQL
                int rowsAffected = statement2.executeUpdate();

                if (rowsAffected == 1) { // Jeżeli wstawiono dokładnie jeden wiersz
                    success = "420";
                    connection.commit(); // zatwierdzenie tranzakcji
                } else {
                    connection.rollback(); // wycofanie tranzakcji
                }

                // Zamknięcie obiektów Statement i Connection

                statement2.close();

            } catch (SQLException e) {
                e.printStackTrace();
                try {
                    connection.rollback(); // wycofanie tranzakcji w przypadku błędu SQL
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            } finally {
                connect.close(); // zamknięcie połączenia z bazą danych
            }
        }
        return success;
    }

    private String getActivationCodeFromDatabase(String login) {
        Connect connect = new Connect();
        Connection connection = connect.getConnection();
        String activationCode = null;

        if (connection != null) {
            try {
                String query = "SELECT kod FROM milionerzy.kody_aktywacji " +
                        "JOIN milionerzy.uzytkownicy ON kody_aktywacji.id_uzytkownika = uzytkownicy.id_uzytkownika " +
                        "WHERE uzytkownicy.login = ?";
                PreparedStatement statement = connection.prepareStatement(query);
                statement.setString(1, login);


                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    activationCode = resultSet.getString("kod");
                }

                resultSet.close();
                statement.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close();
            }
        }

        return activationCode;
    }


    private String getEmailFromDatabase(String login) {
        Connect connect = new Connect();
        Connection connection = connect.getConnection();
        String email = null;

        if (connection != null) {
            try {
                String query = "SELECT mail FROM milionerzy.uzytkownicy WHERE login = ?";
                PreparedStatement statement = connection.prepareStatement(query);
                statement.setString(1, login);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    email = resultSet.getString("mail");
                }

                resultSet.close();
                statement.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close();
            }
        }

        return email;
    }

    private void sendActivationEmail(String email, String activationCode) {
         final String username = "javatok121@gmail.com";
        //final String username = nadawca;
        final String password = "ulbfkfxedyvjiwpk";

        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "465");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.socketFactory.port", "465");
        prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        Session session = Session.getInstance(prop,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("from@gmail.com"));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(email)
            );
            message.setSubject("Milionerzy - Kod aktywacyjny");

            // Create the message part
            BodyPart messageBodyPart = new MimeBodyPart();

            // Now set the actual message
            messageBodyPart.setText("Kod: "+activationCode);

            // Create a multipar message
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);


            message.setContent(multipart);

            Transport.send(message);

            System.out.println("Done");

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


    @GetMapping("/sendActivationCode")
    public String sendActivationCode(@RequestParam(name = "login") String login) {
        String activationCode = getActivationCodeFromDatabase(login);

        if (activationCode != null) {
            String email = getEmailFromDatabase(login);

            if (email != null) {
                sendActivationEmail(email, activationCode);
                return "Activation code sent successfully";
            } else {
                return "Error: User does not have a valid email address.";
            }
        } else {
            return "Error: Activation code not found in the database.";
        }
    }

    @GetMapping("/activateUser")
    public String activateUser(@RequestParam(name = "login") String login) {
        Connect connect = new Connect();
        Connection connection = connect.getConnection();

        if (connection != null) {
            try {
                // Aktualizacja flagi aktywacji
                String updateActivationFlagQuery = "UPDATE milionerzy.uzytkownicy SET aktywowane = true WHERE login = ?";
                PreparedStatement updateActivationFlagStatement = connection.prepareStatement(updateActivationFlagQuery);
                updateActivationFlagStatement.setString(1, login);

                int rowsAffected = updateActivationFlagStatement.executeUpdate();

                // Zamknięcie obiektów PreparedStatement
                updateActivationFlagStatement.close();

                if (rowsAffected > 0) {
                    return "User activated successfully";
                } else {
                    return "Error: Unable to update activation status";
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close();
            }
        }

        return "Error: Database connection error";
    }

    @GetMapping("/getActivationCode")
    public String getActivationCode(@RequestParam(name = "login") String login) {
        Connect connect = new Connect();
        Connection connection = connect.getConnection();

        if (connection != null) {
            try {
                String query = "SELECT kod FROM milionerzy.kody_aktywacji " +
                        "JOIN milionerzy.uzytkownicy ON kody_aktywacji.id_uzytkownika = uzytkownicy.id_uzytkownika " +
                        "WHERE uzytkownicy.login = ?";
                PreparedStatement statement = connection.prepareStatement(query);
                statement.setString(1, login);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    String activationCode = resultSet.getString("kod");
                    resultSet.close();
                    statement.close();
                    connect.close();
                    return activationCode;
                } else {
                    resultSet.close();
                    statement.close();
                    connect.close();
                    return "Error: Activation code not found in the database.";
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close();
            }
        }

        return "Error: Database connection error";
    }

    @GetMapping("/getActivationStatus")
    public String getActivationStatus(@RequestParam(name = "login") String login) {
        Connect connect = new Connect();
        Connection connection = connect.getConnection();

        if (connection != null) {
            try {
                String query = "SELECT aktywowane FROM milionerzy.uzytkownicy WHERE login = ?";
                PreparedStatement statement = connection.prepareStatement(query);
                statement.setString(1, login);

                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    boolean activationStatus = resultSet.getBoolean("aktywowane");
                    resultSet.close();
                    statement.close();
                    connect.close();
                    return activationStatus ? "Activated" : "Not Activated";
                } else {
                    resultSet.close();
                    statement.close();
                    connect.close();
                    return "Error: User not found in the database.";
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connect.close();
            }
        }

        return "Error: Database connection error";
    }


    private void sendScoreEmail(String email, Integer score) {
        final String username = "javatok121@gmail.com";
        //final String username = nadawca;
        final String password = "ulbfkfxedyvjiwpk";

        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "465");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.socketFactory.port", "465");
        prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        Session session = Session.getInstance(prop,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("from@gmail.com"));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(email)
            );
            message.setSubject("Milionerzy - Wynik gry");

            // Create the message part
            BodyPart messageBodyPart = new MimeBodyPart();

            // Now set the actual message
            messageBodyPart.setText("Wynik: "+score.toString());


            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);

            message.setContent(multipart);

            Transport.send(message);

            System.out.println("Done");

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }



    @GetMapping("/sendScore")
    public String sendScore(@RequestParam(name = "login") String login,@RequestParam(name = "wynik") Integer wynik) {



            String email = getEmailFromDatabase(login);

            if (email != null) {
                sendScoreEmail(email, wynik);
                return "Score sent successfully";
            } else {
                return "Error: User does not have a valid email address.";
            }

    }


}