package server.controllers;

import server.models.Student;
import server.providers.StudentTable;

import java.util.ArrayList;

/**
 * Created by STFU on 19/10/2017
 */

public class StudentController {

    /**
     * StudentController klassen forbinder vores endpoints med vores providers,
     * som sender SQL statements videre til databasen
     */


    private StudentTable studentTable = new StudentTable();

    /**
     * @param idStudent
     * @return Attending Events
     * @throws IllegalAccessException
     */
    public ArrayList getAttendingEvents(int idStudent) throws IllegalAccessException {
        ArrayList attendingEvents = studentTable.getAttendingEvents(idStudent);
        studentTable.close();
        return attendingEvents;
    }

//Denne metode bruges til at verificere en student, når brugeren skal oprette sig i Døk Social.

    /**
     * @param firstName
     * @param lastName
     * @param password
     * @param email
     * @param verifyPassword
     * @return Verified Student
     * @throws IllegalArgumentException
     */
    public void verifyStudentCreation(String firstName, String lastName, String password, String email, String verifyPassword) throws IllegalArgumentException {

        // Nedenunder viser at der skal være et "@", når man indtaster sin mail.
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email did not contain @");

            // Dette gør at serveren kræver, at der ikke indgår tal i navnet. og at det indtastet navn indeholder mindst 2 char.
            // ".*\\d.*" --> Tjekker om der er tal i navnet.
        } else if (firstName.length() < 2 || firstName.matches(".*\\d.*")) {
            throw new IllegalArgumentException("firstName must contain at least 2 characters, and can't contain numbers");


            // Dette tjekker det samme som overstående kode, bare med efternavn.
        } else if (lastName.length() < 2 || lastName.matches(".*\\d.*")) {
            throw new IllegalArgumentException("lastName must contain at least 2 characters, and can't contain numbers");


            // Her tjekkes om det indtastede indeholder mindst et bogstav samt mindst et tal.
            // ".*[a-zA->].*" --> Her tjekker koden om det indtastet kode indeholder enten store og små bogstaver.
            // tæller dog ikke æ,ø og å.
        } else if (!password.matches(".*[a-zA-Z].*") || !password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("password must contain at least one char and one number");

        } else if (!password.equals(verifyPassword)) {
            throw new IllegalArgumentException("The two passwords are not equal to each other");
        }

    }
}