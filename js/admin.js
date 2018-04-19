$(document).ready(() => {

    const debugLoad = false;
    const debugExcel = false;

    const welcomeHeader = $("#welcomeHeader");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    welcomeHeader.append(user.nameUser);

    let aktiveProdukter = [];
    let aktiveBrugere = null;
    let altKoebt = null;

    SDK.Admin.loadAllProducts((callback, data) => {
        if (callback) {
            throw callback;
        }
        for (let i = 0; i < data.length; i++) {
            const aktivtProdukt = {idProduct: data[i].idProduct, nameProduct: data[i].nameProduct};
            aktiveProdukter.push(aktivtProdukt)
        }

        debugLoad && console.log(aktiveProdukter);
    });
    SDK.Admin.loadEverythingBought((callback, data) => {
        if (callback) {
            throw callback;
        }
        altKoebt = data;
        debugLoad && console.log(altKoebt);
    });
    SDK.Admin.loadAllUsers((callback, data) => {
        if (callback) {
            throw callback;
        }
        aktiveBrugere = data;
        debugLoad && console.log(aktiveBrugere);
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

        let data = [];
        let listeTilSletning = [];

        for (let i = 0; i < aktiveBrugere.length; i++) {
            const userRFID = aktiveBrugere[i].RFIDUser;
            const userName = aktiveBrugere[i].nameUser;
            let existing = data.find(user => user.name === userName);
            let index = data.indexOf(existing);
            if (index === -1) {
                debugExcel && console.log("creating new user entry for ", userName, " with RFID ", userRFID);
                data.push({name: userName, RFID: userRFID});
                existing = data.find(user => user.name === userName);
                index = data.indexOf(existing);
            }
            for (let i = 0; i < altKoebt.length; i++) {
                if (altKoebt[i].RFIDUser === userRFID) {
                    const nameProduct = altKoebt[i].nameProduct;
                    const amountBought = altKoebt[i].amountBought;
                    if (!data[index][nameProduct]) {
                        debugExcel && console.log("creating new product entry for ", nameProduct, " for user named: ", userName);
                        data[index][nameProduct] = amountBought;
                    } else {
                        data[index][nameProduct] += amountBought;
                    }
                    listeTilSletning.unshift(i);
                    if (i === altKoebt.length) {
                        for (let i = 0; i < listeTilSletning.length; i++) {
                            altKoebt.splice(i, 1);
                        }
                    }
                }
            }
        }

        alasql('SELECT * INTO XLSX("kiosk_udtræk.xlsx",{headers:true}) FROM ? ', [data]);

        /** Example data to showcase alasql functionality
         let oldData = [{city: "Minsk", population: 100000}, {city: "Riga", population: 200000}];
         console.log(oldData);
         alasql('SELECT * INTO XLSX("cities.xlsx",{headers:true}) FROM ? ', [oldData]);
         */
    });
//lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut();
    });
    $("#kioskButton").click(() => {
        window.location.href = "kiosk.html";
    });
});