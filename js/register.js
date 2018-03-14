$(document).ready(() => {
    //lets the developer debug - see the "debug && console.log()" code lines throughout this class
    const debug = false;

    //used as keys in validateDetails
    const fields = ['newFirstName', 'newLastName', 'newEmail', 'newPassword', 'newPasswordVerify'];

    //when the user clicks the registration button
    $("#registerButton").click(() => {
        //take all the entered information and pass into this array
        let details = [
            {
                newEmail: $("#newEmail").val(),
                newFirstName: $("#newFirstName").val(),
                newLastName: $("#newLastName").val(),
                newPassword: $("#newPassword").val(),
                newPasswordVerify: $("#newPasswordVerify").val(),
            },
        ];

        //used in validateDetails below - checks if the entered string is empty or not
        function isEmpty(str) {
            return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
        }

        //checks if the users entered information isn't blank and that it actually exists
        function validateDetails(array, keys) {
            let errors = 0;
            debug && console.log("array i validateDetails: ", array);
            debug && console.log("keys i validateDetails: ", keys);
            keys.forEach(function (k) {
                if (k in array[0]) {
                    if (isEmpty(array[0][k])) {
                        console.log(k, "is empty");
                        errors += 1;
                    }
                } else {
                    console.log(k, "doesn't exist");
                    errors += 1;
                }
            });
            return errors <= 0;
        }

        debug && console.log("validateDetails result: ", validateDetails(details, fields));

        //if this doesn't return true, then the user didn't fill out all information required
        if (!validateDetails(details, fields)) {
            document.getElementById("emptyError").innerHTML = "Information missing";
        } else {
            //checks if the two passwords entered match
            if (details[0].newPassword.valueOf() !== details[0].newPasswordVerify.valueOf()) {
                $("#newPassword").val('');
                $("#newPasswordVerify").val('');
                document.getElementById("emptyError").innerHTML = "Passwords don't match";
                return;
            }
            //passed all our checks and therefore we run the register function with our entered data
            SDK.Student.register(details[0].newFirstName, details[0].newLastName, details[0].newEmail, details[0].newPassword, details[0].newPasswordVerify, (err, data) => {
                if (err && err.xhr.status === 400) {
                    $(".form-group").addClass("Client fail");
                } else if (err) {
                    console.log("Error");
                } else {
                    window.alert(details[0].newFirstName + " has been registered successfully");
                    window.location.href = "login.html"
                }
            });
        }
    });

    //lets the user go back to the login page if they misclicked
    $("#goBackButton").click(() => {
        window.location.href = "login.html";
    });
});