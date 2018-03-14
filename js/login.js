$(document).ready(() => {
    //when the login button is clicked we run this function
    $("#loginButton").click(() => {

        //sets the two variables with the information given by the user
        let email = $("#emailInput").val();
        let password = $("#passwordInput").val();

        //if either email or password doesn't contain information we tell the user we're missing information
        if (!email || !password) {
            document.getElementById("error").innerHTML = "Information missing";
        } else {
            //run the login function with the given information
            SDK.Student.login(email, password, (err, data) => {
                //a 401 is returned if wrong email/password is entered
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("Client fail");
                    document.getElementById("error").innerHTML = "Wrong email or password";
                } else if (err) {
                    console.log("Error");
                    //if no user is found when logging in despite email/pass is correct (implies server is acting up)
                } else if (sessionStorage.getItem('token') === null) {
                    $("#passwordInput").val('');
                    document.getElementById("error").innerHTML = "No user found";
                } else {
                    //we logged in successfully, now load the current student
                    SDK.Student.loadCurrentStudent((err, data) => {
                        //this is merely a failsafe - should never happen
                        if (err && err.xhr.status === 401) {
                            $(".form-group").addClass("Client fail");
                            document.getElementById("error").innerHTML = "Wrong username or password";
                        } else if (err && err.xhr.status === 415) {
                            console.log("unsupported media type error");
                        } else if (err) {
                            console.log("general error i loadCurrentUser from login.js");
                            //we successfully logged in and the profile page is shown
                        } else {
                            window.location.href = "profile.html";
                        }
                    });
                }
            });
        }

    });

    //when the register button is clicked we send the user to this page
    $("#registerButton").click(() => {
        window.location.href = "register.html";
    });
});