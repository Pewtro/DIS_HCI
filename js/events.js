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
    //a table we can fill with information
    const myEventTable = $("#myEventTable");

    //calls the function loadAllEvents
    SDK.Event.loadAllEvents((callback, data) => {
        if (callback) {
            throw callback;
        }
        let events = JSON.parse(data);
        //creates a new row for each event and fills it with information
        $.each(events, function (i, callback) {
            let tr = '<tr>';
            tr += '<td>' + events[i].idEvent + '</td>';
            tr += '<td>' + events[i].eventName + '</td>';
            tr += '<td>' + events[i].location + '</td>';
            tr += '<td>' + events[i].price + '</td>';
            tr += '<td>' + events[i].eventDate + '</td>';
            tr += '<td>' + events[i].description + '</td>';
            tr += '<td><button id="attendButton" class="btn btn-success attend-button" data-id="' + (i + 1) + '">Attend event</button></td>';
            tr += '<td><button id="attendingStudents" class="btn btn-success viewAttending-button" data-id="' + (i + 1) + '">View attending</button></td>';
            i += 1;
            //appends each row to the eventTable
            myEventTable.append(tr);
        });

        //lets the user attend specific events
        $(".attend-button").on('click', function () {
            if (confirm("are you sure you want to join this event?\n" +
                    "You can always leave the event again.")) {
                //searches for the clicked event
                let name = $(this).closest("tr").find("td:eq(1)").text();
                //runs through all events until we find the clicked event
                for (let i = 0; i < events.length; i++) {
                    if (name === events[i].eventName) {
                        //runs the  joinEvent function and passes the id of the clicked event along
                        SDK.Event.joinEvent(events[i].idEvent, (err, data) => {
                            if (err) {
                                throw err;
                            } else {
                                alert("You successfully joined the event");
                            }
                        });

                    }
                }
            }
        });
        //lets the user see who is attending the event
        $(".viewAttending-button").click(function () {
            //searches for the clicked event
            let name = $(this).closest("tr").find("td:eq(1)").text();
            //iterates through all events until we find the specific event that was clicked
            for (let i = 0; i < events.length; i++) {
                if (name === events[i].eventName) {
                    //Adds a table row for each event you're viewing (will always be 1)  and appends it to the specific table created in the html
                    const myAttendingStudentsEventTable = $("#attendingStudentsEventsOverlay");
                    let tr = '<tr>';
                    tr += '<td>' + events[i].idEvent + '</td>';
                    tr += '<td>' + events[i].eventName + '</td>';
                    tr += '<td>' + events[i].location + '</td>';
                    tr += '<td>' + events[i].price + '</td>';
                    tr += '<td>' + events[i].eventDate + '</td>';
                    tr += '<td>' + events[i].description + '</td>';
                    myAttendingStudentsEventTable.append(tr);
                    //calls the loadAllAttendingStudents function with the viewed events ID
                    SDK.Event.loadAllAttendingStudents(events[i].idEvent, (err, data) => {
                        if (err) {
                            throw err;
                        } else {
                            //appends each student to the table in the overlay
                            const myAttendingStudentsTable = $("#attendingStudentsOverlay");
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
            //shows the overlay
            document.getElementById("overlay").style.display = "block";
        });
    });
    //when our close button is clicked we hide the overlay and empty the two tables that held information about the events and it's attendees
    $("#turnOffOverlay").click(() => {
        document.getElementById("overlay").style.display = "none";
        $("#attendingStudentsOverlay").empty();
        $("#attendingStudentsEventsOverlay").empty();
    });
});
