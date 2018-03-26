$(document).ready(() => {

    function updateBasket(productName, productAmount) {
        let eksisterendeVare = false;
        const kurvTabel = $("#kurvTabel");
        kurvTabel.find("tr").each(function () {
            const name = $(this).find("td:eq(1)").text();
            if (name === productName) {
                let currentAmount = $(this).find("td:eq(2)").text();
                let newAmount = Number(currentAmount) + 1;
                $(this).find("td:eq(2)").text(newAmount);
                eksisterendeVare = true;
            }
        });
        if (!eksisterendeVare) {
            let nyVare = '<tr id="' + productName + '">';
            nyVare += '<td><img src="images/' + productName + '.png" class="kurv-img"></td>';
            nyVare += '<td>' + productName + '</td>';
            nyVare += '<td>' + productAmount + '</td>';
            nyVare += '<td><button class="remove-basket-button" id="removeKnap" data-id="' + productName + '">Remove</button></td>';
            nyVare += '</tr>';
            kurvTabel.append(nyVare);

            $(".remove-basket-button").on('click', function () {
                const name = $(this).closest('tr').find('td:eq(1)').text();
                if (name === productName) {
                    for (let i = 0; i < 1; i++) {
                        sessionStorage.removeItem(name);
                        $(this).closest("tr").remove();
                    }
                }
            })
        }
    }

    //lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut((err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
        });
        window.location.href = "login.html";
    });

    $("#købKnap").click(() => {
        for (let i = 0; i < sessionStorage.length; i++) {
            if (sessionStorage.key(i) !== 'User') {
                const productName = sessionStorage.key(i);
                const amountBought = sessionStorage.getItem(productName);
                SDK.Product.finalizePurchase(productName, amountBought, (err, data) => {
                    if (err && err.xhr.status === 401) {
                        throw err;
                    } else {
                        console.log("buy success");
                        sessionStorage.removeItem(productName);
                        $('#kurvTabel').empty();
                    }
                });
            }
        }
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