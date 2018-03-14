package server.models;

public class Event {

    private int idEvent, price, owner;
    private String eventName, location, eventDate;
    private String description;

    /**
     * @param idEvent
     * @param price
     * @param owner
     * @param eventName
     * @param location
     * @param description
     * @param eventDate
     */
    public Event(int idEvent, int price, int owner, String eventName, String location, String description, String eventDate) {
        this.idEvent = idEvent;
        this.price = price;
        this.owner = owner;
        this.eventName = eventName;
        this.location = location;
        this.description = description;
        this.eventDate = eventDate;
    }

    public Event() {
    }


    public int getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(int idEvent) {
        this.idEvent = idEvent;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOwner(int owner) {
        this.owner = owner;
    }
}
