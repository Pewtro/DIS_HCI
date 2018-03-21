$(document).ready(() => {

    //lets the user logout
    $("#logoutButton").click(() => {
        SDK.Student.logOut((err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
        });
        window.location.href = "login.html";
    });

    const productsTable = $("#productsTable");

    SDK.Product.loadAllActiveProducts((callback, data) => {
        if (callback) {
            throw callback;
        }
        console.log(data);
        let products = data;

        $.each(products, function (i, callback) {
            let newProduct = '<div class="col-md-6">';
            newProduct += '<img border="0" alt="' + products[i].nameProduct + '" width="50" height="150" src="images/' + products[i].nameProduct + '.png">';
            newProduct += '</div>';
            i++;
            /*const z = i % 2;
            console.log("i er lig ", i, " og z er lig ", z);
            if (z === 0) {
                newProduct += '<div class="col-md-6" >davs</div>';
                newProduct += '<div class="col-md-6">davs</div>';
            }*/
            productsTable.append(newProduct);
        });
    })
});