package server.exceptions;

public class ResponseException extends Exception {

    /**
     * @param message
     */
    public ResponseException(String message) {
        super(message);
    }

    private int status;

    /**
     * @return Status
     */
    public int getStatus() {
        return status;
    }

    /**
     * @param status
     * @return This status
     */
    public ResponseException setStatus(int status) {
        this.status = status;
        return this;
    }
}
