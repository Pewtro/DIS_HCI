package server.providers;

import server.models.Event;
import server.models.Student;
import server.utility.Authenticator;

import java.sql.*;
import java.util.ArrayList;

public class StudentTable extends DBmanager {
    private ResultSet resultSet;
    private Student student;

    /**
     * @param idStudent
     * @return Attending Events
     */
    public ArrayList<Event> getAttendingEvents(int idStudent) {
        ArrayList<Event> attendingEvents = new ArrayList<>();
        //henter alle events en studerende deltager på.
        try {
            PreparedStatement getAttendingEvents = getConnection().prepareStatement
                    ("SELECT she.*, s.*, e.* " +
                            "FROM students_has_dsevent she " +
                            "INNER JOIN students s " +
                            "ON she.students_idStudent = s.idStudent " +
                            "INNER JOIN dsevent e " +
                            "ON she.dsevent_idEvent = e.idEvent " +
                            "WHERE s.idStudent = ? AND e.isDeleted = 0");

            getAttendingEvents.setInt(1, idStudent);
            resultSet = getAttendingEvents.executeQuery();

            while (resultSet.next()) {
                try {
                    //Opretter ny instans af de studenter der er i ArrayListen. (Måden man henter oplysninger).
                    Event event = new Event();
                    event.setIdEvent(resultSet.getInt("idEvent"));
                    event.setEventName(resultSet.getString("eventName"));
                    event.setOwner(resultSet.getInt("owner"));
                    event.setLocation(resultSet.getString("location"));
                    event.setPrice(resultSet.getInt("price"));
                    event.setEventDate(resultSet.getString("eventDate"));
                    event.setDescription(resultSet.getString("description"));

                    attendingEvents.add(event);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            resultSet.close();
            getAttendingEvents.close();
        } catch (SQLException sqlException) {
            System.out.println(sqlException.getMessage());
        }
        //Returnerer attendingStudents med oplysninger.
        return attendingEvents;
    }

    /**
     * @param student
     * @return True
     * @throws SQLException
     */
    public void addStudent(Student student) throws SQLException {
        long unixTime = System.currentTimeMillis() / 1000L;
        //generer salt password
        student.setSalt(student.getEmail() + unixTime);

        //generer hashed password med salt.
        student.setPassword(Authenticator.hashWithSalt(student.getPassword(), student.getSalt()));
        student.setCreatedTime(unixTime);

        PreparedStatement addStudentStatement = getConnection().prepareStatement
                ("INSERT INTO students (firstName, lastName, email, password, createdTime) VALUES (?, ?, ?, ?, ?)");

        try {
            addStudentStatement.setString(1, student.getFirstName());
            addStudentStatement.setString(2, student.getLastName());
            addStudentStatement.setString(3, student.getEmail());
            addStudentStatement.setString(4, student.getPassword());
            addStudentStatement.setLong(5, student.getCreatedTime());
            try {
                int rowsUpdated = addStudentStatement.executeUpdate();
                if (rowsUpdated != 1) {
                    throw new SQLException("More or less than 1 row was affected");
                }
            } catch (SQLIntegrityConstraintViolationException integrity) {
                integrity.printStackTrace();
                throw new SQLException("the user already exists");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new SQLException("SQL Error");
        }
        addStudentStatement.close();
    }

    /**
     * @param email
     * @return Student by Email
     */
    public Student getStudentByEmail(String email) {

        try {
            PreparedStatement getStudentEmailStatement = getConnection().prepareStatement("SELECT * FROM students WHERE email = ?");

            getStudentEmailStatement.setString(1, email);
            resultSet = getStudentEmailStatement.executeQuery();

            while (resultSet.next()) {
                student = new Student();
                student.setIdStudent(resultSet.getInt("idStudent"));
                student.setEmail(resultSet.getString("email"));
                student.setPassword(resultSet.getString("password"));
                student.setCreatedTime(resultSet.getLong("createdTime"));
            }

            if (student == null) {
                throw new IllegalArgumentException();
            }
            resultSet.close();
            getStudentEmailStatement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return student;
    }

    // Sletter en token i databasen til et bestemt idStudent

    /**
     * @param idStudent the id of the student
     * @return False
     * @throws SQLException
     */
    public boolean deleteToken(String idStudent) throws SQLException {
        PreparedStatement deleteTokenStatement = getConnection().prepareStatement(" DELETE FROM tokens WHERE token = ?");

        try {
            deleteTokenStatement.setString(1, idStudent);
            int rowsAffected = deleteTokenStatement.executeUpdate();
            deleteTokenStatement.close();
            return rowsAffected == 1;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Indsætter en token i DB til et bestemt idStudent

    /**
     * @param token
     * @param idStudent
     * @return True or False
     */
    public void addToken(String token, int idStudent) {
        PreparedStatement addTokenStatement;
        try {
            addTokenStatement = getConnection().prepareStatement("INSERT INTO tokens (token, students_idStudent) VALUES (? , ?)");
            addTokenStatement.setString(1, token);
            addTokenStatement.setInt(2, idStudent);
            addTokenStatement.executeUpdate();
            addTokenStatement.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * @param token
     * @return Student
     */
    public Student getStudentFromToken(String token) {
        try {
            PreparedStatement getStudentFromToken = getConnection().prepareStatement("SELECT idStudent, firstName, lastName, email, createdTime FROM students s INNER JOIN tokens t ON t.students_idStudent = s.idStudent WHERE t.token = ?");
            getStudentFromToken.setString(1, token);
            resultSet = getStudentFromToken.executeQuery();

            while (resultSet.next()) {
                student = new Student();
                student.setIdStudent(resultSet.getInt("idStudent"));
                student.setFirstName(resultSet.getString("firstName"));
                student.setLastName(resultSet.getString("lastName"));
                student.setEmail(resultSet.getString("email"));
                student.setCreatedTime(resultSet.getLong("createdTime"));

            }
            resultSet.close();
            getStudentFromToken.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return student;
    }

}