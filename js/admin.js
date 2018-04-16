$(document).ready(() => {

    const debug = true;

    const welcomeHeader = $("#welcomeHeader");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    welcomeHeader.append(user.nameUser);

    let aktiveProdukter = null;
    let aktiveBrugere = null;
    let altKoebt = null;
    SDK.Admin.loadAllProducts((callback, data) => {
        if (callback) {
            throw callback;
        }
        aktiveProdukter = data;
        debug && console.log(aktiveProdukter);
    });
    SDK.Admin.loadEverythingBought((callback, data) => {
        if (callback) {
            throw callback;
        }
        altKoebt = data;
        debug && console.log(altKoebt);
    });
    SDK.Admin.loadAllUsers((callback, data) => {
        if (callback) {
            throw callback;
        }
        aktiveBrugere = data;
        debug && console.log(aktiveBrugere);
    });

    /** Only to be used if the above 3 functions prove too much for the server / browser to handle at large amounts of data

     $("#hentProdukter").click(() => {
        SDK.Admin.loadAllProducts((callback, data) => {
            if (callback) {
                throw callback;
            }
            aktiveProdukter = data;
            console.log(aktiveProdukter);
        });
    });
     $("#hentAltKoebt").click(() => {
        SDK.Admin.loadEverythingBought((callback, data) => {
            if (callback) {
                throw callback;
            }
            altKoebt = data;
            console.log(altKoebt);
        });
    });
     $("#hentBrugere").click(() => {
        SDK.Admin.loadAllUsers((callback, data) => {
            if (callback) {
                throw callback;
            }
            aktiveBrugere = data;
            console.log(aktiveBrugere);
        });
    });*/
    $("#exportExcel").click(() => {

        let data = [{city: "Minsk", population: 100000}, {city: "Riga", population: 200000}];

        alasql('SELECT * INTO XLSX("exceludtræk.xlsx",{headers:true}) FROM ? ', [data]);

    });

    //lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut();
    });
    $("#kioskButton").click(() => {
        window.location.href = "kiosk.html";
    });
});