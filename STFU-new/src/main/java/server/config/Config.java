package server.config;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.*;

public final class Config {
    private static String dbUrl;
    private static Integer dbPort;
    private static String dbName;
    private static String dbUser;
    private static String dbPassword;
    private static boolean encryption;

    public void initConfig() throws IOException {

        JsonObject json = new JsonObject();

        //File is loaded into Inputstream
        //config.java is opended and read
        //Bufferedreader reads through the stream
        InputStream input = this.getClass().getClassLoader().getResourceAsStream("/config.json");
        BufferedReader reader = new BufferedReader(new InputStreamReader(input));

        //Stringbuffer is being used to merge the whole file into one String
        StringBuffer stringBuffer = new StringBuffer();
        String str = "";

        //The file is being read one line at the time and is loaded into the Stringbuffer
        while ((str = reader.readLine()) != null) {
            stringBuffer.append(str);
        }
        JsonParser parser = new JsonParser();

        json = (JsonObject) parser.parse(stringBuffer.toString());


        setDbUrl(json.get("dbUrl").toString().replace("\"", ""));
        setDbPort(Integer.parseInt(json.get("dbPort").toString().replace("\"", "")));
        setDbName(json.get("dbName").toString().replace("\"", ""));
        setDbUser(json.get("dbUser").toString().replace("\"", ""));
        setDbPassword(json.get("dbPassword").toString().replace("\"", ""));
        setEncryption(json.get("encryption").getAsBoolean());
    }

    public static String getDbUrl() {
        return dbUrl;
    }

    private static void setDbUrl(String dbUrl) {
        Config.dbUrl = dbUrl;
    }

    public static Integer getDbPort() {
        return dbPort;
    }

    private static void setDbPort(Integer dbPort) {
        Config.dbPort = dbPort;
    }

    public static String getDbName() {
        return dbName;
    }

    private static void setDbName(String dbName) {
        Config.dbName = dbName;
    }

    public static String getDbUser() {
        return dbUser;
    }

    private static void setDbUser(String dbUser) {
        Config.dbUser = dbUser;
    }

    public static String getDbPassword() {
        return dbPassword;
    }

    private static void setDbPassword(String dbPassword) {
        Config.dbPassword = dbPassword;
    }

    public static boolean getEncryption() {
        return encryption;
    }

    private static void setEncryption(boolean encryption) {
        Config.encryption = encryption;
    }

}
