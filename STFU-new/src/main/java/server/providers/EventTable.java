package server.providers;

import server.models.Event;
import server.models.Student;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;


public class EventTable extends DBmanager {

    private ResultSet resultSet;

    /**
     * @return all Events
     */
    public ArrayList<Event> getAllEvents() {
        ArrayList<Event> allEvents = new ArrayList<>();

        try {
            PreparedStatement getAllEventsStatement = getConnection().prepareStatement("SELECT * FROM dsevent WHERE isDeleted = 0");
            resultSet = getAllEventsStatement.executeQuery();
            eventGetter(allEvents);
            resultSet.close();
            getAllEventsStatement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return allEvents;
    }

    /**
     * @return my Events
     */
    public ArrayList<Event> getMyEvents(Student currentStudent) {
        ArrayList<Event> myEvents = new ArrayList<>();

        try {
            PreparedStatement getMyEventsStatement = getConnection().prepareStatement("SELECT * FROM dsevent WHERE isDeleted = 0 AND owner = ?");
            getMyEventsStatement.setInt(1, currentStudent.getIdStudent());

            resultSet = getMyEventsStatement.executeQuery();
            eventGetter(myEvents);
            resultSet.close();
            getMyEventsStatement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return myEvents;
    }

    //Handles getting events and properly adding them to the resultSet for both getAllEvents and getMyEvents
    private void eventGetter(ArrayList<Event> myEvents) throws SQLException {
        while (resultSet.next()) {
            Event event = new Event();
            event.setIdEvent(resultSet.getInt("idEvent"));
            event.setPrice(resultSet.getInt("price"));
            event.setOwner(resultSet.getInt("owner"));
            event.setEventName(resultSet.getString("eventName"));
            event.setLocation(resultSet.getString("location"));
            event.setDescription(resultSet.getString("description"));
            event.setEventDate(resultSet.getString("eventDate"));
            myEvents.add(event);
        }
    }

    /**
     * @param idEvent
     * @return Attending Students
     * @throws IllegalAccessException
     * @throws SQLException
     */
    public ArrayList<Student> getAttendingStudents(String idEvent) {
        Student student;
        ArrayList<Student> attendingStudents = new ArrayList<>();

        //henter alle studenter der deltager på det valgte event.
        try {
            PreparedStatement getAttendingStudents = getConnection().prepareStatement
                    ("SELECT she.*, e.*, s.* " +
                            "FROM students_has_dsevent she " +
                            "INNER JOIN dsevent e " +
                            "ON she.dsevent_idEvent = e.idEvent " +
                            "INNER JOIN students s " +
                            "ON she.students_idStudent = s.idStudent " +
                            "WHERE e.idEvent = ?");

            getAttendingStudents.setString(1, idEvent);
            resultSet = getAttendingStudents.executeQuery();
            try {
                while (resultSet.next()) {
                    //Opretter ny instans af de studenter der er i ArrayListen. (Måden man henter oplysninger).
                    student = new Student();
                    student.setIdStudent(resultSet.getInt("idStudent"));
                    student.setFirstName(resultSet.getString("firstName"));
                    student.setLastName(resultSet.getString("lastName"));
                    student.setEmail(resultSet.getString("email"));

                    attendingStudents.add(student);

                }
                resultSet.close();
                getAttendingStudents.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (SQLException sqlException) {
            System.out.println(sqlException.getMessage());
        }
        //Returnerer attendingStudents med oplysninger.
        return attendingStudents;
    }

    /**
     * @param eventId
     * @param studentId
     * @return True
     * @throws IllegalArgumentException
     */
    public void joinEvent(int eventId, int studentId) throws IllegalArgumentException {

        try {
            //kalder metoden der tjekker om studenten allerede har tilmeldt sig det pågældende event
            //Statement der sætter studentens id og eventets id sammen i en tabel
            PreparedStatement joinEvent = getConnection().prepareStatement
                    ("INSERT INTO students_has_dsevent (dsevent_idEvent, students_idStudent) VALUE (?, ?)");
            joinEvent.setInt(1, eventId);
            joinEvent.setInt(2, studentId);

            int rowsAffected = joinEvent.executeUpdate();
            if (rowsAffected != 1) {
                return;
            }
            joinEvent.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * @param eventId
     * @param studentId
     * @return True
     * @throws IllegalArgumentException
     */
    public void leaveEvent(int eventId, int studentId) throws IllegalArgumentException {

        try {
            //kalder metoden der tjekker om studenten allerede har tilmeldt sig det pågældende event
            //Statement der sætter studentens id og eventets id sammen i en tabel
            PreparedStatement leaveEvent = getConnection().prepareStatement
                    ("DELETE FROM students_has_dsevent WHERE dsevent_idEvent = ? AND students_idStudent = ?");
            leaveEvent.setInt(1, eventId);
            leaveEvent.setInt(2, studentId);

            int rowsAffected = leaveEvent.executeUpdate();
            if (rowsAffected != 1) {
                return;
            }
            leaveEvent.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Anvendes til at ændre et event. Modtager et idEvent og data om eventet.
    public boolean updateEvent(Event event, Student student) {

        PreparedStatement updateEventStatement = null;
        int currentStudentId = student.getIdStudent();
        try {
            updateEventStatement = getConnection().prepareStatement
                    ("UPDATE dsevent " +
                            "SET eventName = ?, location = ?, price = ?, eventDate = ?, description = ? " +
                            "WHERE idEvent = ? AND owner = ?");
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            updateEventStatement.setString(1, event.getEventName());
            updateEventStatement.setString(2, event.getLocation());
            updateEventStatement.setInt(3, event.getPrice());
            updateEventStatement.setString(4, event.getEventDate());
            updateEventStatement.setString(5, event.getDescription());
            updateEventStatement.setInt(6, event.getIdEvent());
            updateEventStatement.setInt(7, currentStudentId);

            int rowsAffected = updateEventStatement.executeUpdate();
            if (rowsAffected != 1) {
                return false;
            }
            updateEventStatement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return true;

    }

    /**
     * @param event
     * @param student
     * @return True
     * @throws SQLException
     */
    public boolean createEvent(Event event, Student student) throws SQLException {

        PreparedStatement createEventStatement = getConnection().prepareStatement("INSERT INTO dsevent (" +
                "eventName, owner, location, price, description, eventDate) VALUES (" +
                "?, ?, ?, ?, ?, ?)");

        createEventStatement.setString(1, event.getEventName());
        createEventStatement.setInt(2, student.getIdStudent());
        createEventStatement.setString(3, event.getLocation());
        createEventStatement.setInt(4, event.getPrice());
        createEventStatement.setString(5, event.getDescription());
        createEventStatement.setString(6, event.getEventDate());

        int rowsAffected = createEventStatement.executeUpdate();

        if (rowsAffected != 1) {
            throw new SQLException("More or less than 1 row was affected");
        }
        createEventStatement.close();
        return true;
    }

    public boolean deleteEvent(Event event, Student student) throws SQLException {

        PreparedStatement deleteEventStatement = getConnection().prepareStatement
                ("UPDATE dsevent " +
                        "SET isDeleted = 1 " +
                        "WHERE idEvent = ? AND owner = ?;");

        try {
            deleteEventStatement.setInt(1, event.getIdEvent());
            deleteEventStatement.setInt(2, student.getIdStudent());
            try {
                int rowsUpdated = deleteEventStatement.executeUpdate();
                if (rowsUpdated != 1) {
                    throw new SQLException("More or less than 1 row was affected");
                }
                deleteEventStatement.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return true;
    }

}

