package server.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import server.providers.StudentTable;
import server.models.Student;
import server.utility.CurrentStudentContext;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.Date;

public class TokenController {

    private StudentTable studentTable = new StudentTable();

    // Metode til at slette en token

    /**
     * @param token
     * @return False
     * @throws SQLException
     */
    public boolean deleteToken(String token) throws SQLException {
        boolean deleteToken = studentTable.deleteToken(token);
        studentTable.close();
        return deleteToken;
    }

    /**
     * @param student
     * @return Either token or null
     */
    public String setToken(Student student) {
        String token = null;
        try {
            Algorithm algorithm = Algorithm.HMAC512("harpoonsurvival");
            long timeValue = (System.currentTimeMillis() * 1000) + 2000125124L;
            Date expDate = new Date(timeValue);

            token = JWT.create().withClaim("User", student.getEmail()).withExpiresAt(expDate).withIssuer("STFU").sign(algorithm);
            studentTable.addToken(token, student.getIdStudent());
            studentTable.close();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        if (token != null) {
            return token;
        } else {
            return null;
        }
    }

    /**
     * @param token
     * @return Context
     */
    public CurrentStudentContext getStudentFromTokens(String token) {
        Student student = studentTable.getStudentFromToken(token);
        CurrentStudentContext context = new CurrentStudentContext();
        context.setCurrentStudent(student);
        studentTable.close();
        return context;
    }

}
