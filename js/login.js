$(document).ready(() => {
    //when the login button is clicked we run this function
    $("#rfidInput").click(() => {

        //sets the two variables with the information given by the user
        let username = $("#rfidInput").val();

        //if either email or password doesn't contain information we tell the user we're missing information
        if (!username) {
            document.getElementById("error").innerHTML = "Information missing - contact an administrator";
        } else {
            //run the login function with the given information
            SDK.Student.login(username, (err, data) => {
                //a 401 is returned if wrong email/password is entered
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("Client fail");
                    document.getElementById("error").innerHTML = "RFID information doesn't match database, contact an administrator";
                } else if (err) {
                    console.log("Error");
                    document.getElementById("error").innerHTML = "Server is acting up, contact an administrator";
                    //if no user is found when logging in despite email/pass is correct (implies server is acting up)
                } else {
                    //we logged in successfully, now go to kiosk
                    window.location.href = "kiosk.html";
                }
            });
        }

    });
});