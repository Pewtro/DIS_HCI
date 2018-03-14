package server.controllers;

import server.exceptions.ResponseException;
import server.models.Event;
import server.models.Student;

import java.sql.SQLException;
import java.util.ArrayList;

import server.providers.EventTable;

/**
 * Created by STFU on 19/10/2017
 */


public class EventController {

    /**
     * EventController-klassen forbinder vores endpoints med vores providers,
     * som sender SQL statements til databasen
     */

    //Controller-klasse for event. Laver kald til databasen.
    //API forbindes med database.
    private EventTable eventTable = new EventTable();

    /**
     * @param idEvent
     * @return Attending Students
     * @throws IllegalAccessException
     * @throws SQLException
     */
    public ArrayList getAttendingStudents(String idEvent) throws IllegalAccessException, SQLException {
        ArrayList attendingStudents = eventTable.getAttendingStudents(idEvent);
        eventTable.close();
        return attendingStudents;
    }

    /**
     * @param eventData
     * @param student
     * @return Create Event
     * @throws SQLException
     */
    public boolean createEvent(Event eventData, Student student) throws SQLException {
        boolean createEvent = eventTable.createEvent(eventData, student);
        eventTable.close();
        return createEvent;
    }

    /**
     * @return All Events
     */
    public ArrayList<Event> getAllEvents() {
        ArrayList getAllEvents = eventTable.getAllEvents();
        eventTable.close();
        return getAllEvents;
    }

    /**
     * @return my Events
     */
    public ArrayList<Event> getMyEvents(Student student) {
        ArrayList getMyEvents = eventTable.getMyEvents(student);
        eventTable.close();
        return getMyEvents;
    }

    /**
     * @param event
     * @param student
     * @return Delete event
     * @throws Exception
     */
    public boolean deleteEvent(Event event, Student student) throws Exception {
        boolean deleteEvent = eventTable.deleteEvent(event, student);
        eventTable.close();
        return deleteEvent;
    }

    /**
     * @param eventId
     * @param studentId
     * @return Join Event
     * @throws ResponseException
     */
    public void joinEvent(int eventId, int studentId) throws ResponseException {
        eventTable.joinEvent(eventId, studentId);
        eventTable.close();
    }

    /**
     * @param eventId
     * @param studentId
     * @return leave Event
     * @throws ResponseException
     */
    public void leaveEvent(int eventId, int studentId) throws ResponseException {
        eventTable.leaveEvent(eventId, studentId);
        eventTable.close();
    }

    /**
     * @param event
     * @param student
     * @return Update Event
     * @throws Exception
     */
    public boolean updateEvent(Event event, Student student) throws Exception {
        boolean updateEvent = eventTable.updateEvent(event, student);
        eventTable.close();
        return updateEvent;

    }
}

