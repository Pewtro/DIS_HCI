$(document).ready(() => {

    //defines the variables needed in this class
    const welcomeHeader = $("#welcomeHeader");
    const parsedStudent = JSON.parse(sessionStorage.getItem("Student"));
    const firstName = parsedStudent.firstName;
    const lastName = parsedStudent.lastName;

    //appends the first and lastname of the user into our welcomeHeader
    welcomeHeader.append(firstName + " " + lastName + "!");

    //the event table to which we'll be appending all the events the user is attending
    const myEventTable = $("#myEventTable");
    //runs the function which will have all our events
    SDK.Student.loadAllAttendingEvents((callback, data) => {
        //if the server responds with a 400 mesage, it's because we're not attending any events so we append that message to the table
        if (callback && callback.xhr.status === 400) {
            myEventTable.append("You are not attending any events, go join some!")
        } else if (callback) {
            throw callback;
        } else {
            let events = JSON.parse(data);
            //for each event in the data create a table row with the information and a button to
            // leave the event and append it to the table
            $.each(events, function (i, callback) {
                let tr = '<tr>';
                tr += '<td>' + events[i].idEvent + '</td>';
                tr += '<td>' + events[i].eventName + '</td>';
                tr += '<td>' + events[i].location + '</td>';
                tr += '<td>' + events[i].price + '</td>';
                tr += '<td>' + events[i].eventDate + '</td>';
                tr += '<td>' + events[i].description + '</td>';
                tr += '<td><button id="leaveButton" class="btn btn-success leave-button" data-id="' + (i + 1) + '">Leave event</button></td>';
                i += 1;
                myEventTable.append(tr);
            });

            //if the user clicks on the leave button, ask for confirmation and then leave the event
            $(".leave-button").on('click', function () {
                if (confirm("are you sure you want to leave this event?\n" +
                        "You can always rejoin the event again.")) {
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
                            SDK.Event.leaveEvent(events[i].idEvent, (err, data) => {
                                if (err) {
                                    throw err;
                                } else {
                                    alert("You successfully left the event");
                                    location.reload();
                                }
                            });

                        }
                    }
                }
            });
        }
    });

    //lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut((err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
        });
        window.location.href = "login.html";
    });

});