package server.models;

public class Student {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private int idStudent;
    private String salt;
    private long createdTime;
    private String verifyPassword;


    //has all student info.

    /**
     * @param idStudent
     * @param firstName
     * @param lastName
     * @param email
     * @param password
     * @param createdTime
     */
    public Student(int idStudent, String firstName, String lastName, String email, String password, long createdTime) {
        this.idStudent = idStudent;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.createdTime = createdTime;
    }

    //used in verifyStudentCreation

    /**
     * @param firstName
     * @param lastName
     * @param password
     * @param verifyPassword
     * @param email
     */
    public Student(String firstName, String lastName, String password, String verifyPassword, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.verifyPassword = verifyPassword;
        this.email = email;
    }

    //used in studentEndpoint

    /**
     * @param email
     * @param salt
     * @param password
     */
    public Student(String email, String salt, String password) {
        this.email = email;
        this.salt = salt;
        this.password = password;
    }

    /**
     * @param email
     * @param password
     */
    public Student(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public Student() {

    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public int getIdStudent() {

        return idStudent;
    }

    public void setIdStudent(int idStudent) {
        this.idStudent = idStudent;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(long createdTime) {
        this.createdTime = createdTime;
    }

    public String getVerifyPassword() {
        return verifyPassword;
    }

}
