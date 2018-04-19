$(document).ready(() => {

    const debugLoad = false;
    const debugExcel = false;
    const debugPrice = false;
    const showcaseData = false;

    const welcomeHeader = $("#welcomeHeader");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    welcomeHeader.append(user.nameUser);

    let alleProdukter = [];
    let alleBrugere = null;
    let altKoebt = null;

    SDK.Admin.loadAllProducts((callback, data) => {
        if (callback) {
            throw callback;
        }
        for (let i = 0; i < data.length; i++) {
            const aktivtProdukt = {
                idProduct: data[i].idProduct,
                nameProduct: data[i].nameProduct,
                priceProduct: data[i].priceProduct
            };
            alleProdukter.push(aktivtProdukt)
        }

        debugLoad && console.log(alleProdukter);
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
        alleBrugere = data;
        debugLoad && console.log(alleBrugere);
    });

    /** Only to be used if the above 3 functions prove too much for the server / browser to handle at large amounts of data

     $("#hentProdukter").click(() => {
        SDK.Admin.loadAllProducts((callback, data) => {
            if (callback) {
                throw callback;
            }
            alleProdukter = data;
            console.log(alleProdukter);
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
            alleBrugere = data;
            console.log(alleBrugere);
        });
    });*/

    $("#exportExcel").click(() => {

        let data = [];
        let listeTilSletning = [];

        //create an empty field
        data.push({name: '', RFID: '', 'Total price': ''});

        //creates headers each individual product with empty fields, to ensure they're all added into the excel export
        for (let i = 0; i < alleProdukter.length; i++) {
            data[0][alleProdukter[i].nameProduct] = '';
        }

        //for each user add all their bought products together in the json format required for alasql
        for (let i = 0; i < alleBrugere.length; i++) {
            const userRFID = alleBrugere[i].RFIDUser;
            const userName = alleBrugere[i].nameUser;
            let index = data.indexOf(data.find(user => user.name === userName));
            if (index === -1) {
                debugExcel && console.log("creating new user entry for ", userName, " with RFID ", userRFID);
                data.push({name: userName, RFID: userRFID});
                index = data.indexOf(data.find(user => user.name === userName));
            }
            for (let i = 0; i < altKoebt.length; i++) {
                if (altKoebt[i].RFIDUser === userRFID) {
                    const nameProduct = altKoebt[i].nameProduct;
                    const amountBought = altKoebt[i].amountBought;

                    const indexProduct = alleProdukter.indexOf(alleProdukter.find(product => product.nameProduct === nameProduct));
                    if (!data[index]['Total price']) {
                        debugPrice && console.log("Creating new price entry for ", nameProduct, " for user named: ", userName);
                        data[index]['Total price'] = amountBought * alleProdukter[indexProduct].priceProduct;

                    } else {
                        data[index]['Total price'] += amountBought * alleProdukter[indexProduct].priceProduct;
                    }
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

        //possibility to showcase the data to check if necessary
        showcaseData && console.log(data);

        //utilize alasql to download a XLSX file
        alasql('SELECT * INTO XLSX("kiosk_udtræk.xlsx",{headers:true}) FROM ? ', [data]);

    });

    //lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut();
    });

    //lets the admin go back to the kiosk and act as a regular user
    $("#kioskButton").click(() => {
        window.location.href = "kiosk.html";
    });

    /**
     * These three buttons should open a modal that allows adding products, updating active products, and adding users.
     */
    $("#redigerProdukter").click(() => {
    });
    $("#tilfoejBruger").click(() => {
    });
    $("#tilfoejProdukt").click(() => {
        //Look at this if you need to upload files for the individual product
        //https://stackoverflow.com/questions/3509333/how-to-upload-save-files-with-desired-name
    });
});