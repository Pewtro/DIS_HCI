$(document).ready(() => {

    const welcomeHeader = $("#welcomeHeader");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    welcomeHeader.append(user.nameUser);

    if (user.userIsAdmin === 1) {
        $("#buttons").append(`<button style="margin-right: 20px; margin-top: 5px" class="btn btn-primary pull-right"
        id="adminButton">Admin
            </button>`);
    }

    function updateBasket(productName, productAmount) {
        let eksisterendeVare = false;
        const kurvTabel = $("#kurvTabel");
        kurvTabel.find("tr").each(function () {
            const name = $(this).find("td:eq(1)").text();
            if (name === productName) {
                $(this).find("td:eq(2)").text(productAmount);
                eksisterendeVare = true;
                document.getElementById(name).style.display = "table-row";
            }
        });
        if (!eksisterendeVare) {
            let nyVare = '<tr id="' + productName + '">';
            nyVare += '<td><img src="images/' + productName + '.png" class="kurv-img"></td>';
            nyVare += '<td>' + productName + '</td>';
            nyVare += '<td>' + productAmount + '</td>';
            nyVare += '<td><button class="kioskKnap tilfoejEn" data-id="' + "tilfoej" + $(this).attr("data-id") + '">+</button></td>';
            nyVare += '<td><button class="kioskKnap fjernEn" data-id="' + "fjern" + $(this).attr("data-id") + '"> - </button></td>';
            nyVare += '</tr>';
            kurvTabel.append(nyVare);

            $(".tilfoejEn").on('click', function () {
                const name = $(this).closest('tr').find('td:eq(1)').text();
                if (name === productName) {
                    for (let i = 0; i < 1; i++) {
                        let amount = Number(sessionStorage.getItem(name));
                        amount += 1;
                        sessionStorage.setItem(name, amount);
                        updateBasket(name, amount);
                    }
                }
            });

            $(".fjernEn").on('click', function () {
                const name = $(this).closest('tr').find('td:eq(1)').text();
                if (name === productName) {
                    for (let i = 0; i < 1; i++) {
                        let amount = sessionStorage.getItem(name);
                        amount -= 1;
                        console.log(amount);
                        if (amount === 0) {
                            document.getElementById(name).style.display = "none";
                            sessionStorage.removeItem(name);
                        } else {
                            sessionStorage.setItem(name, amount);
                            updateBasket(name, amount);
                        }

                    }
                }
            });

        }
    }

//lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut();
    });
    $("#adminButton").click(() => {
        window.location.href = "admin.html";
    });

    $("#købKnap").click(() => {
        for (let i = 0; i < sessionStorage.length; i++) {
            const productName = sessionStorage.key(i);
            if (productName !== 'UserRFID' && productName !== 'currentUser') {
                const amountBought = sessionStorage.getItem(productName);
                SDK.Product.finalizePurchase(productName, amountBought, (err, data) => {
                    if (err && err.xhr.status === 401) {
                        throw err;
                    } else {
                        $('#kurvTabel').empty();
                    }
                });
            }
        }
        window.location.href = "kvittering.html";
    });

    const productsTable = $("#productsTable");

    SDK.Product.loadAllActiveProducts((callback, data) => {
        if (callback) {
            throw callback;
        }
        let products = data;

        $.each(products, function (i, callback) {
            let newProduct = '<div class="col-md-4">';
            newProduct += '<input type="image" id="kioskVare" data-id="' + (i + 1) + '" alt="' + products[i].nameProduct + '" width="40" height="100" src="images/' + products[i].nameProduct + '.png">';
            newProduct += '</div>';
            i++;
            productsTable.append(newProduct);
        });

        $("#productsTable").find("div").on('click', function () {
            let name = $(this).find('input').attr("alt");
            //runs through all products until we find the clicked product
            for (let i = 0; i < products.length; i++) {
                if (name === products[i].nameProduct) {
                    let amount = sessionStorage.getItem(name);
                    if (!amount) {
                        amount = 1;
                    } else {
                        amount++;
                    }
                    sessionStorage.setItem(name, amount);
                    updateBasket(name, amount);
                }
            }
        });
    });

});
