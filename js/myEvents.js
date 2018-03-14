$(document).ready(() => {

    //lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut((err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
        });
        window.location.href = "login.html";
    });

    //the eventTable that we'll be appending information to
    const myEventTable = $("#myEventTable");

    //runs the loadAllMyEvents function
    SDK.Event.loadAllMyEvents((callback, data) => {
        if (callback) {
            throw callback;
        }
        let events = JSON.parse(data);
        //appends each event in a table row, aswell as adding the 3 buttons to each event
        $.each(events, function (i, callback) {
            let tr = '<tr>';
            tr += '<td>' + events[i].idEvent + '</td>';
            tr += '<td>' + events[i].eventName + '</td>';
            tr += '<td>' + events[i].location + '</td>';
            tr += '<td>' + events[i].price + '</td>';
            tr += '<td>' + events[i].eventDate + '</td>';
            tr += '<td>' + events[i].description + '</td>';
            tr += '<td><button id="updateButton" class="btn btn-success update-button" data-id="' + (i + 1) + '">Update event</button></td>';
            tr += '<td><button id="deleteButton" class="btn btn-success delete-button" data-id="' + (i + 1) + '">Delete event</button></td>';
            tr += '<td><button id="attendingStudents" class="btn btn-success viewAttending-button" data-id="' + (i + 1) + '">View attending</button></td>';
            i += 1;
            myEventTable.append(tr);
        });

        //if the update event button is clicked we construct a fake JSON string and set that as our currentEvent
        // in sessionStorage then send the user to the updateEvent html page
        $(".update-button").click(function () {
            let name = $(this).closest("tr").find("td:eq(1)").text();
            for (let i = 0; i < events.length; i++) {
                if (name === events[i].eventName) {
                    let constructJson = "{\"idEvent\":" + events[i].idEvent + ","
                        + "\"eventName\":\"" + events[i].eventName + "\","
                        + "\"location\":\"" + events[i].location + "\","
                        + "\"price\":" + events[i].price + ","
                        + "\"eventDate\":\"" + events[i].eventDate + "\","
                        + "\"description\":\"" + events[i].description + "\"}";
                    sessionStorage.setItem("currentEvent", constructJson);
                    window.location.href = "updateEvent.html";
                }
            }
        });

        //if the user clicks the delete event button, we ask for confirmation and if confirmed we run the deleteEvent function
        //with the associated id of the event
        $(".delete-button").click(function () {
            if (confirm("Are you sure you want to permanently delete this event?")) {
                let name = $(this).closest("tr").find("td:eq(1)").text();
                for (let i = 0; i < events.length; i++) {
                    if (name === events[i].eventName) {
                        SDK.Event.deleteEvent(events[i].idEvent, (err, data) => {
                            if (err) {
                                throw err;
                            } else {
                                alert("Event successfully deleted");
                                location.reload();
                            }
                        });
                    }
                }
            }
        });

        //when the user clicks on view attending we get information about the event and its attendees and append it
        // into two different tables
        $(".viewAttending-button").click(function () {
            let name = $(this).closest("tr").find("td:eq(1)").text();
            for (let i = 0; i < events.length; i++) {
                if (name === events[i].eventName) {
                    const myAttendingStudentsEventTable = $("#attendingStudentsEventsOverlay");
                    let tr = '<tr>';
                    tr += '<td>' + events[i].idEvent + '</td>';
                    tr += '<td>' + events[i].eventName + '</td>';
                    tr += '<td>' + events[i].location + '</td>';
                    tr += '<td>' + events[i].price + '</td>';
                    tr += '<td>' + events[i].eventDate + '</td>';
                    tr += '<td>' + events[i].description + '</td>';
                    myAttendingStudentsEventTable.append(tr);
                    SDK.Event.loadAllAttendingStudents(events[i].idEvent, (err, data) => {
                        const myAttendingStudentsTable = $("#attendingStudentsOverlay");
                        if (err && err.xhr.status === 400) {
                            myAttendingStudentsTable.append("No one is attending this event yet.")
                        } else if (err) {
                            throw err;
                        } else {
                            let students = JSON.parse(data);
                            $.each(students, function (i, callback) {
                                let tr = '<tr>';
                                tr += '<td>' + students[i].firstName + '</td>';
                                tr += '<td>' + students[i].lastName + '</td>';
                                tr += '<td>' + students[i].email + '</td>';
                                i += 1;
                                myAttendingStudentsTable.append(tr);
                            })
                        }
                    })
                }
            }
            document.getElementById("overlay").style.display = "block";
        });
    });
    //turns off the overlay when the user clicks on "close"
    $("#turnOffOverlay").click(() => {
        document.getElementById("overlay").style.display = "none";
        $("#attendingStudentsOverlay").empty();
        $("#attendingStudentsEventsOverlay").empty();
    });
});