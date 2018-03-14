package server.utility;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Authenticator {

    private static MessageDigest authenticator;

    public Authenticator() {
    }

    static {
        try {
            authenticator = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    /**
     * @param password
     * @param salt
     * @return Password + Salt
     */
    public static String hashWithSalt(String password, String salt) {
        salt = performHashing(salt);
        return Authenticator.performHashing(password + salt);

    }

    //Taget fra jespers project secure-dis. Link: https://github.com/Distribuerede-Systemer-2017/secure-dis

    /**
     * @param str
     * @return
     */
    private static String performHashing(String str) {
        authenticator.update(str.getBytes());
        byte[] hash = authenticator.digest();
        StringBuilder hexString = new StringBuilder();
        for (byte aHash : hash) {
            if ((0xff & aHash) < 0x10) {
                hexString.append("0").append(Integer.toHexString((0xFF & aHash)));
            } else {
                hexString.append(Integer.toHexString(0xFF & aHash));
            }
        }
        return hexString.toString();
    }
}
