$(document).ready(() => {

    const welcomeHeader = $("#welcomeHeader");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    welcomeHeader.append(user.nameUser);

    $("#exportExcel").click(() => {

        let data = [{city: "Minsk", population: 100000}, {city: "Riga", population: 200000}];

        alasql('SELECT * INTO XLSX("cities.xlsx",{headers:true}) FROM ? ', [data]);
    });

    //lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut();
    });
    $("#kioskButton").click(() => {
        window.location.href = "kiosk.html";
    });
});